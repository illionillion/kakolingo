import type { RowDataPacket } from 'mysql2';
import mysql_connection from '../db';
import { randomBytes } from 'crypto';

/**
 * アクセストークンの保存
 * @param token
 * @param userId
 * @param expiryDate
 */
const saveAccessTokenToDatabase = async (
  token: string,
  userId: number,
  expiryDate: Date
) => {
  let connection;
  try {
    connection = await mysql_connection();
    const formattedExpiryDate = expiryDate.toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    });
    const query =
      'INSERT INTO access_tokens (token, user_id, expiry_date, is_active) VALUES (?, ?, ?, 1)';
    await connection.execute(query, [token, userId, formattedExpiryDate]);
  } catch (error) {
    console.error('Failed to save access token to database:', error);
    throw error;
  } finally {
    if (connection) connection.destroy();
  }
};

/**
 * ユーザーIDでアクセストークンの取得
 * @param userId
 * @returns
 */
const getAccessTokenByUserId = async (
  userId: number
): Promise<string | null> => {
  let connection;
  try {
    connection = await mysql_connection();
    const query =
      'SELECT token FROM access_tokens WHERE user_id = ? AND expiry_date > NOW() AND is_active = 1';
    const [result] = (await connection.execute(query, [
      userId,
    ])) as RowDataPacket[];

    if (result.length > 0) {
      return result[0].token;
    }

    return null;
  } catch (error) {
    console.error('Failed to get access token:', error);
    throw error;
  } finally {
    if (connection) connection.destroy();
  }
};

/**
 * アクセストークンが有効かどうか
 * @param userId
 * @param token
 * @returns
 */
export const verifyAccessToken = async (
  userId: number,
  token: string
): Promise<boolean> => {
  let connection;
  try {
    connection = await mysql_connection();
    const query =
      'SELECT token FROM access_tokens WHERE user_id = ? AND expiry_date > NOW() AND is_active = 1';
    const [result] = (await connection.execute(query, [
      userId,
    ])) as RowDataPacket[];

    if (result.length > 0) {
      const storedToken = result[0].token;
      return storedToken === token;
    }

    return false; // ユーザーIDに対応するトークンが見つからない場合も失敗とする
  } catch (error) {
    console.error('Error verifying access token:', error);
    return false;
  } finally {
    if (connection) connection.destroy();
  }
};

/**
 * アクセストークンの発行
 * @param userId
 * @returns
 */
export const issueAccessToken = async (userId: number): Promise<string> => {
  // 既存のアクセストークンを取得
  const existingToken = await getAccessTokenByUserId(userId);

  if (existingToken) {
    // 既存のアクセストークンが存在する場合はそれを再利用
    return existingToken;
  }

  // 既存のアクセストークンがない場合は新しいアクセストークンを発行
  const accessToken = generateSecureRandomString();
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1); // 1時間後に有効期限が切れると仮定

  // データベースにアクセストークンを保存
  await saveAccessTokenToDatabase(accessToken, userId, expiryDate);

  return accessToken;
};

/**
 * トークンの無効化
 * @param userId
 * @param token
 * @returns
 */
export const deactivateAccessToken = async (userId: string, token: string) => {
  let connection;
  try {
    connection = await mysql_connection();
    const query =
      'UPDATE access_tokens SET is_active = 0 WHERE user_id = ? AND token = ? AND expiry_date > NOW() AND is_active = 1';
    const [result] = (await connection.execute(query, [
      userId,
      token,
    ])) as RowDataPacket[];

    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deactivateAccessToken:', error);
    return false;
  } finally {
    if (connection) connection.destroy();
  }
};

/**
 * ランダム文字列生成
 * @param length
 * @returns
 */
export const generateSecureRandomString = (length: number = 32) => {
  // バイト単位のランダムなデータを生成
  const randomBytesData = randomBytes(Math.ceil(length / 2));

  // バイトデータを16進数文字列に変換
  const token = randomBytesData.toString('hex').slice(0, length);

  return token;
};

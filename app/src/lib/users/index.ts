import type { RowDataPacket } from 'mysql2';
import mysql_connection from '../db';

export const getUser = async (userName: string) => {
  let connection;
  try {
    connection = await mysql_connection();
    const query =
      'select user_id, user_name, display_name, test_day from users where user_name = ?';
    const [result] = (await connection.execute(query, [
      userName,
    ])) as RowDataPacket[];
    if (result.length === 0) {
      return undefined;
    }
    const user = {
      userId: result[0]?.user_id as number,
      userName: result[0]?.user_name as string,
      displayName: result[0]?.display_name as string,
      testDay: result[0]?.test_day as string,
    };
    return user;
  } catch (error) {
    console.error('getUser error:', error);
    return undefined;
  } finally {
    if (connection) connection.destroy();
  }
};

export const updateUser = async (userId: number, displayName: string, testDay: string) => {
  let connection;
  try {
    connection = await mysql_connection();
    
    // クエリ内でSTR_TO_DATE関数を使用して日付を変換
    const query = `
      UPDATE users
      SET display_name = ?,
          test_day = IF(? IS NOT NULL, STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.%fZ'), NULL)
      WHERE user_id = ?
    `;
    const [result] = (await connection.execute(query, [displayName, testDay, testDay, userId])) as RowDataPacket[];
    
    if (result.affectedRows === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('updateUser error:', error);
    return false;
  } finally {
    if (connection) connection.destroy();
  }
};

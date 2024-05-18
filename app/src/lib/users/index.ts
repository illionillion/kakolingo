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

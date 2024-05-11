import type { RowDataPacket } from 'mysql2';
import mysql_connection from '../db';

export const getRanking = async () => {
  let connection;

  try {
    connection = await mysql_connection();
    const query = `
SELECT
  u.user_id, u.user_name, u.display_name, COALESCE(SUM(ac.count), 0) AS total_count
FROM 
  users u LEFT JOIN answer_count ac ON u.user_id = ac.user_id
  AND DATE(ac.issue_date) BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL WEEKDAY(CURRENT_DATE()) DAY)
  AND DATE_ADD(CURRENT_DATE(), INTERVAL 6 - WEEKDAY(CURRENT_DATE()) DAY)
GROUP BY u.user_id
ORDER BY total_count DESC;`;
    const [result] = (await connection.execute(query)) as RowDataPacket[];
    const ranking = (result as {
      user_id: number;
      user_name: string;
      display_name: string;
      total_count: number;
    }[]).map(v => ({
      userId: v.user_id,
      userName: v.user_name,
      displayName: v.display_name,
      totalCount: v.total_count
    }));
    return ranking;
  } catch (error) {
    console.error('getRanking error:', error);
    return [];
  } finally {
    if (connection) connection.destroy();
  }
};

export const insertAnswerCount = async (userId: number, count: number) => {
  let connection;

  try {
    connection = await mysql_connection();
    const query = 'INSERT INTO answer_count (user_id, count) VALUES (?, ?)';
    await connection.execute(query, [userId, count]);
    return true;
  } catch (error) {
    console.error('insertAnswerCount error:', error);
    return false;
  } finally {
    if (connection) connection.destroy();
  }
};

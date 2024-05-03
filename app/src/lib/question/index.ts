import type { RowDataPacket } from 'mysql2';
import mysql_connection from '../db';

export const getQuestionsYears = async () => {
  let connection;
  try {
    connection = await mysql_connection();
    const query = `SELECT 
      pqy.question_year_id, 
      pqy.created_year_jp, 
      pqy.created_year, 
      pqy.season, 
      COUNT(pq.question_id) AS past_questions_count
  FROM 
      past_questions_years pqy
  LEFT JOIN 
      past_questions pq ON pqy.question_year_id = pq.question_year_id
  GROUP BY 
      pqy.question_year_id, 
      pqy.created_year_jp, 
      pqy.created_year, 
      pqy.season;
  `;
    const [result] = (await connection.execute(query)) as RowDataPacket[];
    const questionsYears = (
      result as {
        question_year_id: number;
        created_year_jp: string;
        created_year: number;
        season: string;
        past_questions_count: number;
      }[]
    ).map((questionYear) => ({
      questionYearId: questionYear.question_year_id,
      createdYearJp: questionYear.created_year_jp,
      createdYear: questionYear.created_year,
      season: questionYear.season,
      questionsCount: questionYear.past_questions_count
    }));

    return questionsYears;
  } catch (error) {
    console.error('GetQuestionsYears error:', error);
    return [];
  } finally {
    if (connection) connection.destroy();
  }
};

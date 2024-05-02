import type { RowDataPacket } from 'mysql2';
import mysql_connection from '../db';

export const getQuestionsYears = async () => {
  let connection;
  try {
    connection = await mysql_connection();
    const query =
      'SELECT question_year_id, created_year_jp, created_year, season FROM past_questions_years';
    const [result] = (await connection.execute(query)) as RowDataPacket[];
    const questionsYears =  (
      result as {
        question_year_id: number;
        created_year_jp: string;
        created_year: number;
        season: string;
      }[]
    ).map((questionYear) => ({
      questionYearId: questionYear.question_year_id,
      createdYearJp: questionYear.created_year_jp,
      createdYear: questionYear.created_year,
      season: questionYear.season,
    }));

    return questionsYears;
  } catch (error) {
    console.error('GetQuestionsYears error:', error);
    return [];
  } finally {
    if (connection) connection.destroy();
  }
};

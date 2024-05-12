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
      questionsCount: questionYear.past_questions_count,
    }));

    return questionsYears;
  } catch (error) {
    console.error('GetQuestionsYears error:', error);
    return [];
  } finally {
    if (connection) connection.destroy();
  }
};

export const getQuestions = async (
  years: string[],
  type: string,
  limit: number,
) => {
  let connection;
  try {
    connection = await mysql_connection();
    let query = `SELECT 
      question_id,
      question_content,
      question_genre,
      question_number,
      question_url,
      question_year_id,
      correct_option_key
  FROM 
    past_questions
  WHERE question_year_id IN (`;
    years.forEach((_, i) => {
      query += i === years.length - 1 ? '?) ' : '?, ';
    });
    if (type === 'random') {
      query += 'ORDER BY RAND()';
    }

    const [result] = (await connection.execute(
      query,
      years,
    )) as RowDataPacket[];

    const questions = await Promise.all(
      (
        result as {
          question_id: number;
          question_content: string;
          question_genre: string;
          question_number: number;
          question_url: string;
          question_year_id: number;
          correct_option_key: string;
        }[]
      ).map(async (question) => ({
        questionId: question.question_id,
        questionContent: question.question_content,
        questionGenre: question.question_genre,
        questionNumber: question.question_number,
        questionUrl: question.question_url,
        questionYearId: question.question_year_id,
        correctOptionKey: question.correct_option_key,
        options: await getOptions(question.question_id),
      })),
    );

    return limit > 0 ? questions.slice(0, limit) : questions;
  } catch (error) {
    console.error('GetQuestions error:', error);
    return [];
  } finally {
    if (connection) connection.destroy();
  }
};

export const getQuestion = async (
  questionId: number
) => {
  let connection;
  try {
    connection = await mysql_connection();
    const query = `SELECT 
      question_id,
      question_content,
      question_genre,
      question_number,
      question_url,
      question_year_id,
      correct_option_key
  FROM 
    past_questions
  WHERE question_id = ?`;

    const [result] = (await connection.execute(
      query,
      [questionId]
    )) as RowDataPacket[];

    const question = {
      ...(result as {
        question_id: number;
        question_content: string;
        question_genre: string;
        question_number: number;
        question_url: string;
        question_year_id: number;
        correct_option_key: string;
      }[])[0],
      options: await getOptions(questionId),
    };
    
    return question;
  } catch (error) {
    console.error('GetQuestions error:', error);
    return undefined;
  } finally {
    if (connection) connection.destroy();
  }
};

export const getOptions = async (questionId: number) => {
  let connection;
  try {
    connection = await mysql_connection();
    const query = `SELECT 
    option_id,
    option_content,
    option_key,
    question_id
  FROM 
    question_options
  WHERE
    question_id = ?`;
    const [result] = (await connection.execute(query, [
      questionId,
    ])) as RowDataPacket[];
    const options = (
      result as {
        option_id: number;
        option_content: string;
        option_key: string;
        question_id: number;
      }[]
    ).map((option) => ({
      optionId: option.option_id,
      optionContent: option.option_content,
      optionKey: option.option_key,
      questionId: option.question_id,
    }));

    return options;
  } catch (error) {
    console.error('GetOptions error', error);

    return [];
  } finally {
    if (connection) connection.destroy();
  }
};

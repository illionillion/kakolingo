import mysql_connection from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { issueAccessToken } from '@/lib/token';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * サインアップ
 * @param request
 */
export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { userName, displayName, userEmail, password } = body as {
    userName: string;
    displayName: string;
    userEmail: string;
    password: string;
  };

  if (!userName || !displayName || !userEmail || !password) {
    return NextResponse.json(
      { error: '必要な情報が不足しています。' },
      { status: 400 }
    );
  }

  let connection;

  try {
    connection = await mysql_connection();
    const query =
      'INSERT INTO users (user_name, display_name, user_email, password) VALUES (?, ?, ?, ?)';
    const [result] = await connection.execute(query, [
      userName,
      displayName,
      userEmail,
      hashPassword(password),
    ]);
    const userId = (result as any).insertId as string;
    const accessToken = await issueAccessToken(parseInt(userId));
    return NextResponse.json(
      {
        message: 'ユーザーが正常に登録されました。',
        userId: userId,
        userName: body.userName,
        accessToken: accessToken
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました。' },
      {
        status: 500,
      }
    );
  } finally {
    if (connection) connection.destroy();
  }
};

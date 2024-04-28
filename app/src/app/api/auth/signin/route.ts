import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';
import mysql_connection from '@/lib/db';
import { comparePassword } from '@/lib/password';
import { issueAccessToken } from '@/lib/token';

/**
 * ログイン
 * @param request
 * @returns
 */
export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { userName, password } = body as { userName: string; password: string };

  if (!userName || !password) {
    return NextResponse.json(
      { message: '必要な情報が不足しています。' },
      {
        status: 400,
      }
    );
  }

  let connection;
  try {
    connection = await mysql_connection();
    const query =
      'SELECT user_id, user_name, password FROM users WHERE user_name = ?';
    const [result] = (await connection.execute(query, [
      body.userName,
    ])) as RowDataPacket[];

    if (result.length > 0) {
      const user = result[0];
      const passwordMatch = comparePassword(body.password, user.password);

      if (passwordMatch) {
        // パスワードが一致した場合、アクセストークンを発行
        const accessToken = await issueAccessToken(user.user_id);

        return NextResponse.json(
          {
            message: 'ログインに成功しました。',
            userId: user.user_id,
            userName: user.user_name,
          },
          {
            status: 200,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } else {
        return NextResponse.json(
          {
            message: 'パスワードが正しくありません。',
          },
          {
            status: 401,
          }
        );
      }
    }

    return NextResponse.json(
      {
        message: 'ユーザー名が正しくありません。',
      },
      {
        status: 404,
      }
    );
  } catch (error) {
    console.error('Signin error:', error);
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

import { getRanking, insertAnswerCount } from '@/lib/ranking';
import { verifyAccessToken } from '@/lib/token';
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const data = await getRanking();
  return NextResponse.json(
    {
      data: data,
      total: data.length,
    },
    {
      status: 200,
    },
  );
};

export const POST = async (request: NextRequest) => {
  const token = request.headers.get('Authorization');
  const body = await request.json();

  const { userId, count } = body;

  if (!userId || !count || !token) {
    return NextResponse.json(
      { message: '必要な情報が不足しています。' },
      {
        status: 400,
      },
    );
  }

  const accessToken = token.replace('Bearer ', '').trim();

  // アクセストークンの検証
  const authenticated = await verifyAccessToken(userId, accessToken);

  if (authenticated) {
    const isSuccess = insertAnswerCount(userId, count);
    if (!isSuccess) {
      return NextResponse.json(
        { message: 'エラー' },
        {
          status: 500,
        },
      );
    }
    return NextResponse.json(
      { message: '更新成功' },
      {
        status: 200,
      },
    );
  } else {
    return NextResponse.json(
      { message: '不正なアクセストークンです。' },
      {
        status: 401,
      },
    );
  }
};

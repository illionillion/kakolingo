import { verifyAccessToken } from '@/lib/token';
import { getUser, updateUser } from '@/lib/users';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const GET = async (
  _: NextRequest,
  { params }: { params: { user_name: string } },
) => {
  const { user_name } = params;
  if (!user_name) {
    return NextResponse.json(
      {
        message: '値が不正です。',
      },
      {
        status: 400,
      },
    );
  }
  const user = await getUser(user_name);

  if (!user) {
    return NextResponse.json(
      {
        message: 'ユーザーが見つかりません',
      },
      {
        status: 404,
      },
    );
  }
  return NextResponse.json({
    data: user,
  });
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { user_name: string } },
) => {
  const token = request.headers.get('Authorization');
  const body = await request.json();
  const { user_name: userName } = params;

  const { userId, displayName, testDay } = body;

  if (!userId || !userName || !displayName || !token) {
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

  if (!authenticated) {
    return NextResponse.json(
      { message: '不正なアクセストークンです。' },
      {
        status: 401,
      },
    );
  }

  const isSuccess = await updateUser(userId, displayName, testDay);
  if (!isSuccess) {
    return NextResponse.json(
      { message: '更新に失敗しました。' },
      {
        status: 500,
      },
    );
  }
  return NextResponse.json(
    {
      message: '更新成功',
    },
    {
      status: 200,
    },
  );
};

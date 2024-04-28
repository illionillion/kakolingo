import { deactivateAccessToken } from '@/lib/token';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * サインアウト
 * @param request
 * @returns
 */
export const POST = async (request: NextRequest) => {
  const token = request.headers.get('Authorization');
  const { userId } = await request.json();

  if (!userId || !token) {
    return NextResponse.json(
      { message: '必要な情報が不足しています。' },
      {
        status: 400,
      }
    );
  }
  const accessToken = token.replace('Bearer ', '').trim();
  // トークンの無効化
  const success = await deactivateAccessToken(userId, accessToken);
  if (success) {
    return NextResponse.json(
      {
        message: 'トークンが正常に無効化されました。',
      },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      {
        message: 'トークンの無効化に失敗しました。',
      },
      { status: 400 }
    );
  }
};

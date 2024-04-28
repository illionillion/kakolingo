import { verifyAccessToken } from '@/lib/token';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * トークンの検証
 * @param request
 */
export const POST = async (request: NextRequest) => {
  const token = request.headers.get('Authorization');
  const body = await request.json();

  const { userId } = body;

  if (!userId || !token) {
    return NextResponse.json(
      { message: '必要な情報が不足しています。' },
      {
        status: 400,
      }
    );
  }

  const accessToken = token.replace('Bearer ', '').trim();

  // アクセストークンの検証
  const authenticated = await verifyAccessToken(userId, accessToken);

  if (authenticated) {
    return NextResponse.json(
      { authenticated: true, message: '有効なアクセストークンです。' },
      {
        status: 200,
      }
    );
  } else {
    return NextResponse.json(
      { authenticated: false, message: '不正なアクセストークンです。' },
      {
        status: 401,
      }
    );
  }
};

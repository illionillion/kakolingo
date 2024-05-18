import { getUser } from '@/lib/users';
import type { NextRequest} from 'next/server';
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
        status: 404
      },
    );
  }
  return NextResponse.json({
    data: user,
  });
};

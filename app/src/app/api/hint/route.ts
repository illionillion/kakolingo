import { generateHint } from '@/lib/hint';
import { getQuestion } from '@/lib/question';
import { verifyAccessToken } from '@/lib/token';
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const token = request.headers.get('Authorization');
  const body = await request.json();

  const { userId, questionId } = body;

  if (!userId || !questionId || !token) {
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
    return NextResponse.json({message: '認証に失敗しました。'}, {status: 401});
  }

  const question = await getQuestion(questionId);
  console.log(question);
  
  // ヒント生成
  const hint = await generateHint(question);

  return NextResponse.json({
    hint: hint
  },{
    status: 200
  });
};

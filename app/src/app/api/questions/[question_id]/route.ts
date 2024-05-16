import { getQuestion } from '@/lib/question';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const GET = async (
  _: NextRequest,
  { params }: { params: { question_id: number } },
) => {
  const { question_id } = params;
  if (!question_id) {
    return NextResponse.json(
      {
        message: '値が不正です。',
      },
      {
        status: 400,
      },
    );
  }

  const question = await getQuestion(question_id);

  return NextResponse.json({
    data: question,
  });
};

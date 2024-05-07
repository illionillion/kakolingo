import { getOptions } from '@/lib/question';
import { NextRequest, NextResponse } from 'next/server';

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

  const options = await getOptions(question_id);

  return NextResponse.json({
    data: options,
    total: options.length,
  });
};

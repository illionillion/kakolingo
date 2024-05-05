import { getQuestions } from '@/lib/question';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { years, type, limit } = body as {
    years: string[];
    type: string;
    limit: string;
  };
  const data = await getQuestions(
    years,
    type,
    isNaN(parseInt(limit)) ? 0 : parseInt(limit),
  );
  return NextResponse.json(
    {
      total: data.length,
      questions: data,
    },
    {
      status: 200,
    },
  );
};

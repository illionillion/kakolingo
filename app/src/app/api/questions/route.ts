import { getQuestions } from '@/lib/question';
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { years, type } = body as { years: string[]; type: string; length: string };
  const data = await getQuestions(years, type);
  return NextResponse.json({
    questions: data
  }, {
    status: 200
  });
};
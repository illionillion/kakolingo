import { getQuestions } from "@/lib/question"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {
    const body = await request.json();
    const { years } = body as { years: string[]; type: string; length: string };
    const data = await getQuestions(years);
    return NextResponse.json({
        questions: data
    }, {
        status: 200
    })
}
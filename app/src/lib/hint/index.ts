import type { getQuestion } from '../question';

export const generateHint = async (
  question: Awaited<ReturnType<typeof getQuestion>>,
) => {
  try {
    // process.env.API_KEYを使ってChatGPTにプロンプトを投げる
    const apiKey = process.env.API_KEY;
    if (!question || !apiKey) return '生成に失敗しました';

    // プロンプト
    const prompt = `
以下の問題のヒントを答えがバレない範囲で生成しなさい

問題
${question.question_content}

選択肢
${question.options.map((option) => `${option.optionKey}: ${option.optionContent}`).join('\n')}

正解
${question.correct_option_key}
        `;
    console.log(prompt);

    // ヒントを生成
    const request = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
        ],
      }),
    });
    const response = await request.json();

    if (response && response.choices && response.choices.length > 0) {
      return response.choices[0].message.content as string;
    } else {
      return 'ヒントの生成に失敗しました';
    }
  } catch (error) {
    console.error('GenerateHint error:', error);

    return '生成に失敗しました';
  }
};

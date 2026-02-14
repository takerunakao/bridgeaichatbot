import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Vercel Serverless Function の最大実行時間（秒）
// Hobby: 最大60s / Pro: 最大300s
export const maxDuration = 60;

export async function POST(req: Request) {
    const { messages, model } = await req.json();

    const result = await streamText({
        model: openai(model || 'gpt-5.2'),
        system: `あなたは「AI Chatbot -Bridge to Practice Challenge-」という名前の親切で知識豊富なAIアシスタントです。
ユーザーの質問に丁寧かつ正確に回答してください。
必要に応じてマークダウン形式（コードブロック、リスト、テーブル等）を使って回答を読みやすくしてください。
日本語で回答してください（ユーザーが英語で質問した場合は英語で回答してください）。`,
        messages,
    });

    return result.toDataStreamResponse();
}

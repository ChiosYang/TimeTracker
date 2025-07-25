import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { env } from 'process';

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openrouter.chat('qwen/qwen3-235b-a22b-07-25:free'),
    messages: messages,
  });

  return result.toDataStreamResponse();
}

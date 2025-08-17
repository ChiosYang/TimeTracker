import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { env } from 'process';

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openrouter.chat('z-ai/glm-4.5-air:free'),
    messages: messages,
  });

  return result.toDataStreamResponse();
}

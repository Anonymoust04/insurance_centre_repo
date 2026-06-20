import { generateAIJSON } from '@/lib/gemini';
import { buildProtectionGapPrompt, type ProtectionGapPromptData } from '@/lib/ai-prompts';

interface AIGapResponse {
  explanation: string;
  talkingPoints: string[];
}

export async function POST(request: Request): Promise<Response> {
  let body: ProtectionGapPromptData;

  try {
    body = (await request.json()) as ProtectionGapPromptData;
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!body.customerName) {
    return Response.json({ error: 'Missing required field: customerName.' }, { status: 400 });
  }

  try {
    const prompt = buildProtectionGapPrompt(body);
    const result = await generateAIJSON<AIGapResponse>(prompt);

    if (!result.explanation || !Array.isArray(result.talkingPoints)) {
      return Response.json({ error: 'AI returned an unexpected response format.' }, { status: 500 });
    }

    return Response.json({ explanation: result.explanation, talkingPoints: result.talkingPoints });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI generation failed.';
    return Response.json({ error: message }, { status: 500 });
  }
}

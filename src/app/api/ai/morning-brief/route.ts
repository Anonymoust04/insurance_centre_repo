import { generateAIText } from '@/lib/gemini';
import { buildMorningBriefPrompt, type MorningBriefPromptData } from '@/lib/ai-prompts';

export async function POST(request: Request): Promise<Response> {
  let body: MorningBriefPromptData;

  try {
    body = (await request.json()) as MorningBriefPromptData;
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!body.agentName || !body.date) {
    return Response.json({ error: 'Missing required fields: agentName, date.' }, { status: 400 });
  }

  try {
    const prompt = buildMorningBriefPrompt(body);
    const narrative = await generateAIText(prompt);
    return Response.json({ narrative });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI generation failed.';
    return Response.json({ error: message }, { status: 500 });
  }
}

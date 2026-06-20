import { generateAIJSON } from '@/lib/gemini';
import { buildMeetingPrepPrompt, type MeetingPrepPromptData } from '@/lib/ai-prompts';

interface AIMeetingPrepResponse {
  opener: string;
  insights: string[];
  recommendation: string;
}

export async function POST(request: Request): Promise<Response> {
  let body: MeetingPrepPromptData;

  try {
    body = (await request.json()) as MeetingPrepPromptData;
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!body.customerName) {
    return Response.json({ error: 'Missing required field: customerName.' }, { status: 400 });
  }

  try {
    const prompt = buildMeetingPrepPrompt(body);
    const result = await generateAIJSON<AIMeetingPrepResponse>(prompt);

    if (!result.opener || !Array.isArray(result.insights) || !result.recommendation) {
      return Response.json({ error: 'AI returned an unexpected response format.' }, { status: 500 });
    }

    return Response.json({
      opener: result.opener,
      insights: result.insights,
      recommendation: result.recommendation,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI generation failed.';
    return Response.json({ error: message }, { status: 500 });
  }
}

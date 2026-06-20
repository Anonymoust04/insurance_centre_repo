import { generateAIJSON } from '@/lib/gemini';
import { buildFollowUpDraftPrompt, type FollowUpDraftPromptData } from '@/lib/ai-prompts';

interface AIDraftItem {
  label: string;
  text: string;
}

interface AIDraftResponse {
  drafts: AIDraftItem[];
}

export async function POST(request: Request): Promise<Response> {
  let body: FollowUpDraftPromptData;

  try {
    body = (await request.json()) as FollowUpDraftPromptData;
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!body.customerName || !body.tone) {
    return Response.json({ error: 'Missing required fields: customerName, tone.' }, { status: 400 });
  }

  try {
    const prompt = buildFollowUpDraftPrompt(body);
    const result = await generateAIJSON<AIDraftResponse>(prompt);

    if (!result.drafts || !Array.isArray(result.drafts) || result.drafts.length === 0) {
      return Response.json({ error: 'AI returned an unexpected response format.' }, { status: 500 });
    }

    return Response.json({ drafts: result.drafts });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI generation failed.';
    return Response.json({ error: message }, { status: 500 });
  }
}

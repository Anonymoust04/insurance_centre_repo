import { NextRequest, NextResponse } from 'next/server';
import { generateAIJSON } from '@/lib/gemini';
import { buildRenewalRadarPrompt } from '@/lib/ai-prompts';
import type { RenewalRadarPromptData } from '@/lib/ai-prompts';

interface RadarInsight {
  clientName: string;
  urgencyHeadline: string;
  actionAdvice: string;
  talkingPoint: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RenewalRadarPromptData;

    if (!body.clients || body.clients.length === 0) {
      return NextResponse.json({ error: 'No clients provided.' }, { status: 400 });
    }

    const prompt = buildRenewalRadarPrompt(body);
    const result = await generateAIJSON<{ insights: RadarInsight[] }>(prompt);

    return NextResponse.json({ insights: result.insights });
  } catch (err) {
    console.error('[renewal-radar]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'AI generation failed.' },
      { status: 500 }
    );
  }
}

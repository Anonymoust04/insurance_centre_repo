import { NextRequest, NextResponse } from 'next/server';
import { generateAIJSON } from '@/lib/gemini';
import { buildLifeEventSignalPrompt } from '@/lib/ai-prompts';
import type { LifeEventSignalPromptData } from '@/lib/ai-prompts';

interface OutreachStrategy {
  clientName: string;
  reviewTitle: string;
  openingMessage: string;
  keyInsight: string;
  proposalAngle: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LifeEventSignalPromptData;

    if (!body.signals || body.signals.length === 0) {
      return NextResponse.json({ error: 'No signals provided.' }, { status: 400 });
    }

    const prompt = buildLifeEventSignalPrompt(body);
    const result = await generateAIJSON<{ strategies: OutreachStrategy[] }>(prompt);

    return NextResponse.json({ strategies: result.strategies });
  } catch (err) {
    console.error('[life-event-signal]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'AI generation failed.' },
      { status: 500 }
    );
  }
}

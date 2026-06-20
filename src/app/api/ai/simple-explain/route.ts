import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { term, planContext } = body as { term?: string; planContext?: string };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const subject = term || planContext || 'insurance terminology';

    const prompt = `
You are a friendly insurance educator who makes complex terms crystal clear.

Explain this insurance concept in simple, everyday language that anyone can understand in under 30 seconds of reading:

"${subject}"

${planContext ? `Context: The user is looking at a ${planContext} plan.` : ''}

Respond in this exact JSON format (no markdown, no code blocks, just raw JSON):
{
  "simpleExplanation": "<2-3 plain-English sentences, no jargon>",
  "realWorldExample": "<one relatable everyday analogy or scenario>",
  "keyTakeaway": "<one short sentence the person should remember>"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json?\s*/i, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned);

    return Response.json(parsed);
  } catch (error) {
    console.error('Simple Explain AI error:', error);
    return Response.json({ error: 'Failed to generate explanation' }, { status: 500 });
  }
}

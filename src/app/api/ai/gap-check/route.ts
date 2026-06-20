import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, selectedPlan } = body as {
      profile: {
        gender: string;
        occupation: string;
        incomeRange: string;
        dependents: string | number;
        hasExistingCoverage: boolean | null;
        topConcern: string;
        currentAge: number;
      };
      selectedPlan: string;
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are a careful insurance gap analyst helping a client see what protection they may be missing.

Client Profile:
- Gender: ${profile.gender}
- Age: ${profile.currentAge}
- Occupation: ${profile.occupation || 'Not provided'}
- Monthly Income: RM ${profile.incomeRange}
- Dependents: ${profile.dependents}
- Has existing coverage: ${profile.hasExistingCoverage === null ? 'Unknown' : profile.hasExistingCoverage ? 'Yes' : 'No'}
- Top concern: ${profile.topConcern}
- Currently selected plan: ${selectedPlan}

The 4 protection categories are:
1. Medical & Health
2. Life Insurance
3. Critical Illness
4. Investment-Linked Plan

Identify the most important protection gaps for this client. Be practical and specific to their profile.

Respond in this exact JSON format (no markdown, no code blocks, just raw JSON):
{
  "gaps": [
    {
      "category": "<plan category name>",
      "severity": "<high | medium | low>",
      "description": "<one sentence explaining the gap and why it matters for this person>"
    }
  ],
  "priorityAction": "<one clear next step the person should take>",
  "overallAssessment": "<1-2 sentences summarising their protection coverage situation>"
}

Include 2-3 gaps maximum. Order by severity (high first).
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json?\s*/i, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned);

    return Response.json(parsed);
  } catch (error) {
    console.error('Gap Check AI error:', error);
    return Response.json({ error: 'Failed to generate gap check' }, { status: 500 });
  }
}

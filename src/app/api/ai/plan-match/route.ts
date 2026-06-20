import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile } = body as {
      profile: {
        name: string;
        gender: string;
        occupation: string;
        incomeRange: string;
        dependents: string | number;
        hasExistingCoverage: boolean | null;
        topConcern: string;
        currentAge: number;
      };
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are a friendly and knowledgeable insurance advisor assistant. Based on the client profile below, recommend the single best insurance protection plan from these 4 options:

1. Medical & Health — Hospital care, medical bills, surgery
2. Life Insurance — Core protection, financial safety net for loved ones
3. Critical Illness — Income support, lump-sum payout for serious illness
4. Investment-Linked Plan — Growth + protection, long-term investment value

Client Profile:
- Name: ${profile.name || 'Not provided'}
- Gender: ${profile.gender}
- Age: ${profile.currentAge}
- Occupation: ${profile.occupation || 'Not provided'}
- Monthly Income: RM ${profile.incomeRange}
- Dependents: ${profile.dependents}
- Existing coverage: ${profile.hasExistingCoverage === null ? 'Unknown' : profile.hasExistingCoverage ? 'Yes' : 'No'}
- Top concern: ${profile.topConcern}

Respond in this exact JSON format (no markdown, no code blocks, just raw JSON):
{
  "recommendedPlan": "<one of: Medical & Health | Life Insurance | Critical Illness | Investment-Linked Plan>",
  "reason": "<2-3 friendly sentences explaining why this plan suits this person's profile>",
  "secondaryPlan": "<second best option>",
  "secondaryReason": "<1 short sentence>",
  "advisorTip": "<one actionable tip for their first conversation with an advisor>"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip any accidental markdown code fences
    const cleaned = text.replace(/^```json?\s*/i, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned);

    return Response.json(parsed);
  } catch (error) {
    console.error('Plan Match AI error:', error);
    return Response.json({ error: 'Failed to generate plan match' }, { status: 500 });
  }
}

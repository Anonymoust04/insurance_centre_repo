import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, selectedPlan } = body as {
      profile: {
        name: string;
        gender: string;
        occupation: string;
        incomeRange: string;
        dependents: string | number;
        hasExistingCoverage: boolean | null;
        topConcern: string;
        currentAge: number;
        targetAge: number;
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
You are helping a client prepare for a conversation with their insurance advisor. Generate a clear, practical advisor prep sheet.

Client Profile:
- Name: ${profile.name || 'Client'}
- Gender: ${profile.gender}
- Age: ${profile.currentAge}, wants coverage until age ${profile.targetAge}
- Occupation: ${profile.occupation || 'Not provided'}
- Monthly Income: RM ${profile.incomeRange}
- Dependents: ${profile.dependents}
- Has existing coverage: ${profile.hasExistingCoverage === null ? 'Unknown' : profile.hasExistingCoverage ? 'Yes' : 'No'}
- Main concern: ${profile.topConcern}
- Interested in: ${selectedPlan}

Generate a concise advisor prep sheet.

Respond in this exact JSON format (no markdown, no code blocks, just raw JSON):
{
  "summary": "<2 sentences describing this client's situation and goal for their advisor>",
  "questionsToAsk": [
    "<specific question 1 tailored to their profile and selected plan>",
    "<specific question 2>",
    "<specific question 3>",
    "<specific question 4>"
  ],
  "thingsToMention": [
    "<important personal detail the advisor should know — e.g. occupation risk, dependents, existing gaps>",
    "<second thing>",
    "<third thing>"
  ],
  "budgetNote": "<one sentence on what to discuss about affordability based on their income range>"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json?\s*/i, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned);

    return Response.json(parsed);
  } catch (error) {
    console.error('Advisor Prep AI error:', error);
    return Response.json({ error: 'Failed to generate advisor prep' }, { status: 500 });
  }
}

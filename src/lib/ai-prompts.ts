// Prompt builders for all 4 AI advisor features.
// Every prompt instructs Gemini to stay factual, use only provided data,
// and always include an advisor-review disclaimer.

export interface MorningBriefPromptData {
  agentName: string;
  date: string;
  criticalCount: number;
  urgentCount: number;
  followUpsDueCount: number;
  urgentClients: Array<{ name: string; hp: number; followUp: string | null }>;
  recentActivities: Array<{ client: string; event: string }>;
  topPriority: Array<{ name: string; score: number; reasons: string[] }>;
}

export interface FollowUpDraftPromptData {
  customerName: string;
  occupation: string;
  lifeStage: string;
  hpDays: number;
  hpStatus: string;
  tone: string;
  missingCoverage: string[];
  suggestedNextProduct: string;
  paymentStreak: number;
}

export interface ProtectionGapPromptData {
  customerName: string;
  occupation: string;
  lifeStage: string;
  covered: string[];
  missing: string[];
  hpDays: number;
  riskNotes: string;
}

export interface MeetingPrepPromptData {
  customerName: string;
  occupation: string;
  city: string;
  lifeStage: string;
  energyType: string;
  hpDays: number;
  hpStatus: string;
  covered: string[];
  missing: string[];
  lastMission: string | null;
  unclaimedBoosters: string[];
  paymentStreak: number;
  satisfactionScore: number;
  suggestedProduct: string;
}

export interface RenewalRadarPromptData {
  clients: Array<{
    name: string;
    occupation: string;
    lifeStage: string;
    hpDays: number;
    status: string;
    daysSinceContact: number;
    satisfactionScore: number;
    paymentStreak: number;
    renewalDate: string;
    signals: string[];
    suggestedProduct: string;
  }>;
}

const DISCLAIMER = `
IMPORTANT RULES:
- Only use the data provided. Do not invent policy numbers, amounts, or details not given.
- If information is missing, say "Information not available" — never guess.
- Never promise claim approval, guarantee returns, or give legal/financial advice as final truth.
- Never auto-contact clients or suggest the advisor does so without review.
- Always maintain a professional, advisor-friendly tone.
- End every output with: "⚠ Advisor review required before use."
`.trim();

export function buildMorningBriefPrompt(data: MorningBriefPromptData): string {
  return `
You are an AI assistant for an insurance advisor named ${data.agentName}.
Today is ${data.date}. Write a concise, friendly morning brief (under 120 words) they can read in 30 seconds.

CLIENT DATA:
- Critical clients (HP ≤ 60 days): ${data.criticalCount}
- Urgent clients (HP < 100 days): ${data.urgentCount}
- Follow-ups due this week: ${data.followUpsDueCount}
- Recent client activities: ${data.recentActivities.length}

URGENT CLIENTS:
${data.urgentClients.map(c => `- ${c.name}: ${c.hp === 0 ? 'LAPSED' : `${c.hp} days HP`}${c.followUp ? `, follow-up due ${c.followUp}` : ''}`).join('\n')}

RECENT ACTIVITIES:
${data.recentActivities.map(a => `- ${a.client}: ${a.event}`).join('\n')}

TOP PRIORITY TODAY:
${data.topPriority.slice(0, 3).map((p, i) => `${i + 1}. ${p.name} (${p.reasons.join(', ')})`).join('\n')}

Write a warm, motivating morning brief that:
1. Greets ${data.agentName.split(' ')[0]} by first name
2. Highlights the most urgent action items
3. Mentions standout client activities
4. Ends with one encouraging sentence

Return plain text only. No markdown headers. Under 120 words.

${DISCLAIMER}
`.trim();
}

export function buildFollowUpDraftPrompt(data: FollowUpDraftPromptData): string {
  const hpNote =
    data.hpDays === 0
      ? 'policy has lapsed — no active coverage'
      : data.hpDays < 100
      ? `protection HP is low at ${data.hpDays} days`
      : 'protection is on track';

  return `
You are an AI assistant for an insurance advisor in Malaysia.
Generate exactly 3 WhatsApp follow-up message drafts for a client.

CLIENT PROFILE:
- Name: ${data.customerName}
- Occupation: ${data.occupation}
- Life stage: ${data.lifeStage}
- HP status: ${data.hpStatus} (${hpNote})
- Missing coverage: ${data.missingCoverage.length > 0 ? data.missingCoverage.join(', ') : 'None identified'}
- Suggested product: ${data.suggestedNextProduct}
- Payment streak: ${data.paymentStreak} months
- Requested tone: ${data.tone}

TONE GUIDE:
- warm: caring, empathetic, personal — use light emoji
- professional: formal salutation, proper grammar, no emoji
- friendly: casual, conversational, upbeat — use emoji freely

RULES:
- Each draft must be different (different angle / opening)
- Address the client by their first name only
- Keep each draft under 80 words
- Never promise claim approvals or investment returns
- Never say the advisor will call without their consent
- The message will be MANUALLY reviewed and sent by the advisor — never auto-send

Return ONLY this JSON (no markdown, no extra text):
{
  "drafts": [
    { "label": "Draft title (3-4 words)", "text": "Message text here" },
    { "label": "Draft title (3-4 words)", "text": "Message text here" },
    { "label": "Draft title (3-4 words)", "text": "Message text here" }
  ]
}

${DISCLAIMER}
`.trim();
}

export function buildProtectionGapPrompt(data: ProtectionGapPromptData): string {
  return `
You are an AI assistant for an insurance advisor in Malaysia.
Write a plain-English protection gap explanation and talking points for the advisor to use in a client meeting.

CLIENT PROFILE:
- Name: ${data.customerName}
- Occupation: ${data.occupation}
- Life stage: ${data.lifeStage}
- HP days: ${data.hpDays === 0 ? 'LAPSED — no active coverage' : `${data.hpDays} days`}
- Currently covered: ${data.covered.length > 0 ? data.covered.join(', ') : 'Nothing active'}
- Missing coverage: ${data.missing.length > 0 ? data.missing.join(', ') : 'No gaps identified'}
- Risk notes: ${data.riskNotes || 'None provided'}

Write ONLY this JSON (no markdown, no extra text):
{
  "explanation": "2-3 sentence plain-English summary of the protection gap situation for this client",
  "talkingPoints": [
    "First talking point the advisor can say to the client",
    "Second talking point",
    "Third talking point"
  ]
}

RULES:
- Use plain language a client with no insurance knowledge can understand
- Be factual — only reference the data provided
- Do not mention specific premium amounts or claim payout amounts unless provided
- Do not invent policy details
- Keep each talking point under 40 words
- Use first name of client in talking points where natural

${DISCLAIMER}
`.trim();
}

export function buildMeetingPrepPrompt(data: MeetingPrepPromptData): string {
  return `
You are an AI assistant for an insurance advisor in Malaysia.
Generate a meeting prep brief for the advisor before meeting this client.

CLIENT PROFILE:
- Name: ${data.customerName}
- Occupation: ${data.occupation}
- City: ${data.city || 'Not specified'}
- Life stage: ${data.lifeStage}
- Energy type: ${data.energyType}
- HP status: ${data.hpStatus} (${data.hpDays === 0 ? 'lapsed' : `${data.hpDays} days`})
- Covered: ${data.covered.length > 0 ? data.covered.join(', ') : 'None'}
- Missing: ${data.missing.length > 0 ? data.missing.join(', ') : 'None'}
- Last mission completed: ${data.lastMission ?? 'None'}
- Unclaimed boosters: ${data.unclaimedBoosters.length > 0 ? data.unclaimedBoosters.join(', ') : 'None'}
- Payment streak: ${data.paymentStreak} months
- Satisfaction score: ${data.satisfactionScore}/5
- Suggested product: ${data.suggestedProduct}

Write ONLY this JSON (no markdown, no extra text):
{
  "opener": "A warm 2-3 sentence conversation opener the advisor can say when they greet the client",
  "insights": [
    "Key insight #1 for the advisor (what to pay attention to)",
    "Key insight #2",
    "Key insight #3"
  ],
  "recommendation": "One concise product/action recommendation with brief reason (under 30 words)"
}

RULES:
- Opener should reference something specific about the client (life stage, last mission, boosters) to feel personal
- Insights should help the advisor navigate the conversation, not just repeat data
- Recommendation must not promise returns or guarantee coverage outcomes
- Keep insights under 25 words each

${DISCLAIMER}
`.trim();
}

export interface LifeEventSignalPromptData {
  signals: Array<{
    clientName: string;
    age: number;
    occupation: string;
    lifeStage: string;
    eventType: string;
    eventHeadline: string;
    coverageGap: string;
    currentCoverage: string[];
    missingCoverage: string[];
    suggestedProduct: string;
    commPref: string;
  }>;
}

export function buildLifeEventSignalPrompt(data: LifeEventSignalPromptData): string {
  const block = data.signals.map((s, i) =>
    `CLIENT ${i + 1}: ${s.clientName} (age ${s.age}, ${s.occupation})
- Life stage: ${s.lifeStage}
- Detected event: ${s.eventHeadline}
- Event type: ${s.eventType}
- Coverage gap this creates: ${s.coverageGap}
- Currently covered: ${s.currentCoverage.join(', ') || 'None'}
- Missing: ${s.missingCoverage.join(', ') || 'None identified'}
- Suggested product: ${s.suggestedProduct}
- Preferred contact: ${s.commPref}`
  ).join('\n\n');

  return `
You are an AI assistant for an insurance advisor in Malaysia.
These clients have had recent life events that suggest a coverage review is overdue.
For each client, write a specific, empathetic outreach strategy the advisor can use.

${block}

Return ONLY this JSON (no markdown, no extra text):
{
  "strategies": [
    {
      "clientName": "exact name as given",
      "reviewTitle": "What kind of review to propose (e.g. 'Family Protection Review', 'Retirement Planning Session') — max 5 words",
      "openingMessage": "A warm, natural WhatsApp or call opener (under 30 words) that acknowledges the life event without being pushy",
      "keyInsight": "One sentence explaining WHY this life event changes their coverage needs — for the advisor's reference only (under 25 words)",
      "proposalAngle": "How to frame the product recommendation in a way that feels helpful, not salesy (under 25 words)"
    }
  ]
}

RULES:
- openingMessage must acknowledge the specific life event (newborn, engagement, retirement, etc.) warmly
- Never use the client's life event to create fear or pressure
- Never promise coverage amounts, claim payouts, or returns
- proposalAngle should feel like helping, not selling
- The advisor decides whether and how to send anything

${DISCLAIMER}
`.trim();
}

export function buildRenewalRadarPrompt(data: RenewalRadarPromptData): string {
  const clientBlock = data.clients.map((c, i) =>
    `CLIENT ${i + 1}: ${c.name}
- Occupation: ${c.occupation} | Life stage: ${c.lifeStage}
- HP: ${c.hpDays === 0 ? 'LAPSED' : `${c.hpDays} days`} | Status: ${c.status}
- Last contacted: ${c.daysSinceContact} days ago | Satisfaction: ${c.satisfactionScore}/5
- Payment streak: ${c.paymentStreak} months | Renewal date: ${c.renewalDate}
- Risk signals: ${c.signals.join('; ')}
- Suggested product: ${c.suggestedProduct}`
  ).join('\n\n');

  return `
You are an AI assistant for an insurance advisor in Malaysia.
Analyse these ${data.clients.length} at-risk clients and give the advisor a specific, actionable insight for each.

${clientBlock}

Return ONLY this JSON (no markdown, no extra text):
{
  "insights": [
    {
      "clientName": "exact name as given",
      "urgencyHeadline": "One punchy sentence (max 12 words) explaining WHY this client needs attention NOW",
      "actionAdvice": "One concrete action the advisor should take this week (under 30 words)",
      "talkingPoint": "One empathetic sentence the advisor can open the conversation with (under 25 words)"
    }
  ]
}

RULES:
- One insight object per client, in the same order as given
- urgencyHeadline must reference the specific trigger (HP days, life event, inactivity, etc.)
- actionAdvice must be specific — name the product, the channel (WhatsApp/call), or the urgency level
- talkingPoint should feel warm and human, not salesy
- Never promise claim approvals or investment returns
- Never suggest the advisor contacts without consent

${DISCLAIMER}
`.trim();
}

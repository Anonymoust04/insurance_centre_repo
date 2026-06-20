import type {
  CustomerProfile,
  MorningBriefSection,
  RecentActivityEntry,
  PriorityEntry,
  FollowUpDraft,
  FollowUpDraftOutput,
  CoverageItem,
  ProtectionGapOutput,
  MeetingPrepOutput,
} from '@/types/agent';

const TODAY = '2026-06-20';

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function getUrgentCustomers(customers: CustomerProfile[]): CustomerProfile[] {
  return customers
    .filter(c => c.protectionHpDays !== undefined
      ? c.protectionHpDays > 0 && c.protectionHpDays < 100
      : c.hpDays > 0 && c.hpDays < 100)
    .sort((a, b) => (a.protectionHpDays ?? a.hpDays) - (b.protectionHpDays ?? b.hpDays));
}

export function getCriticalCustomers(customers: CustomerProfile[]): CustomerProfile[] {
  return customers
    .filter(c => c.protectionHpDays !== undefined
      ? c.protectionHpDays > 0 && c.protectionHpDays <= 60
      : c.hpDays > 0 && c.hpDays <= 60)
    .sort((a, b) => (a.protectionHpDays ?? a.hpDays) - (b.protectionHpDays ?? b.hpDays));
}

export function getFollowUpsDueSoon(customers: CustomerProfile[]): CustomerProfile[] {
  return customers
    .filter(c => {
      if (!c.nextFollowUpDate) return false;
      const diff = daysBetween(TODAY, c.nextFollowUpDate);
      return diff >= 0 && diff <= 7;
    })
    .sort((a, b) => {
      const dA = daysBetween(TODAY, a.nextFollowUpDate!);
      const dB = daysBetween(TODAY, b.nextFollowUpDate!);
      return dA - dB;
    });
}

export function getRecentActivities(customers: CustomerProfile[]): RecentActivityEntry[] {
  const all: RecentActivityEntry[] = [];
  for (const c of customers) {
    for (const act of c.recentActivities ?? []) {
      all.push({
        customerId: c.id,
        customerName: c.fullName,
        customerAvatar: c.avatar,
        activity: act,
      });
    }
  }
  return all
    .sort((a, b) => new Date(b.activity.date).getTime() - new Date(a.activity.date).getTime())
    .slice(0, 8);
}

function scorePriority(c: CustomerProfile): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const hp = c.protectionHpDays ?? c.hpDays;

  if (hp === 0) { score += 40; reasons.push('Policy lapsed — urgent reinstatement needed'); }
  else if (hp <= 60) { score += 50; reasons.push(`Critical HP: ${hp} days remaining`); }
  else if (hp < 100) { score += 30; reasons.push(`Urgent HP: ${hp} days remaining`); }

  if (c.nextFollowUpDate) {
    const diff = daysBetween(TODAY, c.nextFollowUpDate);
    if (diff >= 0 && diff <= 7) { score += 20; reasons.push(`Follow-up due in ${diff} day${diff !== 1 ? 's' : ''}`); }
  }

  if (c.missingCoverage?.includes('Critical Illness')) { score += 15; reasons.push('Missing Critical Illness cover'); }
  if (c.missingCoverage?.includes('Income Protection')) { score += 10; reasons.push('Missing Income Protection'); }
  if (c.boosterRewardsUnclaimed && c.boosterRewardsUnclaimed.length > 0) {
    score += 5;
    reasons.push(`${c.boosterRewardsUnclaimed.length} unclaimed booster${c.boosterRewardsUnclaimed.length > 1 ? 's' : ''}`);
  }

  return { score, reasons };
}

export function generateMorningBrief(customers: CustomerProfile[]): MorningBriefSection {
  const urgentClients = getUrgentCustomers(customers);
  const criticalClients = getCriticalCustomers(customers);
  const followUpsDue = getFollowUpsDueSoon(customers);
  const recentActivities = getRecentActivities(customers);

  const priorityList: PriorityEntry[] = customers
    .map(c => {
      const { score, reasons } = scorePriority(c);
      return { customer: c, score, reasons };
    })
    .filter(e => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return {
    urgentClients,
    criticalClients,
    followUpsDue,
    recentActivities,
    priorityList,
    summary: {
      urgentCount: urgentClients.length,
      criticalCount: criticalClients.length,
      followUpsDueCount: followUpsDue.length,
      recentActivitiesCount: recentActivities.length,
    },
  };
}

export function generateFollowUpDrafts(customer: CustomerProfile, tone: 'warm' | 'professional' | 'friendly'): FollowUpDraftOutput {
  const first = customer.fullName.split(' ')[0];
  const product = customer.suggestedNextProduct ?? 'your current coverage';
  const hp = customer.protectionHpDays ?? customer.hpDays;
  const hpNote = hp === 0
    ? 'your policy coverage has lapsed'
    : hp < 100
    ? `your protection is running low (${hp} days)`
    : 'keeping your protection on track';

  const warmDrafts: FollowUpDraft[] = [
    {
      tone: 'warm',
      label: 'Caring Check-in',
      draft: `Hi ${first}! 😊 It's been a while since we last caught up and I wanted to reach out personally. I noticed that ${hpNote} — and as your advisor, I want to make sure you and your family are fully protected. Would you be free for a quick 10-minute chat this week? I have some ideas that could really strengthen your coverage. Take care! 🙏`,
    },
    {
      tone: 'warm',
      label: 'Life Stage Touch',
      draft: `Hi ${first}! Hope you and your loved ones are doing well. 🌟 I've been thinking about our last conversation and your current life stage — ${customer.lifeStage ?? 'your current situation'}. I believe there's a great opportunity to enhance your protection with ${product}. Let me know if you'd like to explore this together — I'm here whenever you're ready! 😊`,
    },
    {
      tone: 'warm',
      label: 'Milestone Reminder',
      draft: `Hi ${first}! 👋 Just a friendly reminder that your next review milestone is coming up. Clients who stay on top of their coverage always feel more confident, and I'd love to help you reach that next level. Do you have 15 minutes this week for a brief chat? I'll keep it short and sweet, promise! 😄`,
    },
  ];

  const professionalDrafts: FollowUpDraft[] = [
    {
      tone: 'professional',
      label: 'Coverage Review',
      draft: `Dear ${first},\n\nI hope this message finds you well. As your appointed insurance advisor, I'd like to schedule a brief review of your current policy status. Our records indicate that ${hpNote}, and it would be prudent to address this at your earliest convenience.\n\nI recommend we connect within the next 7 days to ensure your protection remains comprehensive. Please reply to confirm a suitable time.\n\nBest regards,\nYour SecureLife Advisor`,
    },
    {
      tone: 'professional',
      label: 'Product Recommendation',
      draft: `Dear ${first},\n\nFollowing my review of your current portfolio, I would like to bring to your attention a relevant protection solution: ${product}. Based on your profile and life stage — ${customer.lifeStage ?? 'current circumstances'} — this product aligns well with your financial protection needs.\n\nI will be glad to prepare a detailed proposal for your consideration. When would be a convenient time to connect?\n\nWarm regards,\nYour SecureLife Advisor`,
    },
    {
      tone: 'professional',
      label: 'Annual Policy Reminder',
      draft: `Dear ${first},\n\nThis is a courtesy reminder that your annual policy review window is approaching. Regular reviews ensure your coverage keeps pace with your evolving needs and life commitments.\n\nI am available Monday–Friday, 9am–6pm. Please reply or call me directly to schedule a 20-minute consultation at your convenience.\n\nThank you for your continued trust.\nYour SecureLife Advisor`,
    },
  ];

  const friendlyDrafts: FollowUpDraft[] = [
    {
      tone: 'friendly',
      label: 'Quick Hello',
      draft: `Hey ${first}! 👋 Just popping in to say hi and check how everything's going! By the way, I noticed ${hpNote} — nothing to panic about, but definitely worth a quick chat to sort it out together. Got 10 mins this week? Coffee (virtual) is on me ☕😄`,
    },
    {
      tone: 'friendly',
      label: 'New Option Alert',
      draft: `Hey ${first}! So I was going through some options and found something that might really suit you — ${product}! It's got some great features for someone at your stage (${customer.lifeStage ?? 'right now'}). Wanna hear more? Hit me up whenever you're free! 🙌`,
    },
    {
      tone: 'friendly',
      label: 'Checkup Time',
      draft: `Hey ${first}! Time flies right? It's been a bit since we last spoke and I just wanted to make sure everything is cool on your end 😊 Quick insurance checkup — it'll take like 10 mins max and you'll feel way better after knowing your coverage is solid. Let me know when works for you! 🔥`,
    },
  ];

  const draftsMap = { warm: warmDrafts, professional: professionalDrafts, friendly: friendlyDrafts };

  return {
    customer,
    drafts: draftsMap[tone],
  };
}

const coverageImpactMap: Record<string, { impact: string; priority: 'critical' | 'medium' | 'low' }> = {
  'Critical Illness': {
    impact: 'No lump-sum payout if diagnosed with cancer, heart attack, or stroke',
    priority: 'critical',
  },
  'Income Protection': {
    impact: 'No monthly income replacement if unable to work due to illness or injury',
    priority: 'critical',
  },
  'Medical Card': {
    impact: 'All hospital bills paid out-of-pocket — no cashless admission',
    priority: 'critical',
  },
  'Personal Accident': {
    impact: 'No compensation for accidental injuries, disability, or accidental death',
    priority: 'medium',
  },
  'Family Takaful': {
    impact: 'Family members not covered under a shared protection plan',
    priority: 'medium',
  },
  'Investment-Linked Plan': {
    impact: 'No wealth accumulation alongside protection coverage',
    priority: 'low',
  },
};

const coveredImpactMap: Record<string, string> = {
  'Life Insurance': 'Death benefit and total permanent disability payout secured',
  'Medical Card': 'Hospitalisation and surgical bills covered with cashless admission',
  'Family Insurance': 'Core family members covered under a shared policy',
  'Health Insurance': 'Health-related claims and outpatient coverage available',
  'Savings Plan': 'Long-term savings with built-in life protection',
  'Retirement Plan': 'Retirement income and life coverage in one plan',
  'Investment-Linked Plan': 'Investment growth with life protection component',
  'Family Takaful': 'Shariah-compliant family protection and savings',
  'Personal Accident': 'Accident-related injury, disability, and death benefits active',
};

export function generateProtectionGap(customer: CustomerProfile): ProtectionGapOutput {
  const covered: CoverageItem[] = (customer.coverageDeck ?? []).map(name => ({
    name,
    status: 'covered',
    impact: coveredImpactMap[name] ?? 'Coverage active',
    priority: 'low',
  }));

  const missing: CoverageItem[] = (customer.missingCoverage ?? []).map(name => {
    const meta = coverageImpactMap[name] ?? { impact: 'Gap in protection portfolio', priority: 'medium' as const };
    return {
      name,
      status: 'missing',
      impact: meta.impact,
      priority: meta.priority,
    };
  });

  const criticalMissing = missing.filter(m => m.priority === 'critical').map(m => m.name);
  const hp = customer.protectionHpDays ?? customer.hpDays;

  const riskSummary = customer.riskNotes ?? `${customer.fullName} has ${covered.length} active coverage item${covered.length !== 1 ? 's' : ''} but is missing ${missing.length} key protection product${missing.length !== 1 ? 's' : ''}.`;

  const talkingPoints: string[] = [];

  if (hp === 0) {
    talkingPoints.push(`"${customer.fullName.split(' ')[0]}, your policy has lapsed — you currently have no active coverage. Every day without protection is a risk."`);
  } else if (hp <= 60) {
    talkingPoints.push(`"Your protection is at a critical low — only ${hp} days of coverage remain. Let's act before it runs out."`);
  } else if (hp < 100) {
    talkingPoints.push(`"Your HP is in the caution zone at ${hp} days. A review now prevents problems later."`);
  }

  if (criticalMissing.includes('Critical Illness')) {
    talkingPoints.push('"Did you know that 1 in 4 Malaysians will be diagnosed with cancer before age 75? A Critical Illness plan pays you a lump sum to cover treatment and living costs while you recover."');
  }
  if (criticalMissing.includes('Income Protection')) {
    talkingPoints.push('"If you couldn\'t work for 6 months, how long could your savings last? Income Protection ensures your monthly obligations are covered even when you\'re unable to earn."');
  }
  if (criticalMissing.includes('Medical Card')) {
    talkingPoints.push('"Hospital bills in Malaysia can reach RM 50,000 or more for a single procedure. A Medical Card gives you cashless admission with zero upfront payment."');
  }

  if (customer.lifeStage) {
    talkingPoints.push(`"At the ${customer.lifeStage} life stage, your protection needs have changed. Let's make sure your coverage reflects where you are today."`);
  }

  return {
    covered,
    missing,
    riskSummary,
    talkingPoints,
    recommendation: customer.suggestedNextProduct ?? 'Review current portfolio and consider upgrading coverage',
  };
}

export function generateMeetingPrep(customer: CustomerProfile): MeetingPrepOutput {
  const hp = customer.protectionHpDays ?? customer.hpDays;
  const first = customer.fullName.split(' ')[0];

  let hpStatus = 'Healthy';
  if (hp === 0) hpStatus = 'Lapsed';
  else if (hp <= 60) hpStatus = 'Critical';
  else if (hp < 100) hpStatus = 'Urgent';

  const keyInsights: string[] = [];

  if (hp === 0) {
    keyInsights.push('Policy is lapsed — reinstatement or new policy is the primary agenda');
  } else if (hp <= 60) {
    keyInsights.push(`Critical HP at ${hp} days — urgency framing will help accelerate decision`);
  } else if (hp < 100) {
    keyInsights.push(`HP at ${hp} days — enter the meeting with a concrete upgrade proposal ready`);
  }

  if (customer.boosterRewardsUnclaimed && customer.boosterRewardsUnclaimed.length > 0) {
    keyInsights.push(`${customer.boosterRewardsUnclaimed.length} unclaimed booster reward${customer.boosterRewardsUnclaimed.length > 1 ? 's' : ''} — use these as a positive conversation opener`);
  }

  if (customer.missingCoverage && customer.missingCoverage.length > 0) {
    keyInsights.push(`Coverage gap: missing ${customer.missingCoverage.join(', ')} — prepare a gap analysis visual`);
  }

  if (customer.paymentStreak >= 6) {
    keyInsights.push(`Excellent payment streak of ${customer.paymentStreak} months — acknowledge this loyalty during the meeting`);
  }

  if (customer.lastMissionCompleted) {
    keyInsights.push(`Recently completed mission: "${customer.lastMissionCompleted}" — celebrate this milestone`);
  }

  let conversationOpener = `Hi ${first}, thanks so much for making time today. `;

  if (hp === 0) {
    conversationOpener += `I know it's been a while, and I want to be upfront — your coverage has lapsed and I'm here to help us get you back on track as quickly as possible.`;
  } else if (hp <= 60) {
    conversationOpener += `I'll be honest with you — I've been keeping an eye on your policy and your protection level is quite low right now. I want to make sure we address this together before anything unexpected happens.`;
  } else if (customer.boosterRewardsUnclaimed && customer.boosterRewardsUnclaimed.length > 0) {
    conversationOpener += `I actually have some good news — you've earned ${customer.boosterRewardsUnclaimed.length} booster reward${customer.boosterRewardsUnclaimed.length > 1 ? 's' : ''} that haven't been claimed yet! Let's start with that, then take a look at how we can strengthen your overall coverage.`;
  } else if (customer.lastMissionCompleted) {
    conversationOpener += `I saw that you recently completed "${customer.lastMissionCompleted}" — well done! Let's build on that momentum today by reviewing where your protection stands.`;
  } else {
    conversationOpener += `I've prepared a quick review of your current coverage and have a couple of ideas that I think will be really relevant for you at this stage.`;
  }

  return {
    lifeStage: customer.lifeStage ?? 'Not specified',
    energyType: customer.energyType ?? 'Not specified',
    hpStatus,
    hpDays: hp,
    missionsCompleted: customer.lastMissionCompleted ?? null,
    unclaimedBoosters: customer.boosterRewardsUnclaimed ?? [],
    coverageSummary: customer.coverageDeck ?? [],
    conversationOpener,
    keyInsights,
    suggestedProduct: customer.suggestedNextProduct ?? 'Review existing portfolio',
  };
}

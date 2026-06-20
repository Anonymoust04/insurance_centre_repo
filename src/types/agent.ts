export interface AgentPerformance {
  id: string;
  rank: number;
  fullName: string;
  branch: string;
  avatar: string;
  monthlySales: number;
  monthlyRevenue: number;
  commissionEarned: number;
  conversionRate: number;
  policiesClosed: number;
  targetAchievement: number;
  badge: 'platinum' | 'gold' | 'silver' | 'bronze' | 'none';
}

export interface MorningBriefItem {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  phone: string;
  type: 'urgency' | 'milestone' | 'life-stage';
  priority: 'high' | 'medium' | 'low';
  insight: string;
  detail: string;
  tag: string;
  lastContact: string | null;
  daysSinceContact: number | null;
  hpDays: number | null;
  urgencyDays: number | null;
  suggestedAction: 'call' | 'whatsapp' | 'review' | 'congratulate';
  suggestedTiming: string;
  confidenceScore: number;
}

export interface CustomerActivity {
  id: string;
  type: 'hp_drop' | 'mission_completed' | 'booster_claimed' | 'life_stage_updated';
  title: string;
  date: string;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  occupation: string;
  city?: string;
  policyType: string;
  policyNumber: string;
  policyStatus?: string;
  premiumMonthly: number;
  coverageAmount: number;
  startDate: string;
  renewalDate: string;
  status: 'active' | 'renewal-due' | 'lapsed';
  riskLevel?: string;
  agentId: string;
  avatar: string;
  lastContacted: string;
  lastContactDate?: string;
  daysSinceContact: number;
  nextFollowUpDate?: string;
  hpDays: number;
  protectionHpDays?: number;
  commPref: 'whatsapp' | 'call' | 'email';
  paymentStreak: number;
  satisfactionScore: number;
  lifeStage?: string;
  energyType?: string;
  lastMissionCompleted?: string | null;
  boosterRewardsUnclaimed?: string[];
  coverageDeck?: string[];
  missingCoverage?: string[];
  riskNotes?: string;
  suggestedNextProduct?: string;
  recentActivities?: CustomerActivity[];
}

// ── AI Advisor Logic output types ──────────────────────────────────────────

export interface MorningBriefSummary {
  urgentCount: number;
  criticalCount: number;
  followUpsDueCount: number;
  recentActivitiesCount: number;
}

export interface MorningBriefSection {
  urgentClients: CustomerProfile[];
  criticalClients: CustomerProfile[];
  followUpsDue: CustomerProfile[];
  recentActivities: RecentActivityEntry[];
  priorityList: PriorityEntry[];
  summary: MorningBriefSummary;
}

export interface RecentActivityEntry {
  customerId: string;
  customerName: string;
  customerAvatar: string;
  activity: CustomerActivity;
}

export interface PriorityEntry {
  customer: CustomerProfile;
  score: number;
  reasons: string[];
}

export interface FollowUpDraft {
  tone: 'warm' | 'professional' | 'friendly';
  label: string;
  draft: string;
}

export interface FollowUpDraftOutput {
  customer: CustomerProfile;
  drafts: FollowUpDraft[];
}

export interface CoverageItem {
  name: string;
  status: 'covered' | 'missing';
  impact: string;
  priority: 'critical' | 'medium' | 'low';
}

export interface ProtectionGapOutput {
  covered: CoverageItem[];
  missing: CoverageItem[];
  riskSummary: string;
  talkingPoints: string[];
  recommendation: string;
}

export interface MeetingPrepOutput {
  lifeStage: string;
  energyType: string;
  hpStatus: string;
  hpDays: number;
  missionsCompleted: string | null;
  unclaimedBoosters: string[];
  coverageSummary: string[];
  conversationOpener: string;
  keyInsights: string[];
  suggestedProduct: string;
}

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

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  occupation: string;
  policyType: string;
  policyNumber: string;
  premiumMonthly: number;
  coverageAmount: number;
  startDate: string;
  renewalDate: string;
  status: 'active' | 'renewal-due' | 'lapsed';
  agentId: string;
  avatar: string;
}

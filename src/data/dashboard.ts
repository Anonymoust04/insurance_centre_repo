import type { CardData } from '@/types/card';

export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: string;
  rewardPoints: number;
  iconId: string; // maps to a Tabler icon in MissionCard
  completed: boolean;
  progress: number; // 0-100
}

export interface PackReward {
  type: 'voucher' | 'perk' | 'tip' | 'badge' | 'streak';
  title: string;
  description: string;
  iconId: string;
}

export const MOCK_CARD_DATA: CardData = {
  name: '',
  image: null,
  energyType: 'Water',
  plan: 'Medical & Health',
  currentAge: 0,
  targetAge: 0,
  gender: 'prefer-not-to-say',
  occupation: '',
  incomeRange: '2k-5k',
  dependents: 0,
  hasExistingCoverage: null,
  topConcern: 'health',
};

// All missions start fresh at 0 — nothing is pre-completed
export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'check-in',
    title: 'Protection Check-In',
    description: 'Review your protection status for today.',
    reward: '+1 Booster Pack',
    rewardPoints: 50,
    iconId: 'shield',
    completed: false,
    progress: 0,
  },
  {
    id: 'health-snapshot',
    title: 'Health Snapshot',
    description: "Record how you're feeling or complete a daily wellbeing check.",
    reward: '+30 Points',
    rewardPoints: 30,
    iconId: 'heart',
    completed: false,
    progress: 0,
  },
  {
    id: 'plan-knowledge',
    title: 'Plan Knowledge Bite',
    description: 'Learn one short tip about your selected protection plan.',
    reward: '+20 Points',
    rewardPoints: 20,
    iconId: 'book',
    completed: false,
    progress: 0,
  },
  {
    id: 'nominee-review',
    title: 'Nominee Review',
    description: 'Check or update your nominee and emergency contact details.',
    reward: '+1 Rare Pack',
    rewardPoints: 75,
    iconId: 'users',
    completed: false,
    progress: 0,
  },
  {
    id: 'monthly-review',
    title: 'Monthly Review',
    description: 'Review your card PT and upcoming protection milestones.',
    reward: '+1 Legendary Pack',
    rewardPoints: 100,
    iconId: 'calendar',
    completed: false,
    progress: 0,
  },
];

export const PACK_REWARDS: PackReward[] = [
  { type: 'voucher', title: 'RM10 Health Voucher', description: 'Redeemable at selected clinics.', iconId: 'ticket' },
  { type: 'perk', title: 'Free Consultation', description: '15-min advisor session unlocked.', iconId: 'stethoscope' },
  { type: 'tip', title: 'Wellness Tip Card', description: 'Drink 8 glasses of water daily to support long-term health.', iconId: 'bulb' },
  { type: 'badge', title: 'Guardian Badge', description: "You're actively protecting your future!", iconId: 'award' },
  { type: 'streak', title: '3-Day Streak Bonus', description: 'Keep it up! +10 bonus points earned.', iconId: 'flame' },
  { type: 'voucher', title: 'Premium Plan Upgrade', description: '1-month free upgrade trial unlocked.', iconId: 'star' },
  { type: 'tip', title: 'Plan Insight Card', description: 'Review your CI coverage annually to stay aligned with life changes.', iconId: 'search' },
  { type: 'badge', title: 'Early Bird Badge', description: 'Completed a mission before 9am!', iconId: 'bird' },
];

export const TOOL_ITEMS = [
  { id: 'payment',  label: 'Payment',   iconId: 'credit-card', color: 'bg-pastel-pink',       border: 'border-pink-300' },
  { id: 'checkup',  label: 'Checkup',   iconId: 'stethoscope', color: 'bg-energy-water/50',   border: 'border-blue-300' },
  { id: 'health',   label: 'Health',    iconId: 'clipboard',   color: 'bg-energy-grass/50',   border: 'border-green-300' },
  { id: 'ai',       label: 'Ask AI',    iconId: 'robot',       color: 'bg-pastel-lavender',   border: 'border-purple-300' },
  { id: 'advisor',  label: 'Advisor',   iconId: 'phone',       color: 'bg-energy-electric/50',border: 'border-yellow-300' },
];

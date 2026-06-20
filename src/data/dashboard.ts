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
  type: 'sticker' | 'badge' | 'frame';
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
  gender: '',
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
    reward: '+1 Booster Pack',
    rewardPoints: 30,
    iconId: 'heart',
    completed: false,
    progress: 0,
  },
  {
    id: 'nominee-review',
    title: 'Nominee Review',
    description: 'Check or update your nominee and emergency contact details.',
    reward: '+1 Booster Pack',
    rewardPoints: 75,
    iconId: 'users',
    completed: false,
    progress: 0,
  },
  {
    id: 'monthly-review',
    title: 'Monthly Review',
    description: 'Review your card PT and upcoming protection milestones.',
    reward: '+1 Booster Pack',
    rewardPoints: 100,
    iconId: 'calendar',
    completed: false,
    progress: 0,
  },
];

export const PACK_REWARDS: PackReward[] = [
  { type: 'sticker', title: 'Cute Sticker', description: 'A collectible sticker for your card!', iconId: 'sticker' },
  { type: 'sticker', title: 'Star Sticker', description: 'A shiny star sticker to decorate your card.', iconId: 'sticker' },
  { type: 'sticker', title: 'Heart Sticker', description: 'Show some love with this cute heart sticker.', iconId: 'sticker' },
  { type: 'badge', title: 'Guardian Badge', description: "You're actively protecting your future!", iconId: 'badge' },
  { type: 'badge', title: 'Early Bird Badge', description: 'Completed a mission early!', iconId: 'badge' },
  { type: 'badge', title: 'Streak Master Badge', description: 'Keep your streak going strong!', iconId: 'badge' },
  { type: 'frame', title: 'Golden Frame', description: 'A premium golden frame for your card.', iconId: 'frame' },
  { type: 'frame', title: 'Crystal Frame', description: 'A sparkling crystal frame upgrade.', iconId: 'frame' },
  { type: 'frame', title: 'Neon Frame', description: 'A glowing neon frame that stands out.', iconId: 'frame' },
];

export const TOOL_ITEMS = [
  { id: 'payment',  label: 'Payment',   iconId: 'credit-card', color: 'bg-pastel-pink',       border: 'border-pink-300' },
  { id: 'checkup',  label: 'Checkup',   iconId: 'stethoscope', color: 'bg-energy-water/50',   border: 'border-blue-300' },
  { id: 'health',   label: 'Health',    iconId: 'clipboard',   color: 'bg-energy-grass/50',   border: 'border-green-300' },
  { id: 'nominee',  label: 'Nominee',   iconId: 'user-plus',   color: 'bg-energy-electric/50',border: 'border-yellow-300' },
  { id: 'ai',       label: 'Ask AI',    iconId: 'robot',       color: 'bg-pastel-lavender',   border: 'border-purple-300' },
  { id: 'advisor',  label: 'Advisor',   iconId: 'phone',       color: 'bg-energy-fire/40',    border: 'border-orange-300' },
];

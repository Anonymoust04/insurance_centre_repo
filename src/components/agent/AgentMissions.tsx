'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconTarget,
  IconPhone,
  IconShieldX,
  IconSparkles,
  IconBrandWhatsapp,
  IconTrophy,
  IconUsers,
  IconCheck,
  IconGift,
  IconStar,
} from '@tabler/icons-react';
import { cn } from '@/utils/cn';

interface AgentMission {
  id: string;
  title: string;
  description: string;
  reward: string;
  xp: number;
  progress: number;
  completed: boolean;
  icon: string;
}

const INITIAL_MISSIONS: AgentMission[] = [
  {
    id: 'am-001',
    title: 'Generate your morning brief',
    description: 'Use the AI Morning Brief tool to review today\'s priority clients before starting your day.',
    reward: '+30 XP',
    xp: 30,
    progress: 0,
    completed: false,
    icon: 'sparkles',
  },
  {
    id: 'am-002',
    title: 'Contact 3 clients today',
    description: 'Reach out via WhatsApp or call to at least 3 clients on your follow-up list.',
    reward: '+50 XP',
    xp: 50,
    progress: 0,
    completed: false,
    icon: 'phone',
  },
  {
    id: 'am-003',
    title: 'Send 2 WhatsApp drafts',
    description: 'Use the Follow-up Draft Generator to personalise and send 2 messages to clients.',
    reward: '+40 XP',
    xp: 40,
    progress: 0,
    completed: false,
    icon: 'whatsapp',
  },
  {
    id: 'am-004',
    title: 'Review a lapsed client',
    description: 'Check in with a client whose policy has lapsed (HP = 0) and propose reinstatement.',
    reward: '+80 XP',
    xp: 80,
    progress: 0,
    completed: false,
    icon: 'shield',
  },
  {
    id: 'am-005',
    title: 'Run a protection gap check',
    description: 'Use the Client Snapshot on at least one client to prepare your pitch.',
    reward: '+40 XP',
    xp: 40,
    progress: 0,
    completed: false,
    icon: 'users',
  },
  {
    id: 'am-006',
    title: 'Close 1 policy this week',
    description: 'Submit a new policy application for any client in your pipeline.',
    reward: '+150 XP',
    xp: 150,
    progress: 0,
    completed: false,
    icon: 'trophy',
  },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  sparkles:  <IconSparkles size={16} />,
  phone:     <IconPhone size={16} />,
  whatsapp:  <IconBrandWhatsapp size={16} />,
  shield:    <IconShieldX size={16} />,
  users:     <IconUsers size={16} />,
  trophy:    <IconTrophy size={16} />,
};

export function AgentMissions() {
  const [missions, setMissions] = useState<AgentMission[]>(INITIAL_MISSIONS);

  const completedCount = missions.filter(m => m.completed).length;
  const totalXP = missions.filter(m => m.completed).reduce((s, m) => s + m.xp, 0);
  const maxXP = missions.reduce((s, m) => s + m.xp, 0);
  const pct = Math.round((completedCount / missions.length) * 100);

  const handleComplete = (id: string) => {
    setMissions(prev =>
      prev.map(m => m.id === id ? { ...m, completed: true, progress: 100 } : m)
    );
  };

  return (
    <div className="bg-card-cream rounded-3xl border-2 border-card-outline/60 shadow-[0_4px_20px_rgba(107,33,217,0.10)] overflow-hidden">

      {/* Header */}
      <div className="p-5 border-b-2 border-card-outline/10 bg-pastel-lavender/30">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-game-purple flex items-center justify-center">
            <IconTarget size={16} className="text-white" />
          </div>
          <h2 className="font-handwriting text-2xl font-bold text-game-text">Daily Agent Missions</h2>
          <span className="ml-auto font-handwriting text-lg font-bold text-game-purple">
            {completedCount}/{missions.length}
          </span>
        </div>
        <p className="text-xs text-game-purple/60 font-sans mb-3">
          Complete missions to earn XP and climb the leaderboard.
        </p>

        {/* XP progress bar */}
        <div className="space-y-1">
          <div className="w-full h-2.5 bg-card-outline/10 rounded-full overflow-hidden border border-card-outline/15">
            <motion.div
              className="h-full bg-gradient-to-r from-pastel-pink to-pastel-lavender rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-game-purple/50">
            <span>{pct}% complete</span>
            <span>{totalXP} / {maxXP} XP earned</span>
          </div>
        </div>
      </div>

      {/* Mission list */}
      <div className="p-4 space-y-3">
        {missions.map((mission, i) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              'flex flex-col gap-2 p-4 rounded-2xl border-2 transition-all duration-300',
              mission.completed
                ? 'bg-game-mint/20 border-[#065F46]/20'
                : 'bg-white/60 border-card-outline/20 hover:border-card-outline/50'
            )}
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {/* Icon */}
                <div className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border-2',
                  mission.completed
                    ? 'bg-game-mint border-[#065F46]/20 text-[#065F46]'
                    : 'bg-pastel-lavender/60 border-card-outline/20 text-game-purple'
                )}>
                  {mission.completed ? <IconCheck size={15} /> : ICON_MAP[mission.icon]}
                </div>
                {/* Title */}
                <p className={cn(
                  'text-sm font-bold leading-tight',
                  mission.completed ? 'line-through text-game-text/40' : 'text-game-text'
                )}>
                  {mission.title}
                </p>
              </div>
              {/* Reward badge */}
              <span className={cn(
                'text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0',
                mission.completed
                  ? 'bg-game-mint text-[#065F46] border-[#065F46]/20'
                  : 'bg-pastel-lavender text-game-purple border-card-outline/20'
              )}>
                {mission.completed ? '✓ Done' : mission.reward}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-game-purple/60 leading-snug pl-[42px]">
              {mission.description}
            </p>

            {/* Progress bar */}
            <div className="pl-[42px] space-y-0.5">
              <div className="w-full h-1.5 bg-card-outline/10 rounded-full overflow-hidden border border-card-outline/10">
                <motion.div
                  className={cn(
                    'h-full rounded-full',
                    mission.completed ? 'bg-[#34D399]' : 'bg-pastel-lavender'
                  )}
                  initial={{ width: `${mission.progress}%` }}
                  animate={{ width: mission.completed ? '100%' : `${mission.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-[10px] text-game-purple/40 font-bold">
                {mission.completed ? '100%' : `${mission.progress}%`}
              </p>
            </div>

            {/* Action */}
            <div className="pl-[42px]">
              <AnimatePresence mode="wait">
                {!mission.completed ? (
                  <motion.button
                    key="btn"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => handleComplete(mission.id)}
                    className="text-xs font-bold bg-pastel-pink text-card-outline px-3 py-1.5 rounded-xl border-2 border-pink-300 hover:bg-pink-300 transition-all active:scale-95"
                  >
                    Mark as done ✓
                  </motion.button>
                ) : (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs font-bold text-[#065F46] flex items-center gap-1"
                  >
                    <IconStar size={12} className="text-[#FFD700]" />
                    Mission complete!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* XP reward footer */}
      <div className="mx-4 mb-4 flex items-center gap-3 bg-pastel-yellow rounded-2xl px-4 py-3 border border-card-outline/20">
        <div className="w-9 h-9 rounded-xl bg-white/60 border-2 border-card-outline/20 flex items-center justify-center shrink-0">
          <IconGift size={18} className="text-game-purple" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-game-text">Daily XP Reward</p>
          <p className="text-xs text-game-purple/60">
            Complete all missions to earn{' '}
            <span className="font-bold text-game-purple">{maxXP} XP</span> today
          </p>
        </div>
        <span className="text-xl shrink-0">⭐</span>
      </div>
    </div>
  );
}

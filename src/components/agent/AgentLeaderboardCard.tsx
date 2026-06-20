'use client';

import { motion } from 'framer-motion';
import { IconTrophy, IconFlame } from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import type { AgentPerformance } from '@/types/agent';

interface AgentLeaderboardCardProps {
  agent: AgentPerformance;
  isCurrentUser?: boolean;
}

const rankConfig: Record<number, { badge: string; ring: string; emoji: string }> = {
  1: { badge: 'bg-[#FFD700] text-[#7A4F00]', ring: 'border-[#FFD700]', emoji: '🥇' },
  2: { badge: 'bg-[#C0C0C0] text-[#4A4A4A]', ring: 'border-[#C0C0C0]', emoji: '🥈' },
  3: { badge: 'bg-[#CD7F32] text-white', ring: 'border-[#CD7F32]', emoji: '🥉' },
};

export function AgentLeaderboardCard({ agent, isCurrentUser = false }: AgentLeaderboardCardProps) {
  const isTopThree = agent.rank <= 3;
  const rankCfg = isTopThree ? rankConfig[agent.rank] : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, delay: (agent.rank - 1) * 0.08 }}
      className={cn(
        'relative bg-card-cream rounded-3xl p-5 border-2 shadow-[0_4px_16px_rgba(107,33,217,0.10)]',
        isCurrentUser ? 'border-game-pink' : 'border-card-outline/60',
      )}
    >
      {isCurrentUser && (
        <span className="absolute top-3 right-3 text-xs font-bold bg-game-pink text-white px-2 py-0.5 rounded-full">
          You
        </span>
      )}

      <div className="flex items-center gap-3">
        {/* Avatar with rank badge */}
        <div className="relative shrink-0">
          <div className={cn(
            'w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border-2',
            isTopThree ? rankCfg!.ring : 'border-card-outline/40',
            'bg-pastel-lavender text-game-text'
          )}>
            {agent.avatar}
          </div>
          {isTopThree && (
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-card-cream flex items-center justify-center text-sm shadow border border-card-outline/20">
              {rankCfg!.emoji}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-game-text truncate">{agent.fullName}</p>
          <p className="text-xs text-game-purple">{agent.branch}</p>
        </div>

        <div className="text-right shrink-0">
          {isTopThree ? (
            <span className={cn('text-sm font-bold px-2 py-0.5 rounded-full', rankCfg!.badge)}>
              #{agent.rank}
            </span>
          ) : (
            <p className="text-lg font-bold text-game-text">#{agent.rank}</p>
          )}
          <p className="text-xs text-game-purple mt-0.5">{agent.policiesClosed} policies</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="text-center bg-pastel-yellow rounded-2xl py-2">
          <p className="text-sm font-bold text-game-text">RM {(agent.monthlyRevenue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-game-purple mt-0.5">Revenue</p>
        </div>
        <div className="text-center bg-game-pink-soft rounded-2xl py-2">
          <p className="text-sm font-bold text-game-text">{agent.conversionRate}%</p>
          <p className="text-xs text-game-purple mt-0.5">Conversion</p>
        </div>
        <div className="text-center bg-game-mint rounded-2xl py-2">
          <div className="flex items-center justify-center gap-1">
            <IconFlame size={12} className="text-[#C05621]" />
            <p className="text-sm font-bold text-game-text">{agent.targetAchievement}%</p>
          </div>
          <p className="text-xs text-game-purple mt-0.5">Target</p>
        </div>
      </div>
    </motion.div>
  );
}

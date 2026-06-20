'use client';

import { motion } from 'framer-motion';
import { IconTrophy, IconFlame } from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import type { AgentPerformance } from '@/types/agent';

interface AgentLeaderboardCardProps {
  agent: AgentPerformance;
  isCurrentUser?: boolean;
}

const trophyColors: Record<number, string> = {
  1: 'text-amber-400',
  2: 'text-slate-400',
  3: 'text-amber-700',
};

const podiumStyles: Record<number, string> = {
  1: 'ring-2 ring-amber-400/60 bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-800',
  2: 'ring-2 ring-slate-300/60 bg-gradient-to-br from-slate-50 to-white dark:from-slate-700/30 dark:to-slate-800',
  3: 'ring-2 ring-amber-700/40 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-slate-800',
};

export function AgentLeaderboardCard({ agent, isCurrentUser = false }: AgentLeaderboardCardProps) {
  const isTopThree = agent.rank <= 3;
  const podiumStyle = isTopThree ? podiumStyles[agent.rank] : '';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: (agent.rank - 1) * 0.12 }}
      className={cn(
        'relative rounded-2xl p-5 shadow-sm',
        isTopThree ? podiumStyle : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50',
        isCurrentUser && 'ring-2 ring-blue-500'
      )}
    >
      {isCurrentUser && (
        <span className="absolute top-3 right-3 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full">
          You
        </span>
      )}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={cn(
            'w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold',
            isTopThree ? 'bg-white dark:bg-slate-700 shadow' : 'bg-slate-100 dark:bg-slate-700',
            'text-slate-800 dark:text-white'
          )}>
            {agent.avatar}
          </div>
          {isTopThree && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow">
              <IconTrophy size={12} className={trophyColors[agent.rank]} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{agent.fullName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{agent.branch}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900 dark:text-white">#{agent.rank}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{agent.policiesClosed} policies</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-sm font-bold text-slate-900 dark:text-white">RM {(agent.monthlyRevenue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-400 mt-0.5">Revenue</p>
        </div>
        <div className="text-center border-x border-slate-200 dark:border-slate-700">
          <p className="text-sm font-bold text-slate-900 dark:text-white">{agent.conversionRate}%</p>
          <p className="text-xs text-slate-400 mt-0.5">Conversion</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <IconFlame size={13} className="text-amber-500" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">{agent.targetAchievement}%</p>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Target</p>
        </div>
      </div>
    </motion.div>
  );
}

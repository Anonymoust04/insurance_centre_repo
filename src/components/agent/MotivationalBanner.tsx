'use client';

import { motion } from 'framer-motion';
import { IconRocket, IconTrophy } from '@tabler/icons-react';
import type { AgentPerformance } from '@/types/agent';

interface MotivationalBannerProps {
  currentAgent: AgentPerformance;
  agents: AgentPerformance[];
}

export function MotivationalBanner({ currentAgent, agents }: MotivationalBannerProps) {
  const rank = currentAgent.rank;
  const top5Threshold = agents[4];
  const policiesToTop5 = Math.max(0, top5Threshold.policiesClosed - currentAgent.policiesClosed + 1);
  const nextAgent = agents.find(a => a.rank === rank - 1);
  const policiesToNext = nextAgent
    ? Math.max(0, nextAgent.policiesClosed - currentAgent.policiesClosed + 1)
    : 0;

  const isTop3 = rank <= 3;
  const isTop5 = rank <= 5;

  function getMessage() {
    if (isTop3) return `You're in the top 3 — outstanding work this month! Keep the momentum going.`;
    if (isTop5) return `You're in the top 5! Close ${policiesToNext} more ${policiesToNext === 1 ? 'policy' : 'policies'} to reach rank #${rank - 1}.`;
    return `You are currently ranked #${rank}. Close ${policiesToTop5} more ${policiesToTop5 === 1 ? 'policy' : 'policies'} to reach the Top 5.`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4 bg-blue-600 text-white rounded-2xl px-5 py-4 shadow-md shadow-blue-200 dark:shadow-blue-900/30"
    >
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
        {isTop3 ? <IconTrophy size={22} className="text-amber-300" /> : <IconRocket size={22} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-blue-200 font-medium uppercase tracking-wider">Your motivation</p>
        <p className="text-sm font-semibold text-white mt-0.5">{getMessage()}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-2xl font-bold">#{rank}</p>
        <p className="text-xs text-blue-200">Current rank</p>
      </div>
    </motion.div>
  );
}

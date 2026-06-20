'use client';

import { motion } from 'framer-motion';
import { IconRocket, IconTrophy, IconStar } from '@tabler/icons-react';
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
  const policiesToNext = nextAgent ? Math.max(0, nextAgent.policiesClosed - currentAgent.policiesClosed + 1) : 0;

  const isTop3 = rank <= 3;
  const isTop5 = rank <= 5;

  function getMessage() {
    if (isTop3) return `You're in the top 3 — outstanding work this month! Keep the momentum going.`;
    if (isTop5) return `You're in the top 5! Close ${policiesToNext} more ${policiesToNext === 1 ? 'policy' : 'policies'} to reach rank #${rank - 1}.`;
    return `You are currently ranked #${rank}. Close ${policiesToTop5} more ${policiesToTop5 === 1 ? 'policy' : 'policies'} to reach the Top 5!`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4 bg-game-pink-soft border-2 border-game-pink/40 rounded-3xl px-5 py-4"
    >
      <div className="w-10 h-10 rounded-2xl bg-game-pink flex items-center justify-center shrink-0">
        {isTop3 ? <IconTrophy size={20} className="text-white" /> : <IconRocket size={20} className="text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <IconStar size={12} className="text-[#FFD700]" />
          <p className="text-xs font-bold text-game-pink uppercase tracking-wider">Your Motivation</p>
        </div>
        <p className="text-sm font-bold text-game-text">{getMessage()}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-3xl font-handwriting text-game-purple font-bold">#{rank}</p>
        <p className="text-xs text-game-purple/60">Current rank</p>
      </div>
      <span className="text-2xl shrink-0">🚀</span>
    </motion.div>
  );
}

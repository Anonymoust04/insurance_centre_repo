'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';

interface AgentStatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: ComponentType<{ size?: number; className?: string; stroke?: number }>;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  accent?: 'pink' | 'peach' | 'mint' | 'lavender';
  delay?: number;
}

const accentMap = {
  pink: 'bg-game-pink-soft text-game-pink',
  peach: 'bg-game-peach text-[#C05621]',
  mint: 'bg-game-mint text-[#065F46]',
  lavender: 'bg-pastel-lavender text-game-purple',
};

export function AgentStatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  trendValue,
  accent = 'lavender',
  delay = 0,
}: AgentStatCardProps) {
  const iconColor = accentMap[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, delay }}
      className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline shadow-[0_4px_20px_rgba(107,33,217,0.10)]"
    >
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${iconColor}`}>
          <Icon size={22} stroke={1.8} />
        </div>
        {trend && trendValue && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend === 'up' ? 'bg-game-mint text-[#065F46]' :
            trend === 'down' ? 'bg-red-100 text-red-600' :
            'bg-pastel-lavender text-game-purple'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'} {trendValue}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-game-text">{value}</p>
        <p className="text-sm text-game-purple mt-0.5 font-semibold">{label}</p>
        {subtext && <p className="text-xs text-game-purple-deep/60 mt-1">{subtext}</p>}
      </div>
    </motion.div>
  );
}

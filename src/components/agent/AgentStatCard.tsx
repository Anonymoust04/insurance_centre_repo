'use client';

import { motion } from 'framer-motion';
import type { ComponentType } from 'react';
import { cn } from '@/utils/cn';

interface AgentStatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon: ComponentType<{ size?: number; className?: string; stroke?: number }>;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  accent?: 'blue' | 'emerald' | 'amber' | 'violet';
  delay?: number;
}

const accentMap = {
  blue: { icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400', ring: 'ring-blue-100 dark:ring-blue-900/30' },
  emerald: { icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400', ring: 'ring-emerald-100 dark:ring-emerald-900/30' },
  amber: { icon: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400', ring: 'ring-amber-100 dark:ring-amber-900/30' },
  violet: { icon: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400', ring: 'ring-violet-100 dark:ring-violet-900/30' },
};

export function AgentStatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  trendValue,
  accent = 'blue',
  delay = 0,
}: AgentStatCardProps) {
  const colors = accentMap[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center ring-4', colors.icon, colors.ring)}>
          <Icon size={20} stroke={1.8} />
        </div>
        {trend && trendValue && (
          <span className={cn(
            'text-xs font-semibold px-2 py-0.5 rounded-full',
            trend === 'up' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
            trend === 'down' && 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
            trend === 'neutral' && 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'} {trendValue}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
        {subtext && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtext}</p>}
      </div>
    </motion.div>
  );
}

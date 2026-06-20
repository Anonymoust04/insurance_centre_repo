'use client';

import { motion } from 'framer-motion';
import { IconTrophy, IconMedal } from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import type { AgentPerformance } from '@/types/agent';

interface AgentLeaderboardTableProps {
  agents: AgentPerformance[];
  currentAgentId?: string;
  showAll?: boolean;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <IconTrophy size={16} className="text-amber-400" />;
  if (rank === 2) return <IconMedal size={16} className="text-slate-400" />;
  if (rank === 3) return <IconMedal size={16} className="text-amber-700" />;
  return <span className="text-sm font-semibold text-slate-400">#{rank}</span>;
}

export function AgentLeaderboardTable({ agents, currentAgentId, showAll = true }: AgentLeaderboardTableProps) {
  const displayAgents = showAll ? agents : agents.slice(0, 5);

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/80">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-12">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Agent</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Policies</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Revenue</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Conversion</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
            {displayAgents.map((agent, i) => {
              const isCurrentUser = agent.id === currentAgentId;
              return (
                <motion.tr
                  key={agent.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={cn(
                    'transition-colors',
                    isCurrentUser
                      ? 'bg-blue-50/60 dark:bg-blue-900/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/30',
                    agent.rank <= 3 && 'font-medium'
                  )}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center w-6">
                      <RankBadge rank={agent.rank} />
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                        isCurrentUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      )}>
                        {agent.avatar}
                      </div>
                      <div>
                        <p className={cn('text-sm font-medium', isCurrentUser ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-white')}>
                          {agent.fullName}
                          {isCurrentUser && <span className="ml-1.5 text-xs text-blue-500">(You)</span>}
                        </p>
                        <p className="text-xs text-slate-400">{agent.branch}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-slate-900 dark:text-white">{agent.policiesClosed}</td>
                  <td className="px-4 py-3.5 text-right text-slate-700 dark:text-slate-300">RM {(agent.monthlyRevenue / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={cn(
                      'text-xs font-semibold px-1.5 py-0.5 rounded',
                      agent.conversionRate >= 85 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      agent.conversionRate >= 75 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    )}>
                      {agent.conversionRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            agent.targetAchievement >= 130 ? 'bg-amber-500' :
                            agent.targetAchievement >= 100 ? 'bg-emerald-500' :
                            'bg-blue-500'
                          )}
                          style={{ width: `${Math.min(agent.targetAchievement, 160) / 160 * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-300 w-9 text-right">{agent.targetAchievement}%</span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

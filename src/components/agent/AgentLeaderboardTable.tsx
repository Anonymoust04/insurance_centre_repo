'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import type { AgentPerformance } from '@/types/agent';

interface AgentLeaderboardTableProps {
  agents: AgentPerformance[];
  currentAgentId?: string;
  showAll?: boolean;
}

const rankEmoji: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
const PAGE_SIZE = 5;

export function AgentLeaderboardTable({ agents, currentAgentId, showAll = true }: AgentLeaderboardTableProps) {
  const displayAgents = showAll ? agents : agents.slice(0, 5);
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(displayAgents.length / PAGE_SIZE);
  const paged = displayAgents.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => {
    if (page > 0 && page >= pageCount) setPage(Math.max(0, pageCount - 1));
  }, [page, pageCount]);

  return (
    <div className="space-y-3">
      <div className="rounded-3xl overflow-hidden border-2 border-card-outline/60 bg-card-cream shadow-[0_4px_16px_rgba(107,33,217,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-card-outline/30 bg-pastel-lavender">
                <th className="px-4 py-3 text-left text-xs font-bold text-game-text uppercase tracking-wider w-12">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-game-text uppercase tracking-wider">Agent</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-game-text uppercase tracking-wider">Policies</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-game-text uppercase tracking-wider">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-game-text uppercase tracking-wider">Conversion</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-game-text uppercase tracking-wider">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-outline/15">
              {paged.map((agent, i) => {
                const isCurrentUser = agent.id === currentAgentId;
                return (
                  <motion.tr
                    key={agent.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className={cn(
                      'transition-colors',
                      isCurrentUser
                        ? 'bg-game-pink-soft'
                        : 'hover:bg-pastel-yellow/60'
                    )}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center w-7">
                        {agent.rank <= 3 ? (
                          <span className="text-lg">{rankEmoji[agent.rank]}</span>
                        ) : (
                          <span className="text-sm font-bold text-game-purple">#{agent.rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2',
                          isCurrentUser
                            ? 'bg-game-pink text-white border-game-pink'
                            : 'bg-pastel-lavender text-game-text border-card-outline/40'
                        )}>
                          {agent.avatar}
                        </div>
                        <div>
                          <p className={cn('text-sm font-semibold', isCurrentUser ? 'text-game-purple' : 'text-game-text')}>
                            {agent.fullName}
                            {isCurrentUser && <span className="ml-1.5 text-xs text-game-pink">(You)</span>}
                          </p>
                          <p className="text-xs text-game-purple/60">{agent.branch}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-game-text">{agent.policiesClosed}</td>
                    <td className="px-4 py-3.5 text-right text-game-purple-deep">RM {(agent.monthlyRevenue / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={cn(
                        'text-xs font-bold px-2 py-0.5 rounded-full',
                        agent.conversionRate >= 85 ? 'bg-game-mint text-[#065F46]' :
                        agent.conversionRate >= 75 ? 'bg-pastel-lavender text-game-purple' :
                        'bg-pastel-pink text-game-text'
                      )}>
                        {agent.conversionRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-16 h-2 rounded-full bg-pastel-lavender overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              agent.targetAchievement >= 130 ? 'bg-[#FFD700]' :
                              agent.targetAchievement >= 100 ? 'bg-game-mint' :
                              'bg-game-pink'
                            )}
                            style={{ width: `${Math.min(agent.targetAchievement, 160) / 160 * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-game-text w-9 text-right">{agent.targetAchievement}%</span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-game-purple/50">
            Showing ranks {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, displayAgents.length)} of {displayAgents.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-xl border-2 border-card-outline/30 text-game-purple disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pastel-lavender transition-colors"
              aria-label="Previous page"
            >
              <IconChevronLeft size={15} />
            </button>
            <span className="text-xs font-bold text-game-purple/70 tabular-nums px-1">
              {page + 1} / {pageCount}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))}
              disabled={page >= pageCount - 1}
              className="p-1.5 rounded-xl border-2 border-card-outline/30 text-game-purple disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pastel-lavender transition-colors"
              aria-label="Next page"
            >
              <IconChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

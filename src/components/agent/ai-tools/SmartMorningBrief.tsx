'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  IconAlertTriangle,
  IconCalendarEvent,
  IconActivity,
  IconListCheck,
  IconShield,
  IconFlame,
  IconSparkles,
  IconClock,
} from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import { generateMorningBrief } from '@/lib/aiAdvisorLogic';
import type { CustomerProfile } from '@/types/agent';

interface SmartMorningBriefProps {
  customers: CustomerProfile[];
}

function MockAiBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-xs font-medium px-2.5 py-1 rounded-full border border-violet-100 dark:border-violet-800/40">
      <IconSparkles size={11} />
      Mock AI Preview · Generated from local customer JSON
    </div>
  );
}

function SectionHeader({ icon: Icon, title, count, color }: { icon: React.ElementType; title: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', color)}>
        <Icon size={14} className="text-white" />
      </div>
      <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{title}</h3>
      <span className="ml-auto text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">{count}</span>
    </div>
  );
}

function HpPill({ hp }: { hp: number }) {
  if (hp === 0) return <span className="text-xs font-semibold text-red-500">Lapsed</span>;
  const color = hp <= 60 ? 'text-red-500' : 'text-amber-500';
  return <span className={cn('text-xs font-semibold', color)}>{hp}d HP</span>;
}

export function SmartMorningBrief({ customers }: SmartMorningBriefProps) {
  const brief = useMemo(() => generateMorningBrief(customers), [customers]);

  return (
    <div className="space-y-5">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-violet-50 dark:bg-violet-900/10 rounded-2xl border border-violet-100 dark:border-violet-800/30">
        <IconSparkles size={16} className="text-violet-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-violet-700 dark:text-violet-400">AI Suggested · Advisor reviews before acting</p>
          <p className="text-xs text-violet-600/80 dark:text-violet-400/60 mt-0.5">This brief is generated from local customer JSON data. All priorities and insights are logic-driven, not from a live AI model.</p>
        </div>
      </div>

      {/* Morning Summary */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Morning Summary</h2>
          <MockAiBadge />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Critical Clients', value: brief.summary.criticalCount, color: 'bg-red-500', icon: IconAlertTriangle },
            { label: 'Urgent Clients', value: brief.summary.urgentCount, color: 'bg-amber-500', icon: IconShield },
            { label: 'Follow-ups Due', value: brief.summary.followUpsDueCount, color: 'bg-blue-500', icon: IconCalendarEvent },
            { label: 'Recent Activities', value: brief.summary.recentActivitiesCount, color: 'bg-emerald-500', icon: IconActivity },
          ].map(({ label, value, color, icon: Icon }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm"
            >
              <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center mb-2', color)}>
                <Icon size={14} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Urgent Follow-ups */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
        <SectionHeader icon={IconAlertTriangle} title="Urgent Follow-ups" count={brief.urgentClients.length} color="bg-amber-500" />
        {brief.urgentClients.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No urgent clients today 🎉</p>
        ) : (
          <div className="space-y-2">
            {brief.urgentClients.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{c.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{c.fullName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{c.occupation} · {c.policyType}</p>
                </div>
                <HpPill hp={c.protectionHpDays ?? c.hpDays} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Client Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
        <SectionHeader icon={IconActivity} title="Recent Client Activity" count={brief.recentActivities.length} color="bg-blue-500" />
        {brief.recentActivities.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No recent activities</p>
        ) : (
          <div className="space-y-2">
            {brief.recentActivities.map((entry, i) => (
              <motion.div
                key={entry.activity.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">{entry.customerAvatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{entry.customerName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{entry.activity.title}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{entry.activity.date}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Priority List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
        <SectionHeader icon={IconListCheck} title="Recommended Priority List" count={brief.priorityList.length} color="bg-violet-500" />
        <p className="text-xs text-slate-400 mb-3 flex items-center gap-1.5">
          <IconClock size={11} />
          AI Suggested order · Advisor decides final action
        </p>
        {brief.priorityList.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">All clients are in good standing 🎉</p>
        ) : (
          <div className="space-y-2">
            {brief.priorityList.map((entry, i) => (
              <motion.div
                key={entry.customer.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30"
              >
                <div className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5',
                  i === 0 ? 'bg-red-500' : i === 1 ? 'bg-orange-500' : i === 2 ? 'bg-amber-500' : 'bg-slate-400'
                )}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{entry.customer.fullName}</p>
                    <span className={cn(
                      'text-xs font-bold shrink-0',
                      entry.score >= 50 ? 'text-red-500' : entry.score >= 30 ? 'text-amber-500' : 'text-slate-400'
                    )}>
                      {entry.score}pts
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {entry.reasons.map(r => (
                      <span key={r} className="text-xs bg-slate-200/80 dark:bg-slate-600/50 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">{r}</span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0">
                  {entry.customer.nextFollowUpDate && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                      <IconCalendarEvent size={10} />
                      {entry.customer.nextFollowUpDate}
                    </div>
                  )}
                  {(entry.customer.boosterRewardsUnclaimed?.length ?? 0) > 0 && (
                    <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                      <IconFlame size={10} />
                      {entry.customer.boosterRewardsUnclaimed!.length} booster{entry.customer.boosterRewardsUnclaimed!.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

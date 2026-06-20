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
    <div className="inline-flex items-center gap-1.5 bg-pastel-lavender text-game-purple text-xs font-bold px-2.5 py-1 rounded-full border border-card-outline/30">
      <IconSparkles size={11} />
      Mock AI Preview
    </div>
  );
}

function SectionHeader({ icon: Icon, title, count, color }: { icon: React.ElementType; title: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className={cn('w-7 h-7 rounded-xl flex items-center justify-center', color)}>
        <Icon size={14} className="text-white" />
      </div>
      <h3 className="font-bold text-sm text-game-text">{title}</h3>
      <span className="ml-auto text-xs font-bold bg-pastel-lavender text-game-purple px-2 py-0.5 rounded-full">{count}</span>
    </div>
  );
}

function HpPill({ hp }: { hp: number }) {
  if (hp === 0) return <span className="text-xs font-bold text-red-500">Lapsed ⚠</span>;
  const color = hp <= 60 ? 'text-game-pink' : 'text-[#C05621]';
  return <span className={cn('text-xs font-bold', color)}>{hp}d HP</span>;
}

export function SmartMorningBrief({ customers }: SmartMorningBriefProps) {
  const brief = useMemo(() => generateMorningBrief(customers), [customers]);

  return (
    <div className="space-y-5">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-pastel-lavender rounded-3xl border-2 border-card-outline/40">
        <IconSparkles size={16} className="text-game-purple mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-game-text">AI Suggested · Advisor reviews before acting</p>
          <p className="text-xs text-game-purple/70 mt-0.5">Generated from local customer JSON data. All priorities are logic-driven, not from a live AI model.</p>
        </div>
      </div>

      {/* Morning Summary */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-handwriting text-xl text-game-text">Morning Summary</h2>
          <MockAiBadge />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Critical Clients', value: brief.summary.criticalCount, color: 'bg-red-400', emoji: '⚠️' },
            { label: 'Urgent Clients', value: brief.summary.urgentCount, color: 'bg-game-pink', emoji: '⚡' },
            { label: 'Follow-ups Due', value: brief.summary.followUpsDueCount, color: 'bg-game-purple', emoji: '📅' },
            { label: 'Recent Activities', value: brief.summary.recentActivitiesCount, color: 'bg-[#065F46]', emoji: '✅' },
          ].map(({ label, value, color, emoji }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -2 }}
              className="bg-card-cream rounded-3xl p-4 border-2 border-card-outline/50 shadow-sm"
            >
              <div className={cn('w-8 h-8 rounded-2xl flex items-center justify-center mb-2 text-lg', color)}>
                {emoji}
              </div>
              <p className="text-2xl font-bold text-game-text">{value}</p>
              <p className="text-xs font-semibold text-game-purple mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Urgent Follow-ups */}
      <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/50 shadow-sm">
        <SectionHeader icon={IconAlertTriangle} title="Urgent Follow-ups" count={brief.urgentClients.length} color="bg-game-pink" />
        {brief.urgentClients.length === 0 ? (
          <p className="text-sm text-game-purple text-center py-4">No urgent clients today 🎉</p>
        ) : (
          <div className="space-y-2">
            {brief.urgentClients.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-game-pink-soft border border-game-pink/20"
              >
                <div className="w-8 h-8 rounded-full bg-game-purple border-2 border-card-outline/40 flex items-center justify-center text-white text-xs font-bold shrink-0">{c.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-game-text truncate">{c.fullName}</p>
                  <p className="text-xs text-game-purple">{c.occupation} · {c.policyType}</p>
                </div>
                <HpPill hp={c.protectionHpDays ?? c.hpDays} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Client Activity */}
      <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/50 shadow-sm">
        <SectionHeader icon={IconActivity} title="Recent Client Activity" count={brief.recentActivities.length} color="bg-game-purple" />
        {brief.recentActivities.length === 0 ? (
          <p className="text-sm text-game-purple text-center py-4">No recent activities</p>
        ) : (
          <div className="space-y-2">
            {brief.recentActivities.map((entry, i) => (
              <motion.div
                key={entry.activity.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3 p-3 rounded-2xl hover:bg-pastel-yellow/60 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-game-purple border-2 border-card-outline/30 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">{entry.customerAvatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-game-text truncate">{entry.customerName}</p>
                  <p className="text-xs text-game-purple/70 leading-relaxed mt-0.5">{entry.activity.title}</p>
                </div>
                <span className="text-xs text-game-purple/40 shrink-0">{entry.activity.date}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Priority List */}
      <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/50 shadow-sm">
        <SectionHeader icon={IconListCheck} title="Recommended Priority List" count={brief.priorityList.length} color="bg-game-purple-deep" />
        <p className="text-xs text-game-purple/60 mb-3 flex items-center gap-1.5">
          <IconClock size={11} />
          AI Suggested order · Advisor decides final action
        </p>
        {brief.priorityList.length === 0 ? (
          <p className="text-sm text-game-purple text-center py-4">All clients are in good standing 🎉</p>
        ) : (
          <div className="space-y-2">
            {brief.priorityList.map((entry, i) => (
              <motion.div
                key={entry.customer.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-2xl bg-pastel-yellow/40 border border-card-outline/15"
              >
                <div className={cn(
                  'w-6 h-6 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5',
                  i === 0 ? 'bg-red-500' : i === 1 ? 'bg-game-pink' : i === 2 ? 'bg-[#C05621]' : 'bg-game-purple/50'
                )}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-game-text truncate">{entry.customer.fullName}</p>
                    <span className={cn(
                      'text-xs font-bold shrink-0',
                      entry.score >= 50 ? 'text-red-500' : entry.score >= 30 ? 'text-game-pink' : 'text-game-purple/40'
                    )}>
                      {entry.score}pts
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {entry.reasons.map(r => (
                      <span key={r} className="text-xs bg-pastel-lavender text-game-purple-deep px-2 py-0.5 rounded-full">{r}</span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0">
                  {entry.customer.nextFollowUpDate && (
                    <div className="flex items-center gap-1 text-xs text-game-purple">
                      <IconCalendarEvent size={10} />
                      {entry.customer.nextFollowUpDate}
                    </div>
                  )}
                  {(entry.customer.boosterRewardsUnclaimed?.length ?? 0) > 0 && (
                    <div className="flex items-center gap-1 text-xs text-[#C05621] mt-1">
                      <IconFlame size={10} />
                      {entry.customer.boosterRewardsUnclaimed!.length} boost{entry.customer.boosterRewardsUnclaimed!.length > 1 ? 'ers' : 'er'}
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

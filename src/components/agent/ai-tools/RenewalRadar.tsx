'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconRadar,
  IconShieldX,
  IconClock,
  IconAlertTriangle,
  IconHeartbeat,
  IconTrendingDown,
  IconGift,
  IconCalendarEvent,
  IconSparkles,
  IconLoader2,
  IconChevronDown,
  IconChevronUp,
  IconBulb,
} from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import type { CustomerProfile } from '@/types/agent';
import type { RenewalRadarPromptData } from '@/lib/ai-prompts';

interface RenewalRadarProps {
  customers: CustomerProfile[];
}

interface Signal {
  key: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

interface ScoredClient {
  customer: CustomerProfile;
  score: number;
  tier: 'critical' | 'attention' | 'watch' | 'stable';
  signals: Signal[];
}

interface AIInsight {
  clientName: string;
  urgencyHeadline: string;
  actionAdvice: string;
  talkingPoint: string;
}

type AIStatus = 'idle' | 'loading' | 'success' | 'error';

const TODAY = '2026-06-20';

function daysBetween(dateA: string, dateB: string) {
  return Math.round((new Date(dateB).getTime() - new Date(dateA).getTime()) / 86400000);
}

function scoreClient(c: CustomerProfile): { score: number; signals: Signal[] } {
  let score = 0;
  const signals: Signal[] = [];
  const hp = c.protectionHpDays ?? c.hpDays;

  // HP signals
  if (hp === 0) {
    score += 65;
    signals.push({ key: 'lapsed', label: 'Policy fully lapsed — no coverage', icon: IconShieldX, color: 'text-red-500' });
  } else if (hp <= 60) {
    score += 50;
    signals.push({ key: 'hp_critical', label: `Critical HP: ${hp} days left`, icon: IconHeartbeat, color: 'text-game-pink' });
  } else if (hp < 100) {
    score += 28;
    signals.push({ key: 'hp_urgent', label: `Approaching danger zone: ${hp}d HP`, icon: IconHeartbeat, color: 'text-[#C05621]' });
  }

  // Inactivity
  if (c.daysSinceContact > 60) {
    score += 22;
    signals.push({ key: 'inactive_long', label: `No contact in ${c.daysSinceContact} days`, icon: IconClock, color: 'text-[#C05621]' });
  } else if (c.daysSinceContact > 30) {
    score += 12;
    signals.push({ key: 'inactive_medium', label: `Not contacted in ${c.daysSinceContact} days`, icon: IconClock, color: 'text-game-purple/70' });
  }

  // Follow-up overdue or imminent
  if (c.nextFollowUpDate) {
    const diff = daysBetween(TODAY, c.nextFollowUpDate);
    if (diff < 0) {
      score += 28;
      signals.push({ key: 'overdue', label: `Follow-up ${Math.abs(diff)}d overdue`, icon: IconAlertTriangle, color: 'text-red-500' });
    } else if (diff <= 3) {
      score += 15;
      signals.push({ key: 'followup_soon', label: `Follow-up due in ${diff}d`, icon: IconCalendarEvent, color: 'text-[#C05621]' });
    }
  }

  // Low satisfaction — churn risk
  if (c.satisfactionScore <= 2) {
    score += 25;
    signals.push({ key: 'low_sat', label: `Low satisfaction (${c.satisfactionScore}/5) — churn risk`, icon: IconTrendingDown, color: 'text-red-500' });
  } else if (c.satisfactionScore === 3) {
    score += 10;
    signals.push({ key: 'mid_sat', label: `Satisfaction at ${c.satisfactionScore}/5 — room to improve`, icon: IconTrendingDown, color: 'text-[#C05621]' });
  }

  // Payment streak broken
  if (c.paymentStreak === 0) {
    score += 20;
    signals.push({ key: 'no_streak', label: 'Payment streak broken', icon: IconTrendingDown, color: 'text-red-500' });
  }

  // Recent life event
  const lifeEvent = (c.recentActivities ?? []).find(a => a.type === 'life_stage_updated');
  if (lifeEvent) {
    score += 18;
    signals.push({ key: 'life_event', label: `Recent life event: ${lifeEvent.title}`, icon: IconHeartbeat, color: 'text-game-purple' });
  }

  // Unclaimed boosters
  if ((c.boosterRewardsUnclaimed ?? []).length > 0) {
    score += 8;
    signals.push({ key: 'boosters', label: `${c.boosterRewardsUnclaimed!.length} unclaimed booster reward(s)`, icon: IconGift, color: 'text-game-purple/60' });
  }

  // Renewal within 90 days
  if (c.renewalDate) {
    const daysToRenewal = daysBetween(TODAY, c.renewalDate);
    if (daysToRenewal >= 0 && daysToRenewal <= 90) {
      score += 15;
      signals.push({ key: 'renewal', label: `Policy renewal in ${daysToRenewal}d`, icon: IconCalendarEvent, color: 'text-game-purple' });
    }
  }

  return { score, signals };
}

function getTier(score: number): ScoredClient['tier'] {
  if (score >= 70) return 'critical';
  if (score >= 40) return 'attention';
  if (score >= 20) return 'watch';
  return 'stable';
}

const TIER_CONFIG = {
  critical:  { label: 'Critical',       bg: 'bg-red-50',           border: 'border-red-300',        badge: 'bg-red-100 text-red-700 border-red-200',        dot: 'bg-red-500' },
  attention: { label: 'Attention Soon', bg: 'bg-game-peach/40',    border: 'border-[#C05621]/30',   badge: 'bg-game-peach text-[#92400E] border-[#C05621]/20', dot: 'bg-[#C05621]' },
  watch:     { label: 'Watch',          bg: 'bg-pastel-yellow/50', border: 'border-card-outline/30', badge: 'bg-pastel-yellow text-game-purple border-card-outline/20', dot: 'bg-[#ca8a04]' },
  stable:    { label: 'Stable',         bg: 'bg-game-mint/20',     border: 'border-[#065F46]/20',   badge: 'bg-game-mint text-[#065F46] border-[#065F46]/20', dot: 'bg-[#34D399]' },
};

function ClientRow({ sc, aiInsight, index }: { sc: ScoredClient; aiInsight?: AIInsight; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = TIER_CONFIG[sc.tier];
  const hp = sc.customer.protectionHpDays ?? sc.customer.hpDays;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn('rounded-2xl border-2 overflow-hidden', cfg.bg, cfg.border)}
    >
      {/* Main row */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        {/* Urgency dot */}
        <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', cfg.dot)} />

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-game-purple border-2 border-card-outline/40 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {sc.customer.avatar}
        </div>

        {/* Name + top signal */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-game-text truncate">{sc.customer.fullName}</p>
          <p className="text-xs text-game-purple/60 truncate">
            {sc.signals[0]?.label ?? sc.customer.policyType}
          </p>
        </div>

        {/* Tier badge */}
        <span className={cn('text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0', cfg.badge)}>
          {cfg.label}
        </span>

        {/* HP pill */}
        <span className={cn(
          'text-xs font-bold shrink-0 hidden sm:block',
          hp === 0 ? 'text-red-500' : hp <= 60 ? 'text-game-pink' : hp < 100 ? 'text-[#C05621]' : 'text-[#065F46]'
        )}>
          {hp === 0 ? 'Lapsed' : `${hp}d`}
        </span>

        {/* Expand icon */}
        <div className="text-game-purple/40 shrink-0">
          {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-current/10">

              {/* All signals */}
              <div className="pt-3 space-y-1.5">
                <p className="text-[10px] font-bold text-game-text uppercase tracking-wider mb-2">Risk Signals</p>
                {sc.signals.map(sig => (
                  <div key={sig.key} className="flex items-center gap-2">
                    <sig.icon size={13} className={sig.color} />
                    <span className="text-xs text-game-text/80">{sig.label}</span>
                  </div>
                ))}
              </div>

              {/* AI Insight block */}
              {aiInsight && (
                <div className="bg-card-cream rounded-xl p-3 border border-card-outline/20 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <IconSparkles size={12} className="text-game-purple" />
                    <span className="text-[10px] font-bold text-game-purple uppercase tracking-wider">Gemini AI Insight</span>
                  </div>
                  <p className="text-sm font-bold text-game-text">{aiInsight.urgencyHeadline}</p>
                  <div className="flex items-start gap-2">
                    <IconBulb size={12} className="text-[#C05621] mt-0.5 shrink-0" />
                    <p className="text-xs text-game-text/80">{aiInsight.actionAdvice}</p>
                  </div>
                  <div className="bg-pastel-yellow rounded-lg p-2 text-xs text-game-purple italic">
                    &ldquo;{aiInsight.talkingPoint}&rdquo;
                  </div>
                </div>
              )}

              {/* Quick info */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Last Contact', value: `${sc.customer.daysSinceContact}d ago` },
                  { label: 'Satisfaction', value: `${sc.customer.satisfactionScore}/5` },
                  { label: 'Pay Streak', value: `${sc.customer.paymentStreak}mo` },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/50 rounded-xl p-2">
                    <p className="text-[10px] text-game-purple/50 font-bold">{stat.label}</p>
                    <p className="text-sm font-bold text-game-text">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function RenewalRadar({ customers }: RenewalRadarProps) {
  const [aiStatus, setAiStatus] = useState<AIStatus>('idle');
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<ScoredClient['tier'] | 'all'>('all');

  const scored = useMemo<ScoredClient[]>(() => {
    return customers
      .map(c => {
        const { score, signals } = scoreClient(c);
        return { customer: c, score, tier: getTier(score), signals };
      })
      .filter(s => s.signals.length > 0)
      .sort((a, b) => b.score - a.score);
  }, [customers]);

  const tierCounts = useMemo(() => ({
    critical:  scored.filter(s => s.tier === 'critical').length,
    attention: scored.filter(s => s.tier === 'attention').length,
    watch:     scored.filter(s => s.tier === 'watch').length,
    stable:    scored.filter(s => s.tier === 'stable').length,
  }), [scored]);

  const visible = filterTier === 'all' ? scored : scored.filter(s => s.tier === filterTier);

  const handleGenerateAI = async () => {
    const topClients = scored.filter(s => s.tier === 'critical' || s.tier === 'attention').slice(0, 5);
    if (topClients.length === 0) return;

    setAiStatus('loading');
    setAiError(null);

    const payload: RenewalRadarPromptData = {
      clients: topClients.map(sc => ({
        name: sc.customer.fullName,
        occupation: sc.customer.occupation,
        lifeStage: sc.customer.lifeStage ?? 'Not specified',
        hpDays: sc.customer.protectionHpDays ?? sc.customer.hpDays,
        status: sc.customer.status,
        daysSinceContact: sc.customer.daysSinceContact,
        satisfactionScore: sc.customer.satisfactionScore,
        paymentStreak: sc.customer.paymentStreak,
        renewalDate: sc.customer.renewalDate,
        signals: sc.signals.map(s => s.label),
        suggestedProduct: sc.customer.suggestedNextProduct ?? 'Not specified',
      })),
    };

    try {
      const res = await fetch('/api/ai/renewal-radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json() as { insights?: AIInsight[]; error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? 'AI failed.');
      setAiInsights(data.insights ?? []);
      setAiStatus('success');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI generation failed.');
      setAiStatus('error');
    }
  };

  const getInsightFor = (name: string) => aiInsights.find(i => i.clientName === name);

  return (
    <div className="space-y-5">

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-pastel-lavender rounded-3xl border-2 border-card-outline/40">
        <IconRadar size={16} className="text-game-purple mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-game-text">Timing Intelligence · Advisor decides all outreach</p>
          <p className="text-xs text-game-purple/70 mt-0.5">
            Clients are scored on HP countdown, inactivity, life events, satisfaction, and renewal timing. Tap any row to expand signals.
          </p>
        </div>
      </div>

      {/* Tier summary chips */}
      <div className="grid grid-cols-4 gap-2">
        {(Object.keys(TIER_CONFIG) as ScoredClient['tier'][]).map(tier => {
          const cfg = TIER_CONFIG[tier];
          const count = tierCounts[tier];
          const isActive = filterTier === tier;
          return (
            <button
              key={tier}
              type="button"
              onClick={() => setFilterTier(isActive ? 'all' : tier)}
              className={cn(
                'flex flex-col items-center py-3 rounded-2xl border-2 transition-all text-center',
                isActive ? `${cfg.bg} ${cfg.border}` : 'bg-card-cream border-card-outline/20 hover:border-card-outline/40'
              )}
            >
              <div className={cn('w-2 h-2 rounded-full mb-1', cfg.dot)} />
              <span className="text-base font-bold text-game-text">{count}</span>
              <span className="text-[10px] text-game-purple/60 font-bold leading-tight">{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* AI Analysis button */}
      <div className="bg-card-cream rounded-3xl p-4 border-2 border-card-outline/50 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-game-purple flex items-center justify-center">
            <IconSparkles size={13} className="text-white" />
          </div>
          <h3 className="text-sm font-bold text-game-text">Gemini AI Radar Analysis</h3>
          {aiStatus === 'success' && (
            <span className="ml-auto text-[10px] font-bold bg-game-purple text-white px-2 py-0.5 rounded-full">
              ✓ AI active
            </span>
          )}
        </div>
        <p className="text-xs text-game-purple/60">
          Get a specific urgency headline, action advice, and conversation opener for each Critical and Attention-Soon client.
        </p>

        {aiStatus === 'error' && (
          <div className="p-3 bg-red-50 border-2 border-red-200 rounded-2xl">
            <p className="text-xs font-bold text-red-600">AI Error</p>
            <p className="text-xs text-red-500 mt-0.5">{aiError}</p>
          </div>
        )}

        <motion.button
          onClick={handleGenerateAI}
          disabled={aiStatus === 'loading'}
          whileHover={aiStatus !== 'loading' ? { scale: 1.02 } : {}}
          whileTap={aiStatus !== 'loading' ? { scale: 0.97 } : {}}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold border-2 transition-all',
            aiStatus === 'loading'
              ? 'bg-pastel-lavender border-card-outline/20 text-game-purple cursor-not-allowed'
              : 'bg-game-purple border-game-purple text-white hover:opacity-90'
          )}
        >
          {aiStatus === 'loading' ? (
            <><IconLoader2 size={15} className="animate-spin" />Analysing with Gemini…</>
          ) : (
            <><IconRadar size={15} />{aiStatus === 'success' ? 'Refresh AI Analysis' : 'Run AI Radar Analysis ✨'}</>
          )}
        </motion.button>
        {aiStatus !== 'idle' && (
          <p className="text-xs text-game-purple/40 italic text-center">⚠ Advisor review required before use.</p>
        )}
      </div>

      {/* Filter label */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-game-text uppercase tracking-wider">
          {filterTier === 'all' ? `All clients on radar (${visible.length})` : `${TIER_CONFIG[filterTier].label} (${visible.length})`}
        </p>
        {filterTier !== 'all' && (
          <button
            type="button"
            onClick={() => setFilterTier('all')}
            className="text-xs font-bold text-game-purple hover:underline"
          >
            Show all
          </button>
        )}
      </div>

      {/* Client rows */}
      <div className="space-y-2">
        {visible.map((sc, i) => (
          <ClientRow
            key={sc.customer.id}
            sc={sc}
            aiInsight={getInsightFor(sc.customer.fullName)}
            index={i}
          />
        ))}
        {visible.length === 0 && (
          <div className="text-center py-10 text-game-purple/40">
            <IconRadar size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-bold">No clients in this tier</p>
          </div>
        )}
      </div>
    </div>
  );
}

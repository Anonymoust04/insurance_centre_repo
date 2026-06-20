'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconChevronDown,
  IconChevronUp,
  IconBulb,
  IconBabyCarriage,
  IconRings,
  IconBriefcase,
  IconHome,
  IconSunrise,
  IconUsers,
  IconHeartHandshake,
  IconTrendingUp,
} from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import type { CustomerProfile } from '@/types/agent';

interface LifeEventSignalProps {
  customers: CustomerProfile[];
}

type EventCategory =
  | 'newborn'
  | 'engagement'
  | 'pre-retirement'
  | 'mid-career'
  | 'growing-family'
  | 'dependency-risk'
  | 'young-transition'
  | 'income-milestone';

interface DetectedSignal {
  customer: CustomerProfile;
  category: EventCategory;
  headline: string;
  subtext: string;
  reviewType: string;
  coverageGap: string;
  urgency: 'now' | 'soon' | 'plan';
  trigger: 'explicit' | 'inferred';
}

const EVENT_CONFIG: Record<EventCategory, {
  label: string;
  emoji: string;
  icon: React.ElementType;
  bg: string;
  border: string;
  badge: string;
  iconColor: string;
}> = {
  newborn:           { label: 'New Baby',        emoji: '🍼', icon: IconBabyCarriage,   bg: 'bg-pastel-pink/30',    border: 'border-game-pink/30',     badge: 'bg-game-pink-soft text-game-pink border-game-pink/20',        iconColor: 'text-game-pink' },
  engagement:        { label: 'Engagement',       emoji: '💍', icon: IconRings,          bg: 'bg-pastel-lavender/40',border: 'border-card-outline/40',  badge: 'bg-pastel-lavender text-game-purple border-card-outline/20',  iconColor: 'text-game-purple' },
  'pre-retirement':  { label: 'Pre-Retirement',   emoji: '🌅', icon: IconSunrise,        bg: 'bg-game-peach/40',     border: 'border-[#C05621]/30',     badge: 'bg-game-peach text-[#92400E] border-[#C05621]/20',            iconColor: 'text-[#C05621]' },
  'mid-career':      { label: 'Mid-Career Peak',  emoji: '📈', icon: IconTrendingUp,     bg: 'bg-game-mint/20',      border: 'border-[#065F46]/20',     badge: 'bg-game-mint text-[#065F46] border-[#065F46]/20',            iconColor: 'text-[#065F46]' },
  'growing-family':  { label: 'Growing Family',   emoji: '👨‍👩‍👧', icon: IconUsers,          bg: 'bg-pastel-yellow/50',  border: 'border-card-outline/30',  badge: 'bg-pastel-yellow text-game-purple border-card-outline/20',    iconColor: 'text-game-purple' },
  'dependency-risk': { label: 'Dependency Risk',  emoji: '🏡', icon: IconHome,           bg: 'bg-red-50',            border: 'border-red-200',          badge: 'bg-red-100 text-red-700 border-red-200',                      iconColor: 'text-red-500' },
  'young-transition':{ label: 'Life Transition',  emoji: '🌱', icon: IconBriefcase,      bg: 'bg-pastel-lavender/30',border: 'border-card-outline/20',  badge: 'bg-pastel-lavender text-game-purple border-card-outline/20',  iconColor: 'text-game-purple' },
  'income-milestone':{ label: 'Income Milestone', emoji: '💼', icon: IconHeartHandshake, bg: 'bg-game-mint/20',      border: 'border-[#065F46]/20',     badge: 'bg-game-mint text-[#065F46] border-[#065F46]/20',            iconColor: 'text-[#065F46]' },
};

const URGENCY_LABEL: Record<DetectedSignal['urgency'], { label: string; cls: string }> = {
  now:  { label: 'Act Now', cls: 'bg-red-100 text-red-600 border-red-200' },
  soon: { label: 'Soon',    cls: 'bg-game-peach text-[#92400E] border-[#C05621]/20' },
  plan: { label: 'Plan',    cls: 'bg-pastel-lavender text-game-purple border-card-outline/20' },
};

function detectSignals(customers: CustomerProfile[]): DetectedSignal[] {
  const signals: DetectedSignal[] = [];

  for (const c of customers) {
    const lifeStage = c.lifeStage ?? '';
    const activities = c.recentActivities ?? [];
    const missing = c.missingCoverage ?? [];
    const covered = c.coverageDeck ?? [];

    // Explicit: life_stage_updated activities
    const lifeEvents = activities.filter(a => a.type === 'life_stage_updated');
    for (const ev of lifeEvents) {
      const title = ev.title.toLowerCase();

      if (title.includes('newborn') || title.includes('child') || title.includes('baby') || lifeStage === 'Newborn') {
        signals.push({ customer: c, category: 'newborn', headline: 'New baby has arrived', subtext: ev.title, reviewType: 'Family Protection Review', coverageGap: 'Child education fund, family income protection, and increased life coverage for the new dependent.', urgency: 'now', trigger: 'explicit' });
        break;
      }
      if (title.includes('engaged') || title.includes('marriage') || title.includes('married')) {
        signals.push({ customer: c, category: 'engagement', headline: 'Recently engaged or married', subtext: ev.title, reviewType: 'Couples Coverage Review', coverageGap: 'Joint life plan, shared medical coverage, and income protection for a two-income household.', urgency: 'soon', trigger: 'explicit' });
        break;
      }
    }

    // Inferred signals
    if (lifeStage === 'Newborn' && !signals.find(s => s.customer.id === c.id && s.category === 'newborn')) {
      signals.push({ customer: c, category: 'newborn', headline: 'Life stage: new parent', subtext: `${c.fullName} has entered the Newborn life stage — first child arrived.`, reviewType: 'Family Protection Review', coverageGap: missing.join(', ') || 'Family income protection and child rider coverage.', urgency: 'now', trigger: 'inferred' });
    }

    if (c.age >= 25 && c.age <= 32 && (lifeStage === 'Single Professional' || lifeStage === 'Young Professional') && activities.find(a => a.type === 'life_stage_updated' && a.title.toLowerCase().includes('engaged'))) {
      if (!signals.find(s => s.customer.id === c.id && s.category === 'engagement')) {
        signals.push({ customer: c, category: 'engagement', headline: 'Recently engaged — planning ahead', subtext: 'Newly engaged clients often overlook joint coverage needs.', reviewType: 'Pre-Marriage Financial Review', coverageGap: 'Family takaful, joint life plan, and home purchase protection.', urgency: 'soon', trigger: 'inferred' });
      }
    }

    if (c.age >= 25 && c.age <= 32 && lifeStage === 'Single Professional' && missing.length >= 2 && !signals.find(s => s.customer.id === c.id)) {
      signals.push({ customer: c, category: 'young-transition', headline: 'Approaching key life milestones', subtext: `Age ${c.age} — marriage, first home, and family planning window.`, reviewType: 'Life Milestone Readiness Review', coverageGap: `${missing.slice(0, 2).join(' and ')} — gaps that grow costlier with age.`, urgency: 'plan', trigger: 'inferred' });
    }

    if ((lifeStage === 'Young Family' || lifeStage === 'Family') && missing.length > 0 && !signals.find(s => s.customer.id === c.id)) {
      signals.push({ customer: c, category: 'growing-family', headline: 'Growing family — coverage gaps identified', subtext: `Family life stage with ${missing.length} missing coverage area${missing.length > 1 ? 's' : ''}.`, reviewType: 'Family Coverage Audit', coverageGap: missing.join(', '), urgency: (c.protectionHpDays ?? c.hpDays) < 100 ? 'now' : 'soon', trigger: 'inferred' });
    }

    if ((lifeStage === 'Pre-Retirement' || c.age >= 50) && !signals.find(s => s.customer.id === c.id)) {
      signals.push({ customer: c, category: 'pre-retirement', headline: 'Entering pre-retirement window', subtext: `Age ${c.age} — the 10-year preparation window before retirement is critical for coverage.`, reviewType: 'Retirement Planning Session', coverageGap: missing.length > 0 ? missing.join(', ') : 'Medical card and critical illness cover before premiums rise with age.', urgency: (c.protectionHpDays ?? c.hpDays) === 0 ? 'now' : 'soon', trigger: 'inferred' });
    }

    if (lifeStage === 'Mid-Career' && covered.length >= 2 && missing.includes('Critical Illness') && !signals.find(s => s.customer.id === c.id)) {
      signals.push({ customer: c, category: 'mid-career', headline: 'Peak earning years — wealth protection gap', subtext: `${c.occupation} at peak career — income loss from illness is the biggest unprotected risk.`, reviewType: 'Wealth & Income Protection Review', coverageGap: 'Critical illness rider on existing plan — most impactful upgrade at this stage.', urgency: 'plan', trigger: 'inferred' });
    }

    if (lifeStage === 'Homemaker' && !signals.find(s => s.customer.id === c.id)) {
      const hp = c.protectionHpDays ?? c.hpDays;
      signals.push({ customer: c, category: 'dependency-risk', headline: 'Homemaker — full income dependency', subtext: 'No independent income means a medical event could destabilise the entire household.', reviewType: 'Dependent Protection Review', coverageGap: missing.length > 0 ? missing.join(', ') : 'Medical card and critical illness for the dependent household member.', urgency: hp === 0 ? 'now' : 'soon', trigger: 'inferred' });
    }

    if (c.premiumMonthly >= 500 && covered.includes('Investment-Linked Plan') && missing.includes('Critical Illness') && !signals.find(s => s.customer.id === c.id)) {
      signals.push({ customer: c, category: 'income-milestone', headline: 'High-value client — CI gap on existing ILP', subtext: `RM${c.premiumMonthly}/mo investment plan but no critical illness rider in place.`, reviewType: 'ILP Enhancement Review', coverageGap: 'Critical Illness rider — completes the protection layer on their existing investment plan.', urgency: 'plan', trigger: 'inferred' });
    }
  }

  const urgencyOrder = { now: 0, soon: 1, plan: 2 };
  return signals.sort((a, b) => {
    if (a.trigger !== b.trigger) return a.trigger === 'explicit' ? -1 : 1;
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });
}

function SignalCard({ sig, index }: { sig: DetectedSignal; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = EVENT_CONFIG[sig.category];
  const urg = URGENCY_LABEL[sig.urgency];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={cn('rounded-2xl border-2 overflow-hidden', cfg.bg, cfg.border)}
    >
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <div className={cn('w-10 h-10 rounded-2xl border-2 flex items-center justify-center shrink-0 bg-white/60', cfg.border)}>
          <span className="text-xl leading-none">{cfg.emoji}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-game-text">{sig.customer.fullName}</p>
            {sig.trigger === 'explicit' && (
              <span className="text-[9px] font-bold bg-game-purple text-white px-1.5 py-0.5 rounded-full">CONFIRMED</span>
            )}
          </div>
          <p className="text-xs font-bold text-game-text/70 mt-0.5">{sig.headline}</p>
          <p className="text-xs text-game-purple/50 mt-0.5 truncate">{sig.customer.occupation} · {sig.customer.lifeStage}</p>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', cfg.badge)}>{cfg.label}</span>
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', urg.cls)}>{urg.label}</span>
        </div>

        <div className="text-game-purple/40 shrink-0 mt-1">
          {expanded ? <IconChevronUp size={15} /> : <IconChevronDown size={15} />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-black/5">
              <div className="pt-3 space-y-2">
                <div className="flex items-start gap-2">
                  <cfg.icon size={14} className={cn('shrink-0 mt-0.5', cfg.iconColor)} />
                  <p className="text-xs text-game-text/80 leading-relaxed">{sig.subtext}</p>
                </div>
                <div className="bg-white/60 rounded-xl p-3 space-y-1.5">
                  <p className="text-[10px] font-bold text-game-text uppercase tracking-wider">Coverage Gap This Creates</p>
                  <p className="text-xs text-game-purple/80 leading-relaxed">{sig.coverageGap}</p>
                </div>
                <div className="flex items-center gap-2 bg-white/60 rounded-xl px-3 py-2">
                  <IconBulb size={12} className="text-[#C05621] shrink-0" />
                  <p className="text-xs font-bold text-game-text">Suggested review: <span className="text-game-purple">{sig.reviewType}</span></p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'HP Days', value: (sig.customer.protectionHpDays ?? sig.customer.hpDays) === 0 ? 'Lapsed' : `${sig.customer.protectionHpDays ?? sig.customer.hpDays}d` },
                  { label: 'Satisfaction', value: `${sig.customer.satisfactionScore}/5` },
                  { label: 'Age', value: `${sig.customer.age}` },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/50 rounded-xl p-2 text-center">
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

export function LifeEventSignal({ customers }: LifeEventSignalProps) {
  const [filterCategory, setFilterCategory] = useState<EventCategory | 'all'>('all');

  const signals = useMemo(() => detectSignals(customers), [customers]);

  const categoryCounts = useMemo(() => {
    const map: Partial<Record<EventCategory, number>> = {};
    for (const s of signals) map[s.category] = (map[s.category] ?? 0) + 1;
    return map;
  }, [signals]);

  const visible = filterCategory === 'all' ? signals : signals.filter(s => s.category === filterCategory);
  const presentCategories = [...new Set(signals.map(s => s.category))];

  return (
    <div className="space-y-5">

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-pastel-lavender rounded-3xl border-2 border-card-outline/40">
        <IconHeartHandshake size={16} className="text-game-purple mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-game-text">Life Event Intelligence · Advisor decides all outreach</p>
          <p className="text-xs text-game-purple/70 mt-0.5">
            Auto-synced from member profile updates on the InsureQuest member app. When a member updates their life stage, occupation, or personal milestone, signals appear here automatically — so you always know the right moment to reach out.
          </p>
        </div>
      </div>

      {/* Category filter chips */}
      {presentCategories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={cn(
              'text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all',
              filterCategory === 'all'
                ? 'bg-game-purple text-white border-game-purple'
                : 'bg-card-cream text-game-purple border-card-outline/30 hover:border-card-outline/60'
            )}
          >
            All ({signals.length})
          </button>
          {presentCategories.map(cat => {
            const cfg = EVENT_CONFIG[cat];
            const isActive = filterCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(isActive ? 'all' : cat)}
                className={cn(
                  'text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all flex items-center gap-1.5',
                  isActive ? `${cfg.bg} ${cfg.border}` : 'bg-card-cream text-game-purple border-card-outline/20 hover:border-card-outline/40'
                )}
              >
                <span>{cfg.emoji}</span>
                {cfg.label} ({categoryCounts[cat]})
              </button>
            );
          })}
        </div>
      )}

      {/* Signal count */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-game-text uppercase tracking-wider">
          {filterCategory === 'all'
            ? `${visible.length} life event signal${visible.length !== 1 ? 's' : ''} detected`
            : `${EVENT_CONFIG[filterCategory].label} · ${visible.length} client${visible.length !== 1 ? 's' : ''}`}
        </p>
        {filterCategory !== 'all' && (
          <button type="button" onClick={() => setFilterCategory('all')} className="text-xs font-bold text-game-purple hover:underline">
            Show all
          </button>
        )}
      </div>

      {/* Signal cards */}
      <div className="space-y-3">
        {visible.map((sig, i) => (
          <SignalCard key={`${sig.customer.id}-${sig.category}`} sig={sig} index={i} />
        ))}
        {visible.length === 0 && (
          <div className="text-center py-10 text-game-purple/40">
            <IconHeartHandshake size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-bold">No signals detected for this category</p>
          </div>
        )}
      </div>
    </div>
  );
}

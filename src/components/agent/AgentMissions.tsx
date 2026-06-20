'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconTarget,
  IconPhone,
  IconShieldX,
  IconSparkles,
  IconBrandWhatsapp,
  IconTrophy,
  IconUsers,
  IconCheck,
  IconGift,
  IconStar,
  IconChevronLeft,
  IconChevronRight,
  IconInfoCircle,
  IconX,
  IconLock,
  IconFlame,
  IconSortDescending,
  IconClock,
} from '@tabler/icons-react';
import { cn } from '@/utils/cn';

interface AgentMission {
  id: string;
  title: string;
  description: string;
  xp: number;
  progress: number;
  completed: boolean;
  icon: string;
  urgent: boolean;
}

const INITIAL_MISSIONS: AgentMission[] = [
  {
    id: 'am-001',
    title: 'Generate your morning brief',
    description: 'Use the AI Morning Brief tool to review today\'s priority clients before starting your day.',
    xp: 30,
    progress: 0,
    completed: false,
    icon: 'sparkles',
    urgent: false,
  },
  {
    id: 'am-002',
    title: 'Contact 3 clients today',
    description: 'Reach out via WhatsApp or call to at least 3 clients on your follow-up list.',
    xp: 50,
    progress: 0,
    completed: false,
    icon: 'phone',
    urgent: true,
  },
  {
    id: 'am-003',
    title: 'Send 2 WhatsApp drafts',
    description: 'Use the Follow-up Draft Generator to personalise and send 2 messages to clients.',
    xp: 40,
    progress: 0,
    completed: false,
    icon: 'whatsapp',
    urgent: false,
  },
  {
    id: 'am-004',
    title: 'Review a lapsed client',
    description: 'Check in with a client whose policy has lapsed (HP = 0) and propose reinstatement.',
    xp: 80,
    progress: 0,
    completed: false,
    icon: 'shield',
    urgent: true,
  },
  {
    id: 'am-005',
    title: 'Run a protection gap check',
    description: 'Use the Client Snapshot on at least one client to prepare your pitch.',
    xp: 40,
    progress: 0,
    completed: false,
    icon: 'users',
    urgent: false,
  },
  {
    id: 'am-006',
    title: 'Close 1 policy this week',
    description: 'Submit a new policy application for any client in your pipeline.',
    xp: 150,
    progress: 0,
    completed: false,
    icon: 'trophy',
    urgent: true,
  },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  sparkles: <IconSparkles size={16} />,
  phone:    <IconPhone size={16} />,
  whatsapp: <IconBrandWhatsapp size={16} />,
  shield:   <IconShieldX size={16} />,
  users:    <IconUsers size={16} />,
  trophy:   <IconTrophy size={16} />,
};

type FilterMode = 'newest' | 'urgent' | 'top-xp';

const PAGE_SIZE = 8;

const FILTER_OPTIONS: { mode: FilterMode; label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { mode: 'newest',  label: 'Newest',    Icon: IconClock },
  { mode: 'urgent',  label: 'Urgent',    Icon: IconFlame },
  { mode: 'top-xp',  label: 'Top XP',   Icon: IconSortDescending },
];

// ── Info modal ────────────────────────────────────────────────────────────────
function XpInfoModal({ onClose, totalXp, maxXp }: { onClose: () => void; totalXp: number; maxXp: number }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-card-cream rounded-3xl border-2 border-card-outline/60 shadow-2xl max-w-sm w-full pointer-events-auto">

          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b-2 border-card-outline/10 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-game-purple flex items-center justify-center">
                  <IconGift size={15} className="text-white" />
                </div>
                <h3 className="font-handwriting text-xl text-game-text">XP & Lucky Pack</h3>
              </div>
              <p className="text-xs text-game-purple/60">How your mission points work</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl text-game-purple/40 hover:text-red-500 hover:bg-red-50 transition-colors mt-0.5">
              <IconX size={16} />
            </button>
          </div>

          <div className="px-5 py-4 space-y-4">

            {/* Your XP */}
            <div className="bg-pastel-lavender/50 rounded-2xl px-4 py-3 flex items-center justify-between border border-card-outline/20">
              <div>
                <p className="text-xs font-bold text-game-purple/60 uppercase tracking-wide">Your XP Today</p>
                <p className="font-handwriting text-3xl text-game-purple mt-0.5">{totalXp} <span className="text-lg">/ {maxXp}</span></p>
              </div>
              <span className="text-3xl">⭐</span>
            </div>

            {/* How it works */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-game-text uppercase tracking-wide">How it works</p>
              <ul className="space-y-1.5 text-xs text-game-purple/70 leading-snug">
                <li className="flex items-start gap-2"><span className="text-game-pink font-bold shrink-0">1.</span>Complete daily missions to earn XP points.</li>
                <li className="flex items-start gap-2"><span className="text-game-pink font-bold shrink-0">2.</span>XP accumulates across all your daily mission completions.</li>
                <li className="flex items-start gap-2"><span className="text-game-pink font-bold shrink-0">3.</span>Enough XP unlocks a <span className="font-bold text-game-purple">Lucky Pack</span> — exclusive rewards for top advisors.</li>
                <li className="flex items-start gap-2"><span className="text-game-pink font-bold shrink-0">4.</span>Lucky Packs may contain bonus commissions, client leads, or surprise perks.</li>
              </ul>
            </div>

            {/* XP table */}
            <div className="bg-pastel-yellow/60 rounded-2xl overflow-hidden border border-card-outline/20">
              <div className="px-3 py-2 border-b border-card-outline/10">
                <p className="text-[10px] font-bold text-game-purple/50 uppercase tracking-wider">Mission XP values</p>
              </div>
              <div className="divide-y divide-card-outline/10">
                {INITIAL_MISSIONS.map(m => (
                  <div key={m.id} className="flex items-center justify-between px-3 py-1.5">
                    <span className="text-xs text-game-text/70 truncate pr-2">{m.title}</span>
                    <span className="text-xs font-bold text-game-purple shrink-0">+{m.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Redeem button — disabled, frontend-only */}
            <div className="space-y-2">
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-card-outline/10 border-2 border-dashed border-card-outline/30 text-sm font-bold text-game-purple/30 cursor-not-allowed"
              >
                <IconLock size={15} />
                Redeem Lucky Pack
                <span className="ml-1">🎁</span>
              </button>
              <p className="text-center text-[10px] text-game-purple/40">
                Redemption portal coming soon — keep earning XP!
              </p>
            </div>

          </div>
        </div>
      </motion.div>
    </>
  );
}

// ── Mission card ──────────────────────────────────────────────────────────────
function MissionCard({
  mission,
  index,
  onComplete,
}: {
  mission: AgentMission;
  index: number;
  onComplete: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'flex flex-col gap-3 p-4 rounded-2xl border-2 transition-all duration-300 h-full',
        mission.completed
          ? 'bg-game-mint/20 border-[#065F46]/20'
          : mission.urgent
          ? 'bg-white/60 border-game-pink/30 hover:border-game-pink/60'
          : 'bg-white/60 border-card-outline/20 hover:border-card-outline/50'
      )}
    >
      {/* Top row: icon + title + badge */}
      <div className="flex items-start gap-2.5">
        <div className={cn(
          'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border-2 mt-0.5',
          mission.completed
            ? 'bg-game-mint border-[#065F46]/20 text-[#065F46]'
            : mission.urgent
            ? 'bg-game-pink-soft border-pink-200 text-game-pink'
            : 'bg-pastel-lavender/60 border-card-outline/20 text-game-purple'
        )}>
          {mission.completed ? <IconCheck size={15} /> : ICON_MAP[mission.icon]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5 mb-0.5">
            <p className={cn(
              'text-sm font-bold leading-tight',
              mission.completed ? 'line-through text-game-text/40' : 'text-game-text'
            )}>
              {mission.title}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={cn(
              'text-[10px] font-bold px-2 py-0.5 rounded-full border',
              mission.completed
                ? 'bg-game-mint text-[#065F46] border-[#065F46]/20'
                : 'bg-pastel-lavender text-game-purple border-card-outline/20'
            )}>
              {mission.completed ? '✓ Done' : `+${mission.xp} XP`}
            </span>
            {mission.urgent && !mission.completed && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-game-pink/10 text-game-pink border border-pink-200 flex items-center gap-1">
                <IconFlame size={9} />
                Urgent
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-game-purple/60 leading-snug flex-1">{mission.description}</p>

      {/* Progress bar */}
      <div className="space-y-0.5">
        <div className="w-full h-1.5 bg-card-outline/10 rounded-full overflow-hidden border border-card-outline/10">
          <motion.div
            className={cn('h-full rounded-full', mission.completed ? 'bg-[#34D399]' : 'bg-pastel-lavender')}
            initial={{ width: `${mission.progress}%` }}
            animate={{ width: mission.completed ? '100%' : `${mission.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-[10px] text-game-purple/40 font-bold">
          {mission.completed ? '100%' : `${mission.progress}%`}
        </p>
      </div>

      {/* Action */}
      <AnimatePresence mode="wait">
        {!mission.completed ? (
          <motion.button
            key="btn"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => onComplete(mission.id)}
            className="text-xs font-bold bg-pastel-pink text-card-outline px-3 py-1.5 rounded-xl border-2 border-pink-300 hover:bg-pink-300 transition-all active:scale-95 self-start"
          >
            Mark as done ✓
          </motion.button>
        ) : (
          <motion.span
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs font-bold text-[#065F46] flex items-center gap-1"
          >
            <IconStar size={12} className="text-[#FFD700]" />
            Mission complete!
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function AgentMissions() {
  const [missions, setMissions] = useState<AgentMission[]>(INITIAL_MISSIONS);
  const [filter, setFilter] = useState<FilterMode>('newest');
  const [page, setPage] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const completedCount = missions.filter(m => m.completed).length;
  const totalXP = missions.filter(m => m.completed).reduce((s, m) => s + m.xp, 0);
  const maxXP = missions.reduce((s, m) => s + m.xp, 0);
  const pct = Math.round((completedCount / missions.length) * 100);

  const filtered = useMemo(() => {
    const list = [...missions];
    if (filter === 'urgent')  return list.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0));
    if (filter === 'top-xp')  return list.sort((a, b) => b.xp - a.xp);
    return list; // newest = original insertion order
  }, [missions, filter]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => {
    if (page > 0 && page >= pageCount) setPage(Math.max(0, pageCount - 1));
  }, [page, pageCount]);

  // reset page when filter changes
  useEffect(() => { setPage(0); }, [filter]);

  const handleComplete = (id: string) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, completed: true, progress: 100 } : m));
  };

  return (
    <>
      <div className="bg-card-cream rounded-3xl border-2 border-card-outline/60 shadow-[0_4px_20px_rgba(107,33,217,0.10)] overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b-2 border-card-outline/10 bg-pastel-lavender/30">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-game-purple flex items-center justify-center">
              <IconTarget size={16} className="text-white" />
            </div>
            <h2 className="font-handwriting text-2xl font-bold text-game-text">Daily Agent Missions</h2>
            <div className="ml-auto flex items-center gap-2">
              {/* XP total badge */}
              <div className="flex items-center gap-1.5 bg-pastel-lavender border border-card-outline/20 rounded-full px-3 py-1">
                <span className="text-xs">⭐</span>
                <span className="text-xs font-bold text-game-purple">{totalXP} XP</span>
              </div>
              {/* completion count */}
              <span className="font-handwriting text-lg font-bold text-game-purple">
                {completedCount}/{missions.length}
              </span>
              {/* info button */}
              <button
                onClick={() => setShowInfo(true)}
                className="p-1.5 rounded-xl text-game-purple/50 hover:text-game-purple hover:bg-pastel-lavender transition-colors"
                aria-label="XP info"
              >
                <IconInfoCircle size={18} />
              </button>
            </div>
          </div>
          <p className="text-xs text-game-purple/60 font-sans mb-3">
            Complete missions to earn XP and climb the leaderboard.
          </p>

          {/* XP progress bar */}
          <div className="space-y-1">
            <div className="w-full h-2.5 bg-card-outline/10 rounded-full overflow-hidden border border-card-outline/15">
              <motion.div
                className="h-full bg-gradient-to-r from-pastel-pink to-pastel-lavender rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-game-purple/50">
              <span>{pct}% complete</span>
              <span>{totalXP} / {maxXP} XP earned</span>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-5 pt-4 pb-2 flex items-center gap-2">
          <span className="text-xs font-bold text-game-purple/50 uppercase tracking-wide mr-1">Sort:</span>
          {FILTER_OPTIONS.map(({ mode, label, Icon }) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={cn(
                'flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all',
                filter === mode
                  ? 'bg-game-purple text-white border-game-purple'
                  : 'bg-white/60 text-game-purple/60 border-card-outline/20 hover:border-game-purple/40 hover:text-game-purple'
              )}
            >
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div>

        {/* Mission grid — 2 columns */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AnimatePresence>
            {paged.map((mission, i) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                index={i}
                onComplete={handleComplete}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex items-center justify-center gap-3 pb-3">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-xl border-2 border-card-outline/30 text-game-purple disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pastel-lavender transition-colors"
              aria-label="Previous page"
            >
              <IconChevronLeft size={15} />
            </button>
            <span className="text-xs font-bold text-game-purple/70 tabular-nums">
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
        )}

        {/* XP reward footer */}
        <div className="mx-4 mb-4 flex items-center gap-3 bg-pastel-yellow rounded-2xl px-4 py-3 border border-card-outline/20">
          <div className="w-9 h-9 rounded-xl bg-white/60 border-2 border-card-outline/20 flex items-center justify-center shrink-0">
            <IconGift size={18} className="text-game-purple" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-game-text">Daily XP Reward</p>
            <p className="text-xs text-game-purple/60">
              Complete all missions to earn{' '}
              <span className="font-bold text-game-purple">{maxXP} XP</span> today
            </p>
          </div>
          <span className="text-xl shrink-0">⭐</span>
        </div>
      </div>

      {/* Info modal */}
      <AnimatePresence>
        {showInfo && <XpInfoModal onClose={() => setShowInfo(false)} totalXp={totalXP} maxXp={maxXP} />}
      </AnimatePresence>
    </>
  );
}

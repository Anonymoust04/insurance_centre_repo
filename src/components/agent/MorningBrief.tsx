'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconSparkles,
  IconRefresh,
  IconAlertTriangle,
  IconTrophy,
  IconBabyCarriage,
  IconChevronDown,
  IconChevronUp,
  IconChevronLeft,
  IconChevronRight,
  IconBrandWhatsapp,
  IconPhone,
  IconCalendarEvent,
  IconCheck,
  IconX,
  IconHeart,
  IconClockHour4,
  IconShieldCheck,
  IconTargetArrow,
  IconDeviceMobile,
  IconDeviceDesktop,
} from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import type { MorningBriefItem } from '@/types/agent';

interface MorningBriefProps {
  items: MorningBriefItem[];
  agentFirstName: string;
  generatedAt: string;
}

const typeConfig = {
  urgency: {
    Icon: IconAlertTriangle,
    iconClass: 'text-red-500',
    badgeClass: 'bg-red-100 text-red-700',
    borderClass: 'border-l-red-400',
    avatarBg: 'bg-red-100',
  },
  milestone: {
    Icon: IconTrophy,
    iconClass: 'text-[#FFD700]',
    badgeClass: 'bg-[#FFF9C4] text-[#7A4F00]',
    borderClass: 'border-l-[#FFD700]',
    avatarBg: 'bg-[#FFF9C4]',
  },
  'life-stage': {
    Icon: IconBabyCarriage,
    iconClass: 'text-game-purple',
    badgeClass: 'bg-pastel-lavender text-game-purple-deep',
    borderClass: 'border-l-game-purple',
    avatarBg: 'bg-pastel-lavender',
  },
};

const actionConfig = {
  call: { label: 'Call now', Icon: IconPhone, className: 'text-game-purple bg-pastel-lavender hover:bg-game-purple hover:text-white' },
  whatsapp: { label: 'Draft message', Icon: IconBrandWhatsapp, className: 'text-game-pink bg-game-pink-soft hover:bg-game-pink hover:text-white' },
  review: { label: 'Schedule review', Icon: IconCalendarEvent, className: 'text-game-purple bg-pastel-lavender hover:bg-game-purple hover:text-white' },
  congratulate: { label: 'Send congrats', Icon: IconBrandWhatsapp, className: 'text-[#7A4F00] bg-[#FFF9C4] hover:bg-[#FFD700] hover:text-white' },
};

function HpBar({ hpDays }: { hpDays: number }) {
  const max = 365;
  const pct = Math.min(Math.max(hpDays, 0), max) / max * 100;
  const color = hpDays <= 0 ? 'bg-red-500' : hpDays < 100 ? 'bg-game-pink' : 'bg-game-mint';
  const label = hpDays <= 0 ? 'Lapsed' : `${hpDays}d HP`;
  const track = hpDays <= 0 ? 'bg-red-100' : hpDays < 100 ? 'bg-game-pink-soft' : 'bg-game-mint/30';
  return (
    <div className="flex items-center gap-2">
      <div className={cn('flex-1 h-2 rounded-full overflow-hidden', track)}>
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn('text-xs font-bold shrink-0', hpDays <= 0 ? 'text-red-600' : hpDays < 100 ? 'text-game-pink' : 'text-[#065F46]')}>
        {label}
      </span>
    </div>
  );
}

function ConfidencePip({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1 text-xs text-game-purple/60">
      <IconTargetArrow size={11} />
      <span>{score}% confidence</span>
    </div>
  );
}

function BriefCard({
  item,
  index,
  onDraft,
  onDismiss,
}: {
  item: MorningBriefItem;
  index: number;
  onDraft: (item: MorningBriefItem) => void;
  onDismiss: (id: string) => void;
}) {
  const [done, setDone] = useState(false);
  const config = typeConfig[item.type];
  const action = actionConfig[item.suggestedAction];

  function handleDone() {
    setDone(true);
    setTimeout(() => onDismiss(item.id), 350);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: done ? 0 : 1, x: done ? 20 : 0 }}
      transition={{ duration: done ? 0.3 : 0.3, delay: done ? 0 : index * 0.06 }}
      className={cn(
        'bg-card-cream rounded-2xl border-2 border-card-outline/40 border-l-4 shadow-sm',
        config.borderClass
      )}
    >
      <div className="px-4 pt-3.5 pb-3">
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border-2 border-card-outline/30',
            config.avatarBg, 'text-game-text'
          )}>
            {item.clientAvatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-game-text">{item.clientName}</span>
              <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full', config.badgeClass)}>
                <config.Icon size={10} />
                {item.tag}
              </span>
              {item.priority === 'high' && (
                <span className="text-xs font-bold text-game-pink uppercase tracking-wide">Urgent</span>
              )}
            </div>
          </div>
          <button
            onClick={handleDone}
            className="p-1.5 rounded-xl text-card-outline/40 hover:text-game-mint hover:bg-game-mint/30 transition-colors shrink-0"
            aria-label="Mark as done"
            title="Mark done"
          >
            <IconCheck size={15} />
          </button>
        </div>

        <p className="text-sm text-game-text leading-snug mt-2.5">{item.insight}</p>
        <p className="text-xs text-game-purple/60 mt-1">{item.detail}</p>

        {item.hpDays !== null && (
          <div className="mt-2.5">
            <HpBar hpDays={item.hpDays} />
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap mt-2.5">
          <div className="flex items-center gap-1 text-xs text-game-purple/60">
            <IconClockHour4 size={11} />
            {item.daysSinceContact !== null
              ? item.daysSinceContact === 0 ? 'Contacted today' : `Last contact: ${item.daysSinceContact}d ago`
              : 'Never contacted'}
          </div>
          <div className="flex items-center gap-1 text-xs text-game-pink font-semibold">
            <IconShieldCheck size={11} />
            {item.suggestedTiming}
          </div>
          <ConfidencePip score={item.confidenceScore} />
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => onDraft(item)}
            className={cn(
              'flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-2xl transition-colors',
              action.className
            )}
          >
            <action.Icon size={13} />
            {action.label}
          </button>
          {item.suggestedAction !== 'call' && (
            <a
              href={`tel:${item.phone}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-game-purple px-2.5 py-1.5 rounded-2xl hover:bg-pastel-lavender transition-colors"
            >
              <IconPhone size={13} />
              Call
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const priorityOrder = { high: 0, medium: 1, low: 2 };
const PAGE_SIZE = 3;

export function MorningBrief({ items, agentFirstName, generatedAt }: MorningBriefProps) {
  const [expanded, setExpanded] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [draftTarget, setDraftTarget] = useState<MorningBriefItem | null>(null);
  const [page, setPage] = useState(0);

  const visible = [...items]
    .filter(i => !dismissed.has(i.id))
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const pageCount = Math.ceil(visible.length / PAGE_SIZE);
  const paged = visible.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => {
    if (page > 0 && page >= pageCount) setPage(Math.max(0, pageCount - 1));
  }, [page, pageCount]);

  const urgentCount = visible.filter(i => i.type === 'urgency').length;
  const milestoneCount = visible.filter(i => i.type === 'milestone').length;
  const lifeStageCount = visible.filter(i => i.type === 'life-stage').length;
  const overdueContact = visible.filter(i => (i.daysSinceContact ?? 0) > 30).length;

  async function handleRefresh() {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1400));
    setDismissed(new Set());
    setPage(0);
    setRefreshing(false);
  }

  return (
    <>
      <div className="bg-card-cream rounded-3xl border-2 border-card-outline/60 overflow-hidden shadow-[0_4px_20px_rgba(107,33,217,0.10)]">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between bg-pastel-lavender border-b-2 border-card-outline/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-game-purple flex items-center justify-center shrink-0">
              <IconSparkles size={18} className="text-white" />
            </div>
            <div>
              <p className="text-game-text font-bold leading-tight font-handwriting text-base">
                Morning Brief — {agentFirstName}!
              </p>
              <p className="text-game-purple/60 text-xs mt-0.5">
                Generated at {generatedAt} · {visible.length} active insight{visible.length !== 1 ? 's' : ''}
                {overdueContact > 0 && (
                  <span className="text-game-pink ml-1">· {overdueContact} overdue</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-xl text-game-purple hover:bg-card-outline/10 transition-colors"
              aria-label="Refresh brief"
            >
              <IconRefresh size={15} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setExpanded(v => !v)}
              className="p-2 rounded-xl text-game-purple hover:bg-card-outline/10 transition-colors"
            >
              {expanded ? <IconChevronUp size={15} /> : <IconChevronDown size={15} />}
            </button>
          </div>
        </div>

        {/* Summary pills */}
        <div className="px-5 py-3 flex items-center gap-2 flex-wrap">
          {urgentCount > 0 && (
            <div className="flex items-center gap-1.5 bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full">
              <IconAlertTriangle size={11} />
              {urgentCount} urgent
            </div>
          )}
          {milestoneCount > 0 && (
            <div className="flex items-center gap-1.5 bg-[#FFF9C4] text-[#7A4F00] text-xs font-bold px-3 py-1.5 rounded-full">
              <IconTrophy size={11} />
              {milestoneCount} milestone{milestoneCount !== 1 ? 's' : ''}
            </div>
          )}
          {lifeStageCount > 0 && (
            <div className="flex items-center gap-1.5 bg-pastel-lavender text-game-purple-deep text-xs font-bold px-3 py-1.5 rounded-full">
              <IconBabyCarriage size={11} />
              {lifeStageCount} life stage
            </div>
          )}
          {overdueContact > 0 && (
            <div className="flex items-center gap-1.5 bg-game-peach text-[#92400E] text-xs font-bold px-3 py-1.5 rounded-full">
              <IconClockHour4 size={11} />
              {overdueContact} overdue contact{overdueContact !== 1 ? 's' : ''}
            </div>
          )}
          {dismissed.size > 0 && (
            <div className="flex items-center gap-1.5 bg-game-mint text-[#065F46] text-xs font-medium px-3 py-1.5 rounded-full">
              <IconCheck size={11} />
              {dismissed.size} done
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <AnimatePresence>
        {expanded && visible.length > 0 && (
          <motion.div
            key="cards"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-2.5 mt-3">
              <AnimatePresence>
                {paged.map((item, i) => (
                  <BriefCard
                    key={item.id}
                    item={item}
                    index={i}
                    onDraft={setDraftTarget}
                    onDismiss={id => setDismissed(prev => new Set([...prev, id]))}
                  />
                ))}
              </AnimatePresence>
            </div>

            {pageCount > 1 && (
              <div className="flex items-center justify-center gap-3 mt-4 pb-1">
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

            <p className="text-center text-xs text-game-purple/50 mt-2 pb-1">
              You decide who to contact first — and what to say.
            </p>
          </motion.div>
        )}

        {expanded && visible.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 text-sm text-game-purple"
          >
            <IconHeart size={20} className="mx-auto mb-2 text-game-pink" />
            All insights actioned. Great work today! 🎉
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draft sheet */}
      <AnimatePresence>
        {draftTarget && (
          <InlineDraftSheet item={draftTarget} onClose={() => setDraftTarget(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

function buildBriefDraft(item: MorningBriefItem): string {
  const firstName = item.clientName.split(' ')[0];
  if (item.type === 'urgency' && item.tag === 'Renewal Overdue') {
    return `Hi ${firstName}! 👋 This is Farah from SecureLife Insurance.\n\nI noticed your policy has lapsed and wanted to reach out personally. I understand life gets busy, and I'd love to help you get your coverage reinstated as quickly as possible.\n\nWould you be free for a quick 5-minute call this week? I'll make it easy for you. 😊`;
  }
  if (item.type === 'life-stage') {
    return `Hi ${firstName}! 🎉 Congratulations on your new arrival — what an exciting time!\n\nAs your advisor, I just wanted to make sure your protection is keeping up with this new chapter. A growing family often means it's worth reviewing your coverage.\n\nWould you like to set up a short call when things settle down a little? 😊`;
  }
  if (item.type === 'milestone') {
    return `Hi ${firstName}! ⭐ Just wanted to reach out and say congratulations — you've hit a great milestone on your protection journey!\n\nThank you for being such a consistent client. If you'd like to chat about how your coverage is growing alongside your goals, I'm always here.\n\nTake care! 😊`;
  }
  return `Hi ${firstName}! 👋 This is Farah from SecureLife Insurance.\n\nJust checking in to see how you're doing and whether there's anything I can help with regarding your coverage.\n\nFeel free to reach out anytime! 😊`;
}

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function InlineDraftSheet({ item, onClose }: { item: MorningBriefItem; onClose: () => void }) {
  const [draft, setDraft] = useState(() => buildBriefDraft(item));
  const waAppLink = `https://wa.me/${cleanPhone(item.phone)}?text=${encodeURIComponent(draft)}`;
  const waWebLink = `https://web.whatsapp.com/send?phone=${cleanPhone(item.phone)}&text=${encodeURIComponent(draft)}`;

  return (
    <>
      <motion.div
        key="bd"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />
      <motion.div
        key="ds"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-card-cream rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col border-t-2 border-card-outline"
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-card-outline/30" />
        </div>
        <div className="px-5 py-3 border-b-2 border-card-outline/20 shrink-0 flex items-center justify-between">
          <div>
            <p className="font-handwriting text-xl text-game-text">Draft Follow-up</p>
            <p className="text-xs text-game-purple mt-0.5">To: {item.clientName} · {item.phone}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-game-purple/40 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <IconX size={16} />
          </button>
        </div>

        <div className="px-5 py-2.5 bg-pastel-lavender/50 border-b border-card-outline/15 shrink-0 flex items-center gap-3 flex-wrap">
          <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', typeConfig[item.type].badgeClass)}>
            {item.tag}
          </span>
          {item.hpDays !== null && (
            <span className="text-xs text-game-purple">
              HP: <span className={cn('font-bold', item.hpDays <= 0 ? 'text-red-500' : item.hpDays < 100 ? 'text-game-pink' : 'text-[#065F46]')}>
                {item.hpDays <= 0 ? 'Lapsed' : `${item.hpDays} days`}
              </span>
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={9}
            className="w-full rounded-2xl border-2 border-card-outline/40 bg-pastel-yellow text-game-text text-sm px-4 py-3 resize-none focus:outline-none focus:border-card-outline leading-relaxed"
          />
          <p className="text-right text-xs text-game-purple/50 mt-1">{draft.length} characters</p>
        </div>

        <div className="px-5 py-4 border-t-2 border-card-outline/15 shrink-0 space-y-3">
          <p className="text-xs font-bold text-game-text uppercase tracking-wider flex items-center gap-1.5">
            <IconBrandWhatsapp size={13} className="text-[#25D366]" />
            Open in WhatsApp — choose where
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={waAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1 py-3 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold text-xs transition-colors text-center"
            >
              <div className="flex items-center gap-1.5">
                <IconDeviceMobile size={15} />
                <span className="text-sm font-bold">App</span>
              </div>
              <span className="text-white/70 font-normal">Opens mobile app</span>
            </a>
            <a
              href={waWebLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1 py-3 rounded-2xl bg-card-cream border-2 border-[#25D366] text-[#1ebe5a] font-bold text-xs transition-colors hover:bg-game-mint/20 text-center"
            >
              <div className="flex items-center gap-1.5">
                <IconDeviceDesktop size={15} />
                <span className="text-sm font-bold">Web</span>
              </div>
              <span className="text-[#25D366]/70 font-normal">Opens in browser</span>
            </a>
          </div>
          <p className="text-center text-xs text-game-purple/50">Message pre-filled — you send it manually</p>
        </div>
      </motion.div>
    </>
  );
}

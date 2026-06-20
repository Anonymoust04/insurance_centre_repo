'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconSparkles,
  IconRefresh,
  IconAlertTriangle,
  IconTrophy,
  IconBabyCarriage,
  IconChevronDown,
  IconChevronUp,
  IconBrandWhatsapp,
  IconPhone,
  IconCalendarEvent,
  IconCheck,
  IconX,
  IconHeart,
  IconClockHour4,
  IconShieldCheck,
  IconTargetArrow,
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
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    borderClass: 'border-l-red-400',
    avatarRing: 'ring-2 ring-red-400',
  },
  milestone: {
    Icon: IconTrophy,
    iconClass: 'text-amber-500',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    borderClass: 'border-l-amber-400',
    avatarRing: 'ring-2 ring-amber-400',
  },
  'life-stage': {
    Icon: IconBabyCarriage,
    iconClass: 'text-violet-500',
    badgeClass: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    borderClass: 'border-l-violet-400',
    avatarRing: 'ring-2 ring-violet-400',
  },
};

const actionConfig = {
  call: { label: 'Call now', Icon: IconPhone, className: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30' },
  whatsapp: { label: 'Draft message', Icon: IconBrandWhatsapp, className: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30' },
  review: { label: 'Schedule review', Icon: IconCalendarEvent, className: 'text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30' },
  congratulate: { label: 'Send congrats', Icon: IconBrandWhatsapp, className: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30' },
};

function HpBar({ hpDays }: { hpDays: number }) {
  const max = 365;
  const pct = Math.min(Math.max(hpDays, 0), max) / max * 100;
  const color = hpDays <= 0 ? 'bg-red-500' : hpDays < 100 ? 'bg-amber-500' : 'bg-emerald-500';
  const label = hpDays <= 0 ? 'Lapsed' : `${hpDays}d HP`;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn('text-xs font-semibold shrink-0', hpDays <= 0 ? 'text-red-600 dark:text-red-400' : hpDays < 100 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400')}>
        {label}
      </span>
    </div>
  );
}

function ConfidencePip({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1 text-xs text-slate-400">
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
        'bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50 border-l-4 shadow-sm',
        config.borderClass
      )}
    >
      <div className="px-4 pt-3.5 pb-3">
        {/* Row 1: avatar + name + tags + dismiss */}
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5',
            'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
            config.avatarRing
          )}>
            {item.clientAvatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-900 dark:text-white">{item.clientName}</span>
              <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full', config.badgeClass)}>
                <config.Icon size={10} />
                {item.tag}
              </span>
              {item.priority === 'high' && (
                <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">Urgent</span>
              )}
            </div>
          </div>
          <button
            onClick={handleDone}
            className="p-1.5 rounded-lg text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors shrink-0"
            aria-label="Mark as done"
            title="Mark done"
          >
            <IconCheck size={15} />
          </button>
        </div>

        {/* Insight text */}
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug mt-2.5">{item.insight}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{item.detail}</p>

        {/* HP bar */}
        {item.hpDays !== null && (
          <div className="mt-2.5">
            <HpBar hpDays={item.hpDays} />
          </div>
        )}

        {/* Meta row: last contact · timing · confidence */}
        <div className="flex items-center gap-3 flex-wrap mt-2.5">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <IconClockHour4 size={11} />
            {item.daysSinceContact !== null
              ? item.daysSinceContact === 0
                ? 'Contacted today'
                : `Last contact: ${item.daysSinceContact}d ago`
              : 'Never contacted'}
          </div>
          <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
            <IconShieldCheck size={11} />
            {item.suggestedTiming}
          </div>
          <ConfidencePip score={item.confidenceScore} />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => onDraft(item)}
            className={cn(
              'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors',
              action.className
            )}
          >
            <action.Icon size={13} />
            {action.label}
          </button>
          {item.suggestedAction !== 'call' && (
            <a
              href={`tel:${item.phone}`}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
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

export function MorningBrief({ items, agentFirstName, generatedAt }: MorningBriefProps) {
  const [expanded, setExpanded] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [draftTarget, setDraftTarget] = useState<MorningBriefItem | null>(null);

  const visible = [...items]
    .filter(i => !dismissed.has(i.id))
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const urgentCount = visible.filter(i => i.type === 'urgency').length;
  const milestoneCount = visible.filter(i => i.type === 'milestone').length;
  const lifeStageCount = visible.filter(i => i.type === 'life-stage').length;
  const overdueContact = visible.filter(i => (i.daysSinceContact ?? 0) > 30).length;

  async function handleRefresh() {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1400));
    setDismissed(new Set());
    setRefreshing(false);
  }

  return (
    <>
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-2xl overflow-hidden shadow-md">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <IconSparkles size={18} className="text-amber-300" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">
                Morning Brief — Good morning, {agentFirstName}
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                Generated at {generatedAt} · {visible.length} active insight{visible.length !== 1 ? 's' : ''}
                {overdueContact > 0 && (
                  <span className="text-red-400 ml-1">· {overdueContact} overdue contact{overdueContact !== 1 ? 's' : ''}</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Refresh brief"
            >
              <IconRefresh size={15} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setExpanded(v => !v)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {expanded ? <IconChevronUp size={15} /> : <IconChevronDown size={15} />}
            </button>
          </div>
        </div>

        {/* Summary pills */}
        <div className="px-5 pb-4 flex items-center gap-2 flex-wrap">
          {urgentCount > 0 && (
            <div className="flex items-center gap-1.5 bg-red-500/20 text-red-300 text-xs font-semibold px-3 py-1.5 rounded-full">
              <IconAlertTriangle size={11} />
              {urgentCount} urgent
            </div>
          )}
          {milestoneCount > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full">
              <IconTrophy size={11} />
              {milestoneCount} milestone{milestoneCount !== 1 ? 's' : ''}
            </div>
          )}
          {lifeStageCount > 0 && (
            <div className="flex items-center gap-1.5 bg-violet-500/20 text-violet-300 text-xs font-semibold px-3 py-1.5 rounded-full">
              <IconBabyCarriage size={11} />
              {lifeStageCount} life stage
            </div>
          )}
          {overdueContact > 0 && (
            <div className="flex items-center gap-1.5 bg-orange-500/20 text-orange-300 text-xs font-semibold px-3 py-1.5 rounded-full">
              <IconClockHour4 size={11} />
              {overdueContact} overdue contact{overdueContact !== 1 ? 's' : ''}
            </div>
          )}
          {dismissed.size > 0 && (
            <div className="flex items-center gap-1.5 bg-white/10 text-slate-400 text-xs font-medium px-3 py-1.5 rounded-full">
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
                {visible.map((item, i) => (
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
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3 pb-1">
              You decide who to contact first — and what to say.
            </p>
          </motion.div>
        )}

        {expanded && visible.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 text-sm text-slate-400"
          >
            <IconHeart size={20} className="mx-auto mb-2 text-emerald-400" />
            All insights actioned. Great work today!
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
  if (item.tag === 'Coverage Gap' || item.tag === 'HP Warning') {
    return `Hi ${firstName}! 👋 This is Farah from SecureLife Insurance.\n\nI've been reviewing your account and noticed there may be a gap in your current coverage. I'd love to walk you through a quick review — it won't take long and could make a real difference.\n\nAre you free for a short call this week?`;
  }
  return `Hi ${firstName}! 👋 This is Farah from SecureLife Insurance.\n\nJust checking in to see how you're doing and whether there's anything I can help with regarding your coverage.\n\nFeel free to reach out anytime! 😊`;
}

function InlineDraftSheet({ item, onClose }: { item: MorningBriefItem; onClose: () => void }) {
  const [draft, setDraft] = useState(() => buildBriefDraft(item));

  const waLink = `https://wa.me/${item.phone.replace(/[\s\-\+()]/g, '')}?text=${encodeURIComponent(draft)}`;

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
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700/60 shrink-0 flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Draft Follow-up</p>
            <p className="text-xs text-slate-500 mt-0.5">
              To: {item.clientName} · {item.phone}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <IconX size={16} />
          </button>
        </div>

        {/* Context strip */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-700/40 shrink-0 flex items-center gap-4 flex-wrap">
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            typeConfig[item.type].badgeClass
          )}>
            {item.tag}
          </span>
          {item.hpDays !== null && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              HP: <span className={cn('font-semibold', item.hpDays <= 0 ? 'text-red-500' : item.hpDays < 100 ? 'text-amber-500' : 'text-emerald-600')}>
                {item.hpDays <= 0 ? 'Lapsed' : `${item.hpDays} days`}
              </span>
            </span>
          )}
          {item.daysSinceContact !== null && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Last contact: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.daysSinceContact}d ago</span>
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            rows={9}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent leading-relaxed"
          />
          <p className="text-right text-xs text-slate-400 mt-1">{draft.length} characters</p>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700/60 shrink-0 space-y-2">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold text-sm transition-colors shadow-sm"
          >
            <IconBrandWhatsapp size={20} />
            Open in WhatsApp
          </a>
          <p className="text-center text-xs text-slate-400">You send the message manually in WhatsApp</p>
        </div>
      </motion.div>
    </>
  );
}

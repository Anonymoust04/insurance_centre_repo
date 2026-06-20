'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconBrandWhatsapp,
  IconCopy,
  IconCheck,
  IconSparkles,
  IconHeart,
  IconBriefcase,
  IconStar,
} from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import { ClientSelect } from './ClientSelect';
import { generateFollowUpDrafts } from '@/lib/aiAdvisorLogic';
import type { CustomerProfile, FollowUpDraft } from '@/types/agent';

interface FollowUpDraftGeneratorProps {
  customers: CustomerProfile[];
}

type Tone = 'warm' | 'professional' | 'friendly';

const toneConfig: Record<Tone, { label: string; desc: string; icon: React.ElementType; color: string; activeColor: string }> = {
  warm: {
    label: 'Warm',
    desc: 'Caring & personal',
    icon: IconHeart,
    color: 'border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-400',
    activeColor: 'bg-rose-600 border-rose-600 text-white',
  },
  professional: {
    label: 'Professional',
    desc: 'Formal & clear',
    icon: IconBriefcase,
    color: 'border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400',
    activeColor: 'bg-blue-600 border-blue-600 text-white',
  },
  friendly: {
    label: 'Friendly',
    desc: 'Casual & fun',
    icon: IconStar,
    color: 'border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400',
    activeColor: 'bg-amber-500 border-amber-500 text-white',
  },
};

function DraftCard({ draft, index }: { draft: FollowUpDraft; index: number }) {
  const [editedText, setEditedText] = useState(draft.draft);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-slate-800 dark:text-white">{draft.label}</span>
        </div>
        <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
          AI Suggested · Edit before sending
        </span>
      </div>

      <textarea
        value={editedText}
        onChange={e => setEditedText(e.target.value)}
        rows={5}
        className="w-full text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
      />

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all',
            copied
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          )}
        >
          {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
          {copied ? 'Copied!' : 'Copy Draft'}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(editedText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
        >
          <IconBrandWhatsapp size={13} />
          Open WhatsApp Manually
        </a>
      </div>
    </motion.div>
  );
}

export function FollowUpDraftGenerator({ customers }: FollowUpDraftGeneratorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tone, setTone] = useState<Tone>('warm');
  const [generated, setGenerated] = useState(false);

  const selectedCustomer = customers.find(c => c.id === selectedId) ?? null;

  const output = selectedCustomer && generated
    ? generateFollowUpDrafts(selectedCustomer, tone)
    : null;

  const handleGenerate = () => {
    if (selectedCustomer) setGenerated(true);
  };

  const handleToneChange = (t: Tone) => {
    setTone(t);
    setGenerated(false);
  };

  return (
    <div className="space-y-5">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
        <IconSparkles size={16} className="text-emerald-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Advisor reviews before sending · Never auto-sends</p>
          <p className="text-xs text-emerald-600/80 dark:text-emerald-400/60 mt-0.5">Draft suggestions are generated from client profile data. You own the relationship — always review and personalise before sending.</p>
        </div>
      </div>

      {/* Client selector */}
      <ClientSelect
        customers={customers}
        selectedId={selectedId}
        onChange={id => { setSelectedId(id); setGenerated(false); }}
        label="Select Client"
      />

      {/* Tone selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tone</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(toneConfig) as [Tone, typeof toneConfig[Tone]][]).map(([key, cfg]) => {
            const isActive = tone === key;
            return (
              <button
                key={key}
                onClick={() => handleToneChange(key)}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all',
                  isActive ? cfg.activeColor : `bg-white dark:bg-slate-800 ${cfg.color} hover:opacity-80`
                )}
              >
                <cfg.icon size={16} />
                <span>{cfg.label}</span>
                <span className={cn('text-xs opacity-70', isActive ? 'text-white/80' : '')}>{cfg.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate button */}
      <button
        disabled={!selectedCustomer}
        onClick={handleGenerate}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all',
          selectedCustomer
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
        )}
      >
        <IconSparkles size={15} />
        Generate 3 Draft Options
      </button>

      {/* Draft results */}
      <AnimatePresence>
        {output && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">3 Draft Options for {output.customer.fullName.split(' ')[0]}</h3>
              <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full capitalize">{tone} tone</span>
            </div>
            {output.drafts.map((d, i) => (
              <DraftCard key={i} draft={d} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

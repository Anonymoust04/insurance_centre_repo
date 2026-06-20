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

const toneConfig: Record<Tone, { label: string; desc: string; icon: React.ElementType; idle: string; active: string }> = {
  warm: {
    label: 'Warm',
    desc: 'Caring & personal',
    icon: IconHeart,
    idle: 'bg-card-cream border-game-pink-soft text-game-pink',
    active: 'bg-game-pink border-game-pink text-white',
  },
  professional: {
    label: 'Professional',
    desc: 'Formal & clear',
    icon: IconBriefcase,
    idle: 'bg-card-cream border-pastel-lavender text-game-purple',
    active: 'bg-game-purple border-game-purple text-white',
  },
  friendly: {
    label: 'Friendly',
    desc: 'Casual & fun',
    icon: IconStar,
    idle: 'bg-card-cream border-pastel-yellow text-[#C05621]',
    active: 'bg-[#C05621] border-[#C05621] text-white',
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
      className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/50 shadow-sm space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-xl bg-game-purple flex items-center justify-center text-xs font-bold text-white">
            {index + 1}
          </span>
          <span className="text-sm font-bold text-game-text">{draft.label}</span>
        </div>
        <span className="text-xs font-semibold text-game-purple bg-pastel-lavender px-2 py-0.5 rounded-full">
          Edit before sending
        </span>
      </div>

      <textarea
        value={editedText}
        onChange={e => setEditedText(e.target.value)}
        rows={5}
        className="w-full text-sm text-game-text bg-pastel-yellow border-2 border-card-outline/40 rounded-2xl p-3 resize-none focus:outline-none focus:border-card-outline leading-relaxed"
      />

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all border-2',
            copied
              ? 'bg-game-mint border-game-mint text-[#065F46]'
              : 'bg-card-cream border-card-outline/40 text-game-text hover:border-card-outline'
          )}
        >
          {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
          {copied ? 'Copied!' : 'Copy Draft'}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(editedText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#25D366] border-2 border-[#25D366] text-white text-xs font-bold hover:opacity-90 transition-opacity"
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
  const output = selectedCustomer && generated ? generateFollowUpDrafts(selectedCustomer, tone) : null;

  const handleToneChange = (t: Tone) => {
    setTone(t);
    setGenerated(false);
  };

  return (
    <div className="space-y-5">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-game-pink-soft rounded-3xl border-2 border-game-pink/30">
        <IconSparkles size={16} className="text-game-pink mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-game-text">Advisor reviews before sending · Never auto-sends</p>
          <p className="text-xs text-game-purple/70 mt-0.5">Draft suggestions are generated from client profile data. You own the relationship — always review before sending.</p>
        </div>
      </div>

      <ClientSelect
        customers={customers}
        selectedId={selectedId}
        onChange={id => { setSelectedId(id); setGenerated(false); }}
        label="Select Client"
      />

      {/* Tone selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-game-text uppercase tracking-wider">Tone</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(toneConfig) as [Tone, typeof toneConfig[Tone]][]).map(([key, cfg]) => {
            const isActive = tone === key;
            return (
              <button
                key={key}
                onClick={() => handleToneChange(key)}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 text-xs font-bold transition-all',
                  isActive ? cfg.active : cfg.idle
                )}
              >
                <cfg.icon size={16} />
                <span>{cfg.label}</span>
                <span className="text-xs opacity-70 font-normal">{cfg.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate button */}
      <motion.button
        disabled={!selectedCustomer}
        onClick={() => selectedCustomer && setGenerated(true)}
        whileHover={selectedCustomer ? { scale: 1.02 } : {}}
        whileTap={selectedCustomer ? { scale: 0.97 } : {}}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all border-2',
          selectedCustomer
            ? 'bg-game-pink border-game-pink text-white shadow-sm hover:opacity-90'
            : 'bg-pastel-yellow border-card-outline/20 text-game-purple/40 cursor-not-allowed'
        )}
      >
        <IconSparkles size={15} />
        Generate 3 Draft Options ✨
      </motion.button>

      {/* Draft results */}
      <AnimatePresence>
        {output && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <h3 className="font-handwriting text-xl text-game-text">3 Drafts for {output.customer.fullName.split(' ')[0]}</h3>
              <span className="text-xs font-bold text-game-purple bg-pastel-lavender px-2 py-0.5 rounded-full capitalize">{tone} tone</span>
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

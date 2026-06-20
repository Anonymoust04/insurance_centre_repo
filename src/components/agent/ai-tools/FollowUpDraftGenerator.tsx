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
  IconLoader2,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import { ClientSelect } from './ClientSelect';
import { generateFollowUpDrafts } from '@/lib/aiAdvisorLogic';
import waTemplatesRaw from '@/data/waTemplates.json';
import type { CustomerProfile, FollowUpDraft } from '@/types/agent';

interface FollowUpDraftGeneratorProps {
  customers: CustomerProfile[];
}

type Tone = 'warm' | 'professional' | 'friendly';
type GenerateStatus = 'idle' | 'loading' | 'success' | 'error';

interface WATemplate {
  id: string;
  category: string;
  emoji: string;
  label: string;
  message: string;
}

const waTemplates = waTemplatesRaw as WATemplate[];

// Strip all non-digits from phone for wa.me link (e.g. "+60 12-345 6789" → "60123456789")
function toWAPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function waLink(phone: string, text: string): string {
  const cleanPhone = toWAPhone(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

function interpolate(template: string, name: string): string {
  return template.replace(/\{name\}/g, name);
}

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

// ── Quick Template Card ─────────────────────────────────────────────────────

function QuickTemplateCard({
  template,
  customerName,
  phone,
}: {
  template: WATemplate;
  customerName: string;
  phone: string;
}) {
  const firstName = customerName.split(' ')[0];
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState(interpolate(template.message, firstName));
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-card-cream rounded-2xl border-2 border-card-outline/40 overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pastel-yellow/50 transition-colors text-left"
      >
        <span className="text-xl shrink-0">{template.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-game-text truncate">{template.label}</p>
          <p className="text-xs text-game-purple/60">{template.category}</p>
        </div>
        {expanded ? (
          <IconChevronUp size={15} className="text-game-purple/40 shrink-0" />
        ) : (
          <IconChevronDown size={15} className="text-game-purple/40 shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t-2 border-card-outline/20 pt-3">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={4}
                className="w-full text-sm text-game-text bg-pastel-yellow border-2 border-card-outline/40 rounded-2xl p-3 resize-none focus:outline-none focus:border-card-outline leading-relaxed"
              />
              <p className="text-xs text-game-purple/40 italic">⚠ Advisor review required before sending.</p>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleCopy}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2',
                    copied
                      ? 'bg-game-mint border-game-mint text-[#065F46]'
                      : 'bg-card-cream border-card-outline/40 text-game-text hover:border-card-outline'
                  )}
                >
                  {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <a
                  href={waLink(phone, text)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] border-2 border-[#25D366] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  <IconBrandWhatsapp size={13} />
                  Send to {firstName}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Generated Draft Card ────────────────────────────────────────────────────

function DraftCard({
  draft,
  index,
  phone,
  customerFirstName,
  isAI,
}: {
  draft: FollowUpDraft;
  index: number;
  phone: string;
  customerFirstName: string;
  isAI?: boolean;
}) {
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
        <div className="flex items-center gap-1.5">
          {isAI && (
            <span className="text-xs font-bold bg-game-purple text-white px-2 py-0.5 rounded-full flex items-center gap-1">
              <IconSparkles size={9} />Gemini
            </span>
          )}
          <span className="text-xs font-semibold text-game-purple bg-pastel-lavender px-2 py-0.5 rounded-full">
            Edit before sending
          </span>
        </div>
      </div>

      <textarea
        value={editedText}
        onChange={e => setEditedText(e.target.value)}
        rows={5}
        className="w-full text-sm text-game-text bg-pastel-yellow border-2 border-card-outline/40 rounded-2xl p-3 resize-none focus:outline-none focus:border-card-outline leading-relaxed"
      />

      <p className="text-xs text-game-purple/40 italic">⚠ Advisor review required before sending.</p>

      <div className="flex items-center gap-2 flex-wrap">
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
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <a
          href={waLink(phone, editedText)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#25D366] border-2 border-[#25D366] text-white text-xs font-bold hover:opacity-90 transition-opacity"
        >
          <IconBrandWhatsapp size={13} />
          Send to {customerFirstName}
        </a>
      </div>
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

// Group templates by category for display
const templatesByCategory = waTemplates.reduce<Record<string, WATemplate[]>>((acc, t) => {
  if (!acc[t.category]) acc[t.category] = [];
  acc[t.category].push(t);
  return acc;
}, {});

const categoryOrder = ['Follow-up', 'HP Warning', 'Mission & Rewards', 'New Product', 'Review', 'Life Stage'];

export function FollowUpDraftGenerator({ customers }: FollowUpDraftGeneratorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tone, setTone] = useState<Tone>('warm');
  const [drafts, setDrafts] = useState<FollowUpDraft[] | null>(null);
  const [isAI, setIsAI] = useState(false);
  const [status, setStatus] = useState<GenerateStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(categoryOrder[0]);

  const selectedCustomer = customers.find(c => c.id === selectedId) ?? null;

  const handleToneChange = (t: Tone) => {
    setTone(t);
    setDrafts(null);
    setStatus('idle');
  };

  const handleSelectChange = (id: string | null) => {
    setSelectedId(id);
    setDrafts(null);
    setStatus('idle');
    setError(null);
  };

  const generateWithGemini = async () => {
    if (!selectedCustomer) return;
    setStatus('loading');
    setError(null);
    setIsAI(true);

    const hp = selectedCustomer.protectionHpDays ?? selectedCustomer.hpDays;
    const hpStatus = hp === 0 ? 'Lapsed' : hp <= 60 ? 'Critical' : hp < 100 ? 'Urgent' : 'Healthy';

    try {
      const res = await fetch('/api/ai/follow-up-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: selectedCustomer.fullName,
          occupation: selectedCustomer.occupation,
          lifeStage: selectedCustomer.lifeStage ?? 'Not specified',
          hpDays: hp,
          hpStatus,
          tone,
          missingCoverage: selectedCustomer.missingCoverage ?? [],
          suggestedNextProduct: selectedCustomer.suggestedNextProduct ?? 'current coverage review',
          paymentStreak: selectedCustomer.paymentStreak,
        }),
      });

      const data = (await res.json()) as {
        drafts?: Array<{ label: string; text: string }>;
        error?: string;
      };

      if (!res.ok || data.error) throw new Error(data.error ?? 'AI generation failed.');

      const asDrafts: FollowUpDraft[] = (data.drafts ?? []).map(d => ({
        tone,
        label: d.label,
        draft: d.text,
      }));
      setDrafts(asDrafts);
      setStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI generation failed.';
      setError(message);
      setStatus('error');
      setIsAI(false);
      setDrafts(generateFollowUpDrafts(selectedCustomer, tone).drafts);
    }
  };

  const generateWithLocal = () => {
    if (!selectedCustomer) return;
    setIsAI(false);
    setError(null);
    setDrafts(generateFollowUpDrafts(selectedCustomer, tone).drafts);
    setStatus('success');
  };

  const firstName = selectedCustomer?.fullName.split(' ')[0] ?? '';
  const phone = selectedCustomer?.phone ?? '';

  return (
    <div className="space-y-6">
      {/* Safety disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-game-pink-soft rounded-3xl border-2 border-game-pink/30">
        <IconBrandWhatsapp size={16} className="text-game-pink mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-game-text">Advisor reviews before sending · Never auto-sends</p>
          <p className="text-xs text-game-purple/70 mt-0.5">
            All WhatsApp buttons open a chat for you to send manually. Messages go directly to the client&apos;s number. You own the relationship.
          </p>
        </div>
      </div>

      <ClientSelect
        customers={customers}
        selectedId={selectedId}
        onChange={handleSelectChange}
        label="Select Client"
      />

      {/* ── SECTION 1: Quick Templates ───────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="font-handwriting text-xl text-game-text">Quick Templates</h3>
          <span className="text-xs font-bold text-game-purple bg-pastel-lavender px-2 py-0.5 rounded-full">
            {waTemplates.length} ready
          </span>
        </div>
        <p className="text-xs text-game-purple/60">
          {selectedCustomer
            ? `Tap any template to expand, edit, then open WhatsApp with ${firstName}&apos;s number pre-filled.`
            : 'Select a client above to activate WhatsApp quick-send.'}
        </p>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          {categoryOrder.filter(cat => templatesByCategory[cat]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2',
                activeCategory === cat
                  ? 'bg-game-purple border-game-purple text-white'
                  : 'bg-card-cream border-card-outline/30 text-game-purple hover:border-card-outline/60'
              )}
            >
              {templatesByCategory[cat][0].emoji} {cat}
            </button>
          ))}
        </div>

        {/* Template list for active category */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="space-y-2"
          >
            {(templatesByCategory[activeCategory] ?? []).map(template => (
              selectedCustomer ? (
                <QuickTemplateCard
                  key={template.id}
                  template={template}
                  customerName={selectedCustomer.fullName}
                  phone={phone}
                />
              ) : (
                <div
                  key={template.id}
                  className="bg-card-cream rounded-2xl border-2 border-card-outline/20 px-4 py-3 flex items-center gap-3 opacity-40"
                >
                  <span className="text-xl">{template.emoji}</span>
                  <div>
                    <p className="text-sm font-bold text-game-text">{template.label}</p>
                    <p className="text-xs text-game-purple/60">{template.category}</p>
                  </div>
                </div>
              )
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-card-outline/20" />
        <span className="text-xs font-bold text-game-purple/40 uppercase tracking-wider">or generate custom drafts</span>
        <div className="flex-1 h-px bg-card-outline/20" />
      </div>

      {/* ── SECTION 2: AI / Tone-Based Drafts ───────────────────────────── */}
      <div className="space-y-4">
        <h3 className="font-handwriting text-xl text-game-text">Custom Draft Generator</h3>

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

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border-2 border-red-200 rounded-2xl">
            <p className="text-xs font-bold text-red-600">AI Error — showing local drafts instead</p>
            <p className="text-xs text-red-500 mt-0.5">{error}</p>
          </div>
        )}

        {/* Generate buttons */}
        <div className="flex gap-2">
          <motion.button
            disabled={!selectedCustomer || status === 'loading'}
            onClick={generateWithGemini}
            whileHover={selectedCustomer && status !== 'loading' ? { scale: 1.02 } : {}}
            whileTap={selectedCustomer && status !== 'loading' ? { scale: 0.97 } : {}}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all border-2',
              selectedCustomer && status !== 'loading'
                ? 'bg-game-purple border-game-purple text-white shadow-sm hover:opacity-90'
                : 'bg-pastel-lavender border-card-outline/20 text-game-purple/40 cursor-not-allowed'
            )}
          >
            {status === 'loading' ? (
              <>
                <IconLoader2 size={15} className="animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <IconSparkles size={15} />
                Gemini AI ✨
              </>
            )}
          </motion.button>

          <motion.button
            disabled={!selectedCustomer}
            onClick={generateWithLocal}
            whileHover={selectedCustomer ? { scale: 1.02 } : {}}
            whileTap={selectedCustomer ? { scale: 0.97 } : {}}
            className={cn(
              'px-4 py-3.5 rounded-2xl text-sm font-bold transition-all border-2',
              selectedCustomer
                ? 'bg-card-cream border-card-outline/50 text-game-text hover:border-card-outline'
                : 'bg-pastel-yellow border-card-outline/20 text-game-purple/40 cursor-not-allowed'
            )}
          >
            Local
          </motion.button>
        </div>

        {/* Draft results */}
        <AnimatePresence>
          {drafts && drafts.length > 0 && selectedCustomer && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="font-handwriting text-xl text-game-text">
                  3 Drafts for {firstName}
                </h4>
                <span className="text-xs font-bold text-game-purple bg-pastel-lavender px-2 py-0.5 rounded-full capitalize">{tone}</span>
                {isAI && (
                  <span className="text-xs font-bold bg-game-purple text-white px-2 py-0.5 rounded-full flex items-center gap-1 ml-auto">
                    <IconSparkles size={9} />Gemini AI
                  </span>
                )}
              </div>
              {/* Phone indicator */}
              <div className="flex items-center gap-2 text-xs text-game-purple/60 bg-pastel-lavender/50 px-3 py-2 rounded-xl border border-card-outline/20">
                <IconBrandWhatsapp size={13} className="text-[#25D366]" />
                WhatsApp will open a chat with {firstName} at {phone}
              </div>
              {drafts.map((d, i) => (
                <DraftCard
                  key={i}
                  draft={d}
                  index={i}
                  phone={phone}
                  customerFirstName={firstName}
                  isAI={isAI}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

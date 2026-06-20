'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconSparkles,
  IconUser,
  IconShield,
  IconListCheck,
  IconFlame,
  IconCheck,
  IconCopy,
  IconPrinter,
  IconCircleCheck,
  IconBulb,
  IconLoader2,
} from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import { ClientSelect } from './ClientSelect';
import { generateMeetingPrep } from '@/lib/aiAdvisorLogic';
import type { CustomerProfile } from '@/types/agent';

interface MeetingPrepCardProps {
  customers: CustomerProfile[];
}

type AIStatus = 'idle' | 'loading' | 'success' | 'error';

interface AIMeetingPrep {
  opener: string;
  insights: string[];
  recommendation: string;
}

function HpStatusChip({ status, days }: { status: string; days: number }) {
  const cfg = {
    Healthy: 'bg-game-mint text-[#065F46]',
    Urgent: 'bg-game-peach text-[#92400E]',
    Critical: 'bg-game-pink-soft text-game-pink',
    Lapsed: 'bg-red-500 text-white',
  }[status] ?? 'bg-pastel-lavender text-game-purple';

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold', cfg)}>
      <IconShield size={11} />
      {status}{days > 0 ? ` · ${days}d` : ''}
    </span>
  );
}

export function MeetingPrepCard({ customers }: MeetingPrepCardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [markedPrepared, setMarkedPrepared] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiCopied, setAiCopied] = useState(false);
  const [aiStatus, setAiStatus] = useState<AIStatus>('idle');
  const [aiPrep, setAiPrep] = useState<AIMeetingPrep | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const selectedCustomer = customers.find(c => c.id === selectedId) ?? null;
  const prep = selectedCustomer ? generateMeetingPrep(selectedCustomer) : null;

  const handleSelectChange = (id: string | null) => {
    setSelectedId(id);
    setMarkedPrepared(false);
    setAiPrep(null);
    setAiStatus('idle');
    setAiError(null);
  };

  const handleCopyOpener = () => {
    if (!prep) return;
    const text = aiStatus === 'success' && aiPrep ? aiPrep.opener : prep.conversationOpener;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyAI = () => {
    if (!aiPrep) return;
    const text = `Opener:\n${aiPrep.opener}\n\nKey Insights:\n${aiPrep.insights.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nRecommendation:\n${aiPrep.recommendation}`;
    navigator.clipboard.writeText(text).then(() => {
      setAiCopied(true);
      setTimeout(() => setAiCopied(false), 2000);
    });
  };

  const handleGenerateAI = async () => {
    if (!selectedCustomer || !prep) return;
    setAiStatus('loading');
    setAiError(null);

    try {
      const res = await fetch('/api/ai/meeting-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: selectedCustomer.fullName,
          occupation: selectedCustomer.occupation,
          city: selectedCustomer.city ?? '',
          lifeStage: prep.lifeStage,
          energyType: prep.energyType,
          hpDays: prep.hpDays,
          hpStatus: prep.hpStatus,
          covered: prep.coverageSummary,
          missing: selectedCustomer.missingCoverage ?? [],
          lastMission: prep.missionsCompleted,
          unclaimedBoosters: prep.unclaimedBoosters,
          paymentStreak: selectedCustomer.paymentStreak,
          satisfactionScore: selectedCustomer.satisfactionScore,
          suggestedProduct: prep.suggestedProduct,
        }),
      });

      const data = (await res.json()) as { opener?: string; insights?: string[]; recommendation?: string; error?: string };

      if (!res.ok || data.error) {
        throw new Error(data.error ?? 'AI generation failed.');
      }

      setAiPrep({
        opener: data.opener ?? '',
        insights: data.insights ?? [],
        recommendation: data.recommendation ?? '',
      });
      setAiStatus('success');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI generation failed.');
      setAiStatus('error');
    }
  };

  return (
    <div className="space-y-5">
      {/* Safety disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-pastel-lavender rounded-3xl border-2 border-card-outline/40">
        <IconSparkles size={16} className="text-game-purple mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-game-text">AI Suggested · One-page meeting prep</p>
          <p className="text-xs text-game-purple/70 mt-0.5">Generated from client profile data. Review and personalise before your meeting — you know your client best.</p>
        </div>
      </div>

      <ClientSelect
        customers={customers}
        selectedId={selectedId}
        onChange={handleSelectChange}
        label="Select Client"
      />

      <AnimatePresence>
        {prep && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Header card */}
            <div className="bg-game-purple rounded-3xl p-5 text-white shadow-[0_4px_20px_rgba(107,33,217,0.25)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0 border-2 border-white/30">
                  {selectedCustomer.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-handwriting text-xl leading-tight">{selectedCustomer.fullName}</p>
                  <p className="text-white/70 text-sm">{selectedCustomer.occupation} · {selectedCustomer.city ?? ''}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <HpStatusChip status={prep.hpStatus} days={prep.hpDays} />
                    <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      <IconUser size={11} />
                      {prep.lifeStage}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Energy Type', value: prep.energyType, icon: IconSparkles, bg: 'bg-pastel-lavender' },
                { label: 'Payment Streak', value: `${selectedCustomer.paymentStreak} months`, icon: IconFlame, bg: 'bg-game-peach' },
                { label: 'Satisfaction', value: `${selectedCustomer.satisfactionScore}/5 ⭐`, icon: IconListCheck, bg: 'bg-game-mint' },
              ].map(({ label, value, icon: Icon, bg }) => (
                <div key={label} className={cn('rounded-2xl p-3.5 border-2 border-card-outline/30', bg)}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={12} className="text-game-purple" />
                    <p className="text-xs text-game-purple/70">{label}</p>
                  </div>
                  <p className="text-sm font-bold text-game-text">{value}</p>
                </div>
              ))}
            </div>

            {/* Coverage summary */}
            <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/50 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <IconShield size={15} className="text-game-purple" />
                <h3 className="text-sm font-bold text-game-text">Current Coverage</h3>
              </div>
              {prep.coverageSummary.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {prep.coverageSummary.map(item => (
                    <span key={item} className="text-xs bg-pastel-lavender text-game-purple-deep px-3 py-1 rounded-full border border-card-outline/30 font-bold">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-red-500 font-bold">No active coverage</p>
              )}
            </div>

            {/* Unclaimed boosters */}
            {prep.unclaimedBoosters.length > 0 && (
              <div className="bg-game-peach rounded-3xl p-4 border-2 border-[#C05621]/20">
                <div className="flex items-center gap-2 mb-2">
                  <IconFlame size={15} className="text-[#C05621]" />
                  <h3 className="text-sm font-bold text-game-text">Unclaimed Booster Rewards 🎁</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {prep.unclaimedBoosters.map(b => (
                    <span key={b} className="text-xs bg-white/60 text-[#92400E] px-3 py-1 rounded-full font-bold border border-[#C05621]/20">
                      🎁 {b}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Gemini AI section */}
            <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/50 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl bg-game-purple flex items-center justify-center">
                  <IconSparkles size={14} className="text-white" />
                </div>
                <h3 className="text-sm font-bold text-game-text">Gemini AI Meeting Prep</h3>
                {aiStatus === 'success' && (
                  <span className="ml-auto text-xs font-bold bg-game-purple text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                    <IconSparkles size={9} />Gemini AI
                  </span>
                )}
              </div>

              {aiStatus === 'idle' && (
                <p className="text-xs text-game-purple/60 mb-3">
                  Get an AI-generated conversation opener, key insights, and product recommendation tailored to this client.
                </p>
              )}

              {aiStatus === 'error' && (
                <div className="p-3 bg-red-50 border-2 border-red-200 rounded-2xl mb-3">
                  <p className="text-xs font-bold text-red-600">AI Error</p>
                  <p className="text-xs text-red-500 mt-0.5">{aiError}</p>
                </div>
              )}

              {aiStatus === 'success' && aiPrep && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mb-3">
                  {/* AI opener */}
                  <div>
                    <p className="text-xs font-bold text-game-text uppercase tracking-wider mb-2">Conversation Opener</p>
                    <p className="text-sm text-game-purple-deep italic leading-relaxed bg-pastel-yellow p-4 rounded-2xl border-2 border-card-outline/20">
                      &ldquo;{aiPrep.opener}&rdquo;
                    </p>
                  </div>

                  {/* AI insights */}
                  {aiPrep.insights.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-game-text uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <IconBulb size={11} className="text-[#C05621]" />
                        Key Insights
                      </p>
                      <ul className="space-y-2">
                        {aiPrep.insights.map((insight, i) => (
                          <li key={i} className="flex items-start gap-2 p-3 bg-pastel-lavender/50 rounded-2xl">
                            <IconCheck size={13} className="text-[#065F46] mt-0.5 shrink-0" />
                            <p className="text-sm text-game-purple-deep">{insight}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* AI recommendation */}
                  <div className="p-4 bg-game-purple rounded-2xl text-white">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1">✨ AI Recommendation</p>
                    <p className="text-sm font-bold">{aiPrep.recommendation}</p>
                  </div>

                  <p className="text-xs text-game-purple/40 italic">⚠ Advisor review required before use.</p>

                  <button
                    onClick={handleCopyAI}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all border-2',
                      aiCopied
                        ? 'bg-game-mint border-game-mint text-[#065F46]'
                        : 'bg-card-cream border-card-outline/40 text-game-text hover:border-card-outline'
                    )}
                  >
                    {aiCopied ? <IconCheck size={13} /> : <IconCopy size={13} />}
                    {aiCopied ? 'Copied!' : 'Copy AI Brief'}
                  </button>
                </motion.div>
              )}

              <motion.button
                onClick={handleGenerateAI}
                disabled={aiStatus === 'loading'}
                whileHover={aiStatus !== 'loading' ? { scale: 1.02 } : {}}
                whileTap={aiStatus !== 'loading' ? { scale: 0.97 } : {}}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all border-2',
                  aiStatus === 'loading'
                    ? 'bg-pastel-lavender border-card-outline/20 text-game-purple cursor-not-allowed'
                    : 'bg-game-purple border-game-purple text-white hover:opacity-90'
                )}
              >
                {aiStatus === 'loading' ? (
                  <>
                    <IconLoader2 size={15} className="animate-spin" />
                    Generating with Gemini…
                  </>
                ) : (
                  <>
                    <IconSparkles size={15} />
                    {aiStatus === 'success' ? 'Regenerate AI Prep' : 'Generate with Gemini AI ✨'}
                  </>
                )}
              </motion.button>
            </div>

            {/* Local key insights (shown when AI hasn't run) */}
            {aiStatus !== 'success' && prep.keyInsights.length > 0 && (
              <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/50 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <IconBulb size={15} className="text-[#C05621]" />
                  <h3 className="text-sm font-bold text-game-text">Key Insights</h3>
                  <span className="ml-auto text-xs font-bold text-game-pink bg-game-pink-soft px-2 py-0.5 rounded-full">Local Logic</span>
                </div>
                <ul className="space-y-2">
                  {prep.keyInsights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <IconCheck size={13} className="text-[#065F46] mt-0.5 shrink-0" />
                      <p className="text-sm text-game-purple-deep">{insight}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Local conversation opener (shown when AI hasn't run) */}
            {aiStatus !== 'success' && (
              <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/50 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <IconBulb size={15} className="text-game-purple" />
                  <h3 className="text-sm font-bold text-game-text">Suggested Conversation Opener</h3>
                  <span className="ml-auto text-xs text-game-purple/50">Local logic</span>
                </div>
                <p className="text-sm text-game-purple-deep italic leading-relaxed bg-pastel-yellow p-4 rounded-2xl border-2 border-card-outline/20">
                  &ldquo;{prep.conversationOpener}&rdquo;
                </p>
                <button
                  onClick={handleCopyOpener}
                  className={cn(
                    'mt-3 flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all border-2',
                    copied
                      ? 'bg-game-mint border-game-mint text-[#065F46]'
                      : 'bg-card-cream border-card-outline/40 text-game-text hover:border-card-outline'
                  )}
                >
                  {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
                  {copied ? 'Copied!' : 'Copy Opener'}
                </button>
              </div>
            )}

            {/* Recommended product */}
            <div className="p-5 bg-game-purple rounded-3xl text-white">
              <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1">✨ Suggested Next Product</p>
              <p className="text-sm font-bold">{prep.suggestedProduct}</p>
              <p className="text-xs text-white/50 mt-1.5">Local logic · Advisor decides whether to propose</p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 border-card-outline/50 text-game-text text-xs font-bold hover:bg-pastel-lavender hover:border-card-outline transition-colors"
              >
                <IconPrinter size={14} />
                Print Brief
              </button>
              <motion.button
                onClick={() => setMarkedPrepared(!markedPrepared)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border-2',
                  markedPrepared
                    ? 'bg-game-mint border-game-mint text-[#065F46]'
                    : 'bg-game-pink border-game-pink text-white shadow-sm hover:opacity-90'
                )}
              >
                <IconCircleCheck size={14} />
                {markedPrepared ? 'Marked as Prepared ✓' : 'Mark as Prepared'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

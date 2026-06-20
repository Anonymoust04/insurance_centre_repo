'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconShieldCheck,
  IconShieldX,
  IconAlertTriangle,
  IconBulb,
  IconSparkles,
  IconChevronRight,
  IconLoader2,
  IconCopy,
  IconCheck,
} from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import { ClientSelect } from './ClientSelect';
import { generateProtectionGap } from '@/lib/aiAdvisorLogic';
import type { CustomerProfile } from '@/types/agent';

interface ProtectionGapExplainerProps {
  customers: CustomerProfile[];
}

type AIStatus = 'idle' | 'loading' | 'success' | 'error';

interface AIGapOutput {
  explanation: string;
  talkingPoints: string[];
}

const priorityConfig = {
  critical: { label: 'Critical Gap', color: 'bg-red-50 text-red-700 border-red-200' },
  medium: { label: 'Important Gap', color: 'bg-game-peach text-[#92400E] border-[#92400E]/20' },
  low: { label: 'Optional', color: 'bg-pastel-lavender/50 text-game-purple border-card-outline/20' },
};

export function ProtectionGapExplainer({ customers }: ProtectionGapExplainerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<AIStatus>('idle');
  const [aiOutput, setAiOutput] = useState<AIGapOutput | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedCustomer = customers.find(c => c.id === selectedId) ?? null;
  const output = selectedCustomer ? generateProtectionGap(selectedCustomer) : null;

  const handleSelectChange = (id: string | null) => {
    setSelectedId(id);
    setAiOutput(null);
    setAiStatus('idle');
    setAiError(null);
  };

  const handleGenerateAI = async () => {
    if (!selectedCustomer || !output) return;
    setAiStatus('loading');
    setAiError(null);

    try {
      const res = await fetch('/api/ai/protection-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: selectedCustomer.fullName,
          occupation: selectedCustomer.occupation,
          lifeStage: selectedCustomer.lifeStage ?? 'Not specified',
          covered: output.covered.map(c => c.name),
          missing: output.missing.map(m => m.name),
          hpDays: selectedCustomer.protectionHpDays ?? selectedCustomer.hpDays,
          riskNotes: selectedCustomer.riskNotes ?? '',
        }),
      });

      const data = (await res.json()) as { explanation?: string; talkingPoints?: string[]; error?: string };

      if (!res.ok || data.error) {
        throw new Error(data.error ?? 'AI generation failed.');
      }

      setAiOutput({
        explanation: data.explanation ?? '',
        talkingPoints: data.talkingPoints ?? [],
      });
      setAiStatus('success');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI generation failed.');
      setAiStatus('error');
    }
  };

  const handleCopy = () => {
    if (!aiOutput) return;
    const text = `${aiOutput.explanation}\n\nTalking Points:\n${aiOutput.talkingPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      {/* Safety disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-pastel-lavender rounded-3xl border-2 border-card-outline/40">
        <IconSparkles size={16} className="text-game-purple mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-game-text">AI Suggested · Advisor decides final recommendation</p>
          <p className="text-xs text-game-purple/70 mt-0.5">Gap analysis is generated from the client&apos;s coverage deck. Always validate with the client — do not treat as legal or financial advice.</p>
        </div>
      </div>

      <ClientSelect customers={customers} selectedId={selectedId} onChange={handleSelectChange} label="Select Client" />

      <AnimatePresence>
        {output && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Risk summary (local) */}
            <div className={cn(
              'p-4 rounded-3xl border-2',
              (selectedCustomer.protectionHpDays ?? selectedCustomer.hpDays) === 0
                ? 'bg-red-50 border-red-200'
                : (selectedCustomer.protectionHpDays ?? selectedCustomer.hpDays) <= 60
                ? 'bg-game-pink-soft border-game-pink/30'
                : 'bg-pastel-yellow border-card-outline/20'
            )}>
              <div className="flex items-start gap-2">
                <IconAlertTriangle size={15} className={cn(
                  'mt-0.5 shrink-0',
                  (selectedCustomer.protectionHpDays ?? selectedCustomer.hpDays) <= 60 ? 'text-game-pink' : 'text-game-purple/40'
                )} />
                <div>
                  <p className="text-xs font-bold text-game-text mb-1">Risk Summary</p>
                  <p className="text-sm text-game-purple-deep leading-relaxed">{output.riskSummary}</p>
                </div>
              </div>
            </div>

            {/* AI Explanation section */}
            <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/50 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-xl bg-game-purple flex items-center justify-center">
                  <IconSparkles size={14} className="text-white" />
                </div>
                <h3 className="text-sm font-bold text-game-text">Gemini AI Explanation</h3>
                {aiStatus === 'success' && (
                  <span className="ml-auto text-xs font-bold bg-game-purple text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                    <IconSparkles size={9} />Gemini AI
                  </span>
                )}
              </div>

              {aiStatus === 'idle' && (
                <p className="text-xs text-game-purple/60 mb-3">
                  Get a plain-English explanation of this client&apos;s protection gaps — ready to use as a meeting script.
                </p>
              )}

              {aiStatus === 'error' && (
                <div className="p-3 bg-red-50 border-2 border-red-200 rounded-2xl mb-3">
                  <p className="text-xs font-bold text-red-600">AI Error</p>
                  <p className="text-xs text-red-500 mt-0.5">{aiError}</p>
                </div>
              )}

              {aiStatus === 'success' && aiOutput && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mb-3">
                  <p className="text-sm text-game-purple-deep leading-relaxed bg-pastel-yellow p-4 rounded-2xl border-2 border-card-outline/20">
                    {aiOutput.explanation}
                  </p>
                  {aiOutput.talkingPoints.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-game-text uppercase tracking-wider flex items-center gap-1.5">
                        <IconBulb size={11} className="text-[#C05621]" />
                        AI Talking Points
                      </p>
                      {aiOutput.talkingPoints.map((point, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 bg-game-peach/40 rounded-2xl">
                          <IconChevronRight size={13} className="text-[#C05621] mt-0.5 shrink-0" />
                          <p className="text-sm text-game-text italic leading-relaxed">{point}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-game-purple/40 italic">⚠ Advisor review required before use.</p>
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
                    {copied ? 'Copied!' : 'Copy Explanation'}
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
                    {aiStatus === 'success' ? 'Regenerate AI Explanation' : 'Generate AI Explanation ✨'}
                  </>
                )}
              </motion.button>
            </div>

            {/* Covered areas */}
            {output.covered.length > 0 && (
              <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/50 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <IconShieldCheck size={16} className="text-[#065F46]" />
                  <h3 className="text-sm font-bold text-game-text">What&apos;s Covered</h3>
                  <span className="ml-auto text-xs font-bold text-[#065F46] bg-game-mint px-2 py-0.5 rounded-full">{output.covered.length} active</span>
                </div>
                <div className="space-y-2">
                  {output.covered.map(item => (
                    <div key={item.name} className="flex items-start gap-3 p-3 bg-game-mint/20 rounded-2xl border border-game-mint">
                      <IconShieldCheck size={14} className="text-[#065F46] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-game-text">{item.name}</p>
                        <p className="text-xs text-game-purple/70 mt-0.5">{item.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coverage gaps */}
            {output.missing.length > 0 && (
              <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/50 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <IconShieldX size={16} className="text-red-500" />
                  <h3 className="text-sm font-bold text-game-text">Coverage Gaps</h3>
                  <span className="ml-auto text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">{output.missing.length} gap{output.missing.length > 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-2">
                  {output.missing.map(item => {
                    const cfg = priorityConfig[item.priority];
                    return (
                      <div key={item.name} className={cn('flex items-start gap-3 p-3 rounded-2xl border-2', cfg.color)}>
                        <IconShieldX size={14} className="mt-0.5 shrink-0 opacity-70" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold">{item.name}</p>
                            <span className="text-xs font-semibold opacity-70">{cfg.label}</span>
                          </div>
                          <p className="text-xs mt-0.5 opacity-80">{item.impact}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Local talking points (shown only when AI hasn't generated yet) */}
            {aiStatus !== 'success' && output.talkingPoints.length > 0 && (
              <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/50 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <IconBulb size={16} className="text-[#C05621]" />
                  <h3 className="text-sm font-bold text-game-text">Talking Points</h3>
                  <span className="ml-auto text-xs text-game-purple/50">Local logic</span>
                </div>
                <div className="space-y-2">
                  {output.talkingPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-game-peach/40 rounded-2xl">
                      <IconChevronRight size={13} className="text-[#C05621] mt-0.5 shrink-0" />
                      <p className="text-sm text-game-text italic leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div className="p-5 bg-game-purple rounded-3xl text-white">
              <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1">✨ Recommended Next Product</p>
              <p className="text-sm font-bold">{output.recommendation}</p>
              <p className="text-xs text-white/50 mt-1.5">AI Suggested · Advisor validates with client before proposing</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

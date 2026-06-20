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
} from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import { ClientSelect } from './ClientSelect';
import { generateProtectionGap } from '@/lib/aiAdvisorLogic';
import type { CustomerProfile } from '@/types/agent';

interface ProtectionGapExplainerProps {
  customers: CustomerProfile[];
}

const priorityConfig = {
  critical: { label: 'Critical Gap', color: 'bg-red-50 text-red-700 border-red-200' },
  medium: { label: 'Important Gap', color: 'bg-game-peach text-[#92400E] border-[#92400E]/20' },
  low: { label: 'Optional', color: 'bg-pastel-lavender/50 text-game-purple border-card-outline/20' },
};

export function ProtectionGapExplainer({ customers }: ProtectionGapExplainerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedCustomer = customers.find(c => c.id === selectedId) ?? null;
  const output = selectedCustomer ? generateProtectionGap(selectedCustomer) : null;

  return (
    <div className="space-y-5">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-pastel-lavender rounded-3xl border-2 border-card-outline/40">
        <IconSparkles size={16} className="text-game-purple mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-game-text">AI Suggested · Advisor decides final recommendation</p>
          <p className="text-xs text-game-purple/70 mt-0.5">Gap analysis is generated from the client&apos;s coverage deck. Use as a guide — always validate with the client.</p>
        </div>
      </div>

      <ClientSelect customers={customers} selectedId={selectedId} onChange={setSelectedId} label="Select Client" />

      <AnimatePresence>
        {output && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Risk summary */}
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

            {/* Talking points */}
            {output.talkingPoints.length > 0 && (
              <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/50 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <IconBulb size={16} className="text-[#C05621]" />
                  <h3 className="text-sm font-bold text-game-text">Talking Points</h3>
                  <span className="ml-auto text-xs text-game-purple/50">Use with the client</span>
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

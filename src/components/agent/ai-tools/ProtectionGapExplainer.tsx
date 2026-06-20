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
  critical: { label: 'Critical Gap', color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30' },
  medium: { label: 'Important Gap', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30' },
  low: { label: 'Optional', color: 'text-slate-500 bg-slate-50 dark:bg-slate-700/30 border-slate-100 dark:border-slate-700/50' },
};

export function ProtectionGapExplainer({ customers }: ProtectionGapExplainerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedCustomer = customers.find(c => c.id === selectedId) ?? null;
  const output = selectedCustomer ? generateProtectionGap(selectedCustomer) : null;

  return (
    <div className="space-y-5">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30">
        <IconSparkles size={16} className="text-blue-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">AI Suggested · Advisor decides final recommendation</p>
          <p className="text-xs text-blue-600/80 dark:text-blue-400/60 mt-0.5">Gap analysis is generated from the client&apos;s coverage deck and missing coverage fields. Use as a guide — always validate with the client.</p>
        </div>
      </div>

      {/* Client selector */}
      <ClientSelect
        customers={customers}
        selectedId={selectedId}
        onChange={setSelectedId}
        label="Select Client"
      />

      <AnimatePresence>
        {output && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Risk summary */}
            <div className={cn(
              'p-4 rounded-2xl border',
              (selectedCustomer.protectionHpDays ?? selectedCustomer.hpDays) === 0
                ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30'
                : (selectedCustomer.protectionHpDays ?? selectedCustomer.hpDays) <= 60
                ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/30'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700/50'
            )}>
              <div className="flex items-start gap-2">
                <IconAlertTriangle size={15} className={cn(
                  'mt-0.5 shrink-0',
                  (selectedCustomer.protectionHpDays ?? selectedCustomer.hpDays) <= 60 ? 'text-amber-500' : 'text-slate-400'
                )} />
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Risk Summary</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{output.riskSummary}</p>
                </div>
              </div>
            </div>

            {/* Covered areas */}
            {output.covered.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <IconShieldCheck size={16} className="text-emerald-500" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">What&apos;s Covered</h3>
                  <span className="ml-auto text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">{output.covered.length} active</span>
                </div>
                <div className="space-y-2">
                  {output.covered.map(item => (
                    <div key={item.name} className="flex items-start gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/20">
                      <IconShieldCheck size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coverage gaps */}
            {output.missing.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <IconShieldX size={16} className="text-red-500" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Coverage Gaps</h3>
                  <span className="ml-auto text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">{output.missing.length} gap{output.missing.length > 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-2">
                  {output.missing.map(item => {
                    const cfg = priorityConfig[item.priority];
                    return (
                      <div key={item.name} className={cn('flex items-start gap-3 p-3 rounded-xl border', cfg.color)}>
                        <IconShieldX size={14} className="mt-0.5 shrink-0 opacity-70" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{item.name}</p>
                            <span className="text-xs font-medium opacity-70">{cfg.label}</span>
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
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <IconBulb size={16} className="text-amber-500" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Talking Points</h3>
                  <span className="ml-auto text-xs text-slate-400">Use with the client</span>
                </div>
                <div className="space-y-2">
                  {output.talkingPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl">
                      <IconChevronRight size={13} className="text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div className="p-4 bg-blue-600 rounded-2xl text-white">
              <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">Recommended Next Product</p>
              <p className="text-sm font-bold">{output.recommendation}</p>
              <p className="text-xs text-blue-200 mt-1.5">AI Suggested · Advisor validates with client before proposing</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

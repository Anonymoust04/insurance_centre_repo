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
} from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import { ClientSelect } from './ClientSelect';
import { generateMeetingPrep } from '@/lib/aiAdvisorLogic';
import type { CustomerProfile } from '@/types/agent';

interface MeetingPrepCardProps {
  customers: CustomerProfile[];
}

function HpStatusChip({ status, days }: { status: string; days: number }) {
  const cfg = {
    Healthy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Urgent: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Lapsed: 'bg-red-600 text-white',
  }[status] ?? 'bg-slate-100 text-slate-600';

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', cfg)}>
      <IconShield size={11} />
      {status}{days > 0 ? ` · ${days}d` : ''}
    </span>
  );
}

export function MeetingPrepCard({ customers }: MeetingPrepCardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [markedPrepared, setMarkedPrepared] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedCustomer = customers.find(c => c.id === selectedId) ?? null;
  const prep = selectedCustomer ? generateMeetingPrep(selectedCustomer) : null;

  const handleCopyOpener = () => {
    if (!prep) return;
    navigator.clipboard.writeText(prep.conversationOpener).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-violet-50 dark:bg-violet-900/10 rounded-2xl border border-violet-100 dark:border-violet-800/30">
        <IconSparkles size={16} className="text-violet-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-violet-700 dark:text-violet-400">AI Suggested · One-page meeting prep</p>
          <p className="text-xs text-violet-600/80 dark:text-violet-400/60 mt-0.5">Generated from client profile data. Review the brief before your meeting and personalise where needed — you know your client best.</p>
        </div>
      </div>

      {/* Client selector */}
      <ClientSelect
        customers={customers}
        selectedId={selectedId}
        onChange={id => { setSelectedId(id); setMarkedPrepared(false); }}
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
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {selectedCustomer.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-lg leading-tight">{selectedCustomer.fullName}</p>
                  <p className="text-blue-200 text-sm">{selectedCustomer.occupation} · {selectedCustomer.city ?? ''}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <HpStatusChip status={prep.hpStatus} days={prep.hpDays} />
                    <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      <IconUser size={11} />
                      {prep.lifeStage}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key metrics row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Energy Type', value: prep.energyType, icon: IconSparkles },
                { label: 'Payment Streak', value: `${selectedCustomer.paymentStreak} months`, icon: IconFlame },
                { label: 'Satisfaction', value: `${selectedCustomer.satisfactionScore}/5 stars`, icon: IconListCheck },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={12} className="text-blue-500" />
                    <p className="text-xs text-slate-400">{label}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>

            {/* Coverage summary */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <IconShield size={15} className="text-blue-500" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Current Coverage</h3>
              </div>
              {prep.coverageSummary.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {prep.coverageSummary.map(item => (
                    <span key={item} className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800/30 font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-red-500 font-medium">No active coverage</p>
              )}
            </div>

            {/* Unclaimed boosters */}
            {prep.unclaimedBoosters.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-4 border border-amber-100 dark:border-amber-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <IconFlame size={15} className="text-amber-500" />
                  <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400">Unclaimed Booster Rewards</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {prep.unclaimedBoosters.map(b => (
                    <span key={b} className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full font-medium">
                      🎁 {b}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key insights */}
            {prep.keyInsights.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <IconBulb size={15} className="text-amber-500" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Key Insights</h3>
                  <span className="ml-auto text-xs text-violet-500 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded-full">AI Suggested</span>
                </div>
                <ul className="space-y-2">
                  {prep.keyInsights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <IconCheck size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">{insight}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Conversation opener */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <IconBulb size={15} className="text-violet-500" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Suggested Conversation Opener</h3>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed bg-slate-50 dark:bg-slate-700/40 p-4 rounded-xl border border-slate-100 dark:border-slate-600">
                &ldquo;{prep.conversationOpener}&rdquo;
              </p>
              <button
                onClick={handleCopyOpener}
                className={cn(
                  'mt-3 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all',
                  copied
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                )}
              >
                {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
                {copied ? 'Copied!' : 'Copy Opener'}
              </button>
            </div>

            {/* Recommended product */}
            <div className="p-4 bg-blue-600 rounded-2xl text-white">
              <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">Suggested Next Product</p>
              <p className="text-sm font-bold">{prep.suggestedProduct}</p>
              <p className="text-xs text-blue-200 mt-1.5">AI Suggested · Advisor decides whether to propose</p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <IconPrinter size={14} />
                Print Brief
              </button>
              <button
                onClick={() => setMarkedPrepared(!markedPrepared)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all',
                  markedPrepared
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                )}
              >
                <IconCircleCheck size={14} />
                {markedPrepared ? 'Marked as Prepared ✓' : 'Mark as Prepared'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

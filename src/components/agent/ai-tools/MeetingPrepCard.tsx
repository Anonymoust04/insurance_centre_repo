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

  const selectedCustomer = customers.find(c => c.id === selectedId) ?? null;
  const prep = selectedCustomer ? generateMeetingPrep(selectedCustomer) : null;

  const handleCopyOpener = () => {
    if (!prep) return;
    navigator.clipboard.writeText(prep.conversationOpener).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      {/* Disclaimer */}
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

            {/* Key insights */}
            {prep.keyInsights.length > 0 && (
              <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/50 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <IconBulb size={15} className="text-[#C05621]" />
                  <h3 className="text-sm font-bold text-game-text">Key Insights</h3>
                  <span className="ml-auto text-xs font-bold text-game-pink bg-game-pink-soft px-2 py-0.5 rounded-full">AI Suggested</span>
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

            {/* Conversation opener */}
            <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/50 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <IconBulb size={15} className="text-game-purple" />
                <h3 className="text-sm font-bold text-game-text">Suggested Conversation Opener</h3>
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

            {/* Recommended product */}
            <div className="p-5 bg-game-purple rounded-3xl text-white">
              <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1">✨ Suggested Next Product</p>
              <p className="text-sm font-bold">{prep.suggestedProduct}</p>
              <p className="text-xs text-white/50 mt-1.5">AI Suggested · Advisor decides whether to propose</p>
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

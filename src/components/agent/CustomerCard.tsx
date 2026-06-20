'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconPhone,
  IconMail,
  IconCalendarEvent,
  IconBrandWhatsapp,
  IconFlame,
  IconStar,
  IconStarFilled,
  IconClockHour4,
  IconShield,
} from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import type { CustomerProfile } from '@/types/agent';
import { FollowUpModal } from './FollowUpModal';

interface CustomerCardProps {
  customer: CustomerProfile;
  delay?: number;
}

const statusConfig = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  'renewal-due': { label: 'Renewal Due', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  lapsed: { label: 'Lapsed', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

const commPrefConfig = {
  whatsapp: { label: 'Prefers WhatsApp', Icon: IconBrandWhatsapp, className: 'text-emerald-600 dark:text-emerald-400' },
  call: { label: 'Prefers Call', Icon: IconPhone, className: 'text-blue-600 dark:text-blue-400' },
  email: { label: 'Prefers Email', Icon: IconMail, className: 'text-slate-500 dark:text-slate-400' },
};

function HpBar({ hpDays }: { hpDays: number }) {
  const max = 365;
  const pct = Math.min(Math.max(hpDays, 0), max) / max * 100;
  const isLapsed = hpDays <= 0;
  const isWarning = hpDays > 0 && hpDays < 100;
  const barColor = isLapsed ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500';
  const textColor = isLapsed ? 'text-red-600 dark:text-red-400' : isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <IconShield size={11} />
          <span>Health Protection</span>
        </div>
        <span className={cn('font-semibold', textColor)}>
          {isLapsed ? 'Lapsed' : `${hpDays} days`}
        </span>
      </div>
      <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SatisfactionStars({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n =>
        n <= score
          ? <IconStarFilled key={n} size={12} className="text-amber-400" />
          : <IconStar key={n} size={12} className="text-slate-300 dark:text-slate-600" />
      )}
    </div>
  );
}

export function CustomerCard({ customer, delay = 0 }: CustomerCardProps) {
  const status = statusConfig[customer.status];
  const commPref = commPrefConfig[customer.commPref];
  const [showDraft, setShowDraft] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {customer.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-sm text-slate-900 dark:text-white">{customer.fullName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{customer.occupation}, {customer.age} yrs</p>
            </div>
            <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full shrink-0', status.className)}>
              {status.label}
            </span>
          </div>

          {/* Satisfaction + comm pref */}
          <div className="flex items-center gap-3 mt-1.5">
            <SatisfactionStars score={customer.satisfactionScore} />
            <div className={cn('flex items-center gap-1 text-xs font-medium', commPref.className)}>
              <commPref.Icon size={11} />
              <span>{commPref.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* HP bar */}
      <div className="mt-4">
        <HpBar hpDays={customer.hpDays} />
      </div>

      {/* Policy info */}
      <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{customer.policyType}</p>
          <p className="text-xs text-slate-400">{customer.policyNumber}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Monthly</p>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">RM {customer.premiumMonthly}/mo</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Coverage</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">RM {(customer.coverageAmount / 1000).toFixed(0)}K</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Streak</p>
            <div className="flex items-center gap-0.5 justify-end">
              <IconFlame size={13} className={customer.paymentStreak >= 3 ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'} />
              <p className="text-sm font-bold text-slate-900 dark:text-white">{customer.paymentStreak}mo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact meta */}
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <IconClockHour4 size={12} />
          {customer.daysSinceContact === 0
            ? 'Contacted today'
            : `Last contact: ${customer.daysSinceContact}d ago`}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <IconCalendarEvent size={12} />
          Renews: {new Date(customer.renewalDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* Quick action row */}
      <div className="mt-3 flex items-center gap-2">
        <a
          href={`tel:${customer.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
        >
          <IconPhone size={13} />
          Call
        </a>
        <a
          href={`mailto:${customer.email}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
        >
          <IconMail size={13} />
          Email
        </a>
        <button
          onClick={() => setShowDraft(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
        >
          <IconBrandWhatsapp size={13} />
          Draft
        </button>
      </div>

      {showDraft && (
        <FollowUpModal
          customer={customer}
          agentName="Farah Diyana"
          onClose={() => setShowDraft(false)}
        />
      )}
    </motion.div>
  );
}

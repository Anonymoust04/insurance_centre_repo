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
  active: { label: 'Active', className: 'bg-game-mint text-[#065F46] border-[#065F46]/30' },
  'renewal-due': { label: 'Renewal Due', className: 'bg-game-peach text-[#92400E] border-[#92400E]/30' },
  lapsed: { label: 'Lapsed', className: 'bg-red-100 text-red-700 border-red-200' },
};

const commPrefConfig = {
  whatsapp: { label: 'Prefers WhatsApp', Icon: IconBrandWhatsapp, className: 'text-[#065F46] bg-game-mint' },
  call: { label: 'Prefers Call', Icon: IconPhone, className: 'text-game-purple bg-pastel-lavender' },
  email: { label: 'Prefers Email', Icon: IconMail, className: 'text-game-text bg-pastel-yellow' },
};

function HpBar({ hpDays }: { hpDays: number }) {
  const max = 365;
  const pct = Math.min(Math.max(hpDays, 0), max) / max * 100;
  const isLapsed = hpDays <= 0;
  const isWarning = hpDays > 0 && hpDays < 100;
  const barColor = isLapsed ? 'bg-red-500' : isWarning ? 'bg-[#FF4FB8]' : 'bg-game-mint';
  const textColor = isLapsed ? 'text-red-600' : isWarning ? 'text-game-pink' : 'text-[#065F46]';
  const bgTrack = isLapsed ? 'bg-red-100' : isWarning ? 'bg-game-pink-soft' : 'bg-game-mint/40';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-game-purple">
          <IconShield size={11} />
          <span>Protection HP</span>
        </div>
        <span className={cn('font-bold', textColor)}>
          {isLapsed ? 'Lapsed ⚠' : `${hpDays} days`}
        </span>
      </div>
      <div className={cn('h-2 rounded-full overflow-hidden', bgTrack)}>
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
          ? <IconStarFilled key={n} size={12} className="text-[#FFD700]" />
          : <IconStar key={n} size={12} className="text-card-outline/30" />
      )}
    </div>
  );
}

export function CustomerCard({ customer, delay = 0 }: CustomerCardProps) {
  const status = statusConfig[customer.status];
  const commPref = commPrefConfig[customer.commPref];
  const [showDraft, setShowDraft] = useState(false);
  const hp = customer.protectionHpDays ?? customer.hpDays;
  const isUrgent = hp > 0 && hp < 100;
  const isLapsed = hp === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ duration: 0.35, delay }}
      className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/60 shadow-[0_4px_20px_rgba(107,33,217,0.10)] hover:shadow-[0_8px_32px_rgba(107,33,217,0.15)] transition-shadow"
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-game-purple border-2 border-card-outline flex items-center justify-center text-white text-xs font-bold shrink-0">
          {customer.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-sm text-game-text">{customer.fullName}</p>
              <p className="text-xs text-game-purple mt-0.5">{customer.occupation}, {customer.age} yrs</p>
            </div>
            <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full border shrink-0', status.className)}>
              {status.label}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <SatisfactionStars score={customer.satisfactionScore} />
            <span className={cn('flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full', commPref.className)}>
              <commPref.Icon size={10} />
              {commPref.label}
            </span>
          </div>
        </div>
      </div>

      {/* HP bar */}
      <div className="mt-3">
        <HpBar hpDays={hp} />
      </div>

      {/* Policy info */}
      <div className="mt-3 p-3 rounded-2xl bg-pastel-yellow border border-card-outline/20">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-bold text-game-text">{customer.policyType}</p>
          <p className="text-xs text-game-purple/60">{customer.policyNumber}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-game-purple/60">Monthly</p>
            <p className="text-sm font-bold text-game-purple">RM {customer.premiumMonthly}/mo</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-game-purple/60">Coverage</p>
            <p className="text-sm font-bold text-game-text">RM {(customer.coverageAmount / 1000).toFixed(0)}K</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-game-purple/60">Streak</p>
            <div className="flex items-center gap-0.5 justify-end">
              <IconFlame size={13} className={customer.paymentStreak >= 3 ? 'text-game-pink' : 'text-card-outline/30'} />
              <p className="text-sm font-bold text-game-text">{customer.paymentStreak}mo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Urgency tag */}
      {(isUrgent || isLapsed) && (
        <div className={cn(
          'mt-2.5 flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold',
          isLapsed ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-game-pink-soft text-game-pink border border-game-pink/30'
        )}>
          <span>{isLapsed ? '⚠ Policy Lapsed — Urgent reinstatement needed' : `⚡ HP Critical — ${hp} days remaining`}</span>
        </div>
      )}

      {/* Contact meta */}
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-game-purple/60">
          <IconClockHour4 size={12} />
          {customer.daysSinceContact === 0 ? 'Contacted today' : `Last contact: ${customer.daysSinceContact}d ago`}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-game-purple/60">
          <IconCalendarEvent size={12} />
          Renews: {new Date(customer.renewalDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* Quick action row */}
      <div className="mt-3 flex items-center gap-2">
        <a
          href={`tel:${customer.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-2xl border-2 border-card-outline/40 text-game-purple text-xs font-semibold hover:bg-pastel-lavender hover:border-card-outline transition-colors"
        >
          <IconPhone size={13} />
          Call
        </a>
        <a
          href={`mailto:${customer.email}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-2xl border-2 border-card-outline/40 text-game-purple text-xs font-semibold hover:bg-pastel-lavender hover:border-card-outline transition-colors"
        >
          <IconMail size={13} />
          Email
        </a>
        <button
          onClick={() => setShowDraft(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-2xl bg-game-pink border-2 border-game-pink text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
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

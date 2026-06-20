'use client';

import { motion } from 'framer-motion';
import { IconPhone, IconMail, IconCalendarEvent } from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import type { CustomerProfile } from '@/types/agent';

interface CustomerCardProps {
  customer: CustomerProfile;
  delay?: number;
}

const statusConfig = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  'renewal-due': { label: 'Renewal Due', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  lapsed: { label: 'Lapsed', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export function CustomerCard({ customer, delay = 0 }: CustomerCardProps) {
  const status = statusConfig[customer.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow"
    >
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
        </div>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Policy</p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{customer.policyType}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{customer.policyNumber}</p>
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-xs text-slate-400">Monthly Premium</p>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">RM {customer.premiumMonthly}/mo</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Coverage</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">RM {(customer.coverageAmount / 1000).toFixed(0)}K</p>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <a href={`tel:${customer.phone}`} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <IconPhone size={13} />
          {customer.phone}
        </a>
        <a href={`mailto:${customer.email}`} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <IconMail size={13} />
          {customer.email}
        </a>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <IconCalendarEvent size={13} />
          Renews: {new Date(customer.renewalDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>
    </motion.div>
  );
}

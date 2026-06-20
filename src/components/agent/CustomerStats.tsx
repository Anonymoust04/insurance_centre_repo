'use client';

import { motion } from 'framer-motion';
import { IconUsers, IconCircleCheck, IconAlertCircle, IconCurrencyDollar } from '@tabler/icons-react';

interface CustomerStatsProps {
  total: number;
  active: number;
  renewalDue: number;
  monthlyPremium: number;
}

export function CustomerStats({ total, active, renewalDue, monthlyPremium }: CustomerStatsProps) {
  const stats = [
    { label: 'Total Customers', value: `${total}`, icon: IconUsers, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Active Policies', value: `${active}`, icon: IconCircleCheck, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { label: 'Renewal Due', value: `${renewalDue}`, icon: IconAlertCircle, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    { label: 'Monthly Premiums', value: `RM ${monthlyPremium.toLocaleString()}`, icon: IconCurrencyDollar, color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm"
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
            <Icon size={18} stroke={1.8} />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
        </motion.div>
      ))}
    </div>
  );
}

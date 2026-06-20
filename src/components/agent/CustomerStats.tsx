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
    { label: 'Total Customers', value: `${total}`, icon: IconUsers, iconClass: 'bg-pastel-lavender text-game-purple' },
    { label: 'Active Policies', value: `${active}`, icon: IconCircleCheck, iconClass: 'bg-game-mint text-[#065F46]' },
    { label: 'Renewal Due', value: `${renewalDue}`, icon: IconAlertCircle, iconClass: 'bg-game-peach text-[#92400E]' },
    { label: 'Monthly Premiums', value: `RM ${monthlyPremium.toLocaleString()}`, icon: IconCurrencyDollar, iconClass: 'bg-game-pink-soft text-game-pink' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, iconClass }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
          className="bg-card-cream rounded-3xl p-4 border-2 border-card-outline/60 shadow-[0_4px_16px_rgba(107,33,217,0.08)]"
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${iconClass}`}>
            <Icon size={20} stroke={1.8} />
          </div>
          <p className="text-xl font-bold text-game-text">{value}</p>
          <p className="text-xs font-semibold text-game-purple mt-0.5">{label}</p>
        </motion.div>
      ))}
    </div>
  );
}

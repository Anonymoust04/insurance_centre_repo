'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      className={cn(
        'rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 shadow-sm',
        className,
      )}
      whileHover={hover ? { y: -4, boxShadow: '0 16px 32px rgba(0,0,0,0.08)' } : undefined}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      {children}
    </motion.div>
  );
}

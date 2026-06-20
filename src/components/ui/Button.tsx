'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className,
  type = 'button',
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-colors cursor-pointer';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20',
    secondary: 'bg-cyan-500 text-white hover:bg-cyan-600',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950',
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-base font-semibold',
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <motion.a href={href} className={classes} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

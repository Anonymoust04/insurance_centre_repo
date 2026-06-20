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
    'inline-flex items-center justify-center gap-2 font-bold font-handwriting rounded-xl transition-colors cursor-pointer text-card-outline';

  const variants = {
    primary: 'bg-pastel-pink border-sketch hover:bg-pink-300 shadow-md',
    secondary: 'bg-pastel-yellow border-sketch hover:bg-yellow-300 shadow-md',
    outline: 'border-sketch-sm bg-white hover:bg-pastel-lavender/30',
    ghost: 'hover:bg-pastel-yellow/50 text-card-text/80',
  };

  const sizes = {
    sm: 'px-4 py-2 text-lg',
    md: 'px-6 py-3 text-xl',
    lg: 'px-8 py-4 text-2xl',
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <motion.a href={href} className={classes} whileHover={{ scale: 1.05, rotate: -1 }} whileTap={{ scale: 0.95 }}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      whileHover={{ scale: 1.05, rotate: -1 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}

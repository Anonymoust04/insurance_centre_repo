'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/utils/cn';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
  light?: boolean;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  centered = true,
  className,
  light = false,
}: SectionTitleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55 }}
      className={cn(centered && 'text-center', className)}
    >
      {eyebrow && (
        <span
          className={cn(
            'inline-block text-xs font-bold uppercase tracking-widest mb-3',
            light ? 'text-blue-200' : 'text-blue-600',
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'text-3xl sm:text-4xl font-extrabold tracking-tight mb-4',
          light ? 'text-white' : 'text-slate-900 dark:text-white',
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'text-lg leading-relaxed max-w-2xl',
            centered && 'mx-auto',
            light ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400',
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}

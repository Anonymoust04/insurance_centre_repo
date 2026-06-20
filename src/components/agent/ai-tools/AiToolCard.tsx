'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface AiToolCardProps {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  isActive: boolean;
  delay?: number;
  onClick: (id: string) => void;
}

export function AiToolCard({ id, icon: Icon, title, description, isActive, delay = 0, onClick }: AiToolCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      onClick={() => onClick(id)}
      className={cn(
        'w-full text-left p-4 rounded-2xl border transition-all duration-200',
        isActive
          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm'
      )}
    >
      <div className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center mb-3',
        isActive ? 'bg-white/20' : 'bg-blue-50 dark:bg-blue-900/20'
      )}>
        <Icon size={18} className={isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'} />
      </div>
      <p className={cn('text-sm font-semibold', isActive ? 'text-white' : 'text-slate-900 dark:text-white')}>{title}</p>
      <p className={cn('text-xs mt-1 leading-relaxed', isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400')}>{description}</p>
    </motion.button>
  );
}

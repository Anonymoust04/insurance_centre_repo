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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      transition={{ duration: 0.3, delay }}
      onClick={() => onClick(id)}
      className={cn(
        'w-full text-left p-4 rounded-3xl border-2 transition-all duration-200',
        isActive
          ? 'bg-game-pink-soft border-game-pink shadow-[0_4px_16px_rgba(255,79,184,0.20)]'
          : 'bg-card-cream border-card-outline/40 hover:border-card-outline/70 hover:shadow-sm'
      )}
    >
      <div className={cn(
        'w-9 h-9 rounded-2xl flex items-center justify-center mb-3',
        isActive ? 'bg-game-pink' : 'bg-pastel-lavender'
      )}>
        <Icon size={18} className={isActive ? 'text-white' : 'text-game-purple'} />
      </div>
      <p className={cn('text-sm font-bold', isActive ? 'text-game-text' : 'text-game-text')}>{title}</p>
      <p className={cn('text-xs mt-1 leading-relaxed', isActive ? 'text-game-purple-deep' : 'text-game-purple/60')}>{description}</p>
    </motion.button>
  );
}

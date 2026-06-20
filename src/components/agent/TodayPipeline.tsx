'use client';

import { motion } from 'framer-motion';
import {
  IconPhone,
  IconBrandWhatsapp,
  IconAlertTriangle,
  IconClock,
  IconArrowRight,
} from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import type { MorningBriefItem } from '@/types/agent';

interface TodayPipelineProps {
  items: MorningBriefItem[];
}

const urgencyColor: Record<string, string> = {
  high: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
  medium: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
  low: 'text-slate-500 bg-slate-100 dark:bg-slate-700/50 dark:text-slate-400',
};

const rankLabel = ['#1 Priority', '#2 Priority', '#3 Priority'];

export function TodayPipeline({ items }: TodayPipelineProps) {
  const top3 = [...items]
    .filter(i => i.priority !== 'low')
    .slice(0, 3);

  if (top3.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
          <IconClock size={15} className="text-blue-500" />
          Today&apos;s Call Pipeline
        </h2>
        <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          {top3.length} calls
        </span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden shadow-sm">
        {top3.map((item, i) => {
          const isLast = i === top3.length - 1;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5',
                !isLast && 'border-b border-slate-100 dark:border-slate-700/40'
              )}
            >
              {/* Rank number */}
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{i + 1}</span>
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {item.clientAvatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.clientName}</p>
                  <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded shrink-0', urgencyColor[item.priority])}>
                    {item.priority === 'high' && <IconAlertTriangle size={10} className="inline mr-0.5" />}
                    {item.priority === 'high' ? 'Urgent' : 'Medium'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.tag}</p>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium shrink-0">{item.suggestedTiming}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`tel:${item.phone}`}
                  className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  title="Call"
                >
                  <IconPhone size={14} />
                </a>
                <a
                  href={`https://wa.me/${item.phone.replace(/[\s\-\+()]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                  title="WhatsApp"
                >
                  <IconBrandWhatsapp size={14} />
                </a>
              </div>
            </motion.div>
          );
        })}

        {/* Footer hint */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <p className="text-xs text-slate-400">Ranked by urgency + days since contact</p>
          <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
            View Morning Brief <IconArrowRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

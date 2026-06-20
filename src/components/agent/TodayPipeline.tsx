'use client';

import { motion } from 'framer-motion';
import {
  IconPhone,
  IconBrandWhatsapp,
  IconAlertTriangle,
  IconClock,
  IconDeviceMobile,
  IconDeviceDesktop,
} from '@tabler/icons-react';

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}
import { cn } from '@/utils/cn';
import type { MorningBriefItem } from '@/types/agent';

interface TodayPipelineProps {
  items: MorningBriefItem[];
}

export function TodayPipeline({ items }: TodayPipelineProps) {
  const top3 = [...items].filter(i => i.priority !== 'low').slice(0, 3);
  if (top3.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-game-text flex items-center gap-2 text-sm">
          <IconClock size={15} className="text-game-pink" />
          Today&apos;s Call Pipeline
        </h2>
        <span className="text-xs font-bold text-game-purple bg-pastel-lavender px-2.5 py-0.5 rounded-full">
          {top3.length} calls
        </span>
      </div>

      <div className="bg-card-cream rounded-3xl border-2 border-card-outline/60 overflow-hidden shadow-[0_4px_16px_rgba(107,33,217,0.08)]">
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
                !isLast && 'border-b border-card-outline/15'
              )}
            >
              <div className="w-6 h-6 rounded-xl bg-pastel-lavender flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-game-text">{i + 1}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-game-purple border-2 border-card-outline flex items-center justify-center text-white text-xs font-bold shrink-0">
                {item.clientAvatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-game-text truncate">{item.clientName}</p>
                  <span className={cn(
                    'text-xs font-bold px-2 py-0.5 rounded-full shrink-0',
                    item.priority === 'high'
                      ? 'bg-game-pink-soft text-game-pink border border-game-pink/30'
                      : 'bg-game-peach text-[#92400E]'
                  )}>
                    {item.priority === 'high' && <IconAlertTriangle size={10} className="inline mr-0.5" />}
                    {item.priority === 'high' ? 'Urgent' : 'Medium'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-xs text-game-purple truncate">{item.tag}</p>
                  <span className="text-xs font-bold text-game-pink shrink-0">{item.suggestedTiming}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`tel:${item.phone}`}
                  className="w-8 h-8 rounded-xl bg-pastel-lavender flex items-center justify-center text-game-purple hover:bg-game-purple hover:text-white transition-colors"
                  title="Call"
                >
                  <IconPhone size={14} />
                </a>
                <a
                  href={`https://wa.me/${cleanPhone(item.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-game-pink-soft flex items-center justify-center text-game-pink hover:bg-game-pink hover:text-white transition-colors"
                  title="WhatsApp App"
                >
                  <IconDeviceMobile size={14} />
                </a>
                <a
                  href={`https://web.whatsapp.com/send?phone=${cleanPhone(item.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-game-mint flex items-center justify-center text-[#065F46] hover:bg-[#25D366] hover:text-white transition-colors"
                  title="WhatsApp Web"
                >
                  <IconDeviceDesktop size={14} />
                </a>
              </div>
            </motion.div>
          );
        })}
        <div className="px-4 py-2.5 bg-pastel-yellow/60 border-t border-card-outline/15 text-xs text-game-purple/60 font-medium">
          Ranked by urgency + days since contact
        </div>
      </div>
    </div>
  );
}

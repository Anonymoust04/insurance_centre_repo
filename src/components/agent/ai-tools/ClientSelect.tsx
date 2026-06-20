'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconShield, IconChevronDown } from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import type { CustomerProfile } from '@/types/agent';

interface ClientSelectProps {
  customers: CustomerProfile[];
  selectedId: string | null;
  onChange: (id: string) => void;
  label?: string;
}

function hpColor(hp: number) {
  if (hp === 0) return 'text-red-500';
  if (hp <= 60) return 'text-game-pink';
  if (hp < 100) return 'text-[#C05621]';
  return 'text-[#065F46]';
}

function hpBadge(hp: number) {
  if (hp === 0) return { label: 'LAPSED', cls: 'bg-red-100 text-red-600 border-red-200' };
  if (hp <= 60) return { label: `${hp}d ⚡`, cls: 'bg-game-pink-soft text-game-pink border-game-pink/30' };
  if (hp < 100) return { label: `${hp}d`, cls: 'bg-game-peach text-[#C05621] border-[#C05621]/20' };
  return { label: `${hp}d`, cls: 'bg-game-mint text-[#065F46] border-[#065F46]/20' };
}

export function ClientSelect({ customers, selectedId, onChange, label = 'Select a client' }: ClientSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = customers.find(c => c.id === selectedId) ?? null;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div className="space-y-2" ref={ref}>
      {label && (
        <label className="text-xs font-bold text-game-text uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-4 py-3',
          'bg-card-cream border-2 rounded-2xl text-sm font-semibold transition-all',
          open
            ? 'border-card-outline text-game-text'
            : 'border-card-outline/40 text-game-text hover:border-card-outline/70'
        )}
      >
        {selected ? (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-game-purple flex items-center justify-center text-white text-xs font-bold shrink-0">
              {selected.avatar}
            </div>
            <span className="truncate font-bold text-game-text">{selected.fullName}</span>
          </div>
        ) : (
          <span className="text-game-text/40 font-normal">— Choose a client —</span>
        )}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <IconChevronDown size={16} className="text-game-purple shrink-0" />
        </motion.div>
      </button>

      {/* Dropdown list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{ originY: 0 }}
            className="relative z-50 bg-card-cream border-2 border-card-outline/50 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto divide-y divide-card-outline/10">
              {customers.map(c => {
                const hp = c.protectionHpDays ?? c.hpDays;
                const badge = hpBadge(hp);
                const isActive = c.id === selectedId;

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelect(c.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                      isActive
                        ? 'bg-pastel-lavender/60'
                        : 'hover:bg-pastel-yellow/60'
                    )}
                  >
                    {/* Avatar */}
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2',
                      isActive
                        ? 'bg-game-purple text-white border-game-purple'
                        : 'bg-pastel-lavender text-game-purple border-card-outline/30'
                    )}>
                      {c.avatar}
                    </div>

                    {/* Name + policy */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-game-text truncate">{c.fullName}</p>
                      <p className="text-xs text-game-purple/60 truncate">{c.policyType}</p>
                    </div>

                    {/* HP badge */}
                    <div className={cn(
                      'flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border shrink-0',
                      badge.cls
                    )}>
                      <IconShield size={10} />
                      {badge.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected client info card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-3 bg-card-cream rounded-2xl border-2 border-card-outline/40"
          >
            <div className="w-9 h-9 rounded-full bg-game-purple border-2 border-card-outline flex items-center justify-center text-white text-xs font-bold shrink-0">
              {selected.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-game-text truncate">{selected.fullName}</p>
              <p className="text-xs text-game-purple">{selected.occupation} · {selected.policyType}</p>
            </div>
            <div className="text-right shrink-0">
              <div className={cn('flex items-center gap-1 text-xs font-bold', hpColor(selected.protectionHpDays ?? selected.hpDays))}>
                <IconShield size={11} />
                {hpBadge(selected.protectionHpDays ?? selected.hpDays).label}
              </div>
              <p className="text-xs text-game-purple/50 mt-0.5">{selected.status}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

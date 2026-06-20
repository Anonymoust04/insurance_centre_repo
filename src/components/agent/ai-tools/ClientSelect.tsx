'use client';

import { cn } from '@/utils/cn';
import type { CustomerProfile } from '@/types/agent';
import { IconShield } from '@tabler/icons-react';

interface ClientSelectProps {
  customers: CustomerProfile[];
  selectedId: string | null;
  onChange: (id: string) => void;
  label?: string;
}

function hpColor(hp: number): string {
  if (hp === 0) return 'text-red-500';
  if (hp <= 60) return 'text-red-500';
  if (hp < 100) return 'text-amber-500';
  return 'text-emerald-500';
}

function hpLabel(hp: number): string {
  if (hp === 0) return 'Lapsed';
  if (hp <= 60) return `${hp}d ⚠`;
  if (hp < 100) return `${hp}d`;
  return `${hp}d`;
}

export function ClientSelect({ customers, selectedId, onChange, label = 'Select a client' }: ClientSelectProps) {
  const selected = customers.find(c => c.id === selectedId);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          value={selectedId ?? ''}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        >
          <option value="" disabled>— Choose a client —</option>
          {customers.map(c => {
            const hp = c.protectionHpDays ?? c.hpDays;
            const urgency = hp === 0 ? ' [LAPSED]' : hp <= 60 ? ' [CRITICAL]' : hp < 100 ? ' [URGENT]' : '';
            return (
              <option key={c.id} value={c.id}>
                {c.fullName}{urgency} · {c.policyType}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {selected && (
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/50">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {selected.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{selected.fullName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{selected.occupation} · {selected.policyType}</p>
          </div>
          <div className="text-right shrink-0">
            <div className={cn('flex items-center gap-1 text-xs font-semibold', hpColor(selected.protectionHpDays ?? selected.hpDays))}>
              <IconShield size={11} />
              {hpLabel(selected.protectionHpDays ?? selected.hpDays)}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{selected.status}</p>
          </div>
        </div>
      )}
    </div>
  );
}

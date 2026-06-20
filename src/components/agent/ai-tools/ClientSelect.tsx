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
  if (hp <= 60) return 'text-game-pink';
  if (hp < 100) return 'text-[#C05621]';
  return 'text-[#065F46]';
}

function hpLabel(hp: number): string {
  if (hp === 0) return 'Lapsed ⚠';
  if (hp <= 60) return `${hp}d ⚡`;
  if (hp < 100) return `${hp}d`;
  return `${hp}d`;
}

export function ClientSelect({ customers, selectedId, onChange, label = 'Select a client' }: ClientSelectProps) {
  const selected = customers.find(c => c.id === selectedId);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-bold text-game-text uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          value={selectedId ?? ''}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none bg-pastel-yellow border-2 border-card-outline/50 rounded-2xl px-4 py-3 pr-10 text-sm text-game-text font-semibold focus:outline-none focus:border-card-outline cursor-pointer"
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
          <svg className="w-4 h-4 text-game-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {selected && (
        <div className="flex items-center gap-3 p-3 bg-card-cream rounded-2xl border-2 border-card-outline/40">
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
              {hpLabel(selected.protectionHpDays ?? selected.hpDays)}
            </div>
            <p className="text-xs text-game-purple/50 mt-0.5">{selected.status}</p>
          </div>
        </div>
      )}
    </div>
  );
}

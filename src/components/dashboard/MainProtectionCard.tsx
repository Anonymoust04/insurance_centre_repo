'use client';
import React from 'react';
import {
  IconClock,
  IconShield,
  IconBolt,
  IconGift,
  IconFlame,
} from '@tabler/icons-react';
import type { CardData } from '@/types/card';
import { CardPreview } from '@/components/card-builder/CardPreview';

interface StatsRowProps {
  data: CardData;
  boosterPacks: number;
  streak: number;
}

const statConfig = (data: CardData, boosterPacks: number, streak: number) => [
  {
    label: 'PT Remaining',
    value: data.targetAge && data.currentAge ? `${Math.max(0, data.targetAge - data.currentAge)} yrs` : '—',
    icon: <IconClock size={16} stroke={2} />,
    color: 'bg-energy-fire/25',
  },
  {
    label: 'Current Plan',
    value: data.plan ? data.plan.split(' ')[0] : '—',
    icon: <IconShield size={16} stroke={2} />,
    color: 'bg-energy-water/25',
  },
  {
    label: 'Energy',
    value: data.energyType || '—',
    icon: <IconBolt size={16} stroke={2} />,
    color: 'bg-energy-electric/35',
  },
  {
    label: 'Packs',
    value: String(boosterPacks),
    icon: <IconGift size={16} stroke={2} />,
    color: 'bg-pastel-lavender/70',
  },
  {
    label: 'Streak',
    value: streak > 0 ? `${streak}d` : '—',
    icon: <IconFlame size={16} stroke={2} />,
    color: 'bg-energy-fire/35',
  },
];

export function StatsRow({ data, boosterPacks, streak }: StatsRowProps) {
  const stats = statConfig(data, boosterPacks, streak);
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex flex-col items-center gap-1 ${stat.color} border-[2px] border-card-outline/15 px-3 py-2 min-w-[64px]`}
          style={{ borderRadius: '10px 12px 9px 11px' }}
        >
          <span className="text-card-outline/60">{stat.icon}</span>
          <span className="font-handwriting text-sm font-bold text-card-outline leading-tight">{stat.value}</span>
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-40 text-center leading-tight">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

interface MainProtectionCardProps {
  data: CardData;
  boosterPacks: number;
  streak: number;
  onOpenPacks: () => void;
}

export function MainProtectionCard({ data, boosterPacks, streak, onOpenPacks }: MainProtectionCardProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* Title */}
      <div className="text-center">
        <h2 className="font-handwriting text-4xl font-bold text-card-outline">Your Protection Card</h2>
        <p className="text-sm opacity-60 mt-1">Your collectible protection identity</p>
      </div>

      {/* The Card */}
      <div className="w-full max-w-[340px] sm:max-w-[380px]">
        <CardPreview data={data} />
      </div>

      {/* Stats Row */}
      <StatsRow data={data} boosterPacks={boosterPacks} streak={streak} />

      {/* Open Packs CTA — only shows when packs > 0 */}
      {boosterPacks > 0 && (
        <button
          onClick={onOpenPacks}
          className="w-full max-w-xs bg-pastel-pink border-sketch hover:bg-pink-300 transition-all py-3 text-lg font-bold font-handwriting text-card-outline shadow-md hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
        >
          <IconGift size={20} stroke={2} />
          Open {boosterPacks} Booster {boosterPacks === 1 ? 'Pack' : 'Packs'}
        </button>
      )}
    </div>
  );
}

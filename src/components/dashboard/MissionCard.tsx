'use client';
import React from 'react';
import {
  IconShield,
  IconHeart,
  IconBook,
  IconUsers,
  IconCalendar,
  IconCheck,
} from '@tabler/icons-react';
import type { Mission } from '@/data/dashboard';

const MISSION_ICONS: Record<string, React.ReactNode> = {
  shield:   <IconShield   size={18} stroke={2} />,
  heart:    <IconHeart    size={18} stroke={2} />,
  book:     <IconBook     size={18} stroke={2} />,
  users:    <IconUsers    size={18} stroke={2} />,
  calendar: <IconCalendar size={18} stroke={2} />,
};

interface MissionCardProps {
  mission: Mission;
  onComplete: (id: string) => void;
}

export function MissionCard({ mission, onComplete }: MissionCardProps) {
  return (
    <div
      className={`flex flex-col gap-2.5 p-4 border-[3px] transition-all duration-300 ${
        mission.completed
          ? 'bg-energy-grass/25 border-green-400'
          : 'bg-white/60 border-card-outline/20 hover:border-card-outline/50 hover:-translate-y-0.5'
      }`}
      style={{ borderRadius: '14px 16px 12px 15px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {/* Icon chip */}
          <div
            className={`w-8 h-8 flex items-center justify-center flex-shrink-0 border-[2px] ${
              mission.completed
                ? 'bg-green-100 border-green-300 text-green-600'
                : 'bg-pastel-lavender/60 border-purple-200 text-card-outline'
            }`}
            style={{ borderRadius: '8px 10px 7px 9px' }}
          >
            {mission.completed
              ? <IconCheck size={16} stroke={2.5} />
              : MISSION_ICONS[mission.iconId]}
          </div>
          <p className={`font-bold text-sm leading-tight ${mission.completed ? 'line-through opacity-50' : 'text-card-outline'}`}>
            {mission.title}
          </p>
        </div>
        {/* Reward chip */}
        <span className="text-[10px] font-bold text-purple-600 bg-pastel-lavender/80 px-2 py-0.5 rounded-full border border-purple-200 whitespace-nowrap flex-shrink-0">
          {mission.reward}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs opacity-60 leading-snug pl-[42px]">{mission.description}</p>

      {/* Progress bar */}
      <div className="pl-[42px]">
        <div className="w-full h-1.5 bg-card-outline/10 rounded-full overflow-hidden border border-card-outline/10">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              mission.completed ? 'bg-green-400' : 'bg-pastel-lavender'
            }`}
            style={{ width: `${mission.progress}%` }}
          />
        </div>
        <p className="text-[10px] opacity-40 mt-0.5 font-bold">{mission.progress}%</p>
      </div>

      {/* Status */}
      <div className="pl-[42px]">
        {mission.completed ? (
          <span className="text-xs font-bold text-green-600">✓ Mission done</span>
        ) : (
          <span className="text-xs font-bold text-card-outline/40">In progress…</span>
        )}
      </div>
    </div>
  );
}

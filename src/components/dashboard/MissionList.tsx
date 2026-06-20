'use client';
import React from 'react';
import { IconGift, IconTarget } from '@tabler/icons-react';
import type { Mission } from '@/data/dashboard';
import { MissionCard } from './MissionCard';

interface MissionListProps {
  missions: Mission[];
  boosterPacks: number;
  onComplete: (id: string) => void;
}

export function MissionList({ missions, boosterPacks, onComplete }: MissionListProps) {
  const completed = missions.filter((m) => m.completed).length;
  const total = missions.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="flex flex-col gap-4">
      {/* Header panel */}
      <div className="bg-white/50 p-5 border-sketch-sm shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <IconTarget size={22} stroke={2} className="text-card-outline" />
          <h2 className="font-handwriting text-3xl font-bold text-card-outline">Daily Missions</h2>
          <span className="ml-auto font-handwriting text-lg font-bold text-purple-500">{completed}/{total}</span>
        </div>
        <p className="text-sm opacity-60 font-sans leading-snug">
          Complete missions to earn booster packs and keep your card active.
        </p>

        {/* Overall progress */}
        <div className="mt-3">
          <div className="w-full h-2.5 bg-card-outline/10 rounded-full overflow-hidden border border-card-outline/15">
            <div
              className="h-full bg-gradient-to-r from-pastel-pink to-pastel-lavender rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] opacity-40 mt-1 font-bold text-right">{pct}% of daily missions done</p>
        </div>
      </div>

      {/* Mission Cards */}
      <div className="flex flex-col gap-3">
        {missions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} onComplete={onComplete} />
        ))}
      </div>

      {/* Booster Pack Counter */}
      <div
        className="bg-pastel-lavender/50 border-[3px] border-purple-300 p-4 flex items-center gap-3"
        style={{ borderRadius: '14px 16px 12px 15px' }}
      >
        <div className="w-10 h-10 flex items-center justify-center bg-white/60 border-[2px] border-purple-200"
          style={{ borderRadius: '10px 12px 9px 11px' }}>
          <IconGift size={22} stroke={1.8} className="text-card-outline" />
        </div>
        <div>
          <p className="font-handwriting text-xl font-bold text-card-outline leading-none">Booster Packs</p>
          <p className="text-sm opacity-70 mt-0.5">
            You have{' '}
            <span className="font-bold text-purple-600">{boosterPacks}</span>{' '}
            {boosterPacks === 1 ? 'pack' : 'packs'} to open
          </p>
        </div>
      </div>
    </div>
  );
}

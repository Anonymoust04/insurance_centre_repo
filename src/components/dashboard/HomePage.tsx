'use client';
import React, { useState, useEffect } from 'react';
import { INITIAL_MISSIONS, MOCK_CARD_DATA } from '@/data/dashboard';
import type { Mission } from '@/data/dashboard';
import type { CardData } from '@/types/card';
import { IconFlame, IconConfetti, IconSparkles } from '@tabler/icons-react';
import { MissionList } from './MissionList';
import { MainProtectionCard } from './MainProtectionCard';
import { ToolsPanel } from './ToolsPanel';
import { RewardPackModal } from './RewardPackModal';

/** Key must match the one in create-card/page.tsx */
const CARD_STORAGE_KEY = 'insurequest_card';

export function HomePage() {
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [boosterPacks, setBoosterPacks] = useState(1);
  const [streak] = useState(3);
  const [showPackModal, setShowPackModal] = useState(false);
  const [completionFlash, setCompletionFlash] = useState<string | null>(null);
  const [cardData, setCardData] = useState<CardData>(MOCK_CARD_DATA);
  const [cardLoaded, setCardLoaded] = useState(false);

  // Load saved card from localStorage after mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CARD_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as CardData;
        setCardData(saved);
      }
    } catch {
      // fallback to mock data
    }
    setCardLoaded(true);
  }, []);

  const handleComplete = (id: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== id || m.completed) return m;
        const isPackReward = m.reward.toLowerCase().includes('pack');
        if (isPackReward) setBoosterPacks((p) => p + 1);
        setCompletionFlash(id);
        setTimeout(() => setCompletionFlash(null), 1200);
        return { ...m, completed: true, progress: 100 };
      })
    );
  };

  const handleToolClick = (id: string) => {
    console.log('Tool clicked:', id);
  };

  const handlePacksClose = (opened: number) => {
    setBoosterPacks((p) => Math.max(0, p - opened));
    setShowPackModal(false);
  };

  return (
    <div className="min-h-screen bg-pastel-yellow p-4 sm:p-6 lg:p-8 font-sans text-card-text relative">

      {/* Completion flash overlay */}
      {completionFlash && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          <div className="flex items-center gap-3 font-handwriting text-5xl sm:text-6xl font-bold text-card-outline bg-pastel-yellow/90 px-8 py-6 border-sketch shadow-2xl animate-bounce">
            <IconSparkles size={48} />
            Mission Complete!
          </div>
        </div>
      )}

      {/* Pack Modal */}
      {showPackModal && (
        <RewardPackModal packCount={boosterPacks} onClose={handlePacksClose} />
      )}

      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="font-handwriting text-5xl sm:text-6xl font-bold text-card-outline leading-tight">
              Your Protection Hub ✦
            </h1>
            <p className="text-base opacity-70 mt-1 font-sans">
              Track your missions, manage your tools, and grow your protection journey.
            </p>
          </div>
          {/* Streak badge */}
          <div
            className="flex items-center gap-2 bg-energy-fire/30 border-[3px] border-orange-300 px-4 py-2 self-start sm:self-auto"
            style={{ borderRadius: '12px 14px 10px 13px' }}
          >
            <IconFlame size={28} className="text-orange-500" stroke={1.5} />
            <div>
              <p className="font-handwriting text-xl font-bold text-card-outline leading-none">{streak}-Day Streak</p>
              <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Keep it up!</p>
            </div>
          </div>
        </div>

        {/* Welcome banner if card was just created */}
        {cardLoaded && cardData.name && cardData.name !== MOCK_CARD_DATA.name && (
          <div
            className="mt-4 bg-energy-grass/40 border-[3px] border-green-400 px-5 py-3 flex items-center gap-3"
            style={{ borderRadius: '12px 14px 10px 13px' }}
          >
            <IconConfetti size={28} className="text-green-600" stroke={1.5} />
            <p className="font-bold text-card-outline">
              Welcome, <span className="font-handwriting text-xl">{cardData.name}</span>! Your protection card is ready.
            </p>
          </div>
        )}
      </div>

      {/* 3-Column Layout */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 xl:gap-8">

          {/* LEFT — Missions (mobile: order-2, desktop: order-1) */}
          <div className="order-2 lg:order-1">
            <MissionList
              missions={missions}
              boosterPacks={boosterPacks}
              onComplete={handleComplete}
            />
          </div>

          {/* CENTER — Protection Card (mobile: order-1, desktop: order-2) */}
          <div className="order-1 lg:order-2 lg:w-[360px] xl:w-[400px]">
            <MainProtectionCard
              data={cardData}
              boosterPacks={boosterPacks}
              streak={streak}
              onOpenPacks={() => setShowPackModal(true)}
            />
          </div>

          {/* RIGHT — Tools (mobile: order-3, desktop: order-3) */}
          <div className="order-3">
            <ToolsPanel onToolClick={handleToolClick} />
          </div>

        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <p className="text-xs opacity-30 font-sans">
          AI tools help organise and explain information. Final recommendations should be reviewed with a licensed advisor.
        </p>
      </div>
    </div>
  );
}

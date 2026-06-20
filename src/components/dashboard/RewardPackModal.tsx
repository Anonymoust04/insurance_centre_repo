'use client';
import React, { useState } from 'react';
import type { PackReward } from '@/data/dashboard';
import { PACK_REWARDS } from '@/data/dashboard';
import {
  IconPackage,
  IconSparkles,
  IconStar,
  IconTicket,
  IconStethoscope,
  IconBulb,
  IconAward,
  IconFlame,
  IconSearch,
  IconFeather,
} from '@tabler/icons-react';

interface RewardPackModalProps {
  packCount: number;
  onClose: (packsOpened: number) => void;
}

const PACK_TYPES = [
  { type: 'standard', label: 'Standard Pack', icon: <IconPackage size={32} stroke={1.5} />, bg: 'bg-energy-water/40', border: 'border-blue-300' },
  { type: 'rare', label: 'Rare Pack', icon: <IconSparkles size={32} stroke={1.5} />, bg: 'bg-pastel-lavender', border: 'border-purple-300' },
  { type: 'legendary', label: 'Legendary Pack', icon: <IconStar size={32} stroke={1.5} />, bg: 'bg-energy-electric/50', border: 'border-yellow-400' },
];

const REWARD_ICONS: Record<string, React.ReactNode> = {
  ticket: <IconTicket size={48} stroke={1.5} />,
  stethoscope: <IconStethoscope size={48} stroke={1.5} />,
  bulb: <IconBulb size={48} stroke={1.5} />,
  award: <IconAward size={48} stroke={1.5} />,
  flame: <IconFlame size={48} stroke={1.5} />,
  star: <IconStar size={48} stroke={1.5} />,
  search: <IconSearch size={48} stroke={1.5} />,
  bird: <IconFeather size={48} stroke={1.5} />,
};

export function RewardPackModal({ packCount, onClose }: RewardPackModalProps) {
  const [phase, setPhase] = useState<'select' | 'opening' | 'reveal'>('select');
  const [reward, setReward] = useState<PackReward | null>(null);
  const [opened, setOpened] = useState(0);
  const [selectedPack, setSelectedPack] = useState(0);
  const [shake, setShake] = useState(false);

  const openPack = () => {
    setPhase('opening');
    setShake(true);
    setTimeout(() => setShake(false), 600);
    setTimeout(() => {
      const random = PACK_REWARDS[Math.floor(Math.random() * PACK_REWARDS.length)];
      setReward(random);
      setOpened((p) => p + 1);
      setPhase('reveal');
    }, 900);
  };

  const openAnother = () => {
    setReward(null);
    setPhase('select');
  };

  const handleClose = () => {
    onClose(opened);
  };

  const pack = PACK_TYPES[selectedPack % PACK_TYPES.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-card-outline/40 backdrop-blur-sm">
      <div
        className="w-full max-w-sm bg-pastel-yellow border-sketch shadow-2xl flex flex-col gap-5 p-6 relative"
        style={{ animation: 'fadeInScale 0.3s ease-out' }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white/60 border-[2px] border-card-outline/30 rounded-full font-bold text-card-outline hover:bg-red-100 transition-colors text-sm"
        >
          ✕
        </button>

        {/* Title */}
        <div className="text-center">
          <h2 className="font-handwriting text-4xl font-bold text-card-outline">Booster Packs!</h2>
          <p className="text-sm opacity-60 mt-1">You have <span className="font-bold text-purple-600">{packCount - opened}</span> packs remaining</p>
        </div>

        {/* SELECT PHASE */}
        {phase === 'select' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2">
              {PACK_TYPES.map((p, i) => (
                <button
                  key={p.type}
                  onClick={() => setSelectedPack(i)}
                  className={`flex flex-col items-center gap-1.5 p-3 border-[3px] transition-all text-card-outline ${
                    selectedPack === i ? `${p.border} ${p.bg} scale-105 shadow-md` : 'border-card-outline/20 bg-white/50 hover:scale-102 opacity-60'
                  }`}
                  style={{ borderRadius: '12px 14px 10px 13px' }}
                >
                  <div className="flex items-center justify-center">{p.icon}</div>
                  <span className="text-[10px] font-bold text-center leading-tight opacity-70">{p.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={openPack}
              className="w-full py-4 bg-pastel-pink border-sketch hover:bg-pink-300 transition-all font-handwriting text-2xl font-bold text-card-outline shadow-md hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
            >
              {pack.icon} Open {pack.label}
            </button>
          </div>
        )}

        {/* OPENING PHASE */}
        {phase === 'opening' && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div
              className={`text-card-outline ${shake ? 'animate-bounce' : ''} transition-transform scale-[2.25] origin-center mb-6`}
              style={{ animation: shake ? 'shake 0.5s ease-in-out' : 'spin 1s ease-in-out' }}
            >
              {pack.icon}
            </div>
            <p className="font-handwriting text-2xl font-bold text-card-outline animate-pulse">
              Opening…
            </p>
          </div>
        )}

        {/* REVEAL PHASE */}
        {phase === 'reveal' && reward && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-card-outline animate-bounce">
              {REWARD_ICONS[reward.iconId]}
            </div>
            <div className="text-center">
              <p className="font-handwriting text-2xl font-bold text-card-outline">{reward.title}</p>
              <p className="text-sm opacity-70 mt-1 leading-snug">{reward.description}</p>
            </div>
            <div className="flex gap-3 w-full">
              {opened < packCount && (
                <button
                  onClick={openAnother}
                  className="flex-1 py-3 bg-pastel-lavender border-sketch-sm hover:bg-purple-200 transition-all font-bold text-card-outline active:scale-95"
                >
                  Open Another!
                </button>
              )}
              <button
                onClick={handleClose}
                className="flex-1 py-3 bg-white/60 border-sketch-sm hover:bg-gray-100 transition-all font-bold text-card-outline active:scale-95"
              >
                {opened >= packCount ? 'All Done! 🎉' : 'Save for Later'}
              </button>
            </div>
          </div>
        )}

        {/* Sparkle decorations */}
        <div className="absolute top-3 left-5 text-card-outline opacity-20 text-xl rotate-12">✧</div>
        <div className="absolute bottom-4 left-8 text-card-outline opacity-20 text-lg -rotate-6">✦</div>
        <div className="absolute top-8 right-10 text-card-outline opacity-15 text-2xl rotate-45">✧</div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0) rotate(0deg); }
          20%      { transform: translateX(-8px) rotate(-8deg); }
          40%      { transform: translateX(8px) rotate(8deg); }
          60%      { transform: translateX(-5px) rotate(-5deg); }
          80%      { transform: translateX(5px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

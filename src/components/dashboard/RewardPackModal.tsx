'use client';
import React, { useState } from 'react';
import { PACK_REWARDS } from '@/data/dashboard';
import type { PackReward } from '@/data/dashboard';
import {
  IconPackage,
  IconSticker,
  IconAward,
  IconFrame,
} from '@tabler/icons-react';

interface RewardPackModalProps {
  packCount: number;
  onClose: (packsOpened: number) => void;
}

const REWARD_ICONS: Record<string, React.ReactNode> = {
  sticker: <IconSticker size={56} stroke={1.5} />,
  badge: <IconAward size={56} stroke={1.5} />,
  frame: <IconFrame size={56} stroke={1.5} />,
};

const REWARD_COLORS: Record<string, string> = {
  sticker: 'text-pink-500',
  badge: 'text-purple-500',
  frame: 'text-yellow-600',
};

const REWARD_BG: Record<string, string> = {
  sticker: 'bg-pastel-pink/60',
  badge: 'bg-pastel-lavender/60',
  frame: 'bg-energy-electric/30',
};

export function RewardPackModal({ packCount, onClose }: RewardPackModalProps) {
  const [phase, setPhase] = useState<'ready' | 'opening' | 'reveal'>('ready');
  const [reward, setReward] = useState<PackReward | null>(null);
  const [opened, setOpened] = useState(0);
  const [shake, setShake] = useState(false);

  const remaining = packCount - opened;

  const openPack = () => {
    if (remaining <= 0) return;
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
    setPhase('ready');
  };

  const handleClose = () => {
    onClose(opened);
  };

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
          <h2 className="font-handwriting text-4xl font-bold text-card-outline">Booster Pack!</h2>
          <p className="text-sm opacity-60 mt-1">
            You have <span className="font-bold text-purple-600">{remaining}</span> {remaining === 1 ? 'pack' : 'packs'} remaining
          </p>
        </div>

        {/* READY PHASE — just show the pack and open button */}
        {phase === 'ready' && (
          <div className="flex flex-col items-center gap-5">
            <div className="w-24 h-24 bg-pastel-lavender/50 border-[3px] border-purple-300 flex items-center justify-center text-card-outline"
              style={{ borderRadius: '18px 22px 16px 20px' }}
            >
              <IconPackage size={48} stroke={1.5} />
            </div>
            <button
              onClick={openPack}
              disabled={remaining <= 0}
              className="w-full py-4 bg-pastel-pink border-sketch hover:bg-pink-300 transition-all font-handwriting text-2xl font-bold text-card-outline shadow-md hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconPackage size={24} /> Open Booster Pack
            </button>
          </div>
        )}

        {/* OPENING PHASE */}
        {phase === 'opening' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div
              className={`text-card-outline transition-transform ${shake ? '' : ''}`}
              style={{ animation: shake ? 'shake 0.5s ease-in-out' : 'spin 1s ease-in-out', transform: 'scale(2)' }}
            >
              <IconPackage size={48} stroke={1.5} />
            </div>
            <p className="font-handwriting text-2xl font-bold text-card-outline animate-pulse mt-4">
              Opening…
            </p>
          </div>
        )}

        {/* REVEAL PHASE */}
        {phase === 'reveal' && reward && (
          <div className="flex flex-col items-center gap-4">
            {/* Reward icon */}
            <div className={`w-28 h-28 ${REWARD_BG[reward.type]} border-[3px] border-card-outline/20 rounded-2xl flex items-center justify-center ${REWARD_COLORS[reward.type]} animate-bounce`}>
              {REWARD_ICONS[reward.type]}
            </div>

            {/* Reward type label */}
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
              {reward.type === 'frame' ? 'Special Frame' : reward.type}
            </span>

            {/* Reward info */}
            <div className="text-center">
              <p className="font-handwriting text-2xl font-bold text-card-outline">{reward.title}</p>
              <p className="text-sm opacity-70 mt-1 leading-snug">{reward.description}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full">
              {remaining - 1 > 0 && (
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
                {remaining - 1 <= 0 ? 'All Done! 🎉' : 'Save for Later'}
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
          0%,100% { transform: translateX(0) rotate(0deg) scale(2); }
          20%      { transform: translateX(-8px) rotate(-8deg) scale(2); }
          40%      { transform: translateX(8px) rotate(8deg) scale(2); }
          60%      { transform: translateX(-5px) rotate(-5deg) scale(2); }
          80%      { transform: translateX(5px) rotate(5deg) scale(2); }
        }
      `}</style>
    </div>
  );
}

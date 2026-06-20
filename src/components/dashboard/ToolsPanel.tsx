'use client';
import React from 'react';
import { TOOL_ITEMS } from '@/data/dashboard';
import {
  IconCreditCard,
  IconStethoscope,
  IconClipboardList,
  IconRobot,
  IconPhoneCall,
  IconBulb,
  IconShieldCheck,
  IconUserPlus,
} from '@tabler/icons-react';

const TOOL_ICONS: Record<string, React.ReactNode> = {
  'credit-card': <IconCreditCard size={28} stroke={1.5} />,
  'stethoscope': <IconStethoscope size={28} stroke={1.5} />,
  'clipboard': <IconClipboardList size={28} stroke={1.5} />,
  'user-plus': <IconUserPlus size={28} stroke={1.5} />,
  'robot': <IconRobot size={28} stroke={1.5} />,
  'phone': <IconPhoneCall size={28} stroke={1.5} />,
};

interface ToolsPanelProps {
  onToolClick: (id: string) => void;
  onCheckIn: () => void;
  isCheckedIn: boolean;
}

export function ToolsPanel({ onToolClick, onCheckIn, isCheckedIn }: ToolsPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="bg-white/50 p-5 border-sketch-sm shadow-sm">
        <h2 className="font-handwriting text-3xl font-bold text-card-outline mb-1">Apps & Tools</h2>
        <p className="text-sm opacity-60 font-sans leading-snug">
          Quick actions to help you stay on top of your protection and wellbeing.
        </p>
      </div>

      {/* App Grid inside a single rectangular space */}
      <div className="bg-white/40 border-sketch-sm p-6 shadow-inner">
        <div className="grid grid-cols-3 gap-y-6 gap-x-4 place-items-center">
          {TOOL_ITEMS.map((tool) => (
            <div key={tool.id} className="flex flex-col items-center gap-2 w-full max-w-[80px]">
              <button
                onClick={() => onToolClick(tool.id)}
                className={`w-[68px] h-[68px] flex flex-col items-center justify-center ${tool.color} border-[3px] ${tool.border} text-card-outline transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95 hover:rotate-1`}
                style={{ borderRadius: '18px 22px 16px 20px' }}
              >
                {TOOL_ICONS[tool.iconId]}
              </button>
              <span className="text-[11px] font-bold text-card-outline text-center leading-tight">
                {tool.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Small tip */}
      <div className="bg-white/40 border-[2px] border-card-outline/15 p-3 flex items-start gap-2"
        style={{ borderRadius: '12px 14px 10px 13px' }}>
        <IconBulb size={18} className="flex-shrink-0 text-card-outline/60 mt-0.5" />
        <p className="text-xs opacity-60 leading-snug">
          <span className="font-bold">Tip:</span> Complete a Daily Checkup + Health Record to unlock your next booster pack faster.
        </p>
      </div>

      {/* Check In Button */}
      <button
        onClick={onCheckIn}
        disabled={isCheckedIn}
        className={`w-full border-sketch-sm transition-all px-5 py-4 flex items-center justify-center gap-3 font-bold shadow-sm ${
          isCheckedIn
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
            : 'bg-energy-grass/50 hover:bg-energy-grass/70 text-card-outline hover:-translate-y-0.5 active:scale-[0.97]'
        }`}
      >
        <IconShieldCheck size={24} stroke={1.5} />
        <span className="font-handwriting text-2xl">{isCheckedIn ? 'Checked In ✓' : 'Check In'}</span>
      </button>
    </div>
  );
}

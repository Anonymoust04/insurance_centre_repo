'use client';

import { IconCalendar } from '@tabler/icons-react';

interface AgentHeaderProps {
  title: string;
  subtitle?: string;
}

export function AgentHeader({ title, subtitle }: AgentHeaderProps) {
  const today = new Date(2026, 5, 20).toLocaleDateString('en-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="px-6 py-4 flex items-center justify-between border-b-2 border-card-outline/20 bg-game-yellow shrink-0">
      <div>
        <h1 className="font-handwriting text-2xl text-game-text leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-game-purple-deep mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Date chip */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 border-card-outline/40 bg-card-cream text-xs font-semibold text-game-text">
          <IconCalendar size={13} className="text-game-purple" />
          {today}
        </div>

        {/* Agent avatar */}
        <div className="w-9 h-9 rounded-full bg-game-purple border-2 border-card-outline flex items-center justify-center ml-1">
          <span className="text-white text-xs font-bold">FD</span>
        </div>
      </div>
    </header>
  );
}

'use client';

import { IconBell, IconSearch } from '@tabler/icons-react';

interface AgentHeaderProps {
  title: string;
  subtitle?: string;
}

export function AgentHeader({ title, subtitle }: AgentHeaderProps) {
  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 shrink-0">
      <div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors">
          <IconSearch size={18} />
        </button>
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors">
          <IconBell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-1">
          <span className="text-white text-xs font-bold">FD</span>
        </div>
      </div>
    </header>
  );
}

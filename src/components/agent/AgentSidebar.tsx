'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconLayoutDashboard,
  IconTrophy,
  IconUsers,
  IconChartBar,
  IconUserCircle,
  IconLogout,
  IconShield,
  IconSparkles,
} from '@tabler/icons-react';
import { cn } from '@/utils/cn';

const navItems = [
  { label: 'Dashboard', href: '/agent/dashboard', icon: IconLayoutDashboard },
  { label: 'Leaderboard', href: '/agent/dashboard/leaderboard', icon: IconTrophy },
  { label: 'Customers', href: '/agent/dashboard/customers', icon: IconUsers },
  { label: 'AI Tools', href: '/agent/dashboard/ai-tools', icon: IconSparkles },
  { label: 'Sales Performance', href: '/agent/dashboard/sales', icon: IconChartBar },
  { label: 'Profile', href: '/agent/dashboard/profile', icon: IconUserCircle },
];

export function AgentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 dark:bg-slate-950 flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-slate-700/60">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <IconShield size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">SecureLife</p>
            <p className="text-slate-400 text-xs mt-0.5">Agent Portal</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/agent/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon size={18} stroke={isActive ? 2 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 border-t border-slate-700/60 pt-3">
        <Link
          href="/agent/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all duration-150"
        >
          <IconLogout size={18} stroke={1.5} />
          Logout
        </Link>
      </div>
    </aside>
  );
}

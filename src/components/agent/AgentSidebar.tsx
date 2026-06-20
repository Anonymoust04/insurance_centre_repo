'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  IconLayoutDashboard,
  IconTrophy,
  IconUsers,
  IconLogout,
  IconBolt,
  IconSparkles,
} from '@tabler/icons-react';
import { cn } from '@/utils/cn';
import trophyImg from '@/assets/sidebar-trophy.png';
import sparkleImg from '@/assets/sidebar-sparkle.png';

const navItems = [
  { label: 'Dashboard', href: '/agent/dashboard', icon: IconLayoutDashboard },
  { label: 'AI Tools', href: '/agent/dashboard/ai-tools', icon: IconSparkles, badge: 'New' },
  { label: 'Leaderboard', href: '/agent/dashboard/leaderboard', icon: IconTrophy },
  { label: 'Customers', href: '/agent/dashboard/customers', icon: IconUsers },
];

export function AgentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-game-yellow border-r-2 border-card-outline flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b-2 border-card-outline/20">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-game-purple flex items-center justify-center shadow-sm">
            <IconBolt size={18} className="text-white" />
          </div>
          <div className="leading-none">
            <span className="font-handwriting text-game-text text-xl">Insurance </span>
            <span className="font-handwriting text-game-purple text-xl italic">Center</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const isActive = pathname === href || (href !== '/agent/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150',
                isActive
                  ? 'bg-game-pink-soft border-2 border-card-outline text-game-text shadow-sm'
                  : 'text-game-purple-deep hover:bg-pastel-lavender/60 border-2 border-transparent'
              )}
            >
              <Icon size={18} stroke={isActive ? 2 : 1.8} className="text-game-purple" />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="text-xs font-bold bg-game-pink text-white px-2 py-0.5 rounded-full">{badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Motivational card */}
      <div className="mx-3 mb-3 p-4 bg-pastel-lavender border-2 border-card-outline/40 rounded-3xl">
        <div className="flex items-center gap-1.5 mb-2">
          <Image src={sparkleImg} alt="sparkle" width={18} height={18} className="shrink-0" unoptimized />
          <p className="font-handwriting font-bold text-game-text text-base">You&apos;re doing great!</p>
        </div>
        <p className="text-xs text-game-purple-deep leading-relaxed mb-3">
          Keep helping more families build their protection.
        </p>
        <div className="flex justify-center">
          <Image src={trophyImg} alt="trophy" width={56} height={56} className="object-contain drop-shadow-sm" unoptimized />
        </div>
      </div>

      {/* Logout */}
      <div className="px-3 pb-4 border-t-2 border-card-outline/20 pt-3">
        <Link
          href="/agent/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold text-game-purple border-2 border-transparent hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all duration-150"
        >
          <IconLogout size={18} stroke={1.8} />
          Logout
        </Link>
      </div>
    </aside>
  );
}

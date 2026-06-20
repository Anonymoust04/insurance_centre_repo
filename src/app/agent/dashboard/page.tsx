'use client';

import agentsData from '@/data/getAgent.json';
import profilesData from '@/data/getProfile.json';
import briefData from '@/data/getMorningBrief.json';
import type { AgentPerformance, CustomerProfile, MorningBriefItem } from '@/types/agent';
import { AgentHeader } from '@/components/agent/AgentHeader';
import { AgentStatCard } from '@/components/agent/AgentStatCard';
import { MorningBrief } from '@/components/agent/MorningBrief';
import { TodayPipeline } from '@/components/agent/TodayPipeline';
import { AgentMissions } from '@/components/agent/AgentMissions';
import {
  IconFileCheck,
  IconCurrencyDollar,
  IconUsers,
  IconMedal,
  IconArrowRight,
  IconSparkles,
} from '@tabler/icons-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const agents = agentsData as AgentPerformance[];
const customers = profilesData as CustomerProfile[];
const briefItems = briefData as MorningBriefItem[];

const CURRENT_AGENT_ID = 'agent-008';
const currentAgent = agents.find(a => a.id === CURRENT_AGENT_ID)!;
const top5 = agents.slice(0, 5);
const policiesToTop5 = Math.max(0, agents[4].policiesClosed - currentAgent.policiesClosed + 1);

const rankEmojiMap: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function AgentDashboardPage() {
  const firstName = currentAgent.fullName.split(' ')[0];
  const totalRevenue = agents.reduce((s, a) => s + a.monthlyRevenue, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <AgentHeader
        title={`Hello, Agent ${firstName}! 👋`}
        subtitle="Here's your dashboard overview for today."
      />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">

        {/* KPI stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <AgentStatCard
            label="My Rank"
            value={`#${currentAgent.rank}`}
            icon={IconMedal}
            accent="pink"
            subtext="↑ 2 from last month"
            delay={0}
          />
          <AgentStatCard
            label="Policies Closed"
            value={`${currentAgent.policiesClosed}`}
            icon={IconFileCheck}
            accent="peach"
            subtext="This Month"
            delay={0.06}
          />
          <AgentStatCard
            label="Total Revenue"
            value={`RM ${(currentAgent.monthlyRevenue / 1000).toFixed(0)},${String(currentAgent.monthlyRevenue).slice(-3)}`}
            icon={IconCurrencyDollar}
            accent="mint"
            subtext="This Month"
            delay={0.12}
          />
          <AgentStatCard
            label="Total Customers"
            value={`${customers.length}`}
            icon={IconUsers}
            accent="lavender"
            subtext="Active Clients"
            delay={0.18}
          />
        </div>

        {/* Main 3-col grid */}
        <div className="grid xl:grid-cols-3 gap-6">

          {/* Top 5 Agents */}
          <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/60 shadow-[0_4px_20px_rgba(107,33,217,0.10)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-handwriting text-xl text-game-text">Top 5 Agents This Month</h2>
              <Link href="/agent/dashboard/leaderboard" className="flex items-center gap-1 text-xs font-bold text-game-purple bg-pastel-lavender px-3 py-1.5 rounded-full hover:bg-game-purple hover:text-white transition-colors">
                View Leaderboard
              </Link>
            </div>

            <div className="space-y-2">
              {top5.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-pastel-yellow/60 transition-colors"
                >
                  {/* Rank circle */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 font-bold ${
                    agent.rank === 1 ? 'bg-[#FFD700]' :
                    agent.rank === 2 ? 'bg-[#C0C0C0]' :
                    agent.rank === 3 ? 'bg-[#CD7F32] text-white' :
                    'bg-pastel-lavender text-game-purple'
                  }`}>
                    {agent.rank <= 3 ? rankEmojiMap[agent.rank] : agent.rank}
                  </div>

                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-game-purple border-2 border-card-outline/40 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {agent.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-game-text truncate">{agent.fullName}</p>
                    <p className="text-xs text-game-purple/60 truncate">{agent.branch}</p>
                  </div>

                  {/* Stats */}
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-game-text">{agent.policiesClosed}</p>
                    <p className="text-xs text-game-purple/60">Policies</p>
                  </div>
                  <div className="text-right shrink-0 w-16">
                    <p className="text-xs font-bold text-game-purple">RM {(agent.monthlyRevenue / 1000).toFixed(0)}K</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Motivational banner */}
            <div className="mt-4 flex items-center gap-3 bg-pastel-yellow rounded-2xl px-4 py-3 border border-card-outline/20">
              <span className="text-xl shrink-0">⭐</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-game-text">You are currently ranked #{currentAgent.rank}.</p>
                <p className="text-xs text-game-purple">Close {policiesToTop5} more policies to reach the top 5!</p>
              </div>
              <span className="text-xl shrink-0">🚀</span>
            </div>
          </div>

          {/* AI Morning Brief */}
          <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/60 shadow-[0_4px_20px_rgba(107,33,217,0.10)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-handwriting text-xl text-game-text">AI Morning Brief</h2>
              <Link href="/agent/dashboard/ai-tools" className="text-xs font-bold text-game-purple bg-pastel-lavender px-3 py-1.5 rounded-full hover:bg-game-purple hover:text-white transition-colors">
                View All
              </Link>
            </div>
            <div className="space-y-2 mb-4">
              {briefItems.slice(0, 4).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 p-3 rounded-2xl hover:bg-pastel-yellow/60 transition-colors cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                    item.type === 'urgency' ? 'bg-red-100' :
                    item.type === 'milestone' ? 'bg-[#FFF9C4]' :
                    'bg-pastel-lavender'
                  }`}>
                    <span className="text-base">{item.type === 'urgency' ? '⚠️' : item.type === 'milestone' ? '⭐' : '👶'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-game-text leading-snug">{item.insight}</p>
                    <p className="text-xs text-game-purple/60 mt-0.5">{item.detail}</p>
                  </div>
                  <IconArrowRight size={14} className="text-game-purple/40 shrink-0 mt-1" />
                </motion.div>
              ))}
            </div>
            <Link
              href="/agent/dashboard/ai-tools"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-card-outline/60 text-game-text font-bold text-sm hover:bg-pastel-lavender transition-colors"
            >
              <IconSparkles size={15} className="text-game-purple" />
              Go to AI Tools
            </Link>
          </div>

          {/* Recent Customers */}
          <div className="bg-card-cream rounded-3xl p-5 border-2 border-card-outline/60 shadow-[0_4px_20px_rgba(107,33,217,0.10)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-handwriting text-xl text-game-text">Recent Customers</h2>
              <Link href="/agent/dashboard/customers" className="text-xs font-bold text-game-purple bg-pastel-lavender px-3 py-1.5 rounded-full hover:bg-game-purple hover:text-white transition-colors">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {customers.slice(0, 5).map((c, i) => {
                const hp = c.protectionHpDays ?? c.hpDays;
                const isUrgent = hp > 0 && hp < 100;
                const isLapsed = hp === 0;
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-pastel-yellow/60 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-game-purple border-2 border-card-outline/40 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {c.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-game-text truncate">{c.fullName}</p>
                      <p className="text-xs text-game-purple/60">HP: {isLapsed ? 'Lapsed' : `${hp} days`}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                      isLapsed ? 'bg-red-100 text-red-600' :
                      isUrgent ? 'bg-game-pink-soft text-game-pink' :
                      'bg-game-mint text-[#065F46]'
                    }`}>
                      {isLapsed ? '⚠ Lapsed' : isUrgent ? 'Urgent' : 'Good'}
                    </span>
                    <IconArrowRight size={14} className="text-game-purple/40 shrink-0" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Morning Brief + Pipeline row */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-game-text flex items-center gap-2 text-sm">
                <IconSparkles size={15} className="text-game-purple" />
                Detailed Morning Brief
              </h2>
            </div>
            <MorningBrief items={briefItems} agentFirstName={firstName} generatedAt="8:02 AM" />
          </div>
          <div>
            <TodayPipeline items={briefItems} />
          </div>
        </div>

        {/* Agent Daily Missions */}
        <AgentMissions />

      </main>
    </div>
  );
}

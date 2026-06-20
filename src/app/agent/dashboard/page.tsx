'use client';

import agentsData from '@/data/getAgent.json';
import profilesData from '@/data/getProfile.json';
import briefData from '@/data/getMorningBrief.json';
import type { AgentPerformance, CustomerProfile, MorningBriefItem } from '@/types/agent';
import { AgentHeader } from '@/components/agent/AgentHeader';
import { AgentStatCard } from '@/components/agent/AgentStatCard';
import { AgentLeaderboardTable } from '@/components/agent/AgentLeaderboardTable';
import { CustomerCard } from '@/components/agent/CustomerCard';
import { MorningBrief } from '@/components/agent/MorningBrief';
import { TodayPipeline } from '@/components/agent/TodayPipeline';
import {
  IconFileCheck,
  IconCurrencyDollar,
  IconUsers,
  IconTrophy,
  IconTargetArrow,
  IconArrowRight,
} from '@tabler/icons-react';
import Link from 'next/link';

const agents = agentsData as AgentPerformance[];
const customers = profilesData as CustomerProfile[];
const briefItems = briefData as MorningBriefItem[];

// Simulating logged-in agent as Farah (rank 8) — agent-008
const CURRENT_AGENT_ID = 'agent-008';
const currentAgent = agents.find(a => a.id === CURRENT_AGENT_ID)!;
const topAgent = agents[0];
const policiesToTop5 = Math.max(0, agents[4].policiesClosed - currentAgent.policiesClosed + 1);

export default function AgentDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AgentHeader
        title={`Good morning, ${currentAgent.fullName.split(' ')[0]} 👋`}
        subtitle={`${new Date().toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
      />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Motivational rank card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">Your ranking</p>
              <p className="text-3xl font-bold mt-1">
                #{currentAgent.rank} <span className="text-blue-300 text-base font-medium">of {agents.length}</span>
              </p>
              <p className="text-blue-100 text-sm mt-2">
                Close <span className="font-bold text-white">{policiesToTop5} more {policiesToTop5 === 1 ? 'policy' : 'policies'}</span> to break into the Top 5.
              </p>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-xs">This month</p>
              <p className="text-2xl font-bold">{currentAgent.policiesClosed}</p>
              <p className="text-blue-200 text-xs">policies closed</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
              <span>Monthly target progress</span>
              <span>{currentAgent.targetAchievement}%</span>
            </div>
            <div className="h-2 bg-blue-800/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/90 rounded-full transition-all"
                style={{ width: `${Math.min(currentAgent.targetAchievement, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Morning Brief */}
        <div>
          <MorningBrief
            items={briefItems}
            agentFirstName={currentAgent.fullName.split(' ')[0]}
            generatedAt="8:02 AM"
          />
        </div>

        {/* Today's pipeline + stats side-by-side on large screens */}
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <TodayPipeline items={briefItems} />
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-start">
            <AgentStatCard
              label="Policies Closed"
              value={`${currentAgent.policiesClosed}`}
              icon={IconFileCheck}
              accent="blue"
              trend="up"
              trendValue="vs last mo"
              delay={0}
            />
            <AgentStatCard
              label="Monthly Revenue"
              value={`RM ${(currentAgent.monthlyRevenue / 1000).toFixed(0)}K`}
              icon={IconCurrencyDollar}
              accent="emerald"
              trend="up"
              trendValue="8.2%"
              delay={0.06}
            />
            <AgentStatCard
              label="Customers"
              value={`${customers.length}`}
              icon={IconUsers}
              accent="violet"
              subtext="Active holders"
              delay={0.12}
            />
            <AgentStatCard
              label="Conversion"
              value={`${currentAgent.conversionRate}%`}
              icon={IconTargetArrow}
              accent="amber"
              trend="up"
              trendValue="3%"
              delay={0.18}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Mini leaderboard */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <IconTrophy size={16} className="text-amber-500" />
                Top Agents This Month
              </h2>
              <Link href="/agent/dashboard/leaderboard" className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Full leaderboard <IconArrowRight size={13} />
              </Link>
            </div>
            <AgentLeaderboardTable agents={agents} currentAgentId={CURRENT_AGENT_ID} showAll={false} />
          </div>

          {/* Top agent spotlight */}
          <div className="lg:col-span-2">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Top Agent Spotlight</h2>
            <div className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/10 dark:to-slate-800 rounded-2xl p-5 border border-amber-100 dark:border-amber-800/30 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
                  {topAgent.avatar}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{topAgent.fullName}</p>
                  <p className="text-xs text-slate-500">{topAgent.branch}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Policies', value: `${topAgent.policiesClosed}` },
                  { label: 'Revenue', value: `RM ${(topAgent.monthlyRevenue / 1000).toFixed(0)}K` },
                  { label: 'Conversion', value: `${topAgent.conversionRate}%` },
                  { label: 'Target', value: `${topAgent.targetAchievement}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/70 dark:bg-slate-700/40 rounded-xl p-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customer preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <IconUsers size={16} className="text-blue-500" />
              Recent Customers
            </h2>
            <Link href="/agent/dashboard/customers" className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
              All customers <IconArrowRight size={13} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {customers.slice(0, 3).map((c, i) => (
              <CustomerCard key={c.id} customer={c} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

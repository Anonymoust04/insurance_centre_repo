'use client';

import { useState } from 'react';
import profilesData from '@/data/getProfile.json';
import type { CustomerProfile } from '@/types/agent';
import { AgentHeader } from '@/components/agent/AgentHeader';
import { AiToolCard } from '@/components/agent/ai-tools/AiToolCard';
import { SmartMorningBrief } from '@/components/agent/ai-tools/SmartMorningBrief';
import { FollowUpDraftGenerator } from '@/components/agent/ai-tools/FollowUpDraftGenerator';
import { ProtectionGapExplainer } from '@/components/agent/ai-tools/ProtectionGapExplainer';
import { MeetingPrepCard } from '@/components/agent/ai-tools/MeetingPrepCard';
import {
  IconSunHigh,
  IconMessage2,
  IconShieldSearch,
  IconClipboardText,
  IconSparkles,
} from '@tabler/icons-react';

const customers = profilesData as CustomerProfile[];

type ToolId = 'morning-brief' | 'followup-draft' | 'protection-gap' | 'meeting-prep';

const tools: { id: ToolId; icon: React.ElementType; title: string; description: string }[] = [
  {
    id: 'morning-brief',
    icon: IconSunHigh,
    title: 'Smart Morning Brief',
    description: 'AI-ranked urgent clients, follow-ups, and today\'s activity feed.',
  },
  {
    id: 'followup-draft',
    icon: IconMessage2,
    title: 'Follow-up Draft Generator',
    description: 'Generate 3 WhatsApp draft options in warm, professional, or friendly tone.',
  },
  {
    id: 'protection-gap',
    icon: IconShieldSearch,
    title: 'Protection Gap Explainer',
    description: 'Covered areas vs gaps, risk impact, talking points, next recommendation.',
  },
  {
    id: 'meeting-prep',
    icon: IconClipboardText,
    title: 'Meeting Prep Card',
    description: 'One-page brief: life stage, HP, boosters, coverage, conversation opener.',
  },
];

export default function AiToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolId>('morning-brief');

  const renderTool = () => {
    switch (activeTool) {
      case 'morning-brief': return <SmartMorningBrief customers={customers} />;
      case 'followup-draft': return <FollowUpDraftGenerator customers={customers} />;
      case 'protection-gap': return <ProtectionGapExplainer customers={customers} />;
      case 'meeting-prep': return <MeetingPrepCard customers={customers} />;
    }
  };

  const active = tools.find(t => t.id === activeTool)!;

  return (
    <div className="flex flex-col min-h-screen">
      <AgentHeader
        title="✨ AI Advisor Tools"
        subtitle="Mock AI productivity tools — logic-driven from your local customer data"
      />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Intro banner */}
        <div className="flex items-start gap-3 p-4 mb-6 bg-card-cream rounded-3xl border-2 border-card-outline/60 shadow-[0_4px_16px_rgba(107,33,217,0.08)]">
          <div className="w-10 h-10 rounded-2xl bg-game-purple flex items-center justify-center shrink-0">
            <IconSparkles size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-game-text">Mock AI Preview — 4 Advisor Productivity Tools</p>
            <p className="text-xs text-game-purple mt-0.5">
              Generated from local customer JSON. Advisor reviews before taking action.
              Items labelled <span className="font-bold text-game-pink">&ldquo;AI Suggested&rdquo;</span> require your review — you decide every action.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Tool selector */}
          <div className="lg:col-span-1 space-y-2">
            <p className="text-xs font-bold text-game-purple uppercase tracking-wider px-1 mb-3">Choose a Tool</p>
            {tools.map((tool, i) => (
              <AiToolCard
                key={tool.id}
                id={tool.id}
                icon={tool.icon}
                title={tool.title}
                description={tool.description}
                isActive={activeTool === tool.id}
                delay={i * 0.06}
                onClick={(id) => setActiveTool(id as ToolId)}
              />
            ))}
          </div>

          {/* Active tool panel */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-2xl bg-game-purple flex items-center justify-center">
                <active.icon size={16} className="text-white" />
              </div>
              <h2 className="font-handwriting text-xl text-game-text">{active.title}</h2>
            </div>
            {renderTool()}
          </div>
        </div>
      </main>
    </div>
  );
}

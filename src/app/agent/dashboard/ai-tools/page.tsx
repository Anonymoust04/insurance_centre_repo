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
  IconMessageDots,
  IconShieldHalf,
  IconClipboardList,
  IconSparkles,
} from '@tabler/icons-react';

const customers = profilesData as CustomerProfile[];

type ToolId = 'morning-brief' | 'followup-draft' | 'protection-gap' | 'meeting-prep';

const tools: { id: ToolId; icon: React.ElementType; title: string; description: string }[] = [
  {
    id: 'morning-brief',
    icon: IconSunHigh,
    title: 'Smart Morning Brief',
    description: 'AI-ranked list of urgent clients, follow-ups due, and activity feed for your day.',
  },
  {
    id: 'followup-draft',
    icon: IconMessageDots,
    title: 'Follow-up Draft Generator',
    description: 'Generate 3 WhatsApp draft options in warm, professional, or friendly tone.',
  },
  {
    id: 'protection-gap',
    icon: IconShieldHalf,
    title: 'Protection Gap Explainer',
    description: 'See covered areas vs gaps, risk impact, talking points, and next recommendation.',
  },
  {
    id: 'meeting-prep',
    icon: IconClipboardList,
    title: 'Meeting Prep Card',
    description: 'One-page brief with life stage, HP status, boosters, coverage, and a conversation opener.',
  },
];

export default function AiToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolId>('morning-brief');

  const renderTool = () => {
    switch (activeTool) {
      case 'morning-brief':
        return <SmartMorningBrief customers={customers} />;
      case 'followup-draft':
        return <FollowUpDraftGenerator customers={customers} />;
      case 'protection-gap':
        return <ProtectionGapExplainer customers={customers} />;
      case 'meeting-prep':
        return <MeetingPrepCard customers={customers} />;
    }
  };

  const active = tools.find(t => t.id === activeTool)!;

  return (
    <div className="flex flex-col min-h-screen">
      <AgentHeader
        title="AI Advisor Tools"
        subtitle="Mock AI productivity tools — logic-driven, no real AI model"
      />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Page intro */}
        <div className="flex items-start gap-3 p-4 mb-6 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/10 dark:to-blue-900/10 rounded-2xl border border-violet-100 dark:border-violet-800/30">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <IconSparkles size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">4 AI-Powered Advisor Tools</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              All insights are generated from your local customer data. No real AI model is called.
              Labels marked <span className="font-semibold text-violet-600 dark:text-violet-400">&ldquo;AI Suggested&rdquo;</span> are advisor-reviewed — you decide every action.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Tool selector — left sidebar on large screens */}
          <div className="lg:col-span-1 space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mb-3">Tools</p>
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
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <active.icon size={14} className="text-white" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{active.title}</h2>
            </div>
            {renderTool()}
          </div>
        </div>
      </main>
    </div>
  );
}

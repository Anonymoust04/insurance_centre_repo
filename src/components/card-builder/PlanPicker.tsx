'use client';

import React, { useState } from 'react';
import { InsurancePlan, CardData } from '@/types/card';
import { planCards, aiToolCards, calcMonthlyPrice, calcYearlyPrice } from '@/data/plans';
import {
  IconSparkles,
  IconMessageQuestion,
  IconAlertTriangle,
  IconClipboardList,
  IconChevronDown,
  IconChevronUp,
  IconLoader2,
} from '@tabler/icons-react';

interface PlanPickerProps {
  selectedPlan: InsurancePlan;
  onPlanSelect: (plan: InsurancePlan) => void;
  currentAge: number;
  onCurrentAgeChange: (age: number) => void;
  targetAge: number;
  onTargetAgeChange: (age: number) => void;
  cardData: CardData;
}

const targetAges = [60, 70, 80, 90, 100];

const aiToolIcons = [
  <IconSparkles size={20} stroke={2} key="spark" />,
  <IconMessageQuestion size={20} stroke={2} key="msg" />,
  <IconAlertTriangle size={20} stroke={2} key="alert" />,
  <IconClipboardList size={20} stroke={2} key="clip" />,
];

const aiToolColors = [
  { bg: 'bg-pastel-pink', border: 'border-pink-300', text: 'text-pink-700', btn: 'bg-pastel-pink hover:bg-pink-300 border-pink-300' },
  { bg: 'bg-pastel-lavender', border: 'border-purple-300', text: 'text-purple-700', btn: 'bg-pastel-lavender hover:bg-purple-200 border-purple-300' },
  { bg: 'bg-energy-electric/20', border: 'border-yellow-300', text: 'text-yellow-700', btn: 'bg-energy-electric/30 hover:bg-energy-electric/50 border-yellow-300' },
  { bg: 'bg-energy-grass/20', border: 'border-green-300', text: 'text-green-700', btn: 'bg-energy-grass/30 hover:bg-energy-grass/50 border-green-300' },
];

type AiResult = Record<string, unknown> | null;

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    high: 'bg-red-100 text-red-700 border-red-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    low: 'bg-green-100 text-green-700 border-green-300',
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${colors[severity] ?? colors.low}`}>
      {severity}
    </span>
  );
}

function PlanMatchResult({ data }: { data: AiResult }) {
  if (!data) return null;
  const d = data as {
    recommendedPlan: string;
    reason: string;
    secondaryPlan: string;
    secondaryReason: string;
    advisorTip: string;
  };
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Best match</span>
        <span className="font-bold text-base text-pink-700 bg-pastel-pink px-3 py-0.5 rounded-full border border-pink-300">{d.recommendedPlan}</span>
      </div>
      <p className="opacity-80 leading-snug">{d.reason}</p>
      <div className="bg-white/60 rounded-lg p-3 border border-pink-200">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Also consider</p>
        <p className="font-semibold">{d.secondaryPlan}</p>
        <p className="opacity-70 text-xs mt-0.5">{d.secondaryReason}</p>
      </div>
      <div className="bg-white/60 rounded-lg p-3 border border-pink-200">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">💡 Advisor tip</p>
        <p className="opacity-80 leading-snug">{d.advisorTip}</p>
      </div>
    </div>
  );
}

function SimpleExplainResult({ data }: { data: AiResult }) {
  if (!data) return null;
  const d = data as {
    simpleExplanation: string;
    realWorldExample: string;
    keyTakeaway: string;
  };
  return (
    <div className="flex flex-col gap-3 text-sm">
      <p className="opacity-80 leading-snug">{d.simpleExplanation}</p>
      <div className="bg-white/60 rounded-lg p-3 border border-purple-200">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">🌍 Real-world example</p>
        <p className="opacity-80 leading-snug">{d.realWorldExample}</p>
      </div>
      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">✅ Key takeaway</p>
        <p className="font-semibold opacity-90">{d.keyTakeaway}</p>
      </div>
    </div>
  );
}

function GapCheckResult({ data }: { data: AiResult }) {
  if (!data) return null;
  const d = data as {
    gaps: { category: string; severity: string; description: string }[];
    priorityAction: string;
    overallAssessment: string;
  };
  return (
    <div className="flex flex-col gap-3 text-sm">
      <p className="opacity-70 leading-snug">{d.overallAssessment}</p>
      <div className="flex flex-col gap-2">
        {d.gaps.map((gap, i) => (
          <div key={i} className="bg-white/60 rounded-lg p-3 border border-yellow-200">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-bold">{gap.category}</span>
              <SeverityBadge severity={gap.severity} />
            </div>
            <p className="opacity-80 text-xs leading-snug">{gap.description}</p>
          </div>
        ))}
      </div>
      <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">🎯 Priority action</p>
        <p className="font-semibold opacity-90">{d.priorityAction}</p>
      </div>
    </div>
  );
}

function AdvisorPrepResult({ data }: { data: AiResult }) {
  if (!data) return null;
  const d = data as {
    summary: string;
    questionsToAsk: string[];
    thingsToMention: string[];
    budgetNote: string;
  };
  return (
    <div className="flex flex-col gap-3 text-sm">
      <p className="opacity-80 leading-snug">{d.summary}</p>
      <div className="bg-white/60 rounded-lg p-3 border border-green-200">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">❓ Questions to ask</p>
        <ol className="flex flex-col gap-1.5 list-decimal list-inside">
          {d.questionsToAsk.map((q, i) => (
            <li key={i} className="opacity-80 leading-snug text-xs">{q}</li>
          ))}
        </ol>
      </div>
      <div className="bg-white/60 rounded-lg p-3 border border-green-200">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">📌 Things to mention</p>
        <ul className="flex flex-col gap-1.5 list-disc list-inside">
          {d.thingsToMention.map((t, i) => (
            <li key={i} className="opacity-80 leading-snug text-xs">{t}</li>
          ))}
        </ul>
      </div>
      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">💰 Budget note</p>
        <p className="opacity-80 leading-snug">{d.budgetNote}</p>
      </div>
    </div>
  );
}

const resultComponents = [PlanMatchResult, SimpleExplainResult, GapCheckResult, AdvisorPrepResult];

const apiEndpoints = [
  '/api/ai/plan-match',
  '/api/ai/simple-explain',
  '/api/ai/gap-check',
  '/api/ai/advisor-prep',
];

export function PlanPicker({
  selectedPlan,
  onPlanSelect,
  currentAge,
  onCurrentAgeChange,
  targetAge,
  onTargetAgeChange,
  cardData,
}: PlanPickerProps) {
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [loadingTool, setLoadingTool] = useState<string | null>(null);
  const [aiResults, setAiResults] = useState<Record<string, AiResult>>({});
  const [aiErrors, setAiErrors] = useState<Record<string, string>>({});

  const buildPayload = (toolIndex: number) => {
    const profile = {
      name: cardData.name,
      gender: cardData.gender,
      occupation: cardData.occupation,
      incomeRange: cardData.incomeRange,
      dependents: cardData.dependents,
      hasExistingCoverage: cardData.hasExistingCoverage,
      topConcern: cardData.topConcern,
      currentAge: cardData.currentAge,
      targetAge: cardData.targetAge,
    };
    if (toolIndex === 0) return { profile };
    if (toolIndex === 1) return { planContext: selectedPlan };
    if (toolIndex === 2) return { profile, selectedPlan };
    if (toolIndex === 3) return { profile, selectedPlan };
    return {};
  };

  const callAiTool = async (toolId: string, toolIndex: number) => {
    setLoadingTool(toolId);
    setAiErrors((prev) => ({ ...prev, [toolId]: '' }));
    try {
      const res = await fetch(apiEndpoints[toolIndex], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(toolIndex)),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiResults((prev) => ({ ...prev, [toolId]: data }));
    } catch (err) {
      setAiErrors((prev) => ({
        ...prev,
        [toolId]: err instanceof Error ? err.message : 'Something went wrong',
      }));
    } finally {
      setLoadingTool(null);
    }
  };

  const toggleTool = (id: string) => {
    setExpandedTool((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ─── Header ─── */}
      <div className="bg-white/50 p-6 border-sketch-sm shadow-sm">
        <h2 className="font-handwriting text-3xl font-bold text-card-outline mb-1">
          2. Choose Your Protection Path
        </h2>
        <p className="text-base opacity-70 font-sans">
          Select the plan that fits your life stage and goals.
        </p>
      </div>

      {/* ─── Plan Cards ─── */}
      <div className="flex flex-col gap-4">
        {planCards.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => onPlanSelect(plan.id)}
              className={`
                w-full text-left flex flex-col border-[3px] transition-all duration-300 overflow-hidden
                ${isSelected
                  ? 'border-card-outline shadow-[4px_4px_0_#2e1760] -rotate-[0.5deg] scale-[1.01]'
                  : 'border-card-outline/25 rounded-2xl bg-white/70 hover:border-card-outline/60 hover:shadow-md hover:-translate-y-0.5'
                }
              `}
              style={{ borderRadius: isSelected ? '14px' : undefined }}
            >
              <div className={`w-full h-2 ${plan.accentClass}`} />
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-handwriting text-2xl font-bold text-card-outline leading-tight">{plan.id}</h3>
                  <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border-2 border-current ${plan.badgeClass} bg-white/80`}>
                    {plan.badge}
                  </span>
                </div>
                <p className="text-sm font-sans font-semibold leading-snug text-card-text">{plan.tagline}</p>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">What it helps with</span>
                  <p className="text-sm font-sans opacity-80 leading-snug">{plan.helpsWith}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">Best for</span>
                  <p className="text-sm font-sans opacity-80 leading-snug">{plan.bestFor}</p>
                </div>
                <div className="flex flex-col gap-2 pt-2 border-t-2 border-card-outline/10">
                  {plan.abilities.map((ability, i) => (
                    <div key={ability.title} className="flex items-start gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 border-card-outline flex-shrink-0 mt-0.5 ${plan.accentClass} ${i === 1 ? 'opacity-50' : ''}`} />
                      <div>
                        <span className="font-bold text-sm">{ability.title} — </span>
                        <span className="text-sm opacity-80">{ability.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t-2 border-card-outline/10">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Estimated Payment</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-handwriting text-2xl font-bold text-card-outline">
                        RM {calcMonthlyPrice(plan.basePriceMonthly, cardData.currentAge).toLocaleString()}
                      </span>
                      <span className="text-sm opacity-60 font-bold">/ month</span>
                    </div>
                    <p className="text-xs opacity-50 mt-0.5">
                      RM {calcYearlyPrice(plan.basePriceMonthly, cardData.currentAge).toLocaleString()} / year
                    </p>
                    <p className="text-[10px] opacity-40 italic mt-1">
                      Demo estimate · actual premium may vary by coverage &amp; underwriting
                    </p>
                  </div>
                  {plan.supportingFact && (
                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Fact</span>
                      <p className="text-xs opacity-60 mt-0.5 italic">{plan.supportingFact}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-1.5 bg-black/5 rounded-lg px-3 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 mt-0.5 whitespace-nowrap">Advisor</span>
                  <p className="text-xs opacity-60 italic">{plan.advisorNote}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── Age / Timeline ─── */}
      <div className="flex flex-col gap-6 bg-white/50 p-6 border-sketch-sm shadow-sm">
        <h3 className="font-handwriting text-2xl font-bold text-card-outline">Protection Timeline</h3>
        <div className="flex flex-col gap-2 flex-1">
          <label className="font-bold text-lg">Protect me until age</label>
          <div className="flex flex-wrap gap-2">
              {targetAges.map((age) => (
                <button
                  key={age}
                  onClick={() => onTargetAgeChange(age)}
                  className={`
                    w-12 h-12 flex items-center justify-center font-bold text-lg transition-transform
                    ${targetAge === age
                      ? 'border-sketch-sm bg-pastel-yellow scale-110 shadow-sm z-10'
                      : 'border-[3px] border-card-outline/20 rounded-full bg-white hover:scale-105'
                    }
                  `}
                >
                  {age}
                </button>
              ))}
            </div>
        </div>
      </div>

      {/* ─── AI Support Tools ─── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-1">
          <IconSparkles size={18} className="text-card-outline" />
          <h3 className="font-handwriting text-2xl font-bold text-card-outline">AI Support Tools</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {aiToolCards.map((tool, i) => {
            const isExpanded = expandedTool === tool.id;
            const isLoading = loadingTool === tool.id;
            const hasResult = !!aiResults[tool.id];
            const hasError = !!aiErrors[tool.id];
            const colors = aiToolColors[i];
            const ResultComponent = resultComponents[i];

            return (
              <div
                key={tool.id}
                className={`flex flex-col border-[3px] ${colors.border} ${colors.bg} transition-all duration-300 rounded-xl overflow-hidden`}
              >
                <button
                  onClick={() => toggleTool(tool.id)}
                  className="flex items-start gap-3 p-4 text-left w-full"
                >
                  <span className={`mt-0.5 flex-shrink-0 ${colors.text}`}>{aiToolIcons[i]}</span>
                  <div className="flex-1">
                    <p className={`font-bold text-base leading-tight ${colors.text}`}>{tool.title}</p>
                    <p className="text-sm opacity-80 mt-1 leading-snug">{tool.shortText}</p>
                    {hasResult && !isExpanded && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 mt-1 block">✓ Result ready</span>
                    )}
                  </div>
                  <span className="flex-shrink-0 opacity-50 mt-0.5">
                    {isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 flex flex-col gap-3">
                    <p className="text-sm opacity-70 leading-snug border-t border-current/10 pt-3">
                      {tool.expandedText}
                    </p>

                    {/* CTA Button */}
                    {!hasResult && (
                      <button
                        onClick={() => callAiTool(tool.id, i)}
                        disabled={isLoading}
                        className={`w-full py-2 px-4 font-bold text-sm border-[2px] ${colors.btn} transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-60`}
                      >
                        {isLoading ? (
                          <>
                            <IconLoader2 size={16} className="animate-spin" />
                            Thinking…
                          </>
                        ) : (
                          tool.buttonText
                        )}
                      </button>
                    )}

                    {/* Error */}
                    {hasError && (
                      <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                        ⚠️ {aiErrors[tool.id]}
                        <button
                          onClick={() => callAiTool(tool.id, i)}
                          className="ml-2 font-bold underline"
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    {/* AI Result */}
                    {hasResult && (
                      <>
                        <div className="border-t border-current/10 pt-3">
                          <ResultComponent data={aiResults[tool.id]} />
                        </div>
                        <button
                          onClick={() => callAiTool(tool.id, i)}
                          disabled={isLoading}
                          className={`w-full py-1.5 px-4 font-bold text-xs border-[2px] ${colors.btn} transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 opacity-70`}
                        >
                          {isLoading ? <><IconLoader2 size={14} className="animate-spin" /> Refreshing…</> : '↺ Regenerate'}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p className="text-xs opacity-50 text-center px-4 mt-1 font-sans leading-snug">
          AI helps organise and explain information. Final recommendations should still be reviewed with a licensed advisor.
        </p>
      </div>

    </div>
  );
}

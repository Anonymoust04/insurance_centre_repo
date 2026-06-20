'use client';

import React, { useState } from 'react';
import { InsurancePlan } from '@/types/card';
import { planCards, aiToolCards } from '@/data/plans';
import {
  IconSparkles,
  IconMessageQuestion,
  IconAlertTriangle,
  IconClipboardList,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';

interface PlanPickerProps {
  selectedPlan: InsurancePlan;
  onPlanSelect: (plan: InsurancePlan) => void;
  currentAge: number;
  onCurrentAgeChange: (age: number) => void;
  targetAge: number;
  onTargetAgeChange: (age: number) => void;
}

const targetAges = [60, 70, 80, 90, 100];

const aiToolIcons = [
  <IconSparkles size={20} stroke={2} />,
  <IconMessageQuestion size={20} stroke={2} />,
  <IconAlertTriangle size={20} stroke={2} />,
  <IconClipboardList size={20} stroke={2} />,
];

const aiToolColors = [
  { bg: 'bg-pastel-pink', border: 'border-pink-300', text: 'text-pink-700', btn: 'bg-pastel-pink hover:bg-pink-300' },
  { bg: 'bg-pastel-lavender', border: 'border-purple-300', text: 'text-purple-700', btn: 'bg-pastel-lavender hover:bg-purple-200' },
  { bg: 'bg-energy-electric/20', border: 'border-yellow-300', text: 'text-yellow-700', btn: 'bg-energy-electric/30 hover:bg-energy-electric/50' },
  { bg: 'bg-energy-grass/20', border: 'border-green-300', text: 'text-green-700', btn: 'bg-energy-grass/30 hover:bg-energy-grass/50' },
];

export function PlanPicker({
  selectedPlan,
  onPlanSelect,
  currentAge,
  onCurrentAgeChange,
  targetAge,
  onTargetAgeChange,
}: PlanPickerProps) {
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const toggleTool = (id: string) => {
    setExpandedTool((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ─── Section Header ─── */}
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
              {/* Accent Strip + Badge */}
              <div className={`w-full h-2 ${plan.accentClass}`} />

              <div className="p-4 flex flex-col gap-3">

                {/* Title Row */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-handwriting text-2xl font-bold text-card-outline leading-tight">
                    {plan.id}
                  </h3>
                  <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border-2 border-current ${plan.badgeClass} bg-white/80`}>
                    {plan.badge}
                  </span>
                </div>

                {/* One-line tagline */}
                <p className="text-sm font-sans font-semibold leading-snug text-card-text">
                  {plan.tagline}
                </p>

                {/* What it helps with */}
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">What it helps with</span>
                  <p className="text-sm font-sans opacity-80 leading-snug">{plan.helpsWith}</p>
                </div>

                {/* Best For */}
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">Best for</span>
                  <p className="text-sm font-sans opacity-80 leading-snug">{plan.bestFor}</p>
                </div>

                {/* Abilities */}
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

                {/* Bottom row: affordability + advisor note */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t-2 border-card-outline/10">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Estimated demo affordability</span>
                    <p className="text-xs opacity-70 mt-0.5">{plan.affordabilityNote}</p>
                  </div>
                  {plan.supportingFact && (
                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Fact</span>
                      <p className="text-xs opacity-60 mt-0.5 italic">{plan.supportingFact}</p>
                    </div>
                  )}
                </div>

                {/* Advisor note */}
                <div className="flex items-start gap-1.5 bg-black/5 rounded-lg px-3 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 mt-0.5 whitespace-nowrap">Advisor</span>
                  <p className="text-xs opacity-60 italic">{plan.advisorNote}</p>
                </div>

              </div>
            </button>
          );
        })}
      </div>

      {/* ─── Age Settings ─── */}
      <div className="flex flex-col gap-6 bg-white/50 p-6 border-sketch-sm shadow-sm">
        <h3 className="font-handwriting text-2xl font-bold text-card-outline">Protection Timeline</h3>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col gap-2 flex-1">
            <label className="font-bold text-lg">Current Age</label>
            <input
              type="number"
              min="18"
              max="99"
              value={currentAge || ''}
              onChange={(e) => onCurrentAgeChange(parseInt(e.target.value) || 0)}
              className="border-sketch-sm px-4 py-2 font-sans text-lg focus:outline-none focus:ring-4 ring-pastel-lavender/50 bg-white w-full"
            />
          </div>
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
            const colors = aiToolColors[i];
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
                    <button
                      className={`w-full py-2 px-4 font-bold text-sm border-[2px] ${colors.border} ${colors.btn} transition-colors rounded-lg`}
                    >
                      {tool.buttonText}
                    </button>
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

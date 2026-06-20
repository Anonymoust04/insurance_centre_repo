'use client';

import React, { useState } from 'react';
import { InsurancePlan, CardData } from '@/types/card';
import { planCards, calcMonthlyPrice, calcYearlyPrice } from '@/data/plans';
import {
  IconChevronDown,
  IconChevronUp,
  IconSparkles,
} from '@tabler/icons-react';

interface PlanPickerProps {
  selectedPlan: InsurancePlan;
  onPlanSelect: (plan: InsurancePlan) => void;
  currentAge: number;
  onCurrentAgeChange: (age: number) => void;
  targetAge: number;
  onTargetAgeChange: (age: number) => void;
  cardData: CardData;
  onPlanMatchClick: () => void;
}

const targetAges = [60, 70, 80, 90, 100];



export function PlanPicker({
  selectedPlan,
  onPlanSelect,
  currentAge,
  onCurrentAgeChange,
  targetAge,
  onTargetAgeChange,
  cardData,
  onPlanMatchClick,
}: PlanPickerProps) {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});



  return (
    <div className="flex flex-col gap-6">

      {/* ─── Header ─── */}
      <div className="bg-white/50 p-6 border-sketch-sm shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-handwriting text-3xl font-bold text-card-outline mb-1">
              2. Choose Your Protection Path
            </h2>
            <p className="text-base opacity-70 font-sans">
              Select the plan that fits your life stage and goals.
            </p>
          </div>
          <button
            onClick={onPlanMatchClick}
            className="flex items-center gap-2 border-sketch-sm bg-pastel-pink hover:bg-pink-300 transition-all px-5 py-3 font-bold text-card-outline shadow-sm hover:-translate-y-0.5 active:scale-[0.97] whitespace-nowrap"
          >
            <IconSparkles size={20} />
            Plan Match
          </button>
        </div>
      </div>

      {/* ─── Plan Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {planCards.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isExpanded = !!expandedCards[plan.id];
          return (
            <div
              key={plan.id}
              onClick={() => onPlanSelect(plan.id)}
              className={`
                w-full text-left flex flex-col border-[3px] transition-all duration-300 overflow-hidden cursor-pointer
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
                
                <div className="flex flex-col gap-1 pt-2 border-t-2 border-card-outline/10">
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
                </div>

                {isExpanded && (
                  <div className="flex flex-col gap-3 pt-3 border-t-2 border-card-outline/10 animate-fade-in">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">What it helps with</span>
                      <p className="text-sm font-sans opacity-80 leading-snug">{plan.helpsWith}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Best for</span>
                      <p className="text-sm font-sans opacity-80 leading-snug">{plan.bestFor}</p>
                    </div>
                    {plan.supportingFact && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Fact</span>
                        <p className="text-xs opacity-60 italic">{plan.supportingFact}</p>
                      </div>
                    )}
                    <p className="text-[10px] opacity-40 italic mt-1">
                      Demo estimate · actual premium may vary by coverage &amp; underwriting
                    </p>
                    <div className="flex items-start gap-1.5 bg-black/5 rounded-lg px-3 py-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 mt-0.5 whitespace-nowrap">Advisor</span>
                      <p className="text-xs opacity-60 italic">{plan.advisorNote}</p>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedCards((prev) => ({ ...prev, [plan.id]: !prev[plan.id] }));
                  }}
                  className="mt-1 flex items-center justify-center gap-1 w-full py-2 bg-black/5 hover:bg-black/10 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  {isExpanded ? (
                    <>Hide Details <IconChevronUp size={14} /></>
                  ) : (
                    <>View Details <IconChevronDown size={14} /></>
                  )}
                </button>
              </div>
            </div>
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



    </div>
  );
}

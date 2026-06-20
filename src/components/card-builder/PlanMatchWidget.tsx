'use client';

import React, { useState } from 'react';
import { CardData } from '@/types/card';
import { IconSparkles, IconLoader2, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { aiToolCards } from '@/data/plans';

type AiResult = Record<string, unknown> | null;

interface PlanMatchWidgetProps {
  cardData: CardData;
}

export function PlanMatchWidget({ cardData }: PlanMatchWidgetProps) {
  const tool = aiToolCards[0]; // Plan Match
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiResult>(null);
  const [error, setError] = useState<string>('');

  const callAiTool = async () => {
    setIsLoading(true);
    setError('');
    try {
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

      const res = await fetch('/api/ai/plan-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const d = result as {
    recommendedPlan: string;
    reason: string;
    secondaryPlan: string;
    secondaryReason: string;
    advisorTip: string;
  } | null;

  return (
    <div className="w-full flex flex-col border-[3px] border-pink-300 bg-pastel-pink transition-all duration-300 rounded-xl overflow-hidden mb-8 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-start gap-3 p-4 text-left w-full"
      >
        <span className="mt-0.5 flex-shrink-0 text-pink-700"><IconSparkles size={20} stroke={2} /></span>
        <div className="flex-1">
          <p className="font-bold text-base leading-tight text-pink-700">{tool.title}</p>
          <p className="text-sm opacity-80 mt-1 leading-snug text-pink-800">{tool.shortText}</p>
          {result && !isExpanded && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 mt-1 block">✓ Result ready</span>
          )}
        </div>
        <span className="flex-shrink-0 opacity-50 mt-0.5 text-pink-700">
          {isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          <p className="text-sm opacity-70 leading-snug border-t border-pink-300/30 pt-3 text-pink-800">
            {tool.expandedText}
          </p>

          {!result && (
            <button
              onClick={callAiTool}
              disabled={isLoading}
              className="w-full py-2 px-4 font-bold text-sm border-[2px] bg-pastel-pink hover:bg-pink-300 border-pink-300 text-pink-700 transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
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

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
              ⚠️ {error}
              <button
                onClick={callAiTool}
                className="ml-2 font-bold underline"
              >
                Retry
              </button>
            </div>
          )}

          {result && d && (
            <>
              <div className="border-t border-pink-300/30 pt-3 flex flex-col gap-3 text-sm text-pink-900">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Best match</span>
                  <span className="font-bold text-base text-pink-700 bg-white px-3 py-0.5 rounded-full border border-pink-300">{d.recommendedPlan}</span>
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
              <button
                onClick={callAiTool}
                disabled={isLoading}
                className="w-full py-1.5 px-4 font-bold text-xs border-[2px] bg-white hover:bg-pink-100 border-pink-300 text-pink-700 transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 opacity-90"
              >
                {isLoading ? <><IconLoader2 size={14} className="animate-spin" /> Refreshing…</> : '↺ Regenerate'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

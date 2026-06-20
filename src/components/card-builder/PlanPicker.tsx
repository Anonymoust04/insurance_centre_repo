import React from 'react';
import { InsurancePlan } from '@/types/card';

interface PlanPickerProps {
  selectedPlan: InsurancePlan;
  onPlanSelect: (plan: InsurancePlan) => void;
  currentAge: number;
  onCurrentAgeChange: (age: number) => void;
  targetAge: number;
  onTargetAgeChange: (age: number) => void;
}

const plans: InsurancePlan[] = [
  'Medical Shield',
  'Critical Illness Guard',
  'Life Protection',
  'Family Secure'
];

const targetAges = [60, 70, 80, 90, 100];

export function PlanPicker({
  selectedPlan,
  onPlanSelect,
  currentAge,
  onCurrentAgeChange,
  targetAge,
  onTargetAgeChange
}: PlanPickerProps) {
  return (
    <div className="flex flex-col gap-6 bg-white/50 p-6 border-sketch-sm shadow-sm">
      <h2 className="font-handwriting text-3xl font-bold text-card-outline">3. Plan & Protection</h2>
      
      <div className="flex flex-col gap-2">
        <label className="font-bold text-lg">Insurance Plan</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {plans.map((plan) => (
            <button
              key={plan}
              onClick={() => onPlanSelect(plan)}
              className={`
                px-3 py-2 font-bold text-left transition-colors
                ${selectedPlan === plan 
                  ? 'border-sketch-sm bg-pastel-lavender shadow-sm' 
                  : 'border-[3px] border-card-outline/20 rounded-xl bg-white hover:border-pastel-lavender'
                }
              `}
            >
              {plan}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 mt-2">
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
  );
}

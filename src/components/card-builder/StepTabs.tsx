import React from 'react';

const steps = ['Image', 'Plan', 'Payment', 'Missions'];

interface StepTabsProps {
  currentStep: number;
}

export function StepTabs({ currentStep }: StepTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-6">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isPast = index < currentStep;
        
        return (
          <div 
            key={step}
            className={`
              px-4 py-2 font-handwriting text-xl font-bold transition-all duration-300
              ${isActive 
                ? 'bg-pastel-pink border-sketch-sm -rotate-2 shadow-sm text-card-outline scale-110' 
                : isPast
                ? 'bg-pink-100 border-sketch-sm text-pink-400 rotate-1 opacity-80'
                : 'bg-gray-100 border-[3px] border-gray-300 text-gray-400 rounded-xl rotate-1 opacity-70'}
            `}
          >
            {step}
          </div>
        );
      })}
    </div>
  );
}

import React from 'react';
import { IconUser, IconShield, IconCreditCard } from '@tabler/icons-react';

const steps = [
  { label: 'Image', icon: <IconUser size={22} stroke={2} /> },
  { label: 'Plan', icon: <IconShield size={22} stroke={2} /> },
  { label: 'Payment', icon: <IconCreditCard size={22} stroke={2} /> },
];

interface StepTabsProps {
  currentStep: number;
}

export function StepTabs({ currentStep }: StepTabsProps) {
  return (
    <div className="flex gap-3 justify-center mt-5">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isPast = index < currentStep;

        return (
          <div
            key={step.label}
            title={step.label}
            className={`
              relative flex flex-col items-center justify-center gap-1
              w-[68px] h-[68px] rounded-xl border-[3px] transition-all duration-300 cursor-default
              ${isActive
                ? 'bg-pastel-pink border-card-outline shadow-md -rotate-2 scale-110 text-card-outline'
                : isPast
                ? 'bg-pink-100 border-pink-300 text-pink-400 rotate-1 opacity-80'
                : 'bg-gray-100 border-gray-300 text-gray-400 rotate-1 opacity-60'
              }
            `}
            style={{
              boxShadow: isActive ? '3px 3px 0 #2e1760' : undefined,
            }}
          >
            {/* Icon */}
            <span className="flex items-center justify-center">{step.icon}</span>
            {/* Label */}
            <span className="font-handwriting text-[11px] font-bold leading-none">
              {step.label}
            </span>

            {/* Active dot indicator */}
            {isActive && (
              <span
                className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-card-outline border-2 border-pastel-yellow"
              />
            )}

            {/* Completed checkmark */}
            {isPast && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-pink-400 border-2 border-pastel-yellow flex items-center justify-center text-white text-[8px] font-bold">
                ✓
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

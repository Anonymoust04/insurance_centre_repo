import React from 'react';
import { EnergyType } from '@/types/card';

interface EnergyTypePickerProps {
  selected: EnergyType;
  onSelect: (type: EnergyType) => void;
}

const energyTypes: { type: EnergyType; colorClass: string }[] = [
  { type: 'Fire', colorClass: 'bg-energy-fire' },
  { type: 'Water', colorClass: 'bg-energy-water' },
  { type: 'Electric', colorClass: 'bg-energy-electric' },
  { type: 'Grass', colorClass: 'bg-energy-grass' },
  { type: 'Psychic', colorClass: 'bg-energy-psychic' },
  { type: 'Rock', colorClass: 'bg-energy-rock' },
];

export function EnergyTypePicker({ selected, onSelect }: EnergyTypePickerProps) {
  return (
    <div className="flex flex-col gap-4 bg-white/50 p-6 border-sketch-sm shadow-sm">
      <h2 className="font-handwriting text-3xl font-bold text-card-outline">2. Choose Energy</h2>
      
      <div className="flex flex-wrap gap-3">
        {energyTypes.map(({ type, colorClass }) => {
          const isSelected = selected === type;
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={`
                px-4 py-2 font-bold transition-transform
                ${colorClass}
                ${isSelected ? 'border-sketch-sm scale-110 shadow-md z-10' : 'border-[3px] border-transparent rounded-xl hover:scale-105 opacity-80'}
              `}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}

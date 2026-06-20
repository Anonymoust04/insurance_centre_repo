import React, { useState } from 'react';
import { CardData, EnergyType } from '@/types/card';
import { IconFlame, IconDroplet, IconBolt, IconLeaf, IconEye, IconMountain, IconUser } from '@tabler/icons-react';
import { planCards } from '@/data/plans';

interface CardPreviewProps {
  data: CardData;
}

const getEnergyConfig = (type: EnergyType) => {
  switch (type) {
    case 'Fire': return { icon: <IconFlame size={24} />, bgClass: 'bg-energy-fire', tintClass: 'from-energy-fire/40 to-pastel-lavender/60' };
    case 'Water': return { icon: <IconDroplet size={24} />, bgClass: 'bg-energy-water', tintClass: 'from-energy-water/40 to-pastel-lavender/60' };
    case 'Electric': return { icon: <IconBolt size={24} />, bgClass: 'bg-energy-electric', tintClass: 'from-energy-electric/50 to-pastel-lavender/60' };
    case 'Grass': return { icon: <IconLeaf size={24} />, bgClass: 'bg-energy-grass', tintClass: 'from-energy-grass/40 to-pastel-lavender/60' };
    case 'Psychic': return { icon: <IconEye size={24} />, bgClass: 'bg-energy-psychic', tintClass: 'from-energy-psychic/60 to-pastel-lavender/60' };
    case 'Rock': return { icon: <IconMountain size={24} />, bgClass: 'bg-energy-rock', tintClass: 'from-energy-rock/40 to-pastel-lavender/60' };
    default: return { icon: <IconBolt size={24} />, bgClass: 'bg-gray-200', tintClass: 'from-gray-100 to-gray-200' };
  }
};

export function CardPreview({ data }: CardPreviewProps) {
  const { name, image, energyType, plan, currentAge, targetAge } = data;
  const energyConfig = getEnergyConfig(energyType);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const selectedPlanData = planCards.find(p => p.id === plan) || planCards[0];
  
  // Protection Time = years of coverage remaining
  const pt = Math.max(0, targetAge - currentAge);

  return (
    <div className="w-full max-w-md mx-auto aspect-[2.5/3.5] bg-pastel-yellow border-sketch p-3 sm:p-4 shadow-xl transform rotate-1 transition-transform hover:rotate-0 relative">
      {/* Inner Card Frame */}
      <div className={`w-full h-full border-sketch-sm rounded-xl flex flex-col bg-gradient-to-b ${energyConfig.tintClass} p-3 sm:p-4 overflow-hidden relative`}>
        
        {/* Sparkles / Background Accents */}
        <div className="absolute top-10 left-4 text-card-outline opacity-20 rotate-12">✧</div>
        <div className="absolute bottom-32 right-6 text-card-outline opacity-20 -rotate-12 text-2xl">✦</div>

        {/* Top Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-handwriting text-3xl sm:text-4xl font-bold text-card-outline truncate flex-1">
            {name || 'Your Name'}
          </h2>
          <div className="flex items-center gap-1 sm:gap-2">
            {/* PT Badge with tooltip */}
            <div
              className="relative cursor-help"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="font-handwriting text-2xl sm:text-3xl font-bold text-red-600 tracking-tighter select-none">
                {pt} <span className="text-xl">PT</span>
              </div>

              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute right-0 top-full mt-2 z-50 pointer-events-none">
                  {/* Arrow */}
                  <div className="absolute -top-1.5 right-4 w-3 h-3 bg-card-outline rotate-45" />
                  <div className="bg-card-outline text-pastel-yellow font-handwriting text-sm px-3 py-2 whitespace-nowrap shadow-lg"
                    style={{ borderRadius: '10px' }}
                  >
                    <p className="font-bold text-base">Protection Time Left</p>
                    <p className="opacity-90 text-sm">({pt} years left)</p>
                  </div>
                </div>
              )}
            </div>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-sketch-sm flex items-center justify-center ${energyConfig.bgClass} shadow-sm z-10`}>
              {energyConfig.icon}
            </div>
          </div>
        </div>

        {/* Image Frame */}
        <div className="w-full aspect-[4/3] bg-card-cream border-sketch-sm rounded-xl mb-4 relative overflow-hidden flex items-center justify-center shadow-inner group">
          {image ? (
            <img src={image} alt="Card Portrait" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center text-card-outline/40">
              <IconUser size={48} stroke={1.5} />
              <span className="font-handwriting text-xl mt-2">Upload Photo</span>
            </div>
          )}
          
          {/* Faux Scallop Effect inside frame (css shapes or just rounded boxes) */}
          <div className="absolute inset-0 border-4 border-card-cream/30 rounded-xl pointer-events-none"></div>
        </div>

        {/* Plan Type Badge */}
        <div className="self-start bg-pastel-yellow border-sketch-sm px-3 py-1 -mt-8 relative z-10 font-bold text-sm shadow-sm mb-3">
          {plan}
        </div>

        {/* Abilities Area */}
        <div className="flex flex-col gap-3 flex-1 px-1">
          {selectedPlanData?.abilities.map((ability, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: idx + 1 }).map((_, i) => (
                  <div key={i} className={`w-5 h-5 rounded-full border-[2px] border-card-outline flex-shrink-0 ${energyConfig.bgClass}`}></div>
                ))}
                {idx === 0 && <div className="w-5 h-5 rounded-full border-[2px] border-card-outline flex-shrink-0 bg-gray-200"></div>}
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">{ability.title}</h3>
                <p className="text-sm font-sans leading-tight mt-1 opacity-90">{ability.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Metadata Bar */}
        <div className="mt-4 pt-2 border-t-[3px] border-card-outline/30 flex justify-between items-center text-xs font-bold px-2">
          <div className="flex flex-col items-center">
            <span className="opacity-70 uppercase tracking-widest text-[10px]">Coverage</span>
            <span>Comprehensive</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="opacity-70 uppercase tracking-widest text-[10px]">Benefit</span>
            <span>Max Level</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="opacity-70 uppercase tracking-widest text-[10px]">Renewal</span>
            <span>Yearly</span>
          </div>
        </div>

      </div>
    </div>
  );
}

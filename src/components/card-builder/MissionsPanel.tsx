import React from 'react';
import { IconTarget, IconStar, IconTrophy, IconWalk } from '@tabler/icons-react';

const missions = [
  {
    id: 1,
    title: 'Daily Steps',
    description: 'Walk 10,000 steps today',
    reward: '+5 HP',
    icon: IconWalk,
    completed: true,
  },
  {
    id: 2,
    title: 'Health Checkup',
    description: 'Complete your annual physical',
    reward: '+50 HP',
    icon: IconTarget,
    completed: false,
  },
  {
    id: 3,
    title: 'Mindful Monday',
    description: 'Meditate for 10 minutes',
    reward: '+10 HP',
    icon: IconStar,
    completed: false,
  },
];

export function MissionsPanel() {
  return (
    <div className="bg-card-cream border-sketch p-6">
      <div className="flex items-center gap-3 mb-6 border-b-4 border-card-outline/10 pb-4">
        <IconTrophy size={32} className="text-pastel-pink transform rotate-6" />
        <h2 className="font-handwriting font-bold text-3xl text-card-outline">Your Missions</h2>
      </div>

      <div className="flex flex-col gap-4">
        {missions.map((mission) => {
          const Icon = mission.icon;
          return (
            <div 
              key={mission.id}
              className={`p-4 border-sketch-sm rounded-2xl flex items-center gap-4 transition-all ${
                mission.completed 
                  ? 'bg-pastel-pink/20 opacity-70' 
                  : 'bg-white hover:-translate-y-1 hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-sketch-sm ${
                mission.completed ? 'bg-pastel-pink text-white' : 'bg-pastel-yellow text-card-outline'
              }`}>
                <Icon size={24} />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-xl text-card-outline mb-1">{mission.title}</h3>
                <p className="text-card-text/70 text-sm font-bold">{mission.description}</p>
              </div>

              <div className="font-handwriting font-bold text-2xl text-pastel-pink drop-shadow-sm">
                {mission.reward}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 text-center">
        <p className="font-bold text-card-text/60 italic text-sm">
          Complete missions to level up your card and earn exclusive badges!
        </p>
      </div>
    </div>
  );
}

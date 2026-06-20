import { AgentHeader } from '@/components/agent/AgentHeader';
import { AgentMissions } from '@/components/agent/AgentMissions';

export default function AgentMissionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AgentHeader
        title="🎯 Daily Missions"
        subtitle="Complete missions to earn XP and climb the leaderboard."
      />
      <main className="flex-1 p-6 overflow-y-auto max-w-4xl w-full mx-auto">
        <AgentMissions />
      </main>
    </div>
  );
}

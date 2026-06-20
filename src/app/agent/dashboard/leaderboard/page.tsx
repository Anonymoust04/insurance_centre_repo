import agentsData from '@/data/getAgent.json';
import type { AgentPerformance } from '@/types/agent';
import { AgentHeader } from '@/components/agent/AgentHeader';
import { AgentLeaderboardCard } from '@/components/agent/AgentLeaderboardCard';
import { AgentLeaderboardTable } from '@/components/agent/AgentLeaderboardTable';
import { MotivationalBanner } from '@/components/agent/MotivationalBanner';

const agents = agentsData as AgentPerformance[];
const CURRENT_AGENT_ID = 'agent-008';

export default function LeaderboardPage() {
  const currentAgent = agents.find(a => a.id === CURRENT_AGENT_ID)!;
  const top3 = agents.slice(0, 3);
  const rest = agents.slice(3);

  return (
    <div className="flex flex-col min-h-screen">
      <AgentHeader
        title="🏆 Agent Leaderboard"
        subtitle={`${new Date(2026, 5, 20).toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })} Rankings`}
      />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <MotivationalBanner currentAgent={currentAgent} agents={agents} />

        {/* Podium — top 3 */}
        <div>
          <p className="text-xs font-bold text-game-purple uppercase tracking-wider mb-4">🥇 Top Performers</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {top3.map(agent => (
              <AgentLeaderboardCard
                key={agent.id}
                agent={agent}
                isCurrentUser={agent.id === CURRENT_AGENT_ID}
              />
            ))}
          </div>
        </div>

        {/* Ranks 4–10 */}
        <div>
          <p className="text-xs font-bold text-game-purple uppercase tracking-wider mb-4">Ranks 4 – {agents.length}</p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {rest.map(agent => (
              <AgentLeaderboardCard
                key={agent.id}
                agent={agent}
                isCurrentUser={agent.id === CURRENT_AGENT_ID}
              />
            ))}
          </div>
        </div>

        {/* Full table */}
        <div>
          <p className="text-xs font-bold text-game-purple uppercase tracking-wider mb-4">Full Rankings Table</p>
          <AgentLeaderboardTable agents={agents} currentAgentId={CURRENT_AGENT_ID} showAll />
        </div>
      </main>
    </div>
  );
}

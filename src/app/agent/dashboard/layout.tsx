import type { ReactNode } from 'react';
import { AgentSidebar } from '@/components/agent/AgentSidebar';

export default function AgentDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-pastel-yellow">
      <AgentSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

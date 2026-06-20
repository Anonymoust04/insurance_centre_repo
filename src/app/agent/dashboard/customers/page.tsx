import profilesData from '@/data/getProfile.json';
import type { CustomerProfile } from '@/types/agent';
import { AgentHeader } from '@/components/agent/AgentHeader';
import { CustomerCard } from '@/components/agent/CustomerCard';
import { CustomerStats } from '@/components/agent/CustomerStats';

const customers = profilesData as CustomerProfile[];

export default function CustomersPage() {
  const active = customers.filter(c => c.status === 'active').length;
  const renewalDue = customers.filter(c => c.status === 'renewal-due').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.premiumMonthly, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <AgentHeader
        title="👥 My Customers"
        subtitle={`${customers.length} policy holders under your management`}
      />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <CustomerStats
          total={customers.length}
          active={active}
          renewalDue={renewalDue}
          monthlyPremium={totalRevenue}
        />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-handwriting text-xl text-game-text">All Customers</h2>
            <span className="text-xs font-bold text-game-purple bg-pastel-lavender px-3 py-1 rounded-full">
              {customers.length} total
            </span>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {customers.map((customer, i) => (
              <CustomerCard key={customer.id} customer={customer} delay={i * 0.04} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

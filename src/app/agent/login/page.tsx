import type { Metadata } from 'next';
import { IconBolt } from '@tabler/icons-react';
import { AgentLoginForm } from '@/components/agent/AgentLoginForm';

export const metadata: Metadata = {
  title: 'Agent Login — SecureLife Insurance',
  description: 'Sign in to your SecureLife Insurance agent portal.',
};

export default function AgentLoginPage() {
  return (
    <div className="min-h-screen bg-pastel-yellow flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-game-purple border-4 border-card-outline flex items-center justify-center mx-auto mb-4 shadow-[0_4px_20px_rgba(107,33,217,0.2)]">
            <IconBolt size={30} className="text-white" />
          </div>
          <h1 className="font-handwriting text-3xl text-game-text">Insurance <em>Center</em></h1>
          <p className="text-sm text-game-purple mt-1 font-semibold">Agent Portal — SecureLife</p>
        </div>

        {/* Login card */}
        <div className="bg-card-cream rounded-3xl p-6 border-2 border-card-outline shadow-[0_8px_40px_rgba(107,33,217,0.15)]">
          <h2 className="font-handwriting text-2xl text-game-text mb-0.5">Welcome back! 👋</h2>
          <p className="text-xs text-game-purple mb-5">Sign in to access your dashboard and performance data.</p>
          <AgentLoginForm />
        </div>

        {/* Demo info card */}
        <div className="mt-4 bg-pastel-lavender rounded-3xl p-4 border-2 border-card-outline/40">
          <p className="text-xs font-bold text-game-text mb-2">🔑 Agent Demo Login</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-game-purple">Email</span>
              <span className="font-semibold text-game-text font-mono">agent@securelife.com</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-game-purple">Password</span>
              <span className="font-semibold text-game-text font-mono">password123</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-game-purple mt-5">
          Not an agent?{' '}
          <a href="/" className="text-game-pink hover:opacity-80 font-bold transition-opacity">Go to main site</a>
        </p>
      </div>
    </div>
  );
}

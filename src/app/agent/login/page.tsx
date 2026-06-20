import type { Metadata } from 'next';
import { IconShield } from '@tabler/icons-react';
import { AgentLoginForm } from '@/components/agent/AgentLoginForm';

export const metadata: Metadata = {
  title: 'Agent Login — SecureLife Insurance',
  description: 'Sign in to your SecureLife Insurance agent portal.',
};

export default function AgentLoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200 dark:shadow-blue-900/40">
            <IconShield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Portal</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">SecureLife Insurance — Sales Team</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Welcome back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Sign in to access your dashboard and performance data.</p>
          <AgentLoginForm />
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Not an agent?{' '}
          <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Go to main site</a>
        </p>
      </div>
    </div>
  );
}

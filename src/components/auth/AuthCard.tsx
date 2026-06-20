import type { ReactNode } from 'react';
import { IconShield } from '@tabler/icons-react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950 px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <IconShield size={18} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-lg">
            SecureLife <span className="text-blue-600">Insurance</span>
          </span>
        </a>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/60 dark:shadow-none p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1.5">
              {title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

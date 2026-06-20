'use client';

import { useState } from 'react';
import { IconEye, IconEyeOff, IconShield } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/cn';

export function AgentLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate() {
    const errs: typeof errors = {};
    if (!email) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters.';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
          <IconShield size={28} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <p className="text-lg font-bold text-slate-900 dark:text-white">Welcome back!</p>
        <p className="text-sm text-slate-500 mt-1 mb-6">Redirecting to your dashboard…</p>
        <a
          href="/agent/dashboard"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          Go to Dashboard
        </a>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Input
        id="agent-email"
        label="Agent Email"
        type="email"
        placeholder="agent@securelife.com"
        autoComplete="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        error={errors.email}
      />
      <Input
        id="agent-password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        autoComplete="current-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        error={errors.password}
        endAdornment={
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <IconEyeOff size={17} /> : <IconEye size={17} />}
          </button>
        }
      />

      <div className="flex items-center justify-end">
        <button type="button" className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
          Forgot password?
        </button>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200',
          isLoading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200 dark:shadow-none'
        )}
      >
        {isLoading ? 'Signing in…' : 'Sign In to Portal'}
      </motion.button>
    </form>
  );
}

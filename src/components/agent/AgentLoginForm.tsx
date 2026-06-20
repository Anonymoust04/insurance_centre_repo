'use client';

import { useState } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { motion } from 'framer-motion';
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
        <div className="w-16 h-16 rounded-full bg-game-mint flex items-center justify-center mx-auto mb-4 text-3xl">
          🎉
        </div>
        <p className="text-xl font-handwriting font-bold text-game-text">Welcome back!</p>
        <p className="text-sm text-game-purple mt-1 mb-6">Redirecting to your dashboard…</p>
        <a
          href="/agent/dashboard"
          className="inline-flex items-center gap-2 bg-game-pink hover:opacity-90 text-white text-sm font-bold px-6 py-3 rounded-2xl transition-opacity shadow-sm"
        >
          Go to Dashboard 🚀
        </a>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="agent-email" className="block text-xs font-bold text-game-text uppercase tracking-wider">
          Agent Email
        </label>
        <input
          id="agent-email"
          type="email"
          placeholder="agent@securelife.com"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={cn(
            'w-full px-4 py-3 rounded-2xl border-2 bg-pastel-yellow text-game-text placeholder:text-game-purple/40 text-sm font-medium focus:outline-none focus:ring-0 transition-colors',
            errors.email ? 'border-red-400' : 'border-card-outline/40 focus:border-card-outline'
          )}
        />
        {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="agent-password" className="block text-xs font-bold text-game-text uppercase tracking-wider">
          Password
        </label>
        <div className="relative">
          <input
            id="agent-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={cn(
              'w-full px-4 py-3 pr-11 rounded-2xl border-2 bg-pastel-yellow text-game-text placeholder:text-game-purple/40 text-sm font-medium focus:outline-none focus:ring-0 transition-colors',
              errors.password ? 'border-red-400' : 'border-card-outline/40 focus:border-card-outline'
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-game-purple/60 hover:text-game-purple transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <IconEyeOff size={17} /> : <IconEye size={17} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
      </div>

      <div className="flex items-center justify-end">
        <button type="button" className="text-xs font-bold text-game-pink hover:opacity-80 transition-opacity">
          Forgot password?
        </button>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 shadow-sm',
          isLoading ? 'bg-game-pink/50 cursor-not-allowed' : 'bg-game-pink hover:opacity-90'
        )}
      >
        {isLoading ? 'Signing in… ✨' : 'Sign In to Portal 🚀'}
      </motion.button>
    </form>
  );
}

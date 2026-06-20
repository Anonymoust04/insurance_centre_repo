'use client';

import { useState } from 'react';
import { IconEye, IconEyeOff, IconArrowRight } from '@tabler/icons-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconArrowRight size={24} className="text-blue-600" />
        </div>
        <p className="font-bold text-slate-900 dark:text-white text-lg mb-1">Login successful</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This is a UI demo — no backend is connected.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Input
        id="email"
        label="Email address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoComplete="email"
      />

      <Input
        id="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        autoComplete="current-password"
        endAdornment={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <IconEyeOff size={17} /> : <IconEye size={17} />}
          </button>
        }
      />

      <div className="flex justify-end -mt-1">
        <a
          href="#"
          className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          Forgot password?
        </a>
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full">
        Sign In <IconArrowRight size={18} />
      </Button>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
          Create one free
        </a>
      </p>
    </form>
  );
}

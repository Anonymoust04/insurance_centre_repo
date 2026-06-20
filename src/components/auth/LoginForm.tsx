'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IconEye, IconEyeOff, IconWand, IconShieldLock } from '@tabler/icons-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

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
      router.push('/create-card');
    }
  };

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
            className="text-card-outline/60 hover:text-card-outline transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <IconEyeOff size={24} /> : <IconEye size={24} />}
          </button>
        }
      />

      <div className="flex justify-end -mt-1">
        <a
          href="#"
          className="text-lg text-pastel-pink hover:text-pink-400 font-handwriting font-bold transition-colors"
        >
          Forgot password?
        </a>
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full mt-2 py-4 text-2xl">
        Enter Workshop <IconWand size={24} />
      </Button>

      <p className="text-center text-lg font-bold text-card-text/70 mt-2">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="text-card-outline font-handwriting text-2xl hover:text-pastel-pink transition-colors">
          Create one free
        </a>
      </p>

      <div className="border-t-2 border-dashed border-card-outline/20 pt-4 mt-1">
        <Link
          href="/agent/login"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl border-2 border-card-outline/30 text-sm font-bold text-game-purple/70 hover:border-game-purple hover:text-game-purple hover:bg-pastel-lavender/40 transition-all"
        >
          <IconShieldLock size={16} />
          Agent Portal Login
        </Link>
      </div>
    </form>
  );
}

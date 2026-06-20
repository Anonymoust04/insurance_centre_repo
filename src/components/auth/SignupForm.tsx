'use client';

import { useState } from 'react';
import { IconEye, IconEyeOff, IconArrowRight } from '@tabler/icons-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export function SignupForm() {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!form.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^\+?[\d\s\-().]{7,}$/.test(form.phone)) {
      errs.phone = 'Please enter a valid phone number.';
    }
    if (!form.password) {
      errs.password = 'Password is required.';
    } else if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    if (!form.terms) errs.terms = 'You must accept the terms to continue.';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconArrowRight size={24} className="text-blue-600" />
        </div>
        <p className="font-bold text-slate-900 dark:text-white text-lg mb-1">Account created!</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This is a UI demo — no backend is connected.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        id="fullName"
        label="Full Name"
        type="text"
        placeholder="Jane Thornton"
        value={form.fullName}
        onChange={set('fullName')}
        error={errors.fullName}
        autoComplete="name"
      />

      <Input
        id="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={set('email')}
        error={errors.email}
        autoComplete="email"
      />

      <Input
        id="phone"
        label="Phone Number"
        type="tel"
        placeholder="+1 (555) 000-0000"
        value={form.phone}
        onChange={set('phone')}
        error={errors.phone}
        autoComplete="tel"
      />

      <Input
        id="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Min. 8 characters"
        value={form.password}
        onChange={set('password')}
        error={errors.password}
        autoComplete="new-password"
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

      <Input
        id="confirmPassword"
        label="Confirm Password"
        type={showConfirm ? 'text' : 'password'}
        placeholder="Repeat your password"
        value={form.confirmPassword}
        onChange={set('confirmPassword')}
        error={errors.confirmPassword}
        autoComplete="new-password"
        endAdornment={
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? <IconEyeOff size={17} /> : <IconEye size={17} />}
          </button>
        }
      />

      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            id="terms"
            type="checkbox"
            checked={form.terms}
            onChange={set('terms')}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
              Privacy Policy
            </a>
          </span>
        </label>
        {errors.terms && <p className="text-xs text-red-500 ml-7">{errors.terms}</p>}
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full mt-1">
        Create Account <IconArrowRight size={18} />
      </Button>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
          Sign in
        </a>
      </p>
    </form>
  );
}

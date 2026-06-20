'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconEye, IconEyeOff, IconWand } from '@tabler/icons-react';
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
  const router = useRouter();
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
    if (!form.terms) errs.terms = 'You must accept the rules to continue.';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // Redirect straight to create-card page
      router.push('/create-card');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Input
        id="fullName"
        label="Trainer Name"
        type="text"
        placeholder="Ash Ketchum"
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
        label="Secret Password"
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
            className="text-card-outline/60 hover:text-card-outline transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <IconEyeOff size={24} /> : <IconEye size={24} />}
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
            className="text-card-outline/60 hover:text-card-outline transition-colors"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? <IconEyeOff size={24} /> : <IconEye size={24} />}
          </button>
        }
      />

      <div className="flex flex-col gap-1 mt-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            id="terms"
            type="checkbox"
            checked={form.terms}
            onChange={set('terms')}
            className="mt-1 w-5 h-5 rounded border-2 border-card-outline text-pastel-pink focus:ring-pastel-pink cursor-pointer"
          />
          <span className="text-lg font-bold text-card-text/90 leading-tight">
            I agree to the{' '}
            <a href="#" className="text-pastel-pink underline hover:text-pink-400 font-handwriting text-2xl">
              Trainer Rules
            </a>{' '}
            and{' '}
            <a href="#" className="text-pastel-pink underline hover:text-pink-400 font-handwriting text-2xl">
              Privacy Scroll
            </a>
          </span>
        </label>
        {errors.terms && <p className="text-sm font-handwriting font-bold text-red-500 ml-8">{errors.terms}</p>}
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full mt-4 py-4 text-2xl">
        Start Journey <IconWand size={24} />
      </Button>

      <p className="text-center text-lg font-bold text-card-text/70 mt-2">
        Already a trainer?{' '}
        <a href="/login" className="text-card-outline font-handwriting text-2xl hover:text-pastel-pink transition-colors">
          Sign in
        </a>
      </p>
    </form>
  );
}

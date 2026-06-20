import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In — SecureLife Insurance',
  description: 'Sign in to your SecureLife Insurance account.',
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to manage your policies and account."
    >
      <LoginForm />
    </AuthCard>
  );
}

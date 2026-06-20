import type { Metadata } from 'next';
import { AuthCard } from '@/components/auth/AuthCard';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Create Account — SecureLife Insurance',
  description: 'Create your SecureLife Insurance account and start protecting your future.',
};

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Get started with a free consultation and personalised plan."
    >
      <SignupForm />
    </AuthCard>
  );
}

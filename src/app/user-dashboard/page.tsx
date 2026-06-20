import type { Metadata } from 'next';
import { HomePage } from '@/components/dashboard/HomePage';

export const metadata: Metadata = {
  title: 'Your Protection Hub | InsureQuest',
  description: 'Track your daily missions, manage your protection tools, and grow your card journey.',
};

export default function UserDashboardPage() {
  return <HomePage />;
}

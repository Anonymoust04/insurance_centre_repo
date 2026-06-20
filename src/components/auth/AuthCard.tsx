import type { ReactNode } from 'react';
import { IconBolt } from '@tabler/icons-react';
import Link from 'next/link';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pastel-yellow px-4 py-16 font-sans">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 transform -rotate-1 hover:rotate-0 transition-transform">
          <div className="w-12 h-12 bg-pastel-pink border-sketch flex items-center justify-center shadow-md">
            <IconBolt size={24} className="text-card-outline" />
          </div>
          <span className="font-handwriting font-bold text-card-outline text-4xl mt-2">
            Insurance <span className="text-pastel-pink drop-shadow-[1px_1px_0_var(--color-card-outline)]">Center</span>
          </span>
        </Link>

        <div className="bg-card-cream border-sketch shadow-xl p-8 transform rotate-1">
          <div className="mb-7 border-b-4 border-card-outline/20 pb-4">
            <h1 className="text-4xl font-handwriting font-bold text-card-outline mb-2">
              {title}
            </h1>
            <p className="text-lg font-bold text-card-text/80">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

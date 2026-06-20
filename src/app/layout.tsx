import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SecureLife Insurance — Protect Your Future With Confidence',
  description:
    'SecureLife Insurance helps individuals and families choose the right protection plan for life, health, retirement, and long-term financial security.',
  keywords: ['life insurance', 'health insurance', 'family protection', 'retirement planning', 'savings plan'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  );
}

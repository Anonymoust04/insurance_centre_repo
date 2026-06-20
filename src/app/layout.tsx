import type { Metadata } from 'next';
import { Fredoka, Caveat } from 'next/font/google';
import './globals.css';

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
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
    <html lang="en" className={`${fredoka.variable} ${caveat.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-pastel-yellow">{children}</body>
    </html>
  );
}

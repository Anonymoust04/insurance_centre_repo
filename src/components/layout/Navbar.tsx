'use client';

import { motion } from 'framer-motion';
import { IconShield, IconMenu2, IconX, IconMoon, IconSun } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { navItems } from '@/data/insurance';
import { cn } from '@/utils/cn';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800'
          : 'bg-transparent',
      )}
    >
      <Container className="flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <IconShield size={17} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-base leading-tight">
            SecureLife{' '}
            <span className="text-blue-600">Insurance</span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors text-sm"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
          </button>
          <a
            href="/login"
            className="hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors rounded-xl"
          >
            Login
          </a>
          <Button variant="primary" size="sm" href="/signup" className="hidden md:inline-flex">
            Get Started
          </Button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 py-4 flex flex-col gap-1"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-slate-700 dark:text-slate-300 hover:text-blue-600 font-medium py-3 border-b border-slate-50 dark:border-slate-800 text-sm"
            >
              {item.label}
            </a>
          ))}
          <div className="flex gap-2 pt-3">
            <a
              href="/login"
              className="flex-1 text-center py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-300 transition-colors"
            >
              Login
            </a>
            <Button variant="primary" size="sm" href="/signup" className="flex-1">
              Get Started
            </Button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

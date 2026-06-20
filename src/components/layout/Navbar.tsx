'use client';

import { motion } from 'framer-motion';
import { IconBolt, IconMenu2, IconX } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { navItems } from '@/data/insurance';
import { cn } from '@/utils/cn';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans text-card-text',
        scrolled
          ? 'bg-pastel-yellow/90 backdrop-blur-md shadow-sm border-b-4 border-card-outline/20'
          : 'bg-transparent',
      )}
    >
      <Container className="flex items-center justify-between h-20">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0 transform hover:rotate-2 transition-transform">
          <div className="w-10 h-10 bg-pastel-pink border-sketch flex items-center justify-center shadow-sm">
            <IconBolt size={20} className="text-card-outline" />
          </div>
          <span className="font-handwriting font-bold text-card-outline text-3xl mt-1">
            Insurance <span className="text-pastel-pink drop-shadow-[1px_1px_0_var(--color-card-outline)]">Center</span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-card-text/80 hover:text-pastel-pink font-bold font-handwriting text-2xl transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="/login"
            className="hidden md:inline-flex items-center px-4 py-2 text-xl font-bold font-handwriting text-card-text/80 hover:text-pastel-pink transition-colors"
          >
            Login
          </a>
          <Button variant="primary" size="sm" href="/signup" className="hidden md:inline-flex shadow-sm">
            Get Started
          </Button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-card-text/80 hover:bg-pastel-pink/20 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <IconX size={28} /> : <IconMenu2 size={28} />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-card-cream border-t-4 border-sketch-sm px-4 py-4 flex flex-col gap-1"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-card-text font-bold font-handwriting text-2xl py-3 border-b-2 border-card-outline/10"
            >
              {item.label}
            </a>
          ))}
          <div className="flex gap-2 pt-3">
            <a
              href="/login"
              className="flex-1 text-center py-2.5 text-xl font-bold font-handwriting text-card-text border-sketch-sm rounded-xl hover:bg-pastel-pink/20 transition-colors"
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

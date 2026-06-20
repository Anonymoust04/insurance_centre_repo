'use client';

import { motion } from 'framer-motion';
import { IconShieldCheck, IconArrowRight, IconCheck } from '@tabler/icons-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const trustPoints = ['No hidden fees', 'Cancel anytime', 'Licensed advisors'] as const;

const quickStats = [
  { value: '15K+', label: 'Protected Clients' },
  { value: '98%', label: 'Claims Satisfaction' },
  { value: '24/7', label: 'Customer Support' },
  { value: '10+', label: 'Years Experience' },
] as const;

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.12 } } },
  item: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950">
      <div className="absolute top-24 right-0 w-[700px] h-[700px] bg-blue-100/60 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-100/40 dark:bg-cyan-900/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 py-20 lg:py-28">
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.span
            variants={stagger.item}
            className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-wide"
          >
            <IconShieldCheck size={14} />
            Trusted by 15,000+ clients nationwide
          </motion.span>

          <motion.h1
            variants={stagger.item}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-6"
          >
            Protect Your Future{' '}
            <span className="text-blue-600">With Confidence</span>
          </motion.h1>

          <motion.p
            variants={stagger.item}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-2xl"
          >
            SecureLife Insurance helps individuals and families choose the right protection plan for life, health, retirement, and long-term financial security.
          </motion.p>

          <motion.div variants={stagger.item} className="flex flex-wrap gap-4 mb-10">
            <Button variant="primary" size="lg" href="#plans">
              Get a Quote <IconArrowRight size={19} />
            </Button>
            <Button variant="outline" size="lg" href="#plans">
              View Plans
            </Button>
          </motion.div>

          <motion.div variants={stagger.item} className="flex flex-wrap gap-5">
            {trustPoints.map((point) => (
              <span key={point} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                  <IconCheck size={11} className="text-blue-600 dark:text-blue-400" />
                </span>
                {point}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Quick stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.55 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {quickStats.map((s) => (
            <div
              key={s.label}
              className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-white dark:border-slate-700 rounded-2xl px-5 py-4"
            >
              <p className="text-2xl font-extrabold text-blue-600 mb-0.5">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

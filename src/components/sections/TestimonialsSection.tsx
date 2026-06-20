'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { IconStar, IconQuote } from '@tabler/icons-react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { testimonials } from '@/data/insurance';

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <Container>
        <SectionTitle
          eyebrow="Client Stories"
          title="Trusted by Real Families"
          description="Hear from the people who chose SecureLife to protect what matters most."
        />

        <div ref={ref} className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <Card className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <IconQuote size={28} className="text-blue-200 dark:text-blue-800" />
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <IconStar key={idx} size={14} className="text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1 mb-6">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { whyChooseItems } from '@/data/insurance';

export function WhyChooseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="py-24 bg-white dark:bg-slate-950">
      <Container>
        <SectionTitle
          eyebrow="Why SecureLife"
          title="A Partner You Can Count On"
          description="We built SecureLife on four principles that put your security above everything else."
        />

        <div ref={ref} className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {whyChooseItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-5 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                <item.icon size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

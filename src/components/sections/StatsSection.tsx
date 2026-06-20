'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { stats } from '@/data/insurance';

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-900">
      <Container>
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: i * 0.08, type: 'spring', stiffness: 260 }}
              className="text-center text-white"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4">
                <stat.icon size={22} className="text-white" />
              </div>
              <p className="text-4xl font-extrabold tracking-tight mb-1">{stat.value}</p>
              <p className="text-blue-200 text-sm font-medium leading-tight">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

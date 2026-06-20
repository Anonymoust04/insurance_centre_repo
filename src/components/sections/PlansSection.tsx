'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { IconArrowRight } from '@tabler/icons-react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { insurancePlans } from '@/data/insurance';

export function PlansSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="plans" className="py-24 bg-slate-50 dark:bg-slate-900">
      <Container>
        <SectionTitle
          eyebrow="Our Plans"
          title="Coverage Built Around Your Life"
          description="From individual health to full family protection — find the plan that fits your needs and your budget."
        />

        <div ref={ref} className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {insurancePlans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 36 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="h-full flex flex-col group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors duration-300">
                  <plan.icon
                    size={22}
                    className="text-blue-600 group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {plan.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mb-5">
                  {plan.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Learn More <IconArrowRight size={15} />
                </a>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

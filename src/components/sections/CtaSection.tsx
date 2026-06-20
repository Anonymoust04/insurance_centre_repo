'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { IconCalendar, IconPhone } from '@tabler/icons-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="contact" className="py-24 bg-white dark:bg-slate-950">
      <Container>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 rounded-3xl px-8 sm:px-14 py-16 text-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.span
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide mb-6"
            >
              <IconPhone size={13} />
              Free Consultation — No Obligation
            </motion.span>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
              Ready to Protect What Matters Most?
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-10">
              Speak with our advisors and find a plan that fits your life, family, and financial goals.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="secondary" size="lg" href="#contact">
                <IconCalendar size={19} /> Book a Free Consultation
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="#plans"
                className="border-white text-white hover:bg-white/10"
              >
                Browse Plans
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

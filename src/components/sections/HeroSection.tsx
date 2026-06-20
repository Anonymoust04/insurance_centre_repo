'use client';

import { motion } from 'framer-motion';
import { IconWand, IconSparkles } from '@tabler/icons-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.12 } } },
  item: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-pastel-yellow font-sans">
      {/* Background doodles / blobs */}
      <div className="absolute top-24 right-10 w-64 h-64 bg-pastel-pink border-sketch rounded-full blur-sm opacity-50 rotate-12" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-pastel-lavender border-sketch rounded-3xl blur-sm opacity-50 -rotate-12" />

      <Container className="relative z-10 py-20 lg:py-28 text-center sm:text-left flex flex-col items-center sm:items-start">
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.div
            variants={stagger.item}
            className="inline-flex items-center gap-2 bg-white border-sketch-sm text-card-outline text-lg font-bold font-handwriting px-4 py-2 mb-8 transform -rotate-2 hover:rotate-0 transition-transform shadow-sm"
          >
            <IconSparkles size={20} className="text-pastel-pink" />
            Build your own custom card!
          </motion.div>

          <motion.h1
            variants={stagger.item}
            className="text-6xl sm:text-7xl lg:text-8xl font-handwriting font-bold text-card-outline leading-[1.1] mb-6 drop-shadow-sm"
          >
            Start your <br className="hidden sm:block" />
            <span className="text-pink-500 drop-shadow-[2px_2px_0_var(--color-card-outline)] underline decoration-wavy decoration-pastel-lavender">Protection Journey</span>
          </motion.h1>

          <motion.p
            variants={stagger.item}
            className="text-xl sm:text-2xl text-card-text/80 font-bold leading-relaxed mb-10 max-w-2xl"
          >
            Create a cute, personalized trading card that shows off your insurance powers. Upload a photo, pick an energy type, and level up your future!
          </motion.p>

          <motion.div variants={stagger.item} className="flex flex-wrap justify-center sm:justify-start gap-4 mb-10">
            <Button variant="primary" size="lg" href="/signup" className="text-3xl py-5 px-10 border-sketch shadow-lg">
              Start Creating <IconWand size={28} />
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

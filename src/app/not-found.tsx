'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const ENERGY_DOTS = [
  { cls: 'bg-energy-fire', delay: 0 },
  { cls: 'bg-energy-water', delay: 0.15 },
  { cls: 'bg-energy-electric', delay: 0.3 },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-pastel-yellow flex flex-col items-center justify-center px-6 py-16 overflow-hidden">

      {/* Floating card wrapper */}
      <motion.div
        className="relative w-64 select-none"
        initial={{ opacity: 0, y: 60, rotate: -4 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18, duration: 0.6 }}
      >
        {/* Continuous gentle float */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Shadow card — bobs opposite for depth */}
          <motion.div
            className="absolute top-2 left-2 w-full h-full border-sketch bg-pastel-lavender opacity-40 rounded-3xl"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Main card */}
          <div className="relative border-sketch bg-card-cream flex flex-col items-center gap-3 px-6 py-8">

            {/* Card type label */}
            <motion.span
              className="text-xs font-bold tracking-widest text-card-outline/60 uppercase font-sans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Page Not Found
            </motion.span>

            {/* 404 */}
            <motion.p
              className="font-handwriting text-8xl font-bold text-card-outline leading-none"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.25 }}
            >
              404
            </motion.p>

            {/* Broken image placeholder — heartbeat pulse */}
            <motion.div
              className="w-36 h-28 border-sketch-sm bg-pastel-pink/40 flex items-center justify-center rounded-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, type: 'spring', stiffness: 200, damping: 14 }}
            >
              <motion.span
                className="text-5xl"
                animate={{ scale: [1, 1.18, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                💔
              </motion.span>
            </motion.div>

            {/* HP bar — drains from full to 0 on mount */}
            <motion.div
              className="w-full flex flex-col gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              <div className="flex justify-between text-xs font-bold text-game-text font-sans">
                <span>HP</span>
                <span>0 / 100</span>
              </div>
              <div className="h-3 w-full bg-card-outline/10 border-sketch-sm overflow-hidden">
                <motion.div
                  className="h-full bg-game-pink rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ delay: 0.7, duration: 1.2, ease: 'easeIn' }}
                />
              </div>
            </motion.div>

            {/* Flavour text */}
            <motion.p
              className="text-center text-sm font-sans text-game-text/70 leading-snug"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              This page took too much damage and fainted. It no longer exists in this dimension.
            </motion.p>

            {/* Energy dots — staggered pop-in */}
            <div className="flex gap-1 mt-1">
              {ENERGY_DOTS.map(({ cls, delay }) => (
                <motion.span
                  key={cls}
                  className={`w-4 h-4 rounded-full border-2 border-card-outline/30 ${cls}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.5, scale: 1 }}
                  transition={{ delay: 1.0 + delay, type: 'spring', stiffness: 300, damping: 14 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Message */}
      <motion.div
        className="mt-10 flex flex-col items-center gap-3 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.5 }}
      >
        <p className="font-handwriting text-2xl text-game-purple font-bold">
          Oops! Wrong path, trainer!
        </p>
        <p className="font-sans text-sm text-game-text/60 max-w-xs">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </motion.div>

      {/* Buttons — staggered slide up */}
      <motion.div
        className="mt-8 flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.45 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
          <Link
            href="/"
            className="block border-sketch bg-game-purple text-white font-bold font-sans px-8 py-3 text-center hover:bg-game-purple-deep transition-colors"
          >
            🏠 Go Home
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
          <Link
            href="/user-dashboard"
            className="block border-sketch bg-pastel-pink text-game-purple font-bold font-sans px-8 py-3 text-center hover:bg-pink-200 transition-colors"
          >
            🃏 My Dashboard
          </Link>
        </motion.div>
      </motion.div>

    </div>
  );
}

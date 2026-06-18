import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
  tabKey: string;
}

// Subtle Greek Aegean wave repeating line for transition aesthetic
function AegeanTransitionWaves() {
  return (
    <svg
      viewBox="0 0 800 120"
      className="w-full max-w-2xl mx-auto text-sky-400/20 stroke-current fill-none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 0 60 Q 50 30, 100 60 T 200 60 T 300 60 T 400 60 T 500 60 T 600 60 T 700 60 T 800 60" />
      <path d="M 20 75 Q 70 45, 120 75 T 220 75 T 320 75 T 420 75 T 520 75 T 620 75 T 720 75 T 820 75" className="text-sky-300/10" />
      <path d="M -20 45 Q 30 15, 80 45 T 180 45 T 280 45 T 380 45 T 480 45 T 580 45 T 680 45 T 780 45" className="text-sky-500/10" />
    </svg>
  );
}

// Sophisticated Greek Laurel Rosette logo mark highlighted during the apex of the screen wipe
function AegeanMedallion() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <svg
        viewBox="0 0 100 100"
        className="w-16 h-16 text-sky-200 fill-none stroke-current animate-pulse-slow"
        strokeWidth="1"
        strokeLinecap="round"
      >
        {/* Ancient concentric celestial guide rings */}
        <circle cx="50" cy="50" r="44" className="stroke-sky-400/20" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="38" className="stroke-sky-300/30" />
        <circle cx="50" cy="50" r="12" className="stroke-sky-200/40" />

        {/* Delicate hand-crafted Greek waves looping center */}
        <path d="M 50 12 C 45 25, 55 25, 50 38" className="stroke-sky-300/50" />
        <path d="M 50 88 C 45 75, 55 75, 50 62" className="stroke-sky-300/50" />
        <path d="M 12 50 C 25 45, 25 55, 38 50" className="stroke-sky-300/50" />
        <path d="M 88 50 C 75 45, 75 55, 62 50" className="stroke-sky-300/50" />

        {/* Small surrounding olive star points */}
        <circle cx="50" cy="50" r="2" className="fill-sky-200" />
        <circle cx="50" cy="24" r="1.5" className="fill-sky-300" />
        <circle cx="50" cy="76" r="1.5" className="fill-sky-300" />
        <circle cx="24" cy="50" r="1.5" className="fill-sky-300" />
        <circle cx="76" cy="50" r="1.5" className="fill-sky-300" />
      </svg>
      <span className="font-mono text-[9px] text-sky-300/60 uppercase tracking-[0.25em]">
        AMALTEA GREEK CATERING
      </span>
    </div>
  );
}

export function PageTransition({ children, tabKey }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, provide a simple premium fade
  if (shouldReduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    );
  }

  // Wipe transition variants
  const wipeVariants = {
    initial: {
      clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
    },
    animate: {
      clipPath: [
        'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', // start offscreen left
        'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // fully cover
        'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)', // offscreen right
      ],
      transition: {
        duration: 1.15,
        times: [0, 0.45, 1],
        ease: [0.76, 0, 0.24, 1], // premium cubic bezier (Antigravity curve)
      },
    },
  };

  // Center medallion fade rising variants
  const contentVariants = {
    initial: { opacity: 0, y: 15, filter: 'blur(3px)' },
    animate: {
      opacity: [0, 0, 1, 1, 0, 0],
      y: [15, 10, 0, 0, -10, -15],
      filter: ['blur(3px)', 'blur(1px)', 'blur(0px)', 'blur(0px)', 'blur(2px)', 'blur(4px)'],
      transition: {
        duration: 1.15,
        times: [0, 0.15, 0.35, 0.55, 0.75, 1],
        ease: 'easeInOut',
      },
    },
  };

  // Main page contents revealed beautifully underneath
  const innerRevealVariants = {
    initial: { opacity: 0, filter: 'blur(1px)', y: 8 },
    animate: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        delay: 0.45, // starts revealing right as the wipe begins sliding off to the right
        duration: 0.55,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  };

  return (
    <div className="relative w-full">
      {/* 1. Fullscreen Transition Wipe Panel */}
      <motion.div
        key={`wipe-${tabKey}`}
        variants={wipeVariants}
        initial="initial"
        animate="animate"
        className="fixed inset-0 z-[120] bg-blue-950 pointer-events-none flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Subtle repeating Aegean wave pattern background watermarked */}
        <div className="absolute inset-0 flex flex-col justify-around py-12 opacity-80">
          <AegeanTransitionWaves />
          <AegeanTransitionWaves />
          <AegeanTransitionWaves />
        </div>

        {/* Centered laurel crown emblem briefly appearing during the apex of the cover */}
        <motion.div variants={contentVariants}>
          <AegeanMedallion />
        </motion.div>
      </motion.div>

      {/* 2. Page Content container reveal */}
      <motion.div
        variants={innerRevealVariants}
        initial="initial"
        animate="animate"
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

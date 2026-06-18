import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { TimelineStep } from '../types';

interface InteractiveTimelineProps {
  listTimeline: TimelineStep[];
  lang: 'en' | 'pl';
}


// Subtle, elegant Greek olive branch vector decoration with self-drawing paths
function OliveBranchSVG({ className = "" }: { className?: string }) {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 1.8, ease: "easeInOut" }
    }
  };

  return (
    <svg 
      viewBox="0 0 120 200" 
      className={`${className} pointer-events-none select-none`} 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.25" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Main winding vine stem */}
      <motion.path 
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        d="M60 190 C 40 140, 70 80, 50 15" 
        className="stroke-blue-200/60 dark:stroke-sky-850/30" 
      />
      
      {/* Leaves with very subtle fill */}
      <motion.path 
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        d="M57 160 C 35 152, 28 138, 52 132 C 55 131, 57 131, 57 131" 
        className="stroke-blue-200/50 dark:stroke-sky-800/40 fill-blue-50/10 dark:fill-sky-950/10" 
      />
      <motion.path 
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        d="M63 150 C 85 142, 92 128, 68 122 C 65 121, 63 121, 63 121" 
        className="stroke-blue-200/50 dark:stroke-sky-800/40 fill-blue-50/10 dark:fill-sky-950/10" 
      />
      
      <motion.path 
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        d="M55 120 C 30 112, 22 98, 48 92 C 51 91, 53 91, 53 91" 
        className="stroke-blue-200/50 dark:stroke-sky-800/40 fill-blue-50/10 dark:fill-sky-950/10" 
      />
      <motion.path 
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        d="M65 110 C 90 102, 98 88, 72 82 C 69 81, 67 81, 67 81" 
        className="stroke-blue-200/50 dark:stroke-sky-800/40 fill-blue-50/10 dark:fill-sky-950/10" 
      />
      
      <motion.path 
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        d="M53 80 C 28 72, 18 58, 46 52 C 49 51, 51 51, 51 51" 
        className="stroke-blue-200/50 dark:stroke-sky-800/40 fill-blue-50/10 dark:fill-sky-950/10" 
      />
      <motion.path 
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        d="M67 70 C 92 62, 102 48, 74 42 C 71 41, 69 41, 69 41" 
        className="stroke-blue-200/50 dark:stroke-sky-800/40 fill-blue-50/10 dark:fill-sky-950/10" 
      />
      
      {/* Topmost crown leaves */}
      <motion.path 
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        d="M50 35 C 32 25, 42 12, 50 15 C 58 12, 68 25, 50 35 Z" 
        className="stroke-blue-300/60 dark:stroke-sky-700/50 fill-blue-50/15 dark:fill-sky-950/15" 
      />
    </svg>
  );
}

// Elegant Aegean wave ornament (Greek key inspired wave line)
function AegeanWaveSVG({ className = "" }: { className?: string }) {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 2.2, ease: "easeInOut" }
    }
  };

  return (
    <svg 
      viewBox="0 0 1000 40" 
      className={`${className} pointer-events-none select-none`} 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path 
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        d="M 0 20 Q 25 5, 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20 T 350 20 T 400 20 T 450 20 T 500 20 T 550 20 T 600 20 T 650 20 T 700 20 T 750 20 T 800 20 T 850 20 T 900 20 T 950 20 T 1000 20" 
        className="stroke-sky-300/40 dark:stroke-sky-850/30" 
      />
      <motion.path 
        variants={pathVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        d="M 12 28 Q 37 13, 62 28 T 112 28 T 162 28 T 212 28 T 262 28 T 312 28 T 362 28 T 412 28 T 462 28 T 512 28 T 562 28 T 612 28 T 662 28 T 712 28 T 762 28 T 812 28 T 862 28 T 912 28 T 962 28 T 1012 28" 
        className="stroke-blue-200/25 dark:stroke-blue-900/20" 
      />
    </svg>
  );
}

// Single timeline node item to compute individual scroll parallax outline watermarks
const TimelineItem: React.FC<{ step: TimelineStep; idx: number; lang: 'en' | 'pl'; shouldReduceMotion: boolean | null }> = ({ step, idx: _idx, lang, shouldReduceMotion }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Local scroll tracking for parallax giant outline years
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "end start"]
  });

  const watermarkY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const watermarkScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.08, 0.95]);
  const watermarkOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 0.08, 0.08, 0]);

  // Framer Motion variants matching visual requirements
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.05
      }
    }
  };

  // Active Year highlight and pop scale variant
  const yearVariants = {
    hidden: { 
      opacity: shouldReduceMotion ? 1 : 0.35, 
      scale: shouldReduceMotion ? 1 : 0.85,
      x: shouldReduceMotion ? 0 : -25,
      filter: shouldReduceMotion ? "none" : "blur(1px)",
      color: "#1e3a8a" // dark blue / slate
    },
    visible: { 
      opacity: 1, 
      scale: 1.15,
      x: 0,
      filter: "blur(0px)",
      color: "#d97706", // active gold!
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const dotVariants = {
    hidden: { 
      scale: shouldReduceMotion ? 1 : 0.6, 
      opacity: shouldReduceMotion ? 1 : 0.4
    },
    visible: { 
      scale: 1.25, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 140,
        damping: 12
      }
    }
  };

  // 3D Camera focus reveal (slide in, Y rotate, and blur resolution)
  const cardVariants = {
    hidden: { 
      opacity: shouldReduceMotion ? 1 : 0, 
      x: shouldReduceMotion ? 0 : 45, 
      rotateY: shouldReduceMotion ? 0 : -22,
      scale: shouldReduceMotion ? 1 : 0.94,
      filter: shouldReduceMotion ? "none" : "blur(6px)"
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      rotateY: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        type: "spring",
        stiffness: 65,
        damping: 14
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Track cursor coordinates inside card
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    // Tilt calculations (max 7 degrees)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;
    setTilt({
      x: -mouseY * 7,
      y: mouseX * 7
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div 
      ref={itemRef}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-120px 0px" }}
      className="relative pl-8 md:pl-12 group flex flex-col md:flex-row md:items-start"
    >
      {/* Gold dust particles rising behind active card */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="gold-dust" style={{ left: "15%", bottom: "0px", "--drift-x": "30px", "--dust-duration": "6s" } as React.CSSProperties} />
        <div className="gold-dust" style={{ left: "50%", bottom: "0px", "--drift-x": "-40px", "--dust-duration": "8s" } as React.CSSProperties} />
        <div className="gold-dust" style={{ left: "75%", bottom: "0px", "--drift-x": "20px", "--dust-duration": "7s" } as React.CSSProperties} />
      </div>

      {/* Timeline dot with infinite sonar ring pulse */}
      <motion.div 
        variants={dotVariants}
        className="absolute left-[-1.5px] top-1.5 w-[19px] h-[19px] bg-blue-700 dark:bg-sky-400 border-4 border-white dark:border-slate-950 rounded-full z-20 cursor-pointer sonar-active"
        style={{ left: "-1.5px" }} 
      />
      
      {/* Year sticker for large displays - transitions color dynamically on scroll */}
      <motion.div 
        variants={yearVariants}
        className="hidden md:block absolute left-[-160px] top-0.5 text-2xl font-serif font-black w-28 text-right pr-4 selection:bg-blue-100 transition-colors duration-300"
      >
        {step.year}
        <span className="block text-[9px] uppercase font-mono font-bold tracking-widest text-sky-600 dark:text-sky-455 mt-0.5">
          {lang === 'pl' ? 'KROK' : 'MILESTONE'}
        </span>
      </motion.div>

      {/* Main Card Content with 3D Y-axis fold-open & camera focus */}
      <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        variants={cardVariants}
        animate={{ 
          rotateX: tilt.x, 
          rotateY: tilt.y, 
          scale: isHovered ? 1.02 : 1,
          boxShadow: isHovered 
            ? "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)" 
            : "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)"
        }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/85 p-6 md:p-7 shadow-sm rounded-lg hover:border-amber-500/50 dark:hover:border-amber-500/40 relative overflow-hidden group-hover:shadow-lg transform-gpu cursor-pointer"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        {/* Dynamic watermarked year outline background linked to scroll parallax (enhanced contrast in light mode) */}
        <motion.div
          style={{ 
            y: shouldReduceMotion ? 0 : watermarkY, 
            scale: shouldReduceMotion ? 1 : watermarkScale,
            opacity: shouldReduceMotion ? 0.08 : watermarkOpacity,
            WebkitTextStroke: "1.5px rgba(217, 119, 6, 0.35)",
            color: "transparent"
          }}
          className="absolute right-6 -bottom-14 text-[8rem] sm:text-[12rem] font-serif font-black select-none pointer-events-none z-0 transform-gpu"
        >
          {step.year}
        </motion.div>

        {/* Glare reflection overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 holo-glare transform-gpu"
          style={{
            transform: 'translateZ(30px)',
            opacity: isHovered ? 1 : 0,
            '--mouse-x': `${coords.x}px`,
            '--mouse-y': `${coords.y}px`
          } as React.CSSProperties}
        />

        {/* Subtle top horizontal accent gradient bar on card */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 via-sky-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* Year marker inside card for tablet/mobi */}
        <span className="inline-block md:hidden border-l-2 border-sky-500 pl-2 text-sky-600 dark:text-sky-400 font-mono font-extrabold text-base mb-3 relative z-10">
          {step.year}
        </span>

        <h3 className="font-serif text-lg md:text-xl font-bold text-blue-950 dark:text-slate-100 uppercase tracking-wide mb-2.5 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors duration-300 relative z-10" style={{ transform: 'translateZ(10px)' }}>
          {step.title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 font-sans text-xs sm:text-sm leading-relaxed relative z-10" style={{ transform: 'translateZ(5px)' }}>
          {step.description}
        </p>
      </motion.div>
    </motion.div>
  );
};

export function InteractiveTimeline({ listTimeline, lang }: InteractiveTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll linked animation for the main vertical timeline line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 80%"]
  });

  const fillProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const beadY = useTransform(fillProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="relative py-14 overflow-hidden bg-slate-50/40 dark:bg-slate-950/10 border-y border-slate-100 dark:border-slate-900/60">
      {/* Decorative Greek-inspired SVG Background Elements */}
      <OliveBranchSVG className="absolute left-[-20px] top-[10%] w-32 h-64 opacity-20 text-sky-400/80 dark:text-sky-600/50 md:opacity-30 md:w-44 md:h-88 hidden sm:block" />
      <OliveBranchSVG className="absolute right-[-20px] bottom-[15%] w-32 h-64 opacity-20 text-sky-400/80 dark:text-sky-600/50 md:opacity-30 md:w-44 md:h-88 transform scale-x-[-1] hidden sm:block" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <AegeanWaveSVG className="w-full max-w-lg mx-auto text-sky-200/40 mb-2" />

        <div 
          ref={containerRef}
          className="relative ml-4 md:ml-32 py-8 font-sans select-text perspective-[1200px]"
        >
          {/* 1. Vertical Static Line */}
          <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-slate-200/60 dark:bg-slate-800/40" />

          {/* 2. Vertical Smooth Active Animated Line */}
          <motion.div 
            style={{ 
              scaleY: shouldReduceMotion ? 1 : fillProgress, 
              originY: 0 
            }} 
            className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-700 via-sky-500 to-amber-500" 
          />

          {/* 3. Traveling liquid glow bead */}
          <motion.div 
            style={{ 
              top: beadY,
              scale: shouldReduceMotion ? 0 : 1
            }} 
            className="absolute left-[7px] w-[14px] h-[14px] bg-amber-400 rounded-full z-20 -translate-x-1/2 shadow-[0_0_15px_#f59e0b] border-2 border-white dark:border-slate-950 transform-gpu"
          >
            <div className="absolute inset-[-6px] border border-amber-400 rounded-full animate-ping opacity-75" />
            <div className="absolute inset-[-12px] border border-amber-500/50 rounded-full animate-ping opacity-40" />
          </motion.div>

          {/* Timeline points list */}
          <div className="space-y-14">
            {listTimeline.map((step, idx) => (
              <TimelineItem 
                key={step.year} 
                step={step} 
                idx={idx} 
                lang={lang} 
                shouldReduceMotion={shouldReduceMotion} 
              />
            ))}
          </div>
        </div>

        <AegeanWaveSVG className="w-full max-w-lg mx-auto text-sky-200/40 mt-6 transform scale-y-[-1]" />
      </div>
    </div>
  );
}

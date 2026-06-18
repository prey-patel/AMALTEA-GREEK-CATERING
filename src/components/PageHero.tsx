/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { getOptimizedImageUrl } from '../types';

interface PageHeroProps {
  lang: 'en' | 'pl';
  badge: string;
  title: string;
  subtitle: string;
  bgImage: string;
  bgAlt?: string;
}

// Reusable Floating Gold Leaf component
function FloatingLeaf({ delay, x, y, size, rotate }: { delay: number; x: string; y: string; size: number; rotate: number }) {
  return (
    <motion.div
      initial={{ y: "110%", opacity: 0, rotate: 0 }}
      animate={{ 
        y: "-20%", 
        opacity: [0, 0.4, 0.4, 0],
        x: ["0%", "10%", "-10%", "0%"],
        rotate: [rotate, rotate + 180, rotate + 360] 
      }}
      transition={{ 
        duration: 16, 
        delay, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="absolute pointer-events-none select-none text-amber-600/15 dark:text-amber-500/10 z-0"
      style={{ left: x, top: y, width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L7.36,18.5C11.58,19.34 16.5,15.5 17,8M12,14C11.45,14 11,13.55 11,13C11,12.45 11.45,12 12,12C12.55,12 13,12.45 13,13C13,13.55 12.55,14 12,14Z" />
      </svg>
    </motion.div>
  );
}

// Reusable Background Parallax & Aperture load zoom component
function HeroBackground({ bgImage, bgAlt = "Background panorama" }: { bgImage: string; bgAlt?: string }) {
  const bgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: bgRef,
    offset: ["start start", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 70]);

  return (
    <motion.div 
      ref={bgRef} 
      initial={{ clipPath: "circle(0% at 50% 50%)" }}
      animate={{ clipPath: "circle(120% at 50% 50%)" }}
      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 overflow-hidden transform-gpu"
    >
      <motion.img
        style={{ scale, y }}
        src={getOptimizedImageUrl(bgImage, 1920)}
        alt={bgAlt}
        width="1920"
        height="1080"
        className="w-full h-full object-cover object-center opacity-90 dark:opacity-30 select-none pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6EE] via-[#FAF6EE]/40 to-[#FAF6EE] dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950" />
    </motion.div>
  );
}

// Reusable springy Split Text component
function SplitText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(' ');
  
  const wordVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.025,
        delayChildren: delay,
      }
    }
  };

  const charVariants = {
    hidden: { 
      opacity: 0, 
      y: 35, 
      rotateX: -85,
      filter: "blur(3px)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 10 
      }
    }
  };

  return (
    <motion.span 
      variants={wordVariants}
      initial="hidden"
      animate="visible"
      className={`inline-block perspective-[800px] ${className}`}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.25em] py-1">
          {Array.from(word).map((char, charIdx) => (
            <motion.span
              key={charIdx}
              variants={charVariants}
              whileHover={{ 
                scale: 1.35, 
                y: -14, 
                rotateZ: [0, -12, 12, 0], 
                color: "#C5A880",
                textShadow: "0 0 14px rgba(197, 168, 128, 0.6)"
              }}
              transition={{ type: "spring", stiffness: 350, damping: 7 }}
              className="inline-block origin-center transform-gpu cursor-pointer transition-colors duration-200"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}

export function PageHero({
  lang: _lang,
  badge,
  title,
  subtitle,
  bgImage,
  bgAlt
}: PageHeroProps) {
  const [heroSpotlight, setHeroSpotlight] = useState({ x: 50, y: 50 });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHeroSpotlight({ x, y });
  };

  return (
    <section 
      onMouseMove={handleHeroMouseMove}
      className="relative bg-[#FAF6EE] text-slate-900 dark:bg-slate-950 dark:text-white py-32 px-4 overflow-hidden border-b border-[#C5A880]/15 dark:border-slate-800"
    >
      <HeroBackground bgImage={bgImage} bgAlt={bgAlt} />
      
      {/* Floating cursor ambient gradient spotlight */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none transition-opacity duration-300 z-0 bg-[radial-gradient(circle_500px_at_var(--x,50%)_var(--y,50%),rgba(53,92,125,0.08)_0%,rgba(197,168,128,0.05)_40%,transparent_100%)] dark:bg-[radial-gradient(circle_500px_at_var(--x,50%)_var(--y,50%),rgba(2,132,199,0.25)_0%,rgba(217,119,6,0.1)_40%,transparent_100%)]"
        style={{
          "--x": `${heroSpotlight.x}%`,
          "--y": `${heroSpotlight.y}%`
        } as React.CSSProperties}
      />

      {/* 3D Floating Particles */}
      <FloatingLeaf delay={0} x="5%" y="10%" size={20} rotate={10} />
      <FloatingLeaf delay={3} x="90%" y="20%" size={24} rotate={45} />
      <FloatingLeaf delay={6} x="12%" y="60%" size={18} rotate={90} />
      <FloatingLeaf delay={9} x="82%" y="70%" size={22} rotate={15} />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <motion.span 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[#355C7D] dark:text-sky-400 font-mono text-xs uppercase tracking-widest font-bold block"
        >
          {badge}
        </motion.span>
        
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wide text-[#355C7D] dark:text-white">
          <SplitText text={title} delay={0.15} />
        </h1>
        
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="font-serif text-xl sm:text-2xl text-slate-700 dark:text-sky-200 font-light max-w-2xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.h2>
        
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="w-20 h-1 bg-[#355C7D] dark:bg-sky-400 mx-auto mt-4 shadow-[0_1px_4px_rgba(53,92,125,0.2)] dark:shadow-[0_0_8px_#38bdf8]" 
        />
      </div>
    </section>
  );
}

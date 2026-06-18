import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  lang: 'en' | 'pl';
  setActiveTab: (tab: 'home' | 'about' | 'business' | 'private' | 'gallery' | 'contact') => void;
  isReduced: boolean;
}

export default function AboutSection({ lang, setActiveTab, isReduced }: AboutSectionProps) {
  const containerRef = useRef(null);

  // Local scroll trigger calculation for parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yAboutImg = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const yAboutTxt = useTransform(scrollYProgress, [0, 1], [20, -20]);

  // Framer Motion Variants
  const letterSpacingVariants = {
    hidden: { opacity: 0, letterSpacing: '0.1em', y: 10 },
    visible: {
      opacity: 1,
      letterSpacing: '0.25em',
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const lineMaskVariants = {
    hidden: { y: "100%" },
    visible: {
      y: 0,
      transition: { 
        duration: 0.9, 
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (customDelay: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        delay: customDelay
      }
    })
  };

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Text column sliding up/down on scroll */}
        <motion.div 
          style={{ y: isReduced ? 0 : yAboutTxt }}
          className="lg:col-span-5 space-y-6"
        >
          <motion.span 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={letterSpacingVariants}
            className="text-blue-700 font-mono text-xs uppercase font-bold tracking-widest pl-2 border-l-2 border-blue-700 block"
          >
            Amaltea Catering
          </motion.span>
          
          <div className="overflow-hidden py-1">
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={lineMaskVariants}
              className="font-serif text-3xl sm:text-4xl text-blue-950 font-bold leading-tight uppercase"
            >
              {lang === 'pl' ? 'Nasza Historia' : 'Our Story'}
            </motion.h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            custom={0.2}
            className="space-y-4"
          >
            <p className="text-slate-600 font-sans text-base leading-relaxed">
              {lang === 'pl'
                ? 'Amaltea Catering powstało z wieloletniego doświadczenia restauracji El Greco, Paros i Mykonos.'
                : 'Amaltea Catering was born from the many years of experience behind El Greco, Paros and Mykonos restaurants.'}
            </p>
            <p className="text-slate-600 font-sans text-base leading-relaxed">
              {lang === 'pl'
                ? 'Inspirując się grecką kulturą wspólnego biesiadowania, tworzymy niezapomniane wydarzenia, wykorzystując autentyczne produkty sprowadzane bezpośrednio z Grecji oraz receptury, które od lat towarzyszą naszym Gościom.'
                : 'Inspired by the Greek culture of gathering around the table, we create memorable events using authentic ingredients sourced directly from Greece and recipes that have delighted our guests for years.'}
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            custom={0.4}
            className="pt-3"
          >
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className="px-6 py-3 bg-blue-800 hover:bg-blue-900 dark:bg-blue-900 dark:hover:bg-blue-950 text-white font-mono text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer inline-flex items-center space-x-2"
            >
              <span>{lang === 'pl' ? 'Dowiedz się więcej o nas' : 'Learn More About Us'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>

        {/* Image column with sliding curtain mask reveal */}
        <motion.div 
          style={{ y: isReduced ? 0 : yAboutImg }}
          className="lg:col-span-7 relative"
        >
          <div className="absolute top-0 right-[-10px] w-72 h-72 bg-blue-50 bg-pulse-greek rounded-full -z-10" />
          <div className="relative border-12 border-white shadow-xl overflow-hidden group">
            <motion.div 
              initial={{ scaleX: 1 }}
              whileInView={{ scaleX: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              style={{ originX: 0 }}
              className="absolute inset-0 bg-blue-800 z-10"
            />
            <motion.img
              whileHover={{ scale: isReduced ? 1 : 1.05 }}
              transition={{ duration: 0.8 }}
              src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=70&w=800"
              alt="Aegean terrace dining"
              loading="lazy"
              width="800"
              height="533"
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

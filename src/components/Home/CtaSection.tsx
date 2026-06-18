import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface CtaSectionProps {
  lang: 'en' | 'pl';
  setActiveTab: (tab: 'home' | 'about' | 'business' | 'private' | 'gallery' | 'contact') => void;
  isReduced: boolean;
}

export default function CtaSection({ lang, setActiveTab, isReduced }: CtaSectionProps) {
  const containerRef = useRef(null);

  // Local scroll trigger calculation for CTA parallax background
  const { scrollYProgress: ctaScroll } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yCtaBg = useTransform(ctaScroll, [0, 1], [-40, 40]);

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#FAF6EE] dark:bg-slate-950 text-slate-900 dark:text-white py-16 px-8 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-[#C5A880]/30 dark:border-slate-800 rounded-none shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] dark:shadow-none">
        <motion.div 
          style={{ y: isReduced ? 0 : yCtaBg, scale: 1.15 }}
          className="absolute inset-0 opacity-25 dark:opacity-15"
        >
          <img
            src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=70&w=800"
            alt="Aegean sea background"
            loading="lazy"
            width="800"
            height="533"
            className="w-full h-[140%] object-cover"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6EE] via-[#FAF6EE]/70 to-[#FAF6EE]/90 dark:from-slate-950 dark:via-slate-900/70 dark:to-slate-950/90 z-0" />

        <div className="relative z-10 max-w-2xl space-y-4 text-center md:text-left">
          <h2 className="font-serif text-2xl sm:text-4xl text-[#355C7D] dark:text-sky-200 uppercase font-semibold leading-tight">
            {lang === 'pl' ? 'Zacznijmy tworzyć niezapomniane chwile' : "Let's Create Unforgettable Moments Together"}
          </h2>
          <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base font-light leading-relaxed">
            {lang === 'pl'
              ? 'Skontaktuj się z nami, a przygotujemy ofertę dopasowaną do charakteru wydarzenia i Twoich oczekiwań.'
              : 'Get in touch with us, and we will prepare a proposal tailored to the nature of your event and your expectations.'}
          </p>
        </div>

        <div className="relative z-10 w-full md:w-auto flex flex-col sm:flex-row gap-4 shrink-0">
          <motion.button
            whileHover={{ 
              scale: isReduced ? 1 : 1.03, 
              boxShadow: "0 10px 25px -5px rgba(197, 168, 128, 0.5)"
            }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setActiveTab('contact')}
            className="px-10 py-[18px] bg-gradient-to-r from-[#C5A880] to-[#b3956c] hover:from-[#b3956c] hover:to-[#9e8159] text-white border-none font-mono font-bold tracking-widest text-xs uppercase cursor-pointer text-center transition-all duration-300 shadow-[0_4px_15px_rgba(197, 168, 128, 0.35)]"
          >
            {lang === 'pl' ? 'Wyślij zapytanie' : 'Send an Enquiry'}
          </motion.button>
        </div>
      </div>
    </section>
  );
}

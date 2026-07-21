/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { PageHeroData, CateringCategory } from '../types';

// Helper to auto-reload page once if dynamic module import fails (e.g. stale chunk after new deployment)
const lazyWithRetry = <T extends React.ComponentType<unknown>>(
  componentImport: () => Promise<{ default: T }>
) =>
  React.lazy(async () => {
    const hasRefreshed = sessionStorage.getItem('chunk-retry-refreshed');
    try {
      const component = await componentImport();
      sessionStorage.removeItem('chunk-retry-refreshed');
      return component;
    } catch (error) {
      if (!hasRefreshed) {
        sessionStorage.setItem('chunk-retry-refreshed', 'true');
        window.location.reload();
      }
      throw error;
    }
  });

// Lazy load below-the-fold sections
const CoreValues = lazyWithRetry(() => import('../components/Home/CoreValues'));
const AboutSection = lazyWithRetry(() => import('../components/Home/AboutSection'));
const ServicesSection = lazyWithRetry(() => import('../components/Home/ServicesSection'));
const RestaurantsSection = lazyWithRetry(() => import('../components/Home/RestaurantsSection'));
const StepsSection = lazyWithRetry(() => import('../components/Home/StepsSection'));
const CtaSection = lazyWithRetry(() => import('../components/Home/CtaSection'));

interface HomeProps {
  lang: 'en' | 'pl';
  setActiveTab: (tab: 'home' | 'about' | 'business' | 'private' | 'gallery' | 'contact') => void;
  t: (key: string) => string;
  categories?: CateringCategory[];
  pageHeroData?: PageHeroData;
}

export default function Home({ lang, setActiveTab, t, categories = [], pageHeroData }: HomeProps) {
  const shouldReduceMotion = useReducedMotion();
  const isReduced = !!shouldReduceMotion;

  // Format dynamic hero title with premium highlighting if matching defaults
  const getFormattedTitle = () => {
    const title = pageHeroData
      ? (lang === 'pl' ? pageHeroData.title_pl : pageHeroData.title_en)
      : (lang === 'pl' ? 'Grecja na Twoim stole' : 'Authentic Greece at Your Table');

    if (lang === 'en' && (title === 'Authentic Greece at Your Table' || title === 'Taste the Essence of Greece')) {
      if (title === 'Authentic Greece at Your Table') {
        return (
          <>
            Authentic <span className="italic font-normal text-[#C5A880]">Greece</span><br />
            at Your Table
          </>
        );
      }
      return (
        <>
          Taste the Essence<br />
          of <span className="italic font-normal text-[#C5A880]">Greece</span>
        </>
      );
    } else if (lang === 'pl' && (title === 'Grecja na Twoim stole' || title === 'Smak Autentycznej Gościnności Greków')) {
      if (title === 'Grecja na Twoim stole') {
        return (
          <>
            <span className="italic font-normal text-[#C5A880]">Grecja</span><br />
            na Twoim stole
          </>
        );
      }
      return (
        <>
          Smak Autentycznej<br />
          Gościnności <span className="italic font-normal text-[#C5A880]">Greków</span>
        </>
      );
    }

    const renderContent = (text: string) => {
      if (text.endsWith('Greece')) {
        const mainPart = text.substring(0, text.length - 6);
        return <>{mainPart}<span className="italic font-normal text-[#C5A880]">Greece</span></>;
      } else if (text.endsWith('Greków')) {
        const mainPart = text.substring(0, text.length - 6);
        return <>{mainPart}<span className="italic font-normal text-[#C5A880]">Greków</span></>;
      } else if (text.endsWith('Grecja')) {
        const mainPart = text.substring(0, text.length - 6);
        return <>{mainPart}<span className="italic font-normal text-[#C5A880]">Grecja</span></>;
      }
      return text;
    };

    if (title.includes('\n')) {
      return (
        <>
          {title.split('\n').map((line, idx, arr) => (
            <React.Fragment key={idx}>
              {renderContent(line)}
              {idx < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </>
      );
    }

    return renderContent(title);
  };

  // Use Admin Panel image_url dynamically if set by admin, fallback to local optimized defaults
  const heroImageUrl = pageHeroData?.image_url || '/hero-home.jpg';
  const mobileHeroUrl = pageHeroData?.image_url || '/hero-home-mobile.jpg';

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-slate-950 dark:bg-brand-bg text-white py-28 md:py-44 px-4 overflow-hidden min-h-[92vh] flex items-center">
        {/* Responsive Background Image using Picture Element for performance */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet={mobileHeroUrl}
            />
            <img
              src={heroImageUrl}
              alt="Amaltea Greek Catering food spread"
              width="1672"
              height="817"
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-center opacity-100 select-none"
            />
          </picture>
        </div>

        {/* Mobile-only dark overlay for text readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/40 to-black/60 md:opacity-0 pointer-events-none transition-opacity" />

        {/* Left-aligned Content Wrapper */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full flex justify-start items-center select-text">
          <div className="max-w-2xl lg:max-w-3xl space-y-6 md:space-y-8 text-left">
            
            {/* Top Brand Logo Banner – client brand mark */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="select-text"
              style={{ display: "flex", flexDirection: "column", width: "fit-content", alignItems: "stretch" }}
            >
              {/* AMALTEA – wider spacing so visual width matches GREEK CATERING */}
              <h2
                className="font-serif uppercase leading-none hero-brand-text"
                style={{
                  fontSize: "clamp(1.8rem, 6.5vw, 4.2rem)",
                  letterSpacing: "0.43em",
                  fontWeight: 300,
                  marginBottom: "0.1rem",
                  whiteSpace: "nowrap",
                  color: "#355C7D",
                }}
              >
                AMALTEA
              </h2>

              {/* GREEK CATERING */}
              <h3
                className="font-serif uppercase leading-none hero-brand-text"
                style={{
                  fontSize: "clamp(1.1rem, 4vw, 2.6rem)",
                  letterSpacing: "0.25em",
                  fontWeight: 300,
                  marginBottom: "0.8rem",
                  whiteSpace: "nowrap",
                  color: "#355C7D",
                }}
              >
                GREEK CATERING
              </h3>

              {/* ——— ◆ ——— spans full badge width */}
              <div
                className="flex items-center self-center"
                style={{ gap: "0.6rem", marginBottom: "0.65rem", width: "65%" }}
              >
                <div className="hero-brand-divider" style={{ flex: 1, height: "1px", background: "rgba(53, 92, 125, 0.5)" }} />
                <span className="text-[#C5A880]" style={{ fontSize: "0.5rem", lineHeight: 1 }}>◆</span>
                <div className="hero-brand-divider" style={{ flex: 1, height: "1px", background: "rgba(53, 92, 125, 0.5)" }} />
              </div>

              {/* EL GRECO • PAROS • MYKONOS – centered below divider */}
              <p
                className="font-sans uppercase hero-brand-text"
                style={{
                  fontSize: "clamp(0.55rem, 1.4vw, 0.85rem)",
                  letterSpacing: "clamp(0.1rem, 0.4vw, 0.25em)",
                  fontWeight: 400,
                  textAlign: "center",
                  color: "#355C7D",
                }}
              >
                EL GRECO &nbsp;•&nbsp; PAROS &nbsp;•&nbsp; MYKONOS
              </p>
            </motion.div>

            {/* Headline with golden italic highlight */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-white leading-tight uppercase hero-title"
            >
              {getFormattedTitle()}
            </motion.h1>

            {/* Subtext Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
              className="text-black font-sans text-sm sm:text-base max-w-xl leading-relaxed hero-subtitle"
            >
              {pageHeroData
                ? (lang === 'pl' ? pageHeroData.subtitle_pl : pageHeroData.subtitle_en)
                : (lang === 'pl'
                  ? 'Celebrujemy grecką sztukę wspólnego biesiadowania, łącząc autentyczne receptury, składniki sprowadzane prosto z Grecji oraz gościnność, która sprawia, że każde spotkanie staje się wyjątkowym doświadczeniem.'
                  : 'We celebrate the Greek art of gathering around the table, bringing together authentic recipes, ingredients sourced directly from Greece, and warm hospitality that turns every occasion into a truly memorable experience.')}
            </motion.p>

            {/* Pill-shaped Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(197, 168, 128, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  setActiveTab('contact');
                  setTimeout(() => {
                    const targetElement = document.getElementById('inquiry-anchor');
                    if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#C5A880] via-[#E2D1B6] to-[#C5A880] hover:from-[#BCA075] hover:to-[#BCA075] text-[#0A1128] font-sans font-bold tracking-widest text-[11px] uppercase rounded-full shadow-md transition-all cursor-pointer"
              >
                {lang === 'pl' ? 'Uzyskaj Ofertę' : 'Get a Quote'}
              </motion.button>
            </motion.div>



          </div>
        </div>

        {/* Decorative waves */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t z-10" 
          style={{
            backgroundImage: 'linear-gradient(to top, var(--app-bg), transparent)'
          }}
        />
      </section>

      {/* Lazy loaded below-the-fold sections */}
      <React.Suspense fallback={
        <div className="w-full py-12 flex justify-center items-center">
          <div className="w-6 h-6 border-2 border-[#C5A880]/30 border-t-[#C5A880] rounded-full animate-spin opacity-50" />
        </div>
      }>
        <CoreValues lang={lang} isReduced={isReduced} />
        <AboutSection lang={lang} setActiveTab={setActiveTab} isReduced={isReduced} />
        <ServicesSection lang={lang} setActiveTab={setActiveTab} t={t} categories={categories} isReduced={isReduced} />
        <RestaurantsSection lang={lang} isReduced={isReduced} />
        <StepsSection lang={lang} isReduced={isReduced} />
        <CtaSection lang={lang} setActiveTab={setActiveTab} isReduced={isReduced} />
      </React.Suspense>
    </div>
  );
}

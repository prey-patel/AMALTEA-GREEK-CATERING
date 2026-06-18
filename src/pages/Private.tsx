/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Briefcase,
  Award,
  Users,
  Utensils,
  Heart,
  Sparkles,
  Calendar,
  TrendingUp,
  Coins,
  Coffee,
  Globe,
  Building,
  Cake,
  Gift,
  Music,
  Smile,
  Home as HomeIcon,
  ChefHat,
  ArrowRight
} from 'lucide-react';

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  Award,
  Users,
  Utensils,
  Heart,
  Sparkles,
  Calendar,
  TrendingUp,
  Coins,
  Coffee,
  Globe,
  Building,
  Cake,
  Gift,
  Music,
  Smile,
  Home: HomeIcon,
  ChefHat
};
import { PageHero } from '../components/PageHero';
import { PageHeroData, CateringCategory, getOptimizedImageUrl } from '../types';

interface PrivateProps {
  lang: 'en' | 'pl';
  setActiveTab: (tab: 'home' | 'about' | 'business' | 'private' | 'gallery' | 'contact') => void;
  t: (key: string) => string;
  pageHeroData?: PageHeroData;
  categories?: CateringCategory[];
  onOpenMenuPdf?: (url: string) => void;
}

export default function Private({ lang, setActiveTab, t, pageHeroData, categories, onOpenMenuPdf }: PrivateProps) {
  const shouldReduceMotion = useReducedMotion();
  const isReduced = !!shouldReduceMotion;

  const heroBadge = pageHeroData 
    ? (lang === 'pl' ? pageHeroData.badge_pl : pageHeroData.badge_en) 
    : t('privateBadge');
    
  const heroTitle = pageHeroData 
    ? (lang === 'pl' ? pageHeroData.title_pl : pageHeroData.title_en) 
    : t('privateTitle');

  const heroSubtitle = pageHeroData 
    ? (lang === 'pl' ? pageHeroData.subtitle_pl : pageHeroData.subtitle_en) 
    : t('privateSubtitle');

  const heroBgImage = getOptimizedImageUrl(pageHeroData?.image_url || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=70&w=1200", 1200);

  // Dynamic Icon Resolver
  const getIcon = (name: string) => {
    const IconComponent = IconMap[name];
    return IconComponent || Utensils;
  };

  // Map database categories to UI structure or fall back to static translations
  const items = categories && categories.length > 0 
    ? categories.map(cat => ({
        title: lang === 'pl' ? cat.title_pl : cat.title_en,
        desc: lang === 'pl' ? cat.description_pl : cat.description_en,
        Icon: getIcon(cat.icon_name),
        menuPdfUrl: cat.menu_pdf_url
      }))
    : [
        {
          title: t('privateCat1Title'),
          desc: t('privateCat1Desc'),
          Icon: Users,
        },
        {
          title: t('privateCat2Title'),
          desc: t('privateCat2Desc'),
          Icon: Heart,
        },
        {
          title: t('privateCat3Title'),
          desc: t('privateCat3Desc'),
          Icon: Sparkles,
        },
        {
          title: t('privateCat4Title'),
          desc: t('privateCat4Desc'),
          Icon: Calendar,
        },
      ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden bg-slate-50/50 dark:bg-brand-bg/30">
      <PageHero
        lang={lang}
        badge={heroBadge}
        title={heroTitle}
        subtitle={heroSubtitle}
        bgImage={heroBgImage}
      />

      {/* Grid layout of Private Services */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {items.map((cat, idx) => {
            const Icon = cat.Icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ 
                  y: isReduced ? 0 : -8,
                  borderColor: "rgba(197, 168, 128, 0.4)",
                  boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.05), 0 0 15px rgba(197, 168, 128, 0.05)"
                }}
                className="p-8 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-800 dark:text-blue-400 rounded-none group-hover:bg-[#C5A880] group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-blue-950 dark:text-sky-200 uppercase tracking-wide">
                    {cat.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 font-sans text-sm leading-relaxed">
                    {cat.desc}
                  </p>
                  
                  {cat.menuPdfUrl && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => onOpenMenuPdf?.(cat.menuPdfUrl)}
                        className="px-4 py-2 border border-[#C5A880] hover:bg-[#C5A880]/10 text-[#C5A880] font-mono text-[9px] uppercase font-bold tracking-widest transition-colors cursor-pointer inline-flex items-center space-x-1.5 rounded-none"
                      >
                        <span>{lang === 'pl' ? 'Poznaj naszą ofertę' : 'Explore Our Menu'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="h-0.5 w-0 bg-[#C5A880] group-hover:w-full transition-all duration-300 mt-6" />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Dynamic Call-to-action Footer Banner */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="bg-[#FAF6EE] dark:bg-slate-900/80 border border-[#C5A880]/30 p-8 md:p-12 text-center space-y-6 relative overflow-hidden shadow-[0_15px_35px_-10px_rgba(0,0,0,0.05)]">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#C5A880]/5 via-transparent to-transparent pointer-events-none" />
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#C5A880]/40 pointer-events-none" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C5A880]/40 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#C5A880]/40 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#C5A880]/40 pointer-events-none" />

          <p className="text-slate-700 dark:text-slate-200 font-sans text-base max-w-2xl mx-auto leading-relaxed italic">
            {lang === 'pl' 
              ? 'Wierzymy, że nie ma dwóch takich samych przyjęć. Dlatego każdą ofertę przygotowujemy indywidualnie, tworząc menu dopasowane do charakteru wydarzenia, liczby Gości i Państwa oczekiwań.'
              : 'We believe that no two events are the same. That is why every proposal is prepared individually, with menus tailored to the nature of the occasion, the number of guests, and your expectations.'}
          </p>
          
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-blue-950 dark:text-sky-200 uppercase tracking-wide">
              {lang === 'pl' 
                ? 'Planujesz przyjęcie? Napisz do nas, a z przyjemnością pomożemy Ci stworzyć wyjątkowe spotkanie w greckim i śródziemnomorskim stylu.'
                : 'Planning an event? Write to us, and we will gladly help you create a unique meeting in Greek and Mediterranean style.'}
            </h4>

            <div className="pt-2">
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
                className="px-8 py-3.5 bg-gradient-to-r from-[#C5A880] via-[#E2D1B6] to-[#C5A880] hover:from-[#BCA075] hover:to-[#BCA075] text-[#0A1128] font-sans font-bold tracking-widest text-[11px] uppercase shadow-md transition-all cursor-pointer inline-flex items-center space-x-2"
              >
                <span>{t('btnPlanNow')}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

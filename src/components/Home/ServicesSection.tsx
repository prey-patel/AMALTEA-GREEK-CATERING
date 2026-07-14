import React from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  Award,
  Users,
  Utensils,
  Heart,
  Sparkles,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { CateringCategory } from '../../types';

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  Award,
  Users,
  Utensils,
  Heart,
  Sparkles,
  Calendar
};

interface ServicesSectionProps {
  lang: 'en' | 'pl';
  setActiveTab: (tab: 'home' | 'about' | 'business' | 'private' | 'gallery' | 'contact') => void;
  t: (key: string) => string;
  categories: CateringCategory[];
  isReduced: boolean;
}

export default function ServicesSection({ lang, setActiveTab, t, categories, isReduced }: ServicesSectionProps) {
  const getIcon = (name: string) => {
    const IconComponent = IconMap[name];
    return IconComponent || Utensils;
  };

  const businessCategories = categories?.filter(c => c.page === 'business') || [];
  const privateCategories = categories?.filter(c => c.page === 'private') || [];

  const businessItems = businessCategories.length > 0
    ? businessCategories.map(cat => ({
        title: lang === 'pl' ? cat.title_pl : cat.title_en,
        Icon: getIcon(cat.icon_name)
      }))
    : [
        { title: t('businessCat1Title'), Icon: Briefcase },
        { title: t('businessCat2Title'), Icon: Award },
        { title: t('businessCat3Title'), Icon: Users },
        { title: t('businessCat4Title'), Icon: Utensils }
      ];

  const privateItems = privateCategories.length > 0
    ? privateCategories.map(cat => ({
        title: lang === 'pl' ? cat.title_pl : cat.title_en,
        Icon: getIcon(cat.icon_name)
      }))
    : [
        { title: t('privateCat1Title'), Icon: Users },
        { title: t('privateCat2Title'), Icon: Heart },
        { title: t('privateCat3Title'), Icon: Sparkles },
        { title: t('privateCat4Title'), Icon: Calendar }
      ];

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 overflow-hidden">
      {/* Decorative Symmetrical Faint Olive Branches */}
      <div className="absolute left-[-20px] top-12 w-48 h-auto text-[#C5A880] opacity-[0.06] dark:opacity-[0.04] pointer-events-none select-none z-0 hidden xl:block animate-pulse-slow">
        <svg viewBox="0 0 100 150" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d="M30,150 Q40,80 50,10" />
          <path d="M48,125 C30,120 22,105 32,95 C40,85 46,112 46,112" />
          <path d="M44,95 C62,85 66,70 54,62 C46,55 42,82 42,82" />
          <path d="M40,65 C22,60 14,45 24,35 C32,25 38,52 38,52" />
          <path d="M36,35 C54,25 58,10 46,2 C38,-5 34,22 34,22" />
          <circle cx="32" cy="88" r="3" fill="currentColor" />
          <circle cx="48" cy="58" r="3" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute right-[-20px] top-12 w-48 h-auto text-[#C5A880] opacity-[0.06] dark:opacity-[0.04] pointer-events-none select-none z-0 hidden xl:block animate-pulse-slow transform scale-x-[-1]">
        <svg viewBox="0 0 100 150" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d="M30,150 Q40,80 50,10" />
          <path d="M48,125 C30,120 22,105 32,95 C40,85 46,112 46,112" />
          <path d="M44,95 C62,85 66,70 54,62 C46,55 42,82 42,82" />
          <path d="M40,65 C22,60 14,45 24,35 C32,25 38,52 38,52" />
          <path d="M36,35 C54,25 58,10 46,2 C38,-5 34,22 34,22" />
          <circle cx="32" cy="88" r="3" fill="currentColor" />
          <circle cx="48" cy="58" r="3" fill="currentColor" />
        </svg>
      </div>

      {/* Large faint background watermarks */}
      <div className="absolute left-6 bottom-4 w-72 h-72 text-[#C5A880] opacity-[0.03] pointer-events-none select-none z-0 hidden lg:block">
        <svg viewBox="0 0 150 150" fill="none" stroke="currentColor" strokeWidth="0.3">
          <path d="M0,135 L40,110 L80,102 L110,115 L150,95 L150,150 L0,150 Z" />
          <path d="M0,135 L40,110 L80,102 L110,115 L150,95" />
          <rect x="25" y="65" width="45" height="40" />
          <path d="M40,105 L40,88 A8,8 0 0,1 56,88 L56,105 Z" />
          <rect x="30" y="55" width="35" height="10" />
          <path d="M30,55 C30,32 65,32 65,55 Z" />
          <path d="M47.5,32 L47.5,22 M43,26 L52,26" />
          <path d="M15,95 L15,85 A4,4 0 0,1 23,85 L23,95 Z" />
          <path d="M70,80 L90,80 L90,111 L70,111 Z" />
          <path d="M73,80 C73,68 87,68 87,80 Z" />
        </svg>
      </div>
      <div className="absolute right-6 bottom-4 w-72 h-72 text-[#C5A880] opacity-[0.03] pointer-events-none select-none z-0 hidden lg:block">
        <svg viewBox="0 0 150 200" fill="none" stroke="currentColor" strokeWidth="0.3">
          <path d="M50,180 L100,180 L92,85 L58,85 Z" />
          <path d="M55,85 L75,55 L95,85 Z" />
          <rect x="70" y="110" width="10" height="15" rx="1" />
          <path d="M70,180 L70,155 A5,5 0 0,1 80,155 L80,180 Z" />
          <circle cx="75" cy="73" r="3" />
          <path d="M75,73 L75,10 M75,73 L75,136 M75,73 L20,73 M75,73 L130,73 M75,73 L36,34 M75,73 L114,112 M75,73 L36,112 M75,73 L114,34" />
          <circle cx="75" cy="73" r="45" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* Section Header */}
      <div className="text-center space-y-4 max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-center space-x-3 text-[#C5A880]">
          <div className="h-[0.5px] w-12 bg-gradient-to-r from-transparent to-[#C5A880]/60" />
          <svg className="w-8 h-4 fill-currentColor" viewBox="0 0 24 24">
            <path d="M12 21a9 9 0 0 1-5.65-2.02l.65-.76A8 8 0 0 0 12 20a8 8 0 0 0 7-4.13l.87.5A9 9 0 0 1 12 21zm-7-6.2a8.88 8.88 0 0 1-.5-2.8c0-3 1.8-5.7 4.5-6.83l.38.92A8 8 0 0 0 5.5 12a8 8 0 0 0 .42 2.5l-.92.3zM19 12a8 8 0 0 0-3.88-6.91l.38-.92c2.7 1.13 4.5 3.83 4.5 6.83a8.88 8.88 0 0 1-.5 2.8l-.92-.3a8 8 0 0 0 .42-2.5z" />
          </svg>
          <div className="h-[0.5px] w-12 bg-gradient-to-r from-[#C5A880]/60 to-transparent" />
        </div>
        
        <span className="text-[#C5A880] font-mono text-xs uppercase tracking-widest font-bold block">
          {t('homeServicesBadge')}
        </span>
        
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-blue-950 dark:text-sky-100 font-normal leading-tight uppercase tracking-wide">
          {t('homeServicesTitle')}
        </h2>
        
        <div className="w-12 h-[1px] bg-[#C5A880] mx-auto mt-2" />
        
        <p className="text-slate-600 dark:text-slate-350 font-sans text-sm sm:text-base max-w-3xl mx-auto leading-relaxed pt-2">
          {t('homeServicesSubtitle')}
        </p>
      </div>

      {/* Dual Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10 max-w-7xl mx-auto">
        
        {/* Card 1: Private Catering (Content on Left, Image on Right) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8 }}
          className="bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.04)] rounded-none flex flex-col md:flex-row overflow-hidden relative group transition-all duration-300 hover:shadow-[0_20px_45px_-15px_rgba(197,168,128,0.12)]"
        >
          {/* Content (Left) - order-2 md:order-1 to swap on desktop */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-[#FAF6EE]/20 dark:bg-slate-900/30 order-2 md:order-1">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#C5A880]">
                <svg className="w-6 h-3 fill-currentColor rotate-[-10deg]" viewBox="0 0 24 24">
                  <path d="M12 21a9 9 0 0 1-5.65-2.02l.65-.76A8 8 0 0 0 12 20a8 8 0 0 0 7-4.13l.87.5A9 9 0 0 1 12 21zm-7-6.2a8.88 8.88 0 0 1-.5-2.8c0-3 1.8-5.7 4.5-6.83l.38.92A8 8 0 0 0 5.5 12a8 8 0 0 0 .42 2.5l-.92.3zM19 12a8 8 0 0 0-3.88-6.91l.38-.92c2.7 1.13 4.5 3.83 4.5 6.83a8.88 8.88 0 0 1-.5 2.8l-.92-.3a8 8 0 0 0 .42-2.5z" />
                </svg>
                <div className="h-[0.5px] w-12 bg-[#C5A880]/30" />
              </div>

              <h3 className="font-serif text-2xl font-semibold text-blue-955 dark:text-sky-200 uppercase tracking-wide">
                {t('privateTitle')}
              </h3>

              <div className="flex items-center space-x-3">
                <div className="h-[0.5px] w-6 bg-[#C5A880]/40" />
                <span className="text-[#C5A880] text-[6px]">◆</span>
                <div className="h-[0.5px] w-6 bg-[#C5A880]/40" />
              </div>

              {/* Subcategory Grid */}
              <div className="grid grid-cols-1 gap-y-3.5 pt-2">
                {privateItems.map((sub, sIdx) => {
                  const SubIcon = sub.Icon;
                  return (
                    <div key={sIdx} className="flex items-start space-x-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880] shrink-0 group-hover:bg-[#C5A880] group-hover:text-white group-hover:border-[#C5A880] transition-colors duration-300">
                        <SubIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 pt-1">
                        <span className="text-[10.5px] font-sans font-bold uppercase tracking-wider text-blue-955 dark:text-sky-200 leading-tight block">
                          {sub.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: isReduced ? 1 : 1.02, boxShadow: "0 4px 15px rgba(53, 92, 125, 0.25)" }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setActiveTab('private')}
                className="w-full px-6 py-3.5 bg-blue-800 hover:bg-blue-900 dark:bg-blue-900 dark:hover:bg-blue-950 text-white font-sans font-bold tracking-widest text-[9px] uppercase shadow-md transition-all cursor-pointer inline-flex items-center justify-center space-x-2 border border-[#C5A880]/20 hover:border-[#C5A880]/60"
              >
                <span>{t('explorePrivateBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
              </motion.button>
            </div>
          </div>

          {/* Image (Right) - order-1 md:order-2 to swap on desktop */}
          <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[420px] relative overflow-hidden shrink-0 order-1 md:order-2">
            <img
              src="/private-catering.png"
              alt="Outdoor private candlelit gathering"
              loading="lazy"
              width="600"
              height="450"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </motion.div>

        {/* Card 2: Business Catering (Image on Left, Content on Right) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.04)] rounded-none flex flex-col md:flex-row overflow-hidden relative group transition-all duration-300 hover:shadow-[0_20px_45px_-15px_rgba(197,168,128,0.12)]"
        >
          {/* Image (Left) */}
          <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[420px] relative overflow-hidden shrink-0">
            <img
              src="/business-catering.png"
              alt="Business conference dining hall"
              loading="lazy"
              width="600"
              height="450"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>

          {/* Content (Right) */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-[#FAF6EE]/20 dark:bg-slate-900/30">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#C5A880]">
                <svg className="w-6 h-3 fill-currentColor rotate-[-10deg]" viewBox="0 0 24 24">
                  <path d="M12 21a9 9 0 0 1-5.65-2.02l.65-.76A8 8 0 0 0 12 20a8 8 0 0 0 7-4.13l.87.5A9 9 0 0 1 12 21zm-7-6.2a8.88 8.88 0 0 1-.5-2.8c0-3 1.8-5.7 4.5-6.83l.38.92A8 8 0 0 0 5.5 12a8 8 0 0 0 .42 2.5l-.92.3zM19 12a8 8 0 0 0-3.88-6.91l.38-.92c2.7 1.13 4.5 3.83 4.5 6.83a8.88 8.88 0 0 1-.5 2.8l-.92-.3a8 8 0 0 0 .42-2.5z" />
                </svg>
                <div className="h-[0.5px] w-12 bg-[#C5A880]/30" />
              </div>

              <h3 className="font-serif text-2xl font-semibold text-blue-955 dark:text-sky-200 uppercase tracking-wide">
                {t('businessTitle')}
              </h3>

              <div className="flex items-center space-x-3">
                <div className="h-[0.5px] w-6 bg-[#C5A880]/40" />
                <span className="text-[#C5A880] text-[6px]">◆</span>
                <div className="h-[0.5px] w-6 bg-[#C5A880]/40" />
              </div>

              {/* Subcategory Grid */}
              <div className="grid grid-cols-1 gap-y-3.5 pt-2">
                {businessItems.map((sub, sIdx) => {
                  const SubIcon = sub.Icon;
                  return (
                    <div key={sIdx} className="flex items-start space-x-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880] shrink-0 group-hover:bg-[#C5A880] group-hover:text-white group-hover:border-[#C5A880] transition-colors duration-300">
                        <SubIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 pt-1">
                        <span className="text-[10.5px] font-sans font-bold uppercase tracking-wider text-blue-955 dark:text-sky-200 leading-tight block">
                          {sub.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: isReduced ? 1 : 1.02, boxShadow: "0 4px 15px rgba(53, 92, 125, 0.25)" }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setActiveTab('business')}
                className="w-full px-6 py-3.5 bg-blue-800 hover:bg-blue-900 dark:bg-blue-900 dark:hover:bg-blue-950 text-white font-sans font-bold tracking-widest text-[9px] uppercase shadow-md transition-all cursor-pointer inline-flex items-center justify-center space-x-2 border border-[#C5A880]/20 hover:border-[#C5A880]/60"
              >
                <span>{t('exploreBusinessBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { RESTAURANTS, RestaurantInfo, PageHeroData, getOptimizedImageUrl } from '../types';
import { RESTAURANTS_PL } from '../translations';
import { PageHero } from '../components/PageHero';

interface AboutProps {
  lang: 'en' | 'pl';
  setActiveTab: (tab: 'home' | 'about' | 'business' | 'private' | 'gallery' | 'contact') => void;
  t: (key: string) => string;
  pageHeroData?: PageHeroData;
}


// Letter-by-letter split text with interactive spring-based hover bounces
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
      translate="no"
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
                color: "#fbbf24",
                textShadow: "0 0 14px rgba(251, 191, 36, 0.85)"
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

// Word-by-word staggered reveal component for paragraph texts
function FadeInWords({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(' ');
  
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.025,
        delayChildren: delay
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.55, ease: "easeOut" } 
    }
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={`inline-block ${className}`}
    >
      {words.map((word, idx) => (
        <motion.span key={idx} variants={item} className="inline-block mr-[0.22em]">
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}


// 4-layered 3D holographic parallax card
function InteractiveCulinaryImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Background frame and card parallax offset shifts
  const frameY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Relative mouse position
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    // Tilt calculations (max 14 degrees)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;
    setTilt({
      x: -mouseY * 14,
      y: mouseX * 14
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
    <div ref={containerRef} className="relative w-full max-w-[450px] aspect-[2/3] mx-auto flex items-center justify-center p-4">
      {/* Layer 1 (Backplane, Z=-20px): Golden outline key pattern frame */}
      <motion.div 
        style={{ y: frameY, transform: 'translateZ(-20px)' }}
        className="absolute w-[94%] h-[94%] border-4 border-amber-500/25 rounded-lg top-0 left-0 pointer-events-none z-0 transform-gpu"
      >
        <div className="absolute inset-2 border border-amber-500/10" />
      </motion.div>

      {/* Main image card with 3D Tilt on hover */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: isHovered ? 1.03 : 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        style={{ transformStyle: 'preserve-3d', y: imgY, perspective: "1000px" }}
        className="relative w-full h-full bg-slate-900 overflow-hidden shadow-2xl rounded-lg border border-slate-200/20 dark:border-slate-800/20 z-10 cursor-pointer transform-gpu"
      >
        {/* Layer 2 (Base, Z=0px): Main Catering image */}
        <img
          src="/culinary-odyssey.jpg"
          alt="Elegant Polish catering setup"
          loading="lazy"
          width="579"
          height="868"
          className="w-full h-full object-cover select-none pointer-events-none transform-gpu"
          style={{ transform: 'translateZ(0px) scale(1.05)' }}
        />

        {/* Layer 3 (Overlay, Z=30px): Meander pattern overlay */}
        <div 
          className="absolute inset-0 border border-amber-500/20 pointer-events-none z-20 transform-gpu"
          style={{ transform: 'translateZ(30px) scale(0.95)' }}
        />

        {/* Layer 4 (Front Glass, Z=50px): Refractive Light Glare Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 holo-glare transform-gpu"
          style={{
            transform: 'translateZ(50px)',
            opacity: isHovered ? 1 : 0,
            '--mouse-x': `${coords.x}px`,
            '--mouse-y': `${coords.y}px`
          } as React.CSSProperties}
        />
      </motion.div>
    </div>
  );
}

// Self-drawing vertical/horizontal meander divider linked to scroll depth
function ScrollingMeanderDivider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const pathLength = useTransform(scrollYProgress, [0.15, 0.75], [0, 1]);

  return (
    <div ref={containerRef} className="w-full flex justify-center py-10 relative z-10">
      <svg viewBox="0 0 500 40" className="w-full max-w-2xl text-amber-500/20 dark:text-amber-500/10">
        <motion.path
          style={{ pathLength }}
          d="M 10 20 L 40 20 L 40 5 L 60 5 L 60 35 L 80 35 L 80 20 L 120 20 L 120 5 L 140 5 L 140 35 L 160 35 L 160 20 L 200 20 L 200 5 L 220 5 L 220 35 L 240 35 L 240 20 L 280 20 L 280 5 L 300 5 L 300 35 L 320 35 L 320 20 L 360 20 L 360 5 L 380 5 L 380 35 L 400 35 L 400 20 L 440 20 L 440 5 L 460 5 L 460 35 L 480 35 L 480 20 L 490 20"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// Overhauled Restaurant Spotlight card
const RestaurantCard: React.FC<{ rest: RestaurantInfo; idx: number; lang: 'en' | 'pl' }> = ({ rest, idx, lang }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    
    // Spotlight coordinates tracking
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    // 3D Tilt calculation (max 9 degrees)
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: -mouseY * 9,
      y: mouseX * 9
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: idx * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: isHovered ? 1.03 : 1 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden flex flex-col justify-between h-full cursor-pointer hover:shadow-2xl rounded-lg transform-gpu transition-all duration-300 group"
    >
      {/* Glare overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 holo-glare transform-gpu"
        style={{
          transform: 'translateZ(40px)',
          opacity: isHovered ? 1 : 0,
          '--mouse-x': `${coords.x}px`,
          '--mouse-y': `${coords.y}px`
        } as React.CSSProperties}
      />

      {/* SVG Self-Drawing Border Gradient */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 rounded-lg">
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="none"
          stroke="url(#overload-gold-blue-gradient)"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isHovered ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="overload-gold-blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative h-60 overflow-hidden" style={{ transform: 'translateZ(10px)' }}>
        {/* Desaturated image to full color + zoom on hover */}
        <motion.img
          src={rest.image}
          alt={rest.name}
          animate={{
            scale: isHovered ? 1.08 : 1,
            filter: isHovered ? "grayscale(0%) sepia(0%) brightness(1.02)" : "grayscale(40%) sepia(18%) brightness(0.9)"
          }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover transform-gpu"
        />

        {/* Floating Lens Flare Glow overlay */}
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-amber-400/25 blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-700 z-10" />
      </div>

      <div className="p-6 flex-grow space-y-3 relative z-10" style={{ transform: 'translateZ(25px)' }}>
        <h3 className="font-serif text-2xl font-bold text-blue-950 dark:text-slate-100 uppercase tracking-wide group-hover:text-amber-600 dark:group-hover:text-amber-550 transition-colors duration-300">
          {rest.name}
        </h3>
        <span className="block italic text-xs text-sky-600 dark:text-sky-400 font-medium font-sans">{rest.slogan}</span>
        {rest.description && (
          <p className="text-slate-600 dark:text-slate-400 font-sans text-xs leading-relaxed pt-2">{rest.description}</p>
        )}
        
        {/* Address, website, and Est. display */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4 space-y-2.5 text-xs">
          {/* Address */}
          <div className="flex items-start space-x-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
              {lang === 'pl' ? 'Adres:' : 'Address:'}
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rest.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-sky-450 hover:underline transition-colors leading-relaxed text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {rest.address}
            </a>
          </div>
          
          {/* Website */}
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">
              {lang === 'pl' ? 'Strona:' : 'Website:'}
            </span>
            <a
              href={rest.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 dark:text-sky-400 hover:text-blue-900 dark:hover:text-sky-300 hover:underline transition-colors font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              {rest.id === 'el-greco' ? 'elgreco-restauracja.pl' : `${rest.id}-restauracja.pl`}
            </a>
          </div>


        </div>
      </div>
    </motion.div>
  );
};

export default function About({ lang, setActiveTab: _setActiveTab, t, pageHeroData }: AboutProps) {
  const listRestaurants = lang === 'en' ? RESTAURANTS : RESTAURANTS_PL;

  const heroBadge = pageHeroData 
    ? (lang === 'pl' ? pageHeroData.badge_pl : pageHeroData.badge_en) 
    : (lang === 'pl' ? 'Grecka Gościnność' : 'Greek Hospitality');
    
  const heroTitle = pageHeroData 
    ? (lang === 'pl' ? pageHeroData.title_pl : pageHeroData.title_en) 
    : (lang === 'pl' ? 'O Nas' : 'About Us');

  const heroSubtitle = pageHeroData 
    ? (lang === 'pl' ? pageHeroData.subtitle_pl : pageHeroData.subtitle_en) 
    : (lang === 'pl' ? 'Od uznanych warszawskich restauracji po Twoje wyjątkowe bankiety' : 'From Our Warsaw Restaurants to Your Exquisite Event');

  const heroBgImage = getOptimizedImageUrl(pageHeroData?.image_url || "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=70&w=1200", 1200);

  return (
    <div className="space-y-20 pb-20 select-text overflow-hidden">
      <PageHero
        lang={lang}
        badge={heroBadge}
        title={heroTitle}
        subtitle={heroSubtitle}
        bgImage={heroBgImage}
        bgAlt="Greece panorama"
      />

      {/* Greek Culinary Family in Warsaw section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <InteractiveCulinaryImage />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-blue-700 dark:text-sky-400 font-mono text-xs uppercase tracking-widest font-bold block">
                Kalimera!
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-blue-950 dark:text-slate-100 font-bold uppercase leading-tight">
                <SplitText text={lang === 'pl' ? 'Grecka Rodzina Kulinarna' : 'A Greek Culinary Family'} delay={0.1} />
              </h2>
            </div>

            <div className="space-y-4 text-slate-700 dark:text-slate-350 font-sans text-base leading-relaxed">
              <p>
                <FadeInWords 
                  delay={0.1}
                  text={lang === 'pl'
                    ? 'Amaltea Catering powstało z doświadczenia i pasji, które od lat tworzą restauracje El Greco, Paros oraz Mykonos — miejsca znane z autentycznej greckiej kuchni, śródziemnomorskiej atmosfery i wyjątkowej gościnności. To naturalne rozwinięcie historii naszych restauracji, dzięki któremu możemy towarzyszyć naszym Gościom również podczas spotkań rodzinnych, wydarzeń firmowych i wyjątkowych okazji poza restauracją.'
                    : 'Amaltea Catering was born from the experience and passion that have shaped El Greco, Paros and Mykonos restaurants for many years — places renowned for their authentic Greek cuisine, Mediterranean atmosphere and warm hospitality. It is a natural extension of our restaurants\' story, allowing us to accompany our guests not only within our restaurants, but also during family gatherings, corporate events and special occasions.'}
                />
              </p>
              <p>
                <FadeInWords 
                  delay={0.2}
                  text={lang === 'pl'
                    ? 'Nad konceptem i smakiem Amaltea Catering czuwa szef kuchni Theodoros Vogdanou, od lat związany z tworzeniem menu naszych restauracji. To właśnie jego podejście do kuchni — oparte na jakości produktów, dbałości o detale i autentycznych śródziemnomorskich smakach — stało się fundamentem Amaltea Catering.'
                    : 'The concept and flavours of Amaltea Catering are overseen by Chef Theodoros Vogdanou, who has been creating the menus of our restaurants for many years. His approach to cooking — rooted in quality ingredients, attention to detail and authentic Mediterranean flavours — has become the foundation of Amaltea Catering.'}
                />
              </p>
              <p>
                <FadeInWords 
                  delay={0.3}
                  text={lang === 'pl'
                    ? 'Tworzymy catering inspirowany grecką filozofią wspólnego stołu i radością dzielenia się jedzeniem. W naszej kuchni wykorzystujemy starannie wyselekcjonowane produkty sprowadzane bezpośrednio z Grecji — od aromatycznej oliwy z oliwek i serów, po regionalne specjały i tradycyjne składniki, które nadają naszym potrawom ich autentyczny charakter.'
                    : 'We create catering inspired by the Greek philosophy of the shared table and the joy of sharing food. Our cuisine is based on carefully selected ingredients sourced directly from Greece — from aromatic olive oils and cheeses to regional delicacies and traditional products that give our dishes their authentic character.'}
                />
              </p>
              <p>
                <FadeInWords 
                  delay={0.4}
                  text={lang === 'pl'
                    ? 'Wierzymy, że jedzenie to coś więcej niż tylko posiłek. W Grecji wspólne biesiadowanie jest sposobem na celebrowanie chwil spędzanych razem i czerpanie radości z bycia w gronie najbliższych. To właśnie ta filozofia stanowi serce każdego wydarzenia, które przygotowujemy.'
                    : 'We believe that food is much more than simply a meal. In Greece, gathering around the table is a way of celebrating time spent together and enjoying the company of family and friends. This philosophy lies at the heart of every event we create.'}
                />
              </p>
              <p>
                <FadeInWords 
                  delay={0.5}
                  text={lang === 'pl'
                    ? 'Amaltea Catering to możliwość przeniesienia atmosfery naszych restauracji tam, gdzie jej potrzebujesz. Niezależnie od tego, czy organizujesz kameralne spotkanie rodzinne, wydarzenie biznesowe czy wyjątkową uroczystość, tworzymy doświadczenia, które pozwalają poczuć prawdziwego ducha Grecji.'
                    : 'Amaltea Catering brings the atmosphere of our restaurants wherever you need it. Whether you are planning an intimate family gathering, a business event or a special celebration, we create experiences that allow you to discover the true spirit of Greece.'}
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Self-drawing meander divider */}
      <ScrollingMeanderDivider />

      {/* The Three Warsaw Sister Restaurants Cards */}
      <section className="bg-slate-100 dark:bg-slate-950/60 border-y border-slate-200/50 dark:border-slate-800/40 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center space-y-2">
            <span className="text-blue-700 dark:text-sky-400 font-mono text-xs uppercase tracking-widest font-bold">
              {t('sisterTavernsTitle')}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-blue-950 dark:text-slate-100 uppercase">
              {t('sisterTavernsSubtitle')}
            </h2>
            <div className="w-16 h-1 bg-blue-700 dark:bg-sky-400 mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {listRestaurants.map((rest, idx) => (
              <RestaurantCard key={rest.id} rest={rest} idx={idx} lang={lang} />
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}

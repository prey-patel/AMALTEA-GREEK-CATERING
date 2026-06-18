/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Utensils, ChefHat, Sparkles, Heart } from 'lucide-react';

interface CoreValuesProps {
  lang: 'en' | 'pl';
  isReduced: boolean;
}

export default function CoreValues({ lang, isReduced }: CoreValuesProps) {
  const gridContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.6, rotate: -15, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const descVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const values = [
    {
      title: lang === 'pl' ? 'Autentyczne smaki Grecji' : 'Authentic Flavours of Greece',
      desc: lang === 'pl'
        ? 'Tradycyjne receptury oraz starannie wyselekcjonowane, oryginalne produkty sprowadzane bezpośrednio z Grecji pozwalają nam odkrywać przed Państwem bogactwo smaków greckiej i śródziemnomorskiej kuchni. Od aromatycznej oliwy z oliwek i serów po starannie dobrane przyprawy i produkty regionalne – stawiamy na autentyczność i najwyższą jakość.'
        : 'Traditional recipes and carefully selected ingredients sourced directly from Greece allow us to bring the rich flavours and authentic character of Greek and Mediterranean cuisine to your table. From aromatic olive oils and cheeses to carefully chosen herbs and regional delicacies, we are committed to authenticity and exceptional quality.',
    },
    {
      title: lang === 'pl' ? 'Doświadczenie i pasja' : 'Experience and Passion',
      desc: lang === 'pl'
        ? 'Czerpiąc z wieloletniego doświadczenia restauracji El Greco, Paros i Mykonos, tworzymy wydarzenia inspirowane grecką kulturą wspólnego biesiadowania, dzielenia się jedzeniem oraz celebrowania chwil spędzanych razem.'
        : 'Drawing on the many years of experience of El Greco, Paros and Mykonos restaurants, we create events inspired by the Greek culture of gathering around the table, sharing food and celebrating moments spent together.',
    },
    {
      title: lang === 'pl' ? 'Indywidualne podejście' : 'Personalised Approach',
      desc: lang === 'pl'
        ? 'Każde menu i każdą realizację przygotowujemy z myślą o charakterze wydarzenia oraz oczekiwaniach naszych Gości, dbając o każdy detal i wyjątkową atmosferę spotkania.'
        : 'Every menu and every event is thoughtfully tailored to reflect the character of the occasion and the expectations of our guests, with meticulous attention to detail and a commitment to creating a truly special atmosphere.',
    },
    {
      title: lang === 'pl' ? 'Grecka filozofia wspólnego stołu' : 'The Greek Philosophy of the Shared Table',
      desc: lang === 'pl'
        ? 'Wierzymy, że najlepsze chwile rodzą się przy wspólnym stole. Inspirowani grecką tradycją dzielenia się jedzeniem i celebrowania czasu spędzanego razem, tworzymy atmosferę, dzięki której każde spotkanie staje się niezapomnianym doświadczeniem.'
        : 'We believe that life\'s finest moments are created around the table. Inspired by the Greek tradition of sharing food and celebrating time together, we create an atmosphere in which every gathering becomes a memorable experience.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={gridContainerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {values.map((it, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={{ 
              y: isReduced ? 0 : -8, 
              borderColor: "rgba(197, 168, 128, 0.4)", 
              boxShadow: "0 15px 30px -10px rgba(53, 92, 125, 0.12), 0 0 15px rgba(197, 168, 128, 0.05)"
            }}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 relative group flex flex-col justify-between rounded-none select-text"
          >
            <div className="space-y-4">
              <motion.div 
                variants={iconVariants}
                whileHover={{ scale: 1.12, rotate: [0, -10, 10, 0] }}
                transition={{ type: "spring", stiffness: 350, damping: 10 }}
                className="w-12 h-12 bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-700 dark:text-sky-400 rounded-none group-hover:bg-[#355C7D] dark:group-hover:bg-[#5faadc] group-hover:text-white transition-all duration-300"
              >
                {idx === 0 && <Utensils className="w-5 h-5" />}
                {idx === 1 && <ChefHat className="w-5 h-5" />}
                {idx === 2 && <Sparkles className="w-5 h-5" />}
                {idx === 3 && <Heart className="w-5 h-5" />}
              </motion.div>
              
              <motion.h2 
                variants={titleVariants}
                className="font-serif text-lg font-semibold text-blue-955 dark:text-sky-200 uppercase tracking-wide group-hover:text-[#C5A880] transition-colors duration-300"
              >
                {it.title}
              </motion.h2>
              
              <motion.p 
                variants={descVariants}
                className="text-slate-500 dark:text-slate-400 font-sans text-xs sm:text-sm leading-relaxed transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-200 font-light"
              >
                {it.desc}
              </motion.p>
            </div>
            
            <div className="h-0.5 w-0 bg-[#C5A880] group-hover:w-full transition-all duration-500 mt-6" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

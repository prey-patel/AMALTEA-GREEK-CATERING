/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface RestaurantsSectionProps {
  lang: 'en' | 'pl';
  isReduced: boolean;
}

export default function RestaurantsSection({ lang, isReduced }: RestaurantsSectionProps) {
  const restaurants = [
    {
      name: 'Paros',
      logo: '/logo-paros.webp',
      url: 'https://paros-restauracja.pl/',
      watermark: (
        <svg 
          viewBox="0 0 150 150" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.4" 
          className="absolute bottom-2 left-2 w-32 h-32 text-[#355C7D] dark:text-[#C5A880] opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none select-none z-0"
        >
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
      )
    },
    {
      name: 'El Greco',
      logo: '/logo-el-greco.png',
      url: 'https://elgreco-restauracja.pl/en/home/',
      watermark: (
        <svg 
          viewBox="0 0 150 200" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.4" 
          className="absolute bottom-4 right-2 w-28 h-48 text-[#355C7D] dark:text-[#C5A880] opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none select-none z-0"
        >
          <path d="M90,185 L145,185 M95,185 L95,180 L140,180 L140,185 M100,180 L100,65 L135,65 L135,180" />
          <path d="M107,180 L107,65 M117,180 L117,65 M128,180 L128,65" />
          <path d="M100,65 L135,65 M95,60 L140,60 M98,60 C90,60 90,50 98,50 L137,50 C145,50 145,60 137,60" />
          <circle cx="98" cy="55" r="2" />
          <circle cx="137" cy="55" r="2" />
          <path d="M90,45 L145,45 L117.5,25 Z" />
          <path d="M10,25 Q35,45 55,75" />
          <path d="M15,30 Q30,22 35,32 Q25,38 15,30 Z" />
          <path d="M25,40 Q40,32 42,42 Q32,48 25,40 Z" />
          <path d="M35,53 Q50,45 50,55 Q40,60 35,53 Z" />
          <path d="M42,67 Q57,62 55,72 Q45,75 42,67 Z" />
        </svg>
      )
    },
    {
      name: 'Mykonos',
      logo: '/logo-mykonos.png',
      url: 'https://mykonos-restauracja.pl/',
      watermark: (
        <svg 
          viewBox="0 0 150 200" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.4" 
          className="absolute bottom-4 right-2 w-36 h-48 text-[#355C7D] dark:text-[#C5A880] opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none select-none z-0"
        >
          <path d="M50,180 L100,180 L92,85 L58,85 Z" />
          <path d="M55,85 L75,55 L95,85 Z" />
          <rect x="70" y="110" width="10" height="15" rx="1" />
          <path d="M70,180 L70,155 A5,5 0 0,1 80,155 L80,180 Z" />
          <circle cx="75" cy="73" r="3" />
          <path d="M75,73 L75,10 M75,73 L75,136 M75,73 L20,73 M75,73 L130,73 M75,73 L36,34 M75,73 L114,112 M75,73 L36,112 M75,73 L114,34" />
          <circle cx="75" cy="73" r="45" strokeDasharray="3 3" />
          <path d="M75,10 L63,30 L75,30 M75,136 L87,116 L75,116 M20,73 L40,61 L40,73 M130,73 L110,85 L110,73" />
          <path d="M36,34 L53,42 L47,48 M114,112 L97,104 L103,98" />
          <path d="M36,112 L48,95 L42,89 M114,34 L102,51 L108,57" />
        </svg>
      )
    }
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center space-y-2 mb-12">
        <span className="text-[#355C7D] dark:text-sky-400 font-mono text-[10px] uppercase tracking-[0.25em] font-bold block">
          {lang === 'pl' ? 'Odwiedź Nasze Restauracje' : 'Visit Our Restaurants'}
        </span>
        <h3 className="font-serif text-xl sm:text-2xl text-slate-800 dark:text-slate-200 font-light mt-1">
          {lang === 'pl' ? 'Kolebka Naszych Kulinarnych Inspiracji' : 'The Cradle of Our Culinary Inspiration'}
        </h3>
        <div className="w-16 h-[0.5px] bg-[#C5A880] mx-auto mt-3" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto items-center justify-items-center px-4">
        {restaurants.map((item) => (
          <motion.a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ 
              y: isReduced ? 0 : -10
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[280px] aspect-[3/4] bg-gradient-to-b from-[#edf3f7] via-[#f5f9fc] to-[#d3e3f0] dark:from-[#111A24] dark:to-[#090F16] border border-[#C5A880]/20 dark:border-slate-800 rounded-none flex flex-col items-center justify-center p-8 transition-all duration-500 group overflow-hidden relative cursor-pointer shadow-[0_15px_35px_-10px_rgba(53,92,125,0.08)] dark:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.45)] hover:shadow-[0_25px_50px_-15px_rgba(53,92,125,0.22)] dark:hover:shadow-[0_25px_50px_-15px_rgba(53,92,125,0.12)]"
          >
            {/* Premium gold glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#C5A880]/3 via-transparent to-[#C5A880]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
            
            {/* Ambient gold radial spotlight */}
            <div className="absolute w-32 h-32 rounded-full bg-[#C5A880]/5 blur-2xl group-hover:bg-[#C5A880]/15 group-hover:scale-150 transition-all duration-700 z-0 pointer-events-none" />

            {/* SVG Double Scalloped Gold Frame */}
            <svg 
              className="absolute inset-3.5 w-[calc(100%-28px)] h-[calc(100%-28px)] text-[#C5A880]/40 dark:text-[#C5A880]/30 group-hover:text-[#C5A880] transition-colors duration-500 pointer-events-none z-10" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              <rect x="1" y="1" width="98" height="98" fill="none" stroke="currentColor" strokeWidth="0.4" />
              <path 
                d="M 7.5 3.5 L 92.5 3.5 A 4 4 0 0 0 96.5 7.5 L 96.5 92.5 A 4 4 0 0 0 92.5 96.5 L 7.5 96.5 A 4 4 0 0 0 3.5 92.5 L 3.5 7.5 A 4 4 0 0 0 7.5 3.5 Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.4" 
              />
            </svg>

            {item.watermark}
            
            <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
              <img
                src={item.logo}
                alt={`${item.name} Logo`}
                width="200"
                height="80"
                loading="lazy"
                className="restaurant-logo max-h-20 max-w-full object-contain pointer-events-none z-10"
              />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

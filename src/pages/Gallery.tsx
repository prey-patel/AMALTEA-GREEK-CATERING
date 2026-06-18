/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BlurImage } from '../components/BlurImage';
import { GALLERY_ITEMS, PageHeroData, getOptimizedImageUrl, GalleryItem } from '../types';
import { GALLERY_ITEMS_PL } from '../translations';
import { PageHero } from '../components/PageHero';
import { supabase } from '../lib/supabase';

interface GalleryProps {
  lang: 'en' | 'pl';
  t: (key: string) => string;
  pageHeroData?: PageHeroData;
}

export default function Gallery({ lang, t, pageHeroData }: GalleryProps) {
  const [galleryLimit, setGalleryLimit] = useState<number>(8);
  const [dbGalleryItems, setDbGalleryItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    async function loadGallery() {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setDbGalleryItems(data || []);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      }
    }
    loadGallery();
  }, []);

  const listGalleryItems = dbGalleryItems.length > 0 
    ? dbGalleryItems 
    : (lang === 'en' ? GALLERY_ITEMS : GALLERY_ITEMS_PL);

  // Limited visible gallery list
  const visibleGalleryItems = listGalleryItems.slice(0, galleryLimit);

  const heroBadge = pageHeroData 
    ? (lang === 'pl' ? pageHeroData.badge_pl : pageHeroData.badge_en) 
    : (lang === 'pl' ? 'Aranżacje Tworzone z Pasją' : 'Moments Crafted With Care');
    
  const heroTitle = pageHeroData 
    ? (lang === 'pl' ? pageHeroData.title_pl : pageHeroData.title_en) 
    : (lang === 'pl' ? 'Galeria' : 'Gallery');

  const heroSubtitle = pageHeroData 
    ? (lang === 'pl' ? pageHeroData.subtitle_pl : pageHeroData.subtitle_en) 
    : (lang === 'pl' ? 'Prawdziwa Grecka Gościnność w Kadrze' : 'Of Traditional Greek Hospitality');

  const heroBgImage = getOptimizedImageUrl(pageHeroData?.image_url || "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=70&w=1200", 1200);

  return (
    <div className="space-y-16 pb-20">
      <PageHero
        lang={lang}
        badge={heroBadge}
        title={heroTitle}
        subtitle={heroSubtitle}
        bgImage={heroBgImage}
        bgAlt="Greece beautiful look"
      />

      {/* Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Mosaic Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleGalleryItems.map((item) => {
              return (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group relative h-72 bg-slate-100 border border-slate-200 overflow-hidden"
                >
                  <BlurImage
                    src={getOptimizedImageUrl(item.image_url || item.url, 400)}
                    alt={item.title}
                    width="400"
                    height="288"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Minimal hover caption */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="block font-serif text-sm font-semibold text-white uppercase tracking-wide">
                      {item.title}
                    </span>
                    <span className="block text-[10px] text-sky-300 font-mono uppercase tracking-widest mt-1">
                      {item.category}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Load More Button or Complete Note */}
        {listGalleryItems.length > galleryLimit ? (
          <div className="flex justify-center pt-6">
            <button
              type="button"
              onClick={() => setGalleryLimit((prev) => prev + 4)}
              className="px-8 py-3.5 bg-blue-800 hover:bg-blue-950 text-white rounded-none uppercase font-mono font-bold tracking-widest text-xs shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:translate-y-[-1px]"
            >
              {t('galleryLoadMore')}
            </button>
          </div>
        ) : listGalleryItems.length > 8 ? (
          <div className="flex justify-center pt-6">
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-100 px-4 py-2 border border-slate-200/50">
              ✔ {t('galleryNoMore')}
            </span>
          </div>
        ) : null}
      </section>
    </div>
  );
}

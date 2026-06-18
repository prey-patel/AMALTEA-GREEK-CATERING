/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, X, Menu as Hamburger } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface HeaderProps {
  lang: 'en' | 'pl';
  setLang: (lang: 'en' | 'pl') => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  activeTab: 'home' | 'about' | 'business' | 'private' | 'gallery' | 'contact';
  setActiveTab: (tab: 'home' | 'about' | 'business' | 'private' | 'gallery' | 'contact') => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  t: (key: string) => string;
}



export function Header({
  lang,
  setLang,
  theme,
  setTheme,
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  t,
}: HeaderProps) {
  const mobileMenuRef = useFocusTrap({
    isActive: mobileMenuOpen,
    onClose: () => setMobileMenuOpen(false)
  });

  const navMenuItems: { key: 'home' | 'about' | 'business' | 'private' | 'gallery' | 'contact'; label: string }[] = [
    { key: 'home', label: t('navHome') },
    { key: 'about', label: t('navAbout') },
    { key: 'business', label: t('navBusiness') },
    { key: 'private', label: t('navPrivate') },
    { key: 'gallery', label: t('navGallery') },
    { key: 'contact', label: t('navContact') },
  ];

  return (
    <div className="sticky top-0 w-full z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
      
      {/* Full-Width Header Container */}
      <header className="relative w-full h-20 flex items-center">
        
        {/* Centered Navigation Content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between w-full z-10">
          
          {/* Logo brand section wrapped in md:flex-1 to center nav menu */}
          <div className="md:flex-1 flex justify-start z-10 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="flex items-center cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 dark:focus-visible:ring-sky-400 rounded-md"
            >
              <img
                src="/logo.webp"
                alt="AMALTEA GREEK CATERING"
                width="1254"
                height="1254"
                style={{ height: '3.5rem', width: '3.5rem' }}
                className="h-14 w-14 sm:h-16 sm:w-16 object-contain dark:brightness-110"
              />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:block z-10" aria-label="Main Navigation">
            <ul className="flex items-center space-x-6 lg:space-x-8">
              {navMenuItems.map((item) => {
                const active = activeTab === item.key;
                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(item.key)}
                      className={`relative py-2.5 flex flex-col items-center justify-center text-xs uppercase tracking-[0.2em] font-medium cursor-pointer transition-all duration-300 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 dark:focus-visible:ring-sky-400 rounded-sm ${
                        active
                          ? 'text-[#355C7D] dark:text-blue-200 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-[#355C7D] dark:hover:text-blue-300'
                      }`}
                    >
                      <span>{item.label}</span>

                      {/* Active bottom underline */}
                      {active && (
                        <motion.span
                          layoutId="activeTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#355C7D] dark:bg-blue-300"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Action buttons wrapped in md:flex-1 to center nav menu */}
          <div className="hidden md:flex md:flex-1 items-center justify-end space-x-4 z-10">
            
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-[#FAF8F5]/80 dark:bg-[#080D1A]/80 hover:bg-[#FAF8F5] dark:hover:bg-[#080D1A] flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 dark:focus-visible:ring-sky-400"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-4.5 h-4.5 text-[#355C7D]" />
              ) : (
                <Sun className="w-4.5 h-4.5 text-amber-400" />
              )}
            </button>

            {/* Language Switcher Pill */}
            <div className="relative flex items-center border border-slate-200 dark:border-slate-800 rounded-full p-1 bg-[#FAF8F5]/80 dark:bg-[#080D1A]/80 shadow-sm w-24 h-10 overflow-hidden" role="group" aria-label="Language selection">
              <button
                type="button"
                onClick={() => setLang('en')}
                aria-label="Switch language to English"
                aria-pressed={lang === 'en'}
                className={`flex-1 text-center text-[10px] font-mono font-bold transition-all duration-300 z-20 cursor-pointer select-none uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 dark:focus-visible:ring-sky-400 rounded-sm ${
                  lang === 'en' ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('pl')}
                aria-label="Switch language to Polish"
                aria-pressed={lang === 'pl'}
                className={`flex-1 text-center text-[10px] font-mono font-bold transition-all duration-300 z-20 cursor-pointer select-none uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 dark:focus-visible:ring-sky-400 rounded-sm ${
                  lang === 'pl' ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                PL
              </button>
              {/* Sliding background pill */}
              <motion.div
                className="absolute top-1 bottom-1 rounded-full bg-[#355C7D]"
                initial={false}
                animate={{
                  left: lang === 'en' ? '4px' : '48px',
                  right: lang === 'en' ? '48px' : '4px',
                }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
              />
            </div>
          </div>

          {/* Mobile hamburger menu controls */}
          <div className="flex items-center space-x-2.5 md:hidden z-10">
            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-9 h-9 rounded-full border border-[#C5A880] dark:border-[#9A7B56] bg-[#FAF8F5]/80 dark:bg-[#080D1A]/80 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 dark:focus-visible:ring-sky-400"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-blue-900" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-700 dark:text-slate-300 hover:text-blue-900 dark:hover:text-blue-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 dark:focus-visible:ring-sky-400 rounded-sm"
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Hamburger className="w-5.5 h-5.5" />}
            </button>
          </div>

        </div>
      </header>      {/* Full-Width Mobile Menu Drop-down Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-menu"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-20 left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden md:hidden z-30"
          >
            <div className="relative px-6 py-6 space-y-4 flex flex-col">
              <nav aria-label="Mobile Navigation">
                <ul className="flex flex-col space-y-4">
                  {navMenuItems.map((item) => (
                    <li key={item.key}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab(item.key);
                          setMobileMenuOpen(false);
                        }}
                        className={`py-1.5 text-left text-xs uppercase tracking-[0.2em] font-semibold z-10 transition-colors block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 dark:focus-visible:ring-sky-400 rounded-sm ${
                          activeTab === item.key
                            ? 'text-[#355C7D] dark:text-blue-200 font-bold border-b border-[#355C7D] w-fit'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Language Selector for mobile drawer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 z-10 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                    Language / Język
                  </span>

                  {/* Language switch */}
                  <div className="relative flex items-center border border-slate-200 dark:border-slate-800 rounded-full p-0.5 bg-slate-50 dark:bg-slate-900 w-22 h-8 overflow-hidden" role="group" aria-label="Language selection">
                    <button
                      type="button"
                      onClick={() => setLang('en')}
                      aria-label="Switch language to English"
                      aria-pressed={lang === 'en'}
                      className={`flex-1 text-center text-[9px] font-mono font-bold transition-all duration-300 z-20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 dark:focus-visible:ring-sky-400 rounded-sm ${
                        lang === 'en' ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang('pl')}
                      aria-label="Switch language to Polish"
                      aria-pressed={lang === 'pl'}
                      className={`flex-1 text-center text-[9px] font-mono font-bold transition-all duration-300 z-20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 dark:focus-visible:ring-sky-400 rounded-sm ${
                        lang === 'pl' ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      PL
                    </button>
                    <motion.div
                      className="absolute top-0.5 bottom-0.5 rounded-full bg-[#355C7D]"
                      initial={false}
                      animate={{
                        left: lang === 'en' ? '2px' : '42px',
                        right: lang === 'en' ? '42px' : '2px',
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

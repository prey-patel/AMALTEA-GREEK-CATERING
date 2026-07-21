/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';

import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import Home from './pages/Home';
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

const About = lazyWithRetry(() => import('./pages/About'));
const Business = lazyWithRetry(() => import('./pages/Business'));
const Private = lazyWithRetry(() => import('./pages/Private'));
const Gallery = lazyWithRetry(() => import('./pages/Gallery'));
const Contact = lazyWithRetry(() => import('./pages/Contact'));
const AdminLogin = lazyWithRetry(() => import('./components/Admin/AdminLogin'));
const AdminGallery = lazyWithRetry(() => import('./components/Admin/AdminGallery'));
const AdminSettings = lazyWithRetry(() => import('./components/Admin/AdminSettings'));
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

import { PageTransition } from './components/PageTransition';
import { InquiryFormData, PageHeroData, CateringCategory } from './types';
import { UI_TRANSLATIONS } from './translations';
import { FlipbookModal } from './components/FlipbookModal';

interface InquirySubmitResult {
  success: boolean;
  message: string;
  referenceId: string;
  error?: string;
}

const DEFAULT_PAGE_HEROES: Record<string, PageHeroData> = {
  home: {
    id: 'home',
    badge_en: 'Amaltea Greek Catering',
    badge_pl: 'Amaltea Greek Catering',
    title_en: 'Authentic Greece at Your Table',
    title_pl: 'Grecja na Twoim stole',
    subtitle_en: 'We celebrate the Greek art of gathering around the table, bringing together authentic recipes, ingredients sourced directly from Greece, and warm hospitality that turns every occasion into a truly memorable experience.',
    subtitle_pl: 'Celebrujemy grecką sztukę wspólnego biesiadowania, łącząc autentyczne receptury, składniki sprowadzane prosto z Grecji oraz gościnność, która sprawia, że każde spotkanie staje się wyjątkowym doświadczeniem.',
    image_url: 'https://opwutcxkorpdradbalwl.supabase.co/storage/v1/object/public/gallery/hero_home_1784649230032_lasgb0.png'
  },
  about: {
    id: 'about',
    badge_en: 'Greek Hospitality',
    badge_pl: 'Grecka Gościnność',
    title_en: 'About Us',
    title_pl: 'O Nas',
    subtitle_en: 'From Our Warsaw Restaurants to Your Exquisite Event',
    subtitle_pl: 'Od uznanych warszawskich restauracji po Twoje wyjątkowe bankiety',
    image_url: '/hero-about.jpg'
  },
  business: {
    id: 'business',
    badge_en: 'CORPORATE SERVICES',
    badge_pl: 'USŁUGI DLA BIZNESU',
    title_en: 'Business Catering',
    title_pl: 'Catering Biznesowy',
    subtitle_en: 'Exceptional Greek & Mediterranean culinary experiences tailored for corporate excellence.',
    subtitle_pl: 'Wyjątkowa oprawa kulinarna spotkań biznesowych i wydarzeń korporacyjnych.',
    image_url: '/hero-business.jpg'
  },
  private: {
    id: 'private',
    badge_en: 'PRIVATE CELEBRATIONS',
    badge_pl: 'PRZYJĘCIA PRYWATNE',
    title_en: 'Special Occasions',
    title_pl: 'Wyjątkowe Okazje',
    subtitle_en: "Celebrate life's milestones with authentic Mediterranean hospitality and custom menu design.",
    subtitle_pl: 'Celebruj najważniejsze momenty życia z autentyczną grecką gościnnością.',
    image_url: '/hero-private.jpg'
  },
  gallery: {
    id: 'gallery',
    badge_en: 'Moments Crafted With Care',
    badge_pl: 'Aranżacje Tworzone z Pasją',
    title_en: 'Gallery',
    title_pl: 'Galeria',
    subtitle_en: 'Of Traditional Greek Hospitality',
    subtitle_pl: 'Prawdziwa Grecka Gościnność w Kadrze',
    image_url: '/hero-gallery.jpg'
  },
  contact: {
    id: 'contact',
    badge_en: 'Connect with Amaltea Culinary Family',
    badge_pl: 'Połącz się z kulinarną rodziną Amaltea',
    title_en: 'Contact',
    title_pl: 'Kontakt',
    subtitle_en: "Let's Create Unforgettable Gatherings",
    subtitle_pl: 'Stwórzmy niezapomniane chwile',
    image_url: '/hero-contact.jpg'
  }
};

export default function App() {
  const [lang, setLang] = useState<'en' | 'pl'>('pl');
  const [session, setSession] = useState<Session | null>(null);
  const [adminVerified, setAdminVerified] = useState(false);
  const [adminChecking, setAdminChecking] = useState(false);
  const [pageHeroes, setPageHeroes] = useState<Record<string, PageHeroData>>(DEFAULT_PAGE_HEROES);
  const [cateringCategories, setCateringCategories] = useState<CateringCategory[]>([]);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
  const [selectedPdfTitle, setSelectedPdfTitle] = useState<string | null>(null);

  const openMenuPdf = (url: string) => {
    setSelectedPdfUrl(url);
    setSelectedPdfTitle(lang === 'pl' ? 'Karta Menu' : 'Menu Book');
  };

  // Fixed storage path for Terms & Conditions PDF (replaceable from Admin Panel > Documents)
  const termsPdfUrl = supabase.storage.from('gallery').getPublicUrl('documents/terms_conditions.pdf').data.publicUrl;

  const fetchPageHeroes = async () => {
    try {
      const { data, error } = await supabase
        .from('page_heroes')
        .select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        const mapped = data.reduce((acc: Record<string, PageHeroData>, hero: PageHeroData) => {
          acc[hero.id] = hero;
          return acc;
        }, {});
        setPageHeroes(prev => ({ ...prev, ...mapped }));
      }
    } catch (err) {
      console.error('Failed to fetch page heroes:', err);
    }
  };

  const fetchCateringCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('catering_categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      if (data) {
        setCateringCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch catering categories:', err);
    }
  };

  useEffect(() => {
    fetchPageHeroes();
    fetchCateringCategories();
  }, []);

  // Verify that the current session belongs to an active owner admin.
  // This is the centralized admin gate — it runs on every session restore,
  // auth state change, and login success. If verification fails, the user
  // is signed out immediately.
  const verifyAdminAccess = async (currentSession: Session | null) => {
    if (!currentSession) {
      setAdminVerified(false);
      setAdminChecking(false);
      return;
    }

    setAdminChecking(true);
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('role, is_active')
        .eq('user_id', currentSession.user.id)
        .maybeSingle();

      if (error || !data || data.role !== 'owner' || !data.is_active) {
        // Not an active owner — revoke access
        await supabase.auth.signOut();
        setSession(null);
        setAdminVerified(false);
      } else {
        setAdminVerified(true);
      }
    } catch {
      setAdminVerified(false);
    } finally {
      setAdminChecking(false);
    }
  };

  // Monitor Supabase session states dynamically
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      verifyAdminAccess(initialSession);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (currentSession) {
        verifyAdminAccess(currentSession);
      } else {
        setAdminVerified(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Theme state with local persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
  });

  // Apply theme class to document body / documentElement
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark');
      root.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Synchronize document root language attribute
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: keyof typeof UI_TRANSLATIONS['en']) => {
    return UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS['en']?.[key] || '';
  };

  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'business' | 'private' | 'gallery' | 'contact' | 'admin' | 'admin_settings'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/about') return 'about';
      if (path === '/business') return 'business';
      if (path === '/private') return 'private';
      if (path === '/gallery') return 'gallery';
      if (path === '/contact') return 'contact';
      if (path === '/admin') return 'admin';
      if (path === '/admin/settings') return 'admin_settings';
    }
    return 'home';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  const changeTab = (tab: typeof activeTab) => {
    setHasNavigated(true);
    setActiveTab(tab);
  };

  // Synchronize activeTab state to URL pathname
  useEffect(() => {
    const tabToPath = {
      home: '/',
      about: '/about',
      business: '/business',
      private: '/private',
      gallery: '/gallery',
      contact: '/contact',
      admin: '/admin',
      admin_settings: '/admin/settings',
    } as const;
    const currentPath = window.location.pathname;
    const targetPath = tabToPath[activeTab];
    if (currentPath !== targetPath) {
      window.history.pushState({ tab: activeTab }, '', targetPath);
    }
  }, [activeTab]);

  // Synchronize document title and meta description with the active page and language
  useEffect(() => {
    const baseTitle = 'AMALTEA GREEK CATERING';
    const tabTitles = {
      home: lang === 'pl' ? 'Grecki Catering i Organizacja Wydarzeń' : 'Premium Greek Catering & Events',
      about: lang === 'pl' ? 'O Nas | Tradycja i Jakość' : 'About Us | Tradition & Quality',
      business: lang === 'pl' ? 'Catering Biznesowy | Dla Firm' : 'Business Catering | Corporate Services',
      private: lang === 'pl' ? 'Okazje Prywatne i Rodzinne' : 'Private Celebrations & Events',
      gallery: lang === 'pl' ? 'Galeria Zdjęć' : 'Visual Gallery',
      contact: lang === 'pl' ? 'Kontakt i Rezerwacje' : 'Contact & Booking',
      admin: lang === 'pl' ? 'Panel Administratora' : 'Administrator Control Panel',
      admin_settings: lang === 'pl' ? 'Ustawienia Administratora' : 'Administrator Settings',
    };
    
    const pageTitle = tabTitles[activeTab];
    document.title = activeTab === 'home' 
      ? `${baseTitle} | ${pageTitle}`
      : `${pageTitle} | ${baseTitle}`;

    // Update dynamic meta description for SEO
    const tabDescriptions = {
      home: lang === 'pl' 
        ? 'Połączenie najlepszych greckich restauracji w Warszawie (Paros, El Greco, Mykonos) w celu dostarczania autentycznej gastronomii i organizacji wyjątkowych wydarzeń.'
        : 'Unifying Warsaw\'s top Greek restaurants (Paros, El Greco, and Mykonos) to deliver authentic Greek gastronomy and majestic Mediterranean event designs directly to your venue.',
      about: lang === 'pl'
        ? 'Poznaj historię naszej kulinarności i dążenia do doskonałości w greckiej gościnności. Dowiedz się więcej o naszej pasji do jedzenia i spotkań.'
        : 'Learn about our culinary heritage and pursuit of excellence in Greek hospitality. Discover our passion for food, gatherings, and sister restaurants.',
      business: lang === 'pl'
        ? 'Wyjątkowa oprawa kulinarna spotkań biznesowych, konferencji i wydarzeń firmowych w Warszawie. Skontaktuj się z nami po ofertę szytą na miarę.'
        : 'Exceptional Greek & Mediterranean culinary experiences tailored for corporate excellence, conferences, and office events in Warsaw.',
      private: lang === 'pl'
        ? 'Catering na przyjęcia prywatne, chrzciny, komunie, wesela i urodziny. Celebruj najważniejsze momenty życia z autentyczną grecką gościnnością.'
        : 'Celebrate life\'s milestones with authentic Mediterranean hospitality, custom menu design, private parties, communions, and weddings.',
      gallery: lang === 'pl'
        ? 'Zobacz galerię zdjęć z naszych cateringów, aranżacji dań oraz greckich dań przygotowywanych przez szefów kuchni.'
        : 'Explore our visual gallery of catered events, table settings, and authentic Greek dishes prepared by our master chefs.',
      contact: lang === 'pl'
        ? 'Skontaktuj się z nami w celu rezerwacji cateringu i organizacji wydarzeń w Warszawie. Wypełnij prosty formularz zapytania.'
        : 'Get in touch with us to request a tailor-made catering quote and book your event in Warsaw. Complete our simple inquiry form.',
      admin: lang === 'pl' ? 'Panel logowania administratora.' : 'Administrator dashboard login page.',
      admin_settings: lang === 'pl' ? 'Ustawienia systemu administratora.' : 'Administrator system configuration panel.',
    };

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', tabDescriptions[activeTab]);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = tabDescriptions[activeTab];
      document.head.appendChild(meta);
    }

    // Prevent indexing of admin pages dynamically
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (activeTab === 'admin' || activeTab === 'admin_settings') {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else if (metaRobots) {
      metaRobots.remove();
    }
  }, [activeTab, lang]);

  // Listen for browser back/forward buttons to update activeTab state
  useEffect(() => {
    const handlePopState = () => {
      const pathToTab = {
        '/': 'home',
        '/about': 'about',
        '/business': 'business',
        '/private': 'private',
        '/gallery': 'gallery',
        '/contact': 'contact',
        '/admin': 'admin',
        '/admin/settings': 'admin_settings',
      } as const;
      const path = window.location.pathname;
      const tab = pathToTab[path as keyof typeof pathToTab] || 'home';
      setHasNavigated(true);
      setActiveTab(tab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);



  // Inquiry Form state
  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: '',
    phone: '',
    email: '',
    eventDate: '',
    eventTime: '',
    eventAddress: '',
    guestsCount: 50,
    eventDuration: '',
    eventType: '',
    serviceRequirements: '',
    menuPreferences: '',
    additionalInfo: '',
    message: '',
    website: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formResult, setFormResult] = useState<InquirySubmitResult | null>(null);

  // Auto scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, [activeTab]);

  // Submission handler for regular inquiry
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormResult(null); // Clear previous errors or results
    try {
      const supabaseUrl = (import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_SUPABASE_URL || '';
      const response = await fetch(`${supabaseUrl}/functions/v1/submit-inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lang }),
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        setFormResult(data);
        setFormSubmitted(true);
      } else {
        setFormResult({
          success: false,
          message: '',
          referenceId: '',
          error: data.error || (lang === 'pl' ? 'Wystąpił błąd podczas wysyłania zapytania.' : 'An error occurred while submitting your inquiry.'),
        });
      }
    } catch (err) {
      console.error(err);
      setFormResult({
        success: false,
        message: '',
        referenceId: '',
        error: lang === 'pl' 
          ? 'Błąd sieci. Sprawdź swoje połączenie i spróbuj ponownie.' 
          : 'Network error. Please check your connection and try again.',
      });
    } finally {
      setFormLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-brand-bg text-brand-text transition-colors duration-300">
      <Header
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        activeTab={activeTab}
        setActiveTab={changeTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        t={t}
      />

      <main className="flex-grow">
        <React.Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-700 rounded-full animate-spin opacity-45" />
          </div>
        }>
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              hasNavigated ? (
                <PageTransition tabKey="home">
                  <Home lang={lang} setActiveTab={changeTab} t={t} categories={cateringCategories} pageHeroData={pageHeroes.home} />
                </PageTransition>
              ) : (
                <div key="first-home">
                  <Home lang={lang} setActiveTab={changeTab} t={t} categories={cateringCategories} pageHeroData={pageHeroes.home} />
                </div>
              )
            )}

            {activeTab === 'about' && (
              hasNavigated ? (
                <PageTransition tabKey="about">
                  <About lang={lang} setActiveTab={changeTab} t={t} pageHeroData={pageHeroes.about} />
                </PageTransition>
              ) : (
                <div key="first-about">
                  <About lang={lang} setActiveTab={changeTab} t={t} pageHeroData={pageHeroes.about} />
                </div>
              )
            )}

            {activeTab === 'business' && (
              hasNavigated ? (
                <PageTransition tabKey="business">
                  <Business lang={lang} setActiveTab={changeTab} t={t} pageHeroData={pageHeroes.business} categories={cateringCategories.filter(c => c.page === 'business')} onOpenMenuPdf={openMenuPdf} />
                </PageTransition>
              ) : (
                <div key="first-business">
                  <Business lang={lang} setActiveTab={changeTab} t={t} pageHeroData={pageHeroes.business} categories={cateringCategories.filter(c => c.page === 'business')} onOpenMenuPdf={openMenuPdf} />
                </div>
              )
            )}

            {activeTab === 'private' && (
              hasNavigated ? (
                <PageTransition tabKey="private">
                  <Private lang={lang} setActiveTab={changeTab} t={t} pageHeroData={pageHeroes.private} categories={cateringCategories.filter(c => c.page === 'private')} onOpenMenuPdf={openMenuPdf} />
                </PageTransition>
              ) : (
                <div key="first-private">
                  <Private lang={lang} setActiveTab={changeTab} t={t} pageHeroData={pageHeroes.private} categories={cateringCategories.filter(c => c.page === 'private')} onOpenMenuPdf={openMenuPdf} />
                </div>
              )
            )}

            {activeTab === 'gallery' && (
              hasNavigated ? (
                <PageTransition tabKey="gallery">
                  <Gallery lang={lang} t={t} pageHeroData={pageHeroes.gallery} />
                </PageTransition>
              ) : (
                <div key="first-gallery">
                  <Gallery lang={lang} t={t} pageHeroData={pageHeroes.gallery} />
                </div>
              )
            )}

            {activeTab === 'contact' && (
              hasNavigated ? (
                <PageTransition tabKey="contact">
                  <Contact
                    lang={lang}
                    t={t}
                    setActiveTab={changeTab}
                    formData={formData}
                    setFormData={setFormData}
                    formSubmitted={formSubmitted}
                    setFormSubmitted={setFormSubmitted}
                    formLoading={formLoading}
                    formResult={formResult}
                    handleFormSubmit={handleFormSubmit}
                    pageHeroData={pageHeroes.contact}
                  />
                </PageTransition>
              ) : (
                <div key="first-contact">
                  <Contact
                    lang={lang}
                    t={t}
                    setActiveTab={changeTab}
                    formData={formData}
                    setFormData={setFormData}
                    formSubmitted={formSubmitted}
                    setFormSubmitted={setFormSubmitted}
                    formLoading={formLoading}
                    formResult={formResult}
                    handleFormSubmit={handleFormSubmit}
                    pageHeroData={pageHeroes.contact}
                  />
                </div>
              )
            )}

            {(activeTab === 'admin' || activeTab === 'admin_settings') && (
              <PageTransition tabKey="admin">
                {adminChecking ? (
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-800 mx-auto"></div>
                      <p className="text-sm text-slate-500 font-mono uppercase tracking-wider">
                        {lang === 'pl' ? 'Weryfikacja uprawnień...' : 'Verifying access...'}
                      </p>
                    </div>
                  </div>
                ) : (session && adminVerified) ? (
                  activeTab === 'admin_settings' ? (
                    <AdminSettings 
                      onLogout={() => { setSession(null); setAdminVerified(false); }} 
                      lang={lang} 
                      onBackToGallery={() => changeTab('admin')} 
                      refreshPageHeroes={fetchPageHeroes}
                      refreshCategories={fetchCateringCategories}
                    />
                  ) : (
                    <AdminGallery 
                      onLogout={() => { setSession(null); setAdminVerified(false); }} 
                      lang={lang} 
                      onGoToSettings={() => changeTab('admin_settings')} 
                    />
                  )
                ) : (
                  <AdminLogin onLoginSuccess={async () => {
                    const { data: { session: newSession } } = await supabase.auth.getSession();
                    setSession(newSession);
                    setAdminVerified(true);
                  }} lang={lang} t={t} />
                )}
              </PageTransition>
            )}
          </AnimatePresence>
        </React.Suspense>
      </main>

      <Footer lang={lang} setActiveTab={changeTab} t={t} categories={cateringCategories} onOpenTermsPdf={() => {
        setSelectedPdfUrl(termsPdfUrl + '?v=' + Date.now());
        setSelectedPdfTitle(lang === 'pl' ? 'Regulamin i warunki' : 'Terms & Conditions');
      }} />

      {selectedPdfUrl && (
        <FlipbookModal
          lang={lang}
          pdfUrl={selectedPdfUrl}
          isOpen={!!selectedPdfUrl}
          onClose={() => { setSelectedPdfUrl(null); setSelectedPdfTitle(null); }}
          title={selectedPdfTitle || undefined}
        />
      )}
    </div>
  );
}

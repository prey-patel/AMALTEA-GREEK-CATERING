import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, MapPin, Sparkles, Utensils } from 'lucide-react';

interface SeoFaqSectionProps {
  lang: 'en' | 'pl';
  isReduced: boolean;
}

const faqs = {
  pl: [
    {
      q: 'Jakie rodzaje wydarzeń obsługuje Amaltea Greek Catering w Warszawie?',
      a: 'Amaltea Greek Catering specjalizuje się w obsłudze wszechstronnych wydarzeń: od kameralnych przyjęć prywatnych, przez wesela w stylu greckim, po wielkie gale korporacyjne, pikniki firmowe z pokazami live cooking, śniadania biznesowe i konferencje w Warszawie i całym województwie mazowieckim.'
    },
    {
      q: 'Z jakich restauracji pochodzi menu Amaltea Greek Catering?',
      a: 'Nasze menu to synteza kulinarna trzech najbardziej cenionych restauracji greckich w Warszawie: Paros, El Greco oraz Mykonos. Połączyliśmy autentyczne receptury wyspiarskie i tradycyjne specjały kuchni śródziemnomorskiej.'
    },
    {
      q: 'Czy oferujecie potrawy dla osób na diecie wegetariańskiej, wegańskiej lub bezglutenowej?',
      a: 'Tak! Kuchnia grecka obfituje w dania roślinne i bezglutenowe. Oferujemy szeroki wybór dań wegetariańskich (np. grillowany ser halloumi, spanakopita, pieczone bakłażany), wegańskich (dolmades, gigantes plaki, meze, świeże sałatki) oraz specjały bezglutenowe.'
    },
    {
      q: 'Czy organizujecie stacje gotowania na żywo (Live Cooking) i stoiska z grillem?',
      a: 'Tak, naszą specjalnością są pokazy Live Cooking. Organizujemy plenerowe stacje grilla węglowego z tradycyjnymi szaszłykami Souvlaki, pieczonymi owocami morza, a także mobilny Gyros rotisserie i bar z greckim Ouzo.'
    },
    {
      q: 'W jakich rejonach Warszawy i Mazowsza świadczycie usługi cateringowe?',
      a: 'Dostarczamy catering na terenie całej Warszawy (Śródmieście, Mokotów, Wilanów, Żoliborz, Ochota, Wola, Ursynów, Praga) oraz do okolicznych miejscowości, takich jak Konstancin-Jeziorna, Piaseczno, Łomianki, Otwock i całe województwo mazowieckie.'
    }
  ],
  en: [
    {
      q: 'What types of events does Amaltea Greek Catering specialize in?',
      a: 'Amaltea Greek Catering provides full-service catering for corporate events, business conferences, executive galas, private beach and garden weddings, birthday jubilees, and family banquets across Warsaw and the Mazowieckie region.'
    },
    {
      q: 'Which restaurants inspire the Amaltea catering menu?',
      a: 'Our menus bring together the signature recipes and culinary legacy of Warsaw’s top three Greek dining destinations: Paros, El Greco, and Mykonos Restaurants.'
    },
    {
      q: 'Do you offer vegetarian, vegan, and gluten-free catering options?',
      a: 'Absolutely! Authentic Aegean cuisine is naturally rich in plant-based options. We offer an extensive range of vegetarian items (grilled halloumi, spanakopita), vegan dishes (dolmades, gigantes plaki, fresh salads), and gluten-free seafood and grilled meats.'
    },
    {
      q: 'Do you provide live cooking stations and outdoor charcoal grilling?',
      a: 'Yes! Our interactive live cooking setups feature live charcoal Souvlaki skewers, seafood grilling, fresh Gyros carving, and mobile Ouzo cocktail bars.'
    },
    {
      q: 'Which areas in Warsaw and Poland do you service?',
      a: 'We deliver and cater events throughout Warsaw (Mokotów, Wilanów, Śródmieście, Żoliborz, Wola, Ochota, Ursynów) as well as suburban areas including Konstancin-Jeziorna, Piaseczno, Łomianki, and nationwide across Poland.'
    }
  ]
};

export default function SeoFaqSection({ lang, isReduced }: SeoFaqSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqList = faqs[lang] || faqs.en;

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  // Structured Data JSON-LD for Google FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqList.map(item => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.a
      }
    }))
  };

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 overflow-hidden">
      {/* Inject FAQ Schema for Search Engine Feature Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-center space-x-3 text-[#C5A880]">
          <div className="h-[0.5px] w-12 bg-gradient-to-r from-transparent to-[#C5A880]/60" />
          <HelpCircle className="w-5 h-5" />
          <div className="h-[0.5px] w-12 bg-gradient-to-r from-[#C5A880]/60 to-transparent" />
        </div>

        <span className="text-[#C5A880] font-mono text-xs uppercase tracking-widest font-bold block">
          {lang === 'pl' ? 'Najczęściej Zadawane Pytania & SEO Info' : 'Frequently Asked Questions & Info'}
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl text-blue-955 dark:text-sky-100 font-normal uppercase tracking-wide">
          {lang === 'pl' ? 'Catering Grecki Warszawa – Najczęstsze Pytania' : 'Greek Catering Warsaw – Everything You Need To Know'}
        </h2>

        <div className="w-12 h-[1px] bg-[#C5A880] mx-auto" />
      </div>

      {/* FAQ Accordion Grid */}
      <div className="max-w-4xl mx-auto space-y-4">
        {faqList.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden transition-all duration-300 shadow-xs hover:border-[#C5A880]/40"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left space-x-4 cursor-pointer focus:outline-none"
              >
                <span className="font-serif font-medium text-base sm:text-lg text-blue-955 dark:text-sky-200">
                  {faq.q}
                </span>
                <div className={`p-1.5 rounded-full bg-[#FAF6EE] dark:bg-slate-800 text-[#C5A880] transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#C5A880] text-white' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: isReduced ? 0 : 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-1 text-slate-600 dark:text-slate-350 font-sans text-sm sm:text-base leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-1">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* SEO Regional Coverage & Highlights Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 max-w-5xl mx-auto">
        <div className="bg-[#FAF6EE]/40 dark:bg-slate-900/40 p-5 border border-[#C5A880]/20 rounded-md flex items-start space-x-3.5">
          <MapPin className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase text-blue-955 dark:text-sky-200">
              {lang === 'pl' ? 'Lokalizacja i Zasięg' : 'Service Coverage'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {lang === 'pl'
                ? 'Warszawa (Śródmieście, Mokotów, Wilanów, Żoliborz, Wola) oraz Konstancin-Jeziorna i całe Mazowsze.'
                : 'Warsaw (Mokotów, Wilanów, Center, Żoliborz), Konstancin-Jeziorna & all Mazowieckie region.'}
            </p>
          </div>
        </div>

        <div className="bg-[#FAF6EE]/40 dark:bg-slate-900/40 p-5 border border-[#C5A880]/20 rounded-md flex items-start space-x-3.5">
          <Utensils className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase text-blue-955 dark:text-sky-200">
              {lang === 'pl' ? 'Restauracje Partnerskie' : 'Partner Restaurants'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {lang === 'pl'
                ? 'Kuchnia i tradycja 3 kultowych restauracji: Paros, El Greco oraz Mykonos w Warszawie.'
                : 'Combining recipes and culinary traditions of Paros, El Greco, and Mykonos restaurants.'}
            </p>
          </div>
        </div>

        <div className="bg-[#FAF6EE]/40 dark:bg-slate-900/40 p-5 border border-[#C5A880]/20 rounded-md flex items-start space-x-3.5">
          <Sparkles className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase text-blue-955 dark:text-sky-200">
              {lang === 'pl' ? 'Imprezy Firmowe i Wesela' : 'Corporate & Weddings'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {lang === 'pl'
                ? 'Kompleksowa obsługa bankietów dla firm, wesel greckich, przerw kawowych i stacji live cooking.'
                : 'Full-service corporate banquets, Greek weddings, coffee breaks & live charcoal grilling.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { CateringCategory } from '../../types';

interface FooterProps {
  lang: 'en' | 'pl';
  setActiveTab: (tab: 'home' | 'about' | 'business' | 'private' | 'gallery' | 'contact') => void;
  t: (key: string) => string;
  categories?: CateringCategory[];
  onOpenTermsPdf?: () => void;
}

export function Footer({ lang, setActiveTab, t, categories = [], onOpenTermsPdf }: FooterProps) {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const privacyRef = useFocusTrap({
    isActive: isPrivacyOpen,
    onClose: () => setIsPrivacyOpen(false)
  });

  const termsRef = useFocusTrap({
    isActive: isTermsOpen,
    onClose: () => setIsTermsOpen(false)
  });

  const navMenuItems: { key: 'home' | 'about' | 'business' | 'private' | 'gallery' | 'contact'; label: string }[] = [
    { key: 'home', label: t('navHome') },
    { key: 'about', label: t('navAbout') },
    { key: 'private', label: t('navPrivate') },
    { key: 'business', label: t('navBusiness') },
    { key: 'gallery', label: t('navGallery') },
    { key: 'contact', label: t('navContact') },
  ];

  const businessCats = categories.filter(c => c.page === 'business');
  const privateCats = categories.filter(c => c.page === 'private');

  const fallbackBusiness = [
    { label: t('businessCat1Title') },
    { label: t('businessCat2Title') },
    { label: t('businessCat3Title') },
    { label: t('businessCat4Title') }
  ];

  const fallbackPrivate = [
    { label: t('privateCat1Title') },
    { label: t('privateCat2Title') },
    { label: t('privateCat3Title') },
    { label: t('privateCat4Title') }
  ];

  const businessItems = businessCats.length > 0 
    ? businessCats.map(c => ({ label: lang === 'pl' ? c.title_pl : c.title_en }))
    : fallbackBusiness;

  const privateItems = privateCats.length > 0 
    ? privateCats.map(c => ({ label: lang === 'pl' ? c.title_pl : c.title_en }))
    : fallbackPrivate;

  const footerContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const footerColumnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <footer className="bg-[#FAF6EE] dark:bg-slate-950 text-slate-900 dark:text-white pt-16 pb-8 border-t-4 border-[#C5A880] dark:border-blue-900 overflow-hidden font-sans select-text">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={footerContainerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 text-sm"
      >
        {/* Column 1: Brand details */}
        <motion.div variants={footerColumnVariants} className="space-y-4">
          <div className="flex items-center space-x-3">
            <img
              src="/logo.webp"
              alt="AMALTEA GREEK CATERING"
              width="1254"
              height="1254"
              loading="lazy"
              style={{ height: '3rem', width: '3rem' }}
              className="h-12 w-12 object-contain dark:brightness-110"
            />
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-light">
            {t('footerDesc')}
          </p>
        </motion.div>

        {/* Column 2: Navigation Links */}
        <motion.div variants={footerColumnVariants} className="space-y-4">
          <h4 className="font-serif uppercase text-[#355C7D] dark:text-sky-300 font-bold tracking-wider text-xs border-b border-[#C5A880]/15 dark:border-slate-800 pb-2">
            {lang === 'pl' ? 'Szybka nawigacja' : 'Quick Navigation'}
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-light">
            {navMenuItems.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => setActiveTab(item.key)}
                  className="hover:text-[#355C7D] dark:hover:text-white transition-colors cursor-pointer text-left hover-underline-draw pb-0.5"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Column 3: Private Catering Links */}
        <motion.div variants={footerColumnVariants} className="space-y-4">
          <h4 className="font-serif uppercase text-[#355C7D] dark:text-sky-300 font-bold tracking-wider text-xs border-b border-[#C5A880]/15 dark:border-slate-800 pb-2">
            {lang === 'pl' ? 'Catering Prywatny' : 'Private Catering'}
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-light">
            {privateItems.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => setActiveTab('private')}
                  className="hover:text-[#355C7D] dark:hover:text-white text-left cursor-pointer hover-underline-draw pb-0.5"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Column 4: Business Catering Links */}
        <motion.div variants={footerColumnVariants} className="space-y-4">
          <h4 className="font-serif uppercase text-[#355C7D] dark:text-sky-300 font-bold tracking-wider text-xs border-b border-[#C5A880]/15 dark:border-slate-800 pb-2">
            {lang === 'pl' ? 'Catering Biznesowy' : 'Business Catering'}
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-light">
            {businessItems.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => setActiveTab('business')}
                  className="hover:text-[#355C7D] dark:hover:text-white text-left cursor-pointer hover-underline-draw pb-0.5"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Column 4: Contact details with scale-glow icons */}
        <motion.div variants={footerColumnVariants} className="space-y-4">
          <h4 className="font-serif uppercase text-[#355C7D] dark:text-sky-300 font-bold tracking-wider text-xs border-b border-[#C5A880]/15 dark:border-slate-800 pb-2">
            {lang === 'pl' ? 'Lokalizacja w Warszawie' : 'Warsaw Location Hub'}
          </h4>
          <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400 font-light">
            <li className="flex items-start space-x-2 group">
              <motion.div whileHover={{ scale: 1.1 }} className="shrink-0">
                <MapPin className="w-4 h-4 text-[#355C7D] dark:text-sky-300 mt-0.5 group-hover:text-[#2c4e6b] dark:group-hover:text-white transition-colors" />
              </motion.div>
              <span>
                {lang === 'pl' ? 'Al. Jana Pawła II 29, 00-867 Warszawa, Polska' : 'Al. Jana Pawla II 29, 00-867 Warsaw, Poland'}
              </span>
            </li>
            <li className="flex items-start space-x-2 group">
              <motion.div whileHover={{ scale: 1.1 }} className="shrink-0">
                <Phone className="w-4 h-4 text-[#355C7D] dark:text-sky-300 mt-0.5 group-hover:text-[#2c4e6b] dark:group-hover:text-white transition-colors" />
              </motion.div>
              <span className="group-hover:text-[#355C7D] dark:group-hover:text-slate-200 transition-colors font-mono">+48 512 123 456</span>
            </li>
            <li className="flex items-start space-x-2 group">
              <motion.div whileHover={{ scale: 1.1 }} className="shrink-0">
                <Mail className="w-4 h-4 text-[#355C7D] dark:text-sky-300 mt-0.5 group-hover:text-[#2c4e6b] dark:group-hover:text-white transition-colors" />
              </motion.div>
              <a href="mailto:catering@amaltea.com.pl" className="group-hover:text-[#355C7D] dark:group-hover:text-slate-200 hover:underline transition-colors">
                catering@amaltea.com.pl
              </a>
            </li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Legal bar under footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-[#C5A880]/15 dark:border-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 dark:text-slate-400 font-sans tracking-wide">
        <span>{t('footerTerms')}</span>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setIsPrivacyOpen(true)}
            className="hover:text-[#355C7D] dark:hover:text-slate-350 cursor-pointer hover-underline-draw pb-0.5"
          >
            {lang === 'pl' ? 'Polityka prywatności' : 'Privacy Policy'}
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onOpenTermsPdf ? onOpenTermsPdf() : setIsTermsOpen(true)}
            className="hover:text-[#355C7D] dark:hover:text-slate-350 cursor-pointer hover-underline-draw pb-0.5"
          >
            {lang === 'pl' ? 'Regulamin i warunki' : 'Terms & Conditions'}
          </button>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsPrivacyOpen(false)}
          >
            <motion.div
              ref={privacyRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="privacy-title"
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white dark:bg-slate-900 border border-[#C5A880]/20 dark:border-slate-800 text-slate-800 dark:text-slate-200 max-w-2xl w-full p-6 sm:p-8 font-sans max-h-[80vh] overflow-y-auto shadow-2xl relative rounded-none select-text"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsPrivacyOpen(false)}
                className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-[#355C7D] dark:hover:text-white p-1 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="space-y-6">
                <div className="border-b border-[#C5A880]/15 dark:border-slate-800 pb-3">
                  <h3 id="privacy-title" className="font-serif text-2xl font-bold uppercase tracking-wide text-[#355C7D] dark:text-sky-300">
                    {lang === 'pl' ? 'Polityka Prywatności' : 'Privacy Policy'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    {lang === 'pl' ? 'Ostatnia aktualizacja: 12 czerwca 2026 r.' : 'Last updated: June 12, 2026'}
                  </p>
                </div>

                <div className="space-y-4 text-xs leading-relaxed font-light text-slate-600 dark:text-slate-300">
                  <section className="space-y-2">
                    <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-white uppercase">
                      {lang === 'pl' ? '1. Administrator Danych' : '1. Data Controller'}
                    </h4>
                    <p>
                      {lang === 'pl'
                        ? 'Administratorem Twoich danych osobowych jest AMALTEA SP. Z O.O. SP. K. z siedzibą w Warszawie przy Al. Jana Pawła II 29, 00-867 Warszawa, wpisana do rejestru przedsiębiorców Krajowego Rejestru Sądowego, NIP: 5252470009.'
                        : 'The controller of your personal data is AMALTEA SP. Z O.O. SP. K. with its registered office in Warsaw at Al. Jana Pawla II 29, 00-867 Warsaw, Poland, entered into the register of entrepreneurs of the National Court Register, VAT ID: PL5252470009.'}
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-white uppercase">
                      {lang === 'pl' ? '2. Zakres i Cel Przetwarzania Danych' : '2. Scope and Purpose of Data Processing'}
                    </h4>
                    <p>
                      {lang === 'pl'
                        ? 'Przetwarzamy dane osobowe podane w formularzu kontaktowym (imię i nazwisko, adres e-mail, numer telefonu, szczegóły wydarzenia oraz treść wiadomości) w celu przygotowania oferty cateringowej, rezerwacji terminów i kontaktu w sprawach organizacyjnych.'
                        : 'We process the personal data provided in the contact form (name, email address, phone number, event details, and message text) to prepare catering offers, book event dates, and communicate regarding organizational matters.'}
                    </p>
                    <p className="font-medium text-slate-700 dark:text-sky-200 bg-slate-50 dark:bg-sky-950/30 p-3 border-l-2 border-[#355C7D] dark:border-sky-400">
                      {lang === 'pl'
                        ? 'W celu zapobiegania spamowi, ochrony przed nadużyciami oraz zapewnienia bezpieczeństwa witryny (np. poprzez limity żądań / rate limiting), możemy tymczasowo przetwarzać dane techniczne, takie jak adres IP.'
                        : 'For spam prevention, abuse protection, and website security purposes (e.g., rate limiting), we may temporarily process technical data such as IP address.'}
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-white uppercase">
                      {lang === 'pl' ? '3. Podstawa Prawna' : '3. Legal Basis'}
                    </h4>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>
                        {lang === 'pl'
                          ? 'Art. 6 ust. 1 lit. b RODO – przetwarzanie jest niezbędne do podjęcia działań na żądanie osoby, której dane dotyczą, przed zawarciem umowy (przygotowanie oferty).'
                          : 'Art. 6(1)(b) GDPR – processing is necessary to take steps at the request of the data subject prior to entering into a contract (offer preparation).'}
                      </li>
                      <li>
                        {lang === 'pl'
                          ? 'Art. 6 ust. 1 lit. f RODO – nasz prawnie uzasadniony interes w postaci ochrony witryny przed spamem, nadużyciami i cyberatakami (tymczasowe przetwarzanie adresów IP do blokowania spamu).'
                          : 'Art. 6(1)(f) GDPR – our legitimate interest in protecting our web system against spam, abuse, and cyber threats (temporary processing of IP addresses for rate limiting).'}
                      </li>
                    </ul>
                  </section>
 
                  <section className="space-y-2">
                    <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-white uppercase">
                      {lang === 'pl' ? '4. Odbiorcy Danych i Okres Przechowywania' : '4. Data Recipients and Retention'}
                    </h4>
                    <p>
                      {lang === 'pl'
                        ? 'Dane mogą być przekazywane zaufanym podmiotom świadczącym usługi hostingowe, techniczne oraz dostawcom systemów wysyłki e-mail (np. Supabase, Brevo). Dane techniczne, w tym adresy IP, są przechowywane tymczasowo i automatycznie usuwane lub nadpisywane. Dane z zapytania ofertowego są przechowywane przez czas niezbędny do obsługi zapytania lub wykonania umowy, a także do momentu przedawnienia ewentualnych roszczeń.'
                        : 'Data may be transferred to trusted partners providing hosting, technical services, and email delivery platforms (e.g., Supabase, Brevo). Technical data, including IP addresses, is stored temporarily and automatically deleted or cycled. Inquiry data is retained for the period necessary to handle your request or execute the contract, as well as until the expiration of statutory limitation periods.'}
                    </p>
                  </section>
 
                  <section className="space-y-2">
                    <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-white uppercase">
                      {lang === 'pl' ? '5. Twoje Prawa' : '5. Your Rights'}
                    </h4>
                    <p>
                      {lang === 'pl'
                        ? 'Przysługuje Ci prawo do dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, wniesienia sprzeciwu wobec przetwarzania oraz wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).'
                        : 'You have the right to access, rectify, or erase your data, restrict or object to its processing, and lodge a complaint with the President of the Personal Data Protection Office (ul. Stawki 2, 00-193 Warsaw, Poland).'}
                    </p>
                  </section>
                </div>
                
                <div className="border-t border-[#C5A880]/15 dark:border-slate-800 pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsPrivacyOpen(false)}
                    className="px-5 py-2 bg-[#355C7D] dark:bg-blue-800 hover:bg-[#2c4e6b] dark:hover:bg-blue-700 text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-colors duration-200"
                  >
                    {lang === 'pl' ? 'Zamknij' : 'Close'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms & Conditions Modal */}
      <AnimatePresence>
        {isTermsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsTermsOpen(false)}
          >
            <motion.div
              ref={termsRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="terms-title"
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white dark:bg-slate-900 border border-[#C5A880]/20 dark:border-slate-800 text-slate-800 dark:text-slate-200 max-w-2xl w-full p-6 sm:p-8 font-sans max-h-[80vh] overflow-y-auto shadow-2xl relative rounded-none select-text"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsTermsOpen(false)}
                className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-[#355C7D] dark:hover:text-white p-1 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="space-y-6">
                <div className="border-b border-[#C5A880]/15 dark:border-slate-800 pb-3">
                  <h3 id="terms-title" className="font-serif text-2xl font-bold uppercase tracking-wide text-[#355C7D] dark:text-sky-300">
                    {lang === 'pl' ? 'Regulamin i Warunki' : 'Terms & Conditions'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    {lang === 'pl' ? 'Ostatnia aktualizacja: 12 czerwca 2026 r.' : 'Last updated: June 12, 2026'}
                  </p>
                </div>

                <div className="space-y-4 text-xs leading-relaxed font-light text-slate-600 dark:text-slate-300">
                  <section className="space-y-2">
                    <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-white uppercase">
                      {lang === 'pl' ? '1. Zakres Zastosowania' : '1. Scope of Application'}
                    </h4>
                    <p>
                      {lang === 'pl'
                        ? 'Niniejszy regulamin określa zasady korzystania ze strony internetowej AMALTEA GREEK CATERING, w szczególności formularza zapytania ofertowego na usługi cateringowe.'
                        : 'These terms and conditions define the rules for using the AMALTEA GREEK CATERING website, particularly the inquiry form for catering services.'}
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-white uppercase">
                      {lang === 'pl' ? '2. Zapytania Ofertowe' : '2. Service Inquiries'}
                    </h4>
                    <p>
                      {lang === 'pl'
                        ? 'Przesłanie zapytania ofertowego za pomocą formularza kontaktowego nie rodzi zobowiązania do wykonania usługi cateringowej ani nie stanowi zawarcia umowy. Rezerwacja terminu i warunków następuje wyłącznie na podstawie podpisanej przez obie strony, pisemnej lub elektronicznej umowy cateringowej.'
                        : 'Submitting an inquiry via the contact form does not create an obligation to perform catering services nor does it constitute entering into a contract. Booking a date and confirming terms occurs exclusively through a signed written or electronic catering agreement by both parties.'}
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-white uppercase">
                      {lang === 'pl' ? '3. Odpowiedzialność Użytkownika' : '3. User Responsibility'}
                    </h4>
                    <p>
                      {lang === 'pl'
                        ? 'Użytkownik zobowiązany jest do korzystania z formularza w sposób zgodny z prawem, dobrymi obyczajami oraz do podawania prawdziwych i dokładnych informacji. Przesyłanie spamu, danych fikcyjnych lub zautomatyzowane wysyłanie zapytań przy użyciu botów jest surowo zabronione i może skutkować zablokowaniem dostępu (rate limiting) oraz odpowiedzialnością prawną.'
                        : 'Users are obliged to use the inquiry form in compliance with the law, good practices, and to provide true and accurate information. Submitting spam, fictitious data, or automated submissions using bots is strictly prohibited and may result in access block (rate limiting) and legal liability.'}
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-white uppercase">
                      {lang === 'pl' ? '4. Własność Intelektualna' : '4. Intellectual Property'}
                    </h4>
                    <p>
                      {lang === 'pl'
                        ? 'Wszelkie materiały, teksty, grafiki, logo oraz kod źródłowy strony stanowią własność intelektualną firmy AMALTEA i są chronione prawem autorskim. Ich kopiowanie lub powielanie bez zgody jest zabronione.'
                        : 'All materials, texts, graphics, logos, and source code of the website are the intellectual property of AMALTEA and are protected by copyright. Copying or reproducing them without consent is prohibited.'}
                    </p>
                  </section>
                </div>
                
                <div className="border-t border-[#C5A880]/15 dark:border-slate-800 pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsTermsOpen(false)}
                    className="px-5 py-2 bg-[#355C7D] dark:bg-blue-800 hover:bg-[#2c4e6b] dark:hover:bg-blue-700 text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-colors duration-200"
                  >
                    {lang === 'pl' ? 'Zamknij' : 'Close'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}

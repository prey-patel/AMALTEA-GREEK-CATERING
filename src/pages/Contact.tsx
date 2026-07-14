/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { InquiryFormData, PageHeroData, getOptimizedImageUrl } from '../types';
import { PageHero } from '../components/PageHero';

interface ContactProps {
  lang: 'en' | 'pl';
  t: (key: string) => string;
  setActiveTab: (tab: 'home' | 'about' | 'business' | 'private' | 'gallery' | 'contact') => void;
  formData: InquiryFormData;
  setFormData: React.Dispatch<React.SetStateAction<InquiryFormData>>;
  formSubmitted: boolean;
  setFormSubmitted: (val: boolean) => void;
  formLoading: boolean;
  formResult: { success: boolean; message: string; referenceId: string; error?: string } | null;
  handleFormSubmit: (e: React.FormEvent) => void;
  pageHeroData?: PageHeroData;
}

const getLocalizedEventType = (type: string, lang: 'en' | 'pl') => {
  if (lang === 'pl') {
    switch (type) {
      case 'conference': return 'konferencja';
      case 'banquet': return 'bankiet';
      case 'First Communion': return 'Pierwsza Komunia';
      case 'birthday party': return 'przyjęcie urodzinowe';
      case 'corporate event': return 'impreza firmowa';
      default: return type;
    }
  } else {
    switch (type) {
      case 'conference': return 'conference';
      case 'banquet': return 'banquet';
      case 'First Communion': return 'First Communion';
      case 'birthday party': return 'birthday party';
      case 'corporate event': return 'corporate event';
      default: return type;
    }
  }
};

export default function Contact({
  lang,
  t: _t,
  setActiveTab: _setActiveTab,
  formData,
  setFormData,
  formSubmitted,
  setFormSubmitted,
  formLoading,
  formResult,
  handleFormSubmit,
  pageHeroData,
}: ContactProps) {
  const [emailError, setEmailError] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');
  const [durationSelect, setDurationSelect] = React.useState('');

  const handleDurationSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setDurationSelect(val);
    if (val !== 'other') {
      setFormData(prev => ({ ...prev, eventDuration: val }));
    } else {
      setFormData(prev => ({ ...prev, eventDuration: '' }));
    }
  };



  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow only digits, space, plus, dash, brackets
    if (/^[0-9+\s() -]*$/.test(val)) {
      setFormData(prev => ({ ...prev, phone: val }));
      const digits = val.replace(/\D/g, '');
      if (digits.length > 0 && digits.length < 6) {
        setPhoneError(lang === 'pl' ? 'Wprowadź poprawny numer telefonu (min. 6 cyfr).' : 'Please enter a valid phone number (min. 6 digits).');
      } else {
        setPhoneError('');
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, email: val }));
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val && !emailRegex.test(val)) {
      setEmailError(lang === 'pl' ? 'Wprowadź poprawny adres e-mail (np. nazwa@domena.pl).' : 'Please enter a valid email address (e.g. name@domain.com).');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final check for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError(lang === 'pl' ? 'Wprowadź poprawny adres e-mail.' : 'Please enter a valid email address.');
      return;
    }
    
    // Final check for phone
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 6) {
      setPhoneError(lang === 'pl' ? 'Wprowadź poprawny numer telefonu (min. 6 cyfr).' : 'Please enter a valid phone number (min. 6 digits).');
      return;
    }

    handleFormSubmit(e);
  };

  const heroBadge = pageHeroData 
    ? (lang === 'pl' ? pageHeroData.badge_pl : pageHeroData.badge_en) 
    : (lang === 'pl' ? 'Połącz się z kulinarną rodziną Amaltea' : 'Connect with Amaltea Culinary Family');
    
  const heroTitle = pageHeroData 
    ? (lang === 'pl' ? pageHeroData.title_pl : pageHeroData.title_en) 
    : (lang === 'pl' ? 'Kontakt' : 'Contact');

  const heroSubtitle = pageHeroData 
    ? (lang === 'pl' ? pageHeroData.subtitle_pl : pageHeroData.subtitle_en) 
    : (lang === 'pl' ? 'Stwórzmy niezapomniane chwile' : "Let's Create Unforgettable Gatherings");

  const heroBgImage = getOptimizedImageUrl(pageHeroData?.image_url || "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=70&w=1200", 1200);

  return (
    <div className="space-y-20 pb-20 select-text">
      <PageHero
        lang={lang}
        badge={heroBadge}
        title={heroTitle}
        subtitle={heroSubtitle}
        bgImage={heroBgImage}
        bgAlt="Greece beautiful dom"
      />

      {/* Intro section */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
          {lang === 'pl'
            ? 'Każda oferta przygotowywana jest indywidualnie, a menu i usługi dopasowywane są do charakteru wydarzenia oraz oczekiwań naszych Gości.'
            : 'Every proposal is prepared individually, with menus and services tailored to the nature of the event and the expectations of our Guests.'}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-sans leading-relaxed max-w-2xl mx-auto font-light">
          {lang === 'pl'
            ? 'Planujesz prywatne przyjęcie lub wydarzenie firmowe? Skontaktuj się z nami, a z przyjemnością pomożemy Ci stworzyć niezapomniane chwile inspirowane smakami Grecji i basenu Morza Śródziemnego.'
            : 'Planning a private celebration or a corporate event? Get in touch with us and we will be delighted to help you create a memorable experience inspired by the flavors of Greece and the Mediterranean.'}
        </p>
      </section>

      {/* Grid block: Get in Touch & Send Us Inquiry */}
      <section id="inquiry-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct contact particulars */}
          <div className="lg:col-span-5 space-y-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-serif text-xl font-bold uppercase text-blue-955 dark:text-slate-100">
                  {lang === 'pl' ? 'Dane Kontaktowe' : 'Contact Details'}
                </h3>
              </div>
              
              <div className="space-y-3 font-sans text-xs pt-1">
                <p className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-500">{lang === 'pl' ? 'E-mail:' : 'E-mail:'}</span>
                  <a href="mailto:catering@amaltea.com.pl" className="text-blue-800 dark:text-sky-400 hover:underline">
                    catering@amaltea.com.pl
                  </a>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-500">{lang === 'pl' ? 'Telefon:' : 'Phone:'}</span>
                  <a href="tel:+48503102090" className="text-blue-800 dark:text-sky-400 hover:underline font-mono">
                    +48 503 10 20 90
                  </a>
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-serif text-xl font-bold uppercase text-blue-955 dark:text-slate-100">
                  {lang === 'pl' ? 'Dane Spółki' : 'Company Details'}
                </h3>
              </div>
              
              <div className="space-y-2 text-xs font-sans text-slate-700 dark:text-slate-300 leading-relaxed font-light">
                <p className="font-bold text-blue-955 dark:text-slate-100">AMALTEA SP. Z O.O. SP. K.</p>
                <p>Al. Jana Pawła II 29</p>
                <p>00-867 Warsaw, Poland</p>
                <p className="pt-1 flex items-center space-x-2">
                  <span className="font-semibold text-slate-500">VAT ID (NIP):</span>
                  <span className="font-mono font-medium">525 247 00 09</span>
                </p>
              </div>
            </div>

            {/* Delivery area info */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <span className="font-serif text-xs font-bold uppercase text-blue-955 dark:text-sky-400 block">
                  {lang === 'pl' ? 'Obszar Dostaw Warszawa i Okolice' : 'Warsaw & Surroundings Delivery Region'}
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-light">
                  {lang === 'pl'
                    ? 'Dostarczamy na terenie całej Warszawy i okolic.'
                    : 'We deliver throughout Warsaw and the surrounding areas.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Inquiry Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 shadow-sm relative">
            <AnimatePresence mode="wait">
              {formSubmitted ? (
                <motion.div
                  key="form-success"
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center space-y-6 max-w-md mx-auto"
                >
                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center rounded-full mx-auto">
                    <Check className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-bold uppercase text-blue-955 dark:text-slate-100">
                      {lang === 'pl' ? 'Zapytanie Przesłane!' : 'Inquiry Received!'}
                    </h3>
                    <span className="font-mono text-xs uppercase tracking-widest text-sky-600 font-bold block">
                      {lang === 'pl' ? 'ID REJESTRU' : 'LOGGED ID'}: {formResult?.referenceId || 'AEG-940251'}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-350 font-sans text-sm leading-relaxed max-w-sm mx-auto select-text font-light">
                    {lang === 'pl'
                      ? `Dzień dobry, ${formData.fullName}! Twoje zapytanie dotyczące wydarzenia (${getLocalizedEventType(formData.eventType, 'pl')}) dla ${formData.guestsCount} osób zostało zapisane. Skontaktujemy się z Tobą jak najszybciej.`
                      : `Kali Mera, ${formData.fullName}! Your inquiry for a ${getLocalizedEventType(formData.eventType, 'en')} with ${formData.guestsCount} guests has been logged. We will contact you as soon as possible.`}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
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
                      setDurationSelect('');
                    }}
                    className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-none"
                  >
                    {lang === 'pl' ? 'Wyślij kolejne zapytanie' : 'Submit Another Inquiry'}
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form-inputs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-xl font-bold uppercase text-blue-955 dark:text-slate-100">
                        {lang === 'pl' ? 'Poproś o Ofertę Szytą na Miarę' : 'Request a Tailor-Made Offer'}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono font-bold">
                        {lang === 'pl' ? '* Pola Wymagane' : '* Fields Required'}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-sans leading-relaxed font-light">
                      {lang === 'pl'
                        ? 'Wypełnij poniższy formularz, a my przygotujemy propozycję dopasowaną do Twojego wydarzenia, liczby gości i oczekiwań.'
                        : 'Complete the form below and we will prepare a proposal tailored to your event, the number of guests, and your expectations.'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Honeypot field for bot protection */}
                    <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        value={formData.website || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="Do not fill this field"
                        autoComplete="off"
                      />
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="fullName" className="block font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        {lang === 'pl' ? 'Imię i Nazwisko *' : 'Full Name *'}
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder={lang === 'pl' ? 'np. Jan Kowalski' : 'e.g. John Doe'}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-800 focus:outline-none rounded-none text-xs font-sans text-slate-900 dark:text-slate-200 transition-colors duration-200"
                      />
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="block font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          {lang === 'pl' ? 'Adres E-mail *' : 'E-mail Address *'}
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          aria-invalid={emailError ? "true" : "false"}
                          aria-describedby={emailError ? "email-error" : undefined}
                          value={formData.email}
                          onChange={handleEmailChange}
                          placeholder={lang === 'pl' ? 'np. jan.kowalski@domena.pl' : 'e.g. name@domain.com'}
                          className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border focus:bg-white dark:focus:bg-slate-900 focus:outline-none rounded-none text-xs font-sans text-slate-900 dark:text-slate-200 transition-colors duration-200 ${
                            emailError ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-blue-800'
                          }`}
                        />
                        {emailError && (
                          <p id="email-error" className="text-[10px] text-red-600 font-sans mt-1" role="alert">{emailError}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="phone" className="block font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          {lang === 'pl' ? 'Numer Telefonu *' : 'Phone Number *'}
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="text"
                          required
                          aria-invalid={phoneError ? "true" : "false"}
                          aria-describedby={phoneError ? "phone-error" : undefined}
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          placeholder="e.g. +48 512 123 456"
                          className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border focus:bg-white dark:focus:bg-slate-900 focus:outline-none rounded-none text-xs font-sans text-slate-900 dark:text-slate-200 transition-colors duration-200 ${
                            phoneError ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-blue-800'
                          }`}
                        />
                        {phoneError && (
                          <p id="phone-error" className="text-[10px] text-red-600 font-sans mt-1" role="alert">{phoneError}</p>
                        )}
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="eventDate" className="block font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          {lang === 'pl' ? 'Planowana Data Wydarzenia *' : 'Planned Event Date *'}
                        </label>
                        <input
                          id="eventDate"
                          name="eventDate"
                          type="date"
                          required
                          value={formData.eventDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-800 focus:outline-none rounded-none text-xs font-sans text-slate-900 dark:text-slate-200 transition-colors duration-200"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="eventTime" className="block font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          {lang === 'pl' ? 'Planowana Godzina Wydarzenia *' : 'Planned Event Time *'}
                          <span className="normal-case font-light text-[9px] text-slate-450 ml-1">
                            {lang === 'pl' ? '(np. 13:00)' : '(e.g. 1:00 PM)'}
                          </span>
                        </label>
                        <input
                          id="eventTime"
                          name="eventTime"
                          type="text"
                          required
                          value={formData.eventTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, eventTime: e.target.value }))}
                          placeholder={lang === 'pl' ? 'np. 13:00' : 'e.g. 1:00 PM'}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-800 focus:outline-none rounded-none text-xs font-sans text-slate-900 dark:text-slate-200 transition-colors duration-200"
                        />
                      </div>
                    </div>

                    {/* Event Address */}
                    <div className="space-y-1.5">
                      <label htmlFor="eventAddress" className="block font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        {lang === 'pl' ? 'Adres Wydarzenia *' : 'Event Address *'}
                      </label>
                      <input
                        id="eventAddress"
                        name="eventAddress"
                        type="text"
                        required
                        value={formData.eventAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, eventAddress: e.target.value }))}
                        placeholder={lang === 'pl' ? 'np. Al. Jana Pawła II 29, Warszawa' : 'e.g. Al. Jana Pawla II 29, Warsaw'}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-800 focus:outline-none rounded-none text-xs font-sans text-slate-900 dark:text-slate-200 transition-colors duration-200"
                      />
                    </div>

                    {/* Guests and Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="guestsCount" className="block font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          {lang === 'pl' ? 'Liczba Gości *' : 'Number of Guests *'}
                        </label>
                        <input
                          id="guestsCount"
                          name="guestsCount"
                          type="number"
                          required
                          min="5"
                          value={formData.guestsCount}
                          onChange={(e) => setFormData(prev => ({ ...prev, guestsCount: Number(e.target.value) }))}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-800 focus:outline-none rounded-none text-xs font-sans text-slate-900 dark:text-slate-200 transition-colors duration-200"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="durationSelect" className="block font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          {lang === 'pl' ? 'Szacowany Czas Trwania Wydarzenia' : 'Estimated Duration of the Event'}
                          <span className="normal-case font-light text-[9px] text-slate-450 ml-1">
                            {lang === 'pl' ? '(np. 4 godziny, 8 godzin, cały dzień, inne)' : '(e.g. 4 hours, 8 hours, full day, other)'}
                          </span>
                        </label>
                        <select
                          id="durationSelect"
                          name="durationSelect"
                          value={durationSelect}
                          onChange={handleDurationSelectChange}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-800 focus:outline-none rounded-none text-xs font-sans text-slate-900 dark:text-slate-200 transition-colors duration-200"
                        >
                          <option value="">{lang === 'pl' ? '-- Wybierz czas trwania --' : '-- Select duration --'}</option>
                          <option value="4 hours">{lang === 'pl' ? '4 godziny' : '4 hours'}</option>
                          <option value="8 hours">{lang === 'pl' ? '8 godzin' : '8 hours'}</option>
                          <option value="full day">{lang === 'pl' ? 'cały dzień' : 'full day'}</option>
                          <option value="other">{lang === 'pl' ? 'inne...' : 'other...'}</option>
                        </select>
                        {durationSelect === 'other' && (
                          <>
                            <label htmlFor="eventDuration" className="sr-only">
                              {lang === 'pl' ? 'Wpisz inny czas trwania' : 'Enter other duration'}
                            </label>
                            <input
                              id="eventDuration"
                              name="eventDuration"
                              type="text"
                              value={formData.eventDuration}
                              onChange={(e) => setFormData(prev => ({ ...prev, eventDuration: e.target.value }))}
                              placeholder={lang === 'pl' ? 'np. 3 godziny, 2 dni' : 'e.g. 3 hours, 2 days'}
                              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-800 focus:outline-none rounded-none text-xs font-sans text-slate-900 dark:text-slate-200 transition-colors duration-200 mt-2"
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Type of Event and Service Requirements */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="eventType" className="block font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          {lang === 'pl' ? 'Typ Wydarzenia *' : 'Type of Event *'}
                          <span className="normal-case font-light text-[9px] text-slate-450 ml-1">
                            {lang === 'pl' ? '(np. konferencja, bankiet, Pierwsza Komunia, przyjęcie urodzinowe, impreza firmowa, inne)' : '(e.g. conference, banquet, First Communion, birthday party, corporate event, other)'}
                          </span>
                        </label>
                        <input
                          id="eventType"
                          name="eventType"
                          type="text"
                          required
                          value={formData.eventType}
                          onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value }))}
                          placeholder={lang === 'pl' ? 'np. wesele, bankiet, konferencja, komunia...' : 'e.g. wedding, banquet, conference, communion...'}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-800 focus:outline-none rounded-none text-xs font-sans text-slate-900 dark:text-slate-200 transition-colors duration-200"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="serviceRequirements" className="block font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          {lang === 'pl' ? 'Wymagania Dotyczące Obsługi' : 'Service Requirements'}
                        </label>
                        <input
                          id="serviceRequirements"
                          name="serviceRequirements"
                          type="text"
                          value={formData.serviceRequirements}
                          onChange={(e) => setFormData(prev => ({ ...prev, serviceRequirements: e.target.value }))}
                          placeholder={lang === 'pl' ? 'np. tylko dostawa, obsługa kelnerska, pełna organizacja' : 'e.g. delivery only, waiter service, full event organization'}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-800 focus:outline-none rounded-none text-xs font-sans text-slate-900 dark:text-slate-200 transition-colors duration-200"
                        />
                      </div>
                    </div>

                    {/* Menu Preferences */}
                    <div className="space-y-1.5">
                      <label htmlFor="menuPreferences" className="block font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        {lang === 'pl' ? 'Preferencje Menu' : 'Menu Preferences'}
                        <span className="normal-case font-light text-[9px] text-slate-450 ml-1">
                          {lang === 'pl' ? '(np. przystawki, dania główne, desery, menu wegetariańskie, inne)' : '(e.g. appetizers, main courses, desserts, vegetarian menu, other)'}
                        </span>
                      </label>
                      <textarea
                        id="menuPreferences"
                        name="menuPreferences"
                        rows={2}
                        value={formData.menuPreferences}
                        onChange={(e) => setFormData(prev => ({ ...prev, menuPreferences: e.target.value }))}
                        placeholder={lang === 'pl' ? 'Wpisz swoje preferencje menu...' : 'Write your menu preferences here...'}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-800 focus:outline-none rounded-none text-xs font-sans text-slate-900 dark:text-slate-200 transition-colors duration-200 resize-none"
                      />
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-1.5">
                      <label htmlFor="additionalInfo" className="block font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        {lang === 'pl' ? 'Dodatkowe Informacje i Szczegóły Wydarzenia' : 'Additional Information and Event Details'}
                      </label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        rows={3}
                        value={formData.additionalInfo}
                        onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                        placeholder={lang === 'pl' ? 'Wprowadź dodatkowe szczegóły...' : 'Enter any other details here...'}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:outline-none rounded-none text-xs font-sans text-slate-900 dark:text-slate-200 transition-colors duration-200 resize-none"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label htmlFor="message" className="block font-mono text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        {lang === 'pl' ? 'Twoja Wiadomość' : 'Your Message'}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder={lang === 'pl' ? 'Wpisz treść wiadomości...' : 'Write your message details here...'}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-800 focus:outline-none rounded-none text-xs font-sans text-slate-900 dark:text-slate-200 transition-colors duration-200 resize-none"
                      />
                    </div>

                    {formResult && !formResult.success && formResult.error && (
                      <div role="alert" className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs rounded-none font-sans leading-relaxed">
                        {formResult.error}
                      </div>
                    )}

                    {formLoading && (
                      <div role="status" aria-live="polite" className="sr-only">
                        {lang === 'pl' ? 'Przesyłanie zgłoszenia...' : 'Submitting inquiry details...'}
                      </div>
                    )}

                    {/* Submission button */}
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="w-full py-4 bg-blue-800 disabled:bg-slate-300 hover:bg-blue-950 text-white font-mono font-bold tracking-widest text-[11px] uppercase transition-colors shadow-md cursor-pointer text-center hover:scale-[1.01] active:scale-[0.99] transition-transform duration-100"
                    >
                      {formLoading
                        ? lang === 'pl'
                          ? 'Przesyłanie zgłoszenia...'
                          : 'Submitting Details...'
                        : lang === 'pl'
                        ? 'Wyślij Zapytanie'
                        : 'Send Inquiry'}
                    </button>

                    <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-sans font-light mt-2 leading-relaxed">
                      {lang === 'pl'
                        ? 'Możemy tymczasowo przetwarzać dane techniczne, takie jak adres IP, w celu zapobiegania spamowi, ochrony przed nadużyciami i bezpieczeństwa witryny.'
                        : 'We may temporarily process technical data such as IP address for spam prevention, abuse protection, and website security.'}
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Aesthetic Footer graphic */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-slate-200/80 p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-white">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-serif text-lg font-bold text-blue-955 uppercase block">
              {lang === 'pl' ? 'Stwórzmy Razem Coś Wyjątkowego' : "Let's Create Something Beautiful"}
            </span>
            <p className="text-slate-500 font-sans text-xs leading-relaxed font-light">
              {lang === 'pl'
                ? 'Podziel się swoją unikalną wizją, a nasi specjaliści z Warszawy skomponują idealną śródziemnomorską ucztę.'
                : 'Share your unique vision and our Warsaw event specialists will configure the ultimate Mediterranean feast.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const target = document.getElementById('inquiry-anchor');
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white font-mono text-xs font-semibold uppercase tracking-widest cursor-pointer transition-colors duration-300"
          >
            {lang === 'pl' ? 'Uzyskaj Darmową Ofertę' : 'Get a Free Quote'}
          </button>
        </div>
      </section>
    </div>
  );
}

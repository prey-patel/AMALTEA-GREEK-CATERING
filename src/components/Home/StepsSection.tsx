import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface StepsSectionProps {
  lang: 'en' | 'pl';
  isReduced: boolean;
}

export default function StepsSection({ lang, isReduced }: StepsSectionProps) {
  const stepsRef = useRef(null);

  // Local scroll trigger calculation for steps timeline
  const { scrollYProgress: stepsScroll } = useScroll({
    target: stepsRef,
    offset: ["start end", "end center"]
  });

  const yStepNum01 = useTransform(stepsScroll, [0, 0.45], [10, -20]);
  const yStepNum02 = useTransform(stepsScroll, [0.15, 0.6], [10, -20]);
  const yStepNum03 = useTransform(stepsScroll, [0.3, 0.75], [10, -20]);
  const yStepNum04 = useTransform(stepsScroll, [0.45, 0.9], [10, -20]);
  const progressLineScale = useTransform(stepsScroll, [0.1, 0.85], [0, 1]);

  // Framer Motion Variants
  const letterSpacingVariants = {
    hidden: { opacity: 0, letterSpacing: '0.1em', y: 10 },
    visible: {
      opacity: 1,
      letterSpacing: '0.25em',
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const lineMaskVariants = {
    hidden: { y: "100%" },
    visible: {
      y: 0,
      transition: { 
        duration: 0.9, 
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const drawLineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

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

  const circleVariants = {
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

  const steps = [
    {
      num: '01',
      step: lang === 'pl' ? 'Opowiedz nam o swoim wydarzeniu' : 'Tell Us About Your Event',
      desc: lang === 'pl'
        ? 'Przekaż nam szczegóły planowanego wydarzenia za pomocą formularza kontaktowego, a my przygotujemy propozycję dopasowaną do Twoich oczekiwań. Im więcej informacji nam przekażesz, tym lepiej będziemy mogli przygotować ofertę odpowiadającą charakterowi wydarzenia i potrzebom Twoich Gości.'
        : 'Share the details of your planned event using our contact form, and we will prepare a proposal tailored to your expectations. The more information you provide, the better we can create an offer that reflects the nature of your event and the needs of your guests.',
      yVal: yStepNum01
    },
    {
      num: '02',
      step: lang === 'pl' ? 'Przygotujemy indywidualną ofertę' : 'We Will Prepare a Personalised Offer',
      desc: lang === 'pl'
        ? 'Wspólnie z naszym Szefem Kuchni przygotujemy ofertę oraz dobierzemy menu, tworząc rozwiązanie idealnie dopasowane do charakteru wydarzenia oraz Twoich oczekiwań.'
        : 'Together with our Head Chef, we will create a bespoke proposal and carefully select the menu, providing a solution perfectly suited to the character of your event and your expectations.',
      yVal: yStepNum02
    },
    {
      num: '03',
      step: lang === 'pl' ? 'Dopracujemy każdy szczegół' : 'We Will Take Care of Every Detail',
      desc: lang === 'pl'
        ? 'Zadbamy o organizację, oprawę i najwyższą jakość serwisu, aby wszystko przebiegło zgodnie z planem.'
        : 'We will ensure flawless organisation, elegant presentation and the highest standards of service, so that everything runs smoothly and according to plan.',
      yVal: yStepNum03
    },
    {
      num: '04',
      step: lang === 'pl' ? 'Celebruj wyjątkowe chwile' : 'Celebrate the Special Moments',
      desc: lang === 'pl'
        ? 'Ty cieszysz się spotkaniem z Gośćmi, a my zajmujemy się resztą, tworząc atmosferę prawdziwej greckiej gościnności.'
        : 'Enjoy precious time with your guests while we take care of the rest, creating an atmosphere of genuine Greek hospitality.',
      yVal: yStepNum04
    }
  ];

  return (
    <section ref={stepsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 relative">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center space-y-2"
      >
        <motion.span 
          variants={letterSpacingVariants}
          className="text-blue-700 font-mono text-xs uppercase tracking-widest font-bold block"
        >
          {lang === 'pl' ? 'JAK TO DZIAŁA' : 'HOW IT WORKS'}
        </motion.span>
        <div className="overflow-hidden py-1">
          <motion.h2 
            variants={lineMaskVariants}
            className="font-serif text-3xl sm:text-4xl text-blue-950 uppercase font-semibold"
          >
            {lang === 'pl' ? 'Od pomysłu do wyjątkowego wydarzenia' : 'From an Idea to an Exceptional Event'}
          </motion.h2>
        </div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={drawLineVariants}
          className="w-20 h-0.5 bg-blue-700 mx-auto mt-2 origin-center"
        />
      </motion.div>

      {/* Journey Progress Line (Desktop only) */}
      <div className="absolute top-[200px] left-[15%] right-[15%] h-[2px] bg-slate-100 -z-10 hidden md:block">
        <motion.div 
          style={{ scaleX: isReduced ? 1 : progressLineScale, originX: 0 }}
          className="h-full bg-blue-600"
        />
      </div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={gridContainerVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-8 relative"
      >
        {steps.map((item, idx) => (
          <motion.div
            key={item.num}
            variants={cardVariants}
            whileHover={{ 
              y: isReduced ? 0 : -8, 
              borderColor: "rgba(197, 168, 128, 0.4)", 
              boxShadow: "0 15px 30px -10px rgba(53, 92, 125, 0.12), 0 0 15px rgba(197, 168, 128, 0.05)"
            }}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 relative group flex flex-col justify-between rounded-none select-text overflow-hidden"
          >
            {/* Big faded number parallax */}
            <motion.span 
              style={{ y: isReduced ? 0 : item.yVal }}
              className="absolute top-4 right-4 font-serif text-5xl font-bold text-sky-100/70 dark:text-slate-800/40 italic select-none z-0"
            >
              {item.num}
            </motion.span>
            
            <div className="space-y-4 relative z-10">
              <motion.div 
                variants={circleVariants}
                whileHover={{ scale: 1.12, rotate: [0, -10, 10, 0] }}
                transition={{ type: "spring", stiffness: 350, damping: 10 }}
                className="w-10 h-10 border text-sm flex items-center justify-center font-bold font-mono bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-sky-400 border-blue-100 dark:border-slate-700 rounded-none group-hover:bg-[#355C7D] dark:group-hover:bg-[#5faadc] group-hover:text-white group-hover:border-[#355C7D] dark:group-hover:border-[#5faadc] transition-all duration-300"
              >
                {idx + 1}
              </motion.div>
              <motion.h3 
                variants={titleVariants}
                className="font-serif text-lg font-bold text-blue-955 dark:text-sky-200 uppercase leading-snug group-hover:text-[#C5A880] transition-colors duration-300"
              >
                {item.step}
              </motion.h3>
              <motion.p 
                variants={descVariants}
                className="text-slate-500 dark:text-slate-400 font-sans text-xs leading-relaxed transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-200 font-light"
              >
                {item.desc}
              </motion.p>
            </div>

            <div className="h-0.5 w-0 bg-[#C5A880] group-hover:w-full transition-all duration-500 mt-6 relative z-10" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

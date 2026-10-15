import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { ArrowDown, MessageCircle, Scissors, CheckCircle2 } from 'lucide-react';
import { buildWhatsAppUrl, HERO_DEFAULT_IMAGE } from '../../lib/storageFallback';

export const Hero: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings, setIsAppointmentModalOpen } = useStore();

  const title = language === 'bn'
    ? (settings.heroTitleBn || settings.heroTitleEn || t.hero.title)
    : (settings.heroTitleEn || settings.heroTitleBn || t.hero.title);

  const description = language === 'bn'
    ? (settings.heroDescriptionBn || settings.heroDescriptionEn || t.hero.subtitle)
    : (settings.heroDescriptionEn || settings.heroDescriptionBn || t.hero.subtitle);

  const heroImage = settings.heroImageUrl || HERO_DEFAULT_IMAGE;

  const handleWhatsApp = () => {
    const greeting = t.whatsappMessages.greeting;
    const url = buildWhatsAppUrl(settings.whatsappNumber, greeting);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleExplore = () => {
    const el = document.querySelector('#collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative bg-[#171717] text-white overflow-hidden">
      {/* Decorative background image overlay */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src={heroImage}
          alt="Janapriya Men's Fashion and Tailoring"
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-75 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#171717] via-[#171717]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-2xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B89A62]/20 border border-[#B89A62]/40 text-[#D4BC88] text-xs font-semibold uppercase tracking-[0.2em] mb-6">
            <span className="w-1.5 h-1.5 bg-[#B89A62] rounded-full"></span>
            <span>{t.hero.eyebrow}</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F8F5EF] leading-[1.1] mb-6">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#D6D3D1] leading-relaxed mb-8 max-w-xl">
            {description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
            <button
              onClick={handleExplore}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#B89A62] hover:bg-[#9B7E48] text-[#171717] font-semibold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-lg"
            >
              <span>{t.hero.exploreBtn}</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-[#F8F5EF] border border-[#E9E1D4]/30 font-semibold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer backdrop-blur-sm"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>{t.hero.whatsappBtn}</span>
            </button>

            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[#D4BC88] hover:text-white text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Scissors className="w-4 h-4" />
              <span>{t.hero.tailoringBtn}</span>
            </button>
          </div>

          {/* Key Value Highlights */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {t.hero.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-[#A8A29E]">
                <CheckCircle2 className="w-4 h-4 text-[#B89A62] shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ShieldCheck, HeartHandshake, Scissors } from 'lucide-react';
import { SAMPLE_GARMENT_IMAGES } from '../../lib/storageFallback';

export const AboutSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings } = useStore();

  const aboutText = language === 'bn'
    ? (settings.aboutBn || settings.aboutEn || t.about.description)
    : (settings.aboutEn || settings.aboutBn || t.about.description);

  return (
    <section id="about" className="py-24 bg-[#F8F5EF] border-b border-[#E9E1D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Imagery collage */}
          <div className="relative">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden bg-[#E9E1D4] border border-[#D4BC88]/60 shadow-xl">
              <img
                src={SAMPLE_GARMENT_IMAGES.tailoringFabrics}
                alt="Men's tailoring fabrics"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/60 via-transparent to-transparent" />
            </div>

            {/* Overlapping craft accent card */}
            <div className="hidden sm:block absolute -bottom-6 -right-2 sm:right-6 bg-[#171717] text-white p-5 border border-[#B89A62]/40 shadow-xl max-w-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#B89A62] text-[#171717] flex items-center justify-center font-bold">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-display text-sm font-bold tracking-wide">
                    {language === 'bn' ? 'দক্ষ কারিগরি' : 'Master Tailoring'}
                  </div>
                  <div className="text-[10px] text-[#A8A29E] uppercase tracking-wider">
                    {language === 'bn' ? 'সঠিক মাপ ও ফিনিশিং' : 'Artisanal precision'}
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#D6D3D1] leading-relaxed">
                {language === 'bn'
                  ? 'প্রতিটি শার্ট ও প্যান্টের নিখুঁত ফিটিং আমাদের প্রধান অগ্রাধিকার।'
                  : 'Every seam and collar cut to contour your silhouette with natural comfort.'}
              </p>
            </div>
          </div>

          {/* Copy and 3 Pillars */}
          <div className="space-y-8">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B89A62] mb-3">
                {t.about.eyebrow}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#171717] mb-5">
                {t.about.title}
              </h2>
              <p className="text-sm sm:text-base text-[#68645E] leading-relaxed whitespace-pre-line">
                {aboutText}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#E9E1D4]">
              {t.about.pillars.map((pillar, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="w-8 h-8 bg-[#E9E1D4] text-[#B89A62] flex items-center justify-center font-semibold text-xs border border-[#D4BC88]/50">
                    0{idx + 1}
                  </div>
                  <h4 className="font-semibold text-sm text-[#171717]">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-[#68645E] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

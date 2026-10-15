import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { TailoringService } from '../../types';
import { Scissors, Ruler, Sparkles, MessageCircle, Calendar } from 'lucide-react';
import { buildWhatsAppUrl, SAMPLE_GARMENT_IMAGES } from '../../lib/storageFallback';

export const TailoringSection: React.FC = () => {
  const { language, t, formatPrice } = useLanguage();
  const { services, setIsAppointmentModalOpen, setPreselectedService, settings } = useStore();

  const handleBookService = (service: TailoringService) => {
    setPreselectedService(service);
    setIsAppointmentModalOpen(true);
  };

  const handleWhatsAppService = (service: TailoringService) => {
    const serviceTitle = language === 'bn' ? service.titleBn : service.titleEn;
    const msgTemplate = t.whatsappMessages.serviceEnquiry;
    const msg = msgTemplate.replace('{serviceName}', serviceTitle);
    const url = buildWhatsAppUrl(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="tailoring" className="py-24 bg-[#171717] text-white relative overflow-hidden">
      {/* Background graphic */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B89A62]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#292824] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#B89A62] mb-3">
              <Scissors className="w-3.5 h-3.5" />
              <span>{t.tailoring.eyebrow}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F8F5EF]">
              {t.tailoring.title}
            </h2>
          </div>
          <div className="mt-4 md:mt-0 max-w-md">
            <p className="text-sm text-[#A8A29E] leading-relaxed">
              {t.tailoring.subtitle}
            </p>
          </div>
        </div>

        {/* Tailoring Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => {
            const title = language === 'bn' ? service.titleBn : service.titleEn;
            const desc = language === 'bn' ? service.descriptionBn : service.descriptionEn;

            return (
              <div
                key={service.id || index}
                className="bg-[#21201D] border border-[#33312B] hover:border-[#B89A62]/60 p-7 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-[#B89A62]/10 border border-[#B89A62]/30 flex items-center justify-center text-[#B89A62] group-hover:bg-[#B89A62] group-hover:text-[#171717] transition-all">
                      <Scissors className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono text-[#78716C]">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#F8F5EF] group-hover:text-[#D4BC88] transition-colors mb-2">
                    {title}
                  </h3>

                  <p className="text-xs text-[#A8A29E] leading-relaxed mb-6">
                    {desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#33312B] space-y-4">
                  {/* Price info */}
                  <div className="text-xs font-semibold text-[#D4BC88]">
                    {service.pricingMode === 'fixed' && service.priceInr ? (
                      <span>{t.tailoring.pricingModeFixed.replace('{price}', service.priceInr.toLocaleString('en-IN'))}</span>
                    ) : (
                      <span>{t.tailoring.pricingModeEnquiry}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBookService(service)}
                      className="flex-1 py-2.5 px-3 bg-[#B89A62] hover:bg-[#9B7E48] text-[#171717] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t.tailoring.bookFitting}</span>
                    </button>
                    <button
                      onClick={() => handleWhatsAppService(service)}
                      className="p-2.5 bg-white/10 hover:bg-[#25D366] text-[#25D366] hover:text-white transition-colors cursor-pointer"
                      title="Enquire on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tailoring consultation feature banner */}
        <div className="bg-[#24221D] border border-[#3D3A32] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#B89A62]/20 border border-[#B89A62]/40 text-[#D4BC88] shrink-0">
              <Ruler className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display text-lg font-bold text-[#F8F5EF] mb-1">
                {language === 'bn' ? 'ব্যক্তিগত মাপ ও পরামর্শ' : 'Bespoke Fittings & Fabric Consultation'}
              </h4>
              <p className="text-xs sm:text-sm text-[#A8A29E] max-w-xl">
                {t.tailoring.consultationNotice}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setPreselectedService(null);
              setIsAppointmentModalOpen(true);
            }}
            className="w-full md:w-auto shrink-0 px-6 py-3.5 bg-white text-[#171717] hover:bg-[#B89A62] font-semibold text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            {t.tailoring.bookFitting}
          </button>
        </div>
      </div>
    </section>
  );
};

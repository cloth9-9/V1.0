import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { MapPin, Phone, Clock, MessageCircle, Shield, Scissors } from 'lucide-react';
import { buildWhatsAppUrl } from '../../lib/storageFallback';

interface FooterProps {
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  const { language, t } = useLanguage();
  const { settings, categories, services, setSelectedCategory } = useStore();

  const handleWhatsApp = () => {
    const greeting = t.whatsappMessages.greeting;
    const url = buildWhatsAppUrl(settings.whatsappNumber, greeting);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    const el = document.querySelector('#collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#171717] text-[#E9E1D4] pt-16 pb-12 border-t border-[#292824]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#B89A62] block"></span>
              <div>
                <span className="font-display text-xl font-bold tracking-wider text-white uppercase block leading-none">
                  {language === 'bn' ? 'জনপ্রিয়' : 'JANAPRIYA'}
                </span>
                <span className="text-[10px] tracking-[0.25em] font-medium text-[#B89A62] uppercase block mt-0.5">
                  {language === 'bn' ? 'গার্মেন্টস অ্যান্ড ক্লোদিং' : 'GARMENTS & CLOTHING'}
                </span>
              </div>
            </div>
            <p className="text-sm text-[#A8A29E] leading-relaxed">
              {t.footer.aboutText}
            </p>
            <div className="pt-2">
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#25D366]/20 border border-[#25D366]/50 hover:bg-[#25D366]/30 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{t.nav.whatsappBtn}</span>
              </button>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B89A62] mb-4">
              {t.footer.categories}
            </h4>
            <ul className="space-y-2.5 text-sm text-[#D6D3D1]">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {language === 'bn' ? cat.nameBn : cat.nameEn}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tailoring Services */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B89A62] mb-4">
              {t.footer.services}
            </h4>
            <ul className="space-y-2.5 text-sm text-[#D6D3D1]">
              {services.slice(0, 5).map((srv) => (
                <li key={srv.id} className="flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-[#B89A62] shrink-0" />
                  <span>{language === 'bn' ? srv.titleBn : srv.titleEn}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Showroom & Hours */}
          <div className="space-y-3.5">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B89A62] mb-4">
              {t.footer.contactInfo}
            </h4>
            {settings.address && (
              <div className="flex items-start gap-2.5 text-sm text-[#A8A29E]">
                <MapPin className="w-4 h-4 text-[#B89A62] shrink-0 mt-0.5" />
                <span>
                  {settings.address}
                  {settings.cityPostal && `, ${settings.cityPostal}`}
                </span>
              </div>
            )}
            {settings.phone && (
              <div className="flex items-center gap-2.5 text-sm text-[#A8A29E]">
                <Phone className="w-4 h-4 text-[#B89A62] shrink-0" />
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </div>
            )}
            {settings.openingHours && (
              <div className="flex items-start gap-2.5 text-sm text-[#A8A29E]">
                <Clock className="w-4 h-4 text-[#B89A62] shrink-0 mt-0.5" />
                <span>{settings.openingHours}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#292824] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
          <div>
            © {currentYear} {settings.brandName}. {t.footer.rights}
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[#B89A62]">{t.footer.bilingualNote}</span>
            <button
              onClick={onAdminClick}
              className="inline-flex items-center gap-1.5 text-[#A8A29E] hover:text-[#B89A62] transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t.footer.adminLink}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

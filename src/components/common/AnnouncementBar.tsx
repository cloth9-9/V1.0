import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { Phone, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { language } = useLanguage();
  const { settings } = useStore();

  const announcementText = language === 'bn'
    ? (settings.announcementBn || settings.announcementEn)
    : (settings.announcementEn || settings.announcementBn);

  if (!announcementText) return null;

  return (
    <div className="bg-[#171717] text-[#E9E1D4] text-xs py-2 px-4 border-b border-[#292824]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <div className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#B89A62] shrink-0" />
          <span>{announcementText}</span>
        </div>
        {settings.phone && (
          <a
            href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
            className="inline-flex items-center gap-1.5 text-[#D4BC88] hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span>{settings.phone}</span>
          </a>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { buildWhatsAppUrl } from '../../lib/storageFallback';
import {
  Menu,
  X,
  MessageCircle,
  Globe,
  Scissors,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  currentView: 'store' | 'admin';
  setCurrentView: (view: 'store' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { settings } = useStore();
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.shop, href: '#collection' },
    { label: t.nav.categories, href: '#categories' },
    { label: t.nav.tailoring, href: '#tailoring' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.reviews, href: '#reviews' },
    { label: t.nav.contact, href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'store') {
      setCurrentView('store');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppGeneral = () => {
    const greeting = t.whatsappMessages.greeting;
    const url = buildWhatsAppUrl(settings.whatsappNumber, greeting);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F8F5EF]/95 backdrop-blur-md shadow-sm border-b border-[#E9E1D4]'
          : 'bg-[#F8F5EF] border-b border-[#E9E1D4]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Wordmark */}
          <div
            onClick={() => {
              setCurrentView('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer group py-2"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#B89A62] block group-hover:scale-y-110 transition-transform duration-300"></span>
              <div>
                <span className="font-display text-xl sm:text-2xl font-bold tracking-wider text-[#171717] uppercase block leading-none">
                  {language === 'bn' ? 'জনপ্রিয়' : 'JANAPRIYA'}
                </span>
                <span className="text-[10px] sm:text-xs tracking-[0.25em] font-medium text-[#B89A62] uppercase block mt-0.5">
                  {language === 'bn' ? 'গার্মেন্টস অ্যান্ড ক্লোদিং' : 'GARMENTS & CLOTHING'}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="text-sm font-medium text-[#292824] hover:text-[#B89A62] transition-colors relative py-1 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Buttons: Language Switcher, WhatsApp, Admin shortcut */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#171717] bg-[#E9E1D4]/60 hover:bg-[#E9E1D4] border border-[#D4BC88]/60 transition-all cursor-pointer rounded-none"
              title="Toggle English / বাংলা"
              aria-label="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#B89A62]" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsAppGeneral}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#171717] hover:bg-[#292824] transition-all cursor-pointer shadow-sm rounded-none border border-[#171717]"
              title="Enquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>{t.nav.whatsappBtn}</span>
            </button>

            {/* Admin Portal Toggle */}
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'store' : 'admin')}
              className={`p-2 transition-all cursor-pointer border ${
                currentView === 'admin'
                  ? 'bg-[#171717] text-[#B89A62] border-[#171717]'
                  : 'bg-transparent text-[#68645E] hover:text-[#171717] border-[#E9E1D4] hover:border-[#D4BC88]'
              }`}
              title={currentView === 'admin' ? 'View Storefront' : 'Admin Portal'}
              aria-label="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-semibold text-[#171717] bg-[#E9E1D4] border border-[#D4BC88]/50"
            >
              {language === 'en' ? 'বাং' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#171717] hover:text-[#B89A62] transition-colors"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#F8F5EF] border-b border-[#E9E1D4] px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="flex items-center justify-between text-left py-2.5 px-3 text-sm font-medium text-[#292824] hover:bg-[#E9E1D4]/50 border-b border-[#E9E1D4]/60"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-[#B89A62]" />
              </button>
            ))}
          </div>

          <div className="pt-3 flex flex-col gap-2.5">
            <button
              onClick={handleWhatsAppGeneral}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold tracking-wider text-white bg-[#171717] uppercase"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>{t.nav.whatsappBtn}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCurrentView(currentView === 'admin' ? 'store' : 'admin');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-[#68645E] border border-[#E9E1D4] hover:bg-[#E9E1D4]"
            >
              <ShieldCheck className="w-4 h-4 text-[#B89A62]" />
              <span>{currentView === 'admin' ? t.admin.switchStore : t.nav.admin}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

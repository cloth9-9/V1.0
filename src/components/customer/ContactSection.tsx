import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { createEnquiry } from '../../services/dbService';
import { buildWhatsAppUrl } from '../../lib/storageFallback';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your name.');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg(language === 'bn' ? 'সঠিক ফোন নম্বর লিখুন (কমপক্ষে ১০ ডিজিট)।' : 'Please enter a valid phone number (at least 10 digits).');
      return;
    }
    if (!message.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে বার্তা লিখুন।' : 'Please enter your message.');
      return;
    }

    setSubmitting(true);
    try {
      await createEnquiry({
        customerName: customerName.trim(),
        phone: phone.trim(),
        message: message.trim(),
        language
      });
      setSubmitted(true);
      setCustomerName('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      console.error('Enquiry error:', err);
      setErrorMsg(err.message || 'Unable to submit enquiry. Please reach out via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppChat = () => {
    const greeting = t.whatsappMessages.greeting;
    const url = buildWhatsAppUrl(settings.whatsappNumber, greeting);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="py-24 bg-[#F8F5EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B89A62] mb-2">
            {t.contact.eyebrow}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#171717] mb-3">
            {t.contact.title}
          </h2>
          <p className="text-sm text-[#68645E]">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct Contact Info Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Phone Card */}
            {settings.phone && (
              <div className="bg-white p-5 border border-[#E9E1D4] flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-[#E9E1D4] text-[#B89A62] flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-[#68645E]">
                      {t.contact.phone}
                    </div>
                    <div className="text-sm font-bold text-[#171717]">
                      {settings.phone}
                    </div>
                  </div>
                </div>
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-3.5 py-1.5 bg-[#171717] hover:bg-[#292824] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  {t.contact.directCall}
                </a>
              </div>
            )}

            {/* WhatsApp Card */}
            {settings.whatsappNumber && (
              <div className="bg-white p-5 border border-[#E9E1D4] flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-[#68645E]">
                      {t.contact.whatsapp}
                    </div>
                    <div className="text-sm font-bold text-[#171717]">
                      {settings.whatsappNumber}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleWhatsAppChat}
                  className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Chat
                </button>
              </div>
            )}

            {/* Address Card */}
            {settings.address && (
              <div className="bg-white p-5 border border-[#E9E1D4] shadow-sm space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-[#E9E1D4] text-[#B89A62] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-[#68645E]">
                      {t.contact.address}
                    </div>
                    <div className="text-sm text-[#171717] mt-0.5 leading-snug">
                      {settings.address}
                      {settings.cityPostal && <span className="block text-xs text-[#68645E] mt-0.5">{settings.cityPostal}</span>}
                    </div>
                  </div>
                </div>

                {settings.mapUrl && (
                  <a
                    href={settings.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B89A62] hover:text-[#9B7E48] transition-colors"
                  >
                    <span>{t.contact.getDirections}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Opening Hours Card */}
            {settings.openingHours && (
              <div className="bg-white p-5 border border-[#E9E1D4] flex items-start gap-3.5 shadow-sm">
                <div className="w-10 h-10 bg-[#E9E1D4] text-[#B89A62] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-[#68645E]">
                    {t.contact.hours}
                  </div>
                  <div className="text-sm text-[#171717] mt-0.5 leading-snug">
                    {settings.openingHours}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Direct Message / Enquiry Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-9 border border-[#E9E1D4] shadow-sm">
            <h3 className="font-display text-xl font-bold text-[#171717] mb-1">
              {t.contact.sendMessageTitle}
            </h3>
            <p className="text-xs text-[#68645E] mb-6">
              {t.contact.sendMessageSubtitle}
            </p>

            {submitted ? (
              <div className="p-6 bg-[#F8F5EF] border border-[#B89A62]/40 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-[#16A34A] mx-auto" />
                <h4 className="font-semibold text-sm text-[#171717]">
                  {t.contact.sentSuccess}
                </h4>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  {language === 'bn' ? 'আরেকটি বার্তা পাঠান' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                      {t.contact.name} *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. S. Sen"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                      {t.appointment.phoneLabel} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9830123456"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    {t.contact.message} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.contact.messagePlaceholder}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62] focus:bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#171717] hover:bg-[#292824] text-white font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-[#B89A62]" />
                    <span>{submitting ? t.contact.sending : t.contact.sendBtn}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

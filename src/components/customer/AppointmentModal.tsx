import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { createAppointment } from '../../services/dbService';
import { buildWhatsAppUrl } from '../../lib/storageFallback';
import { X, Calendar, Clock, CheckCircle2, AlertCircle, MessageCircle, Scissors } from 'lucide-react';

export const AppointmentModal: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    isAppointmentModalOpen,
    setIsAppointmentModalOpen,
    services,
    preselectedService,
    settings
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedTime, setRequestedTime] = useState('Morning (10:30 AM - 1:00 PM)');
  const [serviceId, setServiceId] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Set today as minimum selectable date
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (preselectedService) {
      setServiceId(preselectedService.id);
    } else if (services.length > 0 && !serviceId) {
      setServiceId(services[0].id);
    }
  }, [preselectedService, services, serviceId]);

  // Keyboard Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAppointmentModalOpen(false);
      }
    };
    if (isAppointmentModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isAppointmentModalOpen, setIsAppointmentModalOpen]);

  if (!isAppointmentModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!customerName.trim()) {
      setErrorMsg(t.appointment.errors.nameRequired);
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg(t.appointment.errors.phoneRequired);
      return;
    }
    if (!requestedDate) {
      setErrorMsg(t.appointment.errors.dateRequired);
      return;
    }
    if (requestedDate < todayStr) {
      setErrorMsg(t.appointment.errors.pastDate);
      return;
    }
    if (!requestedTime) {
      setErrorMsg(t.appointment.errors.timeRequired);
      return;
    }

    setSubmitting(true);
    try {
      const selectedServiceObj = services.find((s) => s.id === serviceId);
      const serviceName = selectedServiceObj
        ? (language === 'bn' ? selectedServiceObj.titleBn : selectedServiceObj.titleEn)
        : 'Tailoring Service';

      await createAppointment({
        customerName: customerName.trim(),
        phone: phone.trim(),
        requestedDate,
        requestedTime,
        serviceId,
        serviceName,
        language,
        customerNotes: customerNotes.trim()
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error('Appointment error:', err);
      setErrorMsg(err.message || 'Unable to submit appointment request. Please contact us via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppConfirmation = () => {
    const selectedServiceObj = services.find((s) => s.id === serviceId);
    const serviceName = selectedServiceObj
      ? (language === 'bn' ? selectedServiceObj.titleBn : selectedServiceObj.titleEn)
      : 'Tailoring Consultation';

    const msgTemplate = t.whatsappMessages.appointmentEnquiry;
    const msg = msgTemplate
      .replace('{name}', customerName)
      .replace('{service}', serviceName)
      .replace('{date}', requestedDate)
      .replace('{time}', requestedTime)
      .replace('{notes}', customerNotes || 'None');

    const url = buildWhatsAppUrl(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setCustomerName('');
    setPhone('');
    setRequestedDate('');
    setCustomerNotes('');
    setIsAppointmentModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-[#F8F5EF] w-full max-w-lg border border-[#E9E1D4] shadow-2xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-appointment-title"
      >
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 text-[#68645E] hover:text-[#171717] transition-colors"
          aria-label={t.appointment.closeBtn}
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-[#16A34A]/10 text-[#16A34A] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#171717]">
              {t.appointment.successTitle}
            </h3>
            <p className="text-sm text-[#68645E] leading-relaxed max-w-md mx-auto">
              {t.appointment.successDesc}
            </p>

            <div className="pt-4 flex flex-col gap-2.5">
              <button
                onClick={handleWhatsAppConfirmation}
                className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.appointment.whatsappFollowUp}</span>
              </button>
              <button
                onClick={handleResetAndClose}
                className="w-full py-2.5 px-4 bg-[#E9E1D4] hover:bg-[#D4BC88] text-[#171717] font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                {t.appointment.closeBtn}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#B89A62] mb-1">
              <Scissors className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'সেলাই পরামর্শ' : 'TAILORING CONSULTATION'}</span>
            </div>
            <h3 id="modal-appointment-title" className="font-display text-2xl font-bold text-[#171717] mb-2">
              {t.tailoring.bookModalTitle}
            </h3>
            <p className="text-xs text-[#68645E] mb-6">
              {t.tailoring.bookModalSubtitle}
            </p>

            {errorMsg && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                  {t.appointment.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t.appointment.namePlaceholder}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
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
                  placeholder={t.appointment.phonePlaceholder}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    {t.appointment.dateLabel} *
                  </label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    {t.appointment.timeLabel} *
                  </label>
                  <select
                    value={requestedTime}
                    onChange={(e) => setRequestedTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  >
                    <option value="Morning (10:30 AM - 1:00 PM)">{t.appointment.timeMorning}</option>
                    <option value="Afternoon (1:00 PM - 5:00 PM)">{t.appointment.timeAfternoon}</option>
                    <option value="Evening (5:00 PM - 8:30 PM)">{t.appointment.timeEvening}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                  {t.appointment.serviceLabel}
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {language === 'bn' ? s.titleBn : s.titleEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                  {t.appointment.notesLabel}
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder={t.appointment.notesPlaceholder}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 bg-[#171717] hover:bg-[#292824] text-white font-semibold text-xs uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? t.appointment.submitting : t.appointment.submitBtn}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

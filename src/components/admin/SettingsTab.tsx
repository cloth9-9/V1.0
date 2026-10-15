import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { SiteSettings } from '../../types';
import { saveSiteSettings } from '../../services/dbService';
import { Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings, refreshStore } = useStore();

  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(false);

    try {
      await saveSiteSettings(formData);
      await refreshStore();
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3500);
    } catch (err: any) {
      console.error('Settings save error:', err);
      setErrorMsg(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 border border-[#E9E1D4] shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-[#171717]">
            {language === 'bn' ? 'স্টোর সেটিংস ও তথ্য পরিচালনা' : 'Storefront Settings & Content'}
          </h2>
          <p className="text-xs text-[#68645E]">
            {language === 'bn'
              ? 'এখানে সংরক্ষিত পরিবর্তনগুলো সাথে সাথে গ্রাহকদের ওয়েবসাইটে প্রদর্শিত হবে।'
              : 'Changes saved here appear immediately on the customer-facing storefront.'}
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>{t.admin.actions.saved}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 border border-[#E9E1D4] shadow-sm space-y-6 text-xs">
        {/* Brand Information */}
        <div className="border-b border-[#E9E1D4] pb-6 space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-[#B89A62]">
            1. Brand Identity
          </h3>
          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
              Brand Name
            </label>
            <input
              type="text"
              required
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
            />
          </div>
        </div>

        {/* Hero Section */}
        <div className="border-b border-[#E9E1D4] pb-6 space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-[#B89A62]">
            2. Hero Section (Bilingual)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                Hero Headline (English)
              </label>
              <input
                type="text"
                value={formData.heroTitleEn}
                onChange={(e) => setFormData({ ...formData, heroTitleEn: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                Hero Headline (Bengali)
              </label>
              <input
                type="text"
                value={formData.heroTitleBn}
                onChange={(e) => setFormData({ ...formData, heroTitleBn: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                Hero Description (English)
              </label>
              <textarea
                rows={2}
                value={formData.heroDescriptionEn}
                onChange={(e) => setFormData({ ...formData, heroDescriptionEn: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                Hero Description (Bengali)
              </label>
              <textarea
                rows={2}
                value={formData.heroDescriptionBn}
                onChange={(e) => setFormData({ ...formData, heroDescriptionBn: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
              Hero Background Image URL
            </label>
            <input
              type="url"
              value={formData.heroImageUrl}
              onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
            />
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="border-b border-[#E9E1D4] pb-6 space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-[#B89A62]">
            3. Announcement Banner (Bilingual)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                Announcement (English)
              </label>
              <input
                type="text"
                value={formData.announcementEn}
                onChange={(e) => setFormData({ ...formData, announcementEn: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                Announcement (Bengali)
              </label>
              <input
                type="text"
                value={formData.announcementBn}
                onChange={(e) => setFormData({ ...formData, announcementBn: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & Location */}
        <div className="border-b border-[#E9E1D4] pb-6 space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-[#B89A62]">
            4. Contact & Location
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                WhatsApp Order Number
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                Showroom Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                City / Postal Code
              </label>
              <input
                type="text"
                value={formData.cityPostal}
                onChange={(e) => setFormData({ ...formData, cityPostal: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
              Opening Hours
            </label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                Google Maps Link
              </label>
              <input
                type="url"
                value={formData.mapUrl}
                onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                Google Review Page Link
              </label>
              <input
                type="url"
                value={formData.reviewUrl}
                onChange={(e) => setFormData({ ...formData, reviewUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="pb-4 space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-[#B89A62]">
            5. About Story (Bilingual)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                About Janapriya (English)
              </label>
              <textarea
                rows={3}
                value={formData.aboutEn}
                onChange={(e) => setFormData({ ...formData, aboutEn: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                About Janapriya (Bengali)
              </label>
              <textarea
                rows={3}
                value={formData.aboutBn}
                onChange={(e) => setFormData({ ...formData, aboutBn: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-[#E9E1D4] flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#171717] hover:bg-[#292824] text-white text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#B89A62]" />
            <span>{saving ? 'Saving Changes...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

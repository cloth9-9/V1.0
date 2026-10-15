import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { TailoringService, PricingMode } from '../../types';
import { saveService, deleteService } from '../../services/dbService';
import { Plus, Edit2, Trash2, X, Scissors, AlertCircle } from 'lucide-react';

export const ServicesTab: React.FC = () => {
  const { language, t, formatPrice } = useLanguage();
  const { services, refreshStore } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<TailoringService> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    id?: string;
    titleEn: string;
    titleBn: string;
    descriptionEn: string;
    descriptionBn: string;
    priceInr: number;
    pricingMode: PricingMode;
    sortOrder: number;
    published: boolean;
  }>({
    titleEn: '',
    titleBn: '',
    descriptionEn: '',
    descriptionBn: '',
    priceInr: 350,
    pricingMode: 'fixed',
    sortOrder: 1,
    published: true
  });

  const handleOpenAdd = () => {
    setFormData({
      titleEn: '',
      titleBn: '',
      descriptionEn: '',
      descriptionBn: '',
      priceInr: 350,
      pricingMode: 'fixed',
      sortOrder: services.length + 1,
      published: true
    });
    setEditingService(null);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: TailoringService) => {
    setFormData({
      id: s.id,
      titleEn: s.titleEn,
      titleBn: s.titleBn,
      descriptionEn: s.descriptionEn,
      descriptionBn: s.descriptionBn,
      priceInr: s.priceInr || 0,
      pricingMode: s.pricingMode || 'fixed',
      sortOrder: s.sortOrder || 1,
      published: s.published
    });
    setEditingService(s);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (s: TailoringService) => {
    const sTitle = language === 'bn' ? s.titleBn : s.titleEn;
    if (!window.confirm(`Are you sure you want to delete service "${sTitle}"?`)) {
      return;
    }
    try {
      await deleteService(s.id);
      await refreshStore();
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.titleEn.trim() || !formData.titleBn.trim()) {
      setErrorMsg('Both English and Bengali service titles are required.');
      return;
    }

    setSubmitting(true);
    try {
      const servicePayload: Partial<TailoringService> = {
        titleEn: formData.titleEn.trim(),
        titleBn: formData.titleBn.trim(),
        descriptionEn: formData.descriptionEn.trim(),
        descriptionBn: formData.descriptionBn.trim(),
        pricingMode: formData.pricingMode,
        sortOrder: Number(formData.sortOrder),
        published: formData.published
      };
      if (formData.id) {
        servicePayload.id = formData.id;
      }
      if (formData.pricingMode === 'fixed' && formData.priceInr !== undefined && formData.priceInr !== null) {
        servicePayload.priceInr = Number(formData.priceInr);
      }

      await saveService(servicePayload);

      setIsModalOpen(false);
      await refreshStore();
    } catch (err: any) {
      console.error('Save service error:', err);
      setErrorMsg(err.message || 'Error saving service.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 border border-[#E9E1D4] shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-[#171717]">
            {language === 'bn' ? 'টেইলারিং সেবা ও ফিটিং ব্যবস্থাপনা' : 'Tailoring & Stitching Services'}
          </h2>
          <p className="text-xs text-[#68645E]">
            {language === 'bn' ? 'কাস্টম সেলাই সেবা, দর ও বিবরণ কনফিগার করুন।' : 'Manage custom stitching, alteration charges, and descriptions.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#171717] hover:bg-[#292824] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#B89A62]" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white border border-[#E9E1D4] shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs text-[#292824]">
          <thead className="bg-[#F8F5EF] text-[#68645E] uppercase tracking-wider text-[10px] border-b border-[#E9E1D4]">
            <tr>
              <th className="py-3 px-4">Service Title (EN / BN)</th>
              <th className="py-3 px-4">Pricing Mode</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4 text-center">Sort Order</th>
              <th className="py-3 px-4 text-center">Published</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9E1D4]">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-[#F8F5EF]/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-[#171717] flex items-center gap-2">
                    <Scissors className="w-3.5 h-3.5 text-[#B89A62]" />
                    <span>{s.titleEn}</span>
                  </div>
                  <div className="text-[11px] text-[#B89A62] ml-5.5">{s.titleBn}</div>
                  <div className="text-[11px] text-[#68645E] mt-1 ml-5.5 line-clamp-1">{s.descriptionEn}</div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold ${
                      s.pricingMode === 'fixed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {s.pricingMode === 'fixed' ? 'Fixed Rate' : 'Enquiry Only'}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-[#171717]">
                  {s.pricingMode === 'fixed' && s.priceInr ? formatPrice(s.priceInr) : 'On Request'}
                </td>
                <td className="py-3 px-4 text-center font-mono">
                  {s.sortOrder || 1}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold ${
                      s.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {s.published ? 'Live' : 'Hidden'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="p-1.5 text-[#68645E] hover:text-[#171717] hover:bg-[#E9E1D4] transition-colors"
                      title="Edit Service"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(s)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="relative bg-[#F8F5EF] w-full max-w-lg border border-[#E9E1D4] shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#68645E] hover:text-[#171717]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-xl font-bold text-[#171717] mb-5">
              {editingService ? 'Edit Tailoring Service' : 'Add Tailoring Service'}
            </h3>

            {errorMsg && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                  Service Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="e.g. Formal Shirt Stitching"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                  Service Title (Bengali) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.titleBn}
                  onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                  placeholder="উদা: ফরমাল শার্ট সেলাই"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                  Description (English)
                </label>
                <textarea
                  rows={2}
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  placeholder="Crafting details, fit, turnaround time..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                  Description (Bengali)
                </label>
                <textarea
                  rows={2}
                  value={formData.descriptionBn}
                  onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                  placeholder="সেলাইয়ের বিবরণ ও সময়..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    Pricing Mode
                  </label>
                  <select
                    value={formData.pricingMode}
                    onChange={(e) => setFormData({ ...formData, pricingMode: e.target.value as PricingMode })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  >
                    <option value="fixed">Fixed Price (INR)</option>
                    <option value="enquiry_only">Contact for Pricing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    Price (₹) {formData.pricingMode === 'enquiry_only' && '(Ignored)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    disabled={formData.pricingMode === 'enquiry_only'}
                    value={formData.priceInr}
                    onChange={(e) => setFormData({ ...formData, priceInr: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62] disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="rounded-none accent-[#B89A62]"
                    />
                    <span className="font-semibold text-[#171717]">Publish on site</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E9E1D4] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#E9E1D4] text-[#171717] font-semibold tracking-wider uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#171717] hover:bg-[#292824] text-white font-semibold tracking-wider uppercase disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

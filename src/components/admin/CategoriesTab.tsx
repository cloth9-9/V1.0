import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import { saveCategory, deleteCategory } from '../../services/dbService';
import { DEFAULT_FALLBACK_IMAGE } from '../../lib/storageFallback';
import { Plus, Edit2, Trash2, X, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const CategoriesTab: React.FC = () => {
  const { language, t } = useLanguage();
  const { categories, refreshStore } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    nameEn: '',
    nameBn: '',
    slug: '',
    imageUrl: '',
    sortOrder: 1,
    published: true
  });

  const handleOpenAdd = () => {
    setFormData({
      id: '',
      nameEn: '',
      nameBn: '',
      slug: '',
      imageUrl: DEFAULT_FALLBACK_IMAGE,
      sortOrder: categories.length + 1,
      published: true
    });
    setEditingCategory(null);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setFormData({
      id: c.id,
      nameEn: c.nameEn,
      nameBn: c.nameBn,
      slug: c.slug,
      imageUrl: c.imageUrl || DEFAULT_FALLBACK_IMAGE,
      sortOrder: c.sortOrder || 1,
      published: c.published
    });
    setEditingCategory(c);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (c: Category) => {
    const cName = language === 'bn' ? c.nameBn : c.nameEn;
    if (!window.confirm(`Are you sure you want to delete category "${cName}"?`)) {
      return;
    }
    try {
      await deleteCategory(c.id);
      await refreshStore();
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.nameEn.trim() || !formData.nameBn.trim()) {
      setErrorMsg('Both English and Bengali names are required.');
      return;
    }
    if (!formData.slug.trim()) {
      setErrorMsg('Category slug is required.');
      return;
    }

    setSubmitting(true);
    try {
      const catPayload: Partial<Category> = {
        nameEn: formData.nameEn.trim(),
        nameBn: formData.nameBn.trim(),
        slug: formData.slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-'),
        imageUrl: formData.imageUrl.trim() || DEFAULT_FALLBACK_IMAGE,
        sortOrder: Number(formData.sortOrder),
        published: formData.published
      };
      if (formData.id) {
        catPayload.id = formData.id;
      }

      await saveCategory(catPayload);

      setIsModalOpen(false);
      await refreshStore();
    } catch (err: any) {
      console.error('Save category error:', err);
      setErrorMsg(err.message || 'Error saving category.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 border border-[#E9E1D4] shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-[#171717]">
            {language === 'bn' ? 'পোশাকের ক্যাটাগরি ব্যবস্থাপনা' : 'Category Management'}
          </h2>
          <p className="text-xs text-[#68645E]">
            {language === 'bn' ? 'ক্যাটাগরি তৈরি, সম্পাদনা ও ওয়েবসাইটে প্রকাশ করুন।' : 'Add, reorder, and configure garment categories.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#171717] hover:bg-[#292824] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#B89A62]" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-[#E9E1D4] shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs text-[#292824]">
          <thead className="bg-[#F8F5EF] text-[#68645E] uppercase tracking-wider text-[10px] border-b border-[#E9E1D4]">
            <tr>
              <th className="py-3 px-4">Preview</th>
              <th className="py-3 px-4">Category Name (EN / BN)</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4 text-center">Sort Order</th>
              <th className="py-3 px-4 text-center">Published</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9E1D4]">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-[#F8F5EF]/50 transition-colors">
                <td className="py-3 px-4">
                  <img
                    src={c.imageUrl || DEFAULT_FALLBACK_IMAGE}
                    alt=""
                    className="w-12 h-10 object-cover bg-[#E9E1D4] border border-[#E9E1D4]"
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-[#171717]">{c.nameEn}</div>
                  <div className="text-[11px] text-[#B89A62]">{c.nameBn}</div>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-[#68645E]">
                  {c.slug}
                </td>
                <td className="py-3 px-4 text-center font-mono">
                  {c.sortOrder || 1}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold ${
                      c.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {c.published ? 'Live' : 'Hidden'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="p-1.5 text-[#68645E] hover:text-[#171717] hover:bg-[#E9E1D4] transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Delete Category"
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
              {editingCategory ? 'Edit Category' : 'Add Category'}
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
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameEn}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      nameEn: val,
                      slug: formData.slug || val.toLowerCase().replace(/[^a-z0-9]/g, '-')
                    });
                  }}
                  placeholder="e.g. Formal Shirts"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                  Category Name (Bengali) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameBn}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  placeholder="উদা: ফরমাল শার্ট"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. shirts"
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  />
                </div>
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
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                />
              </div>

              <div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded-none accent-[#B89A62]"
                  />
                  <span className="font-semibold text-[#171717]">Publish to storefront</span>
                </label>
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
                  {submitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

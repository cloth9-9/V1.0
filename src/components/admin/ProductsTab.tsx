import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { saveProduct, deleteProduct } from '../../services/dbService';
import { DEFAULT_FALLBACK_IMAGE, LOCAL_PROJECT_IMAGES } from '../../lib/storageFallback';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  Star,
  Search,
  SlidersHorizontal,
  Image as ImageIcon,
  Info
} from 'lucide-react';

export const ProductsTab: React.FC = () => {
  const { language, t, formatPrice } = useLanguage();
  const { products, categories, refreshStore } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form local state
  const [formData, setFormData] = useState<{
    id?: string;
    nameEn: string;
    nameBn: string;
    descriptionEn: string;
    descriptionBn: string;
    categoryId: string;
    sku: string;
    priceInr: number;
    compareAtPriceInr: number;
    stockQuantity: number;
    lowStockThreshold: number;
    sizes: string;
    colors: string;
    imageUrlsText: string;
    published: boolean;
    featured: boolean;
  }>({
    nameEn: '',
    nameBn: '',
    descriptionEn: '',
    descriptionBn: '',
    categoryId: '',
    sku: '',
    priceInr: 999,
    compareAtPriceInr: 0,
    stockQuantity: 10,
    lowStockThreshold: 3,
    sizes: '38, 40, 42, 44',
    colors: 'White, Navy Blue',
    imageUrlsText: '',
    published: true,
    featured: false
  });

  const handleOpenAdd = () => {
    setFormData({
      nameEn: '',
      nameBn: '',
      descriptionEn: '',
      descriptionBn: '',
      categoryId: categories[0]?.slug || 'shirts',
      sku: `JG-${Math.floor(100 + Math.random() * 900)}`,
      priceInr: 999,
      compareAtPriceInr: 0,
      stockQuantity: 10,
      lowStockThreshold: 3,
      sizes: '38, 40, 42, 44',
      colors: 'White, Navy Blue',
      imageUrlsText: DEFAULT_FALLBACK_IMAGE,
      published: true,
      featured: false
    });
    setEditingProduct(null);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setFormData({
      id: p.id,
      nameEn: p.nameEn || '',
      nameBn: p.nameBn || '',
      descriptionEn: p.descriptionEn || '',
      descriptionBn: p.descriptionBn || '',
      categoryId: p.categoryId || (categories[0]?.slug || 'shirts'),
      sku: p.sku || '',
      priceInr: p.priceInr || 0,
      compareAtPriceInr: p.compareAtPriceInr || 0,
      stockQuantity: p.stockQuantity ?? 10,
      lowStockThreshold: p.lowStockThreshold ?? 3,
      sizes: (p.sizes || []).join(', '),
      colors: (p.colors || []).join(', '),
      imageUrlsText: (p.imageUrls || []).join('\n'),
      published: p.published,
      featured: p.featured
    });
    setEditingProduct(p);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (p: Product) => {
    const pName = language === 'bn' ? p.nameBn : p.nameEn;
    if (!window.confirm(`${t.admin.productForm.deleteConfirm}\n\n"${pName}"`)) {
      return;
    }
    try {
      await deleteProduct(p.id);
      await refreshStore();
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.nameEn.trim()) {
      setErrorMsg('Product name in English is required.');
      return;
    }
    if (!formData.nameBn.trim()) {
      setErrorMsg('Product name in Bengali is required.');
      return;
    }
    if (formData.priceInr < 0) {
      setErrorMsg('Price cannot be negative.');
      return;
    }

    setSubmitting(true);
    try {
      const parsedSizes = formData.sizes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const parsedColors = formData.colors
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const parsedImages = formData.imageUrlsText
        .split('\n')
        .map((u) => u.trim())
        .filter((u) => u.startsWith('http') || u.startsWith('/'));

      const productPayload: Partial<Product> = {
        nameEn: formData.nameEn.trim(),
        nameBn: formData.nameBn.trim(),
        descriptionEn: formData.descriptionEn.trim(),
        descriptionBn: formData.descriptionBn.trim(),
        categoryId: formData.categoryId,
        sku: formData.sku.trim(),
        priceInr: Number(formData.priceInr),
        stockQuantity: Number(formData.stockQuantity),
        lowStockThreshold: Number(formData.lowStockThreshold),
        sizes: parsedSizes,
        colors: parsedColors,
        imageUrls: parsedImages.length > 0 ? parsedImages : [DEFAULT_FALLBACK_IMAGE],
        published: formData.published,
        featured: formData.featured
      };

      if (formData.id) {
        productPayload.id = formData.id;
      }
      if (formData.compareAtPriceInr && Number(formData.compareAtPriceInr) > 0) {
        productPayload.compareAtPriceInr = Number(formData.compareAtPriceInr);
      }

      await saveProduct(productPayload);

      setIsModalOpen(false);
      await refreshStore();
    } catch (err: any) {
      console.error('Save product error:', err);
      setErrorMsg(err.message || 'Error saving product to database.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (p: Product) => {
    try {
      await saveProduct({ id: p.id, published: !p.published });
      await refreshStore();
    } catch (err: any) {
      alert(`Update error: ${err.message}`);
    }
  };

  const handleToggleFeature = async (p: Product) => {
    try {
      await saveProduct({ id: p.id, featured: !p.featured });
      await refreshStore();
    } catch (err: any) {
      alert(`Update error: ${err.message}`);
    }
  };

  // Filter products for admin table
  const displayedProducts = products.filter((p) => {
    if (selectedCat && p.categoryId !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        p.nameEn.toLowerCase().includes(q) ||
        p.nameBn.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with Search and Add button */}
      <div className="bg-white p-5 border border-[#E9E1D4] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, SKU..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62]"
            />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 text-xs bg-[#F8F5EF] border border-[#E9E1D4] text-[#292824]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {language === 'bn' ? c.nameBn : c.nameEn}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#171717] hover:bg-[#292824] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#B89A62]" />
          <span>{t.admin.productForm.addTitle}</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E9E1D4] shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs text-[#292824]">
          <thead className="bg-[#F8F5EF] text-[#68645E] uppercase tracking-wider text-[10px] border-b border-[#E9E1D4]">
            <tr>
              <th className="py-3 px-4">Garment</th>
              <th className="py-3 px-4">SKU / Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Featured</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9E1D4]">
            {displayedProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#A8A29E]">
                  No products found. Add your first garment!
                </td>
              </tr>
            ) : (
              displayedProducts.map((p) => {
                const img = p.imageUrls?.[0] || DEFAULT_FALLBACK_IMAGE;
                const categoryObj = categories.find((c) => c.slug === p.categoryId);
                const isOut = p.stockQuantity <= 0;
                const isLow = !isOut && p.stockQuantity <= (p.lowStockThreshold || 3);

                return (
                  <tr key={p.id} className="hover:bg-[#F8F5EF]/50 transition-colors">
                    {/* Image & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={img}
                          alt=""
                          className="w-10 h-12 object-cover bg-[#E9E1D4] border border-[#E9E1D4] shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-[#171717]">{p.nameEn}</div>
                          <div className="text-[11px] text-[#B89A62]">{p.nameBn}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category & SKU */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] text-[#171717]">{p.sku || '—'}</div>
                      <div className="text-[#68645E] text-[11px]">
                        {categoryObj?.nameEn || p.categoryId}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-semibold text-[#171717]">
                      {formatPrice(p.priceInr)}
                      {p.compareAtPriceInr && p.compareAtPriceInr > p.priceInr && (
                        <div className="text-[10px] text-[#A8A29E] line-through font-normal">
                          {formatPrice(p.compareAtPriceInr)}
                        </div>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold ${
                          isOut
                            ? 'bg-red-100 text-red-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {p.stockQuantity} pcs ({isOut ? 'Out' : isLow ? 'Low' : 'OK'})
                      </span>
                    </td>

                    {/* Published Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={`p-1.5 transition-colors cursor-pointer ${
                          p.published
                            ? 'text-[#16A34A] hover:text-[#15803d]'
                            : 'text-[#A8A29E] hover:text-[#68645E]'
                        }`}
                        title={p.published ? 'Live on Store' : 'Draft (Hidden)'}
                      >
                        {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeature(p)}
                        className={`p-1.5 transition-colors cursor-pointer ${
                          p.featured
                            ? 'text-[#B89A62] fill-[#B89A62]'
                            : 'text-[#D4BC88] hover:text-[#B89A62]'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${p.featured ? 'fill-[#B89A62]' : ''}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-[#68645E] hover:text-[#171717] hover:bg-[#E9E1D4] transition-colors"
                          title="Edit Garment"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Delete Garment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="relative bg-[#F8F5EF] w-full max-w-3xl border border-[#E9E1D4] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#68645E] hover:text-[#171717]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-2xl font-bold text-[#171717] mb-6">
              {editingProduct ? t.admin.productForm.editTitle : t.admin.productForm.addTitle}
            </h3>

            {errorMsg && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              {/* Product Names: English & Bengali */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    {t.admin.productForm.nameEn} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g. Classic Oxford Cotton Shirt"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    {t.admin.productForm.nameBn} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    placeholder="উদা: ক্লাসিক অক্সফোর্ড কটন শার্ট"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  />
                </div>
              </div>

              {/* Descriptions: English & Bengali */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    {t.admin.productForm.descEn}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder="Fabric composition, fit, details..."
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    {t.admin.productForm.descBn}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.descriptionBn}
                    onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                    placeholder="কাপড়, ফিটিং ও অন্যান্য তথ্য..."
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  />
                </div>
              </div>

              {/* Category & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    {t.admin.productForm.category} *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {language === 'bn' ? c.nameBn : c.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    {t.admin.productForm.sku}
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. JG-SH-102"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  />
                </div>
              </div>

              {/* Price & Compare Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    {t.admin.productForm.price} *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.priceInr}
                    onChange={(e) => setFormData({ ...formData, priceInr: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    {t.admin.productForm.comparePrice}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.compareAtPriceInr}
                    onChange={(e) => setFormData({ ...formData, compareAtPriceInr: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  />
                </div>
              </div>

              {/* Stock Quantity & Threshold */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    {t.admin.productForm.stock} *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    {t.admin.productForm.lowStockLimit}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  />
                </div>
              </div>

              {/* Sizes and Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    {t.admin.productForm.sizes}
                  </label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="38, 40, 42, 44 or S, M, L"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#171717] mb-1.5">
                    {t.admin.productForm.colors}
                  </label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="White, Sky Blue, Navy Blue"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  />
                </div>
              </div>

              {/* Zero-Cost Image Management */}
              <div className="space-y-3 bg-[#F8F5EF] p-4 border border-[#E9E1D4]">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold uppercase tracking-wider text-[#171717]">
                    Product Images &amp; Previews
                  </label>
                  <span className="text-[10px] text-[#B89A62] font-semibold uppercase tracking-wider">
                    Strict ₹0 Cost Image Architecture
                  </span>
                </div>

                {/* Transparency Note */}
                <div className="p-2.5 bg-white border border-[#D4BC88]/60 text-[11px] text-[#68645E] flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#B89A62] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#171717]">Zero-Cost Storage Architecture: </span>
                    Firebase Cloud Storage requires upgrading to a Blaze (pay-as-you-go) billing plan with a credit card. To keep this project at strict ₹0 budget, you can use: (1) Local bundled project images stored inside the app files, or (2) Any free direct web image URL (e.g. Unsplash, ImgBB, GitHub).
                  </div>
                </div>

                {/* Previews Grid */}
                {formData.imageUrlsText.split('\n').filter((u) => u.trim()).length > 0 && (
                  <div>
                    <span className="block text-[11px] font-semibold text-[#171717] mb-2">
                      Active Image Previews ({formData.imageUrlsText.split('\n').filter((u) => u.trim()).length})
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {formData.imageUrlsText.split('\n').filter((u) => u.trim()).map((url, idx) => (
                        <div key={idx} className="relative group w-20 h-24 border border-[#D4BC88] bg-white overflow-hidden shadow-xs">
                          <img
                            src={url}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const remaining = formData.imageUrlsText
                                .split('\n')
                                .filter((_, i) => i !== idx)
                                .join('\n');
                              setFormData({ ...formData, imageUrlsText: remaining });
                            }}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer shadow-xs text-xs font-bold"
                            title="Remove Image"
                          >
                            ×
                          </button>
                          {idx === 0 && (
                            <span className="absolute bottom-0 inset-x-0 bg-[#171717]/80 text-white text-[9px] text-center uppercase tracking-wider py-0.5">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Add from Local Project Assets */}
                <div className="pt-2 border-t border-[#E9E1D4]">
                  <span className="block text-[11px] font-semibold text-[#171717] mb-1.5 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#B89A62]" />
                    <span>Quick Select from Bundled Project Images (100% Free &amp; Offline):</span>
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {LOCAL_PROJECT_IMAGES.map((localImg, idx) => {
                      const isAlreadyAdded = formData.imageUrlsText.includes(localImg.url);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (!isAlreadyAdded) {
                              const current = formData.imageUrlsText.trim();
                              const updated = current ? `${current}\n${localImg.url}` : localImg.url;
                              setFormData({ ...formData, imageUrlsText: updated });
                            }
                          }}
                          disabled={isAlreadyAdded}
                          className={`p-1.5 border text-left flex items-center gap-2 transition-all cursor-pointer ${
                            isAlreadyAdded
                              ? 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
                              : 'bg-white hover:border-[#B89A62] border-[#E9E1D4]'
                          }`}
                        >
                          <img src={localImg.url} alt="" className="w-7 h-9 object-cover bg-[#F8F5EF] border border-[#E9E1D4] shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-[10px] font-medium text-[#171717] truncate block">{localImg.label.split('(')[0]}</span>
                            <span className="text-[9px] text-[#B89A62] block">{isAlreadyAdded ? '✓ Added' : '+ Add Asset'}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Raw Image URLs Editor */}
                <div className="pt-2 border-t border-[#E9E1D4]">
                  <label className="block text-[11px] font-semibold text-[#171717] mb-1">
                    Image URLs (Enter local paths like <code className="bg-gray-200 px-1 font-mono">/images/products/...</code> or web URLs, one per line):
                  </label>
                  <textarea
                    rows={3}
                    value={formData.imageUrlsText}
                    onChange={(e) => setFormData({ ...formData, imageUrlsText: e.target.value })}
                    placeholder="/images/products/shirt-oxford.svg&#10;https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E9E1D4] focus:border-[#B89A62]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded-none accent-[#B89A62]"
                  />
                  <span className="font-semibold text-[#171717]">{t.admin.productForm.published}</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded-none accent-[#B89A62]"
                  />
                  <span className="font-semibold text-[#171717]">{t.admin.productForm.featured}</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E9E1D4] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#E9E1D4] hover:bg-[#D4BC88] text-[#171717] font-semibold tracking-wider uppercase transition-colors"
                >
                  {t.admin.productForm.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#171717] hover:bg-[#292824] text-white font-semibold tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? t.admin.productForm.saving : t.admin.productForm.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

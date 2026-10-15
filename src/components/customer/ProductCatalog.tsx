import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import {
  Search,
  SlidersHorizontal,
  MessageCircle,
  Eye,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { buildWhatsAppUrl, DEFAULT_FALLBACK_IMAGE } from '../../lib/storageFallback';

export const ProductCatalog: React.FC = () => {
  const { language, t, formatPrice } = useLanguage();
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setActiveProductModal,
    settings
  } = useStore();

  const [sortBy, setSortBy] = useState<'newest' | 'priceAsc' | 'priceDesc' | 'featured'>('newest');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory && p.categoryId !== selectedCategory) {
          return false;
        }

        // In-stock filter
        if (inStockOnly && p.stockQuantity <= 0) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesEn = p.nameEn?.toLowerCase().includes(q);
          const matchesBn = p.nameBn?.toLowerCase().includes(q);
          const matchesSku = p.sku?.toLowerCase().includes(q);
          const matchesDesc = p.descriptionEn?.toLowerCase().includes(q) || p.descriptionBn?.toLowerCase().includes(q);
          if (!matchesEn && !matchesBn && !matchesSku && !matchesDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
        }
        if (sortBy === 'priceAsc') {
          return a.priceInr - b.priceInr;
        }
        if (sortBy === 'priceDesc') {
          return b.priceInr - a.priceInr;
        }
        // default: newest
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      });
  }, [products, selectedCategory, inStockOnly, searchQuery, sortBy]);

  const handleWhatsAppDirect = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const productName = language === 'bn' ? product.nameBn : product.nameEn;
    const size = product.sizes?.[0] || 'Standard';
    const color = product.colors?.[0] || 'As pictured';

    const msgTemplate = t.whatsappMessages.productEnquiry;
    const msg = msgTemplate
      .replace('{name}', productName)
      .replace('{sku}', product.sku || 'N/A')
      .replace('{size}', size)
      .replace('{color}', color)
      .replace('{price}', product.priceInr.toLocaleString('en-IN'));

    const url = buildWhatsAppUrl(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setInStockOnly(false);
    setSortBy('newest');
  };

  return (
    <section id="collection" className="py-20 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B89A62] mb-2">
            {language === 'bn' ? 'রেডিমেড পোশাক' : 'READY-TO-WEAR APPAREL'}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#171717] mb-3">
            {t.catalog.title}
          </h2>
          <p className="text-sm text-[#68645E]">
            {t.catalog.subtitle}
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 border border-[#E9E1D4] shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.catalog.searchPlaceholder}
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-[#F8F5EF] border border-[#E9E1D4] focus:border-[#B89A62] focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#171717]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* In Stock toggle & Sorting */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-[#292824] cursor-pointer select-none bg-[#F8F5EF] px-3 py-2 border border-[#E9E1D4]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-none accent-[#B89A62]"
                />
                <span>{t.catalog.inStockOnly}</span>
              </label>

              <div className="flex items-center gap-2 bg-[#F8F5EF] px-3 py-1.5 border border-[#E9E1D4]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#B89A62]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-medium bg-transparent border-none focus:ring-0 text-[#292824] cursor-pointer"
                >
                  <option value="newest">{t.catalog.sortNewest}</option>
                  <option value="featured">{t.catalog.sortFeatured}</option>
                  <option value="priceAsc">{t.catalog.sortPriceLow}</option>
                  <option value="priceDesc">{t.catalog.sortPriceHigh}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Pills Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-[#E9E1D4]/60 pt-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors cursor-pointer ${
                selectedCategory === null
                  ? 'bg-[#171717] text-[#F8F5EF]'
                  : 'bg-[#F8F5EF] text-[#68645E] hover:text-[#171717] hover:bg-[#E9E1D4]'
              }`}
            >
              {t.categories.all}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 text-xs font-semibold tracking-wider shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-[#171717] text-[#F8F5EF]'
                    : 'bg-[#F8F5EF] text-[#68645E] hover:text-[#171717] hover:bg-[#E9E1D4]'
                }`}
              >
                {language === 'bn' ? cat.nameBn : cat.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Total Count Header */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#68645E]">
          <span>{t.catalog.totalCount.replace('{count}', String(filteredProducts.length))}</span>
          {(selectedCategory || searchQuery || inStockOnly) && (
            <button
              onClick={clearFilters}
              className="text-[#B89A62] hover:underline cursor-pointer font-medium"
            >
              {t.catalog.resetFilters}
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#E9E1D4] p-12 text-center max-w-md mx-auto my-12">
            <AlertCircle className="w-10 h-10 text-[#B89A62] mx-auto mb-3" />
            <p className="text-sm text-[#292824] font-medium mb-4">
              {t.catalog.noProductsFound}
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2 bg-[#171717] text-white text-xs font-semibold tracking-wider uppercase"
            >
              {t.catalog.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stockQuantity <= 0;
              const isLowStock = !isOutOfStock && product.stockQuantity <= (product.lowStockThreshold || 3);
              const primaryImage = product.imageUrls?.[0] || DEFAULT_FALLBACK_IMAGE;

              return (
                <div
                  key={product.id}
                  onClick={() => setActiveProductModal(product)}
                  className="group bg-white border border-[#E9E1D4] hover:border-[#D4BC88] transition-all duration-300 flex flex-col cursor-pointer overflow-hidden shadow-sm hover:shadow-md"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#E9E1D4]/40">
                    <img
                      src={primaryImage}
                      alt={language === 'bn' ? product.nameBn : product.nameEn}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Stock and Featured Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                      {product.featured && (
                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-[#B89A62] text-[#171717]">
                          {language === 'bn' ? 'বিশেষ পছন্দ' : 'FEATURED'}
                        </span>
                      )}
                      {isOutOfStock ? (
                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-[#171717] text-white">
                          {t.catalog.outOfStock}
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-[#C2410C] text-white">
                          {t.catalog.onlyLeft.replace('{count}', String(product.stockQuantity))}
                        </span>
                      ) : null}
                    </div>

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/90 backdrop-blur-sm text-[#171717] px-3 py-1.5 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                        <Eye className="w-3.5 h-3.5" />
                        {t.catalog.viewDetails}
                      </span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {product.sku && (
                        <div className="text-[10px] text-[#A8A29E] tracking-wider uppercase mb-1">
                          {product.sku}
                        </div>
                      )}
                      <h3 className="font-medium text-sm sm:text-base text-[#171717] group-hover:text-[#B89A62] transition-colors line-clamp-2 mb-2">
                        {language === 'bn' ? product.nameBn : product.nameEn}
                      </h3>

                      {/* Sizes Preview */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.sizes.slice(0, 4).map((size, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-1.5 py-0.5 bg-[#F8F5EF] text-[#68645E] border border-[#E9E1D4]"
                            >
                              {size}
                            </span>
                          ))}
                          {product.sizes.length > 4 && (
                            <span className="text-[10px] text-[#A8A29E] self-center">
                              +{product.sizes.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#E9E1D4]/60 flex items-center justify-between gap-2">
                      {/* Price */}
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base sm:text-lg font-bold text-[#171717]">
                            {formatPrice(product.priceInr)}
                          </span>
                          {product.compareAtPriceInr && product.compareAtPriceInr > product.priceInr && (
                            <span className="text-xs text-[#A8A29E] line-through">
                              {formatPrice(product.compareAtPriceInr)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* WhatsApp Enquiry Button */}
                      <button
                        onClick={(e) => handleWhatsAppDirect(e, product)}
                        className={`p-2 transition-all cursor-pointer ${
                          isOutOfStock
                            ? 'bg-[#E9E1D4] text-[#A8A29E] hover:bg-[#D4BC88] hover:text-[#171717]'
                            : 'bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white'
                        }`}
                        title={t.catalog.enquireWhatsApp}
                        aria-label="Enquire on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

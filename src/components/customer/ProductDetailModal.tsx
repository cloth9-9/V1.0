import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { X, MessageCircle, Check, AlertCircle, ShieldCheck, Tag } from 'lucide-react';
import { buildWhatsAppUrl, DEFAULT_FALLBACK_IMAGE } from '../../lib/storageFallback';

export const ProductDetailModal: React.FC = () => {
  const { language, t, formatPrice } = useLanguage();
  const { activeProductModal, setActiveProductModal, settings } = useStore();

  const product = activeProductModal;

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    if (product) {
      setSelectedImageIdx(0);
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
    }
  }, [product]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveProductModal(null);
      }
    };
    if (product) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [product, setActiveProductModal]);

  if (!product) return null;

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = !isOutOfStock && product.stockQuantity <= (product.lowStockThreshold || 3);

  const images = (product.imageUrls && product.imageUrls.length > 0)
    ? product.imageUrls
    : [DEFAULT_FALLBACK_IMAGE];

  const currentImage = images[selectedImageIdx] || images[0] || DEFAULT_FALLBACK_IMAGE;

  const name = language === 'bn'
    ? (product.nameBn || product.nameEn)
    : (product.nameEn || product.nameBn);

  const description = language === 'bn'
    ? (product.descriptionBn || product.descriptionEn)
    : (product.descriptionEn || product.descriptionBn);

  const handleWhatsAppEnquiry = () => {
    const msgTemplate = t.whatsappMessages.productEnquiry;
    const msg = msgTemplate
      .replace('{name}', name)
      .replace('{sku}', product.sku || 'N/A')
      .replace('{size}', selectedSize || 'Standard')
      .replace('{color}', selectedColor || 'Standard')
      .replace('{price}', product.priceInr.toLocaleString('en-IN'));

    const url = buildWhatsAppUrl(settings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-[#F8F5EF] w-full max-w-4xl border border-[#E9E1D4] shadow-2xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-product-title"
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveProductModal(null)}
          className="absolute top-4 right-4 z-20 p-2 text-[#292824] hover:text-[#B89A62] bg-[#E9E1D4]/80 hover:bg-[#E9E1D4] transition-colors"
          aria-label={t.productDetail.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Gallery */}
          <div className="p-6 bg-white border-b md:border-b-0 md:border-r border-[#E9E1D4] flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F8F5EF] mb-4">
              <img
                src={currentImage}
                alt={name}
                className="w-full h-full object-cover object-center"
              />
              {isOutOfStock && (
                <div className="absolute top-3 left-3 bg-[#171717] text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
                  {t.catalog.outOfStock}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-20 shrink-0 border overflow-hidden transition-all ${
                      selectedImageIdx === idx
                        ? 'border-[#B89A62] ring-2 ring-[#B89A62]/30'
                        : 'border-[#E9E1D4] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & WhatsApp Ordering */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                {product.sku && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#B89A62] font-semibold uppercase tracking-wider mb-2">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{product.sku}</span>
                  </div>
                )}
                <h2 id="modal-product-title" className="font-display text-2xl sm:text-3xl font-bold text-[#171717] leading-tight">
                  {name}
                </h2>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-2xl font-bold text-[#171717]">
                    {formatPrice(product.priceInr)}
                  </span>
                  {product.compareAtPriceInr && product.compareAtPriceInr > product.priceInr && (
                    <span className="text-sm text-[#A8A29E] line-through">
                      {formatPrice(product.compareAtPriceInr)}
                    </span>
                  )}
                  {product.compareAtPriceInr && product.compareAtPriceInr > product.priceInr && (
                    <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5">
                      Save {Math.round(((product.compareAtPriceInr - product.priceInr) / product.compareAtPriceInr) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Status Banner */}
              <div className="py-2.5 px-3.5 border text-xs flex items-center gap-2">
                {isOutOfStock ? (
                  <div className="text-[#171717] flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-4 h-4 text-[#C2410C]" />
                    <span>{t.productDetail.outOfStockNotice}</span>
                  </div>
                ) : isLowStock ? (
                  <div className="text-[#C2410C] flex items-center gap-1.5 font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    <span>{t.catalog.onlyLeft.replace('{count}', String(product.stockQuantity))}</span>
                  </div>
                ) : (
                  <div className="text-[#16A34A] flex items-center gap-1.5 font-medium">
                    <Check className="w-4 h-4" />
                    <span>{t.catalog.inStock}</span>
                  </div>
                )}
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-2">
                    {t.productDetail.sizes}: <span className="text-[#B89A62]">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3.5 py-2 text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'bg-[#171717] text-white border-2 border-[#171717]'
                            : 'bg-white text-[#292824] border border-[#E9E1D4] hover:border-[#B89A62]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#171717] mb-2">
                    {t.productDetail.colors}: <span className="text-[#B89A62]">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                          selectedColor === col
                            ? 'bg-[#171717] text-[#F8F5EF] border border-[#171717]'
                            : 'bg-white text-[#292824] border border-[#E9E1D4] hover:border-[#B89A62]'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {description && (
                <div className="pt-2 border-t border-[#E9E1D4]">
                  <h4 className="text-xs uppercase font-semibold tracking-wider text-[#68645E] mb-2">
                    {t.productDetail.description}
                  </h4>
                  <p className="text-sm text-[#292824] leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                </div>
              )}
            </div>

            {/* Ordering CTA & Honest Disclaimer */}
            <div className="pt-6 border-t border-[#E9E1D4] mt-6 space-y-3">
              <button
                onClick={handleWhatsAppEnquiry}
                className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t.productDetail.enquireTitle}</span>
              </button>

              <p className="text-[11px] text-[#78716C] leading-normal italic text-center">
                {t.productDetail.enquireDisclaimer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

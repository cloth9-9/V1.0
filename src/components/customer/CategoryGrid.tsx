import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { ArrowRight } from 'lucide-react';
import { DEFAULT_FALLBACK_IMAGE } from '../../lib/storageFallback';

export const CategoryGrid: React.FC = () => {
  const { language, t } = useLanguage();
  const { categories, products, selectedCategory, setSelectedCategory } = useStore();

  const handleSelect = (slug: string) => {
    setSelectedCategory(slug === selectedCategory ? null : slug);
    const el = document.querySelector('#collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section id="categories" className="py-20 bg-[#F8F5EF] border-b border-[#E9E1D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B89A62] mb-2">
              {language === 'bn' ? 'পোশাকের বৈচিত্র্য' : 'MENSWEAR COLLECTIONS'}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#171717]">
              {t.categories.title}
            </h2>
          </div>
          <p className="text-sm text-[#68645E] max-w-md mt-2 md:mt-0">
            {t.categories.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;

            return (
              <div
                key={cat.id}
                onClick={() => handleSelect(cat.slug)}
                className={`group relative overflow-hidden bg-white border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'border-[#B89A62] ring-2 ring-[#B89A62]/30'
                    : 'border-[#E9E1D4] hover:border-[#D4BC88]'
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#E9E1D4]">
                  <img
                    src={cat.imageUrl || DEFAULT_FALLBACK_IMAGE}
                    alt={language === 'bn' ? cat.nameBn : cat.nameEn}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/80 via-[#171717]/20 to-transparent" />
                </div>

                <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base tracking-wide text-white group-hover:text-[#D4BC88] transition-colors">
                        {language === 'bn' ? cat.nameBn : cat.nameEn}
                      </h3>
                      <p className="text-[11px] text-[#D6D3D1] mt-0.5">
                        {count} {language === 'bn' ? 'টি পোশাক' : 'Garments'}
                      </p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#B89A62] group-hover:text-[#171717] transition-all">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

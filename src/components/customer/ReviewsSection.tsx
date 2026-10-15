import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { Star, MessageSquareQuote, ExternalLink, CheckCircle } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { reviews, settings } = useStore();

  const publishedReviews = reviews.filter((r) => r.authorized && r.published);

  return (
    <section id="reviews" className="py-24 bg-white border-b border-[#E9E1D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B89A62] mb-2">
            {t.reviews.eyebrow}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#171717] mb-3">
            {t.reviews.title}
          </h2>
          <p className="text-sm text-[#68645E]">
            {t.reviews.subtitle}
          </p>
        </div>

        {publishedReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {publishedReviews.map((rev) => {
              const text = language === 'bn' ? (rev.textBn || rev.textEn) : (rev.textEn || rev.textBn);

              return (
                <div
                  key={rev.id}
                  className="bg-[#F8F5EF] border border-[#E9E1D4] p-7 flex flex-col justify-between shadow-sm relative group hover:border-[#B89A62] transition-colors"
                >
                  <MessageSquareQuote className="w-8 h-8 text-[#D4BC88] opacity-60 mb-4" />

                  <p className="text-sm text-[#292824] leading-relaxed italic mb-6">
                    "{text}"
                  </p>

                  <div className="pt-4 border-t border-[#E9E1D4] flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-[#171717]">
                        {rev.displayName}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#16A34A] mt-0.5">
                        <CheckCircle className="w-3 h-3" />
                        <span>{t.reviews.verifiedCustomer}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-[#B89A62]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < (rev.rating || 5)
                              ? 'fill-[#B89A62] text-[#B89A62]'
                              : 'text-[#D4BC88]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 mb-12 bg-[#F8F5EF] border border-[#E9E1D4] p-8 max-w-lg mx-auto">
            <p className="text-sm text-[#68645E] mb-4">
              {t.reviews.emptyNotice}
            </p>
          </div>
        )}

        {/* Leave Review Action */}
        {settings.reviewUrl && (
          <div className="text-center">
            <a
              href={settings.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#171717] hover:bg-[#292824] text-white font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              <span>{t.reviews.leaveReviewBtn}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#B89A62]" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

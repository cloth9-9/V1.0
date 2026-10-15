import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStore } from '../../context/StoreContext';
import { Appointment, Enquiry } from '../../types';
import { seedInitialDatabase } from '../../services/dbService';
import {
  Package,
  AlertTriangle,
  Calendar,
  MessageSquare,
  CheckCircle,
  Database,
  ArrowRight,
  TrendingUp,
  Scissors
} from 'lucide-react';

interface OverviewTabProps {
  appointments: Appointment[];
  enquiries: Enquiry[];
  onNavigateTab: (tab: any) => void;
  onRefreshAll: () => Promise<void>;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  appointments,
  enquiries,
  onNavigateTab,
  onRefreshAll
}) => {
  const { language, t, formatPrice } = useLanguage();
  const { products, categories, services } = useStore();
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  // Computed metrics from real Firestore records
  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.published).length;
  const draftProducts = totalProducts - publishedProducts;
  const outOfStockProducts = products.filter((p) => p.stockQuantity <= 0).length;
  const lowStockProducts = products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 3)
  ).length;

  const pendingAppointments = appointments.filter((a) => a.status === 'pending').length;
  const newEnquiries = enquiries.filter((e) => e.status === 'new').length;

  const handleSeed = async () => {
    if (!window.confirm('This will load initial sample menswear categories, garments, and tailoring services. Continue?')) {
      return;
    }
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await seedInitialDatabase();
      setSeedResult(`Successfully loaded ${res.products} products, ${res.categories} categories, and ${res.services} services.`);
      await onRefreshAll();
    } catch (err: any) {
      console.error('Seed error:', err);
      setSeedResult(`Seed error: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    {
      label: t.admin.stats.publishedProducts,
      value: publishedProducts,
      sub: `${draftProducts} drafts`,
      icon: Package,
      color: 'text-[#16A34A]',
      bg: 'bg-green-50 border-green-200',
      action: () => onNavigateTab('products')
    },
    {
      label: t.admin.stats.lowStock,
      value: lowStockProducts,
      sub: `${outOfStockProducts} out of stock`,
      icon: AlertTriangle,
      color: 'text-[#C2410C]',
      bg: 'bg-amber-50 border-amber-200',
      action: () => onNavigateTab('inventory')
    },
    {
      label: t.admin.stats.pendingAppointments,
      value: pendingAppointments,
      sub: `${appointments.length} total requests`,
      icon: Calendar,
      color: 'text-[#B89A62]',
      bg: 'bg-[#F8F5EF] border-[#D4BC88]',
      action: () => onNavigateTab('appointments')
    },
    {
      label: t.admin.stats.newEnquiries,
      value: newEnquiries,
      sub: `${enquiries.length} total messages`,
      icon: MessageSquare,
      color: 'text-[#2563EB]',
      bg: 'bg-blue-50 border-blue-200',
      action: () => onNavigateTab('enquiries')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Seeder */}
      <div className="bg-white p-6 border border-[#E9E1D4] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-[#171717]">
            {language === 'bn' ? 'ব্যবসায়িক পরিস্থিতি ও সংক্ষিপ্ত বিবরণ' : 'Business Performance & Live Overview'}
          </h2>
          <p className="text-xs text-[#68645E] mt-1">
            {language === 'bn'
              ? 'সকল পরিসংখ্যান ক্লাউড ফায়ারস্টোর থেকে সরাসরি আপডেট হচ্ছে।'
              : 'All figures are calculated directly from live Firestore database records.'}
          </p>
        </div>

        <button
          onClick={handleSeed}
          disabled={seeding}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#171717] hover:bg-[#292824] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
        >
          <Database className="w-4 h-4 text-[#B89A62]" />
          <span>{seeding ? t.admin.actions.seeding : t.admin.actions.seedData}</span>
        </button>
      </div>

      {seedResult && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center justify-between">
          <span>{seedResult}</span>
          <button onClick={() => setSeedResult(null)} className="text-green-900 font-bold ml-4">✕</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={card.action}
              className={`p-5 border cursor-pointer transition-all hover:shadow-md ${card.bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#68645E]">
                  {card.label}
                </span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="text-3xl font-bold font-display text-[#171717] mb-1">
                {card.value}
              </div>
              <div className="text-xs text-[#78716C] flex items-center justify-between">
                <span>{card.sub}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Tables: Recent Appointments & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white p-6 border border-[#E9E1D4] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-[#171717] flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#B89A62]" />
              <span>{language === 'bn' ? 'সাম্প্রতিক অ্যাপয়েন্টমেন্ট অনুরোধ' : 'Recent Appointment Requests'}</span>
            </h3>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs text-[#B89A62] hover:underline font-medium"
            >
              {language === 'bn' ? 'সব দেখুন' : 'View All'}
            </button>
          </div>

          {appointments.length === 0 ? (
            <p className="text-xs text-[#A8A29E] py-6 text-center">
              {language === 'bn' ? 'কোনো অনুরোধ জমা পড়েনি।' : 'No appointment requests yet.'}
            </p>
          ) : (
            <div className="divide-y divide-[#E9E1D4]">
              {appointments.slice(0, 4).map((apt) => (
                <div key={apt.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-[#171717]">{apt.customerName}</div>
                    <div className="text-[#68645E] mt-0.5">
                      {apt.requestedDate} • {apt.requestedTime}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                      apt.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : apt.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : apt.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white p-6 border border-[#E9E1D4] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-[#171717] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#2563EB]" />
              <span>{language === 'bn' ? 'সাম্প্রতিক গ্রাহক বার্তা' : 'Recent Customer Messages'}</span>
            </h3>
            <button
              onClick={() => onNavigateTab('enquiries')}
              className="text-xs text-[#B89A62] hover:underline font-medium"
            >
              {language === 'bn' ? 'সব দেখুন' : 'View All'}
            </button>
          </div>

          {enquiries.length === 0 ? (
            <p className="text-xs text-[#A8A29E] py-6 text-center">
              {language === 'bn' ? 'কোনো বার্তা আসেনি।' : 'No customer enquiries yet.'}
            </p>
          ) : (
            <div className="divide-y divide-[#E9E1D4]">
              {enquiries.slice(0, 4).map((enq) => (
                <div key={enq.id} className="py-3 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#171717]">{enq.customerName}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                        enq.status === 'new'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-[#68645E] line-clamp-1 italic">
                    "{enq.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

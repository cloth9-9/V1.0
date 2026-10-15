import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { fetchAppointments, fetchEnquiries } from '../../services/dbService';
import { Appointment, Enquiry } from '../../types';
import { OverviewTab } from './OverviewTab';
import { ProductsTab } from './ProductsTab';
import { InventoryTab } from './InventoryTab';
import { CategoriesTab } from './CategoriesTab';
import { ServicesTab } from './ServicesTab';
import { AppointmentsTab } from './AppointmentsTab';
import { EnquiriesTab } from './EnquiriesTab';
import { SettingsTab } from './SettingsTab';
import {
  ShieldCheck,
  Package,
  Layers,
  Scissors,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Store,
  AlertCircle,
  LogIn,
  RefreshCw,
  Archive
} from 'lucide-react';

interface AdminLayoutProps {
  onBackToStore: () => void;
}

type AdminTab =
  | 'overview'
  | 'products'
  | 'inventory'
  | 'categories'
  | 'services'
  | 'appointments'
  | 'enquiries'
  | 'settings';

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToStore }) => {
  const { language, t } = useLanguage();
  const { currentUser, isAdmin, loading: authLoading, authError, signInWithGoogle, signOutUser } = useAuth();
  const { refreshStore } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  const loadAdminData = async () => {
    if (!isAdmin) return;
    setDataLoading(true);
    try {
      const [apts, enqs] = await Promise.all([
        fetchAppointments(),
        fetchEnquiries()
      ]);
      setAppointments(apts);
      setEnquiries(enqs);
    } catch (err) {
      console.warn('Error fetching admin data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F5EF] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#B89A62] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#68645E]">
            Verifying administrative access...
          </p>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#171717] flex items-center justify-center p-4">
        <div className="bg-[#24221D] border border-[#3D3A32] max-w-md w-full p-8 sm:p-10 text-center shadow-2xl space-y-6">
          <div className="w-14 h-14 bg-[#B89A62]/10 border border-[#B89A62]/30 text-[#B89A62] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#B89A62] block mb-1">
              Janapriya Garments & Clothing
            </span>
            <h2 className="font-display text-2xl font-bold text-[#F8F5EF]">
              {t.admin.title}
            </h2>
            <p className="text-xs text-[#A8A29E] mt-2 leading-relaxed">
              {t.admin.signInDesc}
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={signInWithGoogle}
              className="w-full py-3.5 px-6 bg-[#B89A62] hover:bg-[#9B7E48] text-[#171717] font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>{t.admin.signInWithGoogle}</span>
            </button>

            <button
              onClick={onBackToStore}
              className="w-full py-2.5 px-4 text-[#A8A29E] hover:text-white text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              ← Back to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Signed in, but unauthorized
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#171717] flex items-center justify-center p-4">
        <div className="bg-[#24221D] border border-red-900/40 max-w-md w-full p-8 text-center shadow-2xl space-y-6">
          <div className="w-14 h-14 bg-red-900/20 text-red-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-[#F8F5EF]">
              {t.admin.unauthorizedTitle}
            </h2>
            <p className="text-xs text-[#A8A29E] mt-3 leading-relaxed">
              {t.admin.unauthorizedDesc.replace('{email}', currentUser.email || 'Unknown')}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={signOutUser}
              className="w-full py-3 px-4 bg-[#B89A62] hover:bg-[#9B7E48] text-[#171717] font-semibold text-xs uppercase tracking-wider"
            >
              {t.admin.signOut}
            </button>
            <button
              onClick={onBackToStore}
              className="w-full py-2.5 px-4 text-[#A8A29E] hover:text-white text-xs font-medium"
            >
              ← {t.admin.switchStore}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: t.admin.tabs.overview, icon: ShieldCheck },
    { id: 'products', label: t.admin.tabs.products, icon: Package },
    { id: 'inventory', label: t.admin.tabs.inventory, icon: Archive },
    { id: 'categories', label: t.admin.tabs.categories, icon: Layers },
    { id: 'services', label: t.admin.tabs.services, icon: Scissors },
    {
      id: 'appointments',
      label: t.admin.tabs.appointments,
      icon: Calendar,
      badge: appointments.filter((a) => a.status === 'pending').length
    },
    {
      id: 'enquiries',
      label: t.admin.tabs.enquiries,
      icon: MessageSquare,
      badge: enquiries.filter((e) => e.status === 'new').length
    },
    { id: 'settings', label: t.admin.tabs.settings, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col">
      {/* Top Header */}
      <header className="bg-[#171717] text-white border-b border-[#292824] px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-5 bg-[#B89A62] block"></span>
          <div>
            <span className="font-display text-base font-bold tracking-wider text-white uppercase block leading-none">
              JANAPRIYA
            </span>
            <span className="text-[9px] tracking-[0.2em] font-medium text-[#B89A62] uppercase block">
              Management Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:block text-right">
            <span className="text-[#A8A29E] block text-[10px]">Logged in as</span>
            <span className="font-semibold text-[#D4BC88]">{currentUser.email}</span>
          </div>

          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#292824] hover:bg-[#3D3A32] text-white text-xs font-medium border border-[#3D3A32]"
            title="View Public Store"
          >
            <Store className="w-3.5 h-3.5 text-[#B89A62]" />
            <span className="hidden sm:inline">{t.admin.switchStore}</span>
          </button>

          <button
            onClick={signOutUser}
            className="p-1.5 text-[#A8A29E] hover:text-white transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white border-r border-[#E9E1D4] shrink-0 p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#171717] text-[#F8F5EF]'
                    : 'text-[#68645E] hover:bg-[#F8F5EF] hover:text-[#171717]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#B89A62]' : 'text-[#68645E]'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-[#B89A62] text-[#171717]' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && (
            <OverviewTab
              appointments={appointments}
              enquiries={enquiries}
              onNavigateTab={(t: AdminTab) => setActiveTab(t)}
              onRefreshAll={async () => {
                await refreshStore();
                await loadAdminData();
              }}
            />
          )}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'inventory' && <InventoryTab />}
          {activeTab === 'categories' && <CategoriesTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'appointments' && (
            <AppointmentsTab appointments={appointments} onRefresh={loadAdminData} />
          )}
          {activeTab === 'enquiries' && (
            <EnquiriesTab enquiries={enquiries} onRefresh={loadAdminData} />
          )}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Hero } from './components/customer/Hero';
import { CategoryGrid } from './components/customer/CategoryGrid';
import { ProductCatalog } from './components/customer/ProductCatalog';
import { TailoringSection } from './components/customer/TailoringSection';
import { AboutSection } from './components/customer/AboutSection';
import { ReviewsSection } from './components/customer/ReviewsSection';
import { ContactSection } from './components/customer/ContactSection';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { AppointmentModal } from './components/customer/AppointmentModal';
import { AdminLayout } from './components/admin/AdminLayout';

function MainApp() {
  const [currentView, setCurrentView] = useState<'store' | 'admin'>(() => {
    return window.location.hash === '#admin' ? 'admin' : 'store';
  });

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (currentView === 'admin' && window.location.hash !== '#admin') {
        // preserve or switch
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentView]);

  const handleSetView = (view: 'store' | 'admin') => {
    setCurrentView(view);
    if (view === 'admin') {
      window.location.hash = '#admin';
    } else {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (currentView === 'admin') {
    return (
      <AdminLayout onBackToStore={() => handleSetView('store')} />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col font-sans selection:bg-[#B89A62]/30 selection:text-[#171717]">
      <AnnouncementBar />
      <Navbar currentView={currentView} setCurrentView={handleSetView} />

      <main className="flex-1">
        <Hero />
        <CategoryGrid />
        <ProductCatalog />
        <TailoringSection />
        <AboutSection />
        <ReviewsSection />
        <ContactSection />
      </main>

      <Footer onAdminClick={() => handleSetView('admin')} />

      {/* Modals */}
      <ProductDetailModal />
      <AppointmentModal />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <StoreProvider>
          <MainApp />
        </StoreProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

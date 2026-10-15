import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category, TailoringService, SiteSettings, Review } from '../types';
import {
  getSiteSettings,
  fetchCategories,
  fetchProducts,
  fetchServices,
  fetchReviews
} from '../services/dbService';
import { DEFAULT_SITE_SETTINGS } from '../services/seedService';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface StoreContextType {
  settings: SiteSettings;
  categories: Category[];
  products: Product[];
  services: TailoringService[];
  reviews: Review[];
  loading: boolean;
  refreshStore: () => Promise<void>;
  selectedCategory: string | null;
  setSelectedCategory: (slug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeProductModal: Product | null;
  setActiveProductModal: (prod: Product | null) => void;
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (open: boolean) => void;
  preselectedService: TailoringService | null;
  setPreselectedService: (serv: TailoringService | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<TailoringService[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState<boolean>(false);
  const [preselectedService, setPreselectedService] = useState<TailoringService | null>(null);

  // Manual refresh helper
  const refreshStore = useCallback(async () => {
    try {
      const [remoteSettings, cats, prods, servs, revs] = await Promise.all([
        getSiteSettings(),
        fetchCategories(false),
        fetchProducts(false),
        fetchServices(false),
        fetchReviews(false)
      ]);

      if (remoteSettings) setSettings(remoteSettings);
      if (cats.length > 0) setCategories(cats);
      if (prods.length > 0) setProducts(prods);
      if (servs.length > 0) setServices(servs);
      if (revs.length > 0) setReviews(revs);
    } catch (err) {
      console.warn('Initial store load warning:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Real-time Firestore Listeners: Changes made in Admin reflect instantly on live website
  useEffect(() => {
    // 1. Initial manual fetch
    refreshStore();

    // 2. Real-time listener for site settings
    const unsubSettings = onSnapshot(
      doc(db, 'siteSettings', 'public'),
      (snap) => {
        if (snap.exists()) {
          setSettings(snap.data() as SiteSettings);
        }
      },
      (err) => console.warn('Settings listener:', err.message)
    );

    // 3. Real-time listener for published products
    const qProducts = query(collection(db, 'products'), where('published', '==', true));
    const unsubProducts = onSnapshot(
      qProducts,
      (snap) => {
        const list: Product[] = [];
        snap.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as Product);
        });
        if (list.length > 0) {
          setProducts(list);
        }
      },
      (err) => console.warn('Products listener:', err.message)
    );

    // 4. Real-time listener for categories
    const qCategories = query(collection(db, 'categories'), where('published', '==', true));
    const unsubCategories = onSnapshot(
      qCategories,
      (snap) => {
        const list: Category[] = [];
        snap.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as Category);
        });
        if (list.length > 0) {
          setCategories(list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
        }
      },
      (err) => console.warn('Categories listener:', err.message)
    );

    // 5. Real-time listener for services
    const qServices = query(collection(db, 'services'), where('published', '==', true));
    const unsubServices = onSnapshot(
      qServices,
      (snap) => {
        const list: TailoringService[] = [];
        snap.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as TailoringService);
        });
        if (list.length > 0) {
          setServices(list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
        }
      },
      (err) => console.warn('Services listener:', err.message)
    );

    // 6. Real-time listener for reviews
    const qReviews = query(
      collection(db, 'reviews'),
      where('published', '==', true),
      where('authorized', '==', true)
    );
    const unsubReviews = onSnapshot(
      qReviews,
      (snap) => {
        const list: Review[] = [];
        snap.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as Review);
        });
        if (list.length > 0) {
          setReviews(list);
        }
      },
      (err) => console.warn('Reviews listener:', err.message)
    );

    return () => {
      unsubSettings();
      unsubProducts();
      unsubCategories();
      unsubServices();
      unsubReviews();
    };
  }, [refreshStore]);

  return (
    <StoreContext.Provider
      value={{
        settings,
        categories,
        products,
        services,
        reviews,
        loading,
        refreshStore,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activeProductModal,
        setActiveProductModal,
        isAppointmentModalOpen,
        setIsAppointmentModalOpen,
        preselectedService,
        setPreselectedService
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

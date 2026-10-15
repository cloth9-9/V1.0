export type Language = 'en' | 'bn';

export interface Product {
  id: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  categoryId: string;
  sku?: string;
  priceInr: number;
  compareAtPriceInr?: number;
  imageUrls: string[];
  sizes: string[];
  colors: string[];
  stockQuantity: number;
  lowStockThreshold: number;
  featured: boolean;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  nameEn: string;
  nameBn: string;
  slug: string;
  imageUrl?: string;
  sortOrder: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type PricingMode = 'fixed' | 'enquiry_only';

export interface TailoringService {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  priceInr?: number;
  pricingMode: PricingMode;
  sortOrder: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteSettings {
  brandName: string;
  heroTitleEn: string;
  heroTitleBn: string;
  heroDescriptionEn: string;
  heroDescriptionBn: string;
  heroImageUrl: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  cityPostal: string;
  openingHours: string;
  mapUrl: string;
  reviewUrl: string;
  announcementEn: string;
  announcementBn: string;
  aboutEn: string;
  aboutBn: string;
  updatedAt?: string;
}

export type AppointmentStatus = 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  customerName: string;
  phone: string;
  requestedDate: string;
  requestedTime: string;
  serviceId?: string;
  serviceName?: string;
  language: Language;
  customerNotes?: string;
  status: AppointmentStatus;
  internalNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type EnquiryStatus = 'new' | 'contacted' | 'resolved' | 'archived';

export interface Enquiry {
  id: string;
  customerName: string;
  phone: string;
  productId?: string;
  productName?: string;
  message: string;
  language: Language;
  status: EnquiryStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  displayName: string;
  textEn: string;
  textBn: string;
  rating: number;
  source: string;
  authorized: boolean;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isAdmin: boolean;
}

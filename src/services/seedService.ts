import { Product, Category, TailoringService, SiteSettings, Review } from '../types';
import { SAMPLE_GARMENT_IMAGES, HERO_DEFAULT_IMAGE } from '../lib/storageFallback';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: 'Janapriya Garments & Clothing',
  heroTitleEn: 'Style That Fits You.',
  heroTitleBn: 'আপনার স্টাইল, আপনার পছন্দ।',
  heroDescriptionEn: 'Discover men\'s fashion, everyday essentials, and thoughtful tailoring at Janapriya Garments & Clothing.',
  heroDescriptionBn: 'জনপ্রিয় গার্মেন্টস অ্যান্ড ক্লোদিং-এ খুঁজে নিন পুরুষদের আধুনিক পোশাক, দৈনন্দিন প্রয়োজনীয় সামগ্রী এবং যত্নসহকারে তৈরি সেলাইয়ের পরিষেবা।',
  heroImageUrl: HERO_DEFAULT_IMAGE,
  phone: '+91 98301 23456',
  whatsappNumber: '+91 98301 23456',
  address: 'Main Market Road, Near Town Square',
  cityPostal: 'West Bengal, India',
  openingHours: 'Mon - Sat: 10:30 AM - 8:30 PM | Sun: 11:00 AM - 3:00 PM',
  mapUrl: 'https://maps.google.com',
  reviewUrl: 'https://search.google.com/local/writereview',
  announcementEn: '✨ Bespoke tailoring appointments & festive collection now available in showroom.',
  announcementBn: '✨ শোরুমে কাস্টম টেইলারিং পরামর্শ ও নতুন উৎসবের কালেকশন উপলব্ধ।',
  aboutEn: 'Janapriya Garments & Clothing is dedicated to providing contemporary men\'s ready-to-wear apparel alongside traditional tailoring craftsmanship. We emphasize comfort, clean finishing, and individual fit so every customer looks and feels confident.',
  aboutBn: 'জনপ্রিয় গার্মেন্টস অ্যান্ড ক্লোদিং আধুনিক পুরুষদের তৈরি পোশাকের পাশাপাশি দক্ষ কারিগরের নিখুঁত সেলাই সেবা প্রদানে নিবেদিত। আমরা আরাম, উন্নত ফিনিশিং এবং সঠিক ফিটিং নিশ্চিত করি যাতে প্রতিটি পোশাকে আপনার আত্মবিশ্বাস ফুটে ওঠে।'
};

export const INITIAL_CATEGORIES: Omit<Category, 'id'>[] = [
  {
    nameEn: 'Formal & Casual Shirts',
    nameBn: 'ফরমাল ও ক্যাজুয়াল শার্ট',
    slug: 'shirts',
    imageUrl: SAMPLE_GARMENT_IMAGES.formalShirtWhite,
    sortOrder: 1,
    published: true
  },
  {
    nameEn: 'Trousers & Chinos',
    nameBn: 'ট্রাউজার্স ও চিনোস',
    slug: 'trousers',
    imageUrl: SAMPLE_GARMENT_IMAGES.trousersFormal,
    sortOrder: 2,
    published: true
  },
  {
    nameEn: 'Jeans & Denim',
    nameBn: 'জিন্স ও ডেনিম',
    slug: 'jeans',
    imageUrl: SAMPLE_GARMENT_IMAGES.classicJeans,
    sortOrder: 3,
    published: true
  },
  {
    nameEn: 'Polos & T-Shirts',
    nameBn: 'পোলো ও টি-শার্ট',
    slug: 'tshirts',
    imageUrl: SAMPLE_GARMENT_IMAGES.poloTshirt,
    sortOrder: 4,
    published: true
  },
  {
    nameEn: 'Suits & Blazers',
    nameBn: 'স্যুট ও ব্লেজার',
    slug: 'blazers',
    imageUrl: SAMPLE_GARMENT_IMAGES.blazerSuit,
    sortOrder: 5,
    published: true
  },
  {
    nameEn: 'Ethnic Kurta & Sets',
    nameBn: 'পাঞ্জাবি ও কুর্তা সেট',
    slug: 'ethnic',
    imageUrl: SAMPLE_GARMENT_IMAGES.kurtaEthnic,
    sortOrder: 6,
    published: true
  },
  {
    nameEn: 'Accessories & Belts',
    nameBn: 'বেল্ট ও আনুষঙ্গিক',
    slug: 'accessories',
    imageUrl: SAMPLE_GARMENT_IMAGES.accessoriesBelt,
    sortOrder: 7,
    published: true
  }
];

export const INITIAL_SERVICES: Omit<TailoringService, 'id'>[] = [
  {
    titleEn: 'Custom Men\'s Shirt Stitching',
    titleBn: 'পুরুষদের শার্ট সেলাই',
    descriptionEn: 'Custom tailored shirt made to your exact measurements, collar style, and cuff preferences.',
    descriptionBn: 'আপনার সঠিক মাপ, কলার ডিজাইন এবং কাফ পছন্দের ভিত্তিতে নিখুঁত শার্ট সেলাই।',
    priceInr: 350,
    pricingMode: 'fixed',
    sortOrder: 1,
    published: true
  },
  {
    titleEn: 'Trouser & Chino Tailoring',
    titleBn: 'ট্রাউজার্স ও চিনো সেলাই',
    descriptionEn: 'Expertly cut and stitched formal or casual trousers with custom waistband and hem finish.',
    descriptionBn: 'নিখুঁত কাটিং ও ফিটিংসহ ফরমাল বা ক্যাজুয়াল ট্রাউজার্স সেলাই।',
    priceInr: 400,
    pricingMode: 'fixed',
    sortOrder: 2,
    published: true
  },
  {
    titleEn: 'Garment Alterations & Fitting',
    titleBn: 'পোশাক অল্টারেশন ও মাপ সংশোধন',
    descriptionEn: 'Shortening, waist tapering, sleeve adjustment, and general sizing corrections for ready-made garments.',
    descriptionBn: 'শার্ট বা প্যান্টের ঝুল কমানো, কোমর ঢিলে/টাইট করা এবং হাতা মাপমতো করার অল্টারেশন সেবা।',
    priceInr: 120,
    pricingMode: 'fixed',
    sortOrder: 3,
    published: true
  },
  {
    titleEn: 'Bespoke Suit & Blazer Crafting',
    titleBn: 'ব্লেজার ও স্যুট কারিগরি',
    descriptionEn: 'Hand-canvassed two-piece and three-piece suit stitching with premium lining and lapel finishing.',
    descriptionBn: 'উন্নত লাইনিং ও ল্যাপেলসহ প্রিমিয়াম টু-পিস বা থ্রি-পিস স্যুট সেলাই।',
    pricingMode: 'enquiry_only',
    sortOrder: 4,
    published: true
  },
  {
    titleEn: 'Ethnic Kurta & Pajama Tailoring',
    titleBn: 'কুর্তা ও পায়জামা সেলাই',
    descriptionEn: 'Classic Bengali kurta, Nehru jacket, and drawstring or elastic pajama stitching for festivals and weddings.',
    descriptionBn: 'উৎসব ও বিয়ের জন্য ঐতিহ্যবাহী পাঞ্জাবি, নেহরু জ্যাকেট এবং পায়জামা সেলাই।',
    priceInr: 450,
    pricingMode: 'fixed',
    sortOrder: 5,
    published: true
  }
];

export const INITIAL_PRODUCTS: Omit<Product, 'id'>[] = [
  {
    nameEn: 'Classic Royal Oxford Cotton Shirt',
    nameBn: 'ক্লাসিক রয়েল অক্সফোর্ড কটন শার্ট',
    descriptionEn: 'Breathable 100% combed cotton Oxford weave with a structured spread collar. Ideal for corporate wear or evening formal gatherings.',
    descriptionBn: '১০০% আরামদায়ক সুতি কাপড়ের তৈরি অক্সফোর্ড শার্ট। অফিস ও যেকোনো অনুষ্ঠানের জন্য মার্জিত ও টেকসই।',
    categoryId: 'shirts',
    sku: 'JG-SH-001',
    priceInr: 1199,
    compareAtPriceInr: 1499,
    imageUrls: [SAMPLE_GARMENT_IMAGES.formalShirtWhite, SAMPLE_GARMENT_IMAGES.formalShirtBlue],
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)'],
    colors: ['Crisp White', 'Sky Blue', 'Light Lavender'],
    stockQuantity: 18,
    lowStockThreshold: 4,
    featured: true,
    published: true
  },
  {
    nameEn: 'Tailored Slim-Fit Stretch Formal Trousers',
    nameBn: 'টেইলরড স্লিম-ফিট ফরমাল ট্রাউজার্স',
    descriptionEn: 'Wrinkle-resistant poly-viscose blend with elastane for gentle stretch and all-day comfort. Features a flexi-waistband and double-welt back pockets.',
    descriptionBn: 'সারাদিন স্বাচ্ছন্দ্যে পরার উপযোগী স্ট্রেচেবল ফরমাল ট্রাউজার্স। সহজে ভাঁজ পড়ে না এবং নিখুঁত ফিটিং দেয়।',
    categoryId: 'trousers',
    sku: 'JG-TR-002',
    priceInr: 1349,
    compareAtPriceInr: 1699,
    imageUrls: [SAMPLE_GARMENT_IMAGES.trousersFormal],
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['Charcoal Grey', 'Navy Blue', 'Jet Black'],
    stockQuantity: 14,
    lowStockThreshold: 3,
    featured: true,
    published: true
  },
  {
    nameEn: 'Pure Linen Mandarin Collar Shirt',
    nameBn: 'পিওর লিনেন ম্যান্ডারিন কলার শার্ট',
    descriptionEn: 'Lightweight European-grade pure flax linen with band collar and roll-up sleeve tabs. Naturally cooling for warm weather.',
    descriptionBn: 'উচ্চমানের লিনেন কাপড়ে তৈরি ব্যান্ড কলার শার্ট। গরমে অত্যন্ত আরামদায়ক ও ক্যাজুয়াল স্টাইলিশ।',
    categoryId: 'shirts',
    sku: 'JG-SH-003',
    priceInr: 1599,
    compareAtPriceInr: 1999,
    imageUrls: [SAMPLE_GARMENT_IMAGES.linenShirtBeige],
    sizes: ['M (40)', 'L (42)', 'XL (44)'],
    colors: ['Natural Beige', 'Olive Green', 'White'],
    stockQuantity: 8,
    lowStockThreshold: 3,
    featured: true,
    published: true
  },
  {
    nameEn: 'Mid-Rise Vintage Wash Comfort Jeans',
    nameBn: 'ভিন্টেজ ওয়াশ আরামদায়ক ডেনিম জিন্স',
    descriptionEn: 'Durable 12.5 oz ring-spun cotton denim with authentic whiskering, reinforced stress rivets, and clean contrast stitching.',
    descriptionBn: 'মজবুত ডেনিম ফ্যাব্রিক ও স্টাইলিশ ভিন্টেজ ওয়াশের কমফোর্ট জিন্স। দীর্ঘস্থায়ী এবং প্রতিদিন ব্যবহারের উপযোগী।',
    categoryId: 'jeans',
    sku: 'JG-JN-004',
    priceInr: 1499,
    compareAtPriceInr: 1899,
    imageUrls: [SAMPLE_GARMENT_IMAGES.classicJeans],
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['Indigo Dark Wash', 'Faded Blue'],
    stockQuantity: 12,
    lowStockThreshold: 3,
    featured: false,
    published: true
  },
  {
    nameEn: 'Pique Cotton Classic Polo T-Shirt',
    nameBn: 'পিক কটন ক্লাসিক পোলো টি-শার্ট',
    descriptionEn: 'Heavyweight 220 GSM breathable combed pique knit with ribbed collar, mother-of-pearl finish buttons, and embroidered accent.',
    descriptionBn: 'উন্নত মানের ২২০ জিএসএম সুতি পিক কটন পোলো টি-শার্ট। নিখুঁত কলার ও আরামদায়ক গ্রিপ।',
    categoryId: 'tshirts',
    sku: 'JG-TS-005',
    priceInr: 699,
    compareAtPriceInr: 899,
    imageUrls: [SAMPLE_GARMENT_IMAGES.poloTshirt],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy Blue', 'Maroon', 'Bottle Green', 'White'],
    stockQuantity: 25,
    lowStockThreshold: 5,
    featured: true,
    published: true
  },
  {
    nameEn: 'Structured Double-Breasted Wool-Blend Blazer',
    nameBn: 'স্ট্রাকচার্ড উল-ব্লেন্ড ব্লেজার',
    descriptionEn: 'Tailored blazer featuring notch lapels, interior jet pockets, and structured padded shoulders for high-impact presence at weddings or dinners.',
    descriptionBn: 'বিয়ে বা বিশেষ সান্ধ্যকালীন অনুষ্ঠানের জন্য রাজকীয় লুকের নিখুঁত ব্লেজার। ভেতর সুন্দর লাইনিং ও নিখুঁত ফিনিশ।',
    categoryId: 'blazers',
    sku: 'JG-BL-006',
    priceInr: 3999,
    compareAtPriceInr: 4999,
    imageUrls: [SAMPLE_GARMENT_IMAGES.blazerSuit],
    sizes: ['38', '40', '42', '44'],
    colors: ['Midnight Navy', 'Charcoal Anthracite'],
    stockQuantity: 5,
    lowStockThreshold: 2,
    featured: true,
    published: true
  },
  {
    nameEn: 'Festive Jacquard Silk-Blend Kurta',
    nameBn: 'উৎসবের জাকোয়ার্ড সিল্ক-ব্লেন্ড পাঞ্জাবি',
    descriptionEn: 'Artistic self-woven jacquard motifs with subtle sheen, side pockets, and neat button placket. Pairs effortlessly with churidar or denim.',
    descriptionBn: 'আলোকোজ্জ্বল সিল্ক-মিশ্রিত কাপড়ে সূক্ষ্ম বোনা ডিজাইনের পাঞ্জাবি। পূজা, ঈদ ও পারিবারিক উৎসবের সেরা পছন্দ।',
    categoryId: 'ethnic',
    sku: 'JG-ET-007',
    priceInr: 1299,
    compareAtPriceInr: 1650,
    imageUrls: [SAMPLE_GARMENT_IMAGES.kurtaEthnic],
    sizes: ['38', '40', '42', '44'],
    colors: ['Golden Mustard', 'Deep Crimson', 'Ivory Cream'],
    stockQuantity: 10,
    lowStockThreshold: 3,
    featured: false,
    published: true
  },
  {
    nameEn: 'Genuine Reversible Leather Belt with Brushed Buckle',
    nameBn: 'রিভার্সিবল খাঁটি লেদার বেল্ট',
    descriptionEn: 'Full-grain leather with rotating buckle giving two color options (Black / Tan Brown) in one premium accessory.',
    descriptionBn: '১০০% আসল লেদারের দুই পাশ ব্যবহারযোগ্য (কালো ও বাদামি) বেল্ট। দীর্ঘস্থায়ী এবং উন্নত ধাতব বাকলযুক্ত।',
    categoryId: 'accessories',
    sku: 'JG-AC-008',
    priceInr: 599,
    compareAtPriceInr: 799,
    imageUrls: [SAMPLE_GARMENT_IMAGES.accessoriesBelt],
    sizes: ['Free Size (Adjustable 30-42)'],
    colors: ['Black / Tan Brown Reversible'],
    stockQuantity: 15,
    lowStockThreshold: 4,
    featured: false,
    published: true
  }
];

export const INITIAL_REVIEWS: Omit<Review, 'id'>[] = [
  {
    displayName: 'Amitava Banerjee',
    textEn: 'Got three formal shirts stitched here and bought a pair of trousers. The fitting is exceptionally neat, much better than standard mall sizes. Very polite shop staff.',
    textBn: 'এখান থেকে তিনটি ফরমাল শার্ট সেলাই করিয়েছি এবং ট্রাউজার্স কিনেছি। ফিটিং অত্যন্ত নিখুঁত হয়েছে। দোকানদারদের ব্যবহার খুব সুন্দর।',
    rating: 5,
    source: 'Google Review',
    authorized: true,
    published: true
  },
  {
    displayName: 'Subhashish Roy',
    textEn: 'Very reliable tailoring shop. I needed urgent blazer alterations for a family wedding, and they delivered it within 24 hours with exact fitting.',
    textBn: 'খুবই বিশ্বস্ত টেইলারিং শপ। বিয়ের জন্য ব্লেজার অল্টারেশন খুব দ্রুত এবং নিখুঁতভাবে করে দিয়েছেন।',
    rating: 5,
    source: 'Google Review',
    authorized: true,
    published: true
  }
];

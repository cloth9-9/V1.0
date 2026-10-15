// Local bundled project images (stored in /public/images/) - 100% zero-cost and offline resilient
export const LOCAL_PROJECT_IMAGES = [
  { label: 'Royal Oxford Shirt (Local Project Asset)', url: '/images/products/shirt-oxford.svg' },
  { label: 'Tailored Stretch Trousers (Local Project Asset)', url: '/images/products/trousers-formal.svg' },
  { label: 'Structured Blazer (Local Project Asset)', url: '/images/products/blazer-suit.svg' },
  { label: 'Festive Kurta (Local Project Asset)', url: '/images/products/kurta-ethnic.svg' },
  { label: 'Tailoring Studio Banner (Local Project Asset)', url: '/images/hero/tailoring-banner.svg' },
];

// High quality men's fashion and tailoring image assets from Unsplash (Free commercial license)
export const DEFAULT_FALLBACK_IMAGE = '/images/products/shirt-oxford.svg';

export const HERO_DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1600&q=85';

export const SAMPLE_GARMENT_IMAGES = {
  formalShirtWhite: '/images/products/shirt-oxford.svg',
  formalShirtBlue: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
  linenShirtBeige: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
  trousersChino: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
  trousersFormal: '/images/products/trousers-formal.svg',
  blazerSuit: '/images/products/blazer-suit.svg',
  poloTshirt: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
  classicJeans: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
  kurtaEthnic: '/images/products/kurta-ethnic.svg',
  accessoriesBelt: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80',
  tailoringFabrics: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
  tailoringMeasuring: '/images/hero/tailoring-banner.svg'
};

/**
 * Format an Indian or International phone number for WhatsApp wa.me links
 * Strips spaces, dashes, +, and ensures country code 91 if 10 digits
 */
export function formatWhatsAppNumber(phone: string): string {
  if (!phone) return '919876543210';
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return cleaned;
}

/**
 * Construct safe WhatsApp click-to-chat URL
 */
export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const formattedNumber = formatWhatsAppNumber(phoneNumber);
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${formattedNumber}?text=${encodedText}`;
}

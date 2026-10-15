# Janapriya Garments & Clothing (জনপ্রিয় গার্মেন্টস অ্যান্ড ক্লোদিং)

> **Modern Premium Menswear, Tailoring & Bilingual Business Management System**
> **Strict ₹0 Budget Architecture — No Credit Card, No Paid Billing, No Paid APIs**

A complete, production-grade web application and private administrative dashboard built for **Janapriya Garments & Clothing**. Designed specifically for men's fashion, ready-made garments, custom tailoring, alterations, and WhatsApp-based order enquiries.

---

## Strict ₹0 Cost Breakdown Table

Every service, library, and infrastructure component used in this application has been verified for compliance with the strict **₹0 maximum budget**. No credit cards, trial traps, or paid subscriptions are required.

| Technology / Service | Purpose | Genuinely Usable at ₹0 Cost? | Account / Card / Billing Requirements | Free-Tier Limits That Affect App | Potential Future Costs | Free Fallback / Alternative |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Cloud Firestore (Spark Plan)** | Persistent database for products, categories, tailoring services, appointments, enquiries, and settings | **Yes** (Spark Plan is permanently free) | Google Account required. **NO credit card or billing account needed.** | 50,000 reads/day, 20,000 writes/day, 1 GiB total storage. | ₹0 unless manually upgraded to Blaze. | Local cached fallback data already implemented in client. |
| **Firebase Authentication (Spark Plan)** | Secure Google Sign-In for shop managers and staff | **Yes** | Google Account required. **NO credit card needed.** | Up to 50,000 Monthly Active Users (MAU) on identity platform. | ₹0. | Allowlisted email auth / session state. |
| **Image Storage Strategy** | Product images and gallery previews | **Yes** | **NO paid Cloud Storage.** Uses local project assets (`/public/images/products/...`) and free direct URLs (Unsplash / ImgBB / GitHub). | Bound by web hosting bundle size (several GBs free). | ₹0. Firebase Storage Blaze plan is intentionally avoided. | Local SVG/Web project assets already bundled in repository. |
| **WhatsApp Click-to-Chat (`wa.me`)** | Direct product ordering and customer enquiries | **Yes** | Standard personal/business WhatsApp account. **NO WhatsApp Business API fees or Meta developer billing.** | Unlimited direct click-to-chat links. | ₹0. | Direct telephone links (`tel:`) and contact enquiry form. |
| **Google Maps Linking** | Showroom directions and location navigation | **Yes** | None. Standard public Google Maps navigation URL (`maps.google.com`). **NO Google Maps JavaScript API key or billing account.** | Unlimited clicks. | ₹0. | Text-based showroom address and landmark guidance. |
| **Client-Side I18n Engine** | Instant English & Bengali language switching | **Yes** | None. Built with React context and zero external translation API calls. | Unlimited translations without network latency. | ₹0. | Built-in bilingual dictionary (`src/i18n/translations.ts`). |
| **AI Studio Preview & Cloud Run** | Zero-cost development and staging preview URLs | **Yes** | Provided by Google AI Studio Build platform. | Bound by session lifecycle. | ₹0. | Free static hosting (Firebase Hosting, Vercel, GitHub Pages, Cloudflare Pages). |

---

## Key Features

1. **"Modern Premium Menswear" Visual Identity**:
   - Palette: Deep Charcoal (`#171717`), Warm Ivory (`#F8F5EF`), Muted Champagne Gold (`#B89A62`), Soft Beige (`#E9E1D4`).
   - Typography: Serif display font (`Cinzel`) paired with `Plus Jakarta Sans` and `Noto Sans Bengali`.
   - Editorial card layouts, zero-pill discipline, high contrast, and responsive grid structures.

2. **Full Bilingual Support (English & Bengali)**:
   - English is the default language; Bengali can be selected anytime with instant client-side switching.
   - Dual-language database storage (`nameEn`/`nameBn`, `descriptionEn`/`descriptionBn`, `titleEn`/`titleBn`, `announcementEn`/`announcementBn`, etc.).
   - Graceful fallback to English if any field is not yet translated.
   - Language preference stored locally without privacy invasion.

3. **Persistent Cloud Firestore Backend**:
   - Live products catalog, category taxonomy, tailoring services, and site settings.
   - Private, access-controlled collections for tailoring appointments and customer enquiries.
   - Real-time stock tracking with low-stock alerts and out-of-stock indicators.
   - Data payloads sanitized with `cleanData()` to prevent invalid field rejections.

4. **Direct WhatsApp-Based Ordering & Enquiries**:
   - Zero transaction fees, no paid payment gateway required.
   - Generates contextual prefilled WhatsApp messages containing product name, SKU, selected size, color, and price.
   - Honest ordering notice explaining that clicking WhatsApp initiates contact with shop staff who confirm size, fit, and availability.

5. **Private, Secure Admin Dashboard (`/admin` or `#admin`)**:
   - Google Sign-In with Firebase Authentication.
   - Role-based authorization: only allowlisted administrators (e.g. `userhelpdesk9@gmail.com` or users recorded in `/admins/{uid}`) can access.
   - Unauthorized users see a dedicated Access Restricted screen.
   - Live KPI overview cards (Total published products, drafts, low stock, out of stock, pending bookings, new enquiries).
   - Complete product management (add, edit, delete with confirmation, upload/paste image URLs, manage sizes, colors, price, stock).
   - Interactive zero-cost Image Manager with live previews and one-click selection of bundled project assets.
   - Quick inventory adjuster (+1, -1, +5, set custom quantity).
   - Category and Tailoring Service managers with dual-language editing.
   - Appointment and Enquiry managers with status workflows (`pending`, `contacted`, `scheduled`, `completed`, `cancelled`) and private internal staff notes.
   - Site settings manager for instant updates to phone, WhatsApp, opening hours, maps link, announcement banner, and hero copy.
   - One-click initial sample database loader.

6. **Local Project Assets & Zero-Cost Image Architecture**:
   - Pre-packaged SVG graphics for core menswear garments located in `/public/images/products/`:
     - `shirt-oxford.svg` (Royal Oxford Shirt)
     - `trousers-formal.svg` (Tailored Stretch Trousers)
     - `blazer-suit.svg` (Structured Wool Blazer)
     - `kurta-ethnic.svg` (Festive Jacquard Kurta)
     - `tailoring-banner.svg` (Tailoring Studio Banner)
   - Works offline and does not require paid Cloud Storage.

---

## Security Architecture & Firestore Rules

All database access is governed by zero-trust Firestore Security Rules (`firestore.rules`):
- **Public Visitors**:
  - May read published products, published categories, published services, public site settings, and authorized reviews.
  - May **NOT** read appointments, enquiries, or administrator profiles.
  - May submit appointment requests and enquiries with strict field limits (e.g. initial status forced to `pending` or `new`, no access to `internalNotes`).
- **Administrators**:
  - Only authenticated users whose verified email is `userhelpdesk9@gmail.com` or who possess an active document in `/admins/{uid}` with `enabled == true`.

---

## Local Development & Build

### 1. Prerequisites
- Node.js 18+ or 20+
- npm

### 2. Installation
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```

---

## Zero-Cost Deployment Guide (Deploying for ₹0)

### Option A: Using Google AI Studio's Free Preview URL (Zero Setup)
Your application is already hosted and accessible via the provided development and preview URLs:
- **Development App URL**: `https://ais-dev-fjavftmutlii34pt5jphak-218186383401.asia-northeast1.run.app`
- **Shared App URL**: `https://ais-pre-fjavftmutlii34pt5jphak-218186383401.asia-northeast1.run.app`
These URLs are completely free and require no domain purchase.

### Option B: Free Static Deployment via Firebase Hosting (Spark Plan - ₹0)
Firebase Hosting provides 10 GB of storage and 360 MB/day of bandwidth completely free without a credit card.
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login to your free Firebase account:
   ```bash
   firebase login
   ```
3. Initialize hosting in the project folder:
   ```bash
   firebase init hosting
   ```
   - Public directory: `dist`
   - Single-page app: `Yes`
4. Build and deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```
5. Your website will be live at `https://<project-id>.web.app` or `https://<project-id>.firebaseapp.com` at ₹0 cost!

### Option C: GitHub Pages / Cloudflare Pages / Vercel (Hobby Tier - ₹0)
- Simply push the codebase to GitHub.
- Connect your repository to Vercel, Cloudflare Pages, or GitHub Actions.
- Set Build Command: `npm run build`
- Set Output Directory: `dist`
- All of these platforms provide free subdomains (e.g., `*.vercel.app`, `*.pages.dev`, `*.github.io`) with zero fees and no credit card required.

---

## Manual Account Setup Requirements

1. **Google Sign-In Authorized Domains**:
   - In the [Firebase Console](https://console.firebase.google.com), open project `gen-lang-client-0672751952`.
   - Go to **Authentication > Settings > Authorized domains**.
   - Ensure your hosting domain (e.g., `ais-dev-fjavftmutlii34pt5jphak-218186383401.asia-northeast1.run.app` or `<project-id>.web.app`) is in the list.

2. **Provisioning Additional Administrators (Optional)**:
   - Initial bootstrapped admin: `userhelpdesk9@gmail.com`.
   - To add another administrator at ₹0 cost, create a document in Cloud Firestore at path `/admins/{user_uid}` with:
     ```json
     {
       "email": "manager@example.com",
       "role": "admin",
       "enabled": true,
       "createdAt": "2026-10-14T00:00:00.000Z"
     }
     ```

---

## License & Copyright

© 2026 Janapriya Garments & Clothing. All rights reserved. Built with strict ₹0 budget architecture.

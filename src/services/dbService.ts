import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Product,
  Category,
  TailoringService,
  SiteSettings,
  Appointment,
  Enquiry,
  Review,
  AppointmentStatus,
  EnquiryStatus
} from '../types';
import {
  DEFAULT_SITE_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_SERVICES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS
} from './seedService';

// Helper to strip undefined values and id field before writing to Firestore
function cleanData(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  delete result.id;
  return result;
}

// ---------------- Site Settings ----------------
const SETTINGS_PATH = 'siteSettings';
const PUBLIC_SETTINGS_DOC = 'public';

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, SETTINGS_PATH, PUBLIC_SETTINGS_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as SiteSettings;
    }
    return DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.warn('Could not load remote site settings, using defaults:', error);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const path = `${SETTINGS_PATH}/${PUBLIC_SETTINGS_DOC}`;
  try {
    const docRef = doc(db, SETTINGS_PATH, PUBLIC_SETTINGS_DOC);
    const cleanPayload = cleanData(settings);
    cleanPayload.updatedAt = new Date().toISOString();
    await setDoc(docRef, cleanPayload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ---------------- Categories ----------------
const CATEGORIES_PATH = 'categories';

export async function fetchCategories(includeUnpublished = false): Promise<Category[]> {
  try {
    const catRef = collection(db, CATEGORIES_PATH);
    const q = includeUnpublished
      ? catRef
      : query(catRef, where('published', '==', true));
    
    const snap = await getDocs(q);
    const list: Category[] = [];
    snap.forEach(d => {
      list.push({ id: d.id, ...d.data() } as Category);
    });
    return list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch (error) {
    console.warn('Falling back to local initial categories:', error);
    return INITIAL_CATEGORIES.map((c, i) => ({ id: c.slug || `cat-${i}`, ...c }));
  }
}

export async function saveCategory(category: Partial<Category>): Promise<string> {
  const { id, ...data } = category;
  const cleanPayload = cleanData(data);
  cleanPayload.updatedAt = new Date().toISOString();

  try {
    if (id && id.trim()) {
      const docRef = doc(db, CATEGORIES_PATH, id.trim());
      await updateDoc(docRef, cleanPayload);
      return id.trim();
    } else {
      cleanPayload.createdAt = new Date().toISOString();
      const colRef = collection(db, CATEGORIES_PATH);
      const res = await addDoc(colRef, cleanPayload);
      return res.id;
    }
  } catch (error) {
    handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, CATEGORIES_PATH);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const path = `${CATEGORIES_PATH}/${id}`;
  try {
    await deleteDoc(doc(db, CATEGORIES_PATH, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------- Products ----------------
const PRODUCTS_PATH = 'products';

export async function fetchProducts(includeUnpublished = false): Promise<Product[]> {
  try {
    const prodRef = collection(db, PRODUCTS_PATH);
    const q = includeUnpublished
      ? prodRef
      : query(prodRef, where('published', '==', true));

    const snap = await getDocs(q);
    const list: Product[] = [];
    snap.forEach(d => {
      list.push({ id: d.id, ...d.data() } as Product);
    });
    return list;
  } catch (error) {
    console.warn('Falling back to local initial products:', error);
    return INITIAL_PRODUCTS.map((p, i) => ({ id: `sample-prod-${i}`, ...p }));
  }
}

export async function saveProduct(product: Partial<Product>): Promise<string> {
  const { id, ...data } = product;
  const cleanPayload = cleanData(data);
  cleanPayload.updatedAt = new Date().toISOString();

  try {
    if (id && id.trim()) {
      const docRef = doc(db, PRODUCTS_PATH, id.trim());
      await updateDoc(docRef, cleanPayload);
      return id.trim();
    } else {
      cleanPayload.createdAt = new Date().toISOString();
      const colRef = collection(db, PRODUCTS_PATH);
      const res = await addDoc(colRef, cleanPayload);
      return res.id;
    }
  } catch (error) {
    handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, PRODUCTS_PATH);
  }
}

export async function updateProductStock(id: string, newQuantity: number): Promise<void> {
  const path = `${PRODUCTS_PATH}/${id}`;
  try {
    const docRef = doc(db, PRODUCTS_PATH, id);
    await updateDoc(docRef, {
      stockQuantity: Math.max(0, newQuantity),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const path = `${PRODUCTS_PATH}/${id}`;
  try {
    await deleteDoc(doc(db, PRODUCTS_PATH, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------- Tailoring Services ----------------
const SERVICES_PATH = 'services';

export async function fetchServices(includeUnpublished = false): Promise<TailoringService[]> {
  try {
    const sRef = collection(db, SERVICES_PATH);
    const q = includeUnpublished
      ? sRef
      : query(sRef, where('published', '==', true));

    const snap = await getDocs(q);
    const list: TailoringService[] = [];
    snap.forEach(d => {
      list.push({ id: d.id, ...d.data() } as TailoringService);
    });
    return list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch (error) {
    console.warn('Falling back to local initial services:', error);
    return INITIAL_SERVICES.map((s, i) => ({ id: `serv-${i}`, ...s }));
  }
}

export async function saveService(service: Partial<TailoringService>): Promise<string> {
  const { id, ...data } = service;
  const cleanPayload = cleanData(data);
  cleanPayload.updatedAt = new Date().toISOString();

  try {
    if (id && id.trim()) {
      const docRef = doc(db, SERVICES_PATH, id.trim());
      await updateDoc(docRef, cleanPayload);
      return id.trim();
    } else {
      cleanPayload.createdAt = new Date().toISOString();
      const colRef = collection(db, SERVICES_PATH);
      const res = await addDoc(colRef, cleanPayload);
      return res.id;
    }
  } catch (error) {
    handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, SERVICES_PATH);
  }
}

export async function deleteService(id: string): Promise<void> {
  const path = `${SERVICES_PATH}/${id}`;
  try {
    await deleteDoc(doc(db, SERVICES_PATH, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------- Appointments ----------------
const APPOINTMENTS_PATH = 'appointments';

export async function createAppointment(data: {
  customerName: string;
  phone: string;
  requestedDate: string;
  requestedTime: string;
  serviceId?: string;
  serviceName?: string;
  language: 'en' | 'bn';
  customerNotes?: string;
}): Promise<string> {
  try {
    const colRef = collection(db, APPOINTMENTS_PATH);
    const res = await addDoc(colRef, {
      customerName: data.customerName.trim(),
      phone: data.phone.trim(),
      requestedDate: data.requestedDate,
      requestedTime: data.requestedTime,
      serviceId: data.serviceId || '',
      serviceName: data.serviceName || '',
      language: data.language,
      customerNotes: data.customerNotes?.trim() || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return res.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, APPOINTMENTS_PATH);
  }
}

export async function fetchAppointments(): Promise<Appointment[]> {
  try {
    const snap = await getDocs(collection(db, APPOINTMENTS_PATH));
    const list: Appointment[] = [];
    snap.forEach(d => {
      list.push({ id: d.id, ...d.data() } as Appointment);
    });
    return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, APPOINTMENTS_PATH);
  }
}

export async function updateAppointment(id: string, updates: {
  status?: AppointmentStatus;
  internalNotes?: string;
}): Promise<void> {
  const path = `${APPOINTMENTS_PATH}/${id}`;
  try {
    const docRef = doc(db, APPOINTMENTS_PATH, id);
    const cleanPayload = cleanData(updates);
    cleanPayload.updatedAt = new Date().toISOString();
    await updateDoc(docRef, cleanPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteAppointment(id: string): Promise<void> {
  const path = `${APPOINTMENTS_PATH}/${id}`;
  try {
    await deleteDoc(doc(db, APPOINTMENTS_PATH, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------- Enquiries ----------------
const ENQUIRIES_PATH = 'enquiries';

export async function createEnquiry(data: {
  customerName: string;
  phone: string;
  productId?: string;
  productName?: string;
  message: string;
  language: 'en' | 'bn';
}): Promise<string> {
  try {
    const colRef = collection(db, ENQUIRIES_PATH);
    const res = await addDoc(colRef, {
      customerName: data.customerName.trim(),
      phone: data.phone.trim(),
      productId: data.productId || '',
      productName: data.productName || '',
      message: data.message.trim(),
      language: data.language,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return res.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, ENQUIRIES_PATH);
  }
}

export async function fetchEnquiries(): Promise<Enquiry[]> {
  try {
    const snap = await getDocs(collection(db, ENQUIRIES_PATH));
    const list: Enquiry[] = [];
    snap.forEach(d => {
      list.push({ id: d.id, ...d.data() } as Enquiry);
    });
    return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ENQUIRIES_PATH);
  }
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  const path = `${ENQUIRIES_PATH}/${id}`;
  try {
    const docRef = doc(db, ENQUIRIES_PATH, id);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteEnquiry(id: string): Promise<void> {
  const path = `${ENQUIRIES_PATH}/${id}`;
  try {
    await deleteDoc(doc(db, ENQUIRIES_PATH, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------- Reviews ----------------
const REVIEWS_PATH = 'reviews';

export async function fetchReviews(includeUnpublished = false): Promise<Review[]> {
  try {
    const rRef = collection(db, REVIEWS_PATH);
    const q = includeUnpublished
      ? rRef
      : query(rRef, where('published', '==', true), where('authorized', '==', true));
    
    const snap = await getDocs(q);
    const list: Review[] = [];
    snap.forEach(d => {
      list.push({ id: d.id, ...d.data() } as Review);
    });
    return list;
  } catch (error) {
    console.warn('Falling back to local reviews:', error);
    return INITIAL_REVIEWS.map((r, i) => ({ id: `rev-${i}`, ...r }));
  }
}

export async function saveReview(review: Partial<Review>): Promise<string> {
  const { id, ...data } = review;
  const cleanPayload = cleanData(data);
  cleanPayload.updatedAt = new Date().toISOString();

  try {
    if (id && id.trim()) {
      const docRef = doc(db, REVIEWS_PATH, id.trim());
      await updateDoc(docRef, cleanPayload);
      return id.trim();
    } else {
      cleanPayload.createdAt = new Date().toISOString();
      const colRef = collection(db, REVIEWS_PATH);
      const res = await addDoc(colRef, cleanPayload);
      return res.id;
    }
  } catch (error) {
    handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, REVIEWS_PATH);
  }
}

export async function deleteReview(id: string): Promise<void> {
  const path = `${REVIEWS_PATH}/${id}`;
  try {
    await deleteDoc(doc(db, REVIEWS_PATH, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------- Database Seeder ----------------
export async function seedInitialDatabase(): Promise<{
  categories: number;
  services: number;
  products: number;
  reviews: number;
}> {
  let catCount = 0;
  let servCount = 0;
  let prodCount = 0;
  let revCount = 0;

  // 1. Settings
  await saveSiteSettings(DEFAULT_SITE_SETTINGS);

  // 2. Categories
  for (const cat of INITIAL_CATEGORIES) {
    const clean = cleanData(cat);
    clean.createdAt = new Date().toISOString();
    clean.updatedAt = new Date().toISOString();
    await addDoc(collection(db, CATEGORIES_PATH), clean);
    catCount++;
  }

  // 3. Services
  for (const serv of INITIAL_SERVICES) {
    const clean = cleanData(serv);
    clean.createdAt = new Date().toISOString();
    clean.updatedAt = new Date().toISOString();
    await addDoc(collection(db, SERVICES_PATH), clean);
    servCount++;
  }

  // 4. Products
  for (const prod of INITIAL_PRODUCTS) {
    const clean = cleanData(prod);
    clean.createdAt = new Date().toISOString();
    clean.updatedAt = new Date().toISOString();
    await addDoc(collection(db, PRODUCTS_PATH), clean);
    prodCount++;
  }

  // 5. Reviews
  for (const rev of INITIAL_REVIEWS) {
    const clean = cleanData(rev);
    clean.createdAt = new Date().toISOString();
    clean.updatedAt = new Date().toISOString();
    await addDoc(collection(db, REVIEWS_PATH), clean);
    revCount++;
  }

  return {
    categories: catCount,
    services: servCount,
    products: prodCount,
    reviews: revCount
  };
}

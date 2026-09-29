import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import {
  Product,
  ProductCategory,
  CartItem,
  RFQ,
  RFQItem,
  SellerOffer,
  ProcurementOrder,
  EngineeringService,
  IndustryServed,
  VendorDocument,
  SocialMediaItem,
  HomepageSectionConfig,
  ContactMessage,
  WebsiteSettings,
  User,
  SellerProfile,
  AdminRoleType,
  PermissionKey,
  PromotionalOfferBanner
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SERVICES,
  INITIAL_INDUSTRIES,
  INITIAL_VENDOR_DOCUMENTS,
  INITIAL_SOCIAL_MEDIA,
  INITIAL_HOMEPAGE_SECTIONS,
  INITIAL_PROMOTIONAL_OFFER
} from '../data/initialData';

export type ViewType =
  | 'home'
  | 'shop'
  | 'product_detail'
  | 'cart'
  | 'rfq_builder'
  | 'services'
  | 'service_detail'
  | 'industries'
  | 'vendor_enlistment'
  | 'company_profile'
  | 'about_us'
  | 'contact'
  | 'customer_dashboard'
  | 'seller_portal'
  | 'admin_dashboard';

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType, params?: { productId?: string; serviceId?: string; rfqId?: string; categorySlug?: string }) => void;
  selectedProductId: string | null;
  selectedServiceId: string | null;
  selectedRfqId: string | null;
  selectedCategorySlug: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  currentUser: User;
  isAuthenticated: boolean;
  authLoading: boolean;
  authConfigured: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  uploadSiteImage: (file: File, folder: 'branding' | 'products') => Promise<string | null>;
  hasPermission: (permission: PermissionKey) => boolean;
  siteConfigReady: boolean;
  adminUsers: User[];
  loadAdminUsers: () => Promise<void>;
  manageAdminRole: (email: string, role: AdminRoleType | 'none') => Promise<boolean>;

  products: Product[];
  categories: ProductCategory[];
  categoriesWithCounts: (ProductCategory & { productCount: number })[];
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  rfqs: RFQ[];
  sellerOffers: SellerOffer[];
  procurementOrders: ProcurementOrder[];
  services: EngineeringService[];
  industries: IndustryServed[];
  vendorDocuments: VendorDocument[];
  socialMedia: SocialMediaItem[];
  homepageSections: HomepageSectionConfig[];
  websiteSettings: WebsiteSettings;
  contactMessages: ContactMessage[];
  sellers: SellerProfile[];
  managedAccounts: User[];

  // Dynamic Product discovery lists
  featuredProducts: Product[];
  bestSellingProducts: Product[];
  bestRatedProducts: Product[];
  specialOfferProducts: Product[];
  newProducts: Product[];

  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Cart-to-RFQ Workflow
  cartToRfq: () => void;
  importCartIntoRfq: () => void;
  rfqDraftItems: RFQItem[];
  addDraftRfqItem: (product: Product, quantity?: number) => void;
  removeDraftRfqItem: (itemId: string) => void;
  updateDraftRfqQuantity: (itemId: string, quantity: number) => void;
  updateDraftRfqNotes: (itemId: string, notes: string) => void;
  submitRfq: (info: { deliveryLocation: string; requiredDate: string; overallNotes?: string }) => string;

  // Seller Offer & RFQ workflow
  submitSellerOffer: (offerData: Omit<SellerOffer, 'id' | 'submittedAt' | 'status'>) => void;
  submitBuyerOffer: (offerData: Omit<SellerOffer, 'id' | 'submittedAt' | 'status'>) => void;
  selectSellerOffer: (rfqId: string, offerId: string) => void;
  rejectSellerOffer: (rfqId: string, offerId: string) => void;
  submitCounterOffer: (rfqId: string, offerId: string, counterPrice: number, counterNotes?: string) => void;
  acceptCounterOffer: (offerId: string) => void;
  declineCounterOffer: (offerId: string) => void;
  registerUser: (data: { role: 'buyer' | 'seller'; name: string; email: string; companyName: string; phone: string; password: string }) => Promise<boolean>;
  confirmSellerOrder: (
    offerId: string,
    dispatchDetails?: {
      courierName: string;
      trackingNumber: string;
      estimatedDeliveryDate: string;
      dispatchNotes?: string;
    }
  ) => Promise<void>;

  // Admin Management Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'views' | 'salesCount'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addCategory: (category: Omit<ProductCategory, 'id'>) => void;
  updateCategory: (id: string, category: Partial<ProductCategory>) => void;
  deleteCategory: (id: string) => void;

  updateSellerStatus: (sellerId: string, status: 'approved' | 'rejected' | 'suspended' | 'pending') => void;
  loadManagedAccounts: () => Promise<void>;
  manageAccount: (userId: string, action: 'approve_buyer' | 'reject_buyer' | 'deactivate' | 'reactivate_buyer') => Promise<boolean>;
  updateRfqStatus: (rfqId: string, status: RFQ['status']) => void;

  addVendorDocument: (doc: Omit<VendorDocument, 'id' | 'updatedAt'>) => void;
  updateVendorDocument: (id: string, doc: Partial<VendorDocument>) => void;
  deleteVendorDocument: (id: string) => void;
  downloadDocument: (doc: VendorDocument) => void;

  updateWebsiteSettings: (settings: Partial<WebsiteSettings>) => void;
  addSocialMedia: (item: Omit<SocialMediaItem, 'id'>) => void;
  updateSocialMedia: (id: string, item: Partial<SocialMediaItem>) => void;
  deleteSocialMedia: (id: string) => void;

  updateHomepageSection: (id: string, updates: Partial<HomepageSectionConfig>) => void;
  addHomepageSection: (section: Omit<HomepageSectionConfig, 'id'>) => void;
  deleteHomepageSection: (id: string) => void;
  reorderHomepageSection: (id: string, direction: 'up' | 'down') => void;
  submitContactForm: (message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => void;

  // Promotional Offer Banner (Admin Controlled)
  promotionalOffer: PromotionalOfferBanner;
  updatePromotionalOffer: (offer: Partial<PromotionalOfferBanner>) => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'art_industrial_v2_';

const GUEST_USER: User = {
  id: '',
  name: 'Guest',
  email: '',
  phone: '',
  role: 'customer',
  createdAt: '',
  isActive: false
};

interface ProfileRecord {
  id: string;
  full_name: string;
  email?: string;
  phone: string;
  company_name: string;
  role: User['role'];
  admin_role: User['adminRole'] | null;
  buyer_status: User['buyerStatus'] | null;
  seller_status: User['sellerStatus'] | null;
  is_active: boolean;
  created_at: string;
}

async function fetchUserProfile(userId: string, email: string): Promise<User> {
  if (!supabase) throw new Error('Database is not configured.');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  const profile = data as unknown as ProfileRecord;

  return {
    id: profile.id,
    name: profile.full_name,
    email: profile.email || email,
    phone: profile.phone,
    companyName: profile.company_name,
    role: profile.role,
    adminRole: profile.admin_role || undefined,
    buyerStatus: profile.buyer_status || undefined,
    sellerStatus: profile.seller_status || undefined,
    createdAt: profile.created_at,
    isActive: profile.is_active
  };
}

async function fetchSellerProfiles(): Promise<SellerProfile[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'seller')
    .order('created_at', { ascending: false });
  if (error) throw error;

  return ((data || []) as unknown as ProfileRecord[]).map(profile => ({
    id: profile.id,
    userId: profile.id,
    companyName: profile.company_name,
    contactPerson: profile.full_name,
    email: profile.email || '',
    phone: profile.phone,
    address: '',
    tradeLicenseNumber: '',
    tinNumber: '',
    binNumber: '',
    businessType: '',
    status: profile.seller_status || 'pending',
    rating: 0,
    totalDeals: 0,
    joinedDate: profile.created_at
  }));
}

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('Storage error', e);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage save error', e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentViewInternal] = useState<ViewType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Persistent States
  const [currentUser, setCurrentUser] = useState<User>(GUEST_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [siteConfigReady, setSiteConfigReady] = useState(false);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [managedAccounts, setManagedAccounts] = useState<User[]>([]);
  const sharedConfigSnapshot = useRef<Record<string, string>>({});
  const pendingConfigWrites = useRef<Record<string, string>>({});

  const [websiteSettings, setWebsiteSettingsState] = useState<WebsiteSettings>(() => getStorage('settings', INITIAL_SETTINGS));
  const [categories, setCategories] = useState<ProductCategory[]>(() => getStorage('categories', INITIAL_CATEGORIES));
  const [products, setProducts] = useState<Product[]>(() => getStorage('products', INITIAL_PRODUCTS));
  const [cart, setCart] = useState<CartItem[]>(() => getStorage('cart', []));
  const [rfqs, setRfqs] = useState<RFQ[]>(() => getStorage('production_rfqs', []));
  const [sellerOffers, setSellerOffers] = useState<SellerOffer[]>(() => getStorage('production_offers', []));
  const [procurementOrders, setProcurementOrders] = useState<ProcurementOrder[]>(() => getStorage('production_orders', []));
  const [services, setServices] = useState<EngineeringService[]>(() => getStorage('services', INITIAL_SERVICES));
  const [industries, setIndustries] = useState<IndustryServed[]>(() => getStorage('industries', INITIAL_INDUSTRIES));
  const [vendorDocuments, setVendorDocuments] = useState<VendorDocument[]>(() => getStorage('documents', INITIAL_VENDOR_DOCUMENTS));
  const [socialMedia, setSocialMedia] = useState<SocialMediaItem[]>(() => getStorage('social', INITIAL_SOCIAL_MEDIA));
  const [homepageSections, setHomepageSections] = useState<HomepageSectionConfig[]>(() => getStorage('homepage_sections', INITIAL_HOMEPAGE_SECTIONS));
  const [sellers, setSellers] = useState<SellerProfile[]>(() => getStorage('production_sellers', []));
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => getStorage('contact_messages', []));
  const [promotionalOffer, setPromotionalOfferState] = useState<PromotionalOfferBanner>(() => getStorage('promo_offer', INITIAL_PROMOTIONAL_OFFER));

  // RFQ Builder Draft Items (Pre-populated from Cart or added directly)
  const [rfqDraftItems, setRfqDraftItems] = useState<RFQItem[]>(() => getStorage('rfq_draft', []));

  // Restore hosted authentication; role and account status come from the database profile.
  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }
    const client = supabase;

    let active = true;
    const applySession = async (session: { user: { id: string; email?: string } } | null) => {
      if (!active) return;
      if (!session) {
        setCurrentUser(GUEST_USER);
        setIsAuthenticated(false);
        setAuthLoading(false);
        return;
      }

      try {
        const profile = await fetchUserProfile(session.user.id, session.user.email || '');
        if (!active) return;
        setCurrentUser(profile);
        setIsAuthenticated(profile.isActive);
        try {
          setSellers(await fetchSellerProfiles());
        } catch (sellerError) {
          console.error('Unable to load seller profiles', sellerError);
          setSellers([]);
        }

        try {
          const [rfqResult, offerResult, orderResult] = await Promise.all([
            client.from('marketplace_rfqs').select('data'),
            client.from('marketplace_offers').select('data'),
            client.from('marketplace_orders').select('data')
          ]);
          const workflowError = rfqResult.error || offerResult.error || orderResult.error;
          if (workflowError) throw workflowError;
          if (!active) return;
          setRfqs((rfqResult.data || []).map(record => record.data as unknown as RFQ));
          setSellerOffers((offerResult.data || []).map(record => record.data as unknown as SellerOffer));
          setProcurementOrders((orderResult.data || []).map(record => record.data as unknown as ProcurementOrder));
        } catch (workflowError) {
          console.error('Unable to load shared marketplace workflows', workflowError);
          if (active) setToastMessage('Marketplace tables are not ready. Apply the latest Supabase schema to sync RFQs and orders.');
        }
      } catch (error) {
        console.error('Unable to load account profile', error);
        setCurrentUser(GUEST_USER);
        setIsAuthenticated(false);
        setToastMessage('Your account profile could not be loaded. Contact the site administrator.');
      } finally {
        if (active) setAuthLoading(false);
      }
    };

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      return applySession(data.session);
    }).catch(error => {
      console.error('Unable to restore authentication session', error);
      if (active) setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthLoading(Boolean(session));
      window.setTimeout(() => void applySession(session), 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    let active = true;
    const loadSiteConfig = async () => {
      const { data, error } = await client
        .from('site_config')
        .select('config_key, config_value');

      if (error) {
        console.error('Unable to load shared site configuration', error);
        if (active) setToastMessage('Shared settings could not load. Run the latest Supabase schema before editing site content.');
        return;
      }

      if (!active) return;
      for (const row of (data || []) as { config_key: string; config_value: unknown }[]) {
        sharedConfigSnapshot.current[row.config_key] = JSON.stringify(row.config_value);
        switch (row.config_key) {
          case 'website_settings': setWebsiteSettingsState(row.config_value as WebsiteSettings); break;
          case 'categories': setCategories(row.config_value as ProductCategory[]); break;
          case 'products': setProducts(row.config_value as Product[]); break;
          case 'services': setServices(row.config_value as EngineeringService[]); break;
          case 'industries': setIndustries(row.config_value as IndustryServed[]); break;
          case 'vendor_documents': setVendorDocuments(row.config_value as VendorDocument[]); break;
          case 'social_media': setSocialMedia(row.config_value as SocialMediaItem[]); break;
          case 'homepage_sections': setHomepageSections((row.config_value as HomepageSectionConfig[]).filter(section => section.type !== 'hero' && section.type !== 'quick_actions')); break;
          case 'promotional_offer': setPromotionalOfferState(row.config_value as PromotionalOfferBanner); break;
        }
      }
      setSiteConfigReady(true);
    };

    void loadSiteConfig();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let active = true;

    const syncRfqs = async () => {
      const { data, error } = await client.from('marketplace_rfqs').select('data');
      if (!active) return;
      if (error) { console.error('Unable to refresh shared RFQs', error); return; }
      setRfqs((data || []).map(record => record.data as unknown as RFQ));
    };
    const syncOffers = async () => {
      const { data, error } = await client.from('marketplace_offers').select('data');
      if (!active) return;
      if (error) { console.error('Unable to refresh shared offers', error); return; }
      setSellerOffers((data || []).map(record => record.data as unknown as SellerOffer));
    };
    const syncOrders = async () => {
      const { data, error } = await client.from('marketplace_orders').select('data');
      if (!active) return;
      if (error) { console.error('Unable to refresh shared orders', error); return; }
      setProcurementOrders((data || []).map(record => record.data as unknown as ProcurementOrder));
    };
    const syncSiteConfig = async () => {
      const { data, error } = await client.from('site_config').select('config_key, config_value');
      if (!active || error || !data) return;
      for (const row of data as { config_key: string; config_value: unknown }[]) {
        sharedConfigSnapshot.current[row.config_key] = JSON.stringify(row.config_value);
        switch (row.config_key) {
          case 'website_settings': setWebsiteSettingsState(row.config_value as WebsiteSettings); break;
          case 'categories': setCategories(row.config_value as ProductCategory[]); break;
          case 'products': setProducts(row.config_value as Product[]); break;
          case 'services': setServices(row.config_value as EngineeringService[]); break;
          case 'industries': setIndustries(row.config_value as IndustryServed[]); break;
          case 'vendor_documents': setVendorDocuments(row.config_value as VendorDocument[]); break;
          case 'social_media': setSocialMedia(row.config_value as SocialMediaItem[]); break;
          case 'homepage_sections': setHomepageSections((row.config_value as HomepageSectionConfig[]).filter(section => section.type !== 'hero' && section.type !== 'quick_actions')); break;
          case 'promotional_offer': setPromotionalOfferState(row.config_value as PromotionalOfferBanner); break;
        }
      }
    };
    const syncProfiles = async (changedUserId: string) => {
      if (currentUser.id && changedUserId === currentUser.id) {
        try {
          const profile = await fetchUserProfile(currentUser.id, currentUser.email);
          if (!active) return;
          setCurrentUser(profile);
          setIsAuthenticated(profile.isActive);
        } catch (error) {
          console.error('Unable to refresh account permissions', error);
        }
      }
      await Promise.all([loadManagedAccounts(), loadAdminUsers()]);
      try { setSellers(await fetchSellerProfiles()); } catch (error) { console.error('Unable to refresh seller list', error); }
    };

    const channel = client.channel('global-site-and-marketplace-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, () => { void syncSiteConfig(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketplace_rfqs' }, () => { void syncRfqs(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketplace_offers' }, () => { void syncOffers(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketplace_orders' }, () => { void syncOrders(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, payload => {
        const profileChange = payload as { new: { id?: string } | null; old: { id?: string } | null };
        const changedUserId = String(profileChange.new?.id || profileChange.old?.id || '');
        if (changedUserId) void syncProfiles(changedUserId);
      })
      .subscribe();

    return () => {
      active = false;
      void client.removeChannel(channel);
    };
  }, [currentUser.id, currentUser.email]);

  // Sync non-sensitive application preferences and working data to local storage.
  useEffect(() => setStorage('settings', websiteSettings), [websiteSettings]);
  useEffect(() => setStorage('categories', categories), [categories]);
  useEffect(() => setStorage('products', products), [products]);
  useEffect(() => setStorage('cart', cart), [cart]);
  useEffect(() => setStorage('production_rfqs', rfqs), [rfqs]);
  useEffect(() => setStorage('production_offers', sellerOffers), [sellerOffers]);
  useEffect(() => setStorage('production_orders', procurementOrders), [procurementOrders]);
  useEffect(() => setStorage('services', services), [services]);
  useEffect(() => setStorage('industries', industries), [industries]);
  useEffect(() => setStorage('documents', vendorDocuments), [vendorDocuments]);
  useEffect(() => setStorage('social', socialMedia), [socialMedia]);
  useEffect(() => setStorage('homepage_sections', homepageSections), [homepageSections]);
  useEffect(() => setStorage('production_sellers', sellers), [sellers]);
  useEffect(() => setStorage('contact_messages', contactMessages), [contactMessages]);
  useEffect(() => setStorage('promo_offer', promotionalOffer), [promotionalOffer]);
  useEffect(() => setStorage('rfq_draft', rfqDraftItems), [rfqDraftItems]);

  const setCurrentView = (
    view: ViewType,
    params?: { productId?: string; serviceId?: string; rfqId?: string; categorySlug?: string }
  ) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (params?.productId) setSelectedProductId(params.productId);
    if (params?.serviceId) setSelectedServiceId(params.serviceId);
    if (params?.rfqId) setSelectedRfqId(params.rfqId);
    if (params?.categorySlug !== undefined) setSelectedCategorySlug(params.categorySlug);
    setCurrentViewInternal(view);
  };

  // Live dynamic category product counts (never hardcoded!)
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    productCount: products.filter(p => p.categoryId === cat.id && p.isActive).length
  }));

  // Dynamic Product Collections
  const featuredProducts = products.filter(p => p.isActive && p.isFeatured);
  const bestSellingProducts = [...products.filter(p => p.isActive)].sort((a, b) => b.salesCount - a.salesCount);
  const bestRatedProducts = [...products.filter(p => p.isActive)].sort((a, b) => b.rating - a.rating);
  const specialOfferProducts = products.filter(p => p.isActive && (p.isSpecialOffer || (p.salePrice && p.salePrice < p.price)));
  const newProducts = [...products.filter(p => p.isActive)].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Cart calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => {
    const unitPrice = item.product.salePrice ?? item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { productId: product.id, quantity, product }];
    });
    showToast(`Added ${quantity}x "${product.name}" to cart`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    showToast('Removed item from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  // CART TO RFQ WORKFLOW (Prepopulates RFQ with Cart Items)
  const cartToRfq = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty! Please add products before requesting an RFQ.');
      setCurrentView('shop');
      return;
    }

    const itemsFromCart: RFQItem[] = cart.map((item, idx) => ({
      id: `draft-item-${Date.now()}-${idx}`,
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      category: categories.find(c => c.id === item.product.categoryId)?.name || 'General Spares',
      image: item.product.images[0],
      quantity: item.quantity,
      unit: item.product.unit || 'pcs',
      notes: ''
    }));

    setRfqDraftItems(itemsFromCart);
    showToast(`Transferred ${itemsFromCart.length} cart products into RFQ Builder.`);
    setCurrentView('rfq_builder');
  };

  const importCartIntoRfq = () => {
    if (cart.length === 0) {
      showToast('No items in cart to import.');
      return;
    }

    setRfqDraftItems(prev => {
      const merged = [...prev];
      let addedCount = 0;
      cart.forEach((cartItem, idx) => {
        const existing = merged.find(i => i.productId === cartItem.productId);
        if (existing) {
          existing.quantity += cartItem.quantity;
        } else {
          merged.push({
            id: `draft-item-${Date.now()}-${idx}`,
            productId: cartItem.product.id,
            productName: cartItem.product.name,
            sku: cartItem.product.sku,
            category: categories.find(c => c.id === cartItem.product.categoryId)?.name || 'General Spares',
            image: cartItem.product.images[0],
            quantity: cartItem.quantity,
            unit: cartItem.product.unit || 'pcs',
            notes: ''
          });
          addedCount++;
        }
      });
      showToast(`Synced ${cart.length} items from cart into this quotation.`);
      return merged;
    });
  };

  const addDraftRfqItem = (product: Product, quantity = 1) => {
    setRfqDraftItems(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i =>
          i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      const newItem: RFQItem = {
        id: `draft-item-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        category: categories.find(c => c.id === product.categoryId)?.name || 'General Spares',
        image: product.images[0],
        quantity,
        unit: product.unit || 'pcs',
        notes: ''
      };
      return [...prev, newItem];
    });
    showToast(`Added "${product.name}" to quotation list`);
  };

  const removeDraftRfqItem = (itemId: string) => {
    setRfqDraftItems(prev => prev.filter(i => i.id !== itemId));
    showToast('Removed product from RFQ');
  };

  const updateDraftRfqQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) return;
    setRfqDraftItems(prev =>
      prev.map(i => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const updateDraftRfqNotes = (itemId: string, notes: string) => {
    setRfqDraftItems(prev =>
      prev.map(i => (i.id === itemId ? { ...i, notes } : i))
    );
  };

  const submitRfq = (info: { deliveryLocation: string; requiredDate: string; overallNotes?: string }): string => {
    const canSubmitBuyerRfq = currentUser.role === 'customer' && currentUser.buyerStatus === 'approved';
    const canSubmitSellerRfq = currentUser.role === 'seller' && currentUser.sellerStatus === 'approved';
    if (!isAuthenticated || (!canSubmitBuyerRfq && !canSubmitSellerRfq)) {
      showToast('An approved buyer or seller account is required to submit a quotation request.');
      return '';
    }

    const rfqId = `RFQ-${Date.now()}`;

    const newRfq: RFQ = {
      id: rfqId,
      customerId: currentUser.id,
      createdByRole: currentUser.role === 'seller' ? 'seller' : 'customer',
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: currentUser.phone,
      companyName: currentUser.companyName || '',
      deliveryLocation: info.deliveryLocation,
      requiredDate: info.requiredDate,
      overallNotes: info.overallNotes,
      status: 'Submitted',
      items: [...rfqDraftItems],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setRfqs(prev => [newRfq, ...prev]);
    void persistMarketplaceRecord('rfq', newRfq);
    setRfqDraftItems([]);
    clearCart();
    showToast(`Quotation ${rfqId} submitted successfully.`);
    return rfqId;
  };

  // Seller Offer Workflow
  const submitSellerOffer = (offerData: Omit<SellerOffer, 'id' | 'submittedAt' | 'status'>) => {
    const rfq = rfqs.find(item => item.id === offerData.rfqId);
    const ownerRole = rfq?.createdByRole || 'customer';
    if (!isAuthenticated || currentUser.role !== 'seller' || currentUser.sellerStatus !== 'approved' || offerData.sellerId !== currentUser.id || !rfq || rfq.customerId === currentUser.id || ownerRole !== 'customer') {
      showToast('An approved seller account can submit offers to buyer RFQs only.');
      return;
    }

    const newOfferId = `off-${Date.now()}`;
    const newOffer: SellerOffer = {
      ...offerData,
      bidderRole: 'seller',
      id: newOfferId,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    setSellerOffers(prev => [newOffer, ...prev]);
    void persistMarketplaceRecord('offer', newOffer);

    // Update RFQ status to Offers Received
    setRfqs(prev =>
      prev.map(r => (r.id === offerData.rfqId ? { ...r, status: 'Offers Received', updatedAt: new Date().toISOString() } : r))
    );

    showToast(`Offer of ৳${newOffer.totalPrice.toLocaleString()} submitted for ${offerData.rfqId}`);
  };

  const submitBuyerOffer = (offerData: Omit<SellerOffer, 'id' | 'submittedAt' | 'status'>) => {
    const rfq = rfqs.find(item => item.id === offerData.rfqId);
    if (!isAuthenticated || currentUser.role !== 'customer' || currentUser.buyerStatus !== 'approved' || offerData.sellerId !== currentUser.id || !rfq || rfq.createdByRole !== 'seller' || rfq.customerId === currentUser.id) {
      showToast('An approved buyer account can respond to seller RFQs only.');
      return;
    }

    const newOffer: SellerOffer = {
      ...offerData,
      bidderRole: 'customer',
      id: `off-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    setSellerOffers(prev => [newOffer, ...prev]);
    void persistMarketplaceRecord('offer', newOffer);
    setRfqs(prev => prev.map(item => item.id === rfq.id ? { ...item, status: 'Offers Received', updatedAt: new Date().toISOString() } : item));
    showToast(`Response submitted for ${rfq.id}.`);
  };

  const selectSellerOffer = (rfqId: string, offerId: string) => {
    const targetRfq = rfqs.find(r => r.id === rfqId);
    const targetOffer = sellerOffers.find(offer => offer.id === offerId && offer.rfqId === rfqId);
    const ownerRole = targetRfq?.createdByRole || 'customer';
    const isApprovedOwner = currentUser.role === 'customer'
      ? currentUser.buyerStatus === 'approved'
      : currentUser.role === 'seller' && currentUser.sellerStatus === 'approved';
    if (!isAuthenticated || !isApprovedOwner || targetRfq?.customerId !== currentUser.id || ownerRole !== currentUser.role || !targetOffer) {
      showToast('Only the approved account that submitted this request can select a response.');
      return;
    }

    const updatedOffers = sellerOffers.map(o => {
        if (o.rfqId === rfqId) {
          return o.id === offerId ? { ...o, status: 'selected' as const } : { ...o, status: 'rejected' as const };
        }
        return o;
      });
    setSellerOffers(updatedOffers);
    const selectedOfferForSync = updatedOffers.find(offer => offer.id === offerId);
    if (selectedOfferForSync) void persistMarketplaceRecord('offer', selectedOfferForSync);

    const updatedRfq = { ...targetRfq, status: 'Seller Selected' as const, selectedSellerOfferId: offerId, updatedAt: new Date().toISOString() };
    setRfqs(prev => prev.map(r => r.id === rfqId ? updatedRfq : r));
    void persistMarketplaceRecord('rfq', updatedRfq);

    const selOffer = sellerOffers.find(o => o.id === offerId);
    showToast(`Selected supplier: ${selOffer?.sellerCompany || 'Seller'}. Supplier notified to confirm fulfillment.`);
  };

  const rejectSellerOffer = (rfqId: string, offerId: string) => {
    const targetRfq = rfqs.find(r => r.id === rfqId);
    const targetOffer = sellerOffers.find(offer => offer.id === offerId && offer.rfqId === rfqId);
    const ownerRole = targetRfq?.createdByRole || 'customer';
    const isApprovedOwner = currentUser.role === 'customer'
      ? currentUser.buyerStatus === 'approved'
      : currentUser.role === 'seller' && currentUser.sellerStatus === 'approved';
    if (!isAuthenticated || !isApprovedOwner || targetRfq?.customerId !== currentUser.id || ownerRole !== currentUser.role || !targetOffer) {
      showToast('Only the approved RFQ owner can decline a response.');
      return;
    }
    setSellerOffers(prev =>
      prev.map(o => (o.id === offerId ? { ...o, status: 'rejected' } : o))
    );
    void persistMarketplaceRecord('offer', { ...targetOffer, status: 'rejected' });
    showToast('Supplier offer marked as rejected.');
  };

  const submitCounterOffer = (rfqId: string, offerId: string, counterPrice: number, counterNotes?: string) => {
    const targetRfq = rfqs.find(r => r.id === rfqId);
    const targetOffer = sellerOffers.find(offer => offer.id === offerId && offer.rfqId === rfqId);
    const ownerRole = targetRfq?.createdByRole || 'customer';
    const isApprovedOwner = currentUser.role === 'customer'
      ? currentUser.buyerStatus === 'approved'
      : currentUser.role === 'seller' && currentUser.sellerStatus === 'approved';
    if (!isAuthenticated || !isApprovedOwner || targetRfq?.customerId !== currentUser.id || ownerRole !== currentUser.role || !targetOffer || targetOffer.status !== 'pending' || counterPrice <= 0) {
      showToast('Only the approved RFQ owner can send a valid counteroffer.');
      return;
    }
    const updatedOffer = {
      ...targetOffer,
      status: 'counter_offered' as const,
      counterPrice,
      counterNotes: counterNotes || 'Buyer proposed a counteroffer.',
      counterAt: new Date().toISOString()
    };
    setSellerOffers(prev =>
      prev.map(o => {
        if (o.id === offerId) {
          return updatedOffer;
        }
        return o;
      })
    );
    void persistMarketplaceRecord('offer', updatedOffer);
    showToast(`Counter offer of ৳${counterPrice.toLocaleString()} transmitted to bidder!`);
  };

  const acceptCounterOffer = (offerId: string) => {
    const offer = sellerOffers.find(o => o.id === offerId);
    const bidderRole = offer?.bidderRole || 'seller';
    const bidderApproved = bidderRole === 'seller' ? currentUser.sellerStatus === 'approved' : currentUser.buyerStatus === 'approved';
    if (!offer || offer.sellerId !== currentUser.id || offer.status !== 'counter_offered' || !isAuthenticated || currentUser.role !== bidderRole || !bidderApproved) {
      showToast('Only the account that submitted this response can accept its counteroffer.');
      return;
    }
    const finalPrice = offer.counterPrice || offer.totalPrice;

    setSellerOffers(prev =>
      prev.map(o => (o.id === offerId ? { ...o, totalPrice: finalPrice, status: 'selected' } : o))
    );
    void persistMarketplaceRecord('offer', { ...offer, totalPrice: finalPrice, status: 'selected' });
    setRfqs(prev =>
      prev.map(r => (r.id === offer.rfqId ? { ...r, status: 'Seller Selected', selectedSellerOfferId: offerId } : r))
    );
    showToast(`Accepted counter offer of ৳${finalPrice.toLocaleString()}! Supplier selected.`);
  };

  const declineCounterOffer = (offerId: string) => {
    const offer = sellerOffers.find(o => o.id === offerId);
    const bidderRole = offer?.bidderRole || 'seller';
    const bidderApproved = bidderRole === 'seller' ? currentUser.sellerStatus === 'approved' : currentUser.buyerStatus === 'approved';
    if (!offer || offer.sellerId !== currentUser.id || offer.status !== 'counter_offered' || !isAuthenticated || currentUser.role !== bidderRole || !bidderApproved) {
      showToast('Only the account that submitted this response can decline its counteroffer.');
      return;
    }
    setSellerOffers(prev =>
      prev.map(o => (o.id === offerId ? { ...o, status: 'pending' } : o))
    );
    void persistMarketplaceRecord('offer', { ...offer, status: 'pending' });
    showToast('Counter offer declined. Original quote remains active.');
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    if (!supabase) {
      showToast('Database is not configured. Set the Supabase environment variables to enable sign in.');
      return false;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes('invalid login credentials')) {
        showToast('Supabase did not accept this email/password. Check the exact Auth user email or reset that user’s password in Supabase.');
      } else if (message.includes('email not confirmed')) {
        showToast('Confirm this email in Supabase Authentication before signing in.');
      } else {
        showToast(`Sign in failed: ${error.message}`);
      }
      return false;
    }
    if (!data.user) {
      showToast('Sign in failed. No user session was returned.');
      return false;
    }

    try {
      const profile = await fetchUserProfile(data.user.id, data.user.email || email);
      if (!profile.isActive) {
        await supabase.auth.signOut();
        showToast('This account is inactive. Contact the site administrator.');
        return false;
      }
      setCurrentUser(profile);
      setIsAuthenticated(true);
      showToast('Signed in successfully.');
      return true;
    } catch (error) {
      console.error('Unable to load account profile', error);
      showToast('Your account profile could not be loaded. Contact the site administrator.');
      await supabase.auth.signOut();
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        showToast('Unable to sign out. Please try again.');
        return;
      }
    }
    setCurrentUser(GUEST_USER);
    setIsAuthenticated(false);
    setCurrentView('home');
    showToast('You have signed out.');
  };

  const uploadSiteImage = async (file: File, folder: 'branding' | 'products'): Promise<string | null> => {
    const permission = folder === 'branding' ? 'settings.manage' : 'products.add';
    if (!supabase || !isAuthenticated || !hasPermission(permission)) {
      showToast('Your account does not have permission to upload this image.');
      return null;
    }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      showToast('Choose a JPG, PNG, WebP, or GIF image up to 5 MB.');
      return null;
    }

    const safeFileName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, '-');
    const filePath = `${folder}/${currentUser.id}/${crypto.randomUUID()}-${safeFileName}`;
    const { error } = await supabase.storage.from('site-assets').upload(filePath, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false
    });
    if (error) {
      console.error('Unable to upload site image', error);
      showToast('Image upload failed. Apply the latest Supabase schema and try again.');
      return null;
    }

    const { data } = supabase.storage.from('site-assets').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const registerUser = async (data: {
    role: 'buyer' | 'seller';
    name: string;
    email: string;
    companyName: string;
    phone: string;
    password: string;
  }): Promise<boolean> => {
    if (!supabase) {
      showToast('Database is not configured. Set the Supabase environment variables to enable registration.');
      return false;
    }

    const { data: result, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          account_type: data.role,
          full_name: data.name,
          company_name: data.companyName,
          phone: data.phone
        }
      }
    });

    if (error || !result.user) {
      showToast(error?.message || 'Unable to create your account. Please try again.');
      return false;
    }

    if (result.session) {
      try {
        const profile = await fetchUserProfile(result.user.id, result.user.email || data.email);
        setCurrentUser(profile);
        setIsAuthenticated(profile.isActive);
        setCurrentView(profile.role === 'seller' ? 'seller_portal' : 'customer_dashboard');
      } catch (error) {
        console.error('Unable to load new account profile', error);
        showToast('Your account was created, but its profile could not be loaded. Contact the site administrator.');
        return false;
      }
    } else if (data.role === 'seller') {
      showToast('Seller account created. Disable email confirmation in Supabase Auth settings for immediate sign-in.');
    } else {
      showToast('Buyer account created. Confirm your email if prompted; an administrator must approve the account before workspace access.');
    }

    if (result.session && data.role === 'seller') {
      showToast('Seller account is active. You can submit offers and RFQs now.');
    } else if (result.session && data.role === 'buyer') {
      showToast('Buyer application submitted. Workspace access starts after admin approval.');
    }
    return true;
  };

  const confirmSellerOrder = async (
    offerId: string,
    dispatchDetails?: {
      courierName: string;
      trackingNumber: string;
      estimatedDeliveryDate: string;
      dispatchNotes?: string;
    }
  ): Promise<void> => {
    const offer = sellerOffers.find(o => o.id === offerId);
    const targetRfq = offer ? rfqs.find(r => r.id === offer.rfqId) : undefined;
    if (!offer || !targetRfq) return;
    if (!isAuthenticated || currentUser.role !== 'seller' || currentUser.sellerStatus !== 'approved' || offer.sellerId !== currentUser.id) {
      showToast('Only the approved seller on this offer can confirm fulfillment.');
      return;
    }

    const confirmedAt = new Date().toISOString();
    const confirmedOffer = { ...offer, status: 'confirmed' as const, confirmedAt };

    const updatedRfq = { ...targetRfq, status: 'Seller Confirmed' as const, updatedAt: confirmedAt };

    // Create Procurement Order with Dispatch tracking procedure
    const newPo: ProcurementOrder = {
      id: `PO-${Date.now()}`,
      rfqId: offer.rfqId,
      offerId: offer.id,
      customerId: targetRfq.customerId,
      customerName: targetRfq.customerName,
      customerCompany: targetRfq.companyName,
      sellerId: offer.sellerId,
      sellerName: offer.sellerName,
      sellerCompany: offer.sellerCompany,
      items: offer.items,
      totalAmount: offer.totalPrice,
      deliveryLocation: targetRfq.deliveryLocation,
      status: dispatchDetails ? 'Dispatched' : 'Confirmed',
      courierName: dispatchDetails?.courierName || '',
      trackingNumber: dispatchDetails?.trackingNumber || '',
      estimatedDeliveryDate: dispatchDetails?.estimatedDeliveryDate || '',
      dispatchNotes: dispatchDetails?.dispatchNotes || '',
      dispatchedAt: dispatchDetails ? new Date().toISOString() : '',
      createdAt: new Date().toISOString()
    };

    if (!await persistMarketplaceRecord('offer', confirmedOffer)) return;
    if (!await persistMarketplaceRecord('rfq', updatedRfq)) return;
    if (!await persistMarketplaceRecord('order', newPo)) return;

    setSellerOffers(prev => prev.map(o => (o.id === offerId ? confirmedOffer : o)));
    setRfqs(prev => prev.map(r => r.id === offer.rfqId ? updatedRfq : r));
    setProcurementOrders(prev => [newPo, ...prev]);
    showToast(`Order Confirmed & Dispatched! Tracking: ${newPo.trackingNumber} (${newPo.courierName})`);
  };

  // RBAC Permission Checking
  const hasPermission = (permission: PermissionKey): boolean => {
    if (currentUser.role !== 'admin') return false;
    if (currentUser.adminRole === 'super_admin') return true;

    switch (currentUser.adminRole) {
      case 'product_manager':
        return (
          permission === 'products.view' ||
          permission === 'products.add' ||
          permission === 'products.edit' ||
          permission === 'products.delete' ||
          permission === 'categories.manage'
        );
      case 'rfq_manager':
        return (
          permission === 'rfqs.view' ||
          permission === 'rfqs.manage_status' ||
          permission === 'rfqs.delete'
        );
      case 'seller_manager':
        return (
          permission === 'sellers.view' ||
          permission === 'sellers.approve' ||
          permission === 'sellers.suspend' ||
          permission === 'customers.manage'
        );
      case 'content_manager':
        return (
          permission === 'homepage.manage' ||
          permission === 'services.manage' ||
          permission === 'industries.manage' ||
          permission === 'documents.manage' ||
          permission === 'settings.manage'
        );
      default:
        return false;
    }
  };

  const persistMarketplaceRecord = async (type: 'rfq' | 'offer' | 'order', data: RFQ | SellerOffer | ProcurementOrder): Promise<boolean> => {
    if (!supabase || !isAuthenticated) return false;
    const { error } = await supabase.rpc('save_marketplace_record', {
      p_type: type,
      p_data: data
    });
    if (error) {
      console.error(`Unable to save marketplace ${type}`, error);
      showToast(`${type.toUpperCase()} could not be synced. Check account permissions and the latest Supabase schema.`);
      return false;
    }
    return true;
  };

  const saveSharedConfig = async (key: string, value: unknown, permission: PermissionKey) => {
    if (!siteConfigReady || !isAuthenticated || !supabase || !hasPermission(permission)) return;

    const serialized = JSON.stringify(value);
    if (sharedConfigSnapshot.current[key] === serialized || pendingConfigWrites.current[key] === serialized) return;
    pendingConfigWrites.current[key] = serialized;

    const { error } = await supabase.rpc('save_site_config', {
      p_key: key,
      p_value: value
    });
    if (error) {
      if (pendingConfigWrites.current[key] === serialized) delete pendingConfigWrites.current[key];
      console.error(`Unable to save shared ${key}`, error);
      showToast(`Could not save ${key.replaceAll('_', ' ')} globally. Check the Supabase schema and permissions.`);
      return;
    }
    sharedConfigSnapshot.current[key] = serialized;
    if (pendingConfigWrites.current[key] === serialized) delete pendingConfigWrites.current[key];
  };

  useEffect(() => { void saveSharedConfig('website_settings', websiteSettings, 'settings.manage'); }, [websiteSettings, siteConfigReady, isAuthenticated, currentUser.id]);
  useEffect(() => { void saveSharedConfig('categories', categories, 'categories.manage'); }, [categories, siteConfigReady, isAuthenticated, currentUser.id]);
  useEffect(() => { void saveSharedConfig('products', products, 'products.edit'); }, [products, siteConfigReady, isAuthenticated, currentUser.id]);
  useEffect(() => { void saveSharedConfig('services', services, 'services.manage'); }, [services, siteConfigReady, isAuthenticated, currentUser.id]);
  useEffect(() => { void saveSharedConfig('industries', industries, 'industries.manage'); }, [industries, siteConfigReady, isAuthenticated, currentUser.id]);
  useEffect(() => { void saveSharedConfig('vendor_documents', vendorDocuments, 'documents.manage'); }, [vendorDocuments, siteConfigReady, isAuthenticated, currentUser.id]);
  useEffect(() => { void saveSharedConfig('social_media', socialMedia, 'settings.manage'); }, [socialMedia, siteConfigReady, isAuthenticated, currentUser.id]);
  useEffect(() => { void saveSharedConfig('homepage_sections', homepageSections, 'homepage.manage'); }, [homepageSections, siteConfigReady, isAuthenticated, currentUser.id]);
  useEffect(() => { void saveSharedConfig('promotional_offer', promotionalOffer, 'homepage.manage'); }, [promotionalOffer, siteConfigReady, isAuthenticated, currentUser.id]);

  const loadAdminUsers = async (): Promise<void> => {
    if (!supabase || !hasPermission('admins.manage')) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Unable to load administrators', error);
      showToast('Could not load administrator accounts.');
      return;
    }

    setAdminUsers(((data || []) as unknown as ProfileRecord[]).map(profile => ({
      id: profile.id,
      name: profile.full_name,
      email: profile.email || '',
      phone: profile.phone,
      companyName: profile.company_name,
      role: profile.role,
      adminRole: profile.admin_role || undefined,
      buyerStatus: profile.buyer_status || undefined,
      sellerStatus: profile.seller_status || undefined,
      createdAt: profile.created_at,
      isActive: profile.is_active
    })));
  };

  const loadManagedAccounts = async (): Promise<void> => {
    if (!supabase || !hasPermission('customers.manage')) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['customer', 'seller'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Unable to load buyer and seller accounts', error);
      showToast('Could not load buyer and seller accounts.');
      return;
    }

    setManagedAccounts(((data || []) as unknown as ProfileRecord[]).map(profile => ({
      id: profile.id,
      name: profile.full_name,
      email: profile.email || '',
      phone: profile.phone,
      companyName: profile.company_name,
      role: profile.role,
      adminRole: profile.admin_role || undefined,
      buyerStatus: profile.buyer_status || undefined,
      sellerStatus: profile.seller_status || undefined,
      createdAt: profile.created_at,
      isActive: profile.is_active
    })));
  };

  const manageAccount = async (
    userId: string,
    action: 'approve_buyer' | 'reject_buyer' | 'deactivate' | 'reactivate_buyer'
  ): Promise<boolean> => {
    if (!supabase || !hasPermission('customers.manage')) {
      showToast('Seller manager or super administrator access is required.');
      return false;
    }

    const { error } = await supabase.rpc('admin_manage_account', {
      p_user_id: userId,
      p_action: action
    });
    if (error) {
      console.error('Unable to manage account', error);
      showToast(error.message);
      return false;
    }

    await loadManagedAccounts();
    showToast(action === 'approve_buyer' ? 'Buyer account approved.' : action === 'reject_buyer' ? 'Buyer application rejected.' : action === 'reactivate_buyer' ? 'Buyer account reactivated.' : 'Account deactivated.');
    return true;
  };

  const manageAdminRole = async (email: string, role: AdminRoleType | 'none'): Promise<boolean> => {
    if (!supabase || !hasPermission('admins.manage')) {
      showToast('Only a super administrator can manage sub-admin access.');
      return false;
    }

    const { error } = await supabase.rpc('manage_admin_role', {
      p_email: email,
      p_role: role
    });
    if (error) {
      console.error('Unable to update administrator role', error);
      showToast(error.message);
      return false;
    }

    await loadAdminUsers();
    showToast(role === 'none' ? 'Administrator access removed.' : 'Sub-admin access updated.');
    return true;
  };

  // Admin CRUD for Products
  const addProduct = (p: Omit<Product, 'id' | 'createdAt' | 'views' | 'salesCount'>) => {
    if (!hasPermission('products.add')) {
      showToast('Error: Unauthorized action. Requires product manager permissions.');
      return;
    }
    const newProd: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      views: 0,
      salesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [newProd, ...prev]);
    showToast(`Added product: "${newProd.name}"`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    if (!hasPermission('products.edit')) {
      showToast('Error: Unauthorized. Cannot edit products.');
      return;
    }
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Product updated successfully.');
  };

  const deleteProduct = (id: string) => {
    if (!hasPermission('products.delete')) {
      showToast('Error: Unauthorized. Cannot delete products.');
      return;
    }
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product deleted.');
  };

  // Categories CRUD
  const addCategory = (c: Omit<ProductCategory, 'id'>) => {
    if (!hasPermission('categories.manage')) {
      showToast('Error: Unauthorized. Cannot manage categories.');
      return;
    }
    const newCat: ProductCategory = {
      ...c,
      id: `cat-${Date.now()}`
    };
    setCategories(prev => [...prev, newCat]);
    showToast(`Added category: "${newCat.name}"`);
  };

  const updateCategory = (id: string, updates: Partial<ProductCategory>) => {
    if (!hasPermission('categories.manage')) {
      showToast('Error: Unauthorized. Cannot manage categories.');
      return;
    }
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Category updated.');
  };

  const deleteCategory = (id: string) => {
    if (!hasPermission('categories.manage')) {
      showToast('Error: Unauthorized.');
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category removed.');
  };

  // Seller management
  const updateSellerStatus = async (sellerId: string, status: 'approved' | 'rejected' | 'suspended' | 'pending') => {
    if (!hasPermission('sellers.approve') && !hasPermission('sellers.suspend')) {
      showToast('Error: Unauthorized to modify seller status.');
      return;
    }

    if (!supabase) {
      showToast('Database is not configured. Seller status cannot be updated.');
      return;
    }

    const { error } = await supabase.rpc('set_seller_status', {
      target_user_id: sellerId,
      new_status: status
    });
    if (error) {
      console.error('Unable to update seller status', error);
      showToast('Seller status could not be updated. Check database permissions.');
      return;
    }

    setSellers(prev => prev.map(s => (s.id === sellerId ? { ...s, status } : s)));
    showToast(`Seller status updated to: ${status.toUpperCase()}`);
  };

  const updateRfqStatus = (rfqId: string, status: RFQ['status']) => {
    if (!hasPermission('rfqs.manage_status')) {
      showToast('Error: Unauthorized to modify RFQ status.');
      return;
    }
    const rfq = rfqs.find(item => item.id === rfqId);
    if (!rfq) return;
    const updatedRfq = { ...rfq, status, updatedAt: new Date().toISOString() };
    setRfqs(prev => prev.map(r => (r.id === rfqId ? updatedRfq : r)));
    void persistMarketplaceRecord('rfq', updatedRfq);
    showToast(`RFQ ${rfqId} status changed to ${status}`);
  };

  // Vendor Documents CRUD & Real File Downloader
  const addVendorDocument = (doc: Omit<VendorDocument, 'id' | 'updatedAt'>) => {
    if (!hasPermission('documents.manage')) {
      showToast('Error: Unauthorized to manage vendor documents.');
      return;
    }
    const newDoc: VendorDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setVendorDocuments(prev => [newDoc, ...prev]);
    showToast(`Added document: ${newDoc.title}`);
  };

  const updateVendorDocument = (id: string, updates: Partial<VendorDocument>) => {
    if (!hasPermission('documents.manage')) {
      showToast('Error: Unauthorized.');
      return;
    }
    setVendorDocuments(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));
    showToast('Document updated.');
  };

  const deleteVendorDocument = (id: string) => {
    if (!hasPermission('documents.manage')) {
      showToast('Error: Unauthorized.');
      return;
    }
    setVendorDocuments(prev => prev.filter(d => d.id !== id));
    showToast('Document removed.');
  };

  // Real Document Downloader Generating Official File Blob
  const downloadDocument = (doc: VendorDocument) => {
    try {
      const fileContent = `================================================================================
                    ART INDUSTRIAL SOLUTIONS
                    Official Statutory & Enlistment Documentation
                    Website: https://artindustrialsolutions.com
                    Address: Plot 42, Block C, Tejgaon Industrial Area, Dhaka-1208
================================================================================

DOCUMENT TITLE: ${doc.title}
CATEGORY:       ${doc.category}
FILE FORMAT:    ${doc.fileType}
VERIFIED DATE:  ${doc.updatedAt}
STATUS:         Active Enlistment Credential

COMPANY STATUTORY IDENTIFIERS:
--------------------------------------------------------------------------------
Trade License No:     TRAD/DNCC/014829/2024 (Dhaka North City Corporation)
VAT / BIN Reg No:     002941837-0102 (Large Taxpayer Unit - NBR)
Taxpayer TIN:         7491-3829-1048
Import Reg (IRC):     RA-094183
Export Reg (ERC):     EX-104928
DCCI Chamber Member:  DCCI-M-84920
Principal Bankers:    Standard Chartered Bank & The City Bank Ltd

SCOPE & CAPABILITY OVERVIEW:
--------------------------------------------------------------------------------
${doc.description}

QUALITY & AUDIT ASSURANCE:
ART Industrial Solutions operates under ISO 9001:2015 certified quality procedures
for engineering spares supply, precision rotary machinery overhauls, laser shaft
alignment, and turn-key factory shutdown maintenance across Bangladesh.

This certified electronic document is generated directly from the corporate registry
of ART Industrial Solutions for vendor enlistment, corporate procurement pre-qualification,
and tender participation.

Verification Seal & Authorized Digital Signature:
Engr. M. A. Rahman, Managing Proprietor
ART Industrial Solutions
Contact: info@artindustrialsolutions.com | Tel: +880 2 988 7412
================================================================================`;

      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Downloaded: "${doc.title}"`);
    } catch (e) {
      console.error(e);
      showToast('Error downloading file.');
    }
  };

  const updateWebsiteSettings = (settings: Partial<WebsiteSettings>) => {
    if (!hasPermission('settings.manage')) {
      showToast('Error: Unauthorized to modify site settings.');
      return;
    }
    setWebsiteSettingsState(prev => ({ ...prev, ...settings }));
    showToast('Website settings updated.');
  };

  const addSocialMedia = (item: Omit<SocialMediaItem, 'id'>) => {
    if (!hasPermission('settings.manage')) {
      showToast('Error: Unauthorized.');
      return;
    }
    const newItem: SocialMediaItem = {
      ...item,
      id: `soc-${Date.now()}`
    };
    setSocialMedia(prev => [...prev, newItem]);
    showToast(`Added social link: ${newItem.platform}`);
  };

  const updateSocialMedia = (id: string, updates: Partial<SocialMediaItem>) => {
    if (!hasPermission('settings.manage')) {
      showToast('Error: Unauthorized.');
      return;
    }
    setSocialMedia(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Social link updated.');
  };

  const deleteSocialMedia = (id: string) => {
    if (!hasPermission('settings.manage')) {
      showToast('Error: Unauthorized.');
      return;
    }
    setSocialMedia(prev => prev.filter(s => s.id !== id));
    showToast('Social link deleted.');
  };

  const updateHomepageSection = (id: string, updates: Partial<HomepageSectionConfig>) => {
    if (!hasPermission('homepage.manage')) {
      showToast('Error: Unauthorized.');
      return;
    }
    setHomepageSections(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Homepage section updated.');
  };

  const addHomepageSection = (section: Omit<HomepageSectionConfig, 'id'>) => {
    if (!hasPermission('homepage.manage')) {
      showToast('Error: Unauthorized to add homepage sections.');
      return;
    }
    if (homepageSections.some(existing => existing.type === section.type)) {
      showToast('This homepage section already exists.');
      return;
    }

    setHomepageSections(prev => [...prev, {
      ...section,
      id: `sec-${crypto.randomUUID()}`,
      order: Math.max(0, ...prev.map(existing => existing.order)) + 1
    }]);
    showToast('Homepage section added.');
  };

  const deleteHomepageSection = (id: string) => {
    if (!hasPermission('homepage.manage')) {
      showToast('Error: Unauthorized to remove homepage sections.');
      return;
    }
    setHomepageSections(prev => prev.filter(section => section.id !== id));
    showToast('Homepage section removed.');
  };

  const reorderHomepageSection = (id: string, direction: 'up' | 'down') => {
    if (!hasPermission('homepage.manage')) {
      showToast('Error: Unauthorized to reorder homepage sections.');
      return;
    }
    setHomepageSections(prev => {
      const ordered = prev.map(section => ({ ...section })).sort((a, b) => a.order - b.order);
      const currentIndex = ordered.findIndex(section => section.id === id);
      const targetIndex = currentIndex + (direction === 'up' ? -1 : 1);
      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= ordered.length) return prev;
      [ordered[currentIndex].order, ordered[targetIndex].order] = [ordered[targetIndex].order, ordered[currentIndex].order];
      return ordered.sort((a, b) => a.order - b.order);
    });
  };

  const submitContactForm = (message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const newMsg: ContactMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'unread'
    };
    setContactMessages(prev => [newMsg, ...prev]);
    showToast('Thank you! Your message has been received. Our engineering desk will respond shortly.');
  };

  const updatePromotionalOffer = (offerUpdates: Partial<PromotionalOfferBanner>) => {
    setPromotionalOfferState(prev => {
      const updated = { ...prev, ...offerUpdates };
      return updated;
    });
    if (offerUpdates.isActive === false) {
      showToast('Promotional offer banner has been disabled / hidden.');
    } else {
      showToast('Promotional offer banner updated successfully.');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        selectedServiceId,
        selectedRfqId,
        selectedCategorySlug,
        searchQuery,
        setSearchQuery,

        currentUser,
        isAuthenticated,
        authLoading,
        authConfigured: supabaseConfigured,
        signIn,
        signOut,
        uploadSiteImage,
        hasPermission,
        siteConfigReady,
        adminUsers,
        loadAdminUsers,
        manageAdminRole,

        products,
        categories,
        categoriesWithCounts,
        cart,
        cartCount,
        cartSubtotal,
        rfqs,
        sellerOffers,
        procurementOrders,
        services,
        industries,
        vendorDocuments,
        socialMedia,
        homepageSections,
        websiteSettings,
        contactMessages,
        sellers,
        managedAccounts,
        loadManagedAccounts,
        manageAccount,
        promotionalOffer,
        updatePromotionalOffer,

        featuredProducts,
        bestSellingProducts,
        bestRatedProducts,
        specialOfferProducts,
        newProducts,

        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,

        cartToRfq,
        importCartIntoRfq,
        rfqDraftItems,
        addDraftRfqItem,
        removeDraftRfqItem,
        updateDraftRfqQuantity,
        updateDraftRfqNotes,
        submitRfq,

        submitSellerOffer,
        submitBuyerOffer,
        selectSellerOffer,
        rejectSellerOffer,
        submitCounterOffer,
        acceptCounterOffer,
        declineCounterOffer,
        registerUser,
        confirmSellerOrder,

        addProduct,
        updateProduct,
        deleteProduct,

        addCategory,
        updateCategory,
        deleteCategory,

        updateSellerStatus,
        updateRfqStatus,

        addVendorDocument,
        updateVendorDocument,
        deleteVendorDocument,
        downloadDocument,

        updateWebsiteSettings,
        addSocialMedia,
        updateSocialMedia,
        deleteSocialMedia,

        updateHomepageSection,
        addHomepageSection,
        deleteHomepageSection,
        reorderHomepageSection,
        submitContactForm,

        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export type UserRole = 'customer' | 'seller' | 'admin';

export type AdminRoleType = 
  | 'super_admin'
  | 'product_manager'
  | 'rfq_manager'
  | 'seller_manager'
  | 'content_manager';

export type PermissionKey =
  | 'products.view'
  | 'products.add'
  | 'products.edit'
  | 'products.delete'
  | 'categories.manage'
  | 'rfqs.view'
  | 'rfqs.manage_status'
  | 'rfqs.delete'
  | 'sellers.view'
  | 'sellers.approve'
  | 'sellers.suspend'
  | 'customers.manage'
  | 'services.manage'
  | 'industries.manage'
  | 'documents.manage'
  | 'settings.manage'
  | 'homepage.manage'
  | 'admins.manage';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  role: UserRole;
  adminRole?: AdminRoleType;
  buyerStatus?: 'pending' | 'approved' | 'rejected';
  sellerStatus?: 'pending' | 'approved' | 'rejected' | 'suspended';
  sellerProfileId?: string;
  customerProfileId?: string;
  createdAt: string;
  isActive: boolean;
}

export interface SellerProfile {
  id: string;
  userId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  tradeLicenseNumber: string;
  tinNumber: string;
  binNumber: string;
  businessType: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  rating: number;
  totalDeals: number;
  joinedDate: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  factoryAddress: string;
  officeAddress: string;
  industryType: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName?: string;
  order: number;
  isActive: boolean;
  showOnHomepage: boolean;
  // Computed dynamically from products table
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  categoryId: string;
  categoryName?: string;
  price: number;
  salePrice?: number;
  discountPercent?: number;
  isPriceOnRequest: boolean;
  unit: string; // e.g. "pcs", "box", "meter", "set", "kg"
  stock: number;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  fullDescription: string;
  specifications: Record<string, string>;
  images: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isSpecialOffer: boolean;
  isNew: boolean;
  views: number;
  salesCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export type RFQStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Offers Received'
  | 'Seller Selected'
  | 'Seller Confirmed'
  | 'Processing'
  | 'Completed'
  | 'Cancelled';

export interface RFQItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  image?: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface RFQ {
  id: string; // e.g. "RFQ-2026-000125"
  customerId: string;
  createdByRole?: 'customer' | 'seller';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName: string;
  deliveryLocation: string;
  requiredDate: string;
  overallNotes?: string;
  status: RFQStatus;
  items: RFQItem[];
  selectedSellerOfferId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerOfferItem {
  productId: string;
  productName: string;
  offeredQuantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SellerOffer {
  id: string;
  rfqId: string;
  sellerId: string;
  bidderRole?: 'customer' | 'seller';
  sellerName: string;
  sellerCompany: string;
  sellerRating: number;
  items: SellerOfferItem[];
  totalPrice: number;
  deliveryTime: string; // e.g. "3-5 Business Days"
  availability: string; // e.g. "Ex-Stock Dhaka"
  warranty: string; // e.g. "12 Months OEM Warranty"
  offerValidity: string; // e.g. "15 Days"
  additionalNotes: string;
  status: 'pending' | 'selected' | 'rejected' | 'confirmed' | 'counter_offered';
  counterPrice?: number;
  counterNotes?: string;
  counterAt?: string;
  submittedAt: string;
  confirmedAt?: string;
}

export interface ProcurementOrder {
  id: string; // e.g. "PO-2026-00084"
  rfqId: string;
  offerId: string;
  customerId: string;
  customerName: string;
  customerCompany: string;
  sellerId: string;
  sellerName: string;
  sellerCompany: string;
  items: SellerOfferItem[];
  totalAmount: number;
  deliveryLocation: string;
  status: 'Confirmed' | 'Dispatched' | 'Delivered' | 'Paid';
  courierName?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  dispatchNotes?: string;
  dispatchedAt?: string;
  createdAt: string;
}

export interface EngineeringService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  order: number;
  isActive: boolean;
  features: string[];
}

export interface IndustryServed {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

export interface VendorDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  fileSize: string;
  fileType: string;
  fileUrl: string;
  updatedAt: string;
  isActive: boolean;
}

export interface SocialMediaItem {
  id: string;
  platform: string;
  url: string;
  iconName: string;
  order: number;
  isActive: boolean;
}

export interface HomepageSectionConfig {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  categorySlug?: string;
  order: number;
  isEnabled: boolean;
  itemCount: number;
  imageUrl?: string;
  ctaText?: string;
  targetView?: 'shop' | 'rfq_builder' | 'contact' | 'services' | 'industries' | 'vendor_enlistment';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}

export interface WebsiteSettings {
  siteName: string;
  domain: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  phone: string;
  mobile: string;
  email: string;
  whatsapp: string;
  address: string;
  officeHours: string;
  tradeLicenseNo: string;
  binNo: string;
  tinNo: string;
  ircNo: string;
  ercNo: string;
  dcciMemberNo: string;
  bankSolvency: string;
  aboutSnippet: string;
}

export interface PromotionalOfferBanner {
  isActive: boolean;
  badge: string;
  title: string;
  description: string;
  discountHighlight: string;
  discountCode?: string;
  ctaText: string;
  targetView: 'rfq_builder' | 'shop';
  expiresAt?: string;
}

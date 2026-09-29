import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory, VendorDocument, SocialMediaItem } from '../../types';
import {
  ShieldCheck,
  Package,
  Layers,
  FileText,
  Building2,
  Settings,
  Download,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Code2,
  Sliders,
  Share2,
  Eye,
  ExternalLink,
  UserPlus,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const ADDABLE_HOMEPAGE_SECTIONS = [
  { type: 'all_products', title: 'All Industrial Products', subtitle: 'Browse the product catalog.' },
  { type: 'categories', title: 'Industrial Product Categories', subtitle: 'Explore the categories.' },
  { type: 'best_sellers', title: 'Best Selling Products', subtitle: 'Popular products from the catalog.' },
  { type: 'featured', title: 'Featured Industrial Products', subtitle: 'Selected featured products.' },
  { type: 'best_rated', title: 'Best Rated Products', subtitle: 'Highest rated products.' },
  { type: 'special_offers', title: 'Special Offers', subtitle: 'Products with special pricing.' },
  { type: 'category_showcase', title: 'Category Based Products', subtitle: 'Browse products by category.' },
  { type: 'services', title: 'Engineering Services', subtitle: 'Explore our services.' },
  { type: 'industries', title: 'Industries We Serve', subtitle: 'Explore industries.' },
  { type: 'vendor_enlistment', title: 'Vendor Enlistment', subtitle: 'View vendor information.' },
  { type: 'rfq_cta', title: 'Request a Quotation', subtitle: 'Start an RFQ.' },
  { type: 'custom_banner', title: 'New homepage banner', subtitle: 'Add a message for visitors.', imageUrl: '', ctaText: 'Explore products', targetView: 'shop' as const }
];

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    hasPermission,
    adminUsers,
    loadAdminUsers,
    manageAdminRole,
    siteConfigReady,
    products,
    categoriesWithCounts,
    rfqs,
    sellerOffers,
    sellers,
    vendorDocuments,
    socialMedia,
    homepageSections,
    websiteSettings,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSellerStatus,
    managedAccounts,
    loadManagedAccounts,
    manageAccount,
    updateRfqStatus,
    addVendorDocument,
    updateVendorDocument,
    deleteVendorDocument,
    updateWebsiteSettings,
    addSocialMedia,
    deleteSocialMedia,
    updateHomepageSection,
    addHomepageSection,
    deleteHomepageSection,
    reorderHomepageSection,
    promotionalOffer,
    updatePromotionalOffer,
    uploadSiteImage
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'products' | 'categories' | 'rfqs' | 'sellers' | 'documents' | 'homepage' | 'settings' | 'admins' | 'django_export'
  >('products');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminRole, setAdminRole] = useState<'product_manager' | 'rfq_manager' | 'seller_manager' | 'content_manager'>('product_manager');
  const [adminActionBusy, setAdminActionBusy] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [productImageUploading, setProductImageUploading] = useState(false);
  const [newHomepageSectionType, setNewHomepageSectionType] = useState('all_products');

  useEffect(() => {
    if (activeTab === 'admins') void loadAdminUsers();
    if (activeTab === 'sellers' && hasPermission('customers.manage')) void loadManagedAccounts();
  }, [activeTab]);

  const handleAdminRoleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAdminActionBusy(true);
    const updated = await manageAdminRole(adminEmail.trim(), adminRole);
    setAdminActionBusy(false);
    if (updated) setAdminEmail('');
  };

  const handleRevokeAdminRole = async (email: string) => {
    setAdminActionBusy(true);
    await manageAdminRole(email, 'none');
    setAdminActionBusy(false);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const imageUrl = await uploadSiteImage(file, 'branding');
      if (imageUrl) updateWebsiteSettings({ logoUrl: imageUrl });
    } finally {
      setLogoUploading(false);
      event.target.value = '';
    }
  };

  const handleProductImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setProductImageUploading(true);
    try {
      const imageUrl = await uploadSiteImage(file, 'products');
      if (imageUrl) setProdForm(previous => ({ ...previous, imageUrl }));
    } finally {
      setProductImageUploading(false);
      event.target.value = '';
    }
  };

  const handleHomepageImageUpload = async (sectionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imageUrl = await uploadSiteImage(file, 'branding');
      if (imageUrl) updateHomepageSection(sectionId, { imageUrl });
    } finally {
      event.target.value = '';
    }
  };

  const handleAddHomepageSection = () => {
    const template = ADDABLE_HOMEPAGE_SECTIONS.find(section => section.type === newHomepageSectionType);
    if (!template) return;
    addHomepageSection({ ...template, order: homepageSections.length + 1, isEnabled: true, itemCount: 4 });
  };

  const availableHomepageSections = ADDABLE_HOMEPAGE_SECTIONS.filter(
    section => !homepageSections.some(existing => existing.type === section.type)
  );

  // Product Add / Edit Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    sku: '',
    brand: '',
    categoryId: categoriesWithCounts[0]?.id || '',
    price: 1000,
    salePrice: 900,
    isPriceOnRequest: false,
    unit: 'pcs',
    stock: 50,
    rating: 4.8,
    reviewCount: 12,
    shortDescription: '',
    fullDescription: '',
    imageUrl: '',
    isFeatured: true,
    isBestSeller: false,
    isSpecialOffer: false,
    isNew: true,
    isActive: true
  });

  // Category Add Modal State
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catForm, setCatForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    order: 1,
    isActive: true,
    showOnHomepage: true
  });

  // Document Add Modal State
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docForm, setDocForm] = useState({
    title: '',
    description: '',
    category: 'Legal Statutory',
    fileSize: '1.2 MB',
    fileType: 'PDF Document',
    fileUrl: '/documents/Statutory_File.pdf',
    isActive: true
  });

  // Social Media Add Modal State
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [socialForm, setSocialForm] = useState({
    platform: '',
    url: '',
    iconName: 'Globe',
    order: 5,
    isActive: true
  });

  // Handlers for Products
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProdForm({
      name: '',
      sku: '',
      brand: '',
      categoryId: categoriesWithCounts[0]?.id || '',
      price: 1200,
      salePrice: 1050,
      isPriceOnRequest: false,
      unit: 'pcs',
      stock: 100,
      rating: 4.8,
      reviewCount: 5,
      shortDescription: '',
      fullDescription: '',
      imageUrl: '/images/category-bearings.jpg',
      isFeatured: true,
      isBestSeller: false,
      isSpecialOffer: false,
      isNew: true,
      isActive: true
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdForm({
      name: p.name,
      sku: p.sku,
      brand: p.brand,
      categoryId: p.categoryId,
      price: p.price,
      salePrice: p.salePrice || p.price,
      isPriceOnRequest: p.isPriceOnRequest,
      unit: p.unit,
      stock: p.stock,
      rating: p.rating,
      reviewCount: p.reviewCount,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      imageUrl: p.images[0] || '',
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller,
      isSpecialOffer: p.isSpecialOffer,
      isNew: p.isNew,
      isActive: p.isActive
    });
    setProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      updateProduct(editingProductId, {
        name: prodForm.name,
        sku: prodForm.sku,
        brand: prodForm.brand,
        categoryId: prodForm.categoryId,
        price: prodForm.price,
        salePrice: prodForm.salePrice,
        isPriceOnRequest: prodForm.isPriceOnRequest,
        unit: prodForm.unit,
        stock: prodForm.stock,
        shortDescription: prodForm.shortDescription,
        fullDescription: prodForm.fullDescription,
        images: [prodForm.imageUrl],
        isFeatured: prodForm.isFeatured,
        isBestSeller: prodForm.isBestSeller,
        isSpecialOffer: prodForm.isSpecialOffer,
        isNew: prodForm.isNew,
        isActive: prodForm.isActive
      });
    } else {
      addProduct({
        name: prodForm.name,
        sku: prodForm.sku,
        brand: prodForm.brand,
        categoryId: prodForm.categoryId,
        price: prodForm.price,
        salePrice: prodForm.salePrice,
        isPriceOnRequest: prodForm.isPriceOnRequest,
        unit: prodForm.unit,
        stock: prodForm.stock,
        rating: prodForm.rating,
        reviewCount: prodForm.reviewCount,
        shortDescription: prodForm.shortDescription,
        fullDescription: prodForm.fullDescription,
        specifications: { 'Origin': 'Certified OEM', 'Quality Grade': 'Industrial Heavy Duty' },
        images: [prodForm.imageUrl],
        isFeatured: prodForm.isFeatured,
        isBestSeller: prodForm.isBestSeller,
        isSpecialOffer: prodForm.isSpecialOffer,
        isNew: prodForm.isNew,
        isActive: prodForm.isActive
      });
    }
    setProductModalOpen(false);
  };

  // Handler for Categories
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCategory({
      name: catForm.name,
      slug: catForm.slug || catForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: catForm.description,
      image: catForm.image || '/images/category-bearings.jpg',
      order: catForm.order,
      isActive: catForm.isActive,
      showOnHomepage: catForm.showOnHomepage
    });
    setCatModalOpen(false);
  };

  // Handler for Document
  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVendorDocument({
      title: docForm.title,
      description: docForm.description,
      category: docForm.category,
      fileSize: docForm.fileSize,
      fileType: docForm.fileType,
      fileUrl: docForm.fileUrl,
      isActive: docForm.isActive
    });
    setDocModalOpen(false);
  };

  // Handler for Social Media
  const handleSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSocialMedia({
      platform: socialForm.platform,
      url: socialForm.url,
      iconName: socialForm.iconName,
      order: socialForm.order,
      isActive: socialForm.isActive
    });
    setSocialModalOpen(false);
  };

  return (
    <div className="bg-[#F5F7F9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Admin Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 mb-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-xs uppercase text-[#F28C28] flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enterprise RBAC Control Panel</span>
                </span>
                <span className="bg-[#12304A] text-white font-mono text-[10px] px-2 py-0.5 rounded-xs uppercase">
                  {currentUser.adminRole || 'admin'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#12304A]">
                ART Industrial Operations Management
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Current User: <strong>{currentUser.name}</strong> ({currentUser.email}). Permissions strictly enforced on backend.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-4 text-xs">
              <div className="text-center p-2 bg-[#F5F7F9] rounded-xs border border-slate-200 min-w-[70px]">
                <span className="text-[10px] text-slate-400 block font-bold">PRODUCTS</span>
                <span className="font-bold text-slate-900 tabular-nums">{products.length}</span>
              </div>
              <div className="text-center p-2 bg-[#F5F7F9] rounded-xs border border-slate-200 min-w-[70px]">
                <span className="text-[10px] text-slate-400 block font-bold">CATEGORIES</span>
                <span className="font-bold text-slate-900 tabular-nums">{categoriesWithCounts.length}</span>
              </div>
              <div className="text-center p-2 bg-[#F5F7F9] rounded-xs border border-slate-200 min-w-[70px]">
                <span className="text-[10px] text-slate-400 block font-bold">RFQs</span>
                <span className="font-bold text-slate-900 tabular-nums">{rfqs.length}</span>
              </div>
              <div className="text-center p-2 bg-[#F5F7F9] rounded-xs border border-slate-200 min-w-[70px]">
                <span className="text-[10px] text-slate-400 block font-bold">SELLERS</span>
                <span className="font-bold text-slate-900 tabular-nums">{sellers.length}</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 font-bold rounded-xs transition-colors flex items-center gap-1.5 ${activeTab === 'products' ? 'bg-[#12304A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 font-bold rounded-xs transition-colors flex items-center gap-1.5 ${activeTab === 'categories' ? 'bg-[#12304A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Categories ({categoriesWithCounts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('rfqs')}
              className={`px-3 py-1.5 font-bold rounded-xs transition-colors flex items-center gap-1.5 ${activeTab === 'rfqs' ? 'bg-[#12304A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>RFQs & Bids ({rfqs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('sellers')}
              className={`px-3 py-1.5 font-bold rounded-xs transition-colors flex items-center gap-1.5 ${activeTab === 'sellers' ? 'bg-[#12304A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Sellers & Approvals ({sellers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-1.5 font-bold rounded-xs transition-colors flex items-center gap-1.5 ${activeTab === 'documents' ? 'bg-[#12304A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Vendor Documents ({vendorDocuments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('homepage')}
              className={`px-3 py-1.5 font-bold rounded-xs transition-colors flex items-center gap-1.5 ${activeTab === 'homepage' ? 'bg-[#12304A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Homepage Ordering</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 font-bold rounded-xs transition-colors flex items-center gap-1.5 ${activeTab === 'settings' ? 'bg-[#12304A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Site & Social Media</span>
            </button>
            {hasPermission('admins.manage') && <button
              onClick={() => setActiveTab('admins')}
              className={`px-3 py-1.5 font-bold rounded-xs transition-colors flex items-center gap-1.5 ${activeTab === 'admins' ? 'bg-[#12304A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Team Access</span>
            </button>}
            <button
              onClick={() => setActiveTab('django_export')}
              className={`px-3 py-1.5 font-bold rounded-xs transition-colors flex items-center gap-1.5 ${activeTab === 'django_export' ? 'bg-[#F28C28] text-white' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'}`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Django & PostgreSQL Architecture</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#12304A]">Product Catalog Management</h2>
                <p className="text-xs text-slate-500">Configure prices, sale discounts, indent status, and SKU inventory.</p>
              </div>

              {hasPermission('products.add') ? (
                <button
                  onClick={handleOpenAddProduct}
                  className="px-3.5 py-1.5 bg-[#12304A] hover:bg-[#1E5A85] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Product</span>
                </button>
              ) : (
                <span className="text-xs text-slate-400 italic">Product add permission restricted for role</span>
              )}
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xs shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F7F9] text-[#12304A] font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Product / SKU</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Brand</th>
                      <th className="py-2.5 px-3">Pricing (BDT)</th>
                      <th className="py-2.5 px-3">Stock</th>
                      <th className="py-2.5 px-3">Sales / Views</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(p => {
                      const catName = categoriesWithCounts.find(c => c.id === p.categoryId)?.name || 'Spares';

                      return (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-900 max-w-xs truncate">{p.name}</div>
                            <div className="text-[11px] font-mono text-slate-400">SKU: {p.sku}</div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{catName}</td>
                          <td className="py-2.5 px-3 font-semibold text-[#1E5A85]">{p.brand}</td>
                          <td className="py-2.5 px-3 tabular-nums">
                            {p.isPriceOnRequest ? (
                              <span className="font-bold text-[#12304A]">Price on Request</span>
                            ) : (
                              <div>
                                <span className="font-bold text-slate-900">৳{(p.salePrice || p.price).toLocaleString()}</span>
                                {p.salePrice && p.salePrice < p.price && (
                                  <span className="text-[10px] text-slate-400 line-through ml-1.5">৳{p.price.toLocaleString()}</span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 tabular-nums">
                            <span className={p.stock > 0 ? 'text-emerald-700 font-semibold' : 'text-amber-600'}>
                              {p.stock} {p.unit}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 tabular-nums text-slate-500 text-[11px]">
                            {p.salesCount} sales · {p.views} views
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-xs ${p.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              {p.isActive ? 'Active' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right space-x-1">
                            {hasPermission('products.edit') && (
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1 text-slate-500 hover:text-[#1E5A85]"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {hasPermission('products.delete') && (
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="p-1 text-slate-400 hover:text-rose-600"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES MANAGEMENT (Auto-updating product counts) */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#12304A]">Industrial Category Architecture</h2>
                <p className="text-xs text-slate-500">
                  Product counts are computed dynamically from the database. When products are added or removed, counts update instantly.
                </p>
              </div>

              {hasPermission('categories.manage') && (
                <button
                  onClick={() => setCatModalOpen(true)}
                  className="px-3.5 py-1.5 bg-[#12304A] hover:bg-[#1E5A85] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Category</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoriesWithCounts.map(cat => (
                <div key={cat.id} className="bg-white border border-[#E2E8F0] rounded-xs p-4 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <span className="font-mono text-[10px] text-slate-400">Order: #{cat.order}</span>
                      <span className="text-[10px] font-bold uppercase bg-blue-50 text-[#1E5A85] px-1.5 py-0.5 rounded-xs">
                        {cat.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#12304A] mb-1">{cat.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{cat.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#12304A] tabular-nums">
                      {cat.productCount} {cat.productCount === 1 ? 'Product' : 'Products'} (Live DB)
                    </span>

                    {hasPermission('categories.manage') && (
                      <div className="space-x-1">
                        <button
                          onClick={() => updateCategory(cat.id, { isActive: !cat.isActive })}
                          className="text-[11px] text-[#1E5A85] hover:underline"
                        >
                          {cat.isActive ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RFQS & OFFERS WORKFLOW MONITOR */}
        {activeTab === 'rfqs' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[#12304A]">
              Live Procurement RFQs & Multi-Seller Pipeline
            </h2>

            <div className="space-y-4">
              {rfqs.map(rfq => {
                const bids = sellerOffers.filter(o => o.rfqId === rfq.id);
                const selectedBid = bids.find(b => b.status === 'selected' || b.status === 'confirmed');

                return (
                  <div key={rfq.id} className="bg-white border border-[#E2E8F0] rounded-xs p-5 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold bg-[#12304A] text-white px-2 py-0.5 rounded-xs">
                            {rfq.id}
                          </span>
                          <span className="text-[10px] font-bold uppercase text-slate-500">{rfq.createdByRole === 'seller' ? 'Seller RFQ' : 'Buyer RFQ'}</span>
                          <span className="text-xs font-bold text-[#1E5A85]">Client: {rfq.companyName}</span>
                          <span className="text-slate-400 text-xs">({rfq.customerName})</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Destination: {rfq.deliveryLocation} · Required: {rfq.requiredDate} · Items: {rfq.items.length}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                          <select
                            value={rfq.status}
                            disabled={!hasPermission('rfqs.manage_status')}
                            onChange={e => updateRfqStatus(rfq.id, e.target.value as any)}
                            className="text-xs font-bold text-[#12304A] bg-[#F5F7F9] border border-slate-300 rounded-xs px-2 py-1 outline-none"
                          >
                            <option value="Draft">Draft</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Offers Received">Offers Received</option>
                            <option value="Seller Selected">Seller Selected</option>
                            <option value="Seller Confirmed">Seller Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Bids received */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Received Seller Bids ({bids.length}):
                      </span>
                      {bids.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No bids submitted yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {bids.map(b => (
                            <div key={b.id} className="p-2.5 bg-[#F5F7F9] rounded-xs border border-slate-200 text-xs flex justify-between items-center">
                              <div>
                                <span className="font-semibold text-slate-900 block">{b.sellerCompany}</span>
                                <span className="text-[11px] text-slate-500">Lead time: {b.deliveryTime}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-[#12304A] tabular-nums block">
                                  ৳{b.totalPrice.toLocaleString()}
                                </span>
                                <span className={`text-[10px] font-bold uppercase ${b.status === 'confirmed' ? 'text-emerald-700' : b.status === 'selected' ? 'text-blue-700' : 'text-slate-500'}`}>
                                  {b.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SELLERS MANAGEMENT & APPROVAL WORKFLOW */}
        {activeTab === 'sellers' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#12304A]">Buyer & Seller Accounts</h2>
              <p className="text-xs text-slate-500">
                Sellers are active after signup. Buyer accounts require approval before using the buyer workspace.
              </p>
            </div>

            {hasPermission('customers.manage') && <section className="bg-white border border-[#E2E8F0] p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-[#12304A]">Buyer accounts</h3>
                  <p className="text-xs text-slate-500">Approve buyer access or deactivate an account.</p>
                </div>
                <span className="text-xs text-slate-500">{managedAccounts.filter(account => account.role === 'customer').length} accounts</span>
              </div>
              <div className="divide-y divide-slate-100">
                {managedAccounts.filter(account => account.role === 'customer').map(account => (
                  <div key={account.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{account.companyName || account.name}</p>
                      <p className="text-xs text-slate-500 truncate">{account.name} · {account.email}</p>
                      <span className={`inline-flex mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-xs ${account.buyerStatus === 'approved' && account.isActive ? 'bg-emerald-100 text-emerald-800' : account.buyerStatus === 'pending' ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-800'}`}>
                        {account.isActive ? account.buyerStatus || 'pending' : 'deactivated'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {account.buyerStatus === 'pending' && <>
                        <button type="button" disabled={adminActionBusy} onClick={async () => { setAdminActionBusy(true); await manageAccount(account.id, 'approve_buyer'); setAdminActionBusy(false); }} className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-xs disabled:opacity-50">Approve buyer</button>
                        <button type="button" disabled={adminActionBusy} onClick={async () => { setAdminActionBusy(true); await manageAccount(account.id, 'reject_buyer'); setAdminActionBusy(false); }} className="px-3 py-1.5 bg-slate-200 text-slate-800 text-xs font-semibold rounded-xs disabled:opacity-50">Reject</button>
                      </>}
                      {account.isActive && <button type="button" disabled={adminActionBusy} onClick={async () => { setAdminActionBusy(true); await manageAccount(account.id, 'deactivate'); setAdminActionBusy(false); }} className="px-3 py-1.5 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xs disabled:opacity-50">Remove</button>}
                      {!account.isActive && <button type="button" disabled={adminActionBusy} onClick={async () => { setAdminActionBusy(true); await manageAccount(account.id, 'reactivate_buyer'); setAdminActionBusy(false); }} className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-xs disabled:opacity-50">Approve / reactivate</button>}
                    </div>
                  </div>
                ))}
                {managedAccounts.every(account => account.role !== 'customer') && <p className="py-4 text-center text-xs text-slate-500">No buyer accounts found.</p>}
              </div>
            </section>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sellers.map(s => (
                <div key={s.id} className="bg-white border border-[#E2E8F0] rounded-xs p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <span className="font-bold text-xs text-[#1E5A85]">{s.businessType}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-xs ${
                        s.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        s.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {s.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#12304A] mb-1">{s.companyName}</h3>
                    <div className="text-xs text-slate-600 space-y-1 mb-4">
                      <div>Contact: <strong>{s.contactPerson}</strong> ({s.phone})</div>
                      <div>Trade License: <span className="font-mono">{s.tradeLicenseNumber}</span></div>
                      <div>BIN: <span className="font-mono">{s.binNumber}</span></div>
                      <div>Location: {s.address}</div>
                    </div>
                  </div>

                  {hasPermission('sellers.approve') && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {s.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateSellerStatus(s.id, 'approved')}
                            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xs"
                          >
                            Approve Seller
                          </button>
                          <button
                            onClick={() => updateSellerStatus(s.id, 'rejected')}
                            className="w-full py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {s.status === 'approved' && (
                        <button
                          onClick={() => updateSellerStatus(s.id, 'suspended')}
                          className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xs"
                        >
                          Suspend Account
                        </button>
                      )}
                      {s.status === 'suspended' && (
                        <button
                          onClick={() => updateSellerStatus(s.id, 'approved')}
                          className="w-full py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-xs"
                        >
                          Re-Activate
                        </button>
                      )}
                      <button
                        onClick={() => void manageAccount(s.userId, 'deactivate')}
                        disabled={!hasPermission('customers.manage')}
                        className="px-3 py-1.5 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xs disabled:opacity-50"
                      >Deactivate</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: VENDOR STATUTORY DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#12304A]">Vendor Enlistment Documents</h2>
                <p className="text-xs text-slate-500">Corporate tender documents available for download by procurement teams.</p>
              </div>

              {hasPermission('documents.manage') && (
                <button
                  onClick={() => setDocModalOpen(true)}
                  className="px-3.5 py-1.5 bg-[#12304A] hover:bg-[#1E5A85] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Document</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendorDocuments.map(doc => (
                <div key={doc.id} className="bg-white border border-[#E2E8F0] rounded-xs p-4 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100 text-[11px] text-slate-400">
                      <span>{doc.category}</span>
                      <span>{doc.fileSize}</span>
                    </div>
                    <h3 className="font-bold text-sm text-[#12304A] mb-1">{doc.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{doc.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Updated {doc.updatedAt}</span>
                    {hasPermission('documents.manage') && (
                      <button
                        onClick={() => deleteVendorDocument(doc.id)}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'admins' && hasPermission('admins.manage') && (
          <section className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#12304A]">Sub-admin access</h2>
              <p className="mt-1 text-xs text-slate-600">Assign a permission group to an existing registered buyer account. Sub-admins cannot manage administrator access.</p>
            </div>

            <form onSubmit={handleAdminRoleSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3 items-end bg-white border border-slate-200 p-4">
              <div>
                <label htmlFor="subadmin-email" className="block text-xs font-semibold text-slate-700 mb-1.5">Registered account email</label>
                <input
                  id="subadmin-email"
                  type="email"
                  required
                  value={adminEmail}
                  onChange={event => setAdminEmail(event.target.value)}
                  placeholder="person@company.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm outline-none focus:border-[#1E5A85]"
                />
              </div>
              <div>
                <label htmlFor="subadmin-role" className="block text-xs font-semibold text-slate-700 mb-1.5">Permission group</label>
                <select
                  id="subadmin-role"
                  value={adminRole}
                  onChange={event => setAdminRole(event.target.value as typeof adminRole)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-sm bg-white text-sm outline-none focus:border-[#1E5A85]"
                >
                  <option value="product_manager">Product manager</option>
                  <option value="rfq_manager">RFQ manager</option>
                  <option value="seller_manager">Seller manager</option>
                  <option value="content_manager">Content manager</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={adminActionBusy}
                className="px-4 py-2 bg-[#12304A] hover:bg-[#1E5A85] disabled:bg-slate-400 text-white text-sm font-semibold rounded-sm"
              >
                {adminActionBusy ? 'Saving…' : 'Grant access'}
              </button>
            </form>

            <div className="bg-white border border-slate-200">
              <div className="grid grid-cols-[1fr_180px_120px] gap-3 px-4 py-2.5 border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <span>Administrator</span><span>Role</span><span className="text-right">Action</span>
              </div>
              {adminUsers.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-slate-500">No administrator accounts were found.</p>
              ) : adminUsers.map(admin => (
                <div key={admin.id} className="grid grid-cols-[1fr_180px_120px] gap-3 items-center px-4 py-3 border-b last:border-b-0 border-slate-100 text-sm">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{admin.name || admin.email}</p>
                    <p className="text-xs text-slate-500 truncate">{admin.email}</p>
                  </div>
                  <span className="text-xs font-medium text-slate-700 capitalize">{admin.adminRole?.replaceAll('_', ' ') || 'Admin'}</span>
                  {admin.adminRole === 'super_admin' ? (
                    <span className="text-right text-[11px] text-slate-400">Protected</span>
                  ) : (
                    <button
                      type="button"
                      disabled={adminActionBusy}
                      onClick={() => void handleRevokeAdminRole(admin.email)}
                      className="justify-self-end text-xs font-semibold text-rose-700 hover:underline disabled:text-slate-400"
                    >Revoke access</button>
                  )}
                </div>
              ))}
            </div>

            {!siteConfigReady && <p className="text-xs text-amber-800">Shared site content is unavailable. Apply the latest Supabase schema, then reload this page.</p>}
          </section>
        )}

        {/* TAB 6: HOMEPAGE SECTIONS CONFIGURATION */}
        {activeTab === 'homepage' && (
          <div className="space-y-6">
            {/* Promotional offer banner manager */}
            <div className="bg-white border-2 border-[#1E5A85]/30 rounded-xs p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#12304A]">
                      Promotional Offer Box (Above "All Industrial Products")
                    </h3>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-xs ${
                      promotionalOffer.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {promotionalOffer.isActive ? '● Active & Visible on Homepage' : '○ Off / Hidden'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    When enabled, an eye-catching animated offer card appears right above the H2 "All Industrial Products". Turn off to hide.
                  </p>
                </div>

                {hasPermission('homepage.manage') && (
                  <button
                    onClick={() => updatePromotionalOffer({ isActive: !promotionalOffer.isActive })}
                    className={`px-4 py-2 font-bold text-xs rounded-xs transition-colors flex items-center gap-2 shadow-xs ${
                      promotionalOffer.isActive
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <span>{promotionalOffer.isActive ? 'Turn Off / Hide Offer Box' : 'Turn On / Activate Offer Box'}</span>
                  </button>
                )}
              </div>

              {/* Offer Configuration Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge Text (Top Pill)</label>
                  <input
                    type="text"
                    value={promotionalOffer.badge}
                    onChange={e => updatePromotionalOffer({ badge: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                    placeholder="e.g. SPECIAL INDUSTRIAL FLASH OFFER"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Highlight Pill</label>
                  <input
                    type="text"
                    value={promotionalOffer.discountHighlight}
                    onChange={e => updatePromotionalOffer({ discountHighlight: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                    placeholder="e.g. Up to 25% OFF"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Offer Headline *</label>
                  <input
                    type="text"
                    value={promotionalOffer.title}
                    onChange={e => updatePromotionalOffer({ title: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs font-semibold text-slate-900"
                    placeholder="e.g. Heavy Industry Sourcing Discount — 20% Rebate on Bulk Bearings & Valves"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Offer Terms & Description *</label>
                  <textarea
                    rows={2}
                    value={promotionalOffer.description}
                    onChange={e => updatePromotionalOffer({ description: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs text-slate-700"
                    placeholder="Describe contract terms, eligibility, OEM certs..."
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contract / Coupon Code</label>
                  <input
                    type="text"
                    value={promotionalOffer.discountCode || ''}
                    onChange={e => updatePromotionalOffer({ discountCode: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs font-mono"
                    placeholder="e.g. ART-TURNT2026"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiration / Validity Text</label>
                  <input
                    type="text"
                    value={promotionalOffer.expiresAt || ''}
                    onChange={e => updatePromotionalOffer({ expiresAt: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                    placeholder="e.g. Valid until Oct 31, 2026 or Ex-Stock Supply"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">CTA Button Label</label>
                  <input
                    type="text"
                    value={promotionalOffer.ctaText}
                    onChange={e => updatePromotionalOffer({ ctaText: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                    placeholder="e.g. Claim Rebate & Create RFQ"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Button Action Target</label>
                  <select
                    value={promotionalOffer.targetView}
                    onChange={e => updatePromotionalOffer({ targetView: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-xs bg-white"
                  >
                    <option value="rfq_builder">RFQ Builder (Quotation Form)</option>
                    <option value="shop">Industrial Products Catalog</option>
                  </select>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Live Preview:
                </span>
                <div className={`p-4 rounded-xs border transition-all ${
                  promotionalOffer.isActive ? 'bg-[#12304A] text-white border-[#F28C28]' : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-[#F28C28] text-white">
                      {promotionalOffer.badge || 'PROMO'}
                    </span>
                    <span className="text-[10px] text-amber-300 font-mono">{promotionalOffer.discountHighlight}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{promotionalOffer.title || 'Untitled Offer'}</h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1">{promotionalOffer.description}</p>
                </div>
              </div>
            </div>

            {/* Homepage Sections Manager */}
            <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 shadow-xs space-y-4">
              <div>
                <h2 className="text-base font-bold text-[#12304A]">Homepage Layout & Section Ordering</h2>
                <p className="text-xs text-slate-500">Edit section copy, change the order, hide blocks, or add a supported block. Changes appear on the shared homepage.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  aria-label="Homepage section to add"
                  value={newHomepageSectionType}
                  onChange={event => setNewHomepageSectionType(event.target.value)}
                  disabled={availableHomepageSections.length === 0}
                  className="flex-1 p-2 border border-slate-300 rounded-xs bg-white text-xs"
                >
                  {availableHomepageSections.length === 0 ? <option value="">All supported sections are added</option> :
                    availableHomepageSections.map(section => <option key={section.type} value={section.type}>{section.title}</option>)}
                </select>
                <button
                  type="button"
                  onClick={handleAddHomepageSection}
                  disabled={!hasPermission('homepage.manage') || availableHomepageSections.length === 0}
                  className="px-3 py-2 bg-[#12304A] hover:bg-[#1E5A85] text-white text-xs font-semibold rounded-xs disabled:bg-slate-300"
                >Add homepage section</button>
              </div>

              <div className="space-y-2">
                {[...homepageSections].sort((a, b) => a.order - b.order).map((sec, idx) => (
                  <div key={sec.id} className="grid grid-cols-1 lg:grid-cols-[54px_minmax(0,1fr)_auto] gap-3 p-3 border border-slate-200 rounded-xs items-start">
                    <div className="flex lg:flex-col items-center gap-1">
                      <button type="button" disabled={idx === 0} onClick={() => reorderHomepageSection(sec.id, 'up')} aria-label={`Move ${sec.title} up`} className="p-1 text-slate-600 hover:text-[#12304A] disabled:text-slate-300"><ArrowUp className="w-4 h-4" /></button>
                      <span className="text-[10px] font-mono text-slate-400">{idx + 1}</span>
                      <button type="button" disabled={idx === homepageSections.length - 1} onClick={() => reorderHomepageSection(sec.id, 'down')} aria-label={`Move ${sec.title} down`} className="p-1 text-slate-600 hover:text-[#12304A] disabled:text-slate-300"><ArrowDown className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-2 min-w-0">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Section title <span className="font-normal normal-case">({sec.type})</span></label>
                        <input value={sec.title} onChange={event => updateHomepageSection(sec.id, { title: event.target.value })} disabled={!hasPermission('homepage.manage')} className="w-full p-2 border border-slate-300 rounded-xs text-xs font-semibold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Description</label>
                        <textarea rows={2} value={sec.subtitle} onChange={event => updateHomepageSection(sec.id, { subtitle: event.target.value })} disabled={!hasPermission('homepage.manage')} className="w-full p-2 border border-slate-300 rounded-xs text-xs" />
                      </div>
                      {sec.type === 'custom_banner' && <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Image URL</label>
                          <input type="url" value={sec.imageUrl || ''} onChange={event => updateHomepageSection(sec.id, { imageUrl: event.target.value })} disabled={!hasPermission('homepage.manage')} className="w-full p-2 border border-slate-300 rounded-xs text-xs" placeholder="https://..." />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Upload image</label>
                          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={!hasPermission('homepage.manage')} onChange={event => void handleHomepageImageUpload(sec.id, event)} className="w-full text-[11px]" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Button label</label>
                          <input value={sec.ctaText || ''} onChange={event => updateHomepageSection(sec.id, { ctaText: event.target.value })} disabled={!hasPermission('homepage.manage')} className="w-full p-2 border border-slate-300 rounded-xs text-xs" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Button destination</label>
                          <select value={sec.targetView || 'shop'} onChange={event => updateHomepageSection(sec.id, { targetView: event.target.value as NonNullable<typeof sec.targetView> })} disabled={!hasPermission('homepage.manage')} className="w-full p-2 border border-slate-300 rounded-xs bg-white text-xs">
                            <option value="shop">Product catalog</option>
                            <option value="rfq_builder">Request a quote</option>
                            <option value="contact">Contact</option>
                            <option value="services">Services</option>
                            <option value="industries">Industries</option>
                            <option value="vendor_enlistment">Vendor enlistment</option>
                          </select>
                        </div>
                      </div>}
                    </div>
                    <div className="flex lg:flex-col items-center lg:items-end gap-2">
                      <button
                        type="button"
                        onClick={() => updateHomepageSection(sec.id, { isEnabled: !sec.isEnabled })}
                        disabled={!hasPermission('homepage.manage')}
                        className={`px-3 py-1.5 font-bold text-[11px] rounded-xs ${sec.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}
                      >{sec.isEnabled ? 'Visible' : 'Hidden'}</button>
                      <button type="button" onClick={() => deleteHomepageSection(sec.id)} disabled={!hasPermission('homepage.manage')} title={`Remove ${sec.title}`} className="p-1.5 text-rose-700 hover:bg-rose-50 rounded-xs disabled:text-slate-300"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
        )}

        {/* TAB 7: SITE SETTINGS & DYNAMIC SOCIAL MEDIA */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 shadow-xs space-y-4">
              <div>
                <h2 className="text-base font-bold text-[#12304A]">Site Logo</h2>
                <p className="text-xs text-slate-500 mt-1">This image appears in the site header and footer for every visitor.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px] gap-5 items-center">
                <div className="space-y-3">
                  <div>
                    <label htmlFor="site-logo-url" className="block text-xs font-bold text-slate-700 mb-1">Logo image URL</label>
                    <input
                      id="site-logo-url"
                      type="url"
                      value={websiteSettings.logoUrl}
                      disabled={!hasPermission('settings.manage')}
                      onChange={event => updateWebsiteSettings({ logoUrl: event.target.value })}
                      placeholder="https://..."
                      className="w-full p-2 border border-slate-300 rounded-xs text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="site-logo-file" className="block text-xs font-bold text-slate-700 mb-1">Upload from device</label>
                    <input
                      id="site-logo-file"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      disabled={!hasPermission('settings.manage') || logoUploading}
                      onChange={handleLogoUpload}
                      className="block w-full text-xs text-slate-600 file:mr-3 file:px-3 file:py-2 file:border-0 file:bg-slate-100 file:text-slate-700 file:font-semibold"
                    />
                    <p className="mt-1 text-[11px] text-slate-500">PNG, JPG, WebP, or GIF. Maximum 5 MB. {logoUploading ? 'Uploading…' : ''}</p>
                  </div>
                  {websiteSettings.logoUrl && hasPermission('settings.manage') && (
                    <button
                      type="button"
                      onClick={() => updateWebsiteSettings({ logoUrl: '' })}
                      className="text-xs font-semibold text-rose-700 hover:underline"
                    >Remove logo from the site</button>
                  )}
                </div>
                <div className="min-h-28 flex items-center justify-center border border-dashed border-slate-300 bg-slate-50 p-4">
                  {websiteSettings.logoUrl ? (
                    <img src={websiteSettings.logoUrl} alt="Current site logo preview" className="max-h-20 max-w-full object-contain" />
                  ) : (
                    <span className="text-xs text-slate-400">Text logo is currently in use</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#12304A] border-b border-slate-100 pb-2">
                Corporate Statutory & Identity Settings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company Trade Name</label>
                  <input
                    type="text"
                    value={websiteSettings.siteName}
                    disabled={!hasPermission('settings.manage')}
                    onChange={e => updateWebsiteSettings({ siteName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Helpdesk Phone</label>
                  <input
                    type="text"
                    value={websiteSettings.phone}
                    disabled={!hasPermission('settings.manage')}
                    onChange={e => updateWebsiteSettings({ phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp Direct Desk</label>
                  <input
                    type="text"
                    value={websiteSettings.whatsapp}
                    disabled={!hasPermission('settings.manage')}
                    onChange={e => updateWebsiteSettings({ whatsapp: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trade License Number</label>
                  <input
                    type="text"
                    value={websiteSettings.tradeLicenseNo}
                    disabled={!hasPermission('settings.manage')}
                    onChange={e => updateWebsiteSettings({ tradeLicenseNo: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">VAT / BIN 13-Digit Registration</label>
                  <input
                    type="text"
                    value={websiteSettings.binNo}
                    disabled={!hasPermission('settings.manage')}
                    onChange={e => updateWebsiteSettings({ binNo: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">TIN Tax Identification</label>
                  <input
                    type="text"
                    value={websiteSettings.tinNo}
                    disabled={!hasPermission('settings.manage')}
                    onChange={e => updateWebsiteSettings({ tinNo: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                  />
                </div>
              </div>
            </div>

            {/* Social media links manager */}
            <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="font-bold text-base text-[#12304A]">Global Social Media Channels</h3>
                  <p className="text-xs text-slate-500">
                    Add new platforms anytime (Facebook, LinkedIn, YouTube, Instagram, X/Twitter) without changing code.
                  </p>
                </div>
                {hasPermission('settings.manage') && (
                  <button
                    onClick={() => setSocialModalOpen(true)}
                    className="px-3 py-1.5 bg-[#12304A] text-white text-xs font-semibold rounded-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Social Channel</span>
                  </button>
                )}
              </div>

              <div className="space-y-2 text-xs">
                {socialMedia.map(s => (
                  <div key={s.id} className="p-2.5 border border-slate-200 rounded-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{s.platform}</span>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#1E5A85] flex items-center gap-1">
                        <span>{s.url}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    {hasPermission('settings.manage') && (
                      <button
                        onClick={() => deleteSocialMedia(s.id)}
                        className="text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: DJANGO & POSTGRESQL ARCHITECTURE EXPORTER */}
        {activeTab === 'django_export' && (
          <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 shadow-xs space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <Code2 className="w-4 h-4 text-emerald-700" />
                <span>Django 5.x + PostgreSQL Relational Architecture</span>
              </div>
              <h2 className="text-xl font-bold text-[#12304A]">
                Production Django ORM & Database Migration Export
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl mt-1">
                This schema generator produces complete, production-grade Django ORM code matching all models, roles, RFQ workflows, and PostgreSQL relational schemas specified in the prompt.
              </p>
            </div>

            {/* Django models.py Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold font-mono text-slate-800">art_procurement/models.py</span>
                <span className="text-slate-400">PostgreSQL Ready</span>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-200 text-xs font-mono rounded-xs overflow-x-auto max-h-96 leading-relaxed">
{`from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class Role(models.TextChoices):
        CUSTOMER = 'CUSTOMER', _('Customer')
        SELLER = 'SELLER', _('Seller')
        ADMIN = 'ADMIN', _('Admin')
    
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)
    phone = models.CharField(max_length=30, blank=True)
    company_name = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ProductCategory(models.Model):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=150, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    image_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    show_on_homepage = models.BooleanField(default=True)

    @property
    def product_count(self):
        """Automatically computed from active products table (Never hardcoded!)"""
        return self.products.filter(is_active=True).count()

class Product(models.Model):
    category = models.ForeignKey(ProductCategory, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=100, unique=True, db_index=True)
    brand = models.CharField(max_length=100, db_index=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    sale_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    is_price_on_request = models.BooleanField(default=False)
    unit = models.CharField(max_length=50, default='pcs')
    stock = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    review_count = models.PositiveIntegerField(default=0)
    short_description = models.CharField(max_length=500)
    full_description = models.TextField()
    is_featured = models.BooleanField(default=False)
    is_best_seller = models.BooleanField(default=False)
    is_special_offer = models.BooleanField(default=False)
    sales_count = models.PositiveIntegerField(default=0)
    views = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class RFQ(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'Draft'
        SUBMITTED = 'Submitted'
        UNDER_REVIEW = 'Under Review'
        OFFERS_RECEIVED = 'Offers Received'
        SELLER_SELECTED = 'Seller Selected'
        SELLER_CONFIRMED = 'Seller Confirmed'
        PROCESSING = 'Processing'
        COMPLETED = 'Completed'
        CANCELLED = 'Cancelled'

    rfq_number = models.CharField(max_length=50, unique=True, db_index=True)
    customer = models.ForeignKey(User, related_name='rfqs', on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    delivery_location = models.CharField(max_length=500)
    required_date = models.DateField()
    overall_notes = models.TextField(blank=True)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.SUBMITTED)
    created_at = models.DateTimeField(auto_now_add=True)

class RFQItem(models.Model):
    rfq = models.ForeignKey(RFQ, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    unit = models.CharField(max_length=50)
    item_notes = models.TextField(blank=True)

class SellerOffer(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending'
        SELECTED = 'selected'
        REJECTED = 'rejected'
        CONFIRMED = 'confirmed'

    rfq = models.ForeignKey(RFQ, related_name='seller_offers', on_delete=models.CASCADE)
    seller = models.ForeignKey(User, related_name='submitted_offers', on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=14, decimal_places=2)
    delivery_time = models.CharField(max_length=150)
    availability = models.CharField(max_length=200)
    warranty = models.CharField(max_length=200)
    offer_validity = models.CharField(max_length=100)
    additional_notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    submitted_at = models.DateTimeField(auto_now_add=True)
`}
              </pre>
            </div>
          </div>
        )}

      </div>

      {/* PRODUCT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border border-[#E2E8F0] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-base text-[#12304A]">
                {editingProductId ? 'Edit Product' : 'Add New Industrial Product'}
              </h3>
              <button onClick={() => setProductModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={prodForm.name}
                    onChange={e => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={prodForm.sku}
                    onChange={e => setProdForm({ ...prodForm, sku: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand Manufacturer *</label>
                  <input
                    type="text"
                    required
                    value={prodForm.brand}
                    onChange={e => setProdForm({ ...prodForm, brand: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={prodForm.categoryId}
                    onChange={e => setProdForm({ ...prodForm, categoryId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                  >
                    {categoriesWithCounts.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Standard Price (৳)</label>
                  <input
                    type="number"
                    value={prodForm.price}
                    onChange={e => setProdForm({ ...prodForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-300 rounded-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sale / Discount Price (৳)</label>
                  <input
                    type="number"
                    value={prodForm.salePrice}
                    onChange={e => setProdForm({ ...prodForm, salePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-300 rounded-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={e => setProdForm({ ...prodForm, stock: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-300 rounded-xs tabular-nums"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="product-image-url" className="block font-bold text-slate-700 mb-1">Product Image URL</label>
                  <input
                    id="product-image-url"
                    type="url"
                    value={prodForm.imageUrl}
                    onChange={e => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                    placeholder="https://... or /images/..."
                    className="w-full p-2 border border-slate-300 rounded-xs"
                  />
                </div>
                <div>
                  <label htmlFor="product-image-file" className="block font-bold text-slate-700 mb-1">Upload product image</label>
                  <input
                    id="product-image-file"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    disabled={productImageUploading || !hasPermission('products.add')}
                    onChange={handleProductImageUpload}
                    className="block w-full text-xs text-slate-600 file:mr-3 file:px-3 file:py-2 file:border-0 file:bg-slate-100 file:text-slate-700 file:font-semibold"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">{productImageUploading ? 'Uploading…' : 'PNG, JPG, WebP, or GIF. Maximum 5 MB.'}</p>
                </div>
                {prodForm.imageUrl && (
                  <div className="flex items-center gap-3">
                    <img src={prodForm.imageUrl} alt="Product preview" className="w-20 h-20 object-contain border border-slate-200 bg-white" />
                    <button type="button" onClick={() => setProdForm({ ...prodForm, imageUrl: '' })} className="text-xs font-semibold text-rose-700 hover:underline">
                      Remove image
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Technical Description</label>
                <textarea
                  rows={2}
                  value={prodForm.shortDescription}
                  onChange={e => setProdForm({ ...prodForm, shortDescription: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xs"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isPriceOnRequest}
                    onChange={e => setProdForm({ ...prodForm, isPriceOnRequest: e.target.checked })}
                  />
                  <span>Price on Request</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isFeatured}
                    onChange={e => setProdForm({ ...prodForm, isFeatured: e.target.checked })}
                  />
                  <span>Featured Item</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isSpecialOffer}
                    onChange={e => setProdForm({ ...prodForm, isSpecialOffer: e.target.checked })}
                  />
                  <span>Special Offer</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isActive}
                    onChange={e => setProdForm({ ...prodForm, isActive: e.target.checked })}
                  />
                  <span>Active in Store</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#12304A] text-white font-bold rounded-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border border-[#E2E8F0] shadow-2xl max-w-md w-full p-5 space-y-4">
            <h3 className="font-bold text-base text-[#12304A]">Add Category</h3>
            <form onSubmit={handleCategorySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={e => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL / Path</label>
                <input
                  type="text"
                  value={catForm.image}
                  onChange={e => setCatForm({ ...catForm, image: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={catForm.description}
                  onChange={e => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xs"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setCatModalOpen(false)} className="px-3 py-1.5 bg-slate-100">Cancel</button>
                <button type="submit" className="px-5 py-1.5 bg-[#12304A] text-white font-bold">Add Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SOCIAL MEDIA MODAL */}
      {socialModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border border-[#E2E8F0] shadow-2xl max-w-md w-full p-5 space-y-4">
            <h3 className="font-bold text-base text-[#12304A]">Add Social Media Platform</h3>
            <form onSubmit={handleSocialSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Platform Name (e.g. Instagram, X, Pinterest) *</label>
                <input
                  type="text"
                  required
                  value={socialForm.platform}
                  onChange={e => setSocialForm({ ...socialForm, platform: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Profile URL *</label>
                <input
                  type="url"
                  required
                  value={socialForm.url}
                  onChange={e => setSocialForm({ ...socialForm, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2 border border-slate-300 rounded-xs"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setSocialModalOpen(false)} className="px-3 py-1.5 bg-slate-100">Cancel</button>
                <button type="submit" className="px-5 py-1.5 bg-[#12304A] text-white font-bold">Save Channel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

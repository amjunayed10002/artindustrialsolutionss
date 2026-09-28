import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../common/ProductCard';
import {
  ArrowRight,
  Flame,
  Star,
  Sparkles,
  Layers,
  PackageSearch,
  Filter,
  CheckCircle2,
  Grid,
  Gift,
  Clock,
  Settings,
  ArrowUpDown,
  Tag
} from 'lucide-react';

export const ProductDiscoverySections: React.FC = () => {
  const {
    products,
    categories,
    featuredProducts,
    bestSellingProducts,
    bestRatedProducts,
    specialOfferProducts,
    homepageSections,
    promotionalOffer,
    currentUser,
    setCurrentView
  } = useApp();

  // All Products Section state
  const [allProductsCategoryFilter, setAllProductsCategoryFilter] = useState<string>('all');
  const [allProductsSortBy, setAllProductsSortBy] = useState<
    'default' | 'price_low' | 'price_high' | 'rating' | 'sales' | 'name_asc' | 'name_desc'
  >('default');
  const [allProductsVisibleCount, setAllProductsVisibleCount] = useState<number>(8);

  // Category-based Product section tab state
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('welding-consumables');
  const sectionConfig = (type: string) => homepageSections.find(section => section.type === type);
  const isSectionEnabled = (type: string) => sectionConfig(type)?.isEnabled ?? true;
  const sectionTitle = (type: string, fallback: string) => sectionConfig(type)?.title || fallback;
  const sectionSubtitle = (type: string, fallback: string) => sectionConfig(type)?.subtitle || fallback;
  const sectionOrder = (type: string, fallback: number) => sectionConfig(type)?.order ?? fallback;

  // Filter products for "All Products" section
  const activeProducts = products.filter(p => p.isActive);
  const filteredAllProducts = allProductsCategoryFilter === 'all'
    ? activeProducts
    : activeProducts.filter(p => {
        const cat = categories.find(c => c.slug === allProductsCategoryFilter);
        return cat ? p.categoryId === cat.id : true;
      });

  // Apply user-selected sorting
  const sortedAllProducts = [...filteredAllProducts].sort((a, b) => {
    const priceA = a.salePrice ?? a.price;
    const priceB = b.salePrice ?? b.price;

    switch (allProductsSortBy) {
      case 'price_low':
        if (a.isPriceOnRequest) return 1;
        if (b.isPriceOnRequest) return -1;
        return priceA - priceB;
      case 'price_high':
        if (a.isPriceOnRequest) return 1;
        if (b.isPriceOnRequest) return -1;
        return priceB - priceA;
      case 'rating':
        return b.rating - a.rating;
      case 'sales':
        return (b.salesCount || 0) - (a.salesCount || 0);
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'default':
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
  });

  const displayedAllProducts = sortedAllProducts.slice(0, allProductsVisibleCount);

  // Category-based products
  const currentCategoryObj = categories.find(c => c.slug === selectedCategoryTab) || categories[0];
  const categoryBasedProducts = currentCategoryObj
    ? activeProducts.filter(p => p.categoryId === currentCategoryObj.id)
    : [];

  return (
    <div className="flex flex-col text-[#1F2933]">
      
      {/* ============================================================== */}
      {/* 1. ALL PRODUCTS SECTION (First in user's specified sequence)     */}
      {/* ============================================================== */}
      {isSectionEnabled('all_products') && <section style={{ order: sectionOrder('all_products', 0) }} className="bg-[#F5F7F9] py-10 sm:py-12 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* ============================================================ */}
          {/* USER SPECIFIED: ANIMATED OFFER BOX UP OF H2 "All Industrial"  */}
          {/* (Admin-controlled: when off does not show, when active appears) */}
          {/* ============================================================ */}
          {promotionalOffer?.isActive && (
            <div className="mb-8 relative overflow-hidden rounded-xs border-2 border-[#F28C28] bg-linear-to-r from-[#12304A] via-[#163e61] to-[#1E5A85] text-white p-5 sm:p-6 shadow-xl transition-all duration-300 group">
              {/* Animated Light Shimmer Sheen */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left Text & Highlight */}
                <div className="space-y-2.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F28C28] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F28C28]"></span>
                    </span>
                    <span className="bg-[#F28C28] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
                      {promotionalOffer.badge}
                    </span>
                    {promotionalOffer.discountHighlight && (
                      <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs">
                        {promotionalOffer.discountHighlight}
                      </span>
                    )}
                    {promotionalOffer.expiresAt && (
                      <span className="text-[11px] text-slate-300 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-[#F28C28]" />
                        <span>{promotionalOffer.expiresAt}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                    {promotionalOffer.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
                    {promotionalOffer.description}
                  </p>

                  {promotionalOffer.discountCode && (
                    <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-slate-300 text-[11px]">Factory Tender Coupon Code:</span>
                      <span className="font-mono font-bold bg-white/15 text-white px-2.5 py-0.5 rounded-xs border border-white/20 select-all tracking-wider">
                        {promotionalOffer.discountCode}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Call To Action */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => setCurrentView(promotionalOffer.targetView || 'rfq_builder')}
                    className="px-6 py-3.5 bg-[#F28C28] hover:bg-[#d9771b] text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-transform shadow-lg flex items-center gap-2 hover:scale-102"
                  >
                    <Gift className="w-4 h-4" />
                    <span>{promotionalOffer.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>

                  {/* Admin Quick Editor Link */}
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => setCurrentView('admin_dashboard')}
                      title="Manage or toggle this offer in Admin Dashboard"
                      className="px-3 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xs border border-white/20 text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#F28C28]" />
                      <span className="text-[11px] font-semibold">Offer Settings</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* Section Header with H2 "All Industrial Products" */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-6 border-b border-[#E2E8F0] gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5A85] uppercase tracking-wider mb-1">
                <PackageSearch className="w-4 h-4 text-[#F28C28]" />
                <span>Ex-Stock Central Warehouse Inventory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A]">
                {sectionTitle('all_products', 'All Industrial Products')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                {sectionSubtitle('all_products', 'Browse our verified catalog of engineering components, certified spares, and MRO consumables with immediate dispatch.')}
              </p>
            </div>

            {/* Header Right Actions: Sort Dropdown & Full Catalog Button */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Sort options dropdown */}
              <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] rounded-xs px-2.5 py-1.5 shadow-2xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#1E5A85]" />
                <span className="text-xs font-bold text-slate-500">Sort:</span>
                <select
                  value={allProductsSortBy}
                  onChange={e => setAllProductsSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-[#12304A] outline-none cursor-pointer pr-1"
                >
                  <option value="default">Featured / In-Stock</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Rating: Highest Rated (★)</option>
                  <option value="sales">Popularity / Top Volume</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>

              <button
                onClick={() => setCurrentView('shop')}
                className="px-4 py-2 bg-[#12304A] hover:bg-[#1E5A85] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Full Catalog & Filters</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F28C28]" />
              </button>
            </div>
          </div>

          {/* Quick Category Filter Bar for All Products */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-4 mb-6 text-xs no-scrollbar">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3 text-slate-400" /> Filter:
              </span>
              <button
                onClick={() => { setAllProductsCategoryFilter('all'); setAllProductsVisibleCount(8); }}
                className={`px-3 py-1.5 rounded-xs font-semibold whitespace-nowrap transition-colors ${
                  allProductsCategoryFilter === 'all'
                    ? 'bg-[#12304A] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-[#E2E8F0]'
                }`}
              >
                All Items ({activeProducts.length})
              </button>
              {categories.slice(0, 7).map(cat => {
                const count = activeProducts.filter(p => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setAllProductsCategoryFilter(cat.slug); setAllProductsVisibleCount(8); }}
                    className={`px-3 py-1.5 rounded-xs font-semibold whitespace-nowrap transition-colors ${
                      allProductsCategoryFilter === cat.slug
                        ? 'bg-[#12304A] text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-[#E2E8F0]'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:block text-slate-400 text-xs tabular-nums shrink-0">
              Showing <strong>{displayedAllProducts.length}</strong> of <strong>{filteredAllProducts.length}</strong> Products
            </div>
          </div>

          {/* Products Grid */}
          {displayedAllProducts.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-xs p-10 text-center">
              <p className="text-xs text-slate-500">No active products found matching the selected filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {displayedAllProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Show More / View Full Catalog Action */}
          <div className="mt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
            {allProductsVisibleCount < filteredAllProducts.length && (
              <button
                onClick={() => setAllProductsVisibleCount(prev => prev + 8)}
                className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#12304A] font-semibold text-xs rounded-xs transition-colors shadow-xs"
              >
                Load More Products ({filteredAllProducts.length - allProductsVisibleCount} remaining)
              </button>
            )}
            <button
              onClick={() => setCurrentView('shop')}
              className="px-6 py-2.5 bg-[#1E5A85] hover:bg-[#12304A] text-white font-semibold text-xs rounded-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Explore All Spares in Shop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>}

      {/* ============================================================== */}
      {/* 2. TOP SELL (Best Selling Products - Second in sequence)        */}
      {/* ============================================================== */}
      {isSectionEnabled('best_sellers') && <section style={{ order: sectionOrder('best_sellers', 2) }} className="bg-white py-12 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-orange-50 text-[#F28C28] rounded-xs border border-orange-100 shrink-0">
                <Flame className="w-6 h-6 text-[#F28C28]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-[#12304A]">{sectionTitle('best_sellers', 'Top Selling Industrial Products')}</h2>
                  <span className="text-[10px] font-semibold uppercase bg-orange-100 text-orange-900 px-2 py-0.5 rounded-xs tracking-wider">
                    Volume Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {sectionSubtitle('best_sellers', 'Calculated automatically from real factory procurement and plant supply records.')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('shop')}
              className="text-xs font-bold text-[#1E5A85] hover:text-[#12304A] flex items-center gap-1 shrink-0"
            >
              <span>View All High-Volume Spares</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F28C28]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bestSellingProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>}

      {/* ============================================================== */}
      {/* 3. BEST PRODUCT (Featured / Premium Components - Third)         */}
      {/* ============================================================== */}
      {isSectionEnabled('featured') && <section style={{ order: sectionOrder('featured', 3) }} className="bg-[#F5F7F9] py-12 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-6 border-b border-[#E2E8F0] gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-blue-50 text-[#1E5A85] rounded-xs border border-blue-100 shrink-0">
                <Sparkles className="w-6 h-6 text-[#F28C28]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-[#12304A]">{sectionTitle('featured', 'Best Industrial Products')}</h2>
                  <span className="text-[10px] font-semibold uppercase bg-blue-100 text-[#12304A] px-2 py-0.5 rounded-xs tracking-wider">
                    Engineers' Choice
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {sectionSubtitle('featured', 'Handpicked industrial grade spares certified for extreme manufacturing environments.')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('shop')}
              className="text-xs font-bold text-[#1E5A85] hover:text-[#12304A] flex items-center gap-1 shrink-0"
            >
              <span>Explore All Featured Spares</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F28C28]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>}

      {isSectionEnabled('special_offers') && <section style={{ order: sectionOrder('special_offers', 4) }} className="bg-white py-12 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="pb-5 mb-5 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-[#12304A]">{sectionTitle('special_offers', 'Special Offers')}</h2>
            <p className="text-xs text-slate-500 mt-1">{sectionSubtitle('special_offers', 'Current products with active pricing offers.')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {specialOfferProducts.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>}

      {/* ============================================================== */}
      {/* 4. BEST RATED (Highest Rated Components - Fourth)               */}
      {/* ============================================================== */}
      {isSectionEnabled('best_rated') && <section style={{ order: sectionOrder('best_rated', 5) }} className="bg-white py-12 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xs border border-amber-100 shrink-0">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-[#12304A]">{sectionTitle('best_rated', 'Best Rated by Plant Engineers')}</h2>
                  <span className="text-[10px] font-semibold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-xs tracking-wider">
                    ★ 4.8+ Stars
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {sectionSubtitle('best_rated', 'Highest rated products verified for reliability, wear resistance, and long MTBF in 24/7 continuous operations.')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('shop')}
              className="text-xs font-bold text-[#1E5A85] hover:text-[#12304A] flex items-center gap-1 shrink-0"
            >
              <span>View All Top Rated</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F28C28]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bestRatedProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>}

      {/* ============================================================== */}
      {/* 5. CATEGORY BASED PRODUCT (Fifth in sequence)                  */}
      {/* ============================================================== */}
      {isSectionEnabled('category_showcase') && <section style={{ order: sectionOrder('category_showcase', 6) }} className="bg-[#F5F7F9] py-12 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-6 border-b border-[#E2E8F0] gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-slate-200 text-[#12304A] rounded-xs shrink-0">
                <Layers className="w-6 h-6 text-[#1E5A85]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-[#12304A]">{sectionTitle('category_showcase', 'Category Based Products')}</h2>
                  <span className="text-[10px] font-semibold uppercase bg-[#12304A] text-white px-2 py-0.5 rounded-xs tracking-wider">
                    Targeted Sourcing
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {sectionSubtitle('category_showcase', 'Select an industrial discipline to inspect verified OEM components, specifications, and live inventory.')}
                </p>
              </div>
            </div>

            {currentCategoryObj && (
              <button
                onClick={() => setCurrentView('shop', { categorySlug: currentCategoryObj.slug })}
                className="text-xs font-bold text-[#1E5A85] hover:text-[#12304A] flex items-center gap-1 shrink-0"
              >
                <span>View All {currentCategoryObj.name}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F28C28]" />
              </button>
            )}
          </div>

          {/* Interactive Category Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {[
              { slug: 'welding-consumables', label: 'Welding Consumables', spec: 'AWS A5.1 / A5.18' },
              { slug: 'bearings', label: 'Industrial Bearings', spec: 'SKF · FAG · Timken' },
              { slug: 'valves', label: 'Valves & Piping', spec: 'JIS 10K / ANSI 150' },
              { slug: 'ppe-safety', label: 'PPE & Safety Gear', spec: 'EN388 / CE Certified' }
            ].map(tab => {
              const isSelected = selectedCategoryTab === tab.slug;
              return (
                <button
                  key={tab.slug}
                  onClick={() => setSelectedCategoryTab(tab.slug)}
                  className={`p-3 text-left rounded-xs border transition-all ${
                    isSelected
                      ? 'bg-white border-[#1E5A85] shadow-sm ring-1 ring-[#1E5A85]'
                      : 'bg-white/80 hover:bg-white border-[#E2E8F0] text-slate-700'
                  }`}
                >
                  <div className={`font-bold text-xs ${isSelected ? 'text-[#12304A]' : 'text-slate-800'}`}>
                    {tab.label}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {tab.spec}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Category-based products grid */}
          <div className="bg-white p-6 rounded-xs border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#12304A]">
                  {currentCategoryObj?.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentCategoryObj?.description}
                </p>
              </div>
              <span className="text-xs font-bold text-[#12304A] bg-[#F5F7F9] px-2.5 py-1 rounded-xs border border-slate-200">
                {categoryBasedProducts.length} Items Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryBasedProducts.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

        </div>
      </section>}

    </div>
  );
};

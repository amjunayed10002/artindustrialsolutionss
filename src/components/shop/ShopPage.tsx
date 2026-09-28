import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../common/ProductCard';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronRight,
  Layers,
  Check
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    products,
    categoriesWithCounts,
    searchQuery,
    setSearchQuery,
    selectedCategorySlug,
    setCurrentView
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategorySlug || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceMax, setPriceMax] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  // Extract unique brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
    return list.sort();
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (!product.isActive) return false;

      // Search keyword match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesDesc = product.shortDescription.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesBrand && !matchesDesc) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const cat = categoriesWithCounts.find(c => c.slug === selectedCategory);
        if (cat && product.categoryId !== cat.id) return false;
      }

      // Brand filter
      if (selectedBrand !== 'all') {
        if (product.brand !== selectedBrand) return false;
      }

      // In stock only
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      // Max price filter (if not price on request)
      if (!product.isPriceOnRequest && product.price > priceMax) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.salesCount - a.salesCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_asc') return (a.salePrice || a.price) - (b.salePrice || b.price);
      if (sortBy === 'price_desc') return (b.salePrice || b.price) - (a.salePrice || a.price);
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, inStockOnly, priceMax, sortBy, categoriesWithCounts]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setInStockOnly(false);
    setPriceMax(100000);
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#F5F7F9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb row */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <button onClick={() => setCurrentView('home')} className="hover:text-[#12304A]">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#12304A] font-semibold">Industrial Products Catalog</span>
          {selectedCategory !== 'all' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#1E5A85] capitalize">
                {categoriesWithCounts.find(c => c.slug === selectedCategory)?.name}
              </span>
            </>
          )}
        </div>

        {/* Layout Grid: Sidebar Filters (Desktop) + Product Catalog */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white border border-[#E2E8F0] rounded-xs p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <span className="font-bold text-sm text-[#12304A] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#F28C28]" />
                  <span>Filter Products</span>
                </span>
                {(selectedCategory !== 'all' || selectedBrand !== 'all' || inStockOnly || searchQuery) && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-[#F28C28] hover:underline font-semibold"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Keyword Search */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Search Catalog
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Keywords, SKU, specs..."
                    className="w-full text-xs p-2.5 pl-8 border border-[#E2E8F0] focus:border-[#1E5A85] rounded-xs outline-none bg-[#F5F7F9] focus:bg-white"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Categories Filter with Live Counts */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Categories
                </label>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  <button
                    onClick={() => { setSelectedCategory('all'); setCurrentPage(1); }}
                    className={`w-full text-left px-2 py-1.5 rounded-xs text-xs flex items-center justify-between transition-colors ${selectedCategory === 'all' ? 'bg-[#12304A] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'}`}
                  >
                    <span>All Categories</span>
                    <span className="text-[11px] tabular-nums">({products.filter(p => p.isActive).length})</span>
                  </button>
                  {categoriesWithCounts
                    .filter(c => c.isActive)
                    .map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.slug); setCurrentPage(1); }}
                        className={`w-full text-left px-2 py-1.5 rounded-xs text-xs flex items-center justify-between transition-colors ${selectedCategory === cat.slug ? 'bg-[#12304A] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'}`}
                      >
                        <span className="truncate pr-2">{cat.name}</span>
                        <span className="text-[11px] tabular-nums">({cat.productCount})</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Brand / Manufacturer
                </label>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => { setSelectedBrand('all'); setCurrentPage(1); }}
                    className={`w-full text-left px-2 py-1.5 rounded-xs text-xs flex items-center justify-between ${selectedBrand === 'all' ? 'bg-[#12304A] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'}`}
                  >
                    <span>All Brands</span>
                  </button>
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => { setSelectedBrand(brand); setCurrentPage(1); }}
                      className={`w-full text-left px-2 py-1.5 rounded-xs text-xs flex items-center justify-between ${selectedBrand === brand ? 'bg-[#12304A] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                      <span>{brand}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Filter Checkbox */}
              <div className="mb-6 pt-4 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => { setInStockOnly(e.target.checked); setCurrentPage(1); }}
                    className="w-4 h-4 rounded-xs text-[#1E5A85] focus:ring-0"
                  />
                  <span>In Stock Only (Ex-Stock Ready)</span>
                </label>
              </div>

              {/* Price Range */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Max Price
                  </label>
                  <span className="text-xs font-mono font-bold text-[#12304A] tabular-nums">
                    ৳{priceMax.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="1000"
                  value={priceMax}
                  onChange={e => { setPriceMax(Number(e.target.value)); setCurrentPage(1); }}
                  className="w-full accent-[#1E5A85]"
                />
              </div>

            </div>
          </aside>

          {/* Main Product Grid Column */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Top Toolbar: Search info, sorting, and Mobile Filter Toggle */}
            <div className="bg-white border border-[#E2E8F0] rounded-xs p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold text-[#12304A]">
                  Industrial Supply Catalog
                </h1>
                <p className="text-xs text-slate-500 tabular-nums">
                  Showing <strong className="text-slate-900">{filteredProducts.length}</strong> matching products from live inventory
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden px-3 py-2 bg-[#F5F7F9] border border-[#E2E8F0] rounded-xs text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                >
                  <Filter className="w-3.5 h-3.5 text-[#F28C28]" />
                  <span>Filters</span>
                </button>

                {/* Sort selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="text-xs bg-[#F5F7F9] border border-[#E2E8F0] rounded-xs px-2.5 py-1.5 font-medium text-slate-800 outline-none focus:border-[#1E5A85]"
                  >
                    <option value="popular">Best Selling / Popularity</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest Additions</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters Bar */}
            {(selectedCategory !== 'all' || selectedBrand !== 'all' || inStockOnly || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500">Active Filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-xs flex items-center gap-1">
                    Category: {categoriesWithCounts.find(c => c.slug === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedBrand !== 'all' && (
                  <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-xs flex items-center gap-1">
                    Brand: {selectedBrand}
                    <button onClick={() => setSelectedBrand('all')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-xs flex items-center gap-1">
                    In Stock Only
                    <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {searchQuery && (
                  <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-xs flex items-center gap-1">
                    Query: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                <button onClick={resetFilters} className="text-[#F28C28] hover:underline font-semibold ml-2">
                  Clear All
                </button>
              </div>
            )}

            {/* Product Cards Grid */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#E2E8F0] rounded-xs p-12 text-center space-y-3">
                <p className="text-base font-semibold text-slate-700">No industrial products matched your criteria.</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your search terms, resetting brand or category filters, or contact our engineering desk directly for custom sourcing.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#12304A] text-white text-xs font-semibold rounded-xs mt-2"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-6 flex items-center justify-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 bg-white border border-[#E2E8F0] text-xs font-semibold rounded-xs disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 text-xs font-semibold rounded-xs ${currentPage === idx + 1 ? 'bg-[#12304A] text-white' : 'bg-white border border-[#E2E8F0] text-slate-700'}`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 bg-white border border-[#E2E8F0] text-xs font-semibold rounded-xs disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end lg:hidden">
          <div className="w-80 bg-white h-full p-5 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-bold text-sm text-[#12304A]">Filters</span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Category
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory('all'); setMobileFilterOpen(false); }}
                  className={`w-full text-left px-2 py-1 text-xs rounded-xs ${selectedCategory === 'all' ? 'bg-[#12304A] text-white' : 'text-slate-700'}`}
                >
                  All Categories
                </button>
                {categoriesWithCounts.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.slug); setMobileFilterOpen(false); }}
                    className={`w-full text-left px-2 py-1 text-xs rounded-xs flex justify-between ${selectedCategory === cat.slug ? 'bg-[#12304A] text-white' : 'text-slate-700'}`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="tabular-nums">({cat.productCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Brand
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => { setSelectedBrand('all'); setMobileFilterOpen(false); }}
                  className={`w-full text-left px-2 py-1 text-xs rounded-xs ${selectedBrand === 'all' ? 'bg-[#12304A] text-white' : 'text-slate-700'}`}
                >
                  All Brands
                </button>
                {brands.map(b => (
                  <button
                    key={b}
                    onClick={() => { setSelectedBrand(b); setMobileFilterOpen(false); }}
                    className={`w-full text-left px-2 py-1 text-xs rounded-xs ${selectedBrand === b ? 'bg-[#12304A] text-white' : 'text-slate-700'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { resetFilters(); setMobileFilterOpen(false); }}
              className="w-full py-2 bg-slate-100 text-xs font-semibold text-slate-700 rounded-xs"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

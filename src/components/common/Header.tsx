import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthModal } from '../auth/AuthModal';
import {
  Phone,
  Mail,
  MessageCircle,
  Search,
  ShoppingCart,
  FileText,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Building2,
  HardHat,
  Wrench,
  Layers,
  ArrowRight,
  LogIn,
  UserPlus,
  Sparkles,
  Factory
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    rfqs,
    currentUser,
    isAuthenticated,
    signOut,
    websiteSettings,
    searchQuery,
    setSearchQuery,
    categoriesWithCounts
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | null>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Close the account and category dropdowns when clicking anywhere outside them
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (accountMenuRef.current && !accountMenuRef.current.contains(target)) {
        setAccountMenuOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(target)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setCurrentView('shop');
  };

  // Count active RFQs
  const activeRfqCount = rfqs.filter(r => r.status !== 'Completed' && r.status !== 'Cancelled').length;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-xs">
      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="text-left group flex items-center gap-3 btn-3d"
            >
              {websiteSettings.logoUrl ? (
                <img
                  src={websiteSettings.logoUrl}
                  alt={`${websiteSettings.siteName} logo`}
                  className="w-10 h-10 object-contain shrink-0"
                />
              ) : (
                <div className="w-10 h-10 bg-[#12304A] text-white flex items-center justify-center rounded-sm font-bold text-lg tracking-wider border-2 border-[#F28C28] shadow-sm transform group-hover:scale-105 transition-transform duration-200">
                  ART
                </div>
              )}
              <div className="leading-tight">
                <span className="block text-xl font-bold tracking-tight text-[#12304A] group-hover:text-[#1E5A85] transition-colors">
                  {websiteSettings.siteName}
                </span>
                <span className="block text-[11px] font-semibold text-[#F28C28] tracking-widest uppercase">
                  Solutions & Supply
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl mx-4 items-center relative"
          >
            <div className="relative w-full flex items-center">
              <input
                type="text"
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                placeholder="Search by Product name, SKU, Bearing number, Valve, Brand (e.g. SKF, ESAB)..."
                className="w-full bg-[#F5F7F9] border border-[#E2E8F0] focus:border-[#1E5A85] focus:bg-white text-sm text-[#1F2933] pl-10 pr-24 py-2.5 rounded-sm outline-none transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 bg-[#12304A] hover:bg-[#1E5A85] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1 btn-3d"
              >
                Search
              </button>
            </div>
          </form>

          {/* Action Hub (Right Zone: Sign In, Sign Up, RFQ, Cart, Account Switcher) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">

            {!isAuthenticated && (
              <>
                <button
                  onClick={() => setAuthModalMode('signin')}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-[#12304A] hover:text-[#1E5A85] bg-[#F5F7F9] hover:bg-slate-200/80 border border-[#E2E8F0] rounded-xs transition-all duration-200 btn-3d flex items-center gap-1.5 shadow-2xs"
                  title="Sign in to your account"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#1E5A85]" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => setAuthModalMode('signup')}
                  className="px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white bg-[#F28C28] hover:bg-[#d9771b] rounded-xs shadow-sm transition-colors btn-3d flex items-center gap-1.5"
                  title="Create a buyer or seller account"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </>
            )}
            
            {/* RFQ Quick Button */}
            <button
              onClick={() => setCurrentView('rfq_builder')}
              className="relative hidden lg:flex items-center gap-2 px-3 py-2 bg-[#F5F7F9] hover:bg-slate-200/80 border border-[#E2E8F0] rounded-sm text-xs font-semibold text-[#12304A] transition-colors btn-3d"
              title="Request for Quotation"
            >
              <FileText className="w-4 h-4 text-[#F28C28]" />
              <span>RFQ</span>
              {activeRfqCount > 0 && (
                <span className="bg-[#12304A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs tabular-nums animate-pulse">
                  {activeRfqCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setCurrentView('cart')}
              className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-[#1E5A85] hover:bg-[#12304A] text-white rounded-sm text-xs font-semibold transition-all duration-200 btn-3d shadow-xs"
              title="View Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-[#F28C28] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {isAuthenticated && <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 text-xs font-medium text-[#12304A] hover:bg-[#F5F7F9] rounded-sm border border-transparent hover:border-[#E2E8F0] transition-colors btn-3d"
              >
                <div className={`w-7 h-7 rounded-sm flex items-center justify-center font-bold text-xs shadow-2xs ${
                  currentUser.role === 'admin'
                    ? 'bg-[#12304A] text-white'
                    : currentUser.role === 'seller'
                    ? 'bg-[#F28C28] text-white'
                    : 'bg-[#1E5A85] text-white'
                }`}>
                  {currentUser.role === 'admin' ? 'AD' : currentUser.role === 'seller' ? 'SL' : 'CU'}
                </div>
                <div className="hidden xl:block text-left">
                  <span className="block font-semibold text-xs leading-none text-[#12304A] truncate max-w-[100px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="block text-[10px] text-slate-500 capitalize leading-none mt-0.5">
                    {currentUser.role === 'seller' ? 'Bidder / Vendor' : currentUser.role === 'customer' ? 'Buyer / Client' : 'Admin'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E2E8F0] shadow-lg rounded-sm py-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                    <p className="font-semibold text-slate-900">{currentUser.name}</p>
                    <p className="text-slate-500 text-[11px] truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="font-semibold text-[10px] uppercase text-[#1E5A85] bg-blue-50 px-1.5 py-0.5 rounded-xs">
                        Role: {currentUser.role} {currentUser.adminRole ? `(${currentUser.adminRole})` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Navigation Links based on role */}
                  <div className="py-1">
                    {currentUser.role === 'customer' && <button
                      onClick={() => { setCurrentView('customer_dashboard'); setAccountMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                    ><UserIcon className="w-3.5 h-3.5 text-slate-400" />Buyer workspace</button>}
                    {currentUser.role === 'seller' && <button
                      onClick={() => { setCurrentView('seller_portal'); setAccountMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                    ><Building2 className="w-3.5 h-3.5 text-slate-400" />Seller workspace</button>}
                    {currentUser.role === 'admin' && <button
                      onClick={() => { setCurrentView('admin_dashboard'); setAccountMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-[#12304A] font-semibold"
                    ><ShieldCheck className="w-3.5 h-3.5 text-[#F28C28]" />Admin workspace</button>}
                  </div>
                  <button
                    onClick={() => { void signOut(); setAccountMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 border-t border-slate-100 hover:bg-slate-50 text-rose-700 font-semibold"
                  >Sign out</button>
                </div>
              )}
            </div>}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-2 md:hidden">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Search products, brands, SKU..."
              className="w-full bg-[#F5F7F9] border border-[#E2E8F0] text-sm text-[#1F2933] pl-9 pr-20 py-2 rounded-sm outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-[#12304A] text-white text-xs font-semibold rounded-xs"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Secondary Category & Main Menu Nav Bar */}
      <nav className="hidden md:block bg-white border-t border-[#E2E8F0]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm font-medium">
            
            {/* All Categories Dropdown Trigger */}
            <div className="relative" ref={categoryMenuRef}>
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#12304A] text-white font-semibold text-xs uppercase tracking-wider hover:bg-[#1E5A85] transition-colors"
              >
                <Layers className="w-4 h-4 text-[#F28C28]" />
                <span>All Categories</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>

              {categoryDropdownOpen && (
                <div
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                  className="absolute left-0 top-full w-72 bg-white border border-[#E2E8F0] shadow-xl rounded-b-sm py-2 z-50 max-h-[460px] overflow-y-auto"
                >
                  {categoriesWithCounts.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCurrentView('shop', { categorySlug: cat.slug });
                        setCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#F5F7F9] flex items-center justify-between text-xs text-slate-800 transition-colors"
                    >
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-[11px] text-slate-400 tabular-nums">
                        {cat.productCount} items
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1 px-3">
                    <button
                      onClick={() => { setCurrentView('shop'); setCategoryDropdownOpen(false); }}
                      className="w-full text-center text-xs text-[#1E5A85] font-semibold py-1 hover:underline"
                    >
                      Browse All Catalog →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Standard Nav Links */}
            <button
              onClick={() => setCurrentView('home')}
              className={`px-3.5 py-2.5 text-xs font-semibold transition-colors border-b-2 ${currentView === 'home' ? 'text-[#12304A] border-[#F28C28]' : 'text-slate-600 border-transparent hover:text-[#12304A]'}`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('shop')}
              className={`px-3.5 py-2.5 text-xs font-semibold transition-colors border-b-2 ${currentView === 'shop' ? 'text-[#12304A] border-[#F28C28]' : 'text-slate-600 border-transparent hover:text-[#12304A]'}`}
            >
              Industrial Products
            </button>
            <button
              onClick={() => setCurrentView('services')}
              className={`px-3.5 py-2.5 text-xs font-semibold transition-colors border-b-2 ${currentView === 'services' ? 'text-[#12304A] border-[#F28C28]' : 'text-slate-600 border-transparent hover:text-[#12304A]'}`}
            >
              Engineering Services
            </button>
            <button
              onClick={() => setCurrentView('industries')}
              className={`px-3.5 py-2.5 text-xs font-semibold transition-colors border-b-2 ${currentView === 'industries' ? 'text-[#12304A] border-[#F28C28]' : 'text-slate-600 border-transparent hover:text-[#12304A]'}`}
            >
              Industries Served
            </button>
            <button
              onClick={() => setCurrentView('vendor_enlistment')}
              className={`px-3.5 py-2.5 text-xs font-semibold transition-colors border-b-2 ${currentView === 'vendor_enlistment' ? 'text-[#12304A] border-[#F28C28]' : 'text-slate-600 border-transparent hover:text-[#12304A]'}`}
            >
              Vendor Enlistment
            </button>
            <button
              onClick={() => setCurrentView('company_profile')}
              className={`px-3.5 py-2.5 text-xs font-semibold transition-colors border-b-2 ${currentView === 'company_profile' ? 'text-[#12304A] border-[#F28C28]' : 'text-slate-600 border-transparent hover:text-[#12304A]'}`}
            >
              Company Profile
            </button>
            <button
              onClick={() => setCurrentView('about_us')}
              className={`px-3.5 py-2.5 text-xs font-semibold transition-colors border-b-2 ${currentView === 'about_us' ? 'text-[#12304A] border-[#F28C28]' : 'text-slate-600 border-transparent hover:text-[#12304A]'}`}
            >
              About Us
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className={`px-3.5 py-2.5 text-xs font-semibold transition-colors border-b-2 ${currentView === 'contact' ? 'text-[#12304A] border-[#F28C28]' : 'text-slate-600 border-transparent hover:text-[#12304A]'}`}
            >
              Contact Us
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('rfq_builder')}
              className="text-xs font-bold text-[#F28C28] hover:text-[#12304A] transition-colors flex items-center gap-1.5"
            >
              <span>Cart → RFQ Instant Quotation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E2E8F0] px-4 py-3 space-y-2 text-sm">
          <button
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 font-medium text-slate-800 border-b border-slate-100"
          >
            Home
          </button>
          <button
            onClick={() => { setCurrentView('shop'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 font-medium text-slate-800 border-b border-slate-100"
          >
            Products Catalog
          </button>
          <button
            onClick={() => { setCurrentView('rfq_builder'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 font-semibold text-[#F28C28] border-b border-slate-100 flex items-center justify-between"
          >
            <span>Request for Quotation (RFQ)</span>
            <span className="text-xs bg-[#F28C28] text-white px-2 py-0.5 rounded-xs">Cart to RFQ</span>
          </button>
          <button
            onClick={() => { setCurrentView('services'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 font-medium text-slate-800 border-b border-slate-100"
          >
            Engineering Services
          </button>
          <button
            onClick={() => { setCurrentView('industries'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 font-medium text-slate-800 border-b border-slate-100"
          >
            Industries We Serve
          </button>
          <button
            onClick={() => { setCurrentView('vendor_enlistment'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 font-medium text-slate-800 border-b border-slate-100"
          >
            Vendor Enlistment (Download Documents)
          </button>
          <button
            onClick={() => { setCurrentView('company_profile'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 font-medium text-slate-800 border-b border-slate-100"
          >
            Company Profile & Legal
          </button>
          <button
            onClick={() => { setCurrentView('about_us'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 font-medium text-slate-800 border-b border-slate-100"
          >
            About Us
          </button>
          <button
            onClick={() => { setCurrentView('contact'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 font-medium text-slate-800 border-b border-slate-100"
          >
            Contact
          </button>
          {isAuthenticated && (
            <div className="pt-2 flex flex-col gap-2 border-t border-slate-100">
              {currentUser.role === 'customer' && <button
                onClick={() => { setCurrentView('customer_dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-center py-2 bg-slate-100 text-slate-800 font-semibold rounded-xs text-xs"
              >Buyer workspace</button>}
              {currentUser.role === 'seller' && <button
                onClick={() => { setCurrentView('seller_portal'); setMobileMenuOpen(false); }}
                className="w-full text-center py-2 bg-[#1E5A85] text-white font-semibold rounded-xs text-xs"
              >Seller workspace</button>}
              {currentUser.role === 'admin' && <button
                onClick={() => { setCurrentView('admin_dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-center py-2 bg-[#12304A] text-white font-semibold rounded-xs text-xs"
              >Admin workspace</button>}
              <button
                onClick={() => { void signOut(); setMobileMenuOpen(false); }}
                className="w-full text-center py-2 border border-slate-200 text-rose-700 font-semibold rounded-xs text-xs"
              >Sign out</button>
            </div>
          )}
        </div>
      )}

      {/* Interactive Auth Modal for Sign In and Sign Up (with Buyer and Seller selection) */}
      <AuthModal
        mode={authModalMode}
        onClose={() => setAuthModalMode(null)}
        onSwitchMode={m => setAuthModalMode(m)}
      />
    </header>
  );
};

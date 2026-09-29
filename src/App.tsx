import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CategoryGrid } from './components/home/CategoryGrid';
import { ProductDiscoverySections } from './components/home/ProductDiscoverySections';
import { ServicesSection } from './components/home/ServicesSection';
import { IndustriesSection } from './components/home/IndustriesSection';
import { VendorEnlistmentCTA } from './components/home/VendorEnlistmentCTA';
import { RfqBannerCTA } from './components/home/RfqBannerCTA';
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailPage } from './components/shop/ProductDetailPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { RfqBuilderPage } from './components/rfq/RfqBuilderPage';
import { CustomerOffersComparisonPage } from './components/rfq/CustomerOffersComparisonPage';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { SellerPortal } from './components/seller/SellerPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ServicesPage } from './components/pages/ServicesPage';
import { IndustriesPage } from './components/pages/IndustriesPage';
import { VendorEnlistmentPage } from './components/pages/VendorEnlistmentPage';
import { CompanyProfilePage } from './components/pages/CompanyProfilePage';
import { AboutUsPage } from './components/pages/AboutUsPage';
import { ContactUsPage } from './components/pages/ContactUsPage';
import { FloatingContactButton } from './components/common/FloatingContactButton';
import { CheckCircle2 } from 'lucide-react';
import { UserRole } from './types';

const WorkspaceGate: React.FC<{ role: UserRole; children: React.ReactNode }> = ({ role, children }) => {
  const { authLoading, isAuthenticated, currentUser, setCurrentView } = useApp();

  if (authLoading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-sm text-slate-500">Loading account…</div>;
  }

  if (!isAuthenticated) {
    return (
      <section className="min-h-[50vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#12304A]">Sign in required</h1>
          <p className="mt-2 text-sm text-slate-600">Sign in with your registered account to access this workspace.</p>
          <button onClick={() => setCurrentView('home')} className="mt-5 px-4 py-2 bg-[#12304A] text-white text-sm font-semibold rounded-sm">
            Return to home
          </button>
        </div>
      </section>
    );
  }

  if (currentUser.role !== role) {
    return (
      <section className="min-h-[50vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#12304A]">Workspace unavailable</h1>
          <p className="mt-2 text-sm text-slate-600">This area is not available to your account role.</p>
          <button onClick={() => setCurrentView('home')} className="mt-5 px-4 py-2 bg-[#12304A] text-white text-sm font-semibold rounded-sm">
            Return to home
          </button>
        </div>
      </section>
    );
  }

  if (role === 'seller' && currentUser.sellerStatus !== 'approved') {
    return (
      <section className="min-h-[50vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#12304A]">Seller application under review</h1>
          <p className="mt-2 text-sm text-slate-600">Seller workspace access is enabled after your business profile is approved.</p>
        </div>
      </section>
    );
  }

  if (role === 'customer' && currentUser.buyerStatus !== 'approved') {
    const rejected = currentUser.buyerStatus === 'rejected' || !currentUser.isActive;
    return (
      <section className="min-h-[50vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#12304A]">{rejected ? 'Account not approved' : 'Buyer account pending approval'}</h1>
          <p className="mt-2 text-sm text-slate-600">{rejected ? 'Contact the site administrator for account assistance.' : 'Your account is registered. Admin approval is required before you can submit RFQs or use the buyer workspace.'}</p>
        </div>
      </section>
    );
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { currentView, selectedRfqId, toastMessage, homepageSections, setCurrentView } = useApp();

  const renderHomepage = () => {
    const orderedSections = [...homepageSections].sort((a, b) => a.order - b.order);
    const productSectionTypes = new Set(['all_products', 'featured', 'best_sellers', 'best_rated', 'special_offers', 'category_showcase']);
    let productDiscoveryRendered = false;

    return (
      <main className="flex flex-col">
        {orderedSections.map(section => {
          if (!section.isEnabled || section.type === 'hero' || section.type === 'quick_actions') return null;

          if (productSectionTypes.has(section.type)) {
            if (productDiscoveryRendered) return null;
            productDiscoveryRendered = true;
            const productOrder = Math.min(...orderedSections
              .filter(item => item.isEnabled && productSectionTypes.has(item.type))
              .map(item => item.order));
            return <div key="product-discovery" style={{ order: productOrder }}><ProductDiscoverySections /></div>;
          }

          const sectionContent = (() => {
            switch (section.type) {
              case 'categories': return <CategoryGrid section={section} />;
              case 'services': return <ServicesSection section={section} />;
              case 'industries': return <IndustriesSection section={section} />;
              case 'vendor_enlistment': return <VendorEnlistmentCTA section={section} />;
              case 'rfq_cta': return <RfqBannerCTA section={section} />;
              case 'custom_banner': return (
                <section className="relative isolate overflow-hidden bg-[#12304A] text-white">
                  {section.imageUrl && <img src={section.imageUrl} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30" />}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                    <div className="max-w-3xl space-y-4">
                      <h2 className="text-2xl sm:text-3xl font-bold">{section.title}</h2>
                      <p className="text-sm sm:text-base text-slate-200">{section.subtitle}</p>
                      <button onClick={() => setCurrentView(section.targetView || 'shop')} className="px-5 py-3 bg-[#F28C28] hover:bg-[#d9771b] text-white text-sm font-semibold rounded-xs">
                        {section.ctaText || 'Learn more'}
                      </button>
                    </div>
                  </div>
                </section>
              );
              default: return null;
            }
          })();

          return sectionContent ? <div key={section.id} style={{ order: section.order }}>{sectionContent}</div> : null;
        })}
      </main>
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return renderHomepage();
      case 'shop':
        return <ShopPage />;
      case 'product_detail':
        return <ProductDetailPage />;
      case 'cart':
        return <CartDrawer />;
      case 'rfq_builder':
        return <RfqBuilderPage />;
      case 'customer_dashboard':
        return <WorkspaceGate role="customer">{selectedRfqId ? <CustomerOffersComparisonPage /> : <CustomerDashboard />}</WorkspaceGate>;
      case 'seller_portal':
        return <WorkspaceGate role="seller"><SellerPortal /></WorkspaceGate>;
      case 'admin_dashboard':
        return <WorkspaceGate role="admin"><AdminDashboard /></WorkspaceGate>;
      case 'services':
        return <ServicesPage />;
      case 'industries':
        return <IndustriesPage />;
      case 'vendor_enlistment':
        return <VendorEnlistmentPage />;
      case 'company_profile':
        return <CompanyProfilePage />;
      case 'about_us':
        return <AboutUsPage />;
      case 'contact':
        return <ContactUsPage />;
      default:
        return renderHomepage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-['Barlow',sans-serif] bg-[#F5F7F9] text-[#1F2933]">
      <Header />
      <div className="flex-1">
        {renderCurrentView()}
      </div>
      <Footer />

      {/* Floating contact button (bottom right corner) */}
      <FloatingContactButton />

      {/* Toast message */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#12304A] text-white text-xs font-semibold px-4 py-3 rounded-xs shadow-2xl border-l-4 border-[#F28C28] flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#F28C28] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

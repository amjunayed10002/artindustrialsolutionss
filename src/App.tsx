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

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { currentView, selectedRfqId, toastMessage } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <main>
            <ProductDiscoverySections />
            <CategoryGrid />
            <ServicesSection />
            <IndustriesSection />
            <VendorEnlistmentCTA />
            <RfqBannerCTA />
          </main>
        );
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
        return (
          <main>
            <ProductDiscoverySections />
            <CategoryGrid />
          </main>
        );
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

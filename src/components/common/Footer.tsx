import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
  Linkedin,
  Facebook,
  Youtube,
  MessageCircle,
  ExternalLink,
  Award,
  ChevronRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    setCurrentView,
    categoriesWithCounts,
    websiteSettings,
    socialMedia
  } = useApp();

  const getSocialIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'facebook':
        return <Facebook className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <footer className="bg-[#12304A] text-slate-300 border-t-4 border-[#F28C28] text-xs">
      {/* Top Value Proposition Grid */}
      <div className="border-b border-slate-700/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#1E5A85]/40 rounded-sm text-[#F28C28]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Certified Genuine Spares</h4>
              <p className="text-slate-400 mt-1 leading-relaxed">
                OEM traceable mill test certificates (MTC 3.1) and verifiable holograms for critical engineering items.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#1E5A85]/40 rounded-sm text-[#F28C28]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Multi-Seller RFQ Platform</h4>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Submit project bill of materials (BOM), compare side-by-side supplier quotations, and select the best terms.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#1E5A85]/40 rounded-sm text-[#F28C28]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">ISO 9001:2015 Compliant</h4>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Audited procurement workflows, statutory tax documentation, and corporate vendor enlistment ready.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#1E5A85]/40 rounded-sm text-[#F28C28]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Emergency Plant Turnaround</h4>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Rapid mobilization maintenance teams for scheduled cement, steel, and power plant shutdowns.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Corporate Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {websiteSettings.logoUrl ? (
                <img
                  src={websiteSettings.logoUrl}
                  alt={`${websiteSettings.siteName} logo`}
                  className="w-9 h-9 object-contain shrink-0"
                />
              ) : (
                <div className="w-9 h-9 bg-white text-[#12304A] flex items-center justify-center rounded-sm font-bold text-base border border-[#F28C28]">
                  ART
                </div>
              )}
              <div>
                <span className="block text-lg font-bold text-white tracking-tight">
                  {websiteSettings.siteName}
                </span>
                <span className="block text-[11px] text-[#F28C28] font-semibold tracking-wider uppercase">
                  {websiteSettings.tagline}
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed pr-6">
              {websiteSettings.aboutSnippet}
            </p>

            <div className="pt-2 border-t border-slate-700/60 space-y-1.5 text-[11px] text-slate-400">
              <div>Trade License: <span className="text-white font-medium">{websiteSettings.tradeLicenseNo}</span></div>
              <div>VAT / BIN: <span className="text-white font-medium">{websiteSettings.binNo}</span> | TIN: <span className="text-white font-medium">{websiteSettings.tinNo}</span></div>
              <div>DCCI Member: <span className="text-white font-medium">{websiteSettings.dcciMemberNo}</span> | IRC: <span className="text-white font-medium">{websiteSettings.ircNo}</span></div>
            </div>

            {/* Social Media Links (Dynamic from DB) */}
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs text-slate-400 mr-1">Follow Us:</span>
              {socialMedia
                .filter(s => s.isActive)
                .sort((a, b) => a.order - b.order)
                .map(item => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.platform}
                    className="w-8 h-8 rounded-sm bg-slate-800 hover:bg-[#F28C28] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                  >
                    {getSocialIcon(item.iconName)}
                  </a>
                ))}
            </div>
          </div>

          {/* Col 2: Major Categories */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
              Industrial Categories
            </h4>
            <ul className="space-y-2 text-slate-400">
              {categoriesWithCounts.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => setCurrentView('shop', { categorySlug: cat.slug })}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-[#F28C28]" />
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-500 tabular-nums">({cat.productCount})</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="text-[#F28C28] hover:text-amber-300 font-semibold pt-1 flex items-center gap-1"
                >
                  <span>View All Categories</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Engineering Services & Procurement */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
              Services & Sourcing
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setCurrentView('services')} className="hover:text-white transition-colors">
                  Plant Shutdown Maintenance
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('services')} className="hover:text-white transition-colors">
                  Laser Shaft Alignment
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('services')} className="hover:text-white transition-colors">
                  Industrial Steel Fabrication
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('industries')} className="hover:text-white transition-colors">
                  Cement & Steel Industry Spares
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('rfq_builder')} className="hover:text-[#F28C28] font-medium transition-colors">
                  Cart to RFQ Quotation
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('seller_portal')} className="hover:text-white transition-colors">
                  Seller Portal & Bid Submission
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('vendor_enlistment')} className="hover:text-white transition-colors">
                  Download Statutory Documents
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate Contact & Helpdesk */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
              Corporate Office
            </h4>
            <div className="space-y-3 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F28C28] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{websiteSettings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F28C28] shrink-0" />
                <a href={`tel:${websiteSettings.phone}`} className="hover:text-white">{websiteSettings.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F28C28] shrink-0" />
                <a href={`mailto:${websiteSettings.email}`} className="hover:text-white">{websiteSettings.email}</a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#F28C28] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight">{websiteSettings.officeHours}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60">
              <button
                onClick={() => setCurrentView('admin_dashboard')}
                className="text-[11px] text-slate-400 hover:text-[#F28C28] flex items-center gap-1 font-mono transition-colors"
              >
                <span>Admin Control Panel (RBAC)</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Disclaimer */}
      <div className="border-t border-slate-800 bg-[#0C2235] py-4 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} ART Industrial Solutions (artindustrialsolutions.com). All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setCurrentView('company_profile')} className="hover:text-white">Legal & Compliance</button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button onClick={() => setCurrentView('vendor_enlistment')} className="hover:text-white">Vendor Downloads</button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button onClick={() => setCurrentView('about_us')} className="hover:text-white">About Us</button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button onClick={() => setCurrentView('contact')} className="hover:text-white">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

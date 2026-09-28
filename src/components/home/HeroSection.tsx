import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Phone,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Truck,
  Building
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setCurrentView, websiteSettings, categoriesWithCounts } = useApp();

  return (
    <section className="relative bg-[#12304A] text-white overflow-hidden">
      {/* Background Graphic & Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
        <img
          src="/images/hero-industrial-facility.jpg"
          alt="Industrial Manufacturing Facility"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <div className="max-w-3xl space-y-6">
          
          {/* Trust Kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#F28C28]">
            <span className="w-2 h-2 rounded-full bg-[#F28C28]"></span>
            <span>Industrial Procurement & Engineering Contracting</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Your Trusted Industrial Supply Partner
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Procure certified bearings, welding consumables, PPE safety gear, valves, and mechanical spares. 
            Submit multi-item RFQs to pre-qualified suppliers and schedule turnkey plant shutdown engineering services across Bangladesh.
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('rfq_builder')}
              className="px-6 py-3.5 bg-[#F28C28] hover:bg-[#d9771b] text-white font-bold text-sm rounded-xs transition-colors shadow-md flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Request for Quotation (RFQ)</span>
            </button>

            <button
              onClick={() => setCurrentView('shop')}
              className="px-6 py-3.5 bg-[#1E5A85] hover:bg-[#164363] text-white font-semibold text-sm rounded-xs transition-colors flex items-center gap-2"
            >
              <span>Browse Products Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`tel:${websiteSettings.phone}`}
              className="px-4 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xs border border-white/20 transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#F28C28]" />
              <span className="hidden sm:inline">Call Now:</span>
              <span>{websiteSettings.phone}</span>
            </a>

            <a
              href={`https://wa.me/${websiteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3.5 bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold text-sm rounded-xs transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Desk</span>
            </a>
          </div>

          {/* Trust Pillars */}
          <div className="pt-6 border-t border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#F28C28] shrink-0" />
              <span>100% Genuine OEM Spares</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#F28C28] shrink-0" />
              <span>Ex-Stock Ready Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F28C28] shrink-0" />
              <span>Multi-Seller Price Compare</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#F28C28] shrink-0" />
              <span>Enlisted Corporate Vendor</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

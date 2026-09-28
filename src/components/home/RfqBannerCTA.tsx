import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, ArrowRight, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';

export const RfqBannerCTA: React.FC = () => {
  const { setCurrentView, cartCount, cartToRfq } = useApp();

  return (
    <section className="py-14 bg-[#12304A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#1E5A85]/40 border border-[#1E5A85] rounded-xs p-6 lg:p-10 relative overflow-hidden shadow-xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#F28C28] uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Seamless Procurement Workflow</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                Streamline Your Industrial Sourcing with Cart-to-RFQ
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Add required mechanical spares, bearings, and welding consumables to your cart, then generate a project RFQ with a single click. 
                Approved sellers submit transparent quotations for you to compare side-by-side.
              </p>

              {/* Step indicator */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#F28C28] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                  <span>Add items to Cart</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1E5A85] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                  <span>1-Click RFQ Convert</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1E5A85] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                  <span>Compare Seller Quotes</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">4</span>
                  <span>Confirm PO Order</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              {cartCount > 0 ? (
                <button
                  onClick={cartToRfq}
                  className="w-full py-4 px-6 bg-[#F28C28] hover:bg-[#d9771b] text-white font-bold text-sm rounded-xs transition-colors shadow-lg flex items-center justify-center gap-2 text-center"
                >
                  <FileText className="w-5 h-5" />
                  <span>Request RFQ from Current Cart ({cartCount} Items)</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('rfq_builder')}
                  className="w-full py-4 px-6 bg-[#F28C28] hover:bg-[#d9771b] text-white font-bold text-sm rounded-xs transition-colors shadow-lg flex items-center justify-center gap-2 text-center"
                >
                  <FileText className="w-5 h-5" />
                  <span>Start New Project RFQ</span>
                </button>
              )}

              <button
                onClick={() => setCurrentView('seller_portal')}
                className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-xs rounded-xs transition-colors flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4 text-[#F28C28]" />
                <span>Are you a registered supplier? View Open RFQs</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

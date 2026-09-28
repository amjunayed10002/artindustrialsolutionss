import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wrench, CheckCircle2, ArrowRight, ShieldCheck, Phone, FileText } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, selectedServiceId, setCurrentView, websiteSettings } = useApp();

  return (
    <div className="bg-[#F5F7F9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs p-8 mb-8 shadow-xs">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F28C28] uppercase tracking-wider mb-2">
              <Wrench className="w-4 h-4" />
              <span>Certified Engineering Contracting</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#12304A] leading-tight">
              Industrial Engineering & Maintenance Services
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              ART Industrial Solutions operates a specialized mechanical engineering division delivering precision machinery alignment, rapid turnaround shutdown maintenance, and heavy steel fabrication across industrial facilities in Bangladesh.
            </p>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-8">
          {services
            .filter(s => s.isActive)
            .sort((a, b) => a.order - b.order)
            .map((service, idx) => (
              <div
                key={service.id}
                id={service.slug}
                className="bg-white border border-[#E2E8F0] rounded-xs p-6 lg:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-5 aspect-16/10 rounded-xs overflow-hidden bg-slate-200">
                  <img
                    src={service.image}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#F28C28]">
                      0{idx + 1}. DIVISION
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                      ISO 9001:2015 Protocol
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-[#12304A]">
                    {service.title}
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.fullDescription}
                  </p>

                  <div className="pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Key Engineering Capabilities:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800">
                      {service.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1E5A85] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => setCurrentView('contact')}
                      className="px-5 py-2.5 bg-[#12304A] hover:bg-[#1E5A85] text-white text-xs font-bold rounded-xs transition-colors flex items-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#F28C28]" />
                      <span>Request Engineering Site Audit</span>
                    </button>
                    <button
                      onClick={() => setCurrentView('rfq_builder')}
                      className="px-5 py-2.5 bg-[#F5F7F9] hover:bg-slate-200 border border-[#E2E8F0] text-[#12304A] text-xs font-bold rounded-xs transition-colors flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#F28C28]" />
                      <span>Submit Turnaround RFQ</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

      </div>
    </div>
  );
};

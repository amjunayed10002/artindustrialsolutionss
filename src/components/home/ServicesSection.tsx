import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wrench, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { services, setCurrentView } = useApp();

  return (
    <section className="py-14 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E5A85] uppercase tracking-wider mb-1">
              <Wrench className="w-4 h-4 text-[#F28C28]" />
              <span>Plant Operations & Contracting</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A]">
              Industrial Engineering Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Turnkey mechanical overhauls, planned factory turnaround, laser shaft alignment, and heavy structural steel fabrication.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('services')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5A85] hover:text-[#12304A] transition-colors self-start sm:self-auto"
          >
            <span>View All Engineering Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services
            .filter(s => s.isActive)
            .sort((a, b) => a.order - b.order)
            .map(service => (
              <div
                key={service.id}
                className="bg-[#F5F7F9] hover:bg-white border border-[#E2E8F0] hover:border-[#1E5A85] rounded-xs overflow-hidden transition-all duration-200 flex flex-col justify-between hover:shadow-lg group"
              >
                <div>
                  {/* Service Image Banner */}
                  <div className="relative aspect-16/9 overflow-hidden bg-slate-200">
                    <img
                      src={service.image}
                      alt={service.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
                    <h3 className="absolute bottom-3 left-4 right-4 font-bold text-base text-white tracking-wide">
                      {service.title}
                    </h3>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {service.shortDescription}
                    </p>

                    {/* Features list */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                      {service.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#F28C28] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => setCurrentView('services', { serviceId: service.id })}
                    className="w-full py-2 bg-white group-hover:bg-[#12304A] group-hover:text-white border border-[#E2E8F0] text-[#12304A] text-xs font-semibold rounded-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Service Scope & Case Studies</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>

      </div>
    </section>
  );
};

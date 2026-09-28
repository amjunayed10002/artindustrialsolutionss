import React from 'react';
import { useApp } from '../../context/AppContext';
import { Factory, ArrowRight } from 'lucide-react';

export const IndustriesSection: React.FC = () => {
  const { industries, setCurrentView } = useApp();

  return (
    <section className="py-14 bg-[#F5F7F9] border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200/80 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E5A85] uppercase tracking-wider mb-1">
              <Factory className="w-4 h-4 text-[#F28C28]" />
              <span>Cross-Sector Reliability</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A]">
              Industries We Serve
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Proven procurement solutions, fast breakdown dispatch, and certified spares across 12 heavy industrial sectors in Bangladesh.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('industries')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5A85] hover:text-[#12304A] transition-colors self-start sm:self-auto"
          >
            <span>Explore All Industrial Sectors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {industries
            .filter(i => i.isActive)
            .sort((a, b) => a.order - b.order)
            .map(industry => (
              <div
                key={industry.id}
                onClick={() => setCurrentView('industries')}
                className="group relative bg-white border border-[#E2E8F0] hover:border-[#1E5A85] rounded-xs overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col"
              >
                <div className="aspect-4/3 relative overflow-hidden bg-slate-100">
                  <img
                    src={industry.image}
                    alt={industry.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#12304A]/90 via-[#12304A]/30 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-white font-bold text-xs sm:text-sm block tracking-wide">
                      {industry.name}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {industry.description}
                  </p>
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#1E5A85] font-semibold">
                    <span>Target Spares</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            ))}
        </div>

      </div>
    </section>
  );
};

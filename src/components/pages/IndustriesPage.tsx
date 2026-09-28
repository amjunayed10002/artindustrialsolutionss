import React from 'react';
import { useApp } from '../../context/AppContext';
import { Factory, ArrowRight, CheckCircle2 } from 'lucide-react';

export const IndustriesPage: React.FC = () => {
  const { industries, setCurrentView } = useApp();

  return (
    <div className="bg-[#F5F7F9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs p-8 mb-8 shadow-xs">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F28C28] uppercase tracking-wider mb-2">
              <Factory className="w-4 h-4" />
              <span>Heavy Industry Sectors</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#12304A] leading-tight">
              Industries We Serve
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              From heavy cement kilns and steel rolling stands to continuous chemical plants, ART Industrial Solutions provides specialized mechanical components, emergency supply, and scheduled maintenance.
            </p>
          </div>
        </div>

        {/* 12 Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries
            .filter(i => i.isActive)
            .sort((a, b) => a.order - b.order)
            .map(industry => (
              <div
                key={industry.id}
                className="bg-white border border-[#E2E8F0] rounded-xs overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/9 relative overflow-hidden bg-slate-100">
                    <img
                      src={industry.image}
                      alt={industry.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#12304A]/80 via-transparent to-transparent"></div>
                    <h3 className="absolute bottom-3 left-4 text-white font-bold text-lg">
                      {industry.name} Industry
                    </h3>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {industry.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => setCurrentView('shop')}
                    className="w-full py-2 bg-[#F5F7F9] hover:bg-[#12304A] hover:text-white border border-[#E2E8F0] text-[#12304A] text-xs font-bold rounded-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Browse Spares for {industry.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F28C28]" />
                  </button>
                </div>
              </div>
            ))}
        </div>

      </div>
    </div>
  );
};

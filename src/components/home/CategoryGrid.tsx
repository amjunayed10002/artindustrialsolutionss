import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Layers } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { categoriesWithCounts, setCurrentView } = useApp();

  return (
    <section className="py-12 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E5A85] uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4 text-[#F28C28]" />
              <span>Heavy Industry Sourcing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A]">
              Industrial Product Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Browse 13+ specialized industrial divisions with live database stock quantities and direct quotation access.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('shop')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5A85] hover:text-[#12304A] transition-colors self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid (13 Categories) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
          {categoriesWithCounts
            .filter(c => c.isActive)
            .sort((a, b) => a.order - b.order)
            .map(category => (
              <div
                key={category.id}
                onClick={() => setCurrentView('shop', { categorySlug: category.slug })}
                className="group bg-[#F5F7F9] hover:bg-white border border-[#E2E8F0] hover:border-[#1E5A85] rounded-xs p-3 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md"
              >
                <div>
                  {/* Category Image */}
                  <div className="aspect-square bg-white rounded-xs mb-3 overflow-hidden p-2 flex items-center justify-center border border-slate-200/70">
                    <img
                      src={category.image}
                      alt={category.name}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/category-bearings.jpg';
                      }}
                    />
                  </div>

                  {/* Category Name */}
                  <h3 className="font-semibold text-xs sm:text-sm text-[#1F2933] group-hover:text-[#1E5A85] line-clamp-1 transition-colors">
                    {category.name}
                  </h3>
                </div>

                {/* Dynamically Computed Count from DB */}
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-slate-500 tabular-nums">
                    {category.productCount} {category.productCount === 1 ? 'Product' : 'Products'}
                  </span>
                  <span className="text-[#F28C28] font-bold group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
              </div>
            ))}
        </div>

      </div>
    </section>
  );
};

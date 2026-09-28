import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';
import { HomepageSectionConfig } from '../../types';

export const VendorEnlistmentCTA: React.FC<{ section?: HomepageSectionConfig }> = ({ section }) => {
  const { vendorDocuments, downloadDocument, setCurrentView } = useApp();

  return (
    <section className="py-14 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E5A85] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-[#F28C28]" />
              <span>Corporate Pre-Qualification & Tenders</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A]">
              {section?.title || 'Vendor Enlistment & Statutory Credentials'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {section?.subtitle || 'Procurement departments can immediately download audited statutory tax certificates, Trade License, and capability statements.'}
            </p>
          </div>

          <button
            onClick={() => setCurrentView('vendor_enlistment')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5A85] hover:text-[#12304A] transition-colors self-start sm:self-auto"
          >
            <span>All Enlistment Files</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendorDocuments
            .filter(d => d.isActive)
            .slice(0, 6)
            .map(doc => (
              <div
                key={doc.id}
                className="bg-[#F5F7F9] hover:bg-white border border-[#E2E8F0] hover:border-[#1E5A85] rounded-xs p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                    <span className="font-semibold text-[#1E5A85] uppercase tracking-wider">{doc.category}</span>
                    <span className="tabular-nums font-mono">{doc.fileSize} · {doc.fileType}</span>
                  </div>

                  <h3 className="font-semibold text-sm text-[#1F2933] mb-1.5">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified {doc.updatedAt}</span>
                  </span>

                  <button
                    onClick={() => downloadDocument(doc)}
                    className="px-3 py-1.5 bg-[#12304A] hover:bg-[#1E5A85] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 shadow-xs"
                    title={`Download official ${doc.title}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </button>
                </div>
              </div>
            ))}
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Download,
  FileText,
  CheckCircle2,
  Building,
  Award,
  Phone,
  Mail
} from 'lucide-react';

export const VendorEnlistmentPage: React.FC = () => {
  const { vendorDocuments, downloadDocument, websiteSettings } = useApp();

  return (
    <div className="bg-[#F5F7F9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs p-8 mb-8 shadow-xs">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F28C28] uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Corporate Procurement Pre-Qualification</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#12304A] leading-tight">
              Vendor Enlistment & Statutory Documentation
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Procurement teams and supply chain departments can immediately download audited statutory tax certificates, Trade License, ISO certification, and our comprehensive industrial equipment catalog.
            </p>
          </div>
        </div>

        {/* Corporate Tax Identifiers Grid */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 mb-8 shadow-xs">
          <h3 className="text-sm font-bold text-[#12304A] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            Verified Statutory Identifiers & Registrations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-[#F5F7F9] rounded-xs border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Trade License</span>
              <span className="font-mono font-bold text-slate-900 block mt-0.5">{websiteSettings.tradeLicenseNo}</span>
              <span className="text-[11px] text-slate-500">Dhaka North City Corporation</span>
            </div>
            <div className="p-3 bg-[#F5F7F9] rounded-xs border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">VAT / BIN Registration</span>
              <span className="font-mono font-bold text-slate-900 block mt-0.5">{websiteSettings.binNo}</span>
              <span className="text-[11px] text-slate-500">Large Taxpayers Unit (LTU-VAT)</span>
            </div>
            <div className="p-3 bg-[#F5F7F9] rounded-xs border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">TIN Tax Identification</span>
              <span className="font-mono font-bold text-slate-900 block mt-0.5">{websiteSettings.tinNo}</span>
              <span className="text-[11px] text-slate-500">National Board of Revenue</span>
            </div>
            <div className="p-3 bg-[#F5F7F9] rounded-xs border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Chamber Membership</span>
              <span className="font-mono font-bold text-slate-900 block mt-0.5">{websiteSettings.dcciMemberNo}</span>
              <span className="text-[11px] text-slate-500">Dhaka Chamber of Commerce (DCCI)</span>
            </div>
          </div>
        </div>

        {/* Real Downloadable Documents List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#12304A]">
              Official Downloadable Enlistment Dossier
            </h2>
            <span className="text-xs text-slate-500">Click download to obtain the official document</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendorDocuments
              .filter(d => d.isActive)
              .map(doc => (
                <div
                  key={doc.id}
                  className="bg-white border border-[#E2E8F0] hover:border-[#1E5A85] rounded-xs p-5 shadow-xs flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                      <span className="font-bold text-[#1E5A85] uppercase tracking-wider">{doc.category}</span>
                      <span className="font-mono tabular-nums">{doc.fileSize} · {doc.fileType}</span>
                    </div>

                    <h3 className="font-bold text-sm text-[#12304A] mb-1.5">{doc.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{doc.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Certified Active (Updated {doc.updatedAt})</span>
                    </span>

                    <button
                      onClick={() => downloadDocument(doc)}
                      className="px-4 py-2 bg-[#12304A] hover:bg-[#1E5A85] text-white text-xs font-semibold rounded-xs transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download File</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Procurement Liaison Support */}
        <div className="mt-12 bg-white border border-[#E2E8F0] rounded-xs p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-[#12304A]">Require Specific Pre-Qualification Forms?</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Our corporate legal desk can execute vendor enlistment questionnaires and NDAs within 24 hours.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href={`tel:${websiteSettings.phone}`}
              className="px-4 py-2 bg-[#F5F7F9] hover:bg-slate-200 border border-slate-300 font-semibold text-slate-800 rounded-xs flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>{websiteSettings.phone}</span>
            </a>
            <a
              href={`mailto:${websiteSettings.email}`}
              className="px-4 py-2 bg-[#12304A] text-white font-semibold rounded-xs flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Email Procurement Desk</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

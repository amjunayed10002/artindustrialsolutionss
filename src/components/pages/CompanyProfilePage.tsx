import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, ShieldCheck, CheckCircle2, Award, Landmark, Phone, Mail, ArrowRight } from 'lucide-react';

export const CompanyProfilePage: React.FC = () => {
  const { websiteSettings, setCurrentView } = useApp();

  return (
    <div className="bg-[#F5F7F9] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs p-8 mb-8 shadow-xs">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F28C28] uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              <span>Corporate Overview & Compliance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#12304A] leading-tight">
              Company Profile & Statutory Credentials
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Official corporate credentials, chamber memberships, banking solvency, and tax registrations of ART Industrial Solutions for corporate procurement teams and institutional tenders.
            </p>
          </div>
        </div>

        {/* Corporate Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-[#12304A] border-b border-slate-100 pb-2">
                Executive Overview
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                ART Industrial Solutions (artindustrialsolutions.com) is a registered commercial supplier and mechanical engineering service provider based in Tejgaon Industrial Area, Dhaka. Operating as a consolidated industrial marketplace and procurement contractor, we bridge high-demand manufacturing industries—including cement, steel, power, gas, textile, and pharmaceuticals—with certified European, American, and Japanese OEMs.
              </p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Our multi-seller procurement platform allows corporate clients to submit unified Bill of Materials (BOM) requests, compare verified competitive offers, and execute verified purchase orders under transparent commercial governance.
              </p>
            </div>

            {/* Statutory Compliance Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-[#12304A] border-b border-slate-100 pb-2">
                Statutory Identifiers & Legal Registration
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-200">
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-slate-50">
                      <th className="py-2.5 px-4 font-bold text-slate-700 w-1/3">Registered Legal Entity</th>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{websiteSettings.siteName}</td>
                    </tr>
                    <tr>
                      <th className="py-2.5 px-4 font-bold text-slate-700">Official Web Domain</th>
                      <td className="py-2.5 px-4 font-mono text-[#1E5A85]">{websiteSettings.domain}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <th className="py-2.5 px-4 font-bold text-slate-700">Trade License Number</th>
                      <td className="py-2.5 px-4 font-mono font-semibold text-slate-900">{websiteSettings.tradeLicenseNo}</td>
                    </tr>
                    <tr>
                      <th className="py-2.5 px-4 font-bold text-slate-700">VAT / BIN Registration (13-Digit)</th>
                      <td className="py-2.5 px-4 font-mono font-semibold text-slate-900">{websiteSettings.binNo}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <th className="py-2.5 px-4 font-bold text-slate-700">e-TIN Taxpayer Identification</th>
                      <td className="py-2.5 px-4 font-mono font-semibold text-slate-900">{websiteSettings.tinNo}</td>
                    </tr>
                    <tr>
                      <th className="py-2.5 px-4 font-bold text-slate-700">Import Registration Certificate (IRC)</th>
                      <td className="py-2.5 px-4 font-mono text-slate-900">{websiteSettings.ircNo}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <th className="py-2.5 px-4 font-bold text-slate-700">Export Registration Certificate (ERC)</th>
                      <td className="py-2.5 px-4 font-mono text-slate-900">{websiteSettings.ercNo}</td>
                    </tr>
                    <tr>
                      <th className="py-2.5 px-4 font-bold text-slate-700">Chamber of Commerce Membership</th>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{websiteSettings.dcciMemberNo}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <th className="py-2.5 px-4 font-bold text-slate-700">Corporate Banking Solvency</th>
                      <td className="py-2.5 px-4 text-slate-900 font-medium">{websiteSettings.bankSolvency}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column Highlights */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#12304A] text-white p-6 rounded-xs shadow-md space-y-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#F28C28]" />
                <span>Banking & Credit Reliability</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                ART Industrial Solutions maintains prime corporate borrowing and Letter of Credit (LC) issuance facilities with leading Tier-1 commercial banks in Bangladesh, ensuring seamless international procurement of heavy capital spares.
              </p>
              <div className="pt-2 border-t border-slate-700 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F28C28]" />
                  <span>Standard Chartered Bank Bangladesh</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F28C28]" />
                  <span>The City Bank Ltd (Prime Corporate)</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] p-6 rounded-xs shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#12304A]">
                Need Tender Dossier?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download the complete verified company profile, ISO audit report, and tax certificates from our dedicated Vendor Enlistment desk.
              </p>
              <button
                onClick={() => setCurrentView('vendor_enlistment')}
                className="w-full py-2.5 bg-[#F28C28] hover:bg-[#d9771b] text-white text-xs font-bold rounded-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Vendor Enlistment Downloads</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

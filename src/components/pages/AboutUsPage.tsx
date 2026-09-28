import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Target, Eye, Award, CheckCircle2, Building, Wrench } from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="bg-[#F5F7F9] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs p-8 mb-8 shadow-xs">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F28C28] uppercase tracking-wider mb-2">
              <Building className="w-4 h-4" />
              <span>About ART Industrial Solutions</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#12304A] leading-tight">
              Engineering Excellence, Reliability & Sourcing Integrity
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Founded to eliminate counterfeit risks and supply chain bottlenecks in Bangladesh’s heavy manufacturing sector, ART Industrial Solutions stands as a trusted bridge between global industrial innovators and national production facilities.
            </p>
          </div>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xs bg-[#1E5A85]/10 text-[#1E5A85] flex items-center justify-center">
              <Target className="w-5 h-5 text-[#F28C28]" />
            </div>
            <h3 className="text-xl font-bold text-[#12304A]">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To supply 100% verifiable, certified industrial equipment, bearings, valves, and welding consumables at transparent commercial rates, accompanied by expert engineering maintenance crews that guarantee minimal unscheduled plant downtime.
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xs bg-[#1E5A85]/10 text-[#1E5A85] flex items-center justify-center">
              <Eye className="w-5 h-5 text-[#1E5A85]" />
            </div>
            <h3 className="text-xl font-bold text-[#12304A]">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To be Bangladesh’s most reputable industrial supply marketplace and engineering services powerhouse, known by plant managers and procurement heads as the benchmark of reliability, technical precision, and commercial honesty.
            </p>
          </div>
        </div>

        {/* Company History & Core Values */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs p-8 mb-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#12304A] mb-3">Company History</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
              Established with an initial focus on mechanical power transmission components and specialized rotary bearings in Dhaka’s historic commercial hub, ART Industrial Solutions rapidly expanded into an integrated procurement and engineering platform. Over the past decade, we established direct supply partnerships with European and Asian manufacturers, including SKF, ESAB, KITZ, and Siemens.
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              In 2024, our proprietary Multi-Seller RFQ procurement network was launched to give large industrial groups—such as cement mills, steel re-rolling plants, and gas transmission stations—the power to solicit competitive bids from vetted stockists while ensuring full traceability and ISO 9001:2015 compliance.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-lg font-bold text-[#12304A] mb-4">Core Values</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#F5F7F9] rounded-xs border border-slate-200">
                <span className="font-bold text-sm text-[#12304A] block mb-1">Authenticity & Traceability</span>
                <p className="text-slate-600">Zero tolerance for counterfeit components. Every bearing, valve, and electrode comes with verifiable mill test certs.</p>
              </div>
              <div className="p-4 bg-[#F5F7F9] rounded-xs border border-slate-200">
                <span className="font-bold text-sm text-[#12304A] block mb-1">Downtime Minimization</span>
                <p className="text-slate-600">We understand that an hour of factory stoppage costs millions. Our emergency response team operates 24/7 during shutdowns.</p>
              </div>
              <div className="p-4 bg-[#F5F7F9] rounded-xs border border-slate-200">
                <span className="font-bold text-sm text-[#12304A] block mb-1">Commercial Transparency</span>
                <p className="text-slate-600">Fair, competitive bidding and transparent B2B pricing with complete statutory tax documentation on every transaction.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Managing Proprietor Message */}
        <div className="bg-[#12304A] text-white rounded-xs p-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#F28C28]">
                Executive Leadership
              </div>
              <h2 className="text-2xl font-bold">Managing Proprietor Message</h2>
              <blockquote className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                "Modern heavy industries cannot compromise on the integrity of their critical rotary assemblies or high-pressure steam lines. At ART Industrial Solutions, our promise to every plant engineer and procurement director is unwavering: genuine parts, technical precision, and commercial honor. Whether you require a single critical bearing or a complete 500-man turnkey plant turnaround, our team delivers with unmatched rigor."
              </blockquote>
              <div className="pt-2">
                <span className="font-bold text-white block">Engr. M. A. Rahman</span>
                <span className="text-xs text-slate-400">Managing Proprietor & Chartered Mechanical Engineer</span>
              </div>
            </div>

            <div className="md:col-span-4 text-center md:text-right border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6">
              <div className="p-4 bg-white/5 rounded-xs border border-white/10 space-y-2 text-left">
                <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider block">Why Choose ART?</span>
                <div className="text-xs text-slate-300 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F28C28]" />
                    <span>Multi-seller price transparency</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F28C28]" />
                    <span>In-house engineering crews</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F28C28]" />
                    <span>100% Tax compliant & enlisted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

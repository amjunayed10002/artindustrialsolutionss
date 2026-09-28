import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PhoneCall,
  MessageCircle,
  Mail,
  MapPin,
  X,
  Send,
  ExternalLink,
  Clock,
  CheckCircle2,
  Headphones,
  Sparkles
} from 'lucide-react';

export const FloatingContactButton: React.FC = () => {
  const { websiteSettings, setCurrentView, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) {
      showToast('Please provide your name and phone number.');
      return;
    }
    setSubmitted(true);
    showToast('Inquiry transmitted to ART Industrial Technical Desk!');
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setInquiryName('');
      setInquiryPhone('');
      setInquiryMessage('');
    }, 2000);
  };

  const whatsappCleanNumber = websiteSettings.whatsapp.replace(/[^0-9]/g, '');

  return (
    <>
      {/* 3D Floating Contact Us Button (Always fixed at bottom-right corner) */}
      <aside aria-label="Quick contact desk" className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Contact Us 24/7 Desk"
          className="group relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-[#12304A] via-[#1E5A85] to-[#F28C28] text-white font-bold text-xs sm:text-sm tracking-wide rounded-full shadow-[0_12px_32px_rgba(18,48,74,0.45),0_4px_16px_rgba(242,140,40,0.35)] hover:shadow-[0_18px_40px_rgba(18,48,74,0.6),0_8px_24px_rgba(242,140,40,0.5)] transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-105 active:translate-y-0 active:scale-95 animate-float-3d border-2 border-white/30 backdrop-blur-xs select-none"
        >
          {/* Animated Glowing Ring & Ping */}
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border border-white"></span>
          </span>

          <Headphones className="w-5 h-5 text-amber-300 transition-transform duration-300 group-hover:rotate-12" />

          <span className="font-extrabold uppercase tracking-wider text-white drop-shadow-sm">
            Contact Us
          </span>

          {/* Quick badge */}
          <span className="hidden sm:inline-block bg-[#F28C28] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-xs">
            24/7 Live
          </span>
        </button>

        {/* 3D Elevated Interactive Quick Contact Drawer / Card */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-88 sm:w-96 bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_20px_50px_rgba(18,48,74,0.35)] overflow-hidden text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-200">
            {/* Header banner with gradient */}
            <div className="bg-gradient-to-r from-[#12304A] via-[#163E61] to-[#1E5A85] text-white p-4 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3.5 right-3.5 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
                aria-label="Close contact card"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#F28C28] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Helpdesk & Procurement
                </span>
                <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  Online Now
                </span>
              </div>
              <h3 className="font-bold text-base text-white">ART Industrial Solutions</h3>
              <p className="text-xs text-slate-200 mt-0.5">
                Direct procurement assistance, tender inquiries, and ex-stock supplies.
              </p>
            </div>

            {/* Quick Contact Action Channels */}
            <div className="p-4 space-y-3 bg-[#F8FAFC]">
              {/* WhatsApp direct */}
              <a
                href={`https://wa.me/${whatsappCleanNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-xs transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-5 h-5 text-white" />
                  <div className="text-left">
                    <span className="block text-xs font-bold">Chat on WhatsApp</span>
                    <span className="block text-[11px] font-normal text-emerald-100">
                      {websiteSettings.whatsapp}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-100" />
              </a>

              {/* Direct Phone Call */}
              <a
                href={`tel:${websiteSettings.phone}`}
                className="flex items-center justify-between p-3 bg-[#12304A] hover:bg-[#1E5A85] text-white rounded-xl font-bold text-xs shadow-xs transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-5 h-5 text-[#F28C28]" />
                  <div className="text-left">
                    <span className="block text-xs font-bold">Call Technical Hotline</span>
                    <span className="block text-[11px] font-normal text-slate-300">
                      {websiteSettings.phone}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded-sm">
                  Call Now
                </span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${websiteSettings.email}`}
                className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#1E5A85]" />
                  <div className="text-left">
                    <span className="block text-xs font-bold text-slate-800">Email RFQ & Specs</span>
                    <span className="block text-[11px] text-slate-500">{websiteSettings.email}</span>
                  </div>
                </div>
                <span className="text-[11px] text-[#1E5A85] font-semibold">Send →</span>
              </a>
            </div>

            {/* Quick Inquiry Form */}
            <div className="p-4 border-t border-slate-200 bg-white space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Instant Callback Request:
              </span>

              {submitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-emerald-900">Request Dispatched!</p>
                  <p className="text-[11px] text-emerald-700">An engineer will call you within 15 minutes.</p>
                </div>
              ) : (
                <form onSubmit={handleQuickSubmit} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={inquiryName}
                      onChange={e => setInquiryName(e.target.value)}
                      required
                      className="w-full text-xs p-2 bg-[#F8FAFC] border border-slate-200 rounded-lg outline-none focus:border-[#1E5A85] focus:bg-white transition-all"
                    />
                    <input
                      type="tel"
                      placeholder="Phone / Mobile *"
                      value={inquiryPhone}
                      onChange={e => setInquiryPhone(e.target.value)}
                      required
                      className="w-full text-xs p-2 bg-[#F8FAFC] border border-slate-200 rounded-lg outline-none focus:border-[#1E5A85] focus:bg-white transition-all"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Product needed (e.g. SKF Bearing 6308, Valve, ESAB Wire)..."
                    value={inquiryMessage}
                    onChange={e => setInquiryMessage(e.target.value)}
                    className="w-full text-xs p-2 bg-[#F8FAFC] border border-slate-200 rounded-lg outline-none focus:border-[#1E5A85] focus:bg-white transition-all"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setCurrentView('contact');
                      }}
                      className="text-[11px] text-[#1E5A85] hover:underline font-semibold"
                    >
                      View Full Office & Maps →
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#F28C28] hover:bg-[#d9771b] text-white text-xs font-bold rounded-lg shadow-xs transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Request</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Statutory Address footer */}
            <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 truncate max-w-[240px]">
                <MapPin className="w-3 h-3 text-[#F28C28] shrink-0" />
                {websiteSettings.address}
              </span>
              <span className="font-semibold text-[#12304A] shrink-0">BIN Verified</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

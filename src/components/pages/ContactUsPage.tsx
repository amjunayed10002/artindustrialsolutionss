import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  Building
} from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const { websiteSettings, submitContactForm } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactForm(formData);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="bg-[#F5F7F9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs p-8 mb-8 shadow-xs">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F28C28] uppercase tracking-wider mb-2">
              <Building className="w-4 h-4" />
              <span>Direct Commercial & Engineering Desk</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#12304A] leading-tight">
              Contact ART Industrial Solutions
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Have an urgent emergency shutdown maintenance requirement, tender query, or bulk industrial supply Bill of Materials? Connect with our corporate engineering desk.
            </p>
          </div>
        </div>

        {/* Contact Information & Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-[#12304A] border-b border-slate-100 pb-2">
                Corporate Headquarters
              </h3>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#12304A]/10 text-[#12304A] rounded-xs shrink-0">
                    <MapPin className="w-4 h-4 text-[#F28C28]" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-sm">Central Operations Office:</strong>
                    <span className="leading-relaxed text-slate-600 mt-0.5 block">{websiteSettings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#12304A]/10 text-[#12304A] rounded-xs shrink-0">
                    <Phone className="w-4 h-4 text-[#F28C28]" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-sm">Telephone & Hotline:</strong>
                    <a href={`tel:${websiteSettings.phone}`} className="text-[#1E5A85] hover:underline block">{websiteSettings.phone}</a>
                    <a href={`tel:${websiteSettings.mobile}`} className="text-slate-600 hover:underline block">{websiteSettings.mobile}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#12304A]/10 text-[#12304A] rounded-xs shrink-0">
                    <MessageCircle className="w-4 h-4 text-[#F28C28]" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-sm">Direct WhatsApp Helpdesk:</strong>
                    <a
                      href={`https://wa.me/${websiteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-semibold hover:underline block"
                    >
                      {websiteSettings.whatsapp} (24/7 Breakdown Response)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#12304A]/10 text-[#12304A] rounded-xs shrink-0">
                    <Mail className="w-4 h-4 text-[#F28C28]" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-sm">Official Commercial Email:</strong>
                    <a href={`mailto:${websiteSettings.email}`} className="text-[#1E5A85] hover:underline block">{websiteSettings.email}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#12304A]/10 text-[#12304A] rounded-xs shrink-0">
                    <Clock className="w-4 h-4 text-[#F28C28]" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-sm">Business Hours:</strong>
                    <span className="text-slate-600 block mt-0.5">{websiteSettings.officeHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency note */}
            <div className="p-4 bg-[#12304A] text-white rounded-xs space-y-1.5 text-xs">
              <span className="font-bold text-[#F28C28] uppercase text-[11px] block tracking-wider">
                Emergency Factory Breakdown?
              </span>
              <p className="text-slate-300 leading-relaxed">
                Our plant shutdown and mechanical breakdown mobilization team responds to urgent SMS & WhatsApp calls at all hours.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 lg:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-[#12304A] mb-1">
                Send an Official Commercial Inquiry
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                All communications are recorded directly in our procurement dispatch database.
              </p>

              {isSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-xs text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-base text-emerald-900">Inquiry Received Successfully</h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Thank you. Your request has been assigned to our senior procurement engineering desk. We will respond via phone and email within 2-4 business hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-3 px-4 py-2 bg-emerald-700 text-white font-semibold text-xs rounded-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Engr. Tanvir Ahmed"
                        className="w-full p-2.5 border border-slate-300 rounded-xs outline-none focus:border-[#1E5A85]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Corporate Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. tanvir@factory.com"
                        className="w-full p-2.5 border border-slate-300 rounded-xs outline-none focus:border-[#1E5A85]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Phone / Mobile Number *</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+880 1..."
                        className="w-full p-2.5 border border-slate-300 rounded-xs outline-none focus:border-[#1E5A85]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Company / Factory Name</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Meghna Cement Mills Ltd"
                        className="w-full p-2.5 border border-slate-300 rounded-xs outline-none focus:border-[#1E5A85]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Inquiry Subject *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Urgent Bearings & Valves Sourcing for Plant Shutdown"
                      className="w-full p-2.5 border border-slate-300 rounded-xs outline-none focus:border-[#1E5A85]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Detailed Message / Scope of Supply *</label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Specify part numbers, quantities, target delivery dates, or engineering service scopes..."
                      className="w-full p-2.5 border border-slate-300 rounded-xs outline-none focus:border-[#1E5A85]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-[#12304A] hover:bg-[#1E5A85] text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Send className="w-4 h-4 text-[#F28C28]" />
                    <span>Submit Inquiry to Engineering Desk</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Map Location Section */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 shadow-xs">
          <h3 className="font-bold text-base text-[#12304A] mb-3">
            Tejgaon Industrial Area Location Map
          </h3>
          <div className="aspect-21/9 bg-slate-100 rounded-xs overflow-hidden border border-slate-200 relative flex items-center justify-center">
            {/* Visual Industrial Map Representation */}
            <div className="absolute inset-0 bg-slate-200 flex flex-col items-center justify-center text-slate-600 p-6 text-center">
              <MapPin className="w-10 h-10 text-[#F28C28] mb-2 animate-bounce" />
              <strong className="text-sm text-[#12304A]">ART Industrial Solutions HQ & Central Godown</strong>
              <span className="text-xs text-slate-500 max-w-md mt-1">
                Plot 42, Block C, Tejgaon Industrial Area, Dhaka-1208 (Adjacent to Nabisco & Mohakhali Link)
              </span>
              <a
                href="https://maps.google.com/?q=Tejgaon+Industrial+Area+Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 px-3.5 py-1.5 bg-[#12304A] text-white text-xs font-semibold rounded-xs hover:bg-[#1E5A85] transition-colors"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

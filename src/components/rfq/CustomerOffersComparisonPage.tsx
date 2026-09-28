import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SellerOffer } from '../../types';
import {
  FileText,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  ArrowLeft,
  Truck,
  AlertCircle,
  Award,
  Scale,
  X,
  Send,
  MessageSquare
} from 'lucide-react';

export const CustomerOffersComparisonPage: React.FC = () => {
  const {
    selectedRfqId,
    rfqs,
    sellerOffers,
    procurementOrders,
    selectSellerOffer,
    rejectSellerOffer,
    submitCounterOffer,
    setCurrentView
  } = useApp();

  const [counterModalOffer, setCounterModalOffer] = useState<SellerOffer | null>(null);
  const [counterPriceInput, setCounterPriceInput] = useState<number>(0);
  const [counterNotesInput, setCounterNotesInput] = useState<string>('');

  const rfq = rfqs.find(r => r.id === selectedRfqId) || rfqs[0];
  const offers = sellerOffers.filter(o => o.rfqId === rfq?.id);
  const matchedPo = procurementOrders.find(p => p.rfqId === rfq?.id);

  if (!rfq) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-base font-semibold text-slate-700">Quotation request not found.</p>
        <button
          onClick={() => setCurrentView('customer_dashboard')}
          className="mt-4 px-4 py-2 bg-[#12304A] text-white text-xs font-semibold rounded-xs"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const selectedOffer = offers.find(o => o.status === 'selected' || o.status === 'confirmed');

  const openCounterModal = (offer: SellerOffer) => {
    setCounterModalOffer(offer);
    // suggest 5-8% discount as starting counter
    setCounterPriceInput(offer.counterPrice || Math.round(offer.totalPrice * 0.93));
    setCounterNotesInput(offer.counterNotes || 'We can issue immediate PO if agreed on counter price with standard delivery.');
  };

  const handleSendCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterModalOffer) return;
    submitCounterOffer(rfq.id, counterModalOffer.id, counterPriceInput, counterNotesInput);
    setCounterModalOffer(null);
  };

  return (
    <div className="bg-[#F5F7F9] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <button
          onClick={() => setCurrentView('customer_dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E5A85] hover:text-[#12304A] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My RFQs & Orders</span>
        </button>

        {/* Top Header Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 mb-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold bg-[#12304A] text-white px-2 py-0.5 rounded-xs">
                  {rfq.id}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-xs ${
                  rfq.status === 'Seller Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                  rfq.status === 'Seller Selected' ? 'bg-blue-100 text-[#1E5A85]' :
                  rfq.status === 'Offers Received' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  Status: {rfq.status}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#12304A]">
                Supplier Quotation Comparison & Evaluation
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Client: <strong>{rfq.companyName}</strong> · Delivery to: <strong>{rfq.deliveryLocation}</strong> · Required: <strong>{rfq.requiredDate}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block">Total Offers Received</span>
              <span className="text-2xl font-bold text-[#12304A] tabular-nums">
                {offers.length} {offers.length === 1 ? 'Supplier Bid' : 'Supplier Bids'}
              </span>
            </div>
          </div>

          {/* Requested Items Summary */}
          <div className="mt-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Requested Line Items ({rfq.items.length}):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {rfq.items.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-[#F5F7F9] border border-slate-200 rounded-xs text-xs">
                  <div className="font-semibold text-slate-900 truncate">{item.productName}</div>
                  <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                    <span>Qty: <strong className="text-slate-800">{item.quantity} {item.unit}</strong></span>
                    <span className="font-mono text-slate-400">{item.sku}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Supplier Status Banner (if customer already selected) */}
        {selectedOffer && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xs p-5 mb-6 space-y-3">
            <div className="flex items-start justify-between gap-4 border-b border-emerald-200/80 pb-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-emerald-950">
                    Confirmed Supplier: {selectedOffer.sellerCompany} ({selectedOffer.sellerName})
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Quotation value: <strong>৳{selectedOffer.totalPrice.toLocaleString()}</strong>.
                    Other bidder offers have been automatically declined.
                  </p>
                </div>
              </div>
              <span className="bg-emerald-600 text-white font-bold text-xs px-3 py-1 rounded-xs">
                {selectedOffer.status === 'confirmed' ? '✓ Dispatched & Confirmed' : 'Awaiting Seller Fulfillment'}
              </span>
            </div>

            {/* If Seller confirmed and initiated dispatch procedure */}
            {matchedPo && (
              <div className="bg-white p-3.5 rounded-xs border border-emerald-200 text-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Logistics Courier / Carrier:</span>
                  <span className="font-semibold text-slate-900">{matchedPo.courierName || 'Factory Dedicated Truck'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Consignment Tracking No:</span>
                  <span className="font-mono font-bold text-[#12304A]">{matchedPo.trackingNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Site Arrival:</span>
                  <span className="font-semibold text-emerald-800">{matchedPo.estimatedDeliveryDate || '3 Business Days'}</span>
                </div>
                {matchedPo.dispatchNotes && (
                  <div className="sm:col-span-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    <strong>Dispatch Notes:</strong> {matchedPo.dispatchNotes}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* COMPARISON CARDS / GRID */}
        {offers.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-xs p-12 text-center space-y-3">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">No Supplier Bids Received Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your RFQ is published in the Authorized Seller Portal. Suppliers are currently calculating lead times and wholesale pricing.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setCurrentView('seller_portal')}
                className="px-4 py-2 bg-[#1E5A85] text-white text-xs font-semibold rounded-xs"
              >
                Switch to Seller Portal to Submit an Offer (Demo Mode)
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, idx) => {
              const isSelected = offer.status === 'selected' || offer.status === 'confirmed';
              const isRejected = offer.status === 'rejected';

              return (
                <div
                  key={offer.id}
                  className={`bg-white rounded-xs p-5 flex flex-col justify-between transition-all duration-200 ${
                    isSelected
                      ? 'border-2 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                      : isRejected
                      ? 'border border-slate-200 opacity-60 bg-slate-50'
                      : 'border border-[#E2E8F0] hover:border-[#1E5A85] shadow-xs'
                  }`}
                >
                  <div>
                    {/* Top Row: Seller Company & Status */}
                    <div className="flex items-start justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
                          <Building2 className="w-3.5 h-3.5 text-[#1E5A85]" />
                          <span className="font-medium">Bidder #{idx + 1}</span>
                        </div>
                        <h3 className="font-bold text-sm text-[#12304A]">
                          {offer.sellerCompany}
                        </h3>
                        <div className="text-[11px] text-slate-500">
                          Rep: {offer.sellerName} · Rating: <span className="font-bold text-slate-800">★ {offer.sellerRating}</span>
                        </div>
                      </div>

                      {isSelected ? (
                        <span className="bg-emerald-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-xs">
                          Selected
                        </span>
                      ) : isRejected ? (
                        <span className="bg-slate-300 text-slate-700 font-bold text-[10px] uppercase px-2 py-0.5 rounded-xs">
                          Rejected
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-[#1E5A85] font-semibold text-[10px] uppercase px-2 py-0.5 rounded-xs">
                          Active Bid
                        </span>
                      )}
                    </div>

                    {/* Price Highlights */}
                    <div className="bg-[#F5F7F9] p-3 rounded-xs border border-slate-200 mb-4">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        Total Commercial Offer (BDT)
                      </span>
                      <div className="text-2xl font-bold text-[#12304A] tabular-nums mt-0.5">
                        ৳{offer.totalPrice.toLocaleString()}
                      </div>
                      <span className="text-[11px] text-slate-500">Excl. VAT / Doorstep delivery</span>
                    </div>

                    {/* Line Items Breakdown */}
                    <div className="space-y-2 mb-4">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        Itemized Quotations:
                      </span>
                      <div className="space-y-1.5">
                        {offer.items.map((it, i) => (
                          <div key={i} className="flex justify-between items-center text-xs p-1.5 bg-slate-50 rounded-xs">
                            <span className="font-medium text-slate-800 truncate pr-2">{it.productName}</span>
                            <span className="font-bold text-[#12304A] shrink-0 tabular-nums">
                              ৳{it.unitPrice.toLocaleString()} ea
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Commercial Terms (Delivery, Warranty, Validity) */}
                    <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      <div className="flex items-start gap-2">
                        <Truck className="w-3.5 h-3.5 text-[#F28C28] shrink-0 mt-0.5" />
                        <div>
                          <strong>Lead Time:</strong> {offer.deliveryTime}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#F28C28] shrink-0 mt-0.5" />
                        <div>
                          <strong>Stock Location:</strong> {offer.availability}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#F28C28] shrink-0 mt-0.5" />
                        <div>
                          <strong>Warranty:</strong> {offer.warranty}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Award className="w-3.5 h-3.5 text-[#F28C28] shrink-0 mt-0.5" />
                        <div>
                          <strong>Validity:</strong> {offer.offerValidity}
                        </div>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    {offer.additionalNotes && (
                      <div className="mt-3 p-2 bg-amber-50/70 border border-amber-200/80 rounded-xs text-[11px] text-amber-900">
                        <strong>Seller Remarks:</strong> {offer.additionalNotes}
                      </div>
                    )}
                  </div>

                  {/* Actions: Select Seller or Reject */}
                  <div className="pt-4 border-t border-slate-200 mt-4">
                    {isSelected ? (
                      <div className="text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-100/60 rounded-xs">
                        ✓ Selected Supplier Partner
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => selectSellerOffer(rfq.id, offer.id)}
                          className="w-full py-2.5 px-3 bg-[#12304A] hover:bg-[#1E5A85] text-white text-xs font-bold rounded-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-[#F28C28]" />
                          <span>Confirm This Seller (৳{offer.totalPrice.toLocaleString()})</span>
                        </button>
                        <button
                          onClick={() => rejectSellerOffer(rfq.id, offer.id)}
                          disabled={isRejected}
                          className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-500 text-xs font-semibold rounded-xs transition-colors"
                        >
                          {isRejected ? 'Declined' : 'Decline Offer'}
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

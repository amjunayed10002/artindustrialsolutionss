import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RFQ, SellerOfferItem, SellerProfile } from '../../types';
import {
  Building2,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ShieldCheck,
  Send,
  CheckCircle2,
  Package,
  Layers,
  ChevronRight,
  MapPin,
  Calendar
} from 'lucide-react';

export const SellerPortal: React.FC = () => {
  const {
    currentUser,
    sellers,
    rfqs,
    sellerOffers,
    submitSellerOffer,
    confirmSellerOrder,
    setCurrentView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'available_rfqs' | 'my_offers' | 'orders' | 'profile'>('available_rfqs');

  // Identify seller profile
  const currentSeller: SellerProfile = sellers.find(s => s.userId === currentUser.id) || {
    id: currentUser.id,
    userId: currentUser.id,
    companyName: currentUser.companyName || '',
    contactPerson: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    address: '',
    tradeLicenseNumber: '',
    tinNumber: '',
    binNumber: '',
    businessType: '',
    status: currentUser.sellerStatus || 'pending',
    rating: 0,
    totalDeals: 0,
    joinedDate: currentUser.createdAt
  };

  // RFQs open for bidding
  const openRfqs = rfqs.filter(r => r.status === 'Submitted' || r.status === 'Offers Received');

  // Offers submitted by this seller
  const myOffers = sellerOffers.filter(o => o.sellerId === currentSeller.id);

  // Offers won by this seller
  const wonOffers = sellerOffers.filter(
    o => o.sellerId === currentSeller.id && (o.status === 'selected' || o.status === 'confirmed')
  );

  // Modal State for Submitting Offer
  const [biddingRfq, setBiddingRfq] = useState<RFQ | null>(null);
  const [unitPrices, setUnitPrices] = useState<Record<string, number>>({});
  const [deliveryTime, setDeliveryTime] = useState<string>('');
  const [availability, setAvailability] = useState<string>('');
  const [warranty, setWarranty] = useState<string>('');
  const [offerValidity, setOfferValidity] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Modal State for Order Fulfillment & Dispatch Procedure
  const [dispatchModalOffer, setDispatchModalOffer] = useState<any | null>(null);
  const [dispatchCourier, setDispatchCourier] = useState<string>('');
  const [dispatchTrackingNo, setDispatchTrackingNo] = useState<string>('');
  const [dispatchEstDate, setDispatchEstDate] = useState<string>('');
  const [dispatchRemarks, setDispatchRemarks] = useState<string>('');

  const handleOpenBidding = (rfq: RFQ) => {
    setBiddingRfq(rfq);
    // Initialize default prices based on RFQ items
    const initPrices: Record<string, number> = {};
    rfq.items.forEach(item => {
      initPrices[item.productId] = 0;
    });
    setUnitPrices(initPrices);
  };

  const handlePriceChange = (productId: string, val: number) => {
    setUnitPrices(prev => ({ ...prev, [productId]: Math.max(0, val) }));
  };

  // Calculate total price for offer
  const calculatedTotal = biddingRfq
    ? biddingRfq.items.reduce((acc, item) => {
        const uPrice = unitPrices[item.productId] || 0;
        return acc + uPrice * item.quantity;
      }, 0)
    : 0;

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!biddingRfq) return;

    const offerItems: SellerOfferItem[] = biddingRfq.items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      offeredQuantity: item.quantity,
      unitPrice: unitPrices[item.productId] || 0,
      totalPrice: (unitPrices[item.productId] || 0) * item.quantity
    }));

    submitSellerOffer({
      rfqId: biddingRfq.id,
      sellerId: currentSeller.id,
      sellerName: currentSeller.contactPerson,
      sellerCompany: currentSeller.companyName,
      sellerRating: currentSeller.rating,
      items: offerItems,
      totalPrice: calculatedTotal,
      deliveryTime,
      availability,
      warranty,
      offerValidity,
      additionalNotes
    });

    setBiddingRfq(null);
    setActiveTab('my_offers');
  };

  return (
    <div className="bg-[#F5F7F9] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Seller Overview Banner */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 mb-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-xs text-[#1E5A85] flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>Authorized Vendor Portal</span>
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-xs ${
                  currentSeller.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                  currentSeller.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  Status: {currentSeller.status}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#12304A]">
                {currentSeller.companyName}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Contact: <strong>{currentSeller.contactPerson}</strong> ({currentSeller.phone}) · License: {currentSeller.tradeLicenseNumber}
              </p>
            </div>

            {/* Seller stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="text-xs text-slate-400 block uppercase font-bold text-[10px]">Open RFQs</span>
                <span className="text-xl font-bold text-[#12304A] tabular-nums">{openRfqs.length}</span>
              </div>
              <div className="text-center border-x border-slate-200 px-4">
                <span className="text-xs text-slate-400 block uppercase font-bold text-[10px]">My Bids</span>
                <span className="text-xl font-bold text-[#12304A] tabular-nums">{myOffers.length}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-slate-400 block uppercase font-bold text-[10px]">Won Deals</span>
                <span className="text-xl font-bold text-emerald-700 tabular-nums">{wonOffers.length}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('available_rfqs')}
              className={`px-3 py-1.5 font-bold rounded-xs transition-colors ${activeTab === 'available_rfqs' ? 'bg-[#12304A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              Available RFQs for Quotation ({openRfqs.length})
            </button>
            <button
              onClick={() => setActiveTab('my_offers')}
              className={`px-3 py-1.5 font-bold rounded-xs transition-colors ${activeTab === 'my_offers' ? 'bg-[#12304A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              My Submitted Offers ({myOffers.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 font-bold rounded-xs transition-colors ${activeTab === 'orders' ? 'bg-[#12304A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              Selected Orders & Fulfillment ({wonOffers.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 font-bold rounded-xs transition-colors ${activeTab === 'profile' ? 'bg-[#12304A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              Vendor Credentials & Profile
            </button>
          </div>
        </div>

        {/* TAB 1: AVAILABLE RFQs */}
        {activeTab === 'available_rfqs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#12304A]">
                Open Commercial RFQs Available for Bidding
              </h2>
              <span className="text-xs text-slate-500">Only approved sellers can submit valid bids</span>
            </div>

            {openRfqs.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-xs p-10 text-center">
                <p className="text-slate-600 text-sm">No new quotation requests awaiting bids.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {openRfqs.map(rfq => {
                  const alreadyBid = sellerOffers.some(o => o.rfqId === rfq.id && o.sellerId === currentSeller.id);

                  return (
                    <div
                      key={rfq.id}
                      className="bg-white border border-[#E2E8F0] hover:border-[#1E5A85] rounded-xs p-5 shadow-xs transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono text-xs font-bold text-[#12304A]">{rfq.id}</span>
                            <span className="text-[10px] font-semibold bg-blue-50 text-[#1E5A85] px-1.5 py-0.5 rounded-xs">
                              {rfq.status}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-slate-900">
                            Client: {rfq.companyName}
                          </h3>
                        </div>

                        <div className="text-left sm:text-right text-xs text-slate-500">
                          <div>Delivery Site: <strong className="text-slate-800">{rfq.deliveryLocation}</strong></div>
                          <div>Required Date: <strong className="text-slate-800">{rfq.requiredDate}</strong></div>
                        </div>
                      </div>

                      {/* Line Items */}
                      <div className="space-y-2 mb-4">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Items Requested:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {rfq.items.map((item, i) => (
                            <div key={i} className="p-2 bg-[#F5F7F9] rounded-xs border border-slate-200 text-xs">
                              <div className="font-semibold text-slate-800 truncate">{item.productName}</div>
                              <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                                <span>Qty: <strong className="text-slate-900">{item.quantity} {item.unit}</strong></span>
                                <span className="font-mono">{item.sku}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {rfq.overallNotes && (
                        <div className="mb-4 text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded-xs border border-amber-200/60">
                          <strong>Client Instructions:</strong> {rfq.overallNotes}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-500">
                          Created {new Date(rfq.createdAt).toLocaleDateString()}
                        </span>

                        {alreadyBid ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Quotation Already Submitted</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenBidding(rfq)}
                            className="px-4 py-2 bg-[#F28C28] hover:bg-[#d9771b] text-white text-xs font-bold rounded-xs transition-colors shadow-xs flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Prepare & Submit Commercial Quotation</span>
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY SUBMITTED OFFERS */}
        {activeTab === 'my_offers' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[#12304A]">
              My Active & Historical Quotation Submissions
            </h2>

            {myOffers.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-xs p-10 text-center">
                <p className="text-slate-600 text-sm">You haven't submitted any quotations yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myOffers.map(offer => (
                  <div key={offer.id} className="bg-white border border-[#E2E8F0] rounded-xs p-5 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#12304A]">RFQ: {offer.rfqId}</span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-xs ${
                            offer.status === 'confirmed' ? 'bg-emerald-600 text-white' :
                            offer.status === 'selected' ? 'bg-emerald-100 text-emerald-800' :
                            offer.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {offer.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Submitted on {new Date(offer.submittedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Offer Amount</span>
                        <span className="text-xl font-bold text-[#12304A] tabular-nums">
                          ৳{offer.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 mb-3">
                      <div><strong>Lead Time:</strong> {offer.deliveryTime}</div>
                      <div><strong>Location:</strong> {offer.availability}</div>
                      <div><strong>Warranty:</strong> {offer.warranty}</div>
                    </div>

                    {offer.status === 'selected' && (
                      <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <span className="text-xs font-bold text-emerald-900">
                          🎉 Customer selected your quotation! Deal value: ৳{offer.totalPrice.toLocaleString()}. Please confirm order & start dispatch procedure.
                        </span>
                        <button
                          onClick={() => setDispatchModalOffer(offer)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xs shrink-0 flex items-center gap-1.5 shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Confirm Order & Send Product</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SELECTED ORDERS & FULFILLMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[#12304A]">
              Confirmed Procurement Orders & Dispatch Procedures
            </h2>

            {wonOffers.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-xs p-10 text-center">
                <p className="text-slate-600 text-sm">No won orders yet. Submit competitive offers on open RFQs.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {wonOffers.map(offer => (
                  <div key={offer.id} className="bg-white border-2 border-emerald-500 rounded-xs p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-xs font-bold text-emerald-800">
                          RFQ: {offer.rfqId} · Order Status: {offer.status.toUpperCase()}
                        </span>
                        <h3 className="font-bold text-base text-[#12304A]">
                          Commercial Deal Value: ৳{offer.totalPrice.toLocaleString()}
                        </h3>
                      </div>
                      {offer.status === 'selected' ? (
                        <button
                          onClick={() => setDispatchModalOffer(offer)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xs shadow-xs flex items-center gap-1.5"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Initiate Dispatch Procedure Now</span>
                        </button>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-3 py-1.5 rounded-xs flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Dispatched & Fulfillment Confirmed</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div><strong>Client Terms:</strong> {offer.additionalNotes}</div>
                      <div><strong>Delivery Commitment:</strong> {offer.deliveryTime} ({offer.availability})</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE & CREDENTIALS */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#12304A] border-b border-slate-100 pb-2">
              Registered Seller Business Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Company Legal Entity</span>
                <span className="font-semibold text-slate-900">{currentSeller.companyName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Business Classification</span>
                <span className="font-semibold text-slate-900">{currentSeller.businessType}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Trade License</span>
                <span className="font-mono text-slate-900">{currentSeller.tradeLicenseNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block">VAT / BIN Registration</span>
                <span className="font-mono text-slate-900">{currentSeller.binNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Warehouse / Operational Address</span>
                <span className="text-slate-900">{currentSeller.address}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Contact Phone & WhatsApp</span>
                <span className="text-slate-900">{currentSeller.phone} ({currentSeller.contactPerson})</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* SUBMIT BID MODAL */}
      {biddingRfq && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border border-[#E2E8F0] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#12304A]">{biddingRfq.id}</span>
                <h3 className="font-bold text-base text-[#12304A]">
                  Submit Official Seller Quotation
                </h3>
              </div>
              <button onClick={() => setBiddingRfq(null)} className="p-1 text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleOfferSubmit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
              
              <div className="bg-slate-50 p-3 rounded-xs border border-slate-200">
                <div className="font-semibold text-slate-800">Client: {biddingRfq.companyName}</div>
                <div className="text-slate-500">Destination: {biddingRfq.deliveryLocation}</div>
              </div>

              {/* Line items pricing */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Itemized Unit Pricing (BDT ৳):
                </label>
                <div className="space-y-2">
                  {biddingRfq.items.map(item => (
                    <div key={item.id} className="p-2.5 border border-slate-200 rounded-xs flex items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-slate-900">{item.productName}</div>
                        <div className="text-[11px] text-slate-500">
                          Requested Qty: <strong>{item.quantity} {item.unit}</strong> (SKU: {item.sku})
                        </div>
                      </div>
                      <div className="w-32">
                        <label className="text-[10px] text-slate-400 block">Unit Price (৳)</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={unitPrices[item.productId] || ''}
                          onChange={e => handlePriceChange(item.productId, parseFloat(e.target.value) || 0)}
                          className="w-full p-1.5 font-bold text-[#12304A] border border-slate-300 rounded-xs tabular-nums text-right outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total preview */}
              <div className="p-3 bg-[#F5F7F9] rounded-xs border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-700">Calculated Commercial Total:</span>
                <span className="text-xl font-bold text-[#12304A] tabular-nums">
                  ৳{calculatedTotal.toLocaleString()}
                </span>
              </div>

              {/* Commercial Terms Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Delivery Lead Time</label>
                  <input
                    type="text"
                    required
                    value={deliveryTime}
                    onChange={e => setDeliveryTime(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Availability</label>
                  <input
                    type="text"
                    required
                    value={availability}
                    onChange={e => setAvailability(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Warranty Period</label>
                  <input
                    type="text"
                    required
                    value={warranty}
                    onChange={e => setWarranty(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quotation Validity</label>
                  <input
                    type="text"
                    required
                    value={offerValidity}
                    onChange={e => setOfferValidity(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Additional Seller Remarks</label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBiddingRfq(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#F28C28] hover:bg-[#d9771b] text-white font-bold rounded-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Official Offer</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DISPATCH PROCEDURE MODAL */}
      {dispatchModalOffer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border border-[#E2E8F0] shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-emerald-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900">
                <Truck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-base">Confirm & Send Product Procedure</h3>
              </div>
              <button onClick={() => setDispatchModalOffer(null)} className="p-1 text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                confirmSellerOrder(dispatchModalOffer.id, {
                  courierName: dispatchCourier,
                  trackingNumber: dispatchTrackingNo,
                  estimatedDeliveryDate: dispatchEstDate,
                  dispatchNotes: dispatchRemarks
                });
                setDispatchModalOffer(null);
              }}
              className="p-5 space-y-4 text-xs"
            >
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">RFQ Reference:</span>
                  <span className="font-mono font-bold text-[#12304A]">{dispatchModalOffer.rfqId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Commercial Deal Value:</span>
                  <span className="font-bold text-emerald-700">৳{dispatchModalOffer.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Logistics Carrier / Courier Partner *
                </label>
                <input
                  type="text"
                  required
                  value={dispatchCourier}
                  onChange={e => setDispatchCourier(e.target.value)}
                  placeholder="e.g. Sundarban Courier, SA Paribahan, Dedicated Logistics Truck..."
                  className="w-full p-2 border border-slate-300 rounded-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Consignment / Tracking No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={dispatchTrackingNo}
                    onChange={e => setDispatchTrackingNo(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Expected Arrival Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={dispatchEstDate}
                    onChange={e => setDispatchEstDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Dispatch Notes & Quality Documentation Attached
                </label>
                <textarea
                  rows={2}
                  value={dispatchRemarks}
                  onChange={e => setDispatchRemarks(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDispatchModalOffer(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xs flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Confirm Dispatch & Notify Customer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

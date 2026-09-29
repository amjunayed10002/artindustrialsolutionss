import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RFQ } from '../../types';
import {
  User as UserIcon,
  FileText,
  ShoppingCart,
  Package,
  Building,
  ChevronRight,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    currentUser,
    rfqs,
    sellerOffers,
    procurementOrders,
    submitBuyerOffer,
    setCurrentView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'rfqs' | 'orders' | 'profile'>('rfqs');
  const [respondingToRfq, setRespondingToRfq] = useState<string | null>(null);
  const [buyerOfferTotal, setBuyerOfferTotal] = useState('');
  const [buyerOfferDelivery, setBuyerOfferDelivery] = useState('');
  const [buyerOfferValidity, setBuyerOfferValidity] = useState('');
  const [buyerOfferNotes, setBuyerOfferNotes] = useState('');

  // Customer RFQs
  const myRfqs = rfqs.filter(r => r.customerId === currentUser.id);
  const supplierRfqs = rfqs.filter(r => r.createdByRole === 'seller' && (r.status === 'Submitted' || r.status === 'Offers Received'));

  // Customer Orders
  const myOrders = procurementOrders.filter(o => o.customerId === currentUser.id);

  const handleSellerRfqResponse = (rfq: RFQ) => {
    const totalPrice = Number(buyerOfferTotal);
    const quantityTotal = rfq.items.reduce((total, item) => total + item.quantity, 0);
    if (!Number.isFinite(totalPrice) || totalPrice <= 0 || quantityTotal <= 0) return;
    const unitPrice = totalPrice / quantityTotal;

    submitBuyerOffer({
      rfqId: rfq.id,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerCompany: currentUser.companyName || currentUser.name,
      sellerRating: 0,
      items: rfq.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        offeredQuantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity
      })),
      totalPrice,
      deliveryTime: buyerOfferDelivery.trim(),
      availability: currentUser.companyName || 'Buyer response',
      warranty: '',
      offerValidity: buyerOfferValidity.trim(),
      additionalNotes: buyerOfferNotes.trim()
    });
    setRespondingToRfq(null);
    setBuyerOfferTotal('');
    setBuyerOfferDelivery('');
    setBuyerOfferValidity('');
    setBuyerOfferNotes('');
  };

  return (
    <div className="bg-[#F5F7F9] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Customer Header Banner */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 mb-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#12304A] text-white flex items-center justify-center font-bold text-lg rounded-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#12304A]">
                  {currentUser.name}
                </h1>
                <p className="text-xs text-slate-500">
                  {currentUser.companyName || 'Corporate Client Account'} · {currentUser.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('rfq_builder')}
                className="px-4 py-2 bg-[#F28C28] hover:bg-[#d9771b] text-white text-xs font-bold rounded-xs transition-colors shadow-xs flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>+ Create New RFQ</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('rfqs')}
              className={`px-3 py-1.5 font-bold rounded-xs transition-colors ${activeTab === 'rfqs' ? 'bg-[#12304A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              My Quotation Requests ({myRfqs.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 font-bold rounded-xs transition-colors ${activeTab === 'orders' ? 'bg-[#12304A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              Procurement Orders ({myOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 font-bold rounded-xs transition-colors ${activeTab === 'profile' ? 'bg-[#12304A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              Corporate Profile Details
            </button>
          </div>
        </div>

        {/* TAB 1: MY RFQS */}
        {activeTab === 'rfqs' && (
          <div className="space-y-4">
            {supplierRfqs.length > 0 && <section className="bg-white border border-[#E2E8F0] p-5 space-y-3">
              <div>
                <h2 className="text-base font-bold text-[#12304A]">Seller RFQs</h2>
                <p className="text-xs text-slate-500">Requests published by sellers and visible to buyer accounts.</p>
              </div>
              {supplierRfqs.map(rfq => (
                <div key={rfq.id} className="border-t border-slate-100 pt-3 space-y-3">
                <article className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#12304A]">{rfq.companyName || rfq.customerName}</p>
                    <p className="text-xs text-slate-500">{rfq.id} · {rfq.items.length} items · {rfq.deliveryLocation}</p>
                    <p className="text-xs text-slate-600 mt-1">{rfq.items.map(item => `${item.quantity} ${item.unit} ${item.productName}`).join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold uppercase px-2 py-1 bg-amber-100 text-amber-900">{rfq.status}</span>
                    <button onClick={() => setCurrentView('customer_dashboard', { rfqId: rfq.id })} className="px-3 py-1.5 bg-[#12304A] text-white text-xs font-semibold rounded-xs">View responses ({sellerOffers.filter(offer => offer.rfqId === rfq.id).length})</button>
                    <button onClick={() => setRespondingToRfq(respondingToRfq === rfq.id ? null : rfq.id)} className="px-3 py-1.5 border border-[#1E5A85] text-[#1E5A85] text-xs font-semibold rounded-xs">Respond</button>
                  </div>
                </article>
                {respondingToRfq === rfq.id && <form key={`${rfq.id}-response`} onSubmit={event => { event.preventDefault(); handleSellerRfqResponse(rfq); }} className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                  <label className="text-xs font-semibold text-slate-700">Total quote (৳)<input type="number" required min="0.01" step="0.01" value={buyerOfferTotal} onChange={event => setBuyerOfferTotal(event.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-xs" /></label>
                  <label className="text-xs font-semibold text-slate-700">Delivery estimate<input required value={buyerOfferDelivery} onChange={event => setBuyerOfferDelivery(event.target.value)} placeholder="e.g. 5 business days" className="mt-1 w-full p-2 border border-slate-300 rounded-xs" /></label>
                  <label className="text-xs font-semibold text-slate-700">Offer validity<input required value={buyerOfferValidity} onChange={event => setBuyerOfferValidity(event.target.value)} placeholder="e.g. 14 days" className="mt-1 w-full p-2 border border-slate-300 rounded-xs" /></label>
                  <label className="text-xs font-semibold text-slate-700">Notes<input value={buyerOfferNotes} onChange={event => setBuyerOfferNotes(event.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-xs" /></label>
                  <div className="sm:col-span-2 flex justify-end"><button type="submit" className="px-4 py-2 bg-[#12304A] text-white text-xs font-semibold rounded-xs">Submit response</button></div>
                </form>}
                </div>
              ))}
            </section>}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#12304A]">
                Submitted Quotation Requests (RFQs)
              </h2>
              <span className="text-xs text-slate-500">Compare multi-supplier bids and confirm orders</span>
            </div>

            {myRfqs.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-xs p-10 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">No RFQs submitted yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Add spares to your cart or click create new RFQ to start receiving competitive supplier quotations.
                </p>
                <button
                  onClick={() => setCurrentView('rfq_builder')}
                  className="px-4 py-2 bg-[#12304A] text-white text-xs font-semibold rounded-xs"
                >
                  Create Quotation Request
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myRfqs.map(rfq => {
                  const offers = sellerOffers.filter(o => o.rfqId === rfq.id);
                  const selectedOffer = offers.find(o => o.status === 'selected' || o.status === 'confirmed');

                  return (
                    <div
                      key={rfq.id}
                      className="bg-white border border-[#E2E8F0] hover:border-[#1E5A85] rounded-xs p-5 shadow-xs transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold bg-[#12304A] text-white px-2 py-0.5 rounded-xs">
                              {rfq.id}
                            </span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-xs ${
                              rfq.status === 'Seller Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                              rfq.status === 'Seller Selected' ? 'bg-blue-100 text-[#1E5A85]' :
                              rfq.status === 'Offers Received' ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {rfq.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            Submitted on {new Date(rfq.createdAt).toLocaleDateString()} · Required by {rfq.requiredDate}
                          </div>
                        </div>

                        {/* Offers Count & Comparison Trigger */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Supplier Bids</span>
                            <span className="text-sm font-bold text-[#12304A] tabular-nums">
                              {offers.length} {offers.length === 1 ? 'Offer' : 'Offers'}
                            </span>
                          </div>

                          <button
                            onClick={() => setCurrentView('customer_dashboard', { rfqId: rfq.id })}
                            className="px-4 py-2 bg-[#12304A] hover:bg-[#1E5A85] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5"
                          >
                            <span>Compare Offers ({offers.length})</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#F28C28]" />
                          </button>
                        </div>
                      </div>

                      {/* Items preview */}
                      <div className="space-y-1.5 text-xs text-slate-700 mb-3">
                        <div className="font-bold text-[11px] text-slate-400 uppercase">Items Included:</div>
                        <div className="flex flex-wrap gap-2">
                          {rfq.items.map((item, idx) => (
                            <span key={idx} className="bg-[#F5F7F9] border border-slate-200 px-2 py-1 rounded-xs text-[11px]">
                              {item.quantity}x {item.productName} ({item.unit})
                            </span>
                          ))}
                        </div>
                      </div>

                      {selectedOffer && (
                        <div className="mt-2 p-2 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xs text-xs flex items-center justify-between">
                          <span>
                            Selected Supplier: <strong>{selectedOffer.sellerCompany}</strong> (৳{selectedOffer.totalPrice.toLocaleString()})
                          </span>
                          <span className="font-semibold text-emerald-800 text-[11px]">
                            {selectedOffer.status === 'confirmed' ? '✓ Order Confirmed by Supplier' : 'Awaiting Seller Confirmation'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROCUREMENT ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[#12304A]">
              Executed Procurement Purchase Orders
            </h2>

            {myOrders.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-xs p-10 text-center space-y-2">
                <Package className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-slate-600 text-sm">No confirmed procurement orders yet.</p>
                <p className="text-xs text-slate-400">
                  Select a supplier offer from your RFQs to generate an official procurement PO.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map(order => (
                  <div key={order.id} className="bg-white border border-emerald-500 rounded-xs p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-emerald-800">{order.id}</span>
                        <h3 className="font-bold text-base text-[#12304A]">
                          Supplier: {order.sellerCompany}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Total Value</span>
                        <span className="text-lg font-bold text-[#12304A] tabular-nums">
                          ৳{order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div>Destination: <strong>{order.deliveryLocation}</strong></div>
                      <div>Status: <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">{order.status}</span></div>
                      {order.courierName && (
                        <div className="pt-2 mt-2 border-t border-slate-100 flex flex-wrap gap-4 text-[11px]">
                          <span>Courier: <strong className="text-slate-900">{order.courierName}</strong></span>
                          <span>Tracking No: <strong className="font-mono text-[#12304A]">{order.trackingNumber}</strong></span>
                          {order.estimatedDeliveryDate && (
                            <span>Estimated Arrival: <strong className="text-emerald-800">{order.estimatedDeliveryDate}</strong></span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#12304A] border-b border-slate-100 pb-2">
              Corporate Account Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Organization Name</span>
                <span className="font-semibold text-slate-900">{currentUser.companyName || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Authorized Contact Person</span>
                <span className="font-semibold text-slate-900">{currentUser.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Email Address</span>
                <span className="text-slate-900">{currentUser.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Phone / Mobile</span>
                <span className="text-slate-900">{currentUser.phone}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

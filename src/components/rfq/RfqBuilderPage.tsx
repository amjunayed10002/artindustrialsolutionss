import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, RFQItem } from '../../types';
import {
  FileText,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Building,
  CheckCircle,
  AlertCircle,
  Search,
  X,
  ArrowRight,
  ShieldCheck,
  Package,
  ShoppingCart,
  Layers,
  Sparkles
} from 'lucide-react';

export const RfqBuilderPage: React.FC = () => {
  const {
    cart,
    rfqDraftItems,
    removeDraftRfqItem,
    updateDraftRfqQuantity,
    updateDraftRfqNotes,
    addDraftRfqItem,
    importCartIntoRfq,
    submitRfq,
    products,
    categories,
    currentUser,
    setCurrentView,
    showToast
  } = useApp();

  const [deliveryLocation, setDeliveryLocation] = useState<string>(
    currentUser.companyName ? `${currentUser.companyName}, Factory Site, Tejgaon/Gazipur, Bangladesh` : ''
  );
  const [requiredDate, setRequiredDate] = useState<string>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [overallNotes, setOverallNotes] = useState<string>(
    'Please provide CIF factory gate quotation with manufacturer inspection test certificates (MTC 3.1).'
  );

  // Quick Inline Search State
  const [inlineSearchQuery, setInlineSearchQuery] = useState<string>('');
  const [inlineSearchResultsOpen, setInlineSearchResultsOpen] = useState<boolean>(false);

  // "+ Add More Products" Modal State
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [modalSearch, setModalSearch] = useState<string>('');
  const [modalCategoryFilter, setModalCategoryFilter] = useState<string>('all');

  // If the cart already has items, pre-fill the RFQ list from it
  useEffect(() => {
    if (rfqDraftItems.length === 0 && cart.length > 0) {
      importCartIntoRfq();
    }
  }, []);

  const inlineFilteredProducts = inlineSearchQuery.trim()
    ? products
        .filter(p => p.isActive)
        .filter(p => {
          const q = inlineSearchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q)
          );
        })
        .slice(0, 6)
    : [];

  const filteredCatalog = products.filter(p => {
    if (!p.isActive) return false;
    if (modalCategoryFilter !== 'all') {
      const cat = categories.find(c => c.slug === modalCategoryFilter);
      if (cat && p.categoryId !== cat.id) return false;
    }
    if (!modalSearch.trim()) return true;
    const q = modalSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rfqDraftItems.length === 0) {
      showToast('Please add at least one product to your RFQ.');
      return;
    }
    if (!deliveryLocation.trim()) {
      showToast('Please provide a delivery location or factory address.');
      return;
    }

    const rfqId = submitRfq({
      deliveryLocation,
      requiredDate,
      overallNotes
    });

    // Navigate to Customer Dashboard RFQ tab to see the newly submitted RFQ
    setCurrentView('customer_dashboard');
  };

  return (
    <div className="bg-[#F5F7F9] min-h-screen py-8 font-['Barlow',sans-serif]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header Banner */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 mb-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F28C28] uppercase tracking-wider mb-1">
                <FileText className="w-4 h-4" />
                <span>Multi-Seller Project RFQ Desk</span>
              </div>
              <h1 className="text-2xl font-bold text-[#12304A]">
                Request for Quotation (RFQ) Builder
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Cart items are automatically added here. You can add more products, adjust quantities, and specify technical requirements.
              </p>
            </div>

            {/* Account Confirmation Status */}
            <div className="bg-[#F5F7F9] border border-slate-200 p-3 rounded-xs text-xs space-y-0.5">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Procurement Client:</div>
              <div className="font-bold text-[#12304A]">{currentUser.name}</div>
              <div className="text-slate-500 text-[11px]">{currentUser.companyName || currentUser.email}</div>
            </div>
          </div>

          {/* Cart Sync Banner */}
          {cart.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#1E5A85] shrink-0" />
                <span className="text-slate-700">
                  You have <strong>{cart.length} item{cart.length > 1 ? 's' : ''}</strong> in your active Shopping Cart.
                </span>
              </div>
              <button
                type="button"
                onClick={importCartIntoRfq}
                className="px-3 py-1 bg-[#1E5A85] hover:bg-[#12304A] text-white font-semibold rounded-xs transition-colors shrink-0"
              >
                Sync & Add All Cart Products
              </button>
            </div>
          )}

          {/* Quick Add Product Inline Bar */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-[#12304A] mb-1.5">
              Quick Add More Products to this RFQ:
            </label>
            <div className="relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inlineSearchQuery}
                  onChange={e => {
                    setInlineSearchQuery(e.target.value);
                    setInlineSearchResultsOpen(true);
                  }}
                  onFocus={() => setInlineSearchResultsOpen(true)}
                  placeholder="Type product name, SKU, bearing code (e.g., 6205, E7018, Gate Valve)..."
                  className="w-full text-xs p-2.5 pl-9 pr-24 border border-slate-300 focus:border-[#1E5A85] rounded-xs outline-none bg-[#F9FAFB] focus:bg-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setAddModalOpen(true)}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#12304A] hover:bg-[#1E5A85] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F28C28]" />
                  <span>Browse All</span>
                </button>
              </div>

              {/* Inline Autocomplete Dropdown */}
              {inlineSearchResultsOpen && inlineSearchQuery.trim() && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E2E8F0] shadow-xl rounded-xs z-30 max-h-72 overflow-y-auto divide-y divide-slate-100">
                  <div className="p-2 bg-slate-50 flex justify-between items-center text-[11px] text-slate-500 font-semibold">
                    <span>Search Results ({inlineFilteredProducts.length}):</span>
                    <button
                      type="button"
                      onClick={() => setInlineSearchResultsOpen(false)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      Close ✕
                    </button>
                  </div>

                  {inlineFilteredProducts.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No matching products found. Try another keyword or browse catalog.
                    </div>
                  ) : (
                    inlineFilteredProducts.map(p => {
                      const alreadyInDraft = rfqDraftItems.some(i => i.productId === p.id);
                      return (
                        <div
                          key={p.id}
                          className="p-2.5 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xs p-1 shrink-0 flex items-center justify-center">
                              <img src={p.images[0]} alt={p.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 line-clamp-1">{p.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                {p.brand} · SKU: {p.sku}
                              </div>
                            </div>
                          </div>

                          <div>
                            {alreadyInDraft ? (
                              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-xs">
                                Already in RFQ
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  addDraftRfqItem(p, 1);
                                  setInlineSearchQuery('');
                                  setInlineSearchResultsOpen(false);
                                }}
                                className="px-3 py-1 bg-[#12304A] hover:bg-[#1E5A85] text-white font-semibold text-xs rounded-xs flex items-center gap-1 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add to RFQ</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-[#12304A]">
              Quotation Line Items ({rfqDraftItems.length} Products)
            </span>

            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="px-3 py-1.5 bg-[#1E5A85] hover:bg-[#12304A] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catalog Browser Modal</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* RFQ Product Items Table */}
          <div className="bg-white border border-[#E2E8F0] rounded-xs shadow-xs overflow-hidden">
            {rfqDraftItems.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Package className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No products in this quotation draft.</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Add spares directly from your cart, search using the box above, or browse the industrial catalog.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(true)}
                    className="px-4 py-2 bg-[#12304A] text-white text-xs font-semibold rounded-xs"
                  >
                    Search Full Inventory
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('shop')}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xs border border-slate-300"
                  >
                    Browse Shop Catalog
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5F7F9] text-[#12304A] font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      <th className="py-3 px-4">Product Details</th>
                      <th className="py-3 px-4 w-28 text-center">Quantity</th>
                      <th className="py-3 px-4 w-20">Unit</th>
                      <th className="py-3 px-4">Item-Specific Technical Specifications / Brand Notes</th>
                      <th className="py-3 px-4 w-16 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rfqDraftItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-mono text-slate-400 tabular-nums text-center">{idx + 1}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xs p-1 shrink-0 flex items-center justify-center">
                                <img src={item.image} alt={item.productName} className="max-h-full max-w-full object-contain" />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-slate-900">{item.productName}</div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                SKU: {item.sku} · Category: {item.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={e => updateDraftRfqQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-full p-1.5 text-center font-bold text-[#12304A] border border-slate-300 rounded-xs tabular-nums outline-none focus:border-[#1E5A85]"
                          />
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {item.unit}
                        </td>
                        <td className="py-3.5 px-4">
                          <input
                            type="text"
                            value={item.notes || ''}
                            onChange={e => updateDraftRfqNotes(item.id, e.target.value)}
                            placeholder="e.g., OEM original pack, MTC 3.1 test certificate, brand preference..."
                            className="w-full p-1.5 text-xs text-slate-800 border border-slate-200 focus:border-[#1E5A85] rounded-xs outline-none bg-[#F9FAFB] focus:bg-white"
                          />
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => removeDraftRfqItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Delivery & Procurement Parameters Box */}
          <div className="bg-white border border-[#E2E8F0] rounded-xs p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#12304A] border-b border-slate-100 pb-2">
              Procurement & Delivery Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Delivery Site / Factory Address *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={deliveryLocation}
                    onChange={e => setDeliveryLocation(e.target.value)}
                    placeholder="e.g. Madanganj Clinker Plant, Narayanganj or Tejgaon Warehouse..."
                    className="w-full p-2.5 pl-8 border border-slate-300 focus:border-[#1E5A85] rounded-xs outline-none"
                  />
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Required Delivery Target Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={requiredDate}
                    onChange={e => setRequiredDate(e.target.value)}
                    className="w-full p-2.5 pl-8 border border-slate-300 focus:border-[#1E5A85] rounded-xs outline-none"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Overall Project Scope & Quality Instructions
              </label>
              <textarea
                rows={3}
                value={overallNotes}
                onChange={e => setOverallNotes(e.target.value)}
                placeholder="Include tender references, payment terms, required documentation, batch inspection requirements..."
                className="w-full p-2.5 text-xs text-slate-800 border border-slate-300 focus:border-[#1E5A85] rounded-xs outline-none"
              />
            </div>

            {/* Submission Action */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Submitted RFQs appear to all verified sellers and admins for competitive bidding.</span>
              </div>

              <button
                type="submit"
                disabled={rfqDraftItems.length === 0}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#F28C28] hover:bg-[#d9771b] disabled:bg-slate-300 text-white font-bold text-sm rounded-xs transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Submit RFQ for Competitive Bidding</span>
              </button>
            </div>

          </div>

        </form>

      </div>

      {/* "+ ADD MORE PRODUCTS" MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border border-[#E2E8F0] shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-base text-[#12304A]">Add Products to RFQ Catalog</h3>
                <p className="text-xs text-slate-500">Filter by category or search full inventory to append items</p>
              </div>
              <button onClick={() => setAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input & Category Filter */}
            <div className="p-4 border-b border-slate-100 space-y-2.5">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={modalSearch}
                  onChange={e => setModalSearch(e.target.value)}
                  placeholder="Search by product name, SKU, brand, category..."
                  className="w-full text-xs p-2.5 pl-8 border border-slate-300 focus:border-[#1E5A85] rounded-xs outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setModalCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-xs font-semibold whitespace-nowrap transition-colors ${
                    modalCategoryFilter === 'all'
                      ? 'bg-[#12304A] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setModalCategoryFilter(cat.slug)}
                    className={`px-2.5 py-1 rounded-xs font-semibold whitespace-nowrap transition-colors ${
                      modalCategoryFilter === cat.slug
                        ? 'bg-[#12304A] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {filteredCatalog.map(p => {
                const isAlreadyAdded = rfqDraftItems.some(i => i.productId === p.id);

                return (
                  <div
                    key={p.id}
                    className="p-3 border border-slate-200 hover:border-[#1E5A85] rounded-xs flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xs p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-slate-400">{p.brand} · SKU: {p.sku}</div>
                        <h4 className="text-xs font-semibold text-[#12304A] line-clamp-1">{p.name}</h4>
                        <div className="text-[11px] text-slate-500">
                          {p.isPriceOnRequest ? 'Price on Request' : `Ref Price: ৳${(p.salePrice || p.price).toLocaleString()} / ${p.unit}`}
                        </div>
                      </div>
                    </div>

                    <div>
                      {isAlreadyAdded ? (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-xs">
                          In RFQ List
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addDraftRfqItem(p, 1)}
                          className="px-3 py-1.5 bg-[#12304A] hover:bg-[#1E5A85] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 text-right">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 bg-[#12304A] text-white text-xs font-semibold rounded-xs"
              >
                Done (Back to RFQ)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

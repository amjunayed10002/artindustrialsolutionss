import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, FileText, Trash2, ArrowRight, ShieldCheck, Plus, Minus } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartToRfq,
    setCurrentView
  } = useApp();

  return (
    <div className="bg-[#F5F7F9] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E2E8F0]">
          <div>
            <h1 className="text-2xl font-bold text-[#12304A] flex items-center gap-2.5">
              <ShoppingCart className="w-6 h-6 text-[#1E5A85]" />
              <span>Industrial Procurement Shopping Cart</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review selected spares. You can convert this cart into a multi-seller RFQ quotation with a single click.
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:underline font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-xs p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Your Industrial Cart is Empty</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse our catalog of bearings, welding rods, valves, and PPE items. Add items to your cart to create instant quotation requests.
            </p>
            <button
              onClick={() => setCurrentView('shop')}
              className="px-6 py-2.5 bg-[#12304A] hover:bg-[#1E5A85] text-white text-xs font-semibold rounded-xs transition-colors"
            >
              Browse Industrial Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-3">
              <div className="bg-white border border-[#E2E8F0] rounded-xs shadow-xs divide-y divide-slate-100">
                {cart.map(item => {
                  const unitPrice = item.product.salePrice ?? item.product.price;
                  const lineTotal = unitPrice * item.quantity;

                  return (
                    <div key={item.productId} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#F9FAFB] border border-slate-200 rounded-xs p-1 shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        <div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {item.product.brand} · SKU: {item.product.sku}
                          </div>
                          <h3
                            onClick={() => setCurrentView('product_detail', { productId: item.product.id })}
                            className="text-sm font-semibold text-[#12304A] hover:text-[#1E5A85] cursor-pointer line-clamp-1"
                          >
                            {item.product.name}
                          </h3>
                          <div className="text-xs text-slate-600 mt-0.5">
                            {item.product.isPriceOnRequest ? (
                              <span className="font-semibold text-[#12304A]">Price on Request</span>
                            ) : (
                              <span>৳{unitPrice.toLocaleString()} / {item.product.unit}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Controls */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex items-center border border-slate-300 rounded-xs bg-white">
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center text-xs font-bold text-[#12304A] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right min-w-[90px]">
                          {item.product.isPriceOnRequest ? (
                            <span className="text-xs font-bold text-slate-500">RFQ Item</span>
                          ) : (
                            <span className="text-sm font-bold text-[#12304A] tabular-nums">
                              ৳{lineTotal.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping button */}
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('shop')}
                  className="text-xs font-semibold text-[#1E5A85] hover:text-[#12304A] flex items-center gap-1.5"
                >
                  <span>← Continue Browsing Spares Catalog</span>
                </button>
              </div>
            </div>

            {/* Right Summary Column with Cart-to-RFQ Primary Action */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-[#E2E8F0] rounded-xs p-5 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-[#12304A] border-b border-slate-100 pb-2">
                  Procurement Summary
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Spares Count:</span>
                    <span className="font-bold text-slate-900 tabular-nums">{cartCount} items</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Catalog Estimated Subtotal:</span>
                    <span className="font-bold text-slate-900 tabular-nums">৳{cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>VAT / AIT:</span>
                    <span>Calculated on official invoice</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  
                  {/* Request a quotation from the cart */}
                  <button
                    onClick={cartToRfq}
                    className="w-full py-3.5 px-4 bg-[#F28C28] hover:bg-[#d9771b] text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors shadow-md flex items-center justify-center gap-2 mb-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Request Quotation from Cart</span>
                  </button>

                  <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                    Transfers all cart items directly into an RFQ with custom quantities and technical notes for multiple seller bidding.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#F28C28]" />
                    <span>Competitive Bidding from Verified Sellers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#F28C28]" />
                    <span>Doorstep Delivery inside Bangladesh</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

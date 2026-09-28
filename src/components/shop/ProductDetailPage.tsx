import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../common/ProductCard';
import {
  ShoppingCart,
  FileText,
  Star,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Building,
  Layers,
  HelpCircle
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    categories,
    addToCart,
    addDraftRfqItem,
    setCurrentView
  } = useApp();

  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'reviews'>('specs');

  const product = products.find(p => p.id === selectedProductId) || products[0];
  const category = categories.find(c => c.id === product?.categoryId);

  // Related products from same category
  const relatedProducts = products
    .filter(p => p.categoryId === product?.categoryId && p.id !== product?.id && p.isActive)
    .slice(0, 4);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-base font-semibold text-slate-700">Product not found.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-4 py-2 bg-[#12304A] text-white text-xs font-semibold rounded-xs"
        >
          Back to Products Catalog
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleRequestQuote = () => {
    addDraftRfqItem(product, quantity);
    setCurrentView('rfq_builder');
  };

  return (
    <div className="bg-[#F5F7F9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <button onClick={() => setCurrentView('home')} className="hover:text-[#12304A]">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button onClick={() => setCurrentView('shop')} className="hover:text-[#12304A]">Products</button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => setCurrentView('shop', { categorySlug: category?.slug })}
            className="hover:text-[#12304A]"
          >
            {category?.name || 'Spares'}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#12304A] font-semibold truncate max-w-md">{product.name}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => setCurrentView('shop')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E5A85] hover:text-[#12304A] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Listing</span>
        </button>

        {/* Main Product Box */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs shadow-xs p-6 lg:p-8 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-4/3 bg-[#F9FAFB] rounded-xs p-6 border border-slate-200/80 flex items-center justify-center overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/category-bearings.jpg';
                  }}
                />
                {product.discountPercent && product.discountPercent > 0 ? (
                  <div className="absolute top-3 left-3 bg-[#F28C28] text-white text-xs font-bold px-2.5 py-1 rounded-xs">
                    {product.discountPercent}% OFF CONTRACT
                  </div>
                ) : null}
              </div>

              {/* Trust Badges under image */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 p-2 bg-[#F5F7F9] rounded-xs border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-[#F28C28] shrink-0" />
                  <span>100% Genuine MTC 3.1</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#F5F7F9] rounded-xs border border-slate-200">
                  <Truck className="w-4 h-4 text-[#F28C28] shrink-0" />
                  <span>Ex-Stock Dhaka Ready</span>
                </div>
              </div>
            </div>

            {/* Right Column: Product Metadata & Purchase / RFQ Controls */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                
                {/* Brand & Category Kicker */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-bold text-[#1E5A85] uppercase tracking-wider text-sm">{product.brand}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-600 font-medium">{category?.name}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="font-mono text-slate-400">SKU: {product.sku}</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-[#12304A] leading-snug mb-3">
                  {product.name}
                </h1>

                {/* Rating & Stock Status */}
                <div className="flex flex-wrap items-center gap-4 text-xs mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-slate-800 tabular-nums">{product.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({product.reviewCount} engineer ratings)</span>
                  </div>

                  <span aria-hidden="true" className="text-slate-300">|</span>

                  {product.stock > 0 ? (
                    <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>In Stock ({product.stock} {product.unit} available)</span>
                    </div>
                  ) : (
                    <span className="text-amber-600 font-semibold">Indent / Procurement on Order</span>
                  )}
                </div>

                {/* Short Overview */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {product.shortDescription}
                </p>

                {/* Price Display */}
                <div className="bg-[#F5F7F9] p-4 rounded-xs border border-slate-200/80 mb-6">
                  <div className="flex items-baseline gap-3">
                    {product.isPriceOnRequest ? (
                      <div>
                        <span className="text-2xl font-bold text-[#12304A]">Price on Request</span>
                        <p className="text-xs text-slate-500 mt-0.5">Please submit an RFQ to receive immediate supplier quotations.</p>
                      </div>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-[#12304A] tabular-nums">
                          ৳{product.salePrice ? product.salePrice.toLocaleString() : product.price.toLocaleString()}
                        </span>
                        {product.salePrice && product.salePrice < product.price && (
                          <span className="text-base text-slate-400 line-through tabular-nums">
                            ৳{product.price.toLocaleString()}
                          </span>
                        )}
                        <span className="text-xs text-slate-500 font-medium">per {product.unit} (excl. VAT)</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quantity and Action Buttons */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Quantity ({product.unit}):
                    </span>
                    <div className="flex items-center border border-slate-300 rounded-xs bg-white">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-14 text-center text-xs font-bold text-[#12304A] border-x border-slate-300 py-1.5 outline-none tabular-nums"
                      />
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Dual Action Buttons: Add to Cart & 1-Click Request Quote */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={handleAddToCart}
                      className="py-3 px-6 bg-[#12304A] hover:bg-[#1E5A85] text-white font-semibold text-sm rounded-xs transition-colors shadow-xs flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Shopping Cart</span>
                    </button>

                    <button
                      onClick={handleRequestQuote}
                      className="py-3 px-6 bg-[#F28C28] hover:bg-[#d9771b] text-white font-bold text-sm rounded-xs transition-colors shadow-xs flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Request Quotation (RFQ)</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Corporate Helpdesk Note */}
              <div className="mt-8 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-[#1E5A85]" />
                  <span>Bulk tender quantity available for EPC contractors</span>
                </span>
                <button
                  onClick={() => setCurrentView('contact')}
                  className="font-semibold text-[#1E5A85] hover:underline"
                >
                  Contact Desk →
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Tabbed Specifications and Technical Details */}
        <div className="bg-white border border-[#E2E8F0] rounded-xs shadow-xs p-6 mb-12">
          <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'specs' ? 'text-[#12304A] border-[#F28C28]' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'desc' ? 'text-[#12304A] border-[#F28C28]' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
            >
              Product Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'reviews' ? 'text-[#12304A] border-[#F28C28]' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
            >
              Customer Reviews ({product.reviewCount})
            </button>
          </div>

          {activeTab === 'specs' && (
            <div className="max-w-3xl">
              <table className="w-full text-xs text-left border border-slate-200">
                <tbody>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-2.5 px-4 font-bold text-slate-700 w-1/3">Manufacturer Brand</th>
                    <td className="py-2.5 px-4 text-slate-900 font-semibold">{product.brand}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="py-2.5 px-4 font-bold text-slate-700">Factory SKU Number</th>
                    <td className="py-2.5 px-4 text-slate-900 font-mono">{product.sku}</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-2.5 px-4 font-bold text-slate-700">Category Classification</th>
                    <td className="py-2.5 px-4 text-slate-900">{category?.name}</td>
                  </tr>
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <tr key={key} className={`border-b border-slate-200 ${idx % 2 === 0 ? '' : 'bg-slate-50'}`}>
                      <th className="py-2.5 px-4 font-bold text-slate-700">{key}</th>
                      <td className="py-2.5 px-4 text-slate-900 font-medium tabular-nums">{val}</td>
                    </tr>
                  ))}
                  <tr>
                    <th className="py-2.5 px-4 font-bold text-slate-700">Stock Keeping Unit (UoM)</th>
                    <td className="py-2.5 px-4 text-slate-900">{product.unit}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'desc' && (
            <div className="prose prose-sm max-w-3xl text-slate-700 leading-relaxed space-y-4 text-xs sm:text-sm">
              <p>{product.fullDescription}</p>
              <div className="p-4 bg-[#F5F7F9] border-l-4 border-[#1E5A85] rounded-r-xs">
                <h4 className="font-bold text-xs uppercase text-[#12304A] mb-1">Quality & Sourcing Certification</h4>
                <p className="text-xs text-slate-600">
                  Every batch supplied by ART Industrial Solutions is checked for dimensional tolerances, metallurgical composition, and anti-counterfeiting seals. Mill Test Certificates (MTC EN 10204 3.1) are supplied with invoices upon request.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#F5F7F9] rounded-xs border border-slate-200">
                <div className="text-center pr-4 border-r border-slate-300">
                  <span className="text-3xl font-bold text-[#12304A] tabular-nums">{product.rating.toFixed(1)}</span>
                  <div className="flex text-amber-500 justify-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500">Out of 5 stars</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-900">Verified Plant Engineering Reviews</p>
                  <p>100% of reviews are from verified maintenance engineers and procurement officers in Bangladesh.</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3 bg-white border border-slate-200 rounded-xs text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Engr. S. K. Roy (Maintenance In-Charge, Steel Mill)</span>
                    <span className="text-slate-400 text-[10px]">2 weeks ago</span>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600">
                    Genuine product with clear serial verification. Installed on our secondary cooling roll line and performing flawlessly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products from same category */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#12304A]">Related Industrial Components</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

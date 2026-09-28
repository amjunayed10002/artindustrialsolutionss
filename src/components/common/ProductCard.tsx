import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, ShoppingCart, FileText, CheckCircle2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setCurrentView, addToCart, addDraftRfqItem, categories } = useApp();

  const categoryName = categories.find(c => c.id === product.categoryId)?.name || 'Industrial Spares';

  const handleCardClick = (e: React.MouseEvent) => {
    // Avoid triggering when clicking buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    setCurrentView('product_detail', { productId: product.id });
  };

  const handleQuickRfq = (e: React.MouseEvent) => {
    e.stopPropagation();
    addDraftRfqItem(product, 1);
    setCurrentView('rfq_builder');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white border border-[#E2E8F0] hover:border-[#1E5A85] rounded-xs shadow-xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer overflow-hidden relative"
    >
      {/* Optional Discount Tag (Corner text, not garish pill) */}
      {product.discountPercent && product.discountPercent > 0 ? (
        <div className="absolute top-2 left-2 z-10 bg-[#F28C28] text-white text-[11px] font-bold px-2 py-0.5 rounded-xs tracking-wide">
          {product.discountPercent}% OFF
        </div>
      ) : null}

      {/* Product Image Area */}
      <div className="relative aspect-4/3 bg-[#F9FAFB] p-4 flex items-center justify-center overflow-hidden border-b border-slate-100">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Graceful fallback to avoid broken image frame
            (e.target as HTMLImageElement).src = '/images/category-bearings.jpg';
          }}
        />
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Brand · Category */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-[#1E5A85] uppercase tracking-wider">{product.brand}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="truncate">{categoryName}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-[#1F2933] group-hover:text-[#1E5A85] line-clamp-2 leading-snug mb-1.5 transition-colors">
            {product.name}
          </h3>

          {/* SKU & Stock Info */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
            <span className="font-mono text-slate-400">SKU: {product.sku}</span>
            {product.stock > 0 ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>In Stock ({product.stock})</span>
              </span>
            ) : (
              <span className="text-amber-600 font-medium">Indent Only</span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-semibold text-slate-800 tabular-nums">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & CTA Controls */}
        <div>
          {/* Price Block */}
          <div className="mb-3 pt-2 border-t border-slate-100 flex items-baseline gap-2">
            {product.isPriceOnRequest ? (
              <span className="text-sm font-bold text-[#12304A]">Price on Request</span>
            ) : (
              <>
                <span className="text-base font-bold text-[#12304A] tabular-nums">
                  ৳{product.salePrice ? product.salePrice.toLocaleString() : product.price.toLocaleString()}
                </span>
                {product.salePrice && product.salePrice < product.price && (
                  <span className="text-xs text-slate-400 line-through tabular-nums">
                    ৳{product.price.toLocaleString()}
                  </span>
                )}
                <span className="text-[11px] text-slate-500">/ {product.unit}</span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-1.5 px-2 bg-[#12304A] hover:bg-[#1E5A85] text-white text-xs font-semibold rounded-xs transition-colors flex items-center justify-center gap-1.5"
              title="Add to shopping cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleQuickRfq}
              className="w-full py-1.5 px-2 bg-[#F5F7F9] hover:bg-amber-50 border border-[#E2E8F0] hover:border-[#F28C28] text-[#F28C28] text-xs font-semibold rounded-xs transition-colors flex items-center justify-center gap-1"
              title="Add directly to RFQ quotation list"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>RFQ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

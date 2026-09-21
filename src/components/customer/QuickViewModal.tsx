import React, { useState } from 'react';
import { X, ShoppingBag, Heart, Sparkles, CheckCircle2, Truck } from 'lucide-react';
import { Saree } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { useShop } from '../../context/ShopContext';
import { FALLBACK_SAREE_IMAGE } from '../../data/sampleSarees';
import { Link } from 'react-router-dom';

interface QuickViewModalProps {
  saree: Saree | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ saree, isOpen, onClose }) => {
  const { addItemToCart, toggleWishlist, isInWishlist } = useShop();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !saree) return null;

  const inWishlist = isInWishlist(saree.id);
  const discountPercent = saree.originalPrice
    ? Math.round(((saree.originalPrice - saree.price) / saree.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addItemToCart(saree, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-deepBurgundy/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-brand-gold/40 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-brand-ivory hover:bg-brand-lightPink text-brand-burgundy flex items-center justify-center border border-brand-gold/30 shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image */}
          <div className="relative aspect-[3/4] md:aspect-auto bg-brand-cream/50">
            <img
              src={saree.image || FALLBACK_SAREE_IMAGE}
              alt={saree.name}
              className="w-full h-full object-cover"
            />
            {saree.badge && (
              <span className="absolute top-4 left-4 bg-brand-burgundy/90 text-brand-gold text-xs font-bold px-3 py-1 rounded-full border border-brand-gold/40 shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-gold" /> {saree.badge}
              </span>
            )}
          </div>

          {/* Right Column: Saree Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-white">
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gold">
                TrueWomen Boutique
              </span>

              <h2 className="font-serif text-2xl font-bold text-brand-burgundy leading-snug">
                {saree.name}
              </h2>

              {/* Price & Discount */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-serif text-2xl font-bold text-brand-burgundy">
                  {formatPrice(saree.price)}
                </span>
                {saree.originalPrice && (
                  <span className="text-sm text-brand-muted line-through">
                    {formatPrice(saree.originalPrice)}
                  </span>
                )}
                {discountPercent && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Specifications Pills */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-brand-cream/60 rounded-xl border border-brand-gold/20 text-center text-xs">
                <div>
                  <span className="text-[10px] text-brand-muted uppercase font-bold">Fabric</span>
                  <p className="font-bold text-brand-burgundy">{saree.fabric}</p>
                </div>
                <div>
                  <span className="text-[10px] text-brand-muted uppercase font-bold">Category</span>
                  <p className="font-bold text-brand-burgundy">{saree.category}</p>
                </div>
                <div>
                  <span className="text-[10px] text-brand-muted uppercase font-bold">Color</span>
                  <p className="font-bold text-brand-burgundy">{saree.color}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-brand-charcoal/80 line-clamp-3 leading-relaxed">
                {saree.description}
              </p>

              {/* Stock Meter */}
              <div className="text-xs">
                {saree.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    In Stock ({saree.stock} available)
                  </span>
                ) : (
                  <span className="text-red-600 font-bold">Out of stock</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-3 border-t border-brand-gold/20">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={saree.stock <= 0}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all border border-brand-gold/40 disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4 text-brand-gold" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => toggleWishlist(saree)}
                  className={`p-3.5 rounded-xl border transition-all ${
                    inWishlist
                      ? 'bg-rose-50 border-brand-rose text-brand-rose'
                      : 'bg-brand-ivory border-brand-gold/30 text-brand-burgundy hover:bg-brand-lightPink'
                  }`}
                  title={inWishlist ? "In Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-brand-rose text-brand-rose' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-brand-muted">
                <Link
                  to={`/product/${saree.id}`}
                  onClick={onClose}
                  className="font-bold text-brand-burgundy hover:underline flex items-center gap-1"
                >
                  View Full Product Details →
                </Link>
                <span className="flex items-center gap-1 text-brand-charcoal/70">
                  <Truck className="w-3 h-3 text-brand-gold" /> Free 7-Day Delivery
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

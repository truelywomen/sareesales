import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Sparkles, Heart, Star } from 'lucide-react';
import { Saree } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { useShop } from '../../context/ShopContext';
import { FALLBACK_SAREE_IMAGE } from '../../data/sampleSarees';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  saree: Saree;
}

export const ProductCard: React.FC<ProductCardProps> = ({ saree }) => {
  const { addItemToCart, toggleWishlist, isInWishlist } = useShop();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const inWishlist = isInWishlist(saree.id);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_SAREE_IMAGE;
  };

  const discountPercent = saree.originalPrice
    ? Math.round(((saree.originalPrice - saree.price) / saree.originalPrice) * 100)
    : null;

  return (
    <>
      <div className="group relative bg-white rounded-2xl overflow-hidden border border-brand-gold/25 hover:border-brand-gold/70 shadow-card hover:shadow-2xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
        
        {/* Image Box */}
        <div className="relative aspect-[3/4] overflow-hidden bg-brand-cream/50">
          <Link to={`/product/${saree.id}`} className="block w-full h-full">
            <img
              src={saree.image || FALLBACK_SAREE_IMAGE}
              alt={saree.name}
              onError={handleImageError}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>
          
          {/* Top-Left: Fabric / Luxury Badge */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {saree.badge ? (
              <span className="bg-brand-burgundy/90 text-brand-gold text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-brand-gold/40 shadow-sm backdrop-blur-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-brand-gold" /> {saree.badge}
              </span>
            ) : (
              <span className="bg-brand-ivory/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-brand-burgundy border border-brand-gold/30 shadow-sm">
                {saree.fabric}
              </span>
            )}
            {discountPercent && (
              <span className="bg-emerald-700/95 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm w-max">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Top-Right: Wishlist Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(saree);
            }}
            className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
              inWishlist
                ? 'bg-white text-brand-rose scale-110 border border-brand-rose/40'
                : 'bg-white/80 hover:bg-white text-brand-burgundy/70 hover:text-brand-rose border border-brand-gold/30 backdrop-blur-sm hover:scale-105'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                inWishlist ? 'fill-brand-rose text-brand-rose' : ''
              }`}
            />
          </button>

          {/* Quick View Button on Hover */}
          <div className="absolute inset-x-0 bottom-3 px-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={() => setQuickViewOpen(true)}
              className="w-full bg-brand-ivory/95 hover:bg-white text-brand-burgundy text-xs font-bold py-2 px-3 rounded-xl shadow-lg border border-brand-gold/40 flex items-center justify-center gap-1.5 backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-brand-gold" />
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white space-y-3">
          <div>
            {/* Category & Color */}
            <div className="flex items-center justify-between text-xs text-brand-muted mb-1 font-medium">
              <span className="uppercase tracking-wider text-[11px] font-semibold text-brand-gold">
                {saree.category}
              </span>
              <div className="flex items-center gap-1 text-[11px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 text-amber-800 font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{saree.rating || 4.9}</span>
              </div>
            </div>

            {/* Saree Name */}
            <Link to={`/product/${saree.id}`} className="block">
              <h3 className="font-serif text-base font-bold text-brand-burgundy hover:text-brand-rose line-clamp-1 transition-colors">
                {saree.name}
              </h3>
            </Link>

            {/* Description snippet */}
            <p className="text-xs text-brand-charcoal/70 line-clamp-2 mt-1 font-sans leading-relaxed">
              {saree.description}
            </p>
          </div>

          {/* Price & Action */}
          <div className="pt-3 border-t border-brand-gold/15 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <p className="font-serif text-base sm:text-lg font-bold text-brand-burgundy">
                  {formatPrice(saree.price)}
                </p>
                {saree.originalPrice && (
                  <span className="text-xs text-brand-muted line-through">
                    {formatPrice(saree.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold">
                {saree.stock > 0 ? (saree.stock <= 3 ? `Only ${saree.stock} left!` : 'In Stock') : 'Out of Stock'}
              </p>
            </div>

            <button
              onClick={() => addItemToCart(saree)}
              disabled={saree.stock <= 0}
              className="inline-flex items-center gap-1.5 bg-brand-burgundy hover:bg-brand-wine text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 border border-brand-gold/30 disabled:opacity-50"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-brand-gold" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        saree={saree}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
};

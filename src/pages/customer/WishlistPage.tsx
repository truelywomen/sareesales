import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatters';
import { FALLBACK_SAREE_IMAGE } from '../../data/sampleSarees';
import { EmptyState } from '../../components/common/EmptyState';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, moveWishlistToCart, clearWishlist, addItemToCart } = useShop();

  const handleAddAllToCart = () => {
    wishlist.forEach(saree => {
      if (saree.stock > 0) {
        addItemToCart(saree, 1);
      }
    });
    clearWishlist();
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Explore our exquisite saree collection and click the heart icon on any saree to save your favourites here."
          actionText="Explore Sarees"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-brand-gold/30 shadow-card">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-lightGold/60 px-3 py-1 rounded-full border border-brand-gold/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Saved Favorites
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-burgundy">
            My Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Keep track of your dream sarees and move them to your bag when you are ready.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleAddAllToCart}
            className="inline-flex items-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md border border-brand-gold/40 transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-brand-gold" />
            <span>Move All to Bag</span>
          </button>

          <button
            onClick={clearWishlist}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-red-700 bg-brand-cream/60 hover:bg-red-50 px-4 py-3 rounded-xl border border-brand-gold/20 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear List</span>
          </button>
        </div>
      </div>

      {/* Wishlist Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map(saree => {
          const discountPercent = saree.originalPrice
            ? Math.round(((saree.originalPrice - saree.price) / saree.originalPrice) * 100)
            : null;

          return (
            <div
              key={saree.id}
              className="bg-white rounded-2xl overflow-hidden border border-brand-gold/25 hover:border-brand-gold/60 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Saree Image & Badge */}
              <div className="relative aspect-[3/4] overflow-hidden bg-brand-cream/50 group">
                <Link to={'/product/' + saree.id}>
                  <img
                    src={saree.image || FALLBACK_SAREE_IMAGE}
                    alt={saree.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="absolute top-3 left-3 bg-brand-ivory/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-brand-burgundy border border-brand-gold/30 shadow-sm">
                  {saree.fabric}
                </div>

                {/* Remove from Wishlist Button */}
                <button
                  onClick={() => removeFromWishlist(saree.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 text-red-600 flex items-center justify-center shadow-md border border-red-200 transition-colors"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {discountPercent && (
                  <span className="absolute bottom-3 left-3 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Saree Details & Move to Bag Button */}
              <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-brand-muted mb-1">
                    <span className="uppercase text-[10px] font-semibold text-brand-gold tracking-wider">
                      {saree.category}
                    </span>
                    <span className="text-[11px] font-medium text-brand-charcoal">
                      {saree.color}
                    </span>
                  </div>

                  <Link to={'/product/' + saree.id}>
                    <h3 className="font-serif text-base font-bold text-brand-burgundy hover:text-brand-rose line-clamp-1">
                      {saree.name}
                    </h3>
                  </Link>

                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="font-serif text-lg font-bold text-brand-burgundy">
                      {formatPrice(saree.price)}
                    </span>
                    {saree.originalPrice && (
                      <span className="text-xs text-brand-muted line-through">
                        {formatPrice(saree.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Move to Bag Action */}
                <div className="pt-2 border-t border-brand-gold/15">
                  <button
                    onClick={() => moveWishlistToCart(saree)}
                    disabled={saree.stock <= 0}
                    className="w-full inline-flex items-center justify-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all border border-brand-gold/30 disabled:opacity-50"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

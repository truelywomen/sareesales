import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Truck, Plus, Minus, Heart, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { ProductCard } from '../../components/customer/ProductCard';
import { useToast } from '../../context/ToastContext';
import { FALLBACK_SAREE_IMAGE } from '../../data/sampleSarees';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sarees, addItemToCart, toggleWishlist, isInWishlist } = useShop();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string>('fabric');

  const saree = sarees.find(s => s.id === id);

  if (!saree) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="Saree Not Found"
          description="The saree product you are looking for does not exist or has been removed from our catalog."
          actionText="Back to Shop"
          actionLink="/shop"
        />
      </div>
    );
  }

  const inWishlist = isInWishlist(saree.id);
  const discountPercent = saree.originalPrice
    ? Math.round(((saree.originalPrice - saree.price) / saree.originalPrice) * 100)
    : null;

  // Pick related sarees (same category or fabric, excluding current)
  const relatedSarees = sarees
    .filter(s => s.id !== saree.id && (s.category === saree.category || s.fabric === saree.fabric))
    .slice(0, 4);

  const handleAddToCart = () => {
    addItemToCart(saree, quantity);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast("Product link copied to clipboard!", 'success');
  };

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? '' : name);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-burgundy hover:text-brand-rose transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-brand-gold" />
          <span>Back to Collections</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-burgundy bg-brand-lightGold/50 hover:bg-brand-lightGold px-3.5 py-1.5 rounded-full border border-brand-gold/40 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-brand-gold" />
          <span>Share</span>
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-brand-gold/30 shadow-card">
        
        {/* Left Column: Saree Image & Badges */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-cream border border-brand-gold/20 shadow-md group">
            <img
              src={saree.image || FALLBACK_SAREE_IMAGE}
              alt={saree.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            <div className="absolute top-4 left-4 bg-brand-ivory/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-burgundy border border-brand-gold/30 shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>{saree.category}</span>
            </div>

            {saree.badge && (
              <div className="absolute top-4 right-4 bg-brand-burgundy/95 text-brand-gold px-3.5 py-1.5 rounded-full text-xs font-bold border border-brand-gold/40 shadow-md">
                ★ {saree.badge}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Saree Specs & Purchase */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Title & Brand */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
                TRUELYWOMEN BOUTIQUE
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-burgundy mt-1">
                {saree.name}
              </h1>

              {/* Price & Discounts */}
              <div className="flex items-baseline gap-3 mt-4">
                <p className="font-serif text-3xl font-bold text-brand-burgundy">
                  {formatPrice(saree.price)}
                </p>
                {saree.originalPrice && (
                  <span className="text-base text-brand-muted line-through">
                    {formatPrice(saree.originalPrice)}
                  </span>
                )}
                {discountPercent && (
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    {discountPercent}% OFF Special Offer
                  </span>
                )}
              </div>
            </div>

            {/* Saree Specs Badges */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-brand-cream/60 rounded-2xl border border-brand-gold/20 text-center">
              <div>
                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Fabric</p>
                <p className="font-serif font-bold text-sm text-brand-burgundy mt-0.5">{saree.fabric}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Category</p>
                <p className="font-serif font-bold text-sm text-brand-burgundy mt-0.5">{saree.category}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Color</p>
                <p className="font-serif font-bold text-sm text-brand-burgundy mt-0.5">{saree.color}</p>
              </div>
            </div>

            {/* Stock Availability */}
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-brand-muted">Availability:</span>
              {saree.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  In Stock ({saree.stock} available)
                </span>
              ) : (
                <span className="text-red-700 bg-red-50 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2 border-t border-brand-gold/15">
              <h3 className="font-serif font-bold text-base text-brand-burgundy">
                About this Saree
              </h3>
              <p className="text-sm text-brand-charcoal/80 leading-relaxed font-sans">
                {saree.description}
              </p>
            </div>
          </div>

          {/* Quantity Selector & Add to Cart + Wishlist Actions */}
          <div className="space-y-4 pt-4 border-t border-brand-gold/20">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-burgundy">
                Quantity:
              </label>
              
              <div className="flex items-center gap-2 bg-brand-cream border border-brand-gold/30 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white text-brand-burgundy flex items-center justify-center shadow-sm hover:bg-brand-lightPink"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-brand-burgundy">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(saree.stock, quantity + 1))}
                  disabled={quantity >= saree.stock}
                  className="w-8 h-8 rounded-lg bg-white text-brand-burgundy flex items-center justify-center shadow-sm hover:bg-brand-lightPink disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={saree.stock <= 0}
                className="flex-1 inline-flex items-center justify-center gap-3 bg-brand-burgundy hover:bg-brand-wine text-white py-4 rounded-xl font-bold text-base transition-all shadow-lg hover:shadow-xl border border-brand-gold/40 disabled:opacity-50 active:scale-95"
              >
                <ShoppingBag className="w-5 h-5 text-brand-gold" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(saree)}
                className={`p-4 rounded-xl border transition-all ${
                  inWishlist
                    ? 'bg-rose-50 border-brand-rose text-brand-rose'
                    : 'bg-brand-ivory border-brand-gold/40 text-brand-burgundy hover:bg-brand-lightPink'
                }`}
                title={inWishlist ? "Saved in Wishlist" : "Save to Wishlist"}
              >
                <Heart className={`w-6 h-6 ${inWishlist ? 'fill-brand-rose text-brand-rose' : ''}`} />
              </button>
            </div>

            {/* Guarantee Trust Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs text-brand-charcoal/80 pt-2">
              <div className="flex items-center gap-2 bg-brand-ivory p-3 rounded-xl border border-brand-gold/20">
                <Truck className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>Free 7-Day India Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-brand-ivory p-3 rounded-xl border border-brand-gold/20">
                <ShieldCheck className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>Authentic Weave Assured</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* LUXURY ACCORDIONS: CRAFTSMANSHIP, STYLING, CARE & DELIVERY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-gold/30 shadow-card space-y-4">
        
        {/* Accordion 1: Fabric & Craftsmanship */}
        <div className="border-b border-brand-gold/20 pb-4">
          <button
            onClick={() => toggleAccordion('fabric')}
            className="w-full flex items-center justify-between text-left py-2 font-serif text-lg font-bold text-brand-burgundy"
          >
            <span>Fabric &amp; Artisan Craftsmanship</span>
            {openAccordion === 'fabric' ? <ChevronUp className="w-5 h-5 text-brand-gold" /> : <ChevronDown className="w-5 h-5 text-brand-gold" />}
          </button>
          {openAccordion === 'fabric' && (
            <div className="pt-2 text-xs sm:text-sm text-brand-charcoal/80 space-y-2 leading-relaxed animate-in fade-in duration-200">
              <p>
                Each TruelyWomen saree is individually handwoven on traditional pit looms by skilled artisans with generations of weaving expertise.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-brand-charcoal/70">
                <li>Material: 100% genuine {saree.fabric}</li>
                <li>Length: 5.5 meters saree length with 0.8 meter matching unstitched blouse piece</li>
                <li>Zari: High-grade metallic gold/silver thread brocade</li>
                <li>Origin: Authentic regional handloom clusters across India</li>
              </ul>
            </div>
          )}
        </div>

        {/* Accordion 2: Delivery & Express Shipping */}
        <div className="border-b border-brand-gold/20 pb-4">
          <button
            onClick={() => toggleAccordion('delivery')}
            className="w-full flex items-center justify-between text-left py-2 font-serif text-lg font-bold text-brand-burgundy"
          >
            <span>Guaranteed 7-Day Express Delivery &amp; Tracking</span>
            {openAccordion === 'delivery' ? <ChevronUp className="w-5 h-5 text-brand-gold" /> : <ChevronDown className="w-5 h-5 text-brand-gold" />}
          </button>
          {openAccordion === 'delivery' && (
            <div className="pt-2 text-xs sm:text-sm text-brand-charcoal/80 space-y-2 leading-relaxed animate-in fade-in duration-200">
              <p>
                Orders are processed and dispatched with express courier partners. You receive a live timeline tracker and personal status updates.
              </p>
              <p className="text-xs text-brand-charcoal/70">
                Free insured doorstep delivery across India within 7 calendar days.
              </p>
            </div>
          )}
        </div>

        {/* Accordion 3: Wash & Care */}
        <div>
          <button
            onClick={() => toggleAccordion('care')}
            className="w-full flex items-center justify-between text-left py-2 font-serif text-lg font-bold text-brand-burgundy"
          >
            <span>Care Instructions</span>
            {openAccordion === 'care' ? <ChevronUp className="w-5 h-5 text-brand-gold" /> : <ChevronDown className="w-5 h-5 text-brand-gold" />}
          </button>
          {openAccordion === 'care' && (
            <div className="pt-2 text-xs sm:text-sm text-brand-charcoal/80 space-y-1.5 leading-relaxed animate-in fade-in duration-200">
              <p>• Dry Clean Only recommended to preserve authentic zari sheen and delicate silk luster.</p>
              <p>• Store folded in a clean muslin cloth bag in a cool, moisture-free wardrobe.</p>
              <p>• Low-temperature steam iron from reverse side only.</p>
            </div>
          )}
        </div>

      </div>

      {/* RELATED SAREES SECTION */}
      {relatedSarees.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-brand-gold/20">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                Recommendations
              </span>
              <h2 className="font-serif text-2xl font-bold text-brand-burgundy">
                You May Also Adore
              </h2>
            </div>
            <Link to="/shop" className="text-xs font-bold text-brand-burgundy hover:underline">
              View All Sarees →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedSarees.map(s => (
              <ProductCard key={s.id} saree={s} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

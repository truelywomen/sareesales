import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Award, Heart, Star, CheckCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../../components/customer/ProductCard';
import { BRAND_INFO } from '../../config/authConfig';

const CATEGORIES_SHOWCASE = [
  {
    name: 'Kanchipuram Silk',
    desc: 'Pure Mulberry Silk with pure Gold Zari',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    category: 'Kanchipuram'
  },
  {
    name: 'Banarasi Brocade',
    desc: 'Royal Mughal Weaves & Kadwa Jaal',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    category: 'Banarasi'
  },
  {
    name: 'Party Wear Drape',
    desc: 'Modern Organza, Georgette & Sequin Glam',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
    category: 'Party Wear'
  },
  {
    name: 'Handloom Traditions',
    desc: 'Organic Linen, Cotton Jamdani & Chanderi',
    image: 'https://images.unsplash.com/photo-1610030469668-966964032d84?auto=format&fit=crop&w=600&q=80',
    category: 'Traditional'
  }
];

const TESTIMONIALS = [
  {
    name: 'Ananya Deshmukh',
    city: 'Mumbai',
    comment: 'The Kanchipuram silk saree I ordered for my sister’s wedding was breathtaking! Pure luxury weave and delivered in just 4 days.',
    rating: 5,
    saree: 'Pink Kanchipuram Silk Saree'
  },
  {
    name: 'Pooja Iyer',
    city: 'Bengaluru',
    comment: 'TrueWomen has the most authentic handloom collection online. The fabric is soft, genuine silk, and the zari shines subtly.',
    rating: 5,
    saree: 'Royal Red Banarasi Brocade'
  },
  {
    name: 'Meera Nambiar',
    city: 'Chennai',
    comment: 'Customer support reached out immediately after order placement. The tracking timeline was very smooth and accurate.',
    rating: 5,
    saree: 'Emerald Green Organza Saree'
  }
];

export const HomePage: React.FC = () => {
  const { sarees, setFilters } = useShop();

  // Pick top 8 featured sarees for home display
  const featuredSarees = sarees.slice(0, 8);

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-ivory via-brand-cream to-brand-lightGold/20 border-b border-brand-gold/30 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 bg-brand-ivory px-4 py-1.5 rounded-full border border-brand-gold/50 shadow-sm">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <span className="text-xs font-bold uppercase tracking-widest text-brand-burgundy">
                  {BRAND_INFO.name.toUpperCase()} • SINCE 2026
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-burgundy leading-[1.12]">
                Timeless Elegance &amp; Authentic Indian Sarees
              </h1>

              <p className="text-base sm:text-lg text-brand-charcoal/80 max-w-2xl leading-relaxed font-sans">
                Discover the royalty of authentic Indian heritage. Handcrafted Kanchipuram silks, Banarasi brocades, sheer organzas, and effortless party drapes tailored for modern grace.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-burgundy hover:bg-brand-wine text-white px-8 py-4 rounded-xl text-base font-semibold transition-all shadow-lg hover:shadow-xl border border-brand-gold/40 group active:scale-95"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-brand-gold" />
                </Link>

                <Link
                  to="/wishlist"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-ivory hover:bg-brand-cream text-brand-burgundy px-8 py-4 rounded-xl text-base font-semibold border border-brand-gold/50 transition-all shadow-sm hover:shadow-md"
                >
                  <Heart className="w-4 h-4 text-brand-rose" />
                  <span>View Saved Wishlist</span>
                </Link>
              </div>

              {/* Guarantees */}
              <div className="pt-8 border-t border-brand-gold/25 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="font-serif text-2xl font-bold text-brand-burgundy">100%</p>
                  <p className="text-xs text-brand-muted font-medium">Pure Handloom Weaves</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-brand-burgundy">7 Days</p>
                  <p className="text-xs text-brand-muted font-medium">Guaranteed Express Delivery</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-brand-burgundy">Free</p>
                  <p className="text-xs text-brand-muted font-medium">Insured Shipping India-Wide</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-tr from-brand-gold/30 via-brand-rose/20 to-transparent rounded-3xl blur-xl" />
                
                <div className="relative bg-white rounded-3xl p-3 shadow-2xl border border-brand-gold/40 overflow-hidden">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden relative group">
                    <img
                      src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
                      alt="Featured Saree"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-brand-burgundy text-brand-gold text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-brand-gold/40">
                      ★ Royal Heritage Pick
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-brand-ivory/95 backdrop-blur-md p-4 rounded-xl border border-brand-gold/40 shadow-lg">
                      <p className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">Spotlight Saree</p>
                      <h4 className="font-serif text-base font-bold text-brand-burgundy">Pink Kanchipuram Pure Silk</h4>
                      <p className="text-xs text-brand-muted mt-0.5">Handcrafted Zari Brocade • ₹3,499</p>
                      <Link
                        to="/product/SAR-1001"
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-burgundy hover:underline mt-2"
                      >
                        Order Spotlight Saree →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORY EXPLORER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-lightGold/60 px-3 py-1 rounded-full border border-brand-gold/30">
            Curated Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-burgundy">
            Shop by Saree Craft
          </h2>
          <p className="text-sm text-brand-charcoal/70 max-w-xl mx-auto">
            Explore authentic handloom traditions from master weavers across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES_SHOWCASE.map((cat) => (
            <Link
              key={cat.name}
              to="/shop"
              onClick={() => setFilters(prev => ({ ...prev, category: cat.category }))}
              className="group relative rounded-2xl overflow-hidden border border-brand-gold/30 shadow-card hover:shadow-2xl transition-all duration-300 aspect-[3/4] flex flex-col justify-end p-6"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deepBurgundy/90 via-brand-deepBurgundy/40 to-transparent" />
              
              <div className="relative z-10 text-white space-y-1">
                <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">
                  Explore Weave
                </p>
                <h3 className="font-serif text-xl font-bold group-hover:text-brand-lightGold transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-white/80 line-clamp-1">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED SAREE COLLECTION SECTION */}
      <section id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-brand-gold/20">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-lightGold/50 px-3 py-1 rounded-full border border-brand-gold/30">
              <Sparkles className="w-3.5 h-3.5" /> Handpicked Selections
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-burgundy">
              Trending Sarees
            </h2>
            <p className="text-sm text-brand-charcoal/70">
              Timeless elegance, crafted for weddings, festivals, and evening galas.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-burgundy hover:text-brand-rose bg-brand-lightGold/40 hover:bg-brand-lightGold px-4 py-2.5 rounded-xl border border-brand-gold/40 transition-all self-start sm:self-auto"
          >
            <span>View All ({sarees.length})</span>
            <ArrowRight className="w-4 h-4 text-brand-gold" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSarees.map(saree => (
            <ProductCard key={saree.id} saree={saree} />
          ))}
        </div>

        {/* View All CTA Banner */}
        <div className="mt-14 bg-gradient-to-r from-brand-deepBurgundy via-brand-burgundy to-brand-deepBurgundy rounded-3xl p-8 sm:p-12 text-center text-white border border-brand-gold/40 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold bg-black/30 px-3.5 py-1 rounded-full border border-brand-gold/30 inline-block">
              ✦ Handloom Heritage Boutique
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold">
              Looking for a specific fabric or bridal shade?
            </h3>
            <p className="text-sm text-brand-cream/80">
              Filter through our entire catalog by pure silk, linen, organza, price, and authentic temple borders.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-brand-gold hover:bg-amber-400 text-brand-deepBurgundy font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all active:scale-95"
              >
                <span>Browse All Sarees</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS / TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-lightGold/60 px-3 py-1 rounded-full border border-brand-gold/30">
            Customer Love
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-burgundy">
            Trusted by Thousands of Women
          </h2>
          <p className="text-sm text-brand-charcoal/70 max-w-xl mx-auto">
            Read verified customer experiences from saree connoisseurs across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-brand-gold/25 shadow-card space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-brand-gold/15 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-brand-burgundy">{t.name}</p>
                  <p className="text-[11px] text-brand-muted">{t.city}, India</p>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LUXURY BRAND GUARANTEE CARDS */}
      <section className="bg-brand-cream/60 border-y border-brand-gold/25 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="p-6 bg-white rounded-2xl border border-brand-gold/20 shadow-card space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-lightGold text-brand-burgundy mx-auto flex items-center justify-center border border-brand-gold">
                <Award className="w-6 h-6 text-brand-burgundy" />
              </div>
              <h3 className="font-serif text-lg font-bold text-brand-burgundy">Pure Handloom Quality</h3>
              <p className="text-xs text-brand-charcoal/70 leading-relaxed font-sans">
                Every saree in our collection is handpicked from master weavers across Kanchipuram, Banaras, and Bengal.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-brand-gold/20 shadow-card space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-lightPink text-brand-rose mx-auto flex items-center justify-center border border-brand-rose/30">
                <Truck className="w-6 h-6 text-brand-rose" />
              </div>
              <h3 className="font-serif text-lg font-bold text-brand-burgundy">7-Day Express Delivery</h3>
              <p className="text-xs text-brand-charcoal/70 leading-relaxed font-sans">
                Every order comes with guaranteed delivery within 7 days with live status timeline tracking.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-brand-gold/20 shadow-card space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-lightGold text-brand-burgundy mx-auto flex items-center justify-center border border-brand-gold">
                <ShieldCheck className="w-6 h-6 text-brand-burgundy" />
              </div>
              <h3 className="font-serif text-lg font-bold text-brand-burgundy">Direct TrueWomen Care</h3>
              <p className="text-xs text-brand-charcoal/70 leading-relaxed font-sans">
                Curated and managed exclusively by TrueWomen owner administration with prompt personal customer support.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

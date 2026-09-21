import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { BRAND_INFO } from '../../config/authConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-brand-ivory to-brand-cream border-t border-brand-gold/30 text-brand-charcoal pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-brand-gold/20">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="TrueWomen"
                className="w-12 h-12 rounded-full object-cover border border-brand-gold"
              />
              <div>
                <h3 className="font-serif text-2xl font-bold text-brand-burgundy tracking-wide">
                  {BRAND_INFO.name}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
                  Luxury Handloom Sarees
                </p>
              </div>
            </div>
            
            <p className="text-sm text-brand-charcoal/80 max-w-sm italic font-serif leading-relaxed">
              "Elegance woven into every thread. Discover timeless Indian sarees crafted for every celebratory moment."
            </p>

            <div className="flex items-center gap-2 text-xs text-brand-burgundy/80 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Authentic Indian Heritage Boutique</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-brand-burgundy uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-brand-charcoal/80">
              <li>
                <Link to="/" className="hover:text-brand-rose transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-brand-rose transition-colors">
                  Shop Sarees
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-brand-rose transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-brand-rose transition-colors">
                  Track My Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-brand-rose transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-brand-rose text-xs font-semibold text-brand-gold inline-flex items-center gap-1 mt-2">
                  <Shield className="w-3 h-3" /> Owner Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-brand-burgundy uppercase tracking-wider">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-charcoal/80">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>{BRAND_INFO.contactEmail}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>{BRAND_INFO.contactPhone}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                <span>Heritage Handloom Plaza, MG Road, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <p>© {new Date().getFullYear()} {BRAND_INFO.name}. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-brand-burgundy/80">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-brand-rose fill-brand-rose" />
            <span>for Indian saree heritage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

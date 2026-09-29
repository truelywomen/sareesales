import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Menu, X, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { BRAND_INFO } from '../../config/authConfig';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, wishlistCount } = useShop();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-brand-ivory/95 backdrop-blur-md border-b border-brand-gold/25 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative overflow-hidden rounded-full p-0.5 border border-brand-gold/50 shadow-sm group-hover:border-brand-gold transition-colors bg-brand-lightGold/20">
              <img
                src="/logo.jpg"
                alt="TrueWomen Logo"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-brand-burgundy">
                  {BRAND_INFO.name}
                </span>
                <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
              </div>
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-brand-gold -mt-1">
                Luxury Sarees
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors tracking-wide relative py-1 ${
                isActive('/') ? 'text-brand-burgundy font-bold' : 'text-brand-charcoal/80 hover:text-brand-burgundy'
              }`}
            >
              Home
              {isActive('/') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold rounded-full" />
              )}
            </Link>

            <Link
              to="/shop"
              className={`text-sm font-medium transition-colors tracking-wide relative py-1 ${
                isActive('/shop') ? 'text-brand-burgundy font-bold' : 'text-brand-charcoal/80 hover:text-brand-burgundy'
              }`}
            >
              Shop Sarees
              {isActive('/shop') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold rounded-full" />
              )}
            </Link>

            <Link
              to="/wishlist"
              className={`text-sm font-medium transition-colors tracking-wide relative py-1 ${
                isActive('/wishlist') ? 'text-brand-burgundy font-bold' : 'text-brand-charcoal/80 hover:text-brand-burgundy'
              }`}
            >
              Wishlist
              {isActive('/wishlist') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold rounded-full" />
              )}
            </Link>

            <Link
              to="/orders"
              className={`text-sm font-medium transition-colors tracking-wide relative py-1 ${
                isActive('/orders') ? 'text-brand-burgundy font-bold' : 'text-brand-charcoal/80 hover:text-brand-burgundy'
              }`}
            >
              My Orders
              {isActive('/orders') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold rounded-full" />
              )}
            </Link>
          </nav>

          {/* Action Items: Wishlist & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Header Icon */}
            <Link
              to="/wishlist"
              className="relative p-2.5 text-brand-burgundy hover:text-brand-wine rounded-full hover:bg-brand-rose/10 transition-colors"
              aria-label="Wishlist"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-brand-rose text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-brand-ivory shadow-md animate-in zoom-in duration-200">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Header Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 text-brand-burgundy hover:text-brand-wine rounded-full hover:bg-brand-rose/10 transition-colors"
              aria-label="Shopping Cart"
              title="My Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-brand-burgundy text-brand-gold text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-brand-ivory shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-brand-burgundy hover:bg-brand-rose/10 rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-ivory border-b border-brand-gold/20 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-base font-medium ${
              isActive('/') ? 'text-brand-burgundy font-bold border-l-4 border-brand-gold pl-3' : 'text-brand-charcoal hover:text-brand-burgundy'
            }`}
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-base font-medium ${
              isActive('/shop') ? 'text-brand-burgundy font-bold border-l-4 border-brand-gold pl-3' : 'text-brand-charcoal hover:text-brand-burgundy'
            }`}
          >
            Shop Sarees
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between py-2 text-base font-medium ${
              isActive('/wishlist') ? 'text-brand-burgundy font-bold border-l-4 border-brand-gold pl-3' : 'text-brand-charcoal hover:text-brand-burgundy'
            }`}
          >
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="bg-brand-rose text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-base font-medium ${
              isActive('/orders') ? 'text-brand-burgundy font-bold border-l-4 border-brand-gold pl-3' : 'text-brand-charcoal hover:text-brand-burgundy'
            }`}
          >
            My Orders
          </Link>
        </div>
      )}
    </header>
  );
};

import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, PlusCircle, LogOut, Store, Menu, X, User } from 'lucide-react';
import { useVendorAuth } from '../context/VendorAuthContext';
import { BRAND_INFO } from '../config/authConfig';

export const VendorLayout: React.FC = () => {
  const { vendor, isAuthenticated, logout } = useVendorAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  if (!isAuthenticated || !vendor) {
    return <Navigate to="/vendor" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/vendor');
  };

  const navItems = [
    { label: 'Vendor Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
    { label: 'My Submissions', path: '/vendor/sarees', icon: ShoppingBag },
    { label: '+ Add Saree to Sell', path: '/vendor/sarees/add', icon: PlusCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-5 bg-gradient-to-b from-brand-deepBurgundy via-[#3d091e] to-brand-deepBurgundy text-brand-ivory">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-brand-gold/30">
          <img
            src="/logo.jpg"
            alt={BRAND_INFO.name}
            className="w-11 h-11 rounded-full object-cover border border-brand-gold"
          />
          <div>
            <h2 className="font-serif text-lg font-bold text-brand-ivory tracking-wide">
              {BRAND_INFO.name}
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-bold">
              Vendor & Sales Portal
            </p>
          </div>
        </div>

        {/* Vendor Profile Card */}
        <div className="bg-brand-burgundy/60 border border-brand-gold/25 rounded-2xl p-3.5 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center border border-brand-gold/40 flex-shrink-0">
              <User className="w-4 h-4 text-brand-gold" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-brand-ivory truncate">{vendor.username}</p>
              <p className="text-[11px] text-brand-gold/80 truncate">{vendor.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-brand-gold text-brand-deepBurgundy font-bold shadow-md'
                    : 'text-brand-ivory/80 hover:bg-brand-burgundy hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-brand-gold/20 space-y-2">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-brand-gold bg-brand-burgundy/60 hover:bg-brand-burgundy transition-colors"
        >
          <Store className="w-4 h-4" />
          <span>View Customer Store</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-300 hover:bg-red-950/60 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Vendor Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream/30 flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-30 shadow-2xl">
        {sidebarContent}
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-brand-deepBurgundy text-brand-ivory px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-brand-gold" />
          <div>
            <span className="font-serif font-bold text-sm tracking-wider text-brand-gold block">
              VENDOR PORTAL
            </span>
            <span className="text-[10px] text-brand-ivory/70 block truncate max-w-[150px]">
              {vendor.username}
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="p-2 text-brand-gold hover:bg-brand-burgundy rounded-lg"
        >
          {mobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-full bg-brand-deepBurgundy h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

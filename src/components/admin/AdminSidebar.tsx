import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  History,
  ShoppingBag,
  PlusCircle,
  RotateCcw,
  LogOut,
  Sparkles,
  Menu,
  X,
  Store
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { ConfirmModal } from '../common/ConfirmModal';
import { BRAND_INFO } from '../../config/authConfig';

export const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const { resetAllDemoData } = useShop();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleResetConfirm = () => {
    resetAllDemoData();
    setShowResetModal(false);
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Pending Orders', path: '/admin/orders', icon: Clock },
    { label: 'Order History', path: '/admin/history', icon: History },
    { label: 'Saree Inventory', path: '/admin/sarees', icon: ShoppingBag },
    { label: '+ Add New Saree', path: '/admin/sarees/add', icon: PlusCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-5 bg-brand-deepBurgundy text-brand-ivory">
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
              Owner Admin Portal
            </p>
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

      {/* Bottom Actions: View Site, Reset Demo Data, Logout */}
      <div className="pt-6 border-t border-brand-gold/20 space-y-2">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-brand-gold bg-brand-burgundy/60 hover:bg-brand-burgundy transition-colors"
        >
          <Store className="w-4 h-4" />
          <span>View Customer Website</span>
        </Link>

        <button
          onClick={() => setShowResetModal(true)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-amber-300 hover:bg-amber-900/40 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Data</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-300 hover:bg-red-950/60 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Owner Logout</span>
        </button>
      </div>

      <ConfirmModal
        isOpen={showResetModal}
        title="Reset Demo Data?"
        message="This action will restore the initial 18+ sample sarees dataset and clear all customer cart, wishlist and order history stored in localStorage. Are you sure?"
        confirmText="Reset Everything"
        cancelText="Cancel"
        type="warning"
        onConfirm={handleResetConfirm}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-30 shadow-2xl">
        {sidebarContent}
      </aside>

      {/* Mobile Header Bar & Drawer Toggle */}
      <div className="lg:hidden bg-brand-deepBurgundy text-brand-ivory px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full border border-brand-gold" />
          <span className="font-serif font-bold text-sm tracking-wider text-brand-gold">TRUEWOMEN ADMIN</span>
        </div>

        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="p-2 text-brand-gold hover:bg-brand-burgundy rounded-lg"
        >
          {mobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
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
    </>
  );
};

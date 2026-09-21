import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Truck, Calendar, Sparkles, PackageCheck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatDate } from '../../utils/dateUtils';
import { formatPrice } from '../../utils/formatters';

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const { orders } = useShop();

  const orderId = location.state?.orderId;
  const order = orders.find(o => o.id === orderId) || orders[0];

  if (!order) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      
      {/* Animated Success Badge */}
      <div className="relative mx-auto w-24 h-24 rounded-full bg-brand-lightGold flex items-center justify-center border-2 border-brand-gold shadow-xl animate-bounce">
        <CheckCircle2 className="w-14 h-14 text-brand-burgundy" />
      </div>

      <div className="space-y-4 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-lightGold/80 px-4 py-1.5 rounded-full border border-brand-gold/30 inline-block shadow-sm">
          <Sparkles className="w-3.5 h-3.5 inline mr-1 text-brand-burgundy" /> Order Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-burgundy">
          Order Placed Successfully!
        </h1>

        {/* ✨ FLASH MESSAGE CARD */}
        <div className="relative overflow-hidden rounded-2xl shadow-lg border border-brand-gold/40"
          style={{
            background: 'linear-gradient(135deg, #7c1c2e 0%, #a0283e 50%, #7c1c2e 100%)',
            animation: 'flashCardPulse 2.5s ease-in-out infinite',
          }}>
          {/* Shimmer sweep */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)',
              animation: 'shimmerSweep 2.2s linear infinite',
            }} />

          {/* Glowing ring top-right */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #f5c842 0%, transparent 70%)' }} />

          <div className="relative z-10 flex items-start gap-3 px-5 py-4">
            {/* Icon badge */}
            <div className="flex-shrink-0 mt-0.5 w-9 h-9 rounded-full flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, #f5c842, #e2a800)', animation: 'iconPop 1.8s ease-in-out infinite' }}>
              <span className="text-base">📞</span>
            </div>

            <div className="flex flex-col gap-1 text-left">
              {/* Line 1 */}
              <p className="text-sm font-bold tracking-wide text-brand-gold/90 uppercase">
                ✦ Order Confirmed!
              </p>
              {/* Line 2 – the star text */}
              <p className="text-white font-semibold text-sm sm:text-base leading-snug">
                Your order placed successfully &amp;{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 font-extrabold text-brand-gold drop-shadow-sm"
                    style={{ textShadow: '0 0 8px rgba(245,200,66,0.6)' }}>
                    our team will contact you shortly!
                  </span>
                  {/* underline glow */}
                  <span className="absolute left-0 -bottom-0.5 w-full h-0.5 rounded-full opacity-70"
                    style={{ background: 'linear-gradient(90deg, transparent, #f5c842, transparent)' }} />
                </span>
              </p>
            </div>
          </div>

          {/* Bottom ticker bar */}
          <div className="relative overflow-hidden h-6 bg-black/20 flex items-center">
            <p className="whitespace-nowrap text-[11px] font-semibold text-brand-gold/80 tracking-widest px-4"
              style={{ animation: 'tickerScroll 8s linear infinite' }}>
              📦 &nbsp; We'll reach out soon &nbsp;•&nbsp; Thank you for shopping with TrueWomen &nbsp;•&nbsp; Estimated delivery in 7 days &nbsp;•&nbsp; 📦
            </p>
          </div>
        </div>

        {/* Keyframes injected inline */}
        <style>{`
          @keyframes flashCardPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(245,200,66,0); }
            50%       { box-shadow: 0 0 18px 4px rgba(245,200,66,0.35); }
          }
          @keyframes shimmerSweep {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
          @keyframes iconPop {
            0%, 100% { transform: scale(1); }
            50%       { transform: scale(1.12); }
          }
          @keyframes tickerScroll {
            0%   { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

        <p className="text-xs text-brand-muted">
          Thank you for shopping with <strong className="text-brand-burgundy font-serif font-bold">TrueWomen</strong>.
        </p>
      </div>

      {/* Order Details Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-gold/30 shadow-card text-left space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-brand-gold/20">
          <div>
            <p className="text-xs text-brand-muted uppercase font-bold tracking-wider">Order ID</p>
            <p className="font-serif text-2xl font-bold text-brand-burgundy">{order.id}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-brand-muted uppercase font-bold tracking-wider">Order Date</p>
            <p className="text-sm font-semibold text-brand-charcoal">{formatDate(order.orderedAt)}</p>
          </div>
        </div>

        {/* Dynamic +7 Days Delivery Box */}
        <div className="bg-brand-cream/80 p-4 rounded-2xl border border-brand-gold/30 flex items-center gap-4">
          <div className="p-3 bg-brand-burgundy text-brand-gold rounded-xl shadow-sm">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-brand-gold tracking-wider">Guaranteed Delivery</p>
            <p className="font-serif text-lg font-bold text-brand-burgundy">
              Expected Delivery: {formatDate(order.expectedDelivery)}
            </p>
            <p className="text-[11px] text-brand-muted">Automatically calculated date (Order Date + 7 Days)</p>
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-brand-burgundy text-base border-b border-brand-gold/15 pb-2">
            Items Ordered
          </h4>
          {order.items.map(item => (
            <div key={item.saree.id} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-3">
                <img
                  src={item.saree.image}
                  alt={item.saree.name}
                  className="w-12 h-14 rounded-lg object-cover border border-brand-gold/20"
                />
                <div>
                  <p className="font-bold text-brand-burgundy font-serif">{item.saree.name}</p>
                  <p className="text-xs text-brand-muted">{item.saree.fabric} • Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-bold text-brand-burgundy">
                {formatPrice(item.saree.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Total Paid */}
        <div className="pt-4 border-t border-brand-gold/20 flex items-center justify-between font-serif text-xl font-bold text-brand-burgundy">
          <span>Total Amount</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* Action Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white px-8 py-3.5 rounded-xl font-bold shadow-lg border border-brand-gold/40 transition-all"
        >
          <PackageCheck className="w-5 h-5 text-brand-gold" />
          <span>View My Orders</span>
        </Link>

        <Link
          to="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-ivory hover:bg-brand-cream text-brand-burgundy px-8 py-3.5 rounded-xl font-bold border border-brand-gold/40 shadow-sm transition-all"
        >
          <ShoppingBag className="w-5 h-5 text-brand-gold" />
          <span>Continue Shopping</span>
        </Link>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CustomerInfo, Order } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import { useToast } from '../../context/ToastContext';

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, placeOrder } = useShop();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (cart.length === 0 && !showSuccessModal) {
    navigate('/cart');
    return null;
  }

  const validate = (): boolean => {
    const errs: Partial<Record<keyof CustomerInfo, string>> = {};

    if (!formData.name.trim()) errs.name = 'Full Name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s]{8,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Enter a valid phone number';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errs.email = 'Enter a valid email address';
    }

    if (!formData.address.trim()) errs.address = 'Delivery address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.pincode.trim()) {
      errs.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Enter a valid 6-digit Pincode';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the errors in customer details form', 'error');
      return;
    }

    const order = await placeOrder(formData);
    if (order) {
      setPlacedOrder(order);
      setShowSuccessModal(true);
    }
  };

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/cart')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-burgundy hover:text-brand-rose transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 text-brand-gold" />
          <span>Back to Cart</span>
        </button>
        <h1 className="font-serif text-3xl font-bold text-brand-burgundy">
          Shipping & Delivery Details
        </h1>
        <p className="text-xs text-brand-muted mt-1">
          Complete your customer order details for prompt 7-day delivery.
        </p>
      </div>

      {/* Main Grid: Form Left, Summary Right (Desktop) / Summary Bottom (Mobile) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Customer Form Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-brand-gold/30 shadow-card space-y-6">
          <h3 className="font-serif text-xl font-bold text-brand-burgundy border-b border-brand-gold/20 pb-3">
            Customer Information
          </h3>

          <div className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy mb-1">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Priya Sharma"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-sm focus:ring-2 focus:ring-brand-gold/50 focus:outline-none ${
                  errors.name ? 'border-red-500' : 'border-brand-gold/30'
                }`}
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            {/* Phone & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-sm focus:ring-2 focus:ring-brand-gold/50 focus:outline-none ${
                    errors.phone ? 'border-red-500' : 'border-brand-gold/30'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="priya@example.com"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-sm focus:ring-2 focus:ring-brand-gold/50 focus:outline-none ${
                    errors.email ? 'border-red-500' : 'border-brand-gold/30'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy mb-1">
                Full Street Address *
              </label>
              <textarea
                rows={3}
                placeholder="House/Flat No., Building Name, Street/Locality"
                value={formData.address}
                onChange={e => handleChange('address', e.target.value)}
                className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-sm focus:ring-2 focus:ring-brand-gold/50 focus:outline-none ${
                  errors.address ? 'border-red-500' : 'border-brand-gold/30'
                }`}
              />
              {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
            </div>

            {/* City, State, Pincode Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy mb-1">
                  City *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={formData.city}
                  onChange={e => handleChange('city', e.target.value)}
                  className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-sm focus:ring-2 focus:ring-brand-gold/50 focus:outline-none ${
                    errors.city ? 'border-red-500' : 'border-brand-gold/30'
                  }`}
                />
                {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy mb-1">
                  State *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra"
                  value={formData.state}
                  onChange={e => handleChange('state', e.target.value)}
                  className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-sm focus:ring-2 focus:ring-brand-gold/50 focus:outline-none ${
                    errors.state ? 'border-red-500' : 'border-brand-gold/30'
                  }`}
                />
                {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-burgundy mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  placeholder="400001"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={e => handleChange('pincode', e.target.value)}
                  className={`w-full px-4 py-3 bg-brand-cream/50 border rounded-xl text-sm focus:ring-2 focus:ring-brand-gold/50 focus:outline-none ${
                    errors.pincode ? 'border-red-500' : 'border-brand-gold/30'
                  }`}
                />
                {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>}
              </div>
            </div>

          </div>
        </div>

        {/* Cart Summary & Order Placement Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-brand-gold/30 shadow-card space-y-6">
            <h3 className="font-serif text-xl font-bold text-brand-burgundy border-b border-brand-gold/20 pb-3">
              Order Items ({cart.length})
            </h3>

            {/* Cart Mini List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.saree.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.saree.image}
                      alt={item.saree.name}
                      className="w-12 h-14 rounded-lg object-cover border border-brand-gold/20 flex-shrink-0"
                    />
                    <div>
                      <p className="font-serif font-bold text-brand-burgundy line-clamp-1">{item.saree.name}</p>
                      <p className="text-xs text-brand-muted">Qty: {item.quantity} × {formatPrice(item.saree.price)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-brand-burgundy">
                    {formatPrice(item.saree.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-brand-gold/20 space-y-2 text-sm">
              <div className="flex justify-between text-brand-charcoal/80">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-brand-charcoal/80">
                <span>Express Delivery</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="pt-2 border-t border-brand-gold/15 flex justify-between font-serif text-xl font-bold text-brand-burgundy">
                <span>Total Amount</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white py-4 rounded-xl font-bold text-base transition-all shadow-xl hover:shadow-2xl border border-brand-gold/40"
            >
              <CheckCircle className="w-5 h-5 text-brand-gold" />
              <span>Place Order</span>
            </button>

            <div className="pt-2 text-center text-xs text-brand-muted">
              <span>No payment required for frontend simulation.</span>
            </div>
          </div>
        </div>

      </form>

      {/* CENTERED ORDER SUCCESS FLASH CARD MODAL */}
      {showSuccessModal && placedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-brand-gold/40 text-center space-y-6 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            
            {/* Decorative Golden Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold" />

            {/* Centered Green Badge Icon */}
            <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center shadow-lg animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>

            {/* Formal Text Message with Highlighted Banner */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold bg-brand-lightGold/80 px-3.5 py-1 rounded-full border border-brand-gold/30 inline-block">
                <Sparkles className="w-3 h-3 inline mr-1 text-brand-burgundy" /> Order Successful
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-burgundy">
                Order Placed Successfully!
              </h3>
              
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
                {/* Glowing ring */}
                <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full opacity-20"
                  style={{ background: 'radial-gradient(circle, #f5c842 0%, transparent 70%)' }} />

                <div className="relative z-10 flex items-start gap-3 px-4 py-3.5">
                  <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                    style={{ background: 'linear-gradient(135deg, #f5c842, #e2a800)', animation: 'iconPop 1.8s ease-in-out infinite' }}>
                    <span className="text-sm">📞</span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-left">
                    <p className="text-xs font-bold tracking-wide text-brand-gold/90 uppercase">✦ Order Confirmed!</p>
                    <p className="text-white font-semibold text-xs sm:text-sm leading-snug">
                      Your order placed successfully &amp;{' '}
                      <span className="relative inline-block">
                        <span className="relative z-10 font-extrabold text-brand-gold"
                          style={{ textShadow: '0 0 8px rgba(245,200,66,0.6)' }}>
                          our team will contact you shortly!
                        </span>
                        <span className="absolute left-0 -bottom-0.5 w-full h-0.5 rounded-full opacity-70"
                          style={{ background: 'linear-gradient(90deg, transparent, #f5c842, transparent)' }} />
                      </span>
                    </p>
                  </div>
                </div>

                {/* Ticker bar */}
                <div className="relative overflow-hidden h-5 bg-black/20 flex items-center">
                  <p className="whitespace-nowrap text-[10px] font-semibold text-brand-gold/80 tracking-widest px-3"
                    style={{ animation: 'tickerScroll 8s linear infinite' }}>
                    📦 &nbsp; We'll reach out soon &nbsp;•&nbsp; Thank you for shopping with TruelyWomen &nbsp;•&nbsp; Estimated delivery in 7 days &nbsp;•&nbsp; 📦
                  </p>
                </div>
              </div>
            </div>

            {/* Order Details Summary Box */}
            <div className="bg-brand-cream/60 rounded-2xl p-4 border border-brand-gold/30 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-brand-gold/20">
                <span className="text-brand-muted uppercase font-bold tracking-wider">Order ID</span>
                <span className="font-serif font-bold text-brand-burgundy text-sm">{placedOrder.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-muted font-medium">Customer Name</span>
                <span className="font-bold text-brand-charcoal">{placedOrder.customer.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-muted font-medium">Total Amount</span>
                <span className="font-bold text-brand-burgundy text-sm">{formatPrice(placedOrder.total)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-brand-gold/20">
                <span className="text-brand-muted font-medium">Expected Delivery</span>
                <span className="font-bold text-emerald-700">{formatDate(placedOrder.expectedDelivery)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/order-success', { state: { orderId: placedOrder.id } })}
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all border border-brand-gold/40 cursor-pointer"
              >
                <span>View Order Details</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-ivory hover:bg-brand-cream text-brand-burgundy py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm border border-brand-gold/40 transition-all cursor-pointer"
              >
                <span>Continue Shopping</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

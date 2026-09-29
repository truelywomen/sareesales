import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MapPin, PackageCheck, Save, Truck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { OrderStatusType } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { formatPrice } from '../../utils/formatters';
import { OrderStatusTimeline } from '../../components/customer/OrderStatusTimeline';

const STATUS_OPTIONS: OrderStatusType[] = [
  'Order Placed',
  'Confirmed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, changeOrderStatus } = useShop();

  const order = orders.find(o => o.id === id);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusType>(order?.status || 'Order Placed');

  if (!order) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-brand-gold/30">
        <h2 className="font-serif text-2xl font-bold text-brand-burgundy">Order Not Found</h2>
        <p className="text-xs text-brand-muted mt-2">The requested order ID does not exist in localStorage records.</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="mt-4 bg-brand-burgundy text-white px-5 py-2.5 rounded-xl text-xs font-bold"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const handleUpdateStatus = async () => {
    await changeOrderStatus(order.id, selectedStatus);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-brand-gold/30 shadow-card">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-burgundy hover:text-brand-rose transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 text-brand-gold" />
            <span>Back to Orders List</span>
          </button>
          <h1 className="font-serif text-3xl font-bold text-brand-burgundy">
            Order Details • {order.id}
          </h1>
        </div>

        {/* Status Badge */}
        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${
          order.status === 'Delivered'
            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
            : order.status === 'Cancelled'
            ? 'bg-red-100 text-red-900 border-red-300'
            : 'bg-amber-100 text-amber-900 border-amber-300'
        }`}>
          Status: {order.status}
        </span>
      </div>

      {/* Visual Timeline */}
      <div className="bg-white p-6 rounded-3xl border border-brand-gold/30 shadow-card">
        <h3 className="font-serif font-bold text-lg text-brand-burgundy mb-2">Live Delivery Timeline</h3>
        <OrderStatusTimeline status={order.status} />
      </div>

      {/* Details Grid: Customer Info Left, Order Items Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Customer Information Box */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-brand-gold/30 shadow-card space-y-6">
          <h3 className="font-serif text-xl font-bold text-brand-burgundy border-b border-brand-gold/20 pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-gold" />
            <span>Customer Information</span>
          </h3>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block">Full Name</span>
              <p className="font-bold text-brand-burgundy font-serif text-base">{order.customer.name}</p>
            </div>

            <div className="flex items-center gap-3 text-brand-charcoal">
              <Phone className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span>{order.customer.phone}</span>
            </div>

            <div className="flex items-center gap-3 text-brand-charcoal">
              <Mail className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span>{order.customer.email}</span>
            </div>

            <div className="pt-3 border-t border-brand-gold/15 space-y-1">
              <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-gold inline" /> Delivery Address
              </span>
              <p className="text-sm font-medium text-brand-charcoal leading-relaxed pt-1">
                {order.customer.address}
              </p>
              <p className="text-xs font-bold text-brand-burgundy">
                {order.customer.city}, {order.customer.state} - {order.customer.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items & Status Change Box */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Status Update Control Box */}
          <div className="bg-brand-lightGold/60 rounded-3xl p-6 border border-brand-gold/40 shadow-card space-y-4">
            <h3 className="font-serif text-lg font-bold text-brand-burgundy flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-burgundy" />
              <span>Update Order Status</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value as OrderStatusType)}
                className="w-full sm:flex-1 bg-white border border-brand-gold rounded-xl px-4 py-3 text-sm font-bold text-brand-burgundy focus:ring-2 focus:ring-brand-gold cursor-pointer shadow-sm"
              >
                {STATUS_OPTIONS.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>

              <button
                onClick={handleUpdateStatus}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md border border-brand-gold/40 transition-all"
              >
                <Save className="w-4 h-4 text-brand-gold" />
                <span>Save Status Update</span>
              </button>
            </div>
          </div>

          {/* Items Summary Table */}
          <div className="bg-white rounded-3xl p-6 border border-brand-gold/30 shadow-card space-y-4">
            <h3 className="font-serif text-xl font-bold text-brand-burgundy border-b border-brand-gold/20 pb-3">
              Order Line Items ({order.items.length})
            </h3>

            <div className="divide-y divide-brand-gold/15 space-y-3">
              {order.items.map(item => (
                <div key={item.saree.id} className="pt-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.saree.image}
                      alt={item.saree.name}
                      className="w-14 h-16 rounded-xl object-cover border border-brand-gold/20 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-brand-burgundy text-base">{item.saree.name}</h4>
                      <p className="text-xs text-brand-muted">
                        Fabric: {item.saree.fabric} • Color: {item.saree.color}
                      </p>
                      <p className="text-xs text-brand-burgundy font-semibold mt-0.5">
                        Qty: {item.quantity} × {formatPrice(item.saree.price)}
                      </p>
                    </div>
                  </div>

                  <span className="font-serif font-bold text-lg text-brand-burgundy">
                    {formatPrice(item.saree.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-brand-gold/20 space-y-2 text-sm">
              <div className="flex justify-between text-brand-charcoal">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-charcoal">
                <span>Delivery Charge</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="pt-2 border-t border-brand-gold/15 flex justify-between font-serif text-2xl font-bold text-brand-burgundy">
                <span>Total Amount</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>

            <div className="text-xs text-brand-muted pt-2 border-t border-brand-gold/10">
              <p>Ordered Date: <strong>{formatDate(order.orderedAt)}</strong></p>
              <p>Expected Delivery: <strong>{formatDate(order.expectedDelivery)}</strong> (+7 days)</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

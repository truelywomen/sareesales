import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, Truck, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { OrderStatusTimeline } from '../../components/customer/OrderStatusTimeline';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/dateUtils';
import { formatPrice } from '../../utils/formatters';

export const MyOrdersPage: React.FC = () => {
  const { orders } = useShop();

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon={Package}
          title="No Orders Placed Yet"
          description="You haven't placed any saree orders yet. Discover our exclusive handloom saree collection today."
          actionText="Start Shopping"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-brand-burgundy">
          My Orders ({orders.length})
        </h1>
        <p className="text-xs text-brand-muted mt-1">
          Track real-time delivery status for your TruelyWomen luxury saree purchases.
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-8">
        {orders.map(order => (
          <div
            key={order.id}
            className="bg-white rounded-3xl p-6 border border-brand-gold/30 shadow-card space-y-6 hover:border-brand-gold/60 transition-all"
          >
            {/* Top Bar: Order ID, Date & Total */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-brand-gold/20">
              <div>
                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">ORDER REFERENCE</span>
                <h3 className="font-serif text-xl font-bold text-brand-burgundy">{order.id}</h3>
              </div>

              <div className="flex items-center gap-6 text-xs text-brand-charcoal/80">
                <div>
                  <span className="text-brand-muted block font-medium">Ordered On</span>
                  <span className="font-bold text-brand-burgundy">{formatDate(order.orderedAt)}</span>
                </div>
                <div>
                  <span className="text-brand-muted block font-medium">Expected Delivery</span>
                  <span className="font-bold text-emerald-700">{formatDate(order.expectedDelivery)}</span>
                </div>
                <div>
                  <span className="text-brand-muted block font-medium">Total Amount</span>
                  <span className="font-serif text-base font-bold text-brand-burgundy">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Status Timeline Bar */}
            <OrderStatusTimeline status={order.status} />

            {/* Items Grid */}
            <div className="bg-brand-cream/40 rounded-2xl p-4 border border-brand-gold/15 space-y-3">
              <p className="text-xs font-bold text-brand-burgundy uppercase tracking-wider">
                Purchased Sarees ({order.items.length})
              </p>
              
              <div className="divide-y divide-brand-gold/10">
                {order.items.map(item => (
                  <div key={item.saree.id} className="py-2.5 flex items-center justify-between gap-4 text-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.saree.image}
                        alt={item.saree.name}
                        className="w-12 h-14 rounded-lg object-cover border border-brand-gold/20 flex-shrink-0"
                      />
                      <div>
                        <Link to={`/product/${item.saree.id}`} className="font-serif font-bold text-brand-burgundy hover:text-brand-rose line-clamp-1">
                          {item.saree.name}
                        </Link>
                        <p className="text-xs text-brand-muted">
                          {item.saree.fabric} • {item.saree.color} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-brand-burgundy text-sm">
                      {formatPrice(item.saree.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Shipping Address Footer */}
            <div className="text-xs text-brand-muted flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t border-brand-gold/15">
              <span>
                Shipping to: <strong>{order.customer.name}</strong>, {order.customer.city}, {order.customer.state} ({order.customer.pincode})
              </span>
              <span className="text-brand-burgundy font-semibold">
                Status: {order.status}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

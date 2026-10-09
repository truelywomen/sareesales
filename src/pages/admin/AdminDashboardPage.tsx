import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShoppingBag, CheckCircle, Package, TrendingUp, Calendar, ArrowRight, Plus, CheckSquare, Users } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { StatsCard } from '../../components/admin/StatsCard';
import { formatPrice } from '../../utils/formatters';
import { formatDate, isToday } from '../../utils/dateUtils';

export const AdminDashboardPage: React.FC = () => {
  const { sarees, allSarees, orders, getVendorStatsList } = useShop();

  // Dynamic statistics calculations
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const todayOrders = orders.filter(o => isToday(o.orderedAt)).length;
  const totalSarees = sarees.length;
  const totalSales = orders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingApprovals = allSarees.filter(s => s.approvalStatus === 'pending').length;
  const vendorStats = getVendorStatsList();
  const totalVendors = vendorStats.length;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-brand-gold/30 shadow-card">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">OWNER ADMINISTRATION</span>
          <h1 className="font-serif text-3xl font-bold text-brand-burgundy">Welcome, Owner</h1>
          <p className="text-xs text-brand-muted mt-1">Live metrics and management suite for TruelyWomen Luxury Saree Boutique.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {pendingApprovals > 0 && (
            <Link
              to="/admin/vendor-approvals"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all animate-pulse"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Review {pendingApprovals} Vendor Saree{pendingApprovals > 1 ? 's' : ''}</span>
            </Link>
          )}

          <Link
            to="/admin/sarees/add"
            className="inline-flex items-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md border border-brand-gold/40 transition-all"
          >
            <Plus className="w-4 h-4 text-brand-gold" />
            <span>Add Saree</span>
          </Link>

          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 bg-brand-lightGold text-brand-burgundy hover:bg-brand-gold/40 px-5 py-2.5 rounded-xl font-bold text-xs border border-brand-gold transition-all"
          >
            <Clock className="w-4 h-4 text-brand-burgundy" />
            <span>Pending Orders ({pendingOrders})</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid (Calculated dynamically) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Pending Orders"
          value={pendingOrders}
          icon={Clock}
          color="amber"
          subtitle="Action required for delivery"
        />

        <StatsCard
          title="Vendor Approvals"
          value={pendingApprovals}
          icon={CheckSquare}
          color={pendingApprovals > 0 ? "rose" : "gold"}
          subtitle="Pending wholesale review"
        />

        <StatsCard
          title="Salespersons"
          value={totalVendors}
          icon={Users}
          color="blue"
          subtitle="Active partner suppliers"
        />

        <StatsCard
          title="Total Sarees Live"
          value={totalSarees}
          icon={ShoppingBag}
          color="gold"
          subtitle="Active catalog items"
        />
        
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          icon={Package}
          color="burgundy"
          subtitle="Lifetime customer orders"
        />

        <StatsCard
          title="Today's Orders"
          value={todayOrders}
          icon={Calendar}
          color="rose"
          subtitle="Placed in last 24 hours"
        />

        <StatsCard
          title="Delivered Orders"
          value={deliveredOrders}
          icon={CheckCircle}
          color="emerald"
          subtitle="Successfully fulfilled"
        />

        <StatsCard
          title="Total Sales Revenue"
          value={formatPrice(totalSales)}
          icon={TrendingUp}
          color="emerald"
          subtitle="Sum of delivered orders"
        />
      </div>

      {/* Recent Orders Overview Table */}
      <div className="bg-white rounded-3xl p-6 border border-brand-gold/30 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-brand-gold/20 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-brand-burgundy">Recent Customer Orders</h3>
            <p className="text-xs text-brand-muted">Latest placed orders requiring management</p>
          </div>
          
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-burgundy hover:text-brand-rose"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-4 h-4 text-brand-gold" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-cream/60 text-brand-burgundy text-xs uppercase font-bold border-b border-brand-gold/20">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gold/15">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-brand-ivory/50">
                    <td className="p-3 font-serif font-bold text-brand-burgundy">{order.id}</td>
                    <td className="p-3 font-medium text-brand-charcoal">{order.customer.name}</td>
                    <td className="p-3 text-xs text-brand-muted">
                      {order.items.map(i => i.saree.name).join(', ')}
                    </td>
                    <td className="p-3 font-bold text-brand-burgundy">{formatPrice(order.total)}</td>
                    <td className="p-3 text-xs text-brand-muted">{formatDate(order.orderedAt)}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-burgundy hover:text-brand-rose bg-brand-lightGold/50 px-3 py-1.5 rounded-lg border border-brand-gold/30"
                      >
                        View Order
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-brand-muted text-center py-6">No customer orders placed yet.</p>
        )}
      </div>

    </div>
  );
};

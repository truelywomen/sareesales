import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle, XCircle, Plus, ArrowRight, TrendingUp, IndianRupee, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useVendorAuth } from '../../context/VendorAuthContext';
import { formatPrice } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import { FALLBACK_SAREE_IMAGE } from '../../data/sampleSarees';

export const VendorDashboardPage: React.FC = () => {
  const { allSarees, orders } = useShop();
  const { vendor } = useVendorAuth();

  // Filter sarees belonging to this vendor
  const vendorSarees = allSarees.filter(
    s => s.vendorEmail === vendor?.email || s.vendorName === vendor?.username
  );

  const totalSubmitted = vendorSarees.length;
  const pendingCount = vendorSarees.filter(s => s.approvalStatus === 'pending').length;
  const approvedCount = vendorSarees.filter(s => s.approvalStatus === 'approved' || !s.approvalStatus).length;
  const rejectedCount = vendorSarees.filter(s => s.approvalStatus === 'rejected').length;

  // Calculate units sold & total payout
  let sareesSold = 0;
  let totalEarnings = 0;

  orders.forEach(order => {
    order.items.forEach(item => {
      const isVendorItem = vendorSarees.some(s => s.id === item.saree.id);
      if (isVendorItem) {
        sareesSold += item.quantity;
        const matchingSaree = vendorSarees.find(s => s.id === item.saree.id);
        const costPrice = matchingSaree?.vendorPrice || item.saree.price * 0.7;
        totalEarnings += costPrice * item.quantity;
      }
    });
  });

  const recentSubmissions = vendorSarees.slice(0, 5);

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-brand-gold/30 shadow-card">
        <div>
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-brand-gold">
            <Sparkles className="w-3.5 h-3.5" /> VENDOR PARTNER DESK
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-burgundy mt-1">
            Welcome, {vendor?.username}
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Track your saree approvals, manage catalog submissions, and view sales performance.
          </p>
        </div>

        <Link
          to="/vendor/sarees/add"
          className="inline-flex items-center justify-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white px-6 py-3.5 rounded-xl font-bold text-xs shadow-md border border-brand-gold/40 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-brand-gold" />
          <span>+ Submit New Saree</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Submitted */}
        <div className="bg-white p-5 rounded-2xl border border-brand-gold/30 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-lightGold/60 flex items-center justify-center border border-brand-gold/30 flex-shrink-0">
            <ShoppingBag className="w-6 h-6 text-brand-burgundy" />
          </div>
          <div>
            <p className="text-xs text-brand-muted uppercase font-bold tracking-wider">Total Submitted</p>
            <p className="font-serif text-2xl font-bold text-brand-burgundy mt-0.5">{totalSubmitted}</p>
            <p className="text-[11px] text-brand-muted">Sarees in your catalog</p>
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-300 flex-shrink-0">
            <Clock className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <p className="text-xs text-amber-800 uppercase font-bold tracking-wider">Pending Review</p>
            <p className="font-serif text-2xl font-bold text-amber-900 mt-0.5">{pendingCount}</p>
            <p className="text-[11px] text-amber-700/80">Awaiting Admin pricing</p>
          </div>
        </div>

        {/* Approved & Live */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-300 flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <p className="text-xs text-emerald-800 uppercase font-bold tracking-wider">Approved & Live</p>
            <p className="font-serif text-2xl font-bold text-emerald-900 mt-0.5">{approvedCount}</p>
            <p className="text-[11px] text-emerald-700/80">Active in customer store</p>
          </div>
        </div>

        {/* Total Payout */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-300 flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <p className="text-xs text-blue-800 uppercase font-bold tracking-wider">Total Sales Payout</p>
            <p className="font-serif text-2xl font-bold text-blue-900 mt-0.5">{formatPrice(totalEarnings)}</p>
            <p className="text-[11px] text-blue-700/80">{sareesSold} units sold to customers</p>
          </div>
        </div>

      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-gold/30 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-brand-gold/20 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-brand-burgundy">Your Saree Submissions</h3>
            <p className="text-xs text-brand-muted">Recent sarees submitted for catalog approval</p>
          </div>

          <Link
            to="/vendor/sarees"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-burgundy hover:text-brand-rose"
          >
            <span>View All ({vendorSarees.length})</span>
            <ArrowRight className="w-4 h-4 text-brand-gold" />
          </Link>
        </div>

        {recentSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-cream/60 text-brand-burgundy text-xs uppercase font-bold border-b border-brand-gold/20">
                <tr>
                  <th className="p-3">Saree</th>
                  <th className="p-3">Category & Fabric</th>
                  <th className="p-3">Quoted Cost</th>
                  <th className="p-3">Store Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Submitted On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gold/15">
                {recentSubmissions.map(s => {
                  const status = s.approvalStatus || 'approved';
                  return (
                    <tr key={s.id} className="hover:bg-brand-ivory/50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.image || FALLBACK_SAREE_IMAGE}
                            alt={s.name}
                            className="w-10 h-12 rounded-lg object-cover border border-brand-gold/30 flex-shrink-0"
                          />
                          <div>
                            <p className="font-serif font-bold text-brand-burgundy text-xs line-clamp-1">{s.name}</p>
                            <span className="text-[10px] text-brand-muted font-mono">{s.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-xs text-brand-charcoal">
                        <span className="font-semibold">{s.category}</span>
                        <span className="text-brand-muted block">{s.fabric} • {s.color}</span>
                      </td>

                      <td className="p-3 font-serif font-bold text-brand-burgundy text-xs">
                        {s.vendorPrice ? formatPrice(s.vendorPrice) : formatPrice(s.price)}
                      </td>

                      <td className="p-3 text-xs">
                        {status === 'approved' ? (
                          <span className="font-serif font-bold text-emerald-800">{formatPrice(s.price)}</span>
                        ) : (
                          <span className="text-brand-muted italic text-[11px]">Pending Admin Review</span>
                        )}
                      </td>

                      <td className="p-3 text-xs font-semibold text-brand-charcoal">
                        {s.stock} units
                      </td>

                      <td className="p-3">
                        {status === 'approved' && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                            <CheckCircle className="w-3 h-3" /> Live
                          </span>
                        )}
                        {status === 'pending' && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-300">
                            <Clock className="w-3 h-3" /> In Review
                          </span>
                        )}
                        {status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-red-300">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-xs text-brand-muted">
                        {formatDate(s.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="w-14 h-14 rounded-full bg-brand-lightGold/60 mx-auto flex items-center justify-center border border-brand-gold/30">
              <ShoppingBag className="w-7 h-7 text-brand-burgundy" />
            </div>
            <div>
              <p className="font-serif text-lg font-bold text-brand-burgundy">No Saree Submissions Yet</p>
              <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
                Submit your first saree design with your wholesale quoted price for Admin review.
              </p>
            </div>
            <Link
              to="/vendor/sarees/add"
              className="inline-flex items-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md border border-brand-gold/40 transition-all"
            >
              <Plus className="w-4 h-4 text-brand-gold" />
              <span>Submit Your First Saree</span>
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

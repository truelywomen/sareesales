import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, CheckCircle, Clock, XCircle, Info, ExternalLink } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useVendorAuth } from '../../context/VendorAuthContext';
import { formatPrice } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import { FALLBACK_SAREE_IMAGE } from '../../data/sampleSarees';

export const VendorSareesPage: React.FC = () => {
  const { allSarees } = useShop();
  const { vendor } = useVendorAuth();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Filter vendor sarees
  const mySarees = useMemo(() => {
    return allSarees.filter(
      s => s.vendorEmail === vendor?.email || s.vendorName === vendor?.username
    );
  }, [allSarees, vendor]);

  const filteredList = useMemo(() => {
    return mySarees.filter(s => {
      const status = s.approvalStatus || 'approved';
      const matchStatus = statusFilter === 'all' || status === statusFilter;
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase().trim()) ||
        s.id.toLowerCase().includes(search.toLowerCase().trim()) ||
        s.category.toLowerCase().includes(search.toLowerCase().trim()) ||
        s.fabric.toLowerCase().includes(search.toLowerCase().trim());

      return matchStatus && matchSearch;
    });
  }, [mySarees, statusFilter, search]);

  const pendingCount = mySarees.filter(s => s.approvalStatus === 'pending').length;
  const approvedCount = mySarees.filter(s => s.approvalStatus === 'approved' || !s.approvalStatus).length;
  const rejectedCount = mySarees.filter(s => s.approvalStatus === 'rejected').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-brand-gold/30 shadow-card">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-burgundy">
            My Saree Submissions ({mySarees.length})
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Monitor review statuses, quoted wholesale prices, and store retail pricing.
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

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-brand-gold/25 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-brand-burgundy text-white shadow-sm'
                : 'bg-brand-cream/60 text-brand-charcoal hover:bg-brand-lightGold/50'
            }`}
          >
            All Submissions ({mySarees.length})
          </button>
          
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>In Review ({pendingCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'approved'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Live ({approvedCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'rejected'
                ? 'bg-red-700 text-white shadow-sm'
                : 'bg-red-50 text-red-900 border border-red-200 hover:bg-red-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected ({rejectedCount})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search your sarees..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-brand-cream/50 border border-brand-gold/30 rounded-xl text-xs focus:ring-2 focus:ring-brand-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Sarees Table */}
      <div className="bg-white rounded-3xl border border-brand-gold/30 shadow-card overflow-hidden">
        {filteredList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-cream/80 text-brand-burgundy text-xs uppercase font-bold border-b border-brand-gold/25">
                <tr>
                  <th className="p-4">Saree</th>
                  <th className="p-4">Fabric & Category</th>
                  <th className="p-4">Quoted Cost</th>
                  <th className="p-4">Store Retail Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Admin Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gold/15">
                {filteredList.map(saree => {
                  const status = saree.approvalStatus || 'approved';
                  return (
                    <tr key={saree.id} className="hover:bg-brand-ivory/60 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={saree.image || FALLBACK_SAREE_IMAGE}
                            alt={saree.name}
                            className="w-12 h-14 rounded-xl object-cover border border-brand-gold/20 flex-shrink-0"
                          />
                          <div>
                            <p className="font-serif font-bold text-brand-burgundy text-xs sm:text-sm line-clamp-1">{saree.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-brand-muted font-mono">{saree.id}</span>
                              <span className="text-[10px] text-brand-muted">• {formatDate(saree.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-xs text-brand-charcoal">
                        <span className="font-semibold block">{saree.category}</span>
                        <span className="text-brand-muted">{saree.fabric} • {saree.color}</span>
                      </td>

                      <td className="p-4 font-serif font-bold text-brand-burgundy text-sm">
                        {saree.vendorPrice ? formatPrice(saree.vendorPrice) : formatPrice(saree.price)}
                      </td>

                      <td className="p-4 text-xs">
                        {status === 'approved' ? (
                          <div>
                            <span className="font-serif font-bold text-emerald-800 text-sm">
                              {formatPrice(saree.price)}
                            </span>
                            {saree.originalPrice && (
                              <span className="text-[10px] text-brand-muted line-through block">
                                {formatPrice(saree.originalPrice)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-brand-muted italic text-[11px]">Under Review</span>
                        )}
                      </td>

                      <td className="p-4 font-semibold text-xs text-brand-charcoal">
                        {saree.stock > 0 ? `${saree.stock} available` : 'Out of Stock'}
                      </td>

                      <td className="p-4">
                        {status === 'approved' && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                            <CheckCircle className="w-3 h-3" /> Live in Store
                          </span>
                        )}
                        {status === 'pending' && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-300">
                            <Clock className="w-3 h-3" /> Pending Review
                          </span>
                        )}
                        {status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-red-300">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-xs">
                        {saree.adminNotes ? (
                          <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] max-w-xs leading-tight">
                            {saree.adminNotes}
                          </div>
                        ) : status === 'approved' ? (
                          <span className="text-emerald-700 text-[11px] font-medium">Approved by Admin</span>
                        ) : (
                          <span className="text-brand-muted text-[11px] italic">No notes</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <p className="font-serif text-base font-bold text-brand-burgundy">No Sarees Found</p>
            <p className="text-xs text-brand-muted">No sarees matched your search or status filter.</p>
          </div>
        )}
      </div>

    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, CheckCircle, Clock, XCircle, TrendingUp, IndianRupee, Search, ArrowRight, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import { FALLBACK_SAREE_IMAGE } from '../../data/sampleSarees';

export const AdminVendorsMonitoringPage: React.FC = () => {
  const { allSarees, getVendorStatsList } = useShop();

  const [search, setSearch] = useState('');
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);

  const vendorStatsList = useMemo(() => {
    return getVendorStatsList();
  }, [allSarees, getVendorStatsList]);

  const filteredVendors = useMemo(() => {
    return vendorStatsList.filter(
      v =>
        v.vendorName.toLowerCase().includes(search.toLowerCase().trim()) ||
        v.vendorEmail.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [vendorStatsList, search]);

  // Overall partner metrics
  const totalVendors = vendorStatsList.length;
  const totalPartnerSarees = vendorStatsList.reduce((sum, v) => sum + v.totalSubmitted, 0);
  const totalPartnerSales = vendorStatsList.reduce((sum, v) => sum + v.totalSalesValue, 0);
  const totalPartnerPayout = vendorStatsList.reduce((sum, v) => sum + v.totalVendorCost, 0);

  const toggleExpand = (vendorName: string) => {
    setExpandedVendor(prev => (prev === vendorName ? null : vendorName));
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-brand-gold/30 shadow-card">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-gold">
            <Users className="w-3.5 h-3.5" /> SALESPERSON & VENDOR MANAGEMENT
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-burgundy mt-1">
            Salesperson Performance Hub
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Monitor which salespersons supplied sarees, view their approved designs, inventory in stock, and sales payouts.
          </p>
        </div>

        <Link
          to="/admin/vendor-approvals"
          className="inline-flex items-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md border border-brand-gold/40 transition-all"
        >
          <Clock className="w-4 h-4 text-brand-gold" />
          <span>Go to Approvals Queue</span>
        </Link>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-brand-gold/30 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-lightGold/60 flex items-center justify-center border border-brand-gold/30 flex-shrink-0">
            <Users className="w-6 h-6 text-brand-burgundy" />
          </div>
          <div>
            <p className="text-xs text-brand-muted uppercase font-bold tracking-wider">Active Partners</p>
            <p className="font-serif text-2xl font-bold text-brand-burgundy mt-0.5">{totalVendors}</p>
            <p className="text-[11px] text-brand-muted">Registered salespersons</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-gold/30 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-lightGold/60 flex items-center justify-center border border-brand-gold/30 flex-shrink-0">
            <ShoppingBag className="w-6 h-6 text-brand-burgundy" />
          </div>
          <div>
            <p className="text-xs text-brand-muted uppercase font-bold tracking-wider">Total Sarees Given</p>
            <p className="font-serif text-2xl font-bold text-brand-burgundy mt-0.5">{totalPartnerSarees}</p>
            <p className="text-[11px] text-brand-muted">Across all salespersons</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-300 flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <p className="text-xs text-emerald-800 uppercase font-bold tracking-wider">Store Revenue Made</p>
            <p className="font-serif text-2xl font-bold text-emerald-900 mt-0.5">{formatPrice(totalPartnerSales)}</p>
            <p className="text-[11px] text-emerald-700/80">From partner sarees</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-300 flex-shrink-0">
            <IndianRupee className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <p className="text-xs text-blue-800 uppercase font-bold tracking-wider">Wholesale Payout Due</p>
            <p className="font-serif text-2xl font-bold text-blue-900 mt-0.5">{formatPrice(totalPartnerPayout)}</p>
            <p className="text-[11px] text-blue-700/80">Owed to salespersons</p>
          </div>
        </div>

      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-brand-gold/25 shadow-card flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search salesperson by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-cream/50 border border-brand-gold/30 rounded-xl text-xs focus:ring-2 focus:ring-brand-gold focus:outline-none"
          />
        </div>
        <span className="text-xs font-semibold text-brand-muted hidden sm:block">
          Showing {filteredVendors.length} Salespersons
        </span>
      </div>

      {/* Salespersons List Cards */}
      <div className="space-y-4">
        {filteredVendors.map(vendor => {
          const isExpanded = expandedVendor === vendor.vendorName;
          const vendorSarees = allSarees.filter(
            s => s.vendorName === vendor.vendorName || s.vendorEmail === vendor.vendorEmail
          );

          return (
            <div
              key={vendor.vendorName}
              className="bg-white rounded-3xl border border-brand-gold/30 shadow-card overflow-hidden transition-all"
            >
              
              {/* Card Header Row */}
              <div
                onClick={() => toggleExpand(vendor.vendorName)}
                className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 cursor-pointer hover:bg-brand-cream/30 transition-colors"
              >
                {/* Vendor Identity */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-brand-lightGold/70 flex items-center justify-center border border-brand-gold/40 text-brand-burgundy font-serif font-bold text-lg flex-shrink-0">
                    {vendor.vendorName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-brand-burgundy text-lg">
                      {vendor.vendorName}
                    </h3>
                    <p className="text-xs text-brand-muted">{vendor.vendorEmail}</p>
                  </div>
                </div>

                {/* Performance Pill Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                  
                  <div className="bg-brand-cream/60 border border-brand-gold/25 rounded-xl px-3 py-2 text-center">
                    <span className="text-[10px] uppercase font-bold text-brand-muted block">Supplied</span>
                    <span className="font-serif font-bold text-brand-burgundy text-sm">{vendor.totalSubmitted} Sarees</span>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">Approved / Live</span>
                    <span className="font-serif font-bold text-emerald-900 text-sm">{vendor.approvedCount}</span>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-center">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">In Review</span>
                    <span className="font-serif font-bold text-amber-900 text-sm">{vendor.pendingCount}</span>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-center">
                    <span className="text-[10px] uppercase font-bold text-blue-800 block">Sold Units</span>
                    <span className="font-serif font-bold text-blue-900 text-sm">{vendor.sareesSold}</span>
                  </div>

                </div>

                {/* Expand Toggle */}
                <div className="flex items-center gap-2 text-xs font-bold text-brand-burgundy">
                  <span>{isExpanded ? 'Hide Sarees' : 'View Sarees'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-brand-gold" /> : <ChevronDown className="w-4 h-4 text-brand-gold" />}
                </div>

              </div>

              {/* Expanded Sarees Table */}
              {isExpanded && (
                <div className="border-t border-brand-gold/20 p-6 bg-brand-ivory/40 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-brand-burgundy text-sm">
                      Sarees Supplied by {vendor.vendorName} ({vendorSarees.length})
                    </h4>
                    <Link
                      to="/admin/vendor-approvals"
                      className="text-xs font-bold text-brand-burgundy hover:text-brand-rose flex items-center gap-1"
                    >
                      <span>Manage in Approvals</span>
                      <ArrowRight className="w-3.5 h-3.5 text-brand-gold" />
                    </Link>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-brand-gold/25 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-brand-cream/80 text-brand-burgundy uppercase font-bold border-b border-brand-gold/20">
                        <tr>
                          <th className="p-3">Saree Design</th>
                          <th className="p-3">Category & Fabric</th>
                          <th className="p-3">Vendor Quoted Cost</th>
                          <th className="p-3">Store Selling Price</th>
                          <th className="p-3">Stock</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-gold/15">
                        {vendorSarees.map(s => {
                          const status = s.approvalStatus || 'approved';
                          return (
                            <tr key={s.id} className="hover:bg-brand-ivory/50">
                              <td className="p-3">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={s.image || FALLBACK_SAREE_IMAGE}
                                    alt={s.name}
                                    className="w-9 h-11 rounded-lg object-cover border border-brand-gold/30 flex-shrink-0"
                                  />
                                  <div>
                                    <span className="font-serif font-bold text-brand-burgundy block line-clamp-1">{s.name}</span>
                                    <span className="text-[10px] text-brand-muted font-mono">{s.id}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="p-3 text-brand-charcoal">
                                <span className="font-semibold">{s.category}</span>
                                <span className="text-brand-muted block">{s.fabric}</span>
                              </td>

                              <td className="p-3 font-serif font-bold text-brand-burgundy">
                                {s.vendorPrice ? formatPrice(s.vendorPrice) : formatPrice(s.price)}
                              </td>

                              <td className="p-3 font-serif font-bold text-emerald-800">
                                {status === 'approved' ? formatPrice(s.price) : <span className="text-brand-muted text-[10px] italic">Not Set</span>}
                              </td>

                              <td className="p-3 font-semibold text-brand-charcoal">
                                {s.stock} units
                              </td>

                              <td className="p-3">
                                {status === 'approved' && (
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                                    Approved
                                  </span>
                                )}
                                {status === 'pending' && (
                                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                                    Pending Review
                                  </span>
                                )}
                                {status === 'rejected' && (
                                  <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-300">
                                    Rejected
                                  </span>
                                )}
                              </td>

                              <td className="p-3">
                                <Link
                                  to="/admin/vendor-approvals"
                                  className="text-[11px] font-bold text-brand-burgundy hover:text-brand-rose underline"
                                >
                                  Review
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};

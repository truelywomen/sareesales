import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle, Clock, Search, Filter, Sparkles, User, ExternalLink, IndianRupee, MessageSquare } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import { FALLBACK_SAREE_IMAGE } from '../../data/sampleSarees';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminVendorApprovalsPage: React.FC = () => {
  const { allSarees, approveVendorSaree, rejectVendorSaree } = useShop();

  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [search, setSearch] = useState('');
  const [pricingMap, setPricingMap] = useState<Record<string, { fixedPrice: string; originalPrice: string }>>({});
  
  // Reject Modal state
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Filter vendor sarees (where vendorName or vendorPrice exists, or approvalStatus is set)
  const vendorSarees = useMemo(() => {
    return allSarees.filter(s => s.vendorName || s.vendorPrice !== undefined || s.approvalStatus);
  }, [allSarees]);

  const pendingList = useMemo(() => vendorSarees.filter(s => s.approvalStatus === 'pending'), [vendorSarees]);
  const approvedList = useMemo(() => vendorSarees.filter(s => s.approvalStatus === 'approved' || !s.approvalStatus), [vendorSarees]);
  const rejectedList = useMemo(() => vendorSarees.filter(s => s.approvalStatus === 'rejected'), [vendorSarees]);

  const displayList = useMemo(() => {
    return vendorSarees.filter(s => {
      const status = s.approvalStatus || 'approved';
      const matchStatus = statusFilter === 'all' || status === statusFilter;
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase().trim()) ||
        (s.vendorName && s.vendorName.toLowerCase().includes(search.toLowerCase().trim())) ||
        (s.vendorEmail && s.vendorEmail.toLowerCase().includes(search.toLowerCase().trim())) ||
        s.category.toLowerCase().includes(search.toLowerCase().trim()) ||
        s.fabric.toLowerCase().includes(search.toLowerCase().trim());

      return matchStatus && matchSearch;
    });
  }, [vendorSarees, statusFilter, search]);

  const handlePriceChange = (sareeId: string, field: 'fixedPrice' | 'originalPrice', value: string) => {
    setPricingMap(prev => ({
      ...prev,
      [sareeId]: {
        ...prev[sareeId],
        fixedPrice: field === 'fixedPrice' ? value : (prev[sareeId]?.fixedPrice ?? ''),
        originalPrice: field === 'originalPrice' ? value : (prev[sareeId]?.originalPrice ?? '')
      }
    }));
  };

  const getSareeFixedPrice = (sareeId: string, defaultPrice: number, vendorPrice?: number): number => {
    if (pricingMap[sareeId]?.fixedPrice !== undefined && pricingMap[sareeId].fixedPrice !== '') {
      return Number(pricingMap[sareeId].fixedPrice);
    }
    // Default suggestion: vendor price * 1.35 or existing price
    if (vendorPrice && defaultPrice <= vendorPrice) {
      return Math.round(vendorPrice * 1.35);
    }
    return defaultPrice;
  };

  const getSareeOriginalPrice = (sareeId: string, defaultOriginal?: number, fixedPrice?: number): number | undefined => {
    if (pricingMap[sareeId]?.originalPrice !== undefined && pricingMap[sareeId].originalPrice !== '') {
      return Number(pricingMap[sareeId].originalPrice);
    }
    if (defaultOriginal) return defaultOriginal;
    if (fixedPrice) return Math.round(fixedPrice * 1.25);
    return undefined;
  };

  const handleApprove = async (sareeId: string, defaultPrice: number, vendorPrice?: number, defaultOriginal?: number) => {
    const finalFixedPrice = getSareeFixedPrice(sareeId, defaultPrice, vendorPrice);
    const finalOriginal = getSareeOriginalPrice(sareeId, defaultOriginal, finalFixedPrice);

    await approveVendorSaree(sareeId, finalFixedPrice, finalOriginal);
  };

  const handleOpenReject = (sareeId: string) => {
    setRejectTargetId(sareeId);
    setRejectReason('');
  };

  const handleConfirmReject = async () => {
    if (rejectTargetId) {
      await rejectVendorSaree(rejectTargetId, rejectReason || 'Quoted price not aligned with store margins');
      setRejectTargetId(null);
      setRejectReason('');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-brand-gold/30 shadow-card">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-gold">
            <Sparkles className="w-3.5 h-3.5" /> VENDOR CATALOG WORKFLOW
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-burgundy mt-1">
            Vendor Saree Approvals & Pricing
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Review wholesale vendor quotes, set store selling prices, and approve authentic handlooms into the customer boutique.
          </p>
        </div>

        {/* Counter Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-300 rounded-2xl px-4 py-2.5 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">Needs Action</span>
            <span className="font-serif text-xl font-bold text-amber-900">{pendingList.length} Pending</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-brand-gold/25 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Approvals ({pendingList.length})</span>
          </button>

          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              statusFilter === 'approved'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Approved Sarees ({approvedList.length})</span>
          </button>

          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              statusFilter === 'rejected'
                ? 'bg-red-700 text-white shadow-md'
                : 'bg-red-50 text-red-900 border border-red-200 hover:bg-red-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected ({rejectedList.length})</span>
          </button>

          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-brand-burgundy text-white shadow-md'
                : 'bg-brand-cream/60 text-brand-charcoal hover:bg-brand-lightGold/50'
            }`}
          >
            All ({vendorSarees.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by saree, vendor name, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-cream/50 border border-brand-gold/30 rounded-xl text-xs focus:ring-2 focus:ring-brand-gold focus:outline-none"
          />
        </div>

      </div>

      {/* Submissions List Grid */}
      {displayList.length > 0 ? (
        <div className="grid grid-cols-1 gap-5">
          {displayList.map(saree => {
            const status = saree.approvalStatus || 'approved';
            const vendorCost = saree.vendorPrice || saree.price;
            const currentFixedInput = pricingMap[saree.id]?.fixedPrice ?? (status === 'approved' ? saree.price.toString() : Math.round(vendorCost * 1.35).toString());
            const currentOriginalInput = pricingMap[saree.id]?.originalPrice ?? (saree.originalPrice ? saree.originalPrice.toString() : Math.round(Number(currentFixedInput) * 1.25).toString());

            return (
              <div
                key={saree.id}
                className="bg-white rounded-3xl p-6 border border-brand-gold/30 shadow-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-brand-gold transition-colors"
              >
                
                {/* Saree & Vendor Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="relative flex-shrink-0">
                    <img
                      src={saree.image || FALLBACK_SAREE_IMAGE}
                      alt={saree.name}
                      className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl object-cover border border-brand-gold/30 shadow-sm"
                    />
                    <span className="absolute -top-2 -left-2 bg-brand-burgundy text-brand-gold text-[9px] font-bold px-2 py-0.5 rounded-full border border-brand-gold/40">
                      {saree.category}
                    </span>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif font-bold text-brand-burgundy text-base sm:text-lg">
                        {saree.name}
                      </h3>
                      {status === 'pending' && (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                          Pending Approval
                        </span>
                      )}
                      {status === 'approved' && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                          Approved & Live
                        </span>
                      )}
                      {status === 'rejected' && (
                        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-red-300">
                          Rejected
                        </span>
                      )}
                    </div>

                    {/* Vendor Badge */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 bg-brand-lightGold/60 text-brand-burgundy font-bold px-2.5 py-0.5 rounded-lg border border-brand-gold/30 text-[11px]">
                        <User className="w-3 h-3 text-brand-burgundy" />
                        {saree.vendorName || 'In-House Partner'}
                      </span>
                      {saree.vendorEmail && (
                        <span className="text-[11px] text-brand-muted">({saree.vendorEmail})</span>
                      )}
                      <span className="text-brand-muted text-[11px]">• {saree.fabric} • {saree.color} • {saree.stock} in stock</span>
                    </div>

                    <p className="text-xs text-brand-charcoal/80 line-clamp-2 leading-relaxed">
                      {saree.description}
                    </p>

                    {/* Admin notes if rejected */}
                    {saree.adminNotes && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                        <span>Note: {saree.adminNotes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing Controls: Vendor Cost vs Our Fixed Price */}
                <div className="flex flex-col sm:flex-row lg:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-brand-gold/20">
                  
                  {/* Vendor Quoted Cost ("They Told Amount") */}
                  <div className="bg-brand-cream/60 border border-brand-gold/30 rounded-2xl p-3 min-w-[130px] text-center">
                    <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider block">
                      Vendor Quoted Cost
                    </span>
                    <span className="font-serif text-xl font-bold text-brand-burgundy block mt-0.5">
                      {formatPrice(vendorCost)}
                    </span>
                    <span className="text-[10px] text-brand-muted">Wholesale asking</span>
                  </div>

                  {/* Our Fixed Selling Price ("Our Fixed Amount") */}
                  <div className="bg-brand-lightGold/40 border border-brand-gold/40 rounded-2xl p-3 min-w-[180px] space-y-1">
                    <label className="text-[10px] uppercase font-bold text-brand-burgundy tracking-wider block">
                      Store Selling Price (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-serif font-bold text-brand-burgundy text-xs">₹</span>
                      <input
                        type="number"
                        value={currentFixedInput}
                        onChange={e => handlePriceChange(saree.id, 'fixedPrice', e.target.value)}
                        className="w-full pl-6 pr-2 py-1.5 bg-white border border-brand-gold/40 rounded-lg text-xs font-bold text-brand-burgundy focus:ring-2 focus:ring-brand-gold focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-brand-muted pt-0.5">
                      <span>MRP: ₹</span>
                      <input
                        type="number"
                        placeholder="MRP"
                        value={currentOriginalInput}
                        onChange={e => handlePriceChange(saree.id, 'originalPrice', e.target.value)}
                        className="w-16 px-1.5 py-0.5 bg-white border border-brand-gold/30 rounded text-[10px] text-right font-medium"
                      />
                    </div>
                  </div>

                  {/* Approval Actions */}
                  <div className="flex sm:flex-col gap-2 justify-end">
                    <button
                      onClick={() => handleApprove(saree.id, Number(currentFixedInput), saree.vendorPrice, Number(currentOriginalInput))}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md border border-emerald-600 transition-all active:scale-95 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{status === 'approved' ? 'Update Price' : 'Approve & Publish'}</span>
                    </button>

                    {status !== 'rejected' && (
                      <button
                        onClick={() => handleOpenReject(saree.id)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2.5 rounded-xl font-bold text-xs border border-red-200 transition-all active:scale-95 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-brand-gold/30 shadow-card space-y-3">
          <div className="w-14 h-14 rounded-full bg-brand-lightGold/60 mx-auto flex items-center justify-center border border-brand-gold/30">
            <CheckCircle className="w-7 h-7 text-brand-burgundy" />
          </div>
          <h3 className="font-serif text-lg font-bold text-brand-burgundy">No Submissions Found</h3>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            There are currently no vendor saree submissions in this status category.
          </p>
        </div>
      )}

      {/* Reject Modal */}
      {rejectTargetId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-brand-gold/40 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 border-b border-brand-gold/20 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-burgundy">Reject Saree Submission</h3>
                <p className="text-xs text-brand-muted">Provide feedback to the salesperson</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-brand-burgundy uppercase tracking-wider">
                Reason for Rejection
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g. Quoted wholesale price is higher than our retail margins. Please adjust and resubmit."
                className="w-full p-3 bg-brand-cream/40 border border-brand-gold/30 rounded-xl text-xs focus:ring-2 focus:ring-brand-gold focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectTargetId(null)}
                className="flex-1 py-3 text-xs font-bold text-brand-charcoal bg-brand-cream/60 hover:bg-brand-cream rounded-xl border border-brand-gold/30"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="flex-1 py-3 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-xl shadow-md border border-red-600"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

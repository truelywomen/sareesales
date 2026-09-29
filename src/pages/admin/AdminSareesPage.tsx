import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, ExternalLink } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatters';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { FALLBACK_SAREE_IMAGE } from '../../data/sampleSarees';

export const AdminSareesPage: React.FC = () => {
  const { sarees, removeSaree } = useShop();

  const [search, setSearch] = useState('');
  const [selectedFabric, setSelectedFabric] = useState('All');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const sareeToDelete = sarees.find(s => s.id === deleteTargetId);

  const fabrics = useMemo(() => {
    return ['All', ...Array.from(new Set(sarees.map(s => s.fabric)))];
  }, [sarees]);

  const filteredList = useMemo(() => {
    return sarees.filter(s => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase().trim()) ||
        s.id.toLowerCase().includes(search.toLowerCase().trim()) ||
        s.category.toLowerCase().includes(search.toLowerCase().trim()) ||
        s.fabric.toLowerCase().includes(search.toLowerCase().trim());

      const matchFabric = selectedFabric === 'All' || s.fabric === selectedFabric;

      return matchSearch && matchFabric;
    });
  }, [sarees, search, selectedFabric]);

  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      await removeSaree(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-brand-gold/30 shadow-card">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-burgundy">
            Saree Catalog Management ({sarees.length})
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Publish, edit prices, update stock, or remove sarees from the customer store in real time.
          </p>
        </div>

        <Link
          to="/admin/sarees/add"
          className="inline-flex items-center justify-center gap-2 bg-brand-burgundy hover:bg-brand-wine text-white px-6 py-3.5 rounded-xl font-bold text-xs shadow-md border border-brand-gold/40 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-brand-gold" />
          <span>+ Add New Saree</span>
        </Link>
      </div>

      {/* Admin Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-brand-gold/25 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID, category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-brand-cream/50 border border-brand-gold/30 rounded-xl text-xs focus:ring-2 focus:ring-brand-gold focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-brand-muted font-medium">Filter Fabric:</span>
          <select
            value={selectedFabric}
            onChange={e => setSelectedFabric(e.target.value)}
            className="bg-brand-cream/50 border border-brand-gold/30 rounded-xl px-3 py-2 text-xs font-semibold text-brand-burgundy focus:ring-2 focus:ring-brand-gold cursor-pointer"
          >
            {fabrics.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sarees Grid/Table */}
      <div className="bg-white rounded-3xl border border-brand-gold/30 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-cream/80 text-brand-burgundy text-xs uppercase font-bold border-b border-brand-gold/25">
              <tr>
                <th className="p-4">Saree</th>
                <th className="p-4">Fabric</th>
                <th className="p-4">Category</th>
                <th className="p-4">Color</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gold/15">
              {filteredList.map(saree => (
                <tr key={saree.id} className="hover:bg-brand-ivory/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={saree.image || FALLBACK_SAREE_IMAGE}
                        alt={saree.name}
                        className="w-12 h-14 rounded-xl object-cover border border-brand-gold/20 flex-shrink-0"
                      />
                      <div>
                        <Link to={`/product/${saree.id}`} target="_blank" className="font-serif font-bold text-brand-burgundy hover:text-brand-rose line-clamp-1 flex items-center gap-1">
                          <span>{saree.name}</span>
                          <ExternalLink className="w-3 h-3 text-brand-gold opacity-60" />
                        </Link>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-brand-muted font-mono">{saree.id}</span>
                          {saree.badge && (
                            <span className="text-[9px] bg-brand-burgundy text-brand-gold px-1.5 py-0.2 rounded font-bold">
                              {saree.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-brand-charcoal text-xs">{saree.fabric}</td>
                  <td className="p-4 text-xs text-brand-muted">{saree.category}</td>
                  <td className="p-4 text-xs font-medium text-brand-charcoal">{saree.color}</td>
                  <td className="p-4 font-serif font-bold text-brand-burgundy">
                    <div>{formatPrice(saree.price)}</div>
                    {saree.originalPrice && (
                      <div className="text-[10px] text-brand-muted line-through">
                        {formatPrice(saree.originalPrice)}
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-semibold">
                    {saree.stock > 0 ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200">
                        {saree.stock} in stock
                      </span>
                    ) : (
                      <span className="text-red-700 bg-red-50 px-2.5 py-1 rounded-full text-xs font-bold border border-red-200">
                        Out of stock
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      to={`/admin/sarees/edit/${saree.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-burgundy hover:text-brand-rose bg-brand-lightGold/60 px-3 py-1.5 rounded-lg border border-brand-gold/30 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    <button
                      onClick={() => setDeleteTargetId(saree.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-900 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="Delete Saree?"
        message={`Are you sure you want to delete "${sareeToDelete?.name}"? This action will remove it from the catalog permanently.`}
        confirmText="Delete Saree"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

    </div>
  );
};

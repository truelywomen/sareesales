import React from 'react';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { FilterBar } from '../../components/customer/FilterBar';
import { ProductCard } from '../../components/customer/ProductCard';
import { EmptyState } from '../../components/common/EmptyState';

export const ShopPage: React.FC = () => {
  const { filteredSarees, resetFilters, sarees } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-gold bg-brand-lightGold/60 px-3 py-1 rounded-full border border-brand-gold/30">
          <Sparkles className="w-3.5 h-3.5" /> Luxury Catalog ({sarees.length} Sarees)
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-burgundy">
          Discover Our Sarees
        </h1>
        <p className="text-sm text-brand-charcoal/70 font-sans">
          Handcrafted luxury weaves for every celebration. Filter by fabric, category, color, or price range to find your perfect drape.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar />

      {/* Product Grid or Empty State */}
      {filteredSarees.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSarees.map(saree => (
            <ProductCard key={saree.id} saree={saree} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title="No Matching Sarees Found"
          description="We couldn't find any sarees matching your search and filter criteria. Try adjusting your filters or resetting search."
          actionText="Reset All Filters"
          onActionClick={resetFilters}
        />
      )}
    </div>
  );
};

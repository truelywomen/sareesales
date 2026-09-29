import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Saree, CartItem, Order, CustomerInfo, FilterState, SortOption, OrderStatusType } from '../types';
import * as storage from '../utils/storage';
import * as supabaseService from '../services/supabaseService';
import { useToast } from './ToastContext';

interface ShopContextType {
  sarees: Saree[];
  cart: CartItem[];
  orders: Order[];
  wishlist: Saree[];
  filters: FilterState;
  sortOption: SortOption;
  filteredSarees: Saree[];
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  isLoading: boolean;
  
  // Actions
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  setSortOption: (option: SortOption) => void;
  resetFilters: () => void;
  refreshData: () => Promise<void>;
  
  // Cart operations
  addItemToCart: (saree: Saree, quantity?: number) => void;
  removeItemFromCart: (sareeId: string) => void;
  changeCartQuantity: (sareeId: string, quantity: number) => void;
  emptyCart: () => void;

  // Wishlist operations
  toggleWishlist: (saree: Saree) => void;
  isInWishlist: (sareeId: string) => boolean;
  removeFromWishlist: (sareeId: string) => void;
  clearWishlist: () => void;
  moveWishlistToCart: (saree: Saree) => void;

  // Order operations
  placeOrder: (customer: CustomerInfo) => Promise<Order | null>;
  changeOrderStatus: (orderId: string, status: OrderStatusType) => Promise<void>;

  // Admin Saree operations
  addNewSaree: (sareeData: Omit<Saree, 'id' | 'createdAt'>) => Promise<Saree>;
  editSaree: (id: string, sareeData: Partial<Saree>) => Promise<Saree | null>;
  removeSaree: (id: string) => Promise<void>;
  resetAllDemoData: () => void;
}

const initialFilters: FilterState = {
  fabric: 'All',
  category: 'All',
  color: 'All',
  priceRange: 'All',
  search: ''
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [sarees, setSarees] = useState<Saree[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Saree[]>([]);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load live data from Supabase
  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [dbSarees, dbOrders] = await Promise.all([
        supabaseService.fetchSareesFromDb(),
        supabaseService.fetchOrdersFromDb()
      ]);

      if (dbSarees && dbSarees.length > 0) {
        setSarees(dbSarees);
      } else {
        setSarees(storage.getSarees());
      }

      if (dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders);
      } else {
        setOrders(storage.getOrders());
      }
    } catch (err) {
      console.error('Failed to fetch from Supabase, using storage cache:', err);
      setSarees(storage.getSarees());
      setOrders(storage.getOrders());
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    // 1. Instantly load local data so UI is instant
    setSarees(storage.getSarees());
    setCart(storage.getCart());
    setOrders(storage.getOrders());
    setWishlist(storage.getWishlist());

    // 2. Fetch fresh live data from Supabase Cloud
    refreshData();
  }, []);

  // Filter & Sort Logic
  const filteredSarees = useMemo(() => {
    let result = [...sarees];

    // Filter by Search Query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.fabric.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.color.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    // Filter by Fabric
    if (filters.fabric !== 'All') {
      result = result.filter(s => s.fabric.toLowerCase() === filters.fabric.toLowerCase());
    }

    // Filter by Category
    if (filters.category !== 'All') {
      result = result.filter(s => s.category.toLowerCase() === filters.category.toLowerCase());
    }

    // Filter by Color
    if (filters.color !== 'All') {
      result = result.filter(s => s.color.toLowerCase() === filters.color.toLowerCase());
    }

    // Filter by Price Range
    if (filters.priceRange !== 'All') {
      switch (filters.priceRange) {
        case 'Under ₹1,500':
          result = result.filter(s => s.price < 1500);
          break;
        case '₹1,500 - ₹3,000':
          result = result.filter(s => s.price >= 1500 && s.price <= 3000);
          break;
        case '₹3,000 - ₹5,000':
          result = result.filter(s => s.price > 3000 && s.price <= 5000);
          break;
        case 'Above ₹5,000':
          result = result.filter(s => s.price > 5000);
          break;
      }
    }

    // Apply Sorting
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recommended':
      default:
        // Keep order
        break;
    }

    return result;
  }, [sarees, filters, sortOption]);

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.saree.price * item.quantity, 0);
  }, [cart]);

  // Wishlist Count
  const wishlistCount = useMemo(() => {
    return wishlist.length;
  }, [wishlist]);

  // Wishlist Actions
  const toggleWishlist = (saree: Saree) => {
    const result = storage.toggleWishlist(saree);
    setWishlist(result.wishlist);
    if (result.added) {
      showToast(`Added "${saree.name}" to wishlist`, 'success');
    } else {
      showToast('Removed from wishlist', 'info');
    }
  };

  const isInWishlist = (sareeId: string): boolean => {
    return wishlist.some(s => s.id === sareeId);
  };

  const removeFromWishlist = (sareeId: string) => {
    const updated = storage.removeFromWishlist(sareeId);
    setWishlist(updated);
    showToast('Removed from wishlist', 'info');
  };

  const clearWishlist = () => {
    storage.clearWishlist();
    setWishlist([]);
    showToast('Wishlist cleared', 'info');
  };

  const moveWishlistToCart = (saree: Saree) => {
    addItemToCart(saree, 1);
    removeFromWishlist(saree.id);
  };

  // Cart Actions
  const addItemToCart = (saree: Saree, quantity: number = 1) => {
    const updatedCart = storage.addToCart(saree, quantity);
    setCart(updatedCart);
    showToast(`Added "${saree.name}" to bag`, 'success');
  };

  const removeItemFromCart = (sareeId: string) => {
    const updatedCart = storage.removeFromCart(sareeId);
    setCart(updatedCart);
    showToast('Saree removed from cart', 'info');
  };

  const changeCartQuantity = (sareeId: string, quantity: number) => {
    const updatedCart = storage.updateCartQuantity(sareeId, quantity);
    setCart(updatedCart);
  };

  const emptyCart = () => {
    storage.clearCart();
    setCart([]);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSortOption('recommended');
  };

  // Order Actions
  const placeOrder = async (customer: CustomerInfo): Promise<Order | null> => {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return null;
    }
    const newOrder = storage.createOrder(customer, cart, cartTotal, cartTotal);
    setOrders(storage.getOrders());
    setCart([]);

    // Cloud database insert
    await supabaseService.createOrderInDb(newOrder);

    showToast('Order placed successfully!', 'success');
    return newOrder;
  };

  const changeOrderStatus = async (orderId: string, status: OrderStatusType) => {
    const updated = storage.updateOrderStatus(orderId, status);
    if (updated) {
      setOrders(storage.getOrders());
      await supabaseService.updateOrderStatusInDb(orderId, status);
      showToast(`Order status updated to "${status}"`, 'success');
    }
  };

  // Saree CRUD for Owner
  const addNewSaree = async (sareeData: Omit<Saree, 'id' | 'createdAt'>): Promise<Saree> => {
    const created = storage.addSaree(sareeData);
    const updatedList = storage.getSarees();
    setSarees(updatedList);

    // Save to Cloud Supabase DB
    await supabaseService.createSareeInDb(created);

    showToast(`Saree "${created.name}" added to catalog!`, 'success');
    return created;
  };

  const editSaree = async (id: string, sareeData: Partial<Saree>): Promise<Saree | null> => {
    const updated = storage.updateSaree(id, sareeData);
    if (updated) {
      const updatedList = storage.getSarees();
      setSarees(updatedList);
      setCart(storage.getCart());
      setWishlist(storage.getWishlist());

      // Update in Supabase Cloud DB
      await supabaseService.updateSareeInDb(id, sareeData);

      showToast(`Saree "${updated.name}" updated successfully!`, 'success');
    }
    return updated;
  };

  const removeSaree = async (id: string) => {
    const deleted = storage.deleteSaree(id);
    if (deleted) {
      setSarees(storage.getSarees());
      setCart(storage.getCart());
      setWishlist(storage.getWishlist());

      // Delete from Supabase Cloud DB
      await supabaseService.deleteSareeFromDb(id);

      showToast('Saree deleted from catalog', 'info');
    }
  };

  const resetAllDemoData = () => {
    storage.resetDemoData();
    setSarees(storage.getSarees());
    setCart([]);
    setOrders([]);
    setWishlist([]);
    showToast('Demo dataset reset successfully', 'info');
  };

  return (
    <ShopContext.Provider
      value={{
        sarees,
        cart,
        orders,
        wishlist,
        filters,
        sortOption,
        filteredSarees,
        cartCount,
        cartTotal,
        wishlistCount,
        isLoading,
        setFilters,
        setSortOption,
        resetFilters,
        refreshData,
        addItemToCart,
        removeItemFromCart,
        changeCartQuantity,
        emptyCart,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        moveWishlistToCart,
        placeOrder,
        changeOrderStatus,
        addNewSaree,
        editSaree,
        removeSaree,
        resetAllDemoData
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

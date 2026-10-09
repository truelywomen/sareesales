export type SareeCategory = 'Kanchipuram' | 'Banarasi' | 'Party Wear' | 'Traditional' | 'Bandhani' | 'Chanderi' | 'Organza' | 'Linen' | string;

export type SareeFabric = 'Silk' | 'Cotton' | 'Linen' | 'Chiffon' | 'Georgette' | 'Organza' | 'Tussar' | 'Velvet' | string;

export type SareeColor = 'Red' | 'Pink' | 'Blue' | 'Green' | 'Yellow' | 'Black' | 'White' | 'Purple' | 'Maroon' | 'Gold' | 'Beige' | string;

export type SareeApprovalStatus = 'approved' | 'pending' | 'rejected';

export interface Saree {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: SareeCategory;
  fabric: SareeFabric;
  color: SareeColor;
  description: string;
  stock: number;
  rating?: number;
  reviewsCount?: number;
  badge?: 'Bestseller' | 'New Launch' | 'Trending' | 'Handloom Pure Silk' | 'Limited Edition' | string;
  createdAt: string;
  
  // Vendor & Approval Fields
  approvalStatus?: SareeApprovalStatus;
  vendorName?: string;
  vendorEmail?: string;
  vendorPrice?: number; // Vendor Quoted Cost / Wholesale Cost
  adminNotes?: string;
  approvedAt?: string;
}

export interface VendorProfile {
  username: string;
  email: string;
  phone?: string;
  isLoggedIn: boolean;
}

export interface VendorStats {
  vendorName: string;
  vendorEmail: string;
  totalSubmitted: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  totalStock: number;
  sareesSold: number;
  totalSalesValue: number;
  totalVendorCost: number;
}

export interface CartItem {
  saree: Saree;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatusType = 
  | 'Order Placed' 
  | 'Confirmed' 
  | 'Shipped' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled';

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  total: number;
  orderedAt: string;
  expectedDelivery: string;
  status: OrderStatusType;
}

export interface FilterState {
  fabric: string;
  category: string;
  color: string;
  priceRange: string;
  search: string;
}

export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'newest' | 'name-asc' | 'rating-desc';

export interface AdminStats {
  pendingOrders: number;
  totalOrders: number;
  todayOrders: number;
  totalSarees: number;
  deliveredOrders: number;
  totalSales: number;
}

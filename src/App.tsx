import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { VendorAuthProvider } from './context/VendorAuthContext';
import { ShopProvider } from './context/ShopContext';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { VendorLayout } from './layouts/VendorLayout';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { ShopPage } from './pages/customer/ShopPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { CartPage } from './pages/customer/CartPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderSuccessPage } from './pages/customer/OrderSuccessPage';
import { MyOrdersPage } from './pages/customer/MyOrdersPage';
import ContactPage from './pages/customer/ContactPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage';
import { AdminSareesPage } from './pages/admin/AdminSareesPage';
import { AdminAddSareePage } from './pages/admin/AdminAddSareePage';
import { AdminEditSareePage } from './pages/admin/AdminEditSareePage';
import { AdminHistoryPage } from './pages/admin/AdminHistoryPage';
import { AdminVendorApprovalsPage } from './pages/admin/AdminVendorApprovalsPage';
import { AdminVendorsMonitoringPage } from './pages/admin/AdminVendorsMonitoringPage';

// Vendor Pages
import { VendorLoginPage } from './pages/vendor/VendorLoginPage';
import { VendorDashboardPage } from './pages/vendor/VendorDashboardPage';
import { VendorSareesPage } from './pages/vendor/VendorSareesPage';
import { VendorAddSareePage } from './pages/vendor/VendorAddSareePage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <VendorAuthProvider>
            <ShopProvider>
              <Routes>
                
                {/* Customer Routes */}
                <Route path="/" element={<CustomerLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="shop" element={<ShopPage />} />
                  <Route path="product/:id" element={<ProductDetailPage />} />
                  <Route path="wishlist" element={<WishlistPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="order-success" element={<OrderSuccessPage />} />
                  <Route path="orders" element={<MyOrdersPage />} />
                  <Route path="contact" element={<ContactPage />} />
                </Route>

                {/* Owner Access Public Gateway */}
                <Route path="/admin" element={<AdminLoginPage />} />

                {/* Protected Owner Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="orders/:id" element={<AdminOrderDetailPage />} />
                  <Route path="vendor-approvals" element={<AdminVendorApprovalsPage />} />
                  <Route path="vendors" element={<AdminVendorsMonitoringPage />} />
                  <Route path="sarees" element={<AdminSareesPage />} />
                  <Route path="sarees/add" element={<AdminAddSareePage />} />
                  <Route path="sarees/edit/:id" element={<AdminEditSareePage />} />
                  <Route path="history" element={<AdminHistoryPage />} />
                </Route>

                {/* Vendor Partner Public Gateway */}
                <Route path="/vendor" element={<VendorLoginPage />} />

                {/* Protected Vendor Routes */}
                <Route path="/vendor" element={<VendorLayout />}>
                  <Route path="dashboard" element={<VendorDashboardPage />} />
                  <Route path="sarees" element={<VendorSareesPage />} />
                  <Route path="sarees/add" element={<VendorAddSareePage />} />
                </Route>

                {/* Fallback Catch-all Route */}
                <Route path="*" element={<Navigate to="/" replace />} />

              </Routes>
            </ShopProvider>
          </VendorAuthProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;

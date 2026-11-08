import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/common/CartDrawer';
import { AdminRoute, ShopOwnerRoute } from './components/common/ProtectedRoute';

// Customer Pages
import ShopList from './pages/customer/ShopList';
import ShopStorefront from './pages/customer/ShopStorefront';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ShopManagement from './pages/admin/ShopManagement';
import ProductManagement from './pages/admin/ProductManagement';
import UserManagement from './pages/admin/UserManagement';

// Shop Owner Pages
import ShopDashboard from './pages/shop_owner/ShopDashboard';
import CatalogBrowse from './pages/shop_owner/CatalogBrowse';
import MyProducts from './pages/shop_owner/MyProducts';
import ShopOrders from './pages/shop_owner/ShopOrders';
import ShopSettings from './pages/shop_owner/ShopSettings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
              <Navbar />
              <CartDrawer />

              <main className="flex-1">
                <Routes>
                  {/* Public Customer Routes */}
                  <Route path="/" element={<ShopList />} />
                  <Route path="/shop/:slug" element={<ShopStorefront />} />

                  {/* Public Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Admin Routes */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/shops" element={<ShopManagement />} />
                    <Route path="/admin/products" element={<ProductManagement />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                  </Route>

                  {/* Protected Shop Owner Routes */}
                  <Route element={<ShopOwnerRoute />}>
                    <Route path="/shop-owner" element={<Navigate to="/shop-owner/dashboard" replace />} />
                    <Route path="/shop-owner/dashboard" element={<ShopDashboard />} />
                    <Route path="/shop-owner/catalog" element={<CatalogBrowse />} />
                    <Route path="/shop-owner/products" element={<MyProducts />} />
                    <Route path="/shop-owner/orders" element={<ShopOrders />} />
                    <Route path="/shop-owner/settings" element={<ShopSettings />} />
                  </Route>

                  {/* Catch-all */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

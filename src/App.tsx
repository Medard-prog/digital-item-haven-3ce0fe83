
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider } from '@/lib/store';

// Pages
import Index from '@/pages/Index';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import NotFound from '@/pages/NotFound';
import UserDashboard from '@/pages/user/Dashboard';
import UserProfile from '@/pages/user/Profile';
import UserPurchases from '@/pages/user/Purchases';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard';
import ProductsManager from '@/pages/admin/ProductsManager';
import OrdersManager from '@/pages/admin/OrdersManager';

// Auth components
import PrivateRoute from '@/components/PrivateRoute';
import AdminRoute from '@/components/AdminRoute';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// Layout components
import DiscountBanner from '@/components/DiscountBanner';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Router>
          <DiscountBanner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User Protected Routes */}
            <Route path="/checkout" element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            } />
            <Route path="/purchases" element={
              <PrivateRoute>
                <UserPurchases />
              </PrivateRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } />
            <Route path="/admin/products" element={
              <AdminRoute>
                <ProductsManager />
              </AdminRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminRoute>
                <OrdersManager />
              </AdminRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminBanners from './pages/admin/Banners';
import AdminOrderList from './pages/admin/OrderList';
import AdminCustomers from './pages/admin/Customers';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* Logged-in user routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="orders" element={<AdminOrderList />} />
              <Route path="customers" element={<AdminCustomers />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <p className="font-display text-5xl tracking-tightest text-ink/20">404</p>
      <p className="text-sm text-ink/50 mt-2">This page doesn't exist.</p>
    </div>
  );
}

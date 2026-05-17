import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Search from './pages/Search';
// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSellers from './pages/admin/AdminSellers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminBanners from './pages/admin/AdminBanners';
import AdminInventory from './pages/admin/AdminInventory';
import AdminReports from './pages/admin/AdminReports';
// Seller pages
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerAddProduct from './pages/seller/SellerAddProduct';
import SellerRegister from './pages/seller/SellerRegister';
import SellerLogin from './pages/seller/SellerLogin';
import SellerHub from './pages/seller/SellerHub';
import SellerAnalytics from './pages/seller/SellerAnalytics';
import SellerEarnings from './pages/seller/SellerEarnings';
import SellerOrders from './pages/seller/SellerOrders';
import SellerInventory from './pages/seller/SellerInventory';
import SellerProfile from './pages/seller/SellerProfile';
import SellerEditProduct from './pages/seller/SellerEditProduct';

function RequireRole({ role, children }: { role: string; children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  if (role === 'admin' && user.role !== 'admin') return <Navigate to="/" replace />;
  if (role === 'seller' && user.role !== 'seller' && user.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/seller/register" element={<SellerRegister />} />
      <Route path="/seller/login" element={<SellerLogin />} />
      <Route path="/seller/hub" element={<SellerHub />} />

      {/* Admin routes */}
      <Route path="/admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
      <Route path="/admin/users" element={<RequireRole role="admin"><AdminUsers /></RequireRole>} />
      <Route path="/admin/sellers" element={<RequireRole role="admin"><AdminSellers /></RequireRole>} />
      <Route path="/admin/products" element={<RequireRole role="admin"><AdminProducts /></RequireRole>} />
      <Route path="/admin/orders" element={<RequireRole role="admin"><AdminOrders /></RequireRole>} />
      <Route path="/admin/coupons" element={<RequireRole role="admin"><AdminCoupons /></RequireRole>} />
      <Route path="/admin/banners" element={<RequireRole role="admin"><AdminBanners /></RequireRole>} />
      <Route path="/admin/inventory" element={<RequireRole role="admin"><AdminInventory /></RequireRole>} />
      <Route path="/admin/reports" element={<RequireRole role="admin"><AdminReports /></RequireRole>} />

      {/* Seller routes */}
      <Route path="/seller" element={<RequireRole role="seller"><SellerDashboard /></RequireRole>} />
      <Route path="/seller/products" element={<RequireRole role="seller"><SellerProducts /></RequireRole>} />
      <Route path="/seller/products/add" element={<RequireRole role="seller"><SellerAddProduct /></RequireRole>} />
      <Route path="/seller/products/new" element={<RequireRole role="seller"><SellerAddProduct /></RequireRole>} />
      <Route path="/seller/products/:id/edit" element={<RequireRole role="seller"><SellerEditProduct /></RequireRole>} />
      <Route path="/seller/analytics" element={<RequireRole role="seller"><SellerAnalytics /></RequireRole>} />
      <Route path="/seller/earnings" element={<RequireRole role="seller"><SellerEarnings /></RequireRole>} />
      <Route path="/seller/orders" element={<RequireRole role="seller"><SellerOrders /></RequireRole>} />
      <Route path="/seller/inventory" element={<RequireRole role="seller"><SellerInventory /></RequireRole>} />
      <Route path="/seller/profile" element={<RequireRole role="seller"><SellerProfile /></RequireRole>} />

      {/* Login & Register — show blue navbar */}
      <Route path="/login" element={
        <div className="min-h-screen bg-[#f1f3f6] text-gray-800 font-sans flex flex-col">
          <Navbar />
          <main className="flex-1 w-full"><Login /></main>
          <Footer />
        </div>
      } />
      <Route path="/register" element={
        <div className="min-h-screen bg-[#f1f3f6] text-gray-800 font-sans flex flex-col">
          <Navbar />
          <main className="flex-1 w-full"><Register /></main>
          <Footer />
        </div>
      } />
      {/* Search results — uses Navbar so category bar stays visible */}
      <Route path="/search" element={
        <div className="min-h-screen bg-[#f1f3f6] text-gray-800 font-sans flex flex-col">
          <Navbar />
          <main className="flex-1 w-full"><Search /></main>
          <Footer />
        </div>
      } />

      {/* Customer routes — NO blue navbar, home page has its own header */}
      <Route path="/*" element={
        <div className="min-h-screen bg-[#f1f3f6] text-gray-800 font-sans flex flex-col">
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<><Navbar /><Profile /><Footer /></>} />
              <Route path="/product/:id" element={<><Navbar /><ProductDetails /><Footer /></>} />
              <Route path="/cart" element={<><Navbar /><Cart /><Footer /></>} />
              <Route path="/checkout" element={<><Navbar /><Checkout /><Footer /></>} />
              <Route path="/wishlist" element={<><Navbar /><Wishlist /><Footer /></>} />
            </Routes>
          </main>
        </div>
      } />
    </Routes>
  );
}

export default App;

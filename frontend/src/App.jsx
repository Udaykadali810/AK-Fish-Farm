import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import Footer from './components/layout/Footer';
import AIAssistant from './components/ui/AIAssistant';
import CartActionToast from './components/ui/CartActionToast';
import GlobalLayout from './components/layout/GlobalLayout';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Lazy load pages for 0% hanging
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
// const BrowseTanks = lazy(() => import('./pages/BrowseTanks')); 
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Categories = lazy(() => import('./pages/Categories'));
const Offers = lazy(() => import('./pages/Offers'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Profile = lazy(() => import('./pages/Profile')); // New
const MyOrders = lazy(() => import('./pages/MyOrders'));
const AntiGravity = lazy(() => import('./pages/AntiGravity'));
const EliteApp = lazy(() => import('./pages/EliteApp'));
const AkProStore = lazy(() => import('./pages/AkProStore'));
const ProjectReport = lazy(() => import('./pages/ProjectReport'));

const Loading = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#071A2F]">
    <div className="w-20 h-20 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(0,229,255,0.2)] mb-8"></div>
    <div className="text-[#00E5FF] text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Establishing Connection...</div>
  </div>
);

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <GlobalLayout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            {/* <Route path="/browse-tanks" element={<BrowseTanks />} /> */}
            <Route path="/categories" element={<Categories />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/antigravity" element={<AntiGravity />} />
            <Route path="/elite" element={<EliteApp />} />
            <Route path="/pro-store" element={<AkProStore />} />
            <Route path="/project-report" element={<ProjectReport />} />
          </Routes>
        </Suspense>
      </GlobalLayout>
      <Footer />
      <BottomNav />
      <AIAssistant />
      <CartActionToast />
    </>
  );
}

export default App;

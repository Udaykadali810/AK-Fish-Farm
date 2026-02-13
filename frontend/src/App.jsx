import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import Footer from './components/layout/Footer';
import AIAssistant from './components/ui/AIAssistant';
import CartActionToast from './components/ui/CartActionToast';
import GlobalLayout from './components/layout/GlobalLayout';

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

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <>
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

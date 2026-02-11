import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import Offers from './pages/Offers';
import TrackOrder from './pages/TrackOrder';
import MyOrders from './pages/MyOrders';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

import ScrollToTop from './components/ui/ScrollToTop';
import UnderwaterBackground from './components/ui/UnderwaterBackground';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AIAssistant from './components/ui/AIAssistant';
import IntroAnimation from './components/ui/IntroAnimation';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen relative">
              <UnderwaterBackground />
              <AIAssistant />
              <ScrollToTop />
              <Navbar />
              <main className="flex-grow pt-20">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/offers" element={<Offers />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/login" element={<Login />} />

                  <Route path="/admin" element={<AdminLogin onLogin={() => { }} />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;



import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Search, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { cart } = useCart();
    const { user } = useAuth();

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'Categories', path: '/categories' },
        { name: 'Offers', path: '/offers' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-500 bg-[#071A2F]/80 backdrop-blur-2xl border-b border-[#00E5FF]/10 py-5">
            <div className="max-w-7xl mx-auto px-6 sm:px-10">
                <div className="flex justify-between h-16 items-center gap-6">
                    {/* Logo - Neon Cyan Glow */}
                    <Link to="/" className="flex flex-shrink-0 items-center space-x-2 group">
                        <span className="text-3xl font-black italic tracking-tighter text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                            AK <span className="text-[#00C2D1]">Fish Farms</span>
                        </span>
                    </Link>

                    {/* Center Search Bar: Deep Ocean Style */}
                    <div className="hidden md:flex flex-grow max-w-xl relative group">
                        <input
                            type="text"
                            placeholder="Identify your species..."
                            className="w-full bg-[#0B2A4A]/40 border border-[#00E5FF]/20 rounded-2xl px-14 py-4 text-sm focus:outline-none focus:border-[#00E5FF] focus:ring-4 focus:ring-[#00E5FF]/10 transition-all placeholder-[#BFEFFF]/30 font-medium tracking-wide text-[#BFEFFF]"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00E5FF]/30 group-focus-within:text-[#00E5FF] transition-colors" />
                    </div>

                    {/* Desktop Right Nav Items */}
                    <div className="hidden lg:flex items-center space-x-10">
                        <div className="flex space-x-10 items-center font-black text-[10px] tracking-[0.3em] uppercase">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`transition-all hover:scale-110 ${location.pathname === link.path ? 'text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'text-[#BFEFFF]/40 hover:text-[#00C2D1]'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to="/my-orders"
                                className={`transition-all hover:scale-110 ${location.pathname === '/my-orders' ? 'text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'text-[#BFEFFF]/40 hover:text-[#00C2D1]'}`}
                            >
                                Orders
                            </Link>
                        </div>

                        <div className="h-6 w-px bg-[#00E5FF]/10"></div>

                        <div className="flex items-center gap-6">
                            <Link
                                to="/cart"
                                className={`relative group p-3.5 rounded-2xl border transition-all ${location.pathname === '/cart' ? 'bg-[#00E5FF] text-[#071A2F] border-[#00E5FF]' : 'bg-[#0B2A4A]/40 border-[#00E5FF]/10 text-[#BFEFFF]/40 hover:text-[#00E5FF] hover:border-[#00E5FF]/50'}`}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className={`absolute -top-1 -right-1 text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(0,229,255,0.5)] ${location.pathname === '/cart' ? 'bg-[#071A2F] text-[#00E5FF]' : 'bg-[#00E5FF] text-[#071A2F]'}`}>
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <Link
                                to="/profile"
                                className={`p-3.5 rounded-2xl border transition-all ${location.pathname === '/profile' ? 'bg-[#00E5FF] text-[#071A2F] border-[#00E5FF]' : 'bg-[#0B2A4A]/40 border-[#00E5FF]/10 text-[#BFEFFF]/40 hover:text-[#00E5FF] hover:border-[#00E5FF]/50'}`}
                            >
                                <User className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Controls */}
                    <div className="lg:hidden flex items-center gap-4">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-3 bg-[#0B2A4A]/40 rounded-2xl text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#071A2F] transition-all border border-[#00E5FF]/20 shadow-lg"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Immersive Deep Ocean Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="lg:hidden mx-4 mt-6 overflow-hidden rounded-[3rem] border border-[#00E5FF]/10 shadow-[0_30px_100px_rgba(0,0,0,0.9)] bg-[#071A2F]/95 backdrop-blur-3xl"
                    >
                        <div className="p-10 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block py-6 px-10 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all ${location.pathname === link.path ? 'bg-[#00E5FF] text-[#071A2F] shadow-xl' : 'text-[#BFEFFF]/50 hover:bg-[#BFEFFF]/5'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

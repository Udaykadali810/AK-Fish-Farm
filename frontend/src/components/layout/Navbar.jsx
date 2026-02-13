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
        <nav className="fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-500 bg-white/[0.03] backdrop-blur-2xl border-b border-white/5 py-4">
            <div className="max-w-7xl mx-auto px-6 sm:px-10">
                <div className="flex justify-between h-16 items-center gap-6">
                    {/* Logo - Aqua Glowing Style */}
                    <Link to="/" className="flex flex-shrink-0 items-center space-x-2 group">
                        <span className="text-2xl font-black italic tracking-tighter text-aqua glow-text">
                            AK <span className="text-white">FISH</span>
                        </span>
                    </Link>

                    {/* Center Search Bar: Static & Anchored */}
                    <div className="hidden md:flex flex-grow max-w-xl relative group">
                        <input
                            type="text"
                            placeholder="Find your species..."
                            className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-14 py-4 text-sm focus:outline-none focus:border-aqua/50 focus:ring-4 focus:ring-aqua/10 transition-all placeholder-white/20 font-medium tracking-wide"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-aqua transition-colors" />
                    </div>

                    {/* Desktop Right Nav Items */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <div className="flex space-x-8 items-center font-bold text-[10px] tracking-[0.3em] uppercase text-white/40">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`hover:text-aqua transition-all hover:scale-105 ${location.pathname === link.path ? 'text-aqua glow-text' : ''}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="h-6 w-px bg-white/10"></div>

                        <Link to="/profile" className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:border-aqua/50 transition-all text-white/40 hover:text-aqua">
                            <User className="h-5 w-5" />
                        </Link>
                    </div>

                    {/* Mobile Controls */}
                    <div className="lg:hidden flex items-center gap-4">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-3 bg-white/5 rounded-2xl text-white/60 hover:text-aqua transition-colors border border-white/10"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden mx-4 mt-4 overflow-hidden rounded-[2.5rem] glass-card border border-white/10 shadow-3xl"
                    >
                        <div className="p-8 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block py-5 px-8 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${location.pathname === link.path ? 'bg-aqua text-dark' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-6 border-t border-white/5 mt-6 grid grid-cols-2 gap-4">
                                <Link to="/profile" className="flex items-center justify-center gap-3 py-5 bg-white/5 rounded-3xl text-white/60 text-[10px] font-black uppercase tracking-widest">
                                    <User className="w-4 h-4" /> Profile
                                </Link>
                                <Link to="/cart" className="flex items-center justify-center gap-3 py-5 bg-aqua rounded-3xl text-dark text-[10px] font-black uppercase tracking-widest">
                                    <ShoppingCart className="w-4 h-4" /> Cart ({cartCount})
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

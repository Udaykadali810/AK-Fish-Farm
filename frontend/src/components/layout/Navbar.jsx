import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Search, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const { cart } = useCart();
    const { user } = useAuth();

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    const WHATSAPP_LINK = "https://wa.me/919492045766";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'Categories', path: '/categories' },
        { name: 'Offers', path: '/offers' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-[100] transition-all duration-500 rounded-[2.5rem] ${isScrolled ? 'glass-card py-2' : 'bg-white/5 backdrop-blur-md py-4 border border-white/10'}`}>
            <div className="px-6 sm:px-10">
                <div className="flex justify-between h-16 items-center gap-4">
                    {/* Logo - Aqua Glowing Style */}
                    <Link to="/" className="flex flex-shrink-0 items-center space-x-2 group">
                        <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-aqua glow-text hover:scale-105 transition-transform">
                            AK <span className="text-white opacity-80">FISH FARMS</span>
                        </span>
                    </Link>

                    {/* Center Search Bar - High-End Style */}
                    <div className="hidden md:flex flex-grow max-w-md relative group">
                        <input
                            type="text"
                            placeholder="Search Species..."
                            className="w-full bg-white/5 border border-white/10 rounded-full px-12 py-3 text-sm focus:outline-none focus:border-aqua/50 focus:ring-4 focus:ring-aqua/10 transition-all placeholder-white/20"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-aqua transition-colors" />
                    </div>

                    {/* Desktop Right Nav */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <div className="flex space-x-6 items-center font-bold text-[10px] tracking-[0.2em] uppercase text-white/50">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`hover:text-aqua transition-colors ${location.pathname === link.path ? 'text-aqua' : ''}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="h-6 w-px bg-white/10 mx-2"></div>

                        <Link to="/profile" className="text-white/70 hover:text-aqua transition-all flex items-center gap-2 group">
                            <User className="h-5 w-5" />
                        </Link>

                        <Link to="/cart" className="relative group p-2.5 bg-white/5 rounded-2xl border border-white/10 hover:border-aqua/50 transition-all duration-500">
                            <ShoppingCart className={`h-5 w-5 transition-all duration-300 ${cartCount > 0 ? 'text-aqua' : 'text-white/40'}`} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-aqua text-dark text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(14,165,233,0.5)]">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile menu and Cart */}
                    <div className="lg:hidden flex items-center gap-4">
                        <Link to="/cart" className="relative p-2 text-white/60">
                            <ShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-aqua text-dark text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-white/60 hover:text-aqua transition-colors focus:outline-none"
                        >
                            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="lg:hidden mx-4 mt-2 overflow-hidden rounded-3xl glass-card border border-white/10"
                    >
                        <div className="p-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${location.pathname === link.path ? 'bg-aqua text-dark shadow-xl shadow-aqua/20 font-black' : 'text-white/60 hover:bg-white/5'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-white/5 mt-4">
                                <Link
                                    to="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-4 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest text-white/60 hover:bg-white/5"
                                >
                                    <User className="w-5 h-5 text-aqua" /> Profile Settings
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

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Facebook, ShoppingCart, MessageCircle, ShieldCheck } from 'lucide-react';
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
        { name: 'My Orders', path: '/my-orders' },
        { name: 'Categories', path: '/categories' },
        { name: 'Offers', path: '/offers' },
        { name: 'Contact', path: '/contact' },
        { name: 'Admin', path: '/admin' },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass-morphism shadow-2xl py-2' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <span className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,210,255,0.8)]">
                            AK Fish Farms
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex space-x-8 items-center font-semibold text-xs tracking-widest uppercase">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`nav-link ${location.pathname === link.path ? 'text-primary' : 'text-text-main hover:text-primary'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Icons Area */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-main hover:text-green-500 transition-all duration-300 flex items-center gap-2 font-black text-xs uppercase group"
                        >
                            <div className="p-2 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-all">
                                <MessageCircle className="h-5 w-5 text-green-500" />
                            </div>
                            WhatsApp Chat
                        </a>

                        <Link to="/cart" className="relative group p-2 bg-white/5 rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-500">
                            <ShoppingCart className={`h-6 w-6 transition-all duration-300 ${cartCount > 0 ? 'text-primary' : 'text-text-main'}`} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-dark text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden flex items-center gap-4">
                        <Link to="/cart" className="relative p-2">
                            <ShoppingCart className="h-7 w-7 text-text-main" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-dark text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-text-main hover:text-primary transition-colors focus:outline-none"
                        >
                            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden glass-morphism overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-8 space-y-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block py-3 px-4 rounded-xl font-bold transition-all ${location.pathname === link.path ? 'bg-primary text-dark shadow-lg' : 'text-text-main hover:bg-white/10'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-4">
                                <a
                                    href={WHATSAPP_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-green-500 font-black uppercase text-sm"
                                >
                                    <MessageCircle className="h-5 w-5" /> WhatsApp Chat
                                </a>
                                <div className="flex space-x-4">
                                    <Instagram className="h-5 w-5 text-text-main" />
                                    <Facebook className="h-5 w-5 text-text-main" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;


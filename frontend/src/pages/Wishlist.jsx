import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingCart, Trash2, ArrowRight, Droplets, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { wishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-bg-main">
                <div className="w-48 h-48 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mb-10">
                    <Heart className="w-20 h-20 text-red-500 animate-pulse" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-dark dark:text-white italic mb-4">Empty Heart</h1>
                <p className="text-gray-500 mb-10 max-w-sm font-medium">You haven't saved any aquatic favorites yet. Start exploring our ocean!</p>
                <Link to="/shop" className="px-12 py-5 bg-primary text-white rounded-[2rem] font-black text-xl shadow-2xl flex items-center gap-2 hover:scale-105 transition-all">
                    Browse Species <ArrowRight />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-bg-main min-h-screen pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                            <Heart className="w-3 h-3 fill-red-500" /> Favorites
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-dark dark:text-white italic">My Fish <span className="text-primary italic">Wishlist</span></h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence mode='popLayout'>
                        {wishlist.map((product) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={product.id}
                                className="group bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="relative h-60">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <button
                                        onClick={() => toggleWishlist(product)}
                                        className="absolute top-5 right-5 p-3 bg-red-500 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-8">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1">{product.category}</span>
                                    <h3 className="text-xl font-black text-dark dark:text-white mb-4 italic line-clamp-1">{product.name}</h3>
                                    <div className="flex items-center justify-between mt-6">
                                        <p className="text-2xl font-black text-primary">₹{product.offerPrice || product.price}</p>
                                        <button
                                            onClick={() => { addToCart(product); toggleWishlist(product); }}
                                            className="p-4 bg-dark dark:bg-slate-800 text-white rounded-2xl hover:bg-primary transition-all shadow-lg active:scale-95"
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;

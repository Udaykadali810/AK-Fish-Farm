import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const navigate = useNavigate();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        navigate('/checkout');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -12, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative glass-card rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-8 flex flex-col h-full min-h-[480px] sm:min-h-[600px] border border-[#00E5FF]/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 overflow-visible"
        >
            {/* Top Section - Image with 3D Float */}
            <Link to={`/product/${product.id}`} className="block relative mb-6 sm:mb-8 flex-shrink-0 group-hover:drop-shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all">
                <div className="relative aspect-[4/3] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#0B2A4A] to-[#071A2F] border-2 border-[#00E5FF]/20 group-hover:border-[#00E5FF]/40 transition-colors duration-500">
                    {product.image ? (
                        <motion.img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 1 }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#BFEFFF]/5 font-black italic text-4xl sm:text-6xl">AK</div>
                    )}

                    {/* Category Badge - Minimalist */}
                    <div className="absolute top-2 left-2 sm:top-5 sm:left-5 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] bg-[#071A2F]/80 backdrop-blur-xl border border-[#00E5FF]/20 text-[#00E5FF] shadow-2xl z-20">
                        {product.category.replace(' Collection', '')}
                    </div>
                </div>
            </Link>

            {/* Middle Section - Identity & Price */}
            <div className="flex flex-col flex-grow text-center sm:text-left px-1 sm:px-2">
                <div className="mb-3 sm:mb-4">
                    <Link to={`/product/${product.id}`}>
                        <h3 className="text-lg sm:text-3xl font-black text-[#BFEFFF] italic leading-[1.1] uppercase tracking-tighter mb-2 sm:mb-4 line-clamp-2 min-h-[2.5rem] sm:min-h-[3.5rem] group-hover:text-[#00E5FF] transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {/* BIG PROMINENT PRICE */}
                <div className="mb-6 sm:mb-8">
                    <span className="text-2xl sm:text-5xl font-black text-[#00E5FF] italic drop-shadow-[0_0_20px_rgba(0,229,255,0.4)] tracking-tighter uppercase whitespace-nowrap">
                        ₹{product.price}
                    </span>
                </div>
            </div>

            {/* Bottom Section - ACTION AREA */}
            <div className="mt-auto flex flex-col sm:flex-row gap-3 sm:gap-5 pt-4 sm:pt-6 border-t border-[#00E5FF]/10">
                {/* Cart Toggle Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAddToCart}
                    className={`h-12 sm:h-16 w-full sm:w-16 rounded-xl sm:rounded-[1.8rem] flex items-center justify-center transition-all duration-500 border-2 flex-shrink-0 ${added ? 'bg-green-500 border-green-400 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'bg-[#0B2A4A]/40 text-[#00E5FF] border-[#00E5FF]/20 hover:border-[#00E5FF] hover:bg-[#00E5FF]/10'}`}
                >
                    <AnimatePresence mode="wait">
                        {added ? (
                            <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                                <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="sm:hidden text-[9px] font-black uppercase tracking-widest leading-none">Added</span>
                            </motion.div>
                        ) : (
                            <motion.div key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="sm:hidden text-[9px] font-black uppercase tracking-widest leading-none">Add to Cart</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>

                {/* Primary Buy Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBuyNow}
                    className="flex-grow h-12 sm:h-16 btn-premium flex items-center justify-center gap-2 sm:gap-4 text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] relative overflow-hidden group/btn shadow-[0_10px_30px_rgba(0,229,255,0.2)] rounded-xl sm:rounded-[1.8rem]"
                >
                    <span className="relative z-10">Buy Now</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform group-hover/btn:translate-x-2" />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ProductCard;

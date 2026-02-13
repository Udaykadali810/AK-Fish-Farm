import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Star, Check, Plus, ArrowRight } from 'lucide-react';
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
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group relative glass-card rounded-[3rem] overflow-visible min-h-[500px]"
        >
            <div className="relative p-8 flex flex-col h-full">
                {/* Image Section */}
                <Link to={`/product/${product.id}`} className="block mb-8">
                    <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-[#0B2A4A]/20 border border-[#00E5FF]/10 shadow-2xl">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#BFEFFF]/10 font-black italic text-5xl">AK</div>
                        )}

                        {/* Floating Price Tag: Neon Cyan Glow */}
                        <div className="absolute top-5 right-5 bg-[#071A2F]/90 backdrop-blur-2xl border border-[#00E5FF]/30 px-5 py-2.5 rounded-2xl text-[11px] font-extrabold text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)] uppercase tracking-widest z-20">
                            ₹{product.price}
                        </div>

                        {/* Category Badge */}
                        <div className={`absolute bottom-5 left-5 px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl z-20 ${product.category === 'AK Premium Collection' ? 'bg-[#00E5FF] text-[#071A2F] shadow-[0_0_20px_rgba(0,229,255,0.4)]' : 'bg-[#BFEFFF]/90 text-[#071A2F]'}`}>
                            {product.category === 'AK Premium Collection' ? '💎 Premium' : product.category.replace(' Collection', '')}
                        </div>
                    </div>
                </Link>

                {/* Content Section */}
                <div className="flex flex-col flex-grow px-2">
                    <div className="mb-5">
                        <Link to={`/product/${product.id}`} className="block min-w-0">
                            <h3 className="text-2xl sm:text-3xl font-black text-[#BFEFFF] italic group-hover:text-[#00E5FF] transition-colors duration-500 uppercase tracking-tighter leading-[1.1] whitespace-normal break-words overflow-visible">
                                {product.name}
                                {product.category === 'AK Premium Collection' && <span className="text-[#00E5FF] ml-2 inline-block animate-pulse">★</span>}
                            </h3>
                        </Link>
                    </div>

                    <p className="text-[#BFEFFF]/40 text-xs mb-10 font-medium leading-relaxed tracking-wide italic leading-snug">
                        {product.description}
                    </p>

                    {/* Action Area: Premium Buttons */}
                    <div className="mt-auto flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 active:scale-90 border-2 flex-shrink-0 ${added ? 'bg-green-500 border-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-[#0B2A4A]/40 text-[#BFEFFF]/60 border-[#00E5FF]/20 hover:border-[#00E5FF] hover:text-[#00E5FF]'}`}
                            title="Add to Cart"
                        >
                            <AnimatePresence mode="white/5">
                                {added ? (
                                    <motion.div key="added" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                                        <Check className="w-6 h-6" />
                                    </motion.div>
                                ) : (
                                    <motion.div key="add" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                                        <ShoppingCart className="w-6 h-6" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>

                        <button
                            onClick={handleBuyNow}
                            className="flex-grow h-16 btn-premium flex items-center justify-center gap-4 text-xs"
                        >
                            Buy Now <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;

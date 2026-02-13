import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Star, Check, Plus } from 'lucide-react';
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
            viewport={{ once: true, margin: "-50px" }}
            className="group relative glass-card rounded-[3rem] overflow-hidden border border-white/5 transition-all duration-700 hover:border-aqua/30 flex flex-col h-full bg-dark"
        >
            <div className="relative p-5 flex-grow flex flex-col">
                {/* Image Section */}
                <Link to={`/product/${product.id}`} className="block">
                    <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-white/[0.03] mb-8 border border-white/5">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/10 font-black italic text-4xl">AK</div>
                        )}

                        {/* Floating Highlights */}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent pointer-events-none"></div>

                        {/* Price Tag: Vibrant Neon Cyan */}
                        <div className="absolute top-5 right-5 bg-dark/60 backdrop-blur-3xl border border-aqua/30 neon-price px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider z-10">
                            ₹{product.price}
                        </div>

                        {/* Label: High Contrast White/Dark */}
                        <div className="absolute bottom-5 left-5 px-5 py-2.5 bg-white text-dark rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl z-20">
                            {product.category}
                        </div>
                    </div>
                </Link>

                {/* Info Container */}
                <div className="px-3 pb-2 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <Link to={`/product/${product.id}`} className="flex-grow">
                            <h3 className="text-2xl font-black text-white italic line-clamp-1 group-hover:text-aqua transition-colors duration-500 uppercase tracking-tighter">
                                {product.name}
                            </h3>
                        </Link>
                        <div className="flex items-center text-accent font-black text-[10px] bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                            <Star className="w-3 h-3 fill-accent mr-1.5" /> {product.rating}
                        </div>
                    </div>

                    <p className="text-white/30 text-xs mb-10 line-clamp-2 h-10 font-medium leading-relaxed tracking-wide">
                        {product.description}
                    </p>

                    {/* Industrial/Professional Action Area */}
                    <div className="mt-auto flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            className={`p-5 rounded-[2.2rem] flex items-center justify-center transition-all duration-500 active:scale-90 border ${added ? 'bg-green-500 border-green-400 text-white shadow-xl shadow-green-500/20' : 'bg-white/5 text-aqua border-white/10 hover:bg-aqua hover:text-dark hover:border-aqua shadow-2xl'}`}
                        >
                            <AnimatePresence mode="wait">
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
                            className="flex-grow py-5 bg-aqua text-dark rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-aqua/20 hover:shadow-aqua/40 active:scale-95 transition-all text-center flex items-center justify-center gap-3"
                        >
                            Instant Get <Plus className="w-4 h-4 font-black" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;

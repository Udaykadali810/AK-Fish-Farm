import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{
                y: -10,
                rotateX: 5,
                rotateY: -5,
                transition: { duration: 0.3 }
            }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="group relative glass-card rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-primary/20 transform-gpu perspective-1000"
        >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

            {/* Logo Container (Replaces Image) */}
            <div className="relative h-64 flex items-center justify-center bg-gradient-to-br from-white/90 to-blue-50/80 overflow-hidden group-hover:bg-white transition-all duration-700">
                {/* Rotating Shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-1000">
                    <div className="absolute inset-[-100%] bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.8)_50%,transparent_75%)] animate-[spin_8s_linear_infinite]" />
                </div>

                <motion.div
                    animate={{
                        y: [0, -8, 0],
                    }}
                    whileHover={{ scale: 1.15 }}
                    transition={{
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        scale: { duration: 0.4 }
                    }}
                    className="flex flex-col items-center relative z-10"
                >
                    <div className="w-24 h-24 bg-gradient-to-tr from-primary to-accent rounded-3xl flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-all duration-700 group-hover:shadow-[0_0_30px_rgba(0,210,255,0.6)]">
                        <span className="text-4xl font-black text-white italic">AK</span>
                    </div>
                </motion.div>

                <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Content */}
            <div className="p-8 relative z-10">
                <div className="flex justify-between items-start mb-4 text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="text-primary/60">{product.category}</span>
                    <div className="flex items-center text-yellow-500/80">
                        <Star className="w-3 h-3 fill-yellow-500/50 mr-1" /> {product.rating}
                    </div>
                </div>

                <Link to={`/product/${product.id}`}>
                    <h3 className="text-xl font-black text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors italic">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-text-main/50 text-xs mb-8 line-clamp-2 h-10 leading-relaxed font-medium">
                    {product.description}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Price</span>
                        <span className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">₹{product.price}</span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className={`group/btn relative px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-500 flex items-center gap-2 overflow-hidden ${added ? 'bg-green-500 text-white' : 'bg-primary text-dark hover:shadow-[0_0_20px_rgba(0,180,216,0.4)]'}`}
                    >
                        <AnimatePresence mode="wait">
                            {added ? (
                                <motion.div key="added" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Added
                                </motion.div>
                            ) : (
                                <motion.div key="add" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4" /> Add
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;

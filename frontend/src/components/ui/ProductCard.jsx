import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const navigate = useNavigate();
    const isMobile = window.innerWidth < 768;

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = (e) => {
        e.preventDefault();
        addToCart(product);
        navigate('/checkout');
    };



    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 }
            }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true, margin: "-50px" }}
            className="group relative glass-card rounded-[3rem] overflow-hidden border border-white/40 shadow-xl transition-all duration-500 hover:shadow-primary/20 transform-gpu"
        >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

            {/* Image Container */}
            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-50/50 to-white/30 flex items-center justify-center p-6 group-hover:from-primary/10 transition-colors duration-500">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="text-center transform group-hover:scale-110 transition-transform duration-700">
                        <span className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic drop-shadow-sm block mb-2">
                            AK Fish Farms
                        </span>
                        <div className="flex items-center justify-center gap-2 opacity-60">
                            <div className="h-[1px] w-8 bg-primary/40"></div>
                            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400">Premium</span>
                            <div className="h-[1px] w-8 bg-primary/40"></div>
                        </div>
                    </div>
                )}

                <div className="absolute top-4 right-4 bg-primary/90 text-dark font-black px-4 py-2 rounded-2xl text-[10px] shadow-lg z-10 backdrop-blur-md">
                    ₹{product.price} / pair
                </div>
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
                    <h3 className="text-xl font-black text-dark mb-2 line-clamp-1 group-hover:text-primary transition-colors italic">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-gray-500 text-xs mb-8 line-clamp-2 h-10 leading-relaxed font-medium">
                    {product.description}
                </p>


                <div className="flex flex-col gap-4 mt-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-dark/40 uppercase tracking-widest">Price</span>
                            <span className="text-2xl font-black text-dark italic">₹{product.price}</span>
                        </div>
                        <div className="flex items-center text-yellow-500/80 bg-white/50 px-3 py-1 rounded-full border border-white/40">
                            <Star className="w-3 h-3 fill-yellow-500/50 mr-1" /> {product.rating}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleAddToCart}
                            className={`flex-1 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 shadow-lg active:scale-95 ${added ? 'bg-green-500 text-white' : 'bg-primary text-white hover:shadow-primary/30'}`}
                        >
                            <AnimatePresence mode="wait">
                                {added ? (
                                    <motion.div key="added" initial={{ y: 10 }} animate={{ y: 0 }} exit={{ y: -10 }} className="flex items-center gap-2">
                                        <Check className="w-4 h-4" /> Added
                                    </motion.div>
                                ) : (
                                    <motion.div key="add" initial={{ y: 10 }} animate={{ y: 0 }} exit={{ y: -10 }} className="flex items-center gap-2">
                                        <ShoppingCart className="w-4 h-4" /> Add
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>

                        <button
                            onClick={handleBuyNow}
                            className="flex-1 py-5 bg-[#FF6B6B] text-white rounded-[2rem] font-black text-xs uppercase tracking-widest text-center shadow-lg hover:shadow-[#FF6B6B]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            Buy Now
                        </button>

                    </div>
                </div>
            </div>
        </motion.div>
    );
};


export default ProductCard;

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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="group relative glass-card rounded-[2.5rem] overflow-hidden border border-white/10 transition-all duration-700 hover:border-aqua/40 flex flex-col h-full"
        >
            {/* 3D Floating Effect Container */}
            <div className="relative p-4 flex-grow flex flex-col">

                {/* Image Container with Glow */}
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-gradient-to-br from-white/5 to-white/0 mb-6 group-hover:shadow-[0_0_30px_rgba(14,165,233,0.1)] transition-all duration-700">
                    <div className="absolute inset-0 bg-aqua/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                            <span className="text-2xl font-black italic">AK</span>
                        </div>
                    )}

                    {/* Price Badge - Aqua Glowing */}
                    <div className="absolute top-4 right-4 bg-aqua text-dark font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(14,165,233,0.4)] z-10 backdrop-blur-md">
                        ₹{product.price}
                    </div>

                    {/* Category Overlay */}
                    <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md text-white/60 font-black px-4 py-2 rounded-xl text-[8px] uppercase tracking-widest z-10">
                        {product.category}
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 pb-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-3">
                        <Link to={`/product/${product.id}`} className="flex-grow pr-4">
                            <h3 className="text-xl font-black text-white italic line-clamp-1 group-hover:text-aqua transition-colors duration-500">
                                {product.name}
                            </h3>
                        </Link>
                        <div className="flex items-center text-accent/80 font-bold text-xs">
                            <Star className="w-3 h-3 fill-accent mr-1" /> {product.rating}
                        </div>
                    </div>

                    <p className="text-white/40 text-xs mb-8 line-clamp-2 h-10 font-medium leading-relaxed tracking-wide">
                        {product.description}
                    </p>

                    {/* Action Area */}
                    <div className="mt-auto flex gap-3">
                        <button
                            onClick={handleAddToCart}
                            className={`p-4 rounded-2xl flex items-center justify-center transition-all duration-500 active:scale-90 border border-white/10 ${added ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-white/5 text-aqua hover:bg-aqua hover:text-dark hover:shadow-aqua/20 shadow-lg'}`}
                        >
                            <AnimatePresence mode="wait">
                                {added ? (
                                    <motion.div key="added" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                                        <Check className="w-5 h-5" />
                                    </motion.div>
                                ) : (
                                    <motion.div key="add" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
                                        <ShoppingCart className="w-5 h-5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>

                        <button
                            onClick={handleBuyNow}
                            className="flex-grow py-4 bg-aqua text-dark rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-aqua/10 hover:shadow-aqua/30 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                        >
                            Quick Buy <Plus className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;

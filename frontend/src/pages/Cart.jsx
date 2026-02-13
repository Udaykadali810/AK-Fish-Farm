import React from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, X, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#071A2F]/50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-16 rounded-[4rem] text-center max-w-lg border border-[#00E5FF]/20"
                >
                    <div className="w-24 h-24 bg-[#0B2A4A] rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(0,229,255,0.2)]">
                        <ShoppingBag className="w-10 h-10 text-[#00C2D1]" />
                    </div>
                    <h2 className="text-4xl font-black text-[#BFEFFF] mb-6 italic uppercase tracking-tighter">Your Tank is <span className="text-[#00E5FF]">Empty</span></h2>
                    <p className="text-[#BFEFFF]/40 mb-12 font-medium tracking-wide">Explore our elite collection and start your aquatic journey today.</p>
                    <Link to="/shop" className="inline-block px-12 py-6 btn-premium text-xs">
                        Start Shopping
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-40 pb-32 px-4 sm:px-10 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16">
                {/* Cart Items List */}
                <div className="lg:w-2/3 space-y-8">
                    <div className="flex justify-between items-end mb-10 px-4">
                        <h1 className="text-5xl font-black text-[#BFEFFF] italic uppercase tracking-tighter">Shopping <span className="text-[#00E5FF]">Cart</span></h1>
                        <button onClick={clearCart} className="text-[#00E5FF]/30 hover:text-[#00E5FF] text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-2">
                            <Trash2 className="w-4 h-4" /> Purge Cart
                        </button>
                    </div>

                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item) => (
                                <motion.div
                                    layout
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="glass-card p-8 rounded-[3rem] border border-[#00E5FF]/10 hover:border-[#00E5FF]/30 transition-all flex flex-col sm:flex-row items-center gap-10"
                                >
                                    {/* Product Image */}
                                    <div className="w-40 h-28 rounded-2xl overflow-hidden bg-[#0B2A4A]/40 border border-[#00E5FF]/10 shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Information */}
                                    <div className="flex-grow text-center sm:text-left min-w-0">
                                        <h3 className="text-2xl font-black text-[#BFEFFF] uppercase italic tracking-tighter truncate">{item.name}</h3>
                                        <p className="text-[#00E5FF] font-black text-sm tracking-widest mt-1">₹{item.price}</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-6 bg-[#0B2A4A]/20 p-2 rounded-2xl border border-[#00E5FF]/5">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#071A2F]/40 text-[#BFEFFF] hover:bg-[#00E5FF] hover:text-[#071A2F] transition-all"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-lg font-black text-[#BFEFFF] w-6 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#071A2F]/40 text-[#BFEFFF] hover:bg-[#00E5FF] hover:text-[#071A2F] transition-all"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Total per item */}
                                    <div className="text-center sm:text-right min-w-[100px]">
                                        <p className="text-2xl font-black text-[#BFEFFF] italic tracking-tighter">₹{item.price * item.quantity}</p>
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-500/40 hover:text-red-500 transition-colors mt-2">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="lg:w-1/3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-12 rounded-[4rem] border border-[#00E5FF]/20 sticky top-40 bg-gradient-to-br from-[#0B2A4A]/40 to-transparent"
                    >
                        <h2 className="text-3xl font-black text-[#BFEFFF] italic mb-10 uppercase tracking-tighter">Logistics <span className="text-[#00E5FF]">Check</span></h2>

                        <div className="space-y-6 mb-12">
                            <div className="flex justify-between items-center text-[#BFEFFF]/50 text-xs font-bold uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span className="text-[#BFEFFF]">₹{getCartTotal()}</span>
                            </div>
                            <div className="flex justify-between items-center text-[#BFEFFF]/50 text-xs font-bold uppercase tracking-widest">
                                <span>Protocol Fee</span>
                                <span className="text-green-500">COVERED</span>
                            </div>
                            <div className="h-px bg-[#00E5FF]/10 my-4"></div>
                            <div className="flex justify-between items-end">
                                <span className="text-[#BFEFFF]/30 font-black text-[10px] uppercase tracking-[0.4em]">Total Settlement</span>
                                <span className="text-5xl font-black text-[#BFEFFF] italic drop-shadow-[0_0_15px_rgba(0,229,255,0.4)] tracking-tighter">₹{getCartTotal()}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full py-8 btn-premium flex items-center justify-center gap-4 text-xs shadow-[0_20px_50px_rgba(0,229,255,0.2)]"
                        >
                            Proceed to Checkout <ArrowRight className="w-6 h-6" />
                        </button>

                        <div className="mt-8 p-6 bg-[#071A2F]/40 rounded-3xl border border-[#00E5FF]/5">
                            <p className="text-[9px] font-black text-[#00C2D1] uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Secure Transmission
                            </p>
                            <p className="text-[#BFEFFF]/20 text-[9px] font-medium leading-relaxed uppercase tracking-wider">
                                All orders are processed via encrypted manual coordination for livestock safety.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

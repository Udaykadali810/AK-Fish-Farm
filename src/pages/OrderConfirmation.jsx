import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShoppingBag, Truck, Copy, Check, ArrowRight, Package } from 'lucide-react';

const OrderConfirmation = () => {
    const location = useLocation();
    const [copied, setCopied] = useState(false);
    const order = location.state?.order;

    if (!order) {
        return <Navigate to="/" />;
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(order.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass-card p-12 lg:p-16 rounded-[4rem] border border-white/10 shadow-3xl"
            >
                {/* Success Header */}
                <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.3)] border border-green-500/30">
                    <CheckCircle2 className="w-12 h-12" />
                </div>

                <h1 className="text-4xl lg:text-7xl font-black text-white italic mb-4">Order Placed <span className="text-primary italic">Successfully ✅</span></h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-12">Your aquatic life journey has officially begun.</p>

                {/* Big Bold Order ID */}
                <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] mb-12 relative group">
                    <span className="text-primary/60 font-black uppercase text-[10px] tracking-[0.4em] block mb-4">Unique Tracking Key</span>

                    <Link
                        to="/track-order"
                        state={{ orderId: order.id }}
                        className="text-5xl lg:text-8xl font-black text-white italic tracking-tighter hover:text-primary transition-colors block mb-8"
                    >
                        {order.id}
                    </Link>

                    <button
                        onClick={copyToClipboard}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border border-white/10"
                    >
                        {copied ? (
                            <><Check className="w-4 h-4 text-green-500" /> Key Copied!</>
                        ) : (
                            <><Copy className="w-4 h-4" /> Copy Order ID</>
                        )}
                    </button>

                    <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
                        <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                </div>

                {/* Quick Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="glass-card p-6 rounded-3xl border border-white/5 text-left">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer</p>
                        <p className="text-lg font-black text-white italic">{order.customerName}</p>
                    </div>
                    <div className="glass-card p-6 rounded-3xl border border-white/5 text-left">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-lg font-black text-primary italic">₹{order.total}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link to="/shop" className="px-12 py-5 glass-card rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/10">
                        Back to Shop
                    </Link>
                    <Link
                        to="/track-order"
                        state={{ orderId: order.id }}
                        className="px-12 py-5 bg-primary text-dark rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <Package className="w-4 h-4" /> Track Your Order
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderConfirmation;

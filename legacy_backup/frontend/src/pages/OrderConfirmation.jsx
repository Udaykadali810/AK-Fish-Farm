import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle2, Copy, Check, Package,
    ShoppingBag, Phone, MapPin, Tag
} from 'lucide-react';

/* ── Inline WhatsApp icon ── */
const WAIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

const OrderConfirmation = () => {
    const location = useLocation();
    const [copied, setCopied] = useState(false);
    const order = location.state?.order;

    if (!order) return <Navigate to="/" />;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(order.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">

            {/* ── Success Card ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="glass-card p-12 lg:p-16 rounded-[4rem] border border-green-500/20 shadow-3xl text-center mb-10"
            >
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 18 }}
                    className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_60px_rgba(34,197,94,0.3)] border border-green-500/30"
                >
                    <CheckCircle2 className="w-12 h-12" />
                </motion.div>

                {/* Heading */}
                <h1 className="text-4xl lg:text-7xl font-black text-[#BFEFFF] italic mb-4 leading-tight tracking-tighter">
                    Order Placed{' '}
                    <span className="text-green-400 italic">Successfully! 🎉</span>
                </h1>
                <p className="text-[#BFEFFF]/40 font-bold uppercase tracking-widest text-[10px] mb-6">
                    Your aquatic life journey has officially begun.
                </p>

                {/* WhatsApp opened banner */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl mb-10 mx-auto max-w-sm"
                    style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)' }}
                >
                    <WAIcon size={20} />
                    <span className="text-green-400 font-black text-xs uppercase tracking-widest">
                        WhatsApp Order Sent ✓
                    </span>
                </motion.div>

                {/* Order ID */}
                <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] mb-10 relative group">
                    <span className="text-[#00E5FF]/60 font-black uppercase text-[10px] tracking-[0.4em] block mb-4">
                        Unique Tracking Key
                    </span>

                    <div className="text-5xl lg:text-7xl font-black text-[#BFEFFF] italic tracking-tighter mb-8 break-all">
                        {order.id}
                    </div>

                    <button
                        onClick={copyToClipboard}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border border-white/10"
                    >
                        {copied ? (
                            <><Check className="w-4 h-4 text-green-400" /> Copied!</>
                        ) : (
                            <><Copy className="w-4 h-4" /> Copy Order ID</>
                        )}
                    </button>
                </div>

                {/* Customer Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">

                    {order.customerName && (
                        <div className="glass-card p-6 rounded-3xl border border-white/5 flex items-start gap-4">
                            <ShoppingBag className="w-5 h-5 text-[#00E5FF] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-widest mb-1">Customer</p>
                                <p className="text-base font-black text-[#BFEFFF] italic">{order.customerName}</p>
                            </div>
                        </div>
                    )}

                    {order.phone && (
                        <div className="glass-card p-6 rounded-3xl border border-white/5 flex items-start gap-4">
                            <Phone className="w-5 h-5 text-[#00E5FF] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-widest mb-1">Phone</p>
                                <p className="text-base font-black text-[#BFEFFF] italic">{order.phone}</p>
                            </div>
                        </div>
                    )}

                    {order.place && (
                        <div className="glass-card p-6 rounded-3xl border border-white/5 flex items-start gap-4">
                            <MapPin className="w-5 h-5 text-[#00E5FF] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-widest mb-1">Delivery Address</p>
                                <p className="text-base font-black text-[#BFEFFF] italic">{order.place}</p>
                            </div>
                        </div>
                    )}

                    <div className="glass-card p-6 rounded-3xl border border-white/5 flex items-start gap-4">
                        <Tag className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-widest mb-1">Total Amount</p>
                            <p className="text-2xl font-black text-green-400 italic">₹{order.total}</p>
                        </div>
                    </div>
                </div>

                {/* Items List */}
                {order.items && order.items.length > 0 && (
                    <div className="glass-card p-8 rounded-3xl border border-white/5 mb-10 text-left">
                        <p className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-[0.4em] mb-6">Order Items</p>
                        <div className="space-y-4">
                            {order.items.map((item, i) => (
                                <div key={item.id} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <span className="text-[#BFEFFF] font-black italic text-sm">{item.name}</span>
                                        <span className="text-[#BFEFFF]/30 font-bold text-[10px] uppercase tracking-widest ml-3">× {item.quantity}</span>
                                    </div>
                                    <span className="text-[#BFEFFF] font-black italic">₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link
                        to="/shop"
                        className="px-12 py-5 glass-card rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/10 text-[#BFEFFF]"
                    >
                        Continue Shopping
                    </Link>
                    <Link
                        to="/track-order"
                        state={{ orderId: order.id }}
                        className="px-12 py-5 bg-primary text-dark rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <Package className="w-4 h-4" />
                        Track Your Order
                    </Link>
                </div>
            </motion.div>

            {/* ── What happens next card ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-10 rounded-[3rem] border border-[#00E5FF]/10"
            >
                <p className="text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.5em] mb-6 flex items-center gap-2">
                    <WAIcon size={14} /> What happens next?
                </p>
                <ol className="space-y-4 text-sm text-[#BFEFFF]/50 font-medium leading-relaxed">
                    {[
                        'Your order was sent to AK FishFarms via WhatsApp in a fully formatted message.',
                        'Our team will call / WhatsApp you within a few hours to confirm delivery details.',
                        'Fish are carefully packed and dispatched to your address.',
                        'Pay on delivery — no online payment needed!',
                    ].map((step, i) => (
                        <li key={i} className="flex items-start gap-4">
                            <span className="w-6 h-6 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {i + 1}
                            </span>
                            {step}
                        </li>
                    ))}
                </ol>
            </motion.div>

        </div>
    );
};

export default OrderConfirmation;

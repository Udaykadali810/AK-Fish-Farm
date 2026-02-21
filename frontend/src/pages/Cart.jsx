import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2, Plus, Minus, ShoppingBag, X, ShieldCheck,
    MessageCircle, User, Phone, MapPin, Loader2, CheckCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

/* ── WhatsApp SVG Icon (inline, no external dep) ── */
const WAIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart, coupon, applyCoupon, removeCoupon, getFinalTotal, initiateWhatsAppOrder } = useCart();
    const navigate = useNavigate();

    /* Coupon state */
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState(false);

    /* Delivery form state */
    const [showDeliveryForm, setShowDeliveryForm] = useState(false);
    const [formData, setFormData] = useState({ customerName: '', phone: '', place: '' });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [orderDone, setOrderDone] = useState(false);

    /* ── Coupon logic ── */
    const handleApplyCoupon = () => {
        if (!couponCode) return;
        setCouponError('');
        setCouponSuccess(false);
        const result = applyCoupon(couponCode);
        if (result.success) {
            setCouponSuccess(true);
            setCouponCode('');
            setTimeout(() => setCouponSuccess(false), 3000);
        } else {
            setCouponError(result.message);
        }
    };

    /* ── Form validation ── */
    const validate = () => {
        const errs = {};
        if (!formData.customerName.trim() || formData.customerName.trim().length < 2)
            errs.customerName = 'Please enter your full name (min 2 characters).';
        if (!/^[6-9]\d{9}$/.test(formData.phone))
            errs.phone = 'Enter a valid 10-digit Indian mobile number.';
        if (!formData.place.trim() || formData.place.trim().length < 10)
            errs.place = 'Please enter a complete delivery address (min 10 chars).';
        return errs;
    };

    /* ── Initiate Delivery ── */
    const handleInitiateDelivery = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setFormErrors(errs);
            return;
        }
        setFormErrors({});
        setLoading(true);

        // Simulate brief processing, then open WhatsApp
        setTimeout(() => {
            initiateWhatsAppOrder(formData);
            setLoading(false);
            setOrderDone(true);
            // Navigate to success page after 1.5 s
            setTimeout(() => navigate('/order-success', {
                state: {
                    order: {
                        id: `AKF-2026-${Math.floor(10000 + Math.random() * 90000)}`,
                        customerName: formData.customerName,
                        total: getFinalTotal()
                    }
                }
            }), 1500);
        }, 1500);
    };

    /* ── Input change helper ── */
    const handleChange = (field) => (e) => {
        let val = e.target.value;
        if (field === 'phone') val = val.replace(/\D/g, '').slice(0, 10);
        setFormData(prev => ({ ...prev, [field]: val }));
        if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
    };

    /* ── Empty cart state ── */
    if (cart.length === 0 && !orderDone) {
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

    /* ── Order done state ── */
    if (orderDone) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-16 rounded-[4rem] text-center max-w-md border border-green-500/30"
                >
                    <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-6" />
                    <h2 className="text-4xl font-black text-[#BFEFFF] italic mb-3 uppercase tracking-tight">
                        Order Placed! 🎉
                    </h2>
                    <p className="text-[#BFEFFF]/50 text-sm font-medium">
                        WhatsApp is opening… We'll confirm your delivery shortly.
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-40 pb-32 px-4 sm:px-10 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16">

                {/* ── Cart Items ── */}
                <div className="lg:w-2/3 space-y-8">
                    <div className="flex justify-between items-end mb-10 px-4">
                        <h1 className="text-5xl font-black text-[#BFEFFF] italic uppercase tracking-tighter">
                            Shopping <span className="text-[#00E5FF]">Cart</span>
                        </h1>
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
                                    {/* Image */}
                                    <div className="w-40 h-28 rounded-2xl overflow-hidden bg-[#0B2A4A]/40 border border-[#00E5FF]/10 shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-grow text-center sm:text-left min-w-0">
                                        <h3 className="text-2xl font-black text-[#BFEFFF] uppercase italic tracking-tighter truncate">{item.name}</h3>
                                        <p className="text-[#00E5FF] font-black text-sm tracking-widest mt-1">₹{item.price} / pair</p>
                                    </div>

                                    {/* Qty Controls */}
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

                                    {/* Subtotal + Remove */}
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

                {/* ── Right Panel: Summary + Delivery Form ── */}
                <div className="lg:w-1/3 space-y-6">

                    {/* Summary Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-10 rounded-[3rem] border border-[#00E5FF]/20 sticky top-40 bg-gradient-to-br from-[#0B2A4A]/40 to-transparent"
                    >
                        <h2 className="text-2xl font-black text-[#BFEFFF] italic mb-8 uppercase tracking-tighter">
                            Settlement <span className="text-[#00E5FF]">Node</span>
                        </h2>

                        {/* Coupon */}
                        <div className="mb-8 p-5 bg-[#071A2F]/40 rounded-2xl border border-[#00E5FF]/10">
                            <label className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-[0.4em] mb-3 block ml-1">
                                Protocol Discount
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Code"
                                    className="flex-grow bg-[#0B2A4A]/60 border border-[#00E5FF]/20 rounded-xl px-4 py-3 text-xs font-black text-[#BFEFFF] uppercase tracking-widest outline-none focus:border-[#00E5FF] transition-all"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className="px-5 py-3 bg-[#00E5FF] text-[#071A2F] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                                >
                                    Apply
                                </button>
                            </div>
                            {coupon && (
                                <div className="mt-3 flex items-center justify-between text-green-400 text-[10px] font-black uppercase tracking-widest px-1">
                                    <span>✅ Code Active: {coupon.code} (-{coupon.percent}%)</span>
                                    <button onClick={removeCoupon} className="text-[#BFEFFF]/20 hover:text-red-400">Remove</button>
                                </div>
                            )}
                            {couponError && <p className="mt-3 text-red-400 text-[9px] font-black uppercase tracking-widest px-1">{couponError}</p>}
                            {couponSuccess && <p className="mt-3 text-green-400 text-[9px] font-black uppercase tracking-widest px-1">✅ Coupon Applied!</p>}
                        </div>

                        {/* Totals */}
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-[#BFEFFF]/50 text-xs font-bold uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span className="text-[#BFEFFF]">₹{getCartTotal()}</span>
                            </div>
                            {coupon && (
                                <div className="flex justify-between items-center text-green-400 text-xs font-bold uppercase tracking-widest">
                                    <span>Discount ({coupon.percent}%)</span>
                                    <span>-₹{Math.round(coupon.amount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-[#BFEFFF]/50 text-xs font-bold uppercase tracking-widest">
                                <span>Logistics Fee</span>
                                <span className="text-green-500">COVERED</span>
                            </div>
                            <div className="h-px bg-[#00E5FF]/10 my-2" />
                            <div className="flex justify-between items-end">
                                <span className="text-[#BFEFFF]/30 font-black text-[10px] uppercase tracking-[0.4em]">Net Total</span>
                                <span className="text-4xl font-black text-[#BFEFFF] italic drop-shadow-[0_0_15px_rgba(0,229,255,0.4)] tracking-tighter">
                                    ₹{getFinalTotal()}
                                </span>
                            </div>
                        </div>

                        {/* Primary CTA: Initiate Delivery */}
                        <button
                            onClick={() => setShowDeliveryForm(v => !v)}
                            className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all"
                            style={{
                                background: 'linear-gradient(135deg, #25D366, #1DA851)',
                                color: '#fff',
                                boxShadow: '0 8px 32px rgba(37,211,102,0.35)'
                            }}
                        >
                            <WAIcon />
                            Initiate Delivery via WhatsApp
                        </button>

                        <p className="mt-3 text-[9px] font-black text-[#BFEFFF]/20 uppercase tracking-widest text-center">
                            🔒 Your details are only shared with AK FishFarms via WhatsApp
                        </p>

                        {/* Security note */}
                        <div className="mt-6 p-5 bg-[#071A2F]/40 rounded-2xl border border-[#00E5FF]/5">
                            <p className="text-[9px] font-black text-[#00C2D1] uppercase tracking-[0.3em] mb-1 flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5" /> Secure Transmission
                            </p>
                            <p className="text-[#BFEFFF]/20 text-[9px] font-medium leading-relaxed uppercase tracking-wider">
                                No online payment required. Our team contacts you via WhatsApp to confirm delivery & payment.
                            </p>
                        </div>
                    </motion.div>

                    {/* ── Delivery Form (expands below summary card) ── */}
                    <AnimatePresence>
                        {showDeliveryForm && (
                            <motion.div
                                key="delivery-form"
                                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                                className="glass-card p-10 rounded-[3rem] border border-green-500/20 bg-gradient-to-br from-[#0B2A4A]/30 to-transparent"
                            >
                                <h3 className="text-xl font-black text-[#BFEFFF] italic mb-2 uppercase tracking-tighter flex items-center gap-3">
                                    <MessageCircle className="w-5 h-5 text-green-400" />
                                    Delivery Details
                                </h3>
                                <p className="text-[#BFEFFF]/30 text-[10px] font-bold uppercase tracking-widest mb-8">
                                    Fill your details — order will be sent via WhatsApp
                                </p>

                                <form onSubmit={handleInitiateDelivery} className="space-y-6" noValidate>

                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-[0.4em] ml-1">Full Name *</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                placeholder="e.g. Uday Kumar"
                                                value={formData.customerName}
                                                onChange={handleChange('customerName')}
                                                maxLength={60}
                                                className={`w-full pl-14 pr-5 py-5 rounded-2xl bg-[#0B2A4A]/40 border ${formErrors.customerName ? 'border-red-500/60' : 'border-[#00E5FF]/10'} focus:border-[#00E5FF]/50 focus:ring-2 focus:ring-[#00E5FF]/10 text-[#BFEFFF] font-bold transition-all outline-none placeholder-[#BFEFFF]/10 text-sm`}
                                            />
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#BFEFFF]/20 group-focus-within:text-[#00E5FF] h-5 w-5 transition-colors" />
                                        </div>
                                        {formErrors.customerName && (
                                            <p className="text-red-400 text-[10px] font-bold ml-1">{formErrors.customerName}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-[0.4em] ml-1">Phone Number *</label>
                                        <div className="relative group">
                                            <input
                                                type="tel"
                                                placeholder="e.g. 9492045766"
                                                value={formData.phone}
                                                onChange={handleChange('phone')}
                                                className={`w-full pl-14 pr-5 py-5 rounded-2xl bg-[#0B2A4A]/40 border ${formErrors.phone ? 'border-red-500/60' : 'border-[#00E5FF]/10'} focus:border-[#00E5FF]/50 focus:ring-2 focus:ring-[#00E5FF]/10 text-[#BFEFFF] font-bold transition-all outline-none placeholder-[#BFEFFF]/10 text-sm`}
                                            />
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-[#BFEFFF]/20 group-focus-within:text-[#00E5FF] h-5 w-5 transition-colors" />
                                        </div>
                                        {formErrors.phone && (
                                            <p className="text-red-400 text-[10px] font-bold ml-1">{formErrors.phone}</p>
                                        )}
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-[0.4em] ml-1">Delivery Address *</label>
                                        <div className="relative group">
                                            <textarea
                                                rows={3}
                                                placeholder="House No., Street, City, PIN..."
                                                value={formData.place}
                                                onChange={handleChange('place')}
                                                className={`w-full pl-14 pr-5 py-5 rounded-2xl bg-[#0B2A4A]/40 border ${formErrors.place ? 'border-red-500/60' : 'border-[#00E5FF]/10'} focus:border-[#00E5FF]/50 focus:ring-2 focus:ring-[#00E5FF]/10 text-[#BFEFFF] font-bold transition-all outline-none placeholder-[#BFEFFF]/10 text-sm resize-none`}
                                            />
                                            <MapPin className="absolute left-5 top-5 text-[#BFEFFF]/20 group-focus-within:text-[#00E5FF] h-5 w-5 transition-colors" />
                                        </div>
                                        {formErrors.place && (
                                            <p className="text-red-400 text-[10px] font-bold ml-1">{formErrors.place}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-6 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                        style={{
                                            background: loading ? '#1a7a40' : 'linear-gradient(135deg, #25D366, #1DA851)',
                                            color: '#fff',
                                            boxShadow: '0 8px 32px rgba(37,211,102,0.35)'
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Opening WhatsApp…
                                            </>
                                        ) : (
                                            <>
                                                <WAIcon />
                                                Confirm &amp; Send Order
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
                {/* END Right Panel */}
            </div>
        </div>
    );
};

export default Cart;

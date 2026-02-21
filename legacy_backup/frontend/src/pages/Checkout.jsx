import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, MapPin, Phone, ShoppingBag, Tag,
    CheckCircle2, Loader2, AlertCircle
} from 'lucide-react';

/* ── Inline WhatsApp icon ── */
const WAIcon = ({ size = 22 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size} height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

/* ── Field wrapper ── */
const Field = ({ label, icon: Icon, error, children }) => (
    <div className="space-y-3">
        <label className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-[0.4em] ml-2 block">
            {label}
        </label>
        <div className="relative group">
            {children}
            <Icon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#BFEFFF]/20 group-focus-within:text-[#00E5FF] transition-colors pointer-events-none" />
        </div>
        <AnimatePresence>
            {error && (
                <motion.p
                    key="err"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-[10px] font-bold ml-2 flex items-center gap-1"
                >
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {error}
                </motion.p>
            )}
        </AnimatePresence>
    </div>
);

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, coupon, getFinalTotal, initiateWhatsAppOrder } = useCart();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        customerName: user?.name || '',
        phone: user?.phone || '',
        place: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    /* Pre-fill from auth user */
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                customerName: user.name || '',
                phone: user.phone || '',
            }));
        }
    }, [user]);

    /* Redirect if cart is empty */
    useEffect(() => {
        if (cart.length === 0) navigate('/shop');
    }, [cart, navigate]);

    if (cart.length === 0) return null;

    /* ── Validation ── */
    const validate = () => {
        const e = {};
        if (!formData.customerName.trim() || formData.customerName.trim().length < 2)
            e.customerName = 'Enter your full name (min 2 characters).';
        if (!/^[6-9]\d{9}$/.test(formData.phone))
            e.phone = 'Enter a valid 10-digit Indian mobile number.';
        if (!formData.place.trim() || formData.place.trim().length < 10)
            e.place = 'Enter a complete delivery address (min 10 characters).';
        return e;
    };

    /* ── Submit handler ── */
    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);

        setTimeout(() => {
            /* Opens WhatsApp, saves order, clears cart */
            const savedOrder = initiateWhatsAppOrder(formData);
            setLoading(false);
            navigate('/order-success', { state: { order: savedOrder } });
        }, 1600);
    };

    /* ── Input helper ── */
    const handleChange = (field) => (e) => {
        let val = e.target.value;
        if (field === 'phone') val = val.replace(/\D/g, '').slice(0, 10);
        setFormData(prev => ({ ...prev, [field]: val }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const inputCls = (field) =>
        `w-full pl-16 pr-6 py-6 rounded-[2rem] bg-[#0B2A4A]/40 border
         ${errors[field] ? 'border-red-500/60' : 'border-[#00E5FF]/10'}
         focus:border-[#00E5FF]/50 focus:ring-4 focus:ring-[#00E5FF]/10
         text-[#BFEFFF] font-bold transition-all outline-none
         placeholder-[#BFEFFF]/10 text-sm`.replace(/\s+/g, ' ');

    const finalTotal = getFinalTotal();

    return (
        <div className="min-h-screen py-24 sm:py-32 px-4 pb-40 bg-[#071A2F]">
            <div className="max-w-6xl mx-auto">

                {/* ── Page Header ── */}
                <div className="text-center mb-20">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-[#00E5FF] text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">
                            Order Authorization
                        </span>
                        <h1 className="text-5xl lg:text-9xl font-black text-[#BFEFFF] italic mb-6 leading-[0.9] tracking-tighter uppercase">
                            Final <span className="text-[#00E5FF] glow-text">Step</span>
                        </h1>
                        <p className="text-[#BFEFFF]/40 font-medium tracking-[0.2em] text-xs uppercase">
                            Confirm your details — your order will be sent via WhatsApp instantly
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* ── Delivery Form ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-12 lg:p-16 rounded-[4rem] border border-[#00E5FF]/10 relative overflow-hidden"
                    >
                        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#00E5FF]/5 blur-[100px] rounded-full pointer-events-none" />

                        <h2 className="text-3xl font-black text-[#BFEFFF] italic mb-12 flex items-center gap-4 uppercase tracking-tighter">
                            <ShoppingBag className="text-[#00E5FF] w-8 h-8" />
                            Delivery Details
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10" noValidate>

                            {/* Name */}
                            <Field label="Full Name *" icon={User} error={errors.customerName}>
                                <input
                                    type="text"
                                    placeholder="e.g. Uday Kumar"
                                    value={formData.customerName}
                                    onChange={handleChange('customerName')}
                                    maxLength={60}
                                    className={inputCls('customerName')}
                                />
                            </Field>

                            {/* Phone */}
                            <Field label="Phone Number *" icon={Phone} error={errors.phone}>
                                <input
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    value={formData.phone}
                                    onChange={handleChange('phone')}
                                    className={inputCls('phone')}
                                />
                            </Field>

                            {/* Address */}
                            <Field label="Delivery Address *" icon={MapPin} error={errors.place}>
                                <textarea
                                    rows={3}
                                    placeholder="House No., Street, City, PIN Code…"
                                    value={formData.place}
                                    onChange={handleChange('place')}
                                    className={
                                        inputCls('place').replace('py-6', 'py-5') +
                                        ' resize-none pt-6'
                                    }
                                    style={{ paddingTop: '1.5rem' }}
                                />
                            </Field>

                            {/* ── INITIATE DELIVERY BUTTON ── */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.97 }}
                                className="w-full py-8 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-[0_12px_40px_rgba(37,211,102,0.35)]"
                                style={{
                                    background: loading
                                        ? '#1a7a40'
                                        : 'linear-gradient(135deg, #25D366 0%, #1DA851 100%)',
                                    color: '#fff',
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Opening WhatsApp…
                                    </>
                                ) : (
                                    <>
                                        <WAIcon size={22} />
                                        Initiate Delivery via WhatsApp
                                    </>
                                )}
                            </motion.button>

                            <p className="text-center text-[9px] font-black text-[#BFEFFF]/20 uppercase tracking-widest">
                                🔒 Your details are shared only with AK FishFarms via WhatsApp
                            </p>
                        </form>
                    </motion.div>

                    {/* ── Order Summary ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-12"
                    >
                        <div className="glass-card p-12 rounded-[4rem] border border-[#00E5FF]/10 bg-gradient-to-br from-[#0B2A4A]/20 to-transparent shadow-2xl">
                            <h3 className="text-3xl font-black text-[#BFEFFF] italic mb-10 uppercase tracking-tighter">
                                Inventory <span className="text-[#00E5FF]">Check</span>
                            </h3>

                            <div className="space-y-6 mb-12">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm border-b border-[#00E5FF]/5 pb-6">
                                        <div className="flex flex-col">
                                            <span className="text-[#BFEFFF] font-black italic uppercase tracking-tight">{item.name}</span>
                                            <span className="text-[#BFEFFF]/20 font-black text-[10px] uppercase tracking-widest">Qty: {item.quantity}</span>
                                        </div>
                                        <span className="text-[#BFEFFF] font-black italic text-xl">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}

                                {coupon && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-between items-center bg-[#00E5FF]/10 p-6 rounded-2xl border border-[#00E5FF]/20"
                                    >
                                        <span className="text-[#00E5FF] font-black flex items-center gap-3 uppercase text-[10px] tracking-widest">
                                            <Tag className="w-4 h-4" />
                                            Coupon: {coupon.code} (-{coupon.percent}%)
                                        </span>
                                        <span className="text-green-400 font-black italic text-xl">-₹{Math.round(coupon.amount)}</span>
                                    </motion.div>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-[#BFEFFF]/40 text-xs font-bold uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-[#BFEFFF]">₹{getCartTotal()}</span>
                                </div>
                                <div className="flex justify-between text-[#BFEFFF]/40 text-xs font-bold uppercase tracking-widest">
                                    <span>Delivery</span>
                                    <span className="text-green-500">FREE ✅</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end border-t border-[#00E5FF]/10 pt-8">
                                <div className="flex flex-col">
                                    <span className="text-[#BFEFFF]/20 font-black uppercase tracking-[0.4em] text-[10px] mb-2">Net Settlement</span>
                                    <span className="text-green-500 font-bold text-[9px] uppercase tracking-widest flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Logistics Covered
                                    </span>
                                </div>
                                <span className="text-5xl font-black text-[#BFEFFF] italic glow-text tracking-tighter">₹{finalTotal}</span>
                            </div>
                        </div>

                        {/* WhatsApp info card */}
                        <div className="p-10 bg-gradient-to-br from-green-900/20 to-transparent rounded-[3rem] border border-green-500/15 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/5 blur-[60px] rounded-full" />
                            <p className="text-[10px] font-black text-green-400 uppercase tracking-[0.5em] mb-4 flex items-center gap-2">
                                <WAIcon size={14} /> How it works
                            </p>
                            <ol className="text-[#BFEFFF]/40 text-xs font-medium leading-relaxed tracking-wide space-y-2 list-decimal list-inside">
                                <li>Click "Initiate Delivery via WhatsApp"</li>
                                <li>WhatsApp opens with your full order pre-filled</li>
                                <li>Hit Send — our team confirms within minutes</li>
                                <li>Pay on delivery. No online payment required!</li>
                            </ol>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;

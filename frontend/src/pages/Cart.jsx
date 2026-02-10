import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronLeft, Tag, Ticket, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
    const [offers, setOffers] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [couponError, setCouponError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/admin/offers');
                if (res.ok) {
                    const data = await res.json();
                    setOffers(data);
                }
            } catch (err) {
                console.error("Failed to fetch offers", err);
            }
        };
        fetchOffers();
    }, []);

    const handleApplyCoupon = () => {
        setCouponError('');
        const code = couponCode.toUpperCase();

        // Supported static coupons + dynamically fetched ones
        const staticOffers = [
            { code: 'AK10', discount: '10%', title: 'Special 10% Off' },
            { code: 'AK20', discount: '20%', title: 'Super 20% Off' }
        ];

        const allOffers = [...staticOffers, ...offers];
        const offer = allOffers.find(o => o.code && o.code.toUpperCase() === code);

        if (offer) {
            let discountValue = 0;
            let percent = 0;
            const subtotal = getCartTotal();

            if (offer.discount.includes('%')) {
                percent = parseInt(offer.discount.replace('%', ''));
                discountValue = (subtotal * percent) / 100;
            } else {
                percent = Math.round((parseInt(offer.discount) / subtotal) * 100);
                discountValue = parseInt(offer.discount);
            }

            setAppliedDiscount({
                code: offer.code,
                value: discountValue,
                percent: percent,
                title: offer.title
            });
            setCouponCode('');
        } else {
            setCouponError('Invalid coupon — please try again.');
            setAppliedDiscount(null);
        }
    };

    const subtotal = getCartTotal();
    const total = appliedDiscount ? Math.max(0, subtotal - appliedDiscount.value) : subtotal;

    const handleCheckout = () => {
        // Pass discount info to checkout if needed, or store in context
        navigate('/checkout', { state: { discount: appliedDiscount } });
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 rounded-[4rem] text-center max-w-md w-full"
                >
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <ShoppingBag className="w-12 h-12 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black text-white italic mb-4">Your tank is empty!</h2>
                    <p className="text-gray-400 mb-10 font-medium tracking-wide">Looks like you haven't added any species to your collection yet.</p>
                    <Link to="/shop" className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-dark rounded-3xl font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,180,216,0.4)] transition-all houver:scale-105 active:scale-95">
                        Start Shopping <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items List */}
                <div className="flex-grow space-y-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl lg:text-7xl font-black text-white italic tracking-tighter uppercase">
                            My <span className="text-primary italic">Collection</span>
                        </h1>
                        <span className="text-gray-500 font-black uppercase tracking-[0.3em] text-xs bg-white/5 px-6 py-3 rounded-2xl border border-white/5">{cart.length} species</span>
                    </div>

                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="glass-card p-6 rounded-[2.5rem] border border-white/5 flex flex-col sm:flex-row items-center gap-8 relative group hover:bg-white/[0.07] transition-all"
                                >
                                    <div className="w-28 h-28 bg-gradient-to-br from-primary/20 to-accent/10 rounded-[2rem] flex items-center justify-center border border-white/10 flex-shrink-0 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,210,255,0.2)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-3xl font-black text-primary italic relative z-10">AK</span>
                                    </div>

                                    <div className="flex-grow text-center sm:text-left">
                                        <h3 className="text-2xl font-black text-white mb-1 italic tracking-tight">{item.name}</h3>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-4 opacity-70">{item.category}</p>
                                        <div className="text-2xl font-black text-white italic">₹{item.price}</div>
                                    </div>

                                    <div className="flex items-center gap-6 bg-dark/40 p-4 rounded-2xl border border-white/5">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-primary hover:text-dark rounded-xl transition-all"><Minus className="w-4 h-4" /></button>
                                        <span className="text-xl font-black text-white w-8 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-primary hover:text-dark rounded-xl transition-all"><Plus className="w-4 h-4" /></button>
                                    </div>

                                    <button onClick={() => removeFromCart(item.id)} className="p-5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-3xl transition-all duration-300"><Trash2 className="w-6 h-6" /></button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Available Offers Section */}
                    {offers.length > 0 && (
                        <div className="mt-16 bg-white/[0.03] p-10 rounded-[3.5rem] border border-white/5">
                            <div className="flex items-center gap-4 mb-8">
                                <Tag className="text-primary w-6 h-6" />
                                <h3 className="text-xl font-black text-white italic uppercase tracking-widest">Available Offers</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {offers.map(offer => (
                                    <div key={offer.id} className={`p-6 rounded-[2rem] border transition-all ${offer.code ? 'bg-primary/5 border-primary/20 group hover:border-primary/40' : 'bg-white/5 border-white/5'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-lg font-black text-white italic">{offer.title}</h4>
                                                <p className="text-primary font-black text-sm">{offer.discount} Instant Discount</p>
                                            </div>
                                            {offer.code && (
                                                <button
                                                    onClick={() => setCouponCode(offer.code)}
                                                    className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary hover:text-dark transition-all"
                                                    title="Copy Code"
                                                >
                                                    <Ticket className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        {offer.code && (
                                            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Use Code:</span>
                                                <span className="text-xs font-black text-white bg-white/5 px-4 py-2 rounded-xl border border-white/10 uppercase tracking-widest">{offer.code}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Section */}
                <div className="lg:w-[450px] flex-shrink-0">
                    <div className="glass-card p-10 rounded-[4rem] border border-white/10 sticky top-32 bg-gradient-to-br from-white/5 to-transparent">
                        <h2 className="text-3xl font-black text-white italic mb-10 border-b border-white/10 pb-8 uppercase tracking-tighter">Order Summary</h2>

                        <div className="space-y-6 mb-10">
                            <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-xs">
                                <span>Subtotal</span>
                                <span className="text-white">₹{subtotal}</span>
                            </div>

                            {/* Coupon Application */}
                            <div className="space-y-4 py-8 border-y border-white/5 bg-white/[0.02] -mx-10 px-10">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">Enter Coupon Code</label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="TRY AK10 OR AK20"
                                        className="flex-grow bg-dark/50 border border-white/10 rounded-2xl px-5 py-4 text-white font-black uppercase text-sm tracking-widest focus:border-primary/50 outline-none transition-all placeholder:text-white/10"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="px-8 bg-primary text-dark rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                                    >
                                        Apply Coupon
                                    </button>
                                </div>

                                {couponError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-[10px] font-black uppercase flex items-center gap-2 mt-2"
                                    >
                                        <AlertCircle className="w-3 h-3" /> Invalid coupon — please try again.
                                    </motion.p>
                                )}

                                <AnimatePresence>
                                    {appliedDiscount && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                            className="space-y-4 pt-4 overflow-hidden"
                                        >
                                            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                <span>Actual Amount</span>
                                                <span className="text-white">₹{subtotal}</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                <span>Coupon Discount</span>
                                                <span className="text-primary italic">{appliedDiscount.percent}% OFF</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 p-3 rounded-xl border border-primary/20">
                                                <span className="flex items-center gap-2"><Tag className="w-3 h-3" /> You Saved</span>
                                                <span className="font-black">₹{appliedDiscount.value}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-xs pt-4">
                                <span>Shipping Fees</span>
                                <span className="text-green-500">FREE ✅</span>
                            </div>

                            <div className="pt-8 border-t border-white/10 flex justify-between items-center bg-gradient-to-r from-green-500/5 to-transparent -mx-10 px-10 py-6 mt-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] block">Final Payable Amount</span>
                                    {appliedDiscount && <span className="text-[8px] text-white/30 font-bold uppercase tracking-widest">Savings Applied ✅</span>}
                                </div>
                                <motion.span
                                    key={total}
                                    initial={{ scale: 1.2, color: '#00d2ff' }}
                                    animate={{ scale: 1, color: '#22c55e' }}
                                    className="text-5xl font-black italic drop-shadow-[0_0_20px_rgba(34,197,94,0.4)] tracking-tighter"
                                >
                                    ₹{total}
                                </motion.span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full py-7 bg-primary text-dark rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-3xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            Checkout Species <ArrowRight className="w-5 h-5 font-black" />
                        </button>

                        <Link to="/shop" className="flex items-center justify-center gap-2 text-white/20 font-black uppercase text-[10px] mt-10 hover:text-primary transition-all tracking-[0.2em]">
                            <ChevronLeft className="w-3 h-3" /> Keep Exploring
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

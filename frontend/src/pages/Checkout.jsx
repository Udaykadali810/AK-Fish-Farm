import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, MapPin, Phone, ArrowRight, ShoppingBag, Tag } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, placeOrder, coupon, getFinalTotal } = useCart();
    const { user } = useAuth();

    const [formData, setFormData] = React.useState({
        customerName: user?.name || '',
        place: '',
        phone: user?.phone || ''
    });

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                customerName: user.name || '',
                phone: user.phone || ''
            }));
        }
    }, [user]);

    if (cart.length === 0) {
        React.useEffect(() => {
            navigate('/shop');
        }, []);
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const order = placeOrder();
            // In a real app, you'd send this to a backend
            // For now, we simulate success and redirect
            setTimeout(() => {
                navigate('/order-success', { state: { orderId: order.id } });
            }, 2000);
        } catch (err) {
            setError('Protocol failure. Manual coordination required.');
            setLoading(false);
        }
    };

    const finalTotal = getFinalTotal();

    return (
        <div className="min-h-screen py-24 sm:py-32 px-4 pb-40 bg-[#071A2F]">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-24 md:mb-32">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-[#00E5FF] text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">Order Authorization</span>
                        <h1 className="text-5xl lg:text-9xl font-black text-[#BFEFFF] italic mb-6 leading-[0.9] tracking-tighter uppercase">Final <span className="text-[#00E5FF] glow-text">Step</span></h1>
                        <p className="text-[#BFEFFF]/40 font-medium tracking-[0.2em] text-xs uppercase">Secure your aquatic life delivery protocol at AK Fish Farms</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-12 lg:p-16 rounded-[4rem] border border-[#00E5FF]/10 relative overflow-hidden"
                    >
                        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#00E5FF]/5 blur-[100px] rounded-full pointer-events-none"></div>

                        <h2 className="text-3xl font-black text-[#BFEFFF] italic mb-12 flex items-center gap-4 uppercase tracking-tighter">
                            <ShoppingBag className="text-[#00E5FF] w-8 h-8" /> Delivery Details
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                            {error && (
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-5 bg-red-500/10 text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-red-500/20 italic">
                                    System Error: {error}
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#BFEFFF]/20 uppercase tracking-[0.4em] ml-2">Proprietor Name</label>
                                <div className="relative group">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Identification Name"
                                        className="w-full pl-16 pr-6 py-6 rounded-[2rem] bg-[#0B2A4A]/40 border border-[#00E5FF]/10 focus:border-[#00E5FF]/50 focus:ring-4 focus:ring-[#00E5FF]/10 text-[#BFEFFF] font-black transition-all outline-none placeholder-[#BFEFFF]/10"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    />
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-[#BFEFFF]/20 group-focus-within:text-[#00E5FF] h-6 w-6 transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#BFEFFF]/20 uppercase tracking-[0.4em] ml-2">Coordinates (Address)</label>
                                <div className="relative group">
                                    <input
                                        required
                                        type="text"
                                        placeholder="City / Region"
                                        className="w-full pl-16 pr-6 py-6 rounded-[2rem] bg-[#0B2A4A]/40 border border-[#00E5FF]/10 focus:border-[#00E5FF]/50 focus:ring-4 focus:ring-[#00E5FF]/10 text-[#BFEFFF] font-black transition-all outline-none placeholder-[#BFEFFF]/10"
                                        value={formData.place}
                                        onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                                    />
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-[#BFEFFF]/20 group-focus-within:text-[#00E5FF] h-6 w-6 transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#BFEFFF]/20 uppercase tracking-[0.4em] ml-2">Comm Channel (Phone)</label>
                                <div className="relative group">
                                    <input
                                        required
                                        type="tel"
                                        placeholder="10-digit number"
                                        className="w-full pl-16 pr-6 py-6 rounded-[2rem] bg-[#0B2A4A]/40 border border-[#00E5FF]/10 focus:border-[#00E5FF]/50 focus:ring-4 focus:ring-[#00E5FF]/10 text-[#BFEFFF] font-black transition-all outline-none placeholder-[#BFEFFF]/10"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                    />
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#BFEFFF]/20 group-focus-within:text-[#00E5FF] h-6 w-6 transition-colors" />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full py-8 btn-premium flex items-center justify-center gap-4 text-xs font-black shadow-[0_20px_50px_rgba(0,229,255,0.2)] disabled:opacity-50"
                            >
                                {loading ? 'Processing Protocol...' : <>Initiate Delivery <ArrowRight className="w-6 h-6" /></>}
                            </button>
                        </form>
                    </motion.div>

                    {/* Summary Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-12"
                    >
                        <div className="glass-card p-12 rounded-[4rem] border border-[#00E5FF]/10 bg-gradient-to-br from-[#0B2A4A]/20 to-transparent shadow-2xl">
                            <h3 className="text-3xl font-black text-[#BFEFFF] italic mb-10 uppercase tracking-tighter">Inventory <span className="text-[#00E5FF]">Check</span></h3>
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
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between items-center bg-[#00E5FF]/10 p-6 rounded-2xl border border-[#00E5FF]/20">
                                        <span className="text-[#00E5FF] font-black flex items-center gap-3 uppercase text-[10px] tracking-widest"><Tag className="w-4 h-4" /> Protocol: {coupon.code}</span>
                                        <span className="text-[#00E5FF] font-black italic text-xl">-₹{coupon.amount}</span>
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex justify-between items-end border-t border-[#00E5FF]/10 pt-10">
                                <div className="flex flex-col">
                                    <span className="text-[#BFEFFF]/20 font-black uppercase tracking-[0.4em] text-[10px] mb-2">Net Settlement</span>
                                    <span className="text-green-500 font-bold text-[8px] uppercase tracking-widest flex items-center gap-2">Logistics Covered ✅</span>
                                </div>
                                <span className="text-5xl font-black text-[#BFEFFF] italic glow-text tracking-tighter">₹{finalTotal}</span>
                            </div>
                        </div>

                        <div className="p-10 bg-[#0B2A4A]/40 rounded-[3rem] border border-[#00E5FF]/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/5 blur-[50px] group-hover:bg-[#00E5FF]/10 transition-colors"></div>
                            <p className="text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.5em] mb-4">Transmission Notice</p>
                            <p className="text-[#BFEFFF]/40 text-xs font-medium leading-relaxed tracking-wide">
                                No direct online credit injection required. A human operator will establish contact via WhatsApp for final coordination and payment clearance at AK Fish Farms.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, MapPin, Phone, ArrowRight, ShoppingBag, Tag } from 'lucide-react';

const Checkout = () => {
    // ... (state and effects same)

    if (cart.length === 0) {
        navigate('/shop');
        return null;
    }

    // ... (handlers same)

    return (
        <div className="min-h-screen py-24 sm:py-32 px-4 pb-40">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-24 md:mb-32">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="text-aqua text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">Order Authorization</span>
                        <h1 className="text-5xl lg:text-9xl font-black text-white italic mb-6 leading-[0.9] tracking-tighter uppercase">Final <span className="text-aqua glow-text">Step</span></h1>
                        <p className="text-white/40 font-medium tracking-[0.2em] text-xs uppercase">Secure your aquatic life delivery protocol</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-12 lg:p-16 rounded-[4rem] border border-white/10 relative overflow-hidden"
                    >
                        <div className="absolute -top-20 -left-20 w-80 h-80 bg-aqua/5 blur-[100px] rounded-full pointer-events-none"></div>

                        <h2 className="text-3xl font-black text-white italic mb-12 flex items-center gap-4 uppercase tracking-tighter">
                            <ShoppingBag className="text-aqua w-8 h-8" /> Delivery Details
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                            {error && (
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-5 bg-red-500/10 text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-red-500/20 italic">
                                    System Error: {error}
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Proprietor Name</label>
                                <div className="relative group">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Identification Name"
                                        className="w-full pl-16 pr-6 py-6 rounded-[2rem] bg-white/5 border border-white/10 focus:border-aqua/50 focus:ring-4 focus:ring-aqua/10 text-white font-black transition-all outline-none placeholder-white/10"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    />
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-aqua h-6 w-6 transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Coordinates (Address)</label>
                                <div className="relative group">
                                    <input
                                        required
                                        type="text"
                                        placeholder="City / Region"
                                        className="w-full pl-16 pr-6 py-6 rounded-[2rem] bg-white/5 border border-white/10 focus:border-aqua/50 focus:ring-4 focus:ring-aqua/10 text-white font-black transition-all outline-none placeholder-white/10"
                                        value={formData.place}
                                        onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                                    />
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-aqua h-6 w-6 transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2">Comm Channel (Phone)</label>
                                <div className="relative group">
                                    <input
                                        required
                                        type="tel"
                                        placeholder="10-digit number"
                                        className="w-full pl-16 pr-6 py-6 rounded-[2rem] bg-white/5 border border-white/10 focus:border-aqua/50 focus:ring-4 focus:ring-aqua/10 text-white font-black transition-all outline-none placeholder-white/10"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                    />
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-aqua h-6 w-6 transition-colors" />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full py-8 bg-aqua text-dark rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-xs shadow-3xl hover:shadow-aqua/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
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
                        <div className="glass-card p-12 rounded-[4rem] border border-white/10 bg-gradient-to-br from-white/5 to-transparent shadow-2xl">
                            <h3 className="text-3xl font-black text-white italic mb-10 uppercase tracking-tighter">Inventory <span className="text-aqua">Check</span></h3>
                            <div className="space-y-6 mb-12">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm border-b border-white/5 pb-6">
                                        <div className="flex flex-col">
                                            <span className="text-white font-black italic uppercase tracking-tight">{item.name}</span>
                                            <span className="text-white/20 font-black text-[10px] uppercase tracking-widest">Qty: {item.quantity}</span>
                                        </div>
                                        <span className="text-white font-black italic text-xl">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}

                                {discount && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between items-center bg-aqua/10 p-6 rounded-2xl border border-aqua/20">
                                        <span className="text-aqua font-black flex items-center gap-3 uppercase text-[10px] tracking-widest"><Tag className="w-4 h-4" /> Protocol: {discount.code}</span>
                                        <span className="text-aqua font-black italic text-xl">-₹{discount.value}</span>
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex justify-between items-end border-t border-white/10 pt-10">
                                <div className="flex flex-col">
                                    <span className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px] mb-2">Net Settlement</span>
                                    <span className="text-green-500 font-bold text-[8px] uppercase tracking-widest flex items-center gap-2">Logistics Covered ✅</span>
                                </div>
                                <span className="text-5xl font-black text-white italic glow-text tracking-tighter">₹{finalTotal}</span>
                            </div>
                        </div>

                        <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-aqua/5 blur-[50px] group-hover:bg-aqua/10 transition-colors"></div>
                            <p className="text-[10px] font-black text-aqua uppercase tracking-[0.5em] mb-4">Transmission Notice</p>
                            <p className="text-white/40 text-xs font-medium leading-relaxed tracking-wide">
                                No direct online credit injection required. A human operator will establish contact via WhatsApp for final coordination and payment clearance.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

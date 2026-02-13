import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronLeft, Tag, Ticket, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    // ... (state and handlers same)

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 pb-40">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-16 rounded-[4rem] text-center max-w-lg w-full border border-white/5 relative overflow-hidden"
                >
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-aqua/5 blur-[100px] rounded-full"></div>

                    <div className="w-28 h-28 bg-aqua/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-aqua/20 shadow-[0_0_30px_rgba(14,165,233,0.1)]">
                        <ShoppingBag className="w-12 h-12 text-aqua" />
                    </div>
                    <h2 className="text-4xl font-black text-white italic mb-6 uppercase tracking-tighter">Tank is <span className="text-aqua">Empty.</span></h2>
                    <p className="text-white/40 mb-12 font-medium tracking-wide leading-relaxed">Your curated collection awaits its first resident. Begin your journey into the deep.</p>

                    <Link to="/shop" className="inline-flex items-center gap-4 px-12 py-6 bg-aqua text-dark rounded-[2.5rem] font-black uppercase text-xs tracking-widest hover:shadow-[0_0_40px_rgba(14,165,233,0.3)] transition-all active:scale-95">
                        Discover Species <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 pb-40">
            <div className="flex flex-col lg:flex-row gap-16">
                {/* Cart Items List */}
                <div className="flex-grow space-y-12">
                    <div className="flex items-center justify-between border-b border-white/5 pb-10">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <span className="text-aqua text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Management Console</span>
                            <h1 className="text-5xl sm:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
                                My <span className="text-aqua glow-text">Collection</span>
                            </h1>
                        </motion.div>
                        <div className="px-8 py-4 bg-white/5 rounded-3xl border border-white/10">
                            <span className="text-white font-black uppercase tracking-widest text-[10px]">{cart.length} SPECIES</span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="glass-card p-8 rounded-[3.5rem] border border-white/10 flex flex-col sm:flex-row items-center gap-10 relative group hover:border-aqua/30 transition-all duration-500"
                                >
                                    <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 flex-shrink-0 relative overflow-hidden group-hover:bg-aqua transition-colors duration-700">
                                        <span className="text-4xl font-black text-aqua group-hover:text-dark italic transition-colors">AK</span>
                                    </div>

                                    <div className="flex-grow text-center sm:text-left">
                                        <div className="text-aqua/40 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{item.category}</div>
                                        <h3 className="text-3xl font-black text-white mb-2 italic tracking-tight uppercase">{item.name}</h3>
                                        <div className="text-2xl font-black text-white italic glow-text">₹{item.price}</div>
                                    </div>

                                    <div className="flex items-center gap-8 bg-white/5 p-4 rounded-[2rem] border border-white/10">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-3 hover:bg-aqua hover:text-dark rounded-xl transition-all"><Minus className="w-4 h-4" /></button>
                                        <span className="text-2xl font-black text-white w-10 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="p-3 hover:bg-aqua hover:text-dark rounded-xl transition-all"><Plus className="w-4 h-4" /></button>
                                    </div>

                                    <button onClick={() => removeFromCart(item.id)} className="p-6 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white rounded-[2rem] transition-all duration-500 border border-red-500/10"><Trash2 className="w-6 h-6" /></button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Available Offers */}
                    {offers.length > 0 && (
                        <div className="mt-24 glass-card p-12 rounded-[4rem] border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-aqua/5 blur-[100px] rounded-full -z-10"></div>
                            <div className="flex items-center gap-5 mb-12">
                                <div className="p-4 bg-aqua text-dark rounded-2xl"><Tag className="w-6 h-6" /></div>
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Active Protocols <span className="text-aqua">(Offers)</span></h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {offers.map(offer => (
                                    <div key={offer.id} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-aqua/30 transition-all group">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <h4 className="text-xl font-black text-white italic uppercase tracking-tight">{offer.title}</h4>
                                                <p className="text-aqua font-black text-[10px] uppercase tracking-widest mt-1">{offer.discount} Efficiency Increase</p>
                                            </div>
                                            {offer.code && (
                                                <button onClick={() => setCouponCode(offer.code)} className="p-4 bg-white/5 rounded-2xl hover:bg-aqua hover:text-dark transition-all">
                                                    <Ticket className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                        {offer.code && (
                                            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Protocol Code</span>
                                                <span className="text-xs font-black text-aqua bg-aqua/10 px-6 py-2 rounded-xl border border-aqua/20 uppercase tracking-[0.2em]">{offer.code}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Section */}
                <div className="lg:w-[480px] flex-shrink-0">
                    <div className="glass-card p-12 rounded-[4rem] border border-white/10 sticky top-40 bg-gradient-to-br from-white/5 to-transparent">
                        <h2 className="text-4xl font-black text-white italic mb-12 border-b border-white/10 pb-10 uppercase tracking-tighter shadow-2xl">Financial <span className="text-aqua">Data</span></h2>

                        <div className="space-y-8 mb-12">
                            <div className="flex justify-between text-white/40 font-black uppercase tracking-[0.4em] text-[10px]">
                                <span>Sub-Inventory</span>
                                <span className="text-white">₹{subtotal}</span>
                            </div>

                            {/* Coupon Application */}
                            <div className="space-y-6 py-10 border-y border-white/10 -mx-12 px-12 bg-white/5 backdrop-blur-3xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-aqua/5 pointer-events-none"></div>
                                <label className="text-[10px] font-black text-aqua/60 uppercase tracking-[0.4em] block mb-4">Injection Protocol (Coupon)</label>
                                <div className="flex flex-col gap-4 relative z-10">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="ENTER CODE"
                                        className="w-full bg-dark/60 border border-white/10 rounded-2xl px-6 py-5 text-white font-black uppercase text-sm tracking-[0.5em] focus:border-aqua/50 outline-none transition-all placeholder:text-white/10"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="w-full py-5 bg-aqua text-dark rounded-2xl font-black uppercase text-xs tracking-[0.4em] transition-all shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:scale-105 active:scale-95"
                                    >
                                        Execute Injection
                                    </button>
                                </div>

                                {couponError && (
                                    <p className="text-red-500 text-[9px] font-black uppercase flex items-center gap-2 mt-4 tracking-widest">
                                        <AlertCircle className="w-3 h-3" /> Syntax Error: Protocol Invalid
                                    </p>
                                )}

                                <AnimatePresence>
                                    {appliedDiscount && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="pt-8 space-y-6"
                                        >
                                            <div className="flex justify-between text-[10px] font-black text-white/40 uppercase tracking-widest">
                                                <span>Base Inventory</span>
                                                <span className="text-white">₹{subtotal}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px] font-black text-aqua/60 uppercase tracking-widest">
                                                <span>Injected Efficiency</span>
                                                <span className="italic">-{appliedDiscount.percent}%</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-black text-dark bg-aqua p-5 rounded-2xl shadow-xl shadow-aqua/20 uppercase tracking-widest">
                                                <span>Net Savings</span>
                                                <span>₹{appliedDiscount.value}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex justify-between text-white/40 font-black uppercase tracking-[0.4em] text-[10px] pt-4">
                                <span>Logistics Costs</span>
                                <span className="text-aqua">NO CHARGE</span>
                            </div>

                            <div className="pt-10 border-t border-white/10 flex justify-between items-center -mx-12 px-12 py-8 mt-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] block mb-1">Final Settlement</span>
                                    {appliedDiscount && <span className="text-[8px] text-aqua font-black uppercase tracking-widest">Voucher Applied ✅</span>}
                                </div>
                                <motion.span
                                    key={total}
                                    initial={{ scale: 1.1, color: '#0EA5E9' }}
                                    animate={{ scale: 1, color: '#F0F9FF' }}
                                    className="text-5xl font-black italic tracking-tighter glow-text"
                                >
                                    ₹{total}
                                </motion.span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full py-8 bg-aqua text-dark rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-xs shadow-2xl hover:shadow-aqua/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 active:scale-95"
                        >
                            Finalize Order <ArrowRight className="w-6 h-6" />
                        </button>

                        <Link to="/shop" className="flex items-center justify-center gap-3 text-white/20 font-black uppercase text-[10px] mt-12 hover:text-aqua transition-all tracking-[0.5em] group">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back to Catalog
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

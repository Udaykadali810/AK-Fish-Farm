import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Plus, Trash2, Calendar, Ticket, CheckCircle2 } from 'lucide-react';
import { coupons as initialCoupons } from '../../data/coupons';

const ManageCoupons = () => {
    const [coupons, setCoupons] = useState(initialCoupons);

    const handleDelete = (id) => {
        if (window.confirm('Delete this gift token?')) {
            setCoupons(coupons.filter(c => c.id !== id));
        }
    };

    return (
        <div className="bg-bg-main min-h-screen p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-16">
                    <div>
                        <h1 className="text-4xl font-black text-dark dark:text-white italic mb-2 flex items-center gap-4">
                            <Ticket className="text-primary w-10 h-10" /> Discount <span className="text-primary mt-1">Foundry</span>
                        </h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Managing {coupons.length} reward tokens</p>
                    </div>
                    <button className="px-10 py-5 bg-primary text-white rounded-[2rem] font-black italic shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                        <Plus className="w-6 h-6" /> Forge Coupon
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {coupons.map((coupon, i) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            key={coupon.id}
                            className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-xl border border-gray-100 dark:border-gray-800 relative group"
                        >
                            <button
                                onClick={() => handleDelete(coupon.id)}
                                className="absolute top-8 right-8 p-3 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                                    <Tag className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Coupon Code</p>
                                    <p className="text-2xl font-black text-dark dark:text-white italic tracking-widest uppercase">{coupon.code}</p>
                                </div>
                            </div>

                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Benefit</span>
                                    <span className="text-3xl font-black text-primary italic">
                                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-gray-500 leading-relaxed border-l-4 border-primary/20 pl-4">{coupon.description}</p>
                            </div>

                            <div className="pt-8 border-t border-gray-50 dark:border-gray-800 grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase">
                                    <Calendar className="w-4 h-4 text-primary" /> Till Dec 2026
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-green-500 uppercase justify-end">
                                    <CheckCircle2 className="w-4 h-4" /> Active
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageCoupons;

import React from 'react';
import { motion } from 'framer-motion';
import { categories } from '../data/categories';
import { Link } from 'react-router-dom';
import { ChevronRight, Droplets, Sparkles } from 'lucide-react';

const Categories = () => {
    return (
        <div className="min-h-screen pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32">
                {/* Header Section */}
                <div className="text-center mb-24 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="inline-flex items-center gap-3 px-8 py-3 bg-aqua/10 text-aqua rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 border border-aqua/30 backdrop-blur-3xl glow-border">
                            <Sparkles className="w-4 h-4" /> Collection Taxonomy
                        </div>
                        <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-white italic mb-10 uppercase leading-[0.9] tracking-tighter">Aquatic <span className="text-aqua italic glow-text">Worlds</span></h1>
                        <p className="text-white/40 font-medium max-w-xl mx-auto leading-relaxed tracking-wide text-lg">
                            Every species we cultivate is sorted into curated collections, reflecting the unique environments they thrive in.
                        </p>
                    </motion.div>
                </div>

                <div className="flex flex-wrap justify-center gap-12 sm:gap-20">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <Link to={`/shop?category=${cat.name}`} className="block w-full sm:w-[420px] h-[580px] glass-card rounded-[4rem] p-12 overflow-hidden relative border border-[#00E5FF]/10 hover:border-[#00E5FF]/40 bg-[#071A2F]/60 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                                <div className="relative z-10 flex flex-col h-full items-center justify-center text-center">
                                    <div className="w-36 h-36 bg-[#BFEFFF]/5 rounded-[3.5rem] p-8 mb-12 group-hover:scale-110 group-hover:bg-[#00E5FF] group-hover:text-[#071A2F] transition-all duration-700 flex items-center justify-center text-7xl shadow-2xl border border-[#BFEFFF]/10 group-hover:rotate-6">
                                        {cat.icon}
                                    </div>

                                    <h3 className="text-5xl font-black text-[#BFEFFF] italic mb-6 group-hover:text-[#00E5FF] transition-colors duration-500 uppercase tracking-tighter">
                                        {cat.name}
                                    </h3>

                                    <div className="flex items-center gap-4 px-6 py-3 bg-[#0B2A4A]/60 rounded-full mb-12 border border-[#00E5FF]/5">
                                        <Droplets className="w-4 h-4 text-[#00E5FF]" />
                                        <span className="text-[10px] font-black text-[#BFEFFF]/40 uppercase tracking-[0.4em]">
                                            {cat.count} Premium Stock
                                        </span>
                                    </div>

                                    <div className="mt-auto h-16 w-full btn-premium flex items-center justify-center gap-4 text-[10px]">
                                        Explore World <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categories;

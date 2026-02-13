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

                <div className="flex flex-wrap justify-center gap-12 sm:gap-16">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <Link to={`/shop?category=${cat.name}`} className="block w-full sm:w-[420px] h-[550px] glass-card rounded-[4rem] p-12 border border-white/10 transition-all duration-700 hover:border-aqua/50 overflow-hidden relative">
                                {/* Glass shine overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent group-hover:from-aqua/10 transition-all duration-700" />

                                <div className="relative z-10 flex flex-col h-full items-center justify-center text-center">
                                    <div className="w-32 h-32 bg-white/5 rounded-[3rem] p-6 mb-12 group-hover:scale-110 group-hover:bg-aqua group-hover:text-dark transition-all duration-700 flex items-center justify-center text-6xl shadow-2xl border border-white/5 group-hover:rotate-6">
                                        {cat.icon}
                                    </div>

                                    <h3 className="text-4xl font-black text-white italic mb-6 group-hover:text-aqua transition-colors duration-500">
                                        {cat.name}
                                    </h3>

                                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full mb-12">
                                        <Droplets className="w-3 h-3 text-aqua" />
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                                            {cat.count} Premium Stock
                                        </span>
                                    </div>

                                    <div className="mt-auto px-10 py-5 w-full bg-white/5 rounded-2xl border border-white/5 group-hover:bg-aqua group-hover:text-dark transition-all duration-500 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-4">
                                        Explore World <ChevronRight className="w-4 h-4" />
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

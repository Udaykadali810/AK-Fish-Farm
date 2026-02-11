import React from 'react';
import { motion } from 'framer-motion';
import { categories } from '../data/categories';
import { Link } from 'react-router-dom';
import { ChevronRight, Droplets, Sparkles } from 'lucide-react';

const Categories = () => {
    return (
        <div className="bg-bg-main min-h-screen pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                {/* Header Section */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-10 border border-primary/20">
                            <Sparkles className="w-3 h-3" /> Browsing Taxonomy
                        </div>
                        <h1 className="text-4xl sm:text-6xl lg:text-9xl font-black text-white mb-6 italic">Aquatic <span className="text-primary italic drop-shadow-[0_0_20px_rgba(0,180,216,0.3)]">Worlds</span></h1>
                        <p className="text-gray-400 font-medium max-w-xl mx-auto leading-relaxed tracking-wide">
                            Every species we house is sorted into curated collections, reflecting the unique environments they thrive in.
                        </p>
                    </motion.div>
                </div>

                <div className="flex flex-wrap justify-center gap-12">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <Link to={`/shop?category=${cat.name}`} className="block w-full sm:w-[380px] h-[450px] glass-card rounded-[4rem] p-12 border border-white/5 transition-all duration-700 hover:border-primary/50 hover:shadow-[0_0_50px_rgba(0,180,216,0.2)] overflow-hidden">
                                {/* Glass shine overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="relative z-10 flex flex-col h-full items-center justify-center text-center">
                                    <div className="text-8xl mb-10 group-hover:scale-110 transition-transform duration-700 transform-gpu group-hover:-translate-y-2">
                                        {cat.icon}
                                    </div>

                                    <h3 className="text-2xl font-black text-white italic mb-4 transition-colors group-hover:text-primary">
                                        {cat.name}
                                    </h3>

                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-12 block">
                                        {cat.count} Premium Species
                                    </span>

                                    <div className="mt-auto inline-flex items-center gap-3 text-white/40 font-black uppercase text-[10px] tracking-widest group-hover:text-primary transition-all">
                                        Open Collection <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap, ShoppingCart, Heart, Search, User,
    ChevronRight, Layout, Sparkles, ShieldCheck,
    ArrowRight, Globe, Layers
} from 'lucide-react';

const EliteApp = () => {
    const featuredItems = [
        { name: 'Quantum Fin Betta', category: 'Premium', price: '₹4,500', icon: <Sparkles className="text-cyan-400" /> },
        { name: 'Cobalt Blue Guppy', category: 'Collection', price: '₹800', icon: <Droplets className="text-blue-400" /> },
        { name: 'Midnight Tetra', category: 'Rare', price: '₹1,200', icon: <Zap className="text-purple-400" /> },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1128] via-[#050914] to-black text-white font-['Poppins',sans-serif] selection:bg-cyan-500/30 overflow-x-hidden pb-32">
            {/* Smooth Lighting Overlays */}
            <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="fixed bottom-1/4 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Custom Navbar */}
            <nav className="flex justify-between items-center px-8 py-8 sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">ELITE<span className="text-cyan-400">APP</span></span>
                </div>
                <div className="flex gap-4">
                    <div className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all cursor-pointer">
                        <Search className="w-5 h-5 text-white/70" />
                    </div>
                    <div className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all cursor-pointer">
                        <User className="w-5 h-5 text-white/70" />
                    </div>
                </div>
            </nav>

            {/* Tech Banner Section */}
            <header className="px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-[2.5rem] overflow-hidden aspect-[16/9] shadow-2xl shadow-blue-900/40 border border-white/10"
                >
                    <img
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"
                        alt="Tech Abstract Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/40 to-transparent flex flex-col justify-center p-10">
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-cyan-400 text-xs font-black uppercase tracking-[0.3em] mb-4"
                        >
                            Next Generation Gaming
                        </motion.span>
                        <h1 className="text-4xl md:text-5xl font-bold font-['Montserrat'] leading-[1.1] mb-6 max-w-md">
                            Experience the<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Peak of Tech</span>
                        </h1>
                        <button className="flex items-center gap-3 w-fit px-8 py-4 bg-cyan-400 text-blue-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-cyan-400/20 hover:scale-105 active:scale-95 transition-all group">
                            Explore Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            </header>

            {/* Quick Stats Grid */}
            <section className="px-6 grid grid-cols-2 gap-4 mb-12">
                <div className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex flex-col gap-4">
                    <div className="w-10 h-10 bg-cyan-400/10 rounded-xl flex items-center justify-center">
                        <Globe className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold">128</p>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Global Sites</p>
                    </div>
                </div>
                <div className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex flex-col gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <Layers className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold">4.2k</p>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Active nodes</p>
                    </div>
                </div>
            </section>

            {/* Glassmorphism Product Section */}
            <section className="px-6 space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold font-['Montserrat']">Curated <span className="text-cyan-400">Assets</span></h2>
                    <span className="text-xs font-bold text-cyan-400 underline cursor-pointer">View All</span>
                </div>

                <div className="space-y-4">
                    {featuredItems.map((item, i) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-cyan-400/30 transition-all">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg leading-none mb-1">{item.name}</h4>
                                    <p className="text-xs text-white/40 font-medium uppercase tracking-widest">{item.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-cyan-400 mb-1">{item.price}</p>
                                <div className="p-2 bg-white/5 rounded-xl inline-block group-hover:bg-cyan-400 group-hover:text-blue-950 transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Pill Navbar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
                <div className="bg-[#0a1128]/80 backdrop-blur-2xl border border-white/10 rounded-full p-3 flex justify-between items-center shadow-2xl shadow-blue-950/50">
                    <div className="px-6 py-4 bg-cyan-400 rounded-full text-blue-950 flex items-center gap-3 font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg shadow-cyan-400/30">
                        <Layout className="w-5 h-5" /> Home
                    </div>
                    <div className="px-6 py-4 rounded-full text-white/40 hover:text-white transition-all cursor-pointer">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="px-6 py-4 rounded-full text-white/40 hover:text-white transition-all cursor-pointer">
                        <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div className="px-6 py-4 rounded-full text-white/40 hover:text-white transition-all cursor-pointer">
                        <Heart className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Poppins:wght@400;500;700&display=swap');
            ` }} />
        </div>
    );
};

// Internal Mock Helper
const Droplets = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
);

export default EliteApp;

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Search, User, Zap, ChevronRight, Droplets, Sparkles } from 'lucide-react';

const AntiGravity = () => {
    const categories = [
        { name: 'Elite Betta', price: '₹2,400', image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80' },
        { name: 'Neon Tetra', price: '₹450', image: 'https://images.unsplash.com/photo-1544521848-df840003006d?auto=format&fit=crop&w=400&q=80' },
        { name: 'Premium Koi', price: '₹12,000', image: 'https://images.unsplash.com/photo-1534070157-1d89868c2ee0?auto=format&fit=crop&w=400&q=80' },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Inter',sans-serif] selection:bg-primary/30 overflow-x-hidden">
            {/* Background grain texture and glow */}
            <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-50 contrast-150"></div>
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]"></div>

            {/* Header / Navbar */}
            <nav className="flex justify-between items-center px-8 py-10 sticky top-0 z-50 backdrop-blur-md bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-[1px]">
                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-black italic text-xs tracking-tighter">AG</div>
                    </div>
                    <span className="text-xl font-black italic tracking-tight uppercase">Anti<span className="text-primary">Gravity</span></span>
                </div>
                <div className="flex gap-6">
                    <Search className="w-6 h-6 text-white/60 hover:text-white cursor-pointer transition-colors" />
                    <User className="w-6 h-6 text-white/60 hover:text-white cursor-pointer transition-colors" />
                </div>
            </nav>

            {/* Hero Section */}
            <header className="px-6 mb-12 relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-[3rem] overflow-hidden aspect-[16/10] group"
                >
                    <img
                        src="https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=1200&q=80"
                        alt="Aquarium Banner"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-8 flex flex-col justify-end">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className="px-4 py-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">New Arrival</span>
                            <h2 className="text-5xl font-black italic leading-[0.9] mb-4 uppercase">AK Elite<br /><span className="text-primary">Collection</span></h2>
                            <p className="text-white/60 text-sm font-medium mb-6 max-w-[250px]">Experince weightlessness with our new high-flow aquatic collection.</p>
                            <button className="px-8 py-4 bg-primary text-[#050505] rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_40px_rgba(var(--primary-rgb),0.5)] hover:scale-105 active:scale-95 transition-all">
                                Explore Stock
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </header>

            {/* Categories / Grid */}
            <section className="px-6 mb-32">
                <div className="flex justify-between items-end mb-8">
                    <h3 className="text-2xl font-black italic uppercase">Popular <span className="text-primary">Species</span></h3>
                    <span className="text-xs font-black text-white/40 uppercase tracking-widest">See All</span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col gap-4"
                        >
                            <div className="aspect-[1/1.2] rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl p-4 flex flex-col justify-between relative overflow-hidden group">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="flex justify-between items-start z-10">
                                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                        <Droplets className="w-5 h-5 text-primary" />
                                    </div>
                                    <Heart className="w-5 h-5 text-white/20 hover:text-red-500 cursor-pointer" />
                                </div>
                                <div className="z-10">
                                    <img src={cat.image} className="w-full aspect-square object-contain mb-4 filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]" alt={cat.name} />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{cat.price}</p>
                                    <h4 className="text-xl font-black italic uppercase leading-none">{cat.name}</h4>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Launch Button Mockup */}
                    <div className="aspect-[1/1.2] rounded-[2.5rem] bg-primary flex flex-col items-center justify-center text-center p-8 shadow-[0_0_60px_rgba(var(--primary-rgb),0.3)] group cursor-pointer active:scale-95 transition-all">
                        <Zap className="w-12 h-12 text-black mb-4 group-hover:animate-pulse" />
                        <h4 className="text-2xl font-black italic uppercase text-black leading-none mb-2">Launch<br />Module</h4>
                        <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
                            <ChevronRight className="text-black" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating Navigation Bar */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[85%] max-w-md z-50">
                <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-4 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="flex-1 flex justify-center">
                        <div className="p-4 bg-primary rounded-full text-black shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]">
                            <Sparkles className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <ShoppingCart className="w-6 h-6 text-white/40 hover:text-white cursor-pointer transition-all" />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <Heart className="w-6 h-6 text-white/40 hover:text-white cursor-pointer transition-all" />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <User className="w-6 h-6 text-white/40 hover:text-white cursor-pointer transition-all" />
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
                :root {
                    --primary-rgb: 255, 230, 0;
                }
            ` }} />
        </div>
    );
};

export default AntiGravity;

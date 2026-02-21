import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Search, ChevronRight, Plus, Droplets, Sparkles, Star } from 'lucide-react';

const AkProStore = () => {
    const categories = ['AK Special', 'AK Premium', 'AK Guppy Collection'];
    const [activeCategory, setActiveCategory] = useState('AK Special');

    const products = [
        { id: 1, name: 'Red Cap Oranda', price: '₹450', category: 'AK Special', image: 'https://images.unsplash.com/photo-1524704659698-1fd30bb3a774?auto=format&fit=crop&w=400&q=80' },
        { id: 2, name: 'Blue Diamond Guppy', price: '₹120', category: 'AK Guppy Collection', image: 'https://images.unsplash.com/photo-1544521848-df840003006d?auto=format&fit=crop&w=400&q=80' },
        { id: 3, name: 'Royal Betta', price: '₹1,500', category: 'AK Premium', image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80' },
        { id: 4, name: 'Neon Tetra Set', price: '₹500', category: 'AK Special', image: 'https://images.unsplash.com/photo-1534070157-1d89868c2ee0?auto=format&fit=crop&w=400&q=80' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0F172A] text-[#F5F5F7] font-['Poppins',sans-serif] selection:bg-cyan-500/30 pb-20">
            {/* Header / Navbar */}
            <nav className="flex justify-between items-center px-6 py-6 sticky top-0 z-50 backdrop-blur-md bg-black/20">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                        <Droplets className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-xl font-black italic tracking-tight">AK<span className="text-cyan-400">FISH</span></span>
                </div>
                <div className="flex gap-4">
                    <div className="p-2 bg-white/5 rounded-full"><Search className="w-5 h-5 text-white/50" /></div>
                    <div className="p-2 bg-white/5 rounded-full relative">
                        <ShoppingCart className="w-5 h-5 text-white/50" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-[10px] text-black font-black rounded-full flex items-center justify-center">2</span>
                    </div>
                </div>
            </nav>

            {/* Banner Section */}
            <header className="px-6 py-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-[2rem] overflow-hidden aspect-[16/9] shadow-2xl shadow-cyan-900/20 shadow-inner"
                >
                    <img
                        src="https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=1200&q=80"
                        alt="AK Fish Farm Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent flex flex-col justify-center p-8">
                        <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Premium Aquatic Life</span>
                        <h1 className="text-3xl font-black leading-tight mb-4 uppercase italic">AK Fish Farms<br /><span className="text-white/40">Exotic Collection</span></h1>
                        <button className="w-fit px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                            View Collection
                        </button>
                    </div>
                </motion.div>
            </header>

            {/* Horizontal Categories */}
            <section className="py-8 overflow-hidden">
                <div className="flex px-6 gap-4 overflow-x-auto no-scrollbar pb-4">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${activeCategory === cat
                                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Product Grid */}
            <section className="px-6 space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-black uppercase italic tracking-wider">Live Stock</h2>
                    <ChevronRight className="w-5 h-5 text-white/20" />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {products.filter(p => p.category === activeCategory || activeCategory === 'AK Special').map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-4 flex gap-6 hover:bg-white/10 transition-all group overflow-hidden relative shadow-lg"
                        >
                            {/* Decorative background glow */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none transition-all group-hover:bg-cyan-500/20" />

                            {/* Product Image */}
                            <div className="w-1/3 aspect-square rounded-2xl overflow-hidden relative shadow-inner flex-shrink-0">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute top-2 left-2 p-1.5 bg-black/40 backdrop-blur-md rounded-lg">
                                    <Star className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex-grow flex flex-col justify-between py-1">
                                <div>
                                    <h3 className="text-lg font-black leading-tight mb-1">{product.name}</h3>
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{product.category}</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xl font-black text-cyan-400">{product.price}</span>
                                    <button className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-black shadow-lg shadow-cyan-500/20 hover:scale-110 active:scale-90 transition-all">
                                        <Plus className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Tab Bar Shim */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex justify-between items-center shadow-2xl z-50">
                <div className="flex-1 flex justify-center p-3 bg-cyan-500 rounded-full text-black"><Droplets className="w-6 h-6" /></div>
                <div className="flex-1 flex justify-center p-3 text-white/30"><Sparkles className="w-6 h-6" /></div>
                <div className="flex-1 flex justify-center p-3 text-white/30"><Heart className="w-6 h-6" /></div>
                <div className="flex-1 flex justify-center p-3 text-white/30"><User className="w-6 h-6" /></div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap');
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            ` }} />
        </div>
    );
};

export default AkProStore;

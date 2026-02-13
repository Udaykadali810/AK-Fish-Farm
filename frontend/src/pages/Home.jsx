import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, ShieldCheck, Zap } from 'lucide-react';

const CategoryCard = ({ category }) => {
    return (
        <motion.div
            whileHover={{ y: -15, scale: 1.05, rotateZ: 1 }}
            className="group relative w-full sm:w-[380px] h-[520px] cursor-pointer"
        >
            <Link to={`/shop?category=${category.slug}`}>
                <div className="w-full h-full glass-card rounded-[3rem] p-8 flex flex-col items-center justify-between text-center relative z-10 border border-white/10 group-hover:border-aqua/50 overflow-hidden">
                    {/* Glowing effect inside card */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-aqua/20 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {/* Logo Area */}
                    <div className="relative mt-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-aqua via-blue-600 to-teal-500 rounded-[2rem] flex items-center justify-center shadow-2xl transform rotate-6 group-hover:rotate-0 transition-transform duration-700 glow-border">
                            <span className="text-4xl font-black text-white italic drop-shadow-lg">AK</span>
                        </div>
                    </div>

                    <div className="z-10 px-4">
                        <h3 className="text-3xl font-black text-white italic mb-4 leading-tight group-hover:text-aqua transition-colors">
                            {category.name}
                        </h3>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                            {category.subtitle || 'Luxury Collection'}
                        </p>
                    </div>

                    <div className="w-full h-12 flex items-center justify-center gap-3 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-aqua group-hover:text-dark transition-all duration-500 font-black uppercase text-[10px] tracking-widest mb-4">
                        Explore Stock <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const Home = () => {
    const categoriesList = [
        { name: 'AK Special Fish Collection', slug: 'AK Special Fish Collection', subtitle: 'Rare & Vibrant' },
        { name: 'AK Premium Collection', slug: 'AK Premium Collection', subtitle: 'Exotic & Royal' },
        { name: 'Fancy Guppy Collection', slug: 'Fancy Guppy Collection', subtitle: 'Elegant & Pure' }
    ];

    return (
        <div className="relative min-h-screen py-20 flex flex-col items-center justify-center overflow-hidden">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center mb-32 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative"
                >
                    {/* Hero Glass Card Container */}
                    <div className="max-w-5xl mx-auto glass-card rounded-[4rem] p-12 md:p-24 border border-white/10 relative overflow-hidden group">
                        {/* Internal Aquarium Feel */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544521848-df840003006d?auto=format&fit=crop&w=1200&q=80')] opacity-10 blur-sm scale-110 group-hover:scale-100 transition-transform duration-1000"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent"></div>

                        <div className="relative z-10">
                            <motion.span
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="inline-block px-8 py-3 bg-aqua/10 rounded-full text-aqua font-black uppercase text-[10px] tracking-[0.3em] mb-12 border border-aqua/30 backdrop-blur-3xl glow-border"
                            >
                                <Sparkles className="inline-block w-3 h-3 mr-2 -mt-1" /> Welcome to AK Fish Farms
                            </motion.span>

                            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-white italic leading-[1] mb-10 uppercase tracking-tighter shadow-2xl">
                                Premium <span className="text-aqua glow-text">Aquarium</span><br />
                                Collection
                            </h1>

                            <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto tracking-wide leading-relaxed mb-16 px-4">
                                Curating the world's most vibrant and healthy aquatic populations
                                with over 20 years of professional expertise.
                            </p>

                            <Link to="/shop">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-12 py-5 bg-aqua text-dark rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_40px_rgba(14,165,233,0.4)] hover:shadow-aqua/60 transition-all duration-300 flex items-center gap-3 mx-auto"
                                >
                                    Explore Collection <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-8 mb-40 px-6 z-10">
                <div className="flex items-center gap-3 px-6 py-4 glass-morphism rounded-2xl border border-white/5 opacity-60">
                    <ShieldCheck className="w-5 h-5 text-aqua" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Certified Stocks</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 glass-morphism rounded-2xl border border-white/5 opacity-60">
                    <Zap className="w-5 h-5 text-aqua" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Fast Logistics</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 glass-morphism rounded-2xl border border-white/5 opacity-60">
                    <Star className="w-5 h-5 text-aqua" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Premium Quality</span>
                </div>
            </div>

            {/* Featured Categories Grid */}
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black italic uppercase text-white mb-2">Aquatic <span className="text-aqua">Categories</span></h2>
                    <div className="w-20 h-1 bg-aqua mx-auto rounded-full blur-[1px]"></div>
                </div>
                <div className="flex flex-wrap justify-center gap-10 lg:gap-14">
                    {categoriesList.map((cat, idx) => (
                        <CategoryCard key={idx} category={cat} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;

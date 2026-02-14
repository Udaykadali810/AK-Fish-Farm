import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, ShieldCheck, Zap } from 'lucide-react';

const CategoryCard = ({ category }) => {
    return (
        <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative w-full sm:w-[380px] h-[580px] cursor-pointer"
        >
            <Link to={`/shop?category=${category.slug}`}>
                <div className="w-full h-full glass-card rounded-[3.5rem] p-10 flex flex-col items-center justify-between text-center relative z-10 border border-[#00E5FF]/10 hover:border-[#00E5FF]/40 overflow-hidden bg-[#071A2F]/60">
                    {/* Industrial ID overlay */}
                    <div className="absolute top-8 left-10 text-[10px] font-black text-[#BFEFFF]/10 uppercase tracking-[.4em] z-20">Protocol-{category.slug.split(' ')[1]}</div>

                    {/* Highlight Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#00E5FF]/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                    {/* Branding Node */}
                    <div className="relative mt-12 mb-10">
                        <div className="w-28 h-28 bg-[#BFEFFF]/5 border border-[#BFEFFF]/10 rounded-[2.5rem] flex items-center justify-center group-hover:bg-[#00E5FF] group-hover:border-[#00E5FF] transition-colors duration-700 shadow-2xl relative">
                            <span className="text-4xl font-black text-[#BFEFFF] group-hover:text-[#071A2F] italic transition-colors">AK</span>
                        </div>
                    </div>

                    <div className="z-10 px-4">
                        <h3 className="text-4xl font-black text-[#BFEFFF] italic mb-6 leading-[0.9] tracking-tighter uppercase group-hover:text-[#00E5FF] transition-colors">
                            {category.name}
                        </h3>
                        <p className="text-[#BFEFFF]/20 text-[11px] font-black uppercase tracking-[0.5em] mb-12">
                            {category.subtitle}
                        </p>
                    </div>

                    <div className="w-full h-16 btn-premium flex items-center justify-center gap-4 text-[10px]">
                        View Inventory <ArrowRight className="w-5 h-5" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const Home = () => {
    const categoriesList = [
        { name: 'AK Special', slug: 'AK Special Collection', subtitle: 'Essential Stocks' },
        { name: 'AK Premium', slug: 'AK Premium Collection', subtitle: 'Exotic Standard' },
        { name: 'AK Guppy', slug: 'AK Guppy Collection', subtitle: 'Pure Genetics' }
    ];

    return (
        <div className="relative min-h-screen pt-16 pb-32 flex flex-col items-center justify-center overflow-hidden">
            {/* Business Ticker Banner */}
            <div className="absolute top-0 left-0 right-0 z-[60] bg-[#00C2D1] text-[#071A2F] py-3 overflow-hidden whitespace-nowrap border-b border-[#00C2D1]/50 shadow-[0_0_30px_rgba(0,194,209,0.3)]">
                <div className="flex animate-marquee">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-12 px-6 font-black text-[10px] uppercase tracking-[0.4em] italic">
                            <span>TRUSTED BY 1000+ HOBBYISTS</span>
                            <span className="w-2 h-2 bg-[#071A2F] rounded-full"></span>
                            <span>PREMIUM GENETICS ONLY</span>
                            <span className="w-2 h-2 bg-[#071A2F] rounded-full"></span>
                            <span>FAST LOGISTICS PROTOCOL</span>
                            <span className="w-2 h-2 bg-[#071A2F] rounded-full"></span>
                            <span>CERTIFIED AQUATIC EXPORTS</span>
                            <span className="w-2 h-2 bg-[#071A2F] rounded-full"></span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Business Banner Section - Full Responsive */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full pt-20 sm:pt-24 mb-16 sm:mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black italic uppercase text-[#BFEFFF] mb-3">
                        Welcome to <span className="text-[#00E5FF]">AK Fish Farms</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent mx-auto rounded-full blur-[1px]"></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="w-full glass-card rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-8 border border-[#00E5FF]/20 relative overflow-hidden group shadow-[0_0_60px_rgba(0,229,255,0.15)] hover:shadow-[0_0_80px_rgba(0,229,255,0.25)] transition-all duration-500"
                >
                    {/* Premium Aqua Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 via-transparent to-[#00C2D1]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                    {/* Banner Image Container - Fully Responsive */}
                    <div className="relative w-full rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#071A2F] to-[#0B2A4A] border border-[#00E5FF]/10">
                        <img
                            src="/ak-fish-farms-banner.png"
                            alt="AK Fish Farms - Your trust is my journey. All kinds of Colour Fishes Available. Contact: 94920 45766, 97053 53646"
                            className="w-full h-auto object-contain"
                            loading="lazy"
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                display: 'block',
                                margin: '0 auto'
                            }}
                        />
                    </div>

                    {/* Mobile Contact Quick Access (Optional Enhancement) */}
                    <div className="block sm:hidden mt-6 flex flex-col gap-3">
                        <a
                            href="tel:+919492045766"
                            className="flex items-center justify-center gap-3 px-6 py-4 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-2xl text-[#00E5FF] font-black text-sm uppercase tracking-widest hover:bg-[#00E5FF] hover:text-[#071A2F] transition-all"
                        >
                            📞 Call: 94920 45766
                        </a>
                        <a
                            href="https://wa.me/919705353646"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 px-6 py-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 font-black text-sm uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all"
                        >
                            💬 WhatsApp: 97053 53646
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center mb-32 w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <div className="max-w-5xl mx-auto glass-card rounded-[4rem] p-12 md:p-24 border border-[#00E5FF]/10 relative overflow-hidden group shadow-[0_0_100px_rgba(0,0,0,0.8)]">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544521848-df840003006d?auto=format&fit=crop&w=1200&q=80')] opacity-5 blur-sm scale-110"></div>

                        <div className="relative z-10 text-center">
                            <motion.span
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="inline-block px-8 py-3 bg-[#0B2A4A]/60 rounded-full text-[#00E5FF] font-black uppercase text-[10px] tracking-[0.3em] mb-12 border border-[#00E5FF]/20 backdrop-blur-3xl"
                            >
                                <Sparkles className="inline-block w-4 h-4 mr-2 -mt-1" /> Welcome to AK Fish Farms
                            </motion.span>

                            <h1 className="text-6xl sm:text-7xl md:text-9xl font-black text-[#BFEFFF] italic leading-[0.9] mb-10 uppercase tracking-tighter">
                                Premium <span className="text-[#00E5FF] drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]">Aquarium</span><br />
                                Collection
                            </h1>

                            <p className="text-[#BFEFFF]/60 text-lg md:text-xl font-medium max-w-2xl mx-auto tracking-wide leading-relaxed mb-16 px-4 uppercase text-xs tracking-[0.2em]">
                                Curating the world's most vibrant and healthy aquatic populations
                                with over 20 years of professional expertise.
                            </p>

                            <Link to="/shop">
                                <button
                                    className="px-16 h-20 btn-premium mx-auto flex items-center gap-4 text-xs"
                                >
                                    Explore Collection <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-8 mb-40 px-6 z-10">
                {[
                    { icon: <ShieldCheck />, text: "Certified Stocks" },
                    { icon: <Zap />, text: "Fast Logistics" },
                    { icon: <Star />, text: "Premium Quality" }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 px-8 py-5 glass-card rounded-2xl border border-[#00E5FF]/5 opacity-60">
                        <div className="text-[#00E5FF]">{item.icon}</div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BFEFFF]">{item.text}</span>
                    </div>
                ))}
            </div>

            {/* Featured Categories Grid */}
            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <div className="text-center mb-24">
                    <h2 className="text-4xl lg:text-6xl font-black italic uppercase text-[#BFEFFF] mb-6">Aquatic <span className="text-[#00E5FF]">Categories</span></h2>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-[#00E5FF] to-transparent mx-auto rounded-full blur-[1px]"></div>
                </div>
                <div className="flex flex-wrap justify-center gap-16 lg:gap-20 pb-20">
                    {categoriesList.map((cat, idx) => (
                        <div key={idx} className="mb-12 sm:mb-0">
                            <CategoryCard category={cat} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;

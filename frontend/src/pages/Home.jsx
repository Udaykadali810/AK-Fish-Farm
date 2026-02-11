import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CategoryCard = ({ category }) => {
    return (
        <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative w-full sm:w-[350px] h-[480px] cursor-pointer"
        >
            <Link to={`/shop?category=${category.name}`}>
                <div className="w-full h-full glass-card rounded-[4rem] p-10 flex flex-col items-center justify-center text-center relative z-10 transition-all duration-700 hover:shadow-primary/20 hover:border-primary/50">
                    {/* Logo Area */}
                    <div className="relative mb-12">
                        <div className="w-32 h-32 bg-gradient-to-tr from-primary to-accent rounded-[2.5rem] flex items-center justify-center shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-700">
                            <span className="text-5xl font-black text-white italic">AK</span>
                        </div>
                    </div>

                    <h3 className="text-3xl font-black text-dark italic mb-6 group-hover:text-primary transition-all duration-500">
                        {category.name}
                    </h3>

                    <p className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-10 opacity-60 group-hover:opacity-100 transition-all">
                        Pure Quality Species
                    </p>

                    <div className="flex items-center gap-3 text-primary font-black uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        Explore Collection <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const Home = () => {
    const categories = [
        { name: 'AK Special Fish Collection', icon: '🐠' },
        { name: 'AK Premium Collection', icon: '💎' },
        { name: 'Fancy Guppy Collection', icon: '🎏' }
    ];

    return (
        <div className="relative min-h-screen py-16 md:py-32 flex flex-col items-center justify-center">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-20 md:mb-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-6 py-2 glass-card rounded-full text-primary font-black uppercase text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.4em] mb-10 border border-primary/20">
                        Welcome to AK Fish Farms
                    </span>
                    <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-dark italic leading-tight mb-8">
                        The <span className="text-primary italic">Aquatic</span><br />Standard
                    </h1>
                    <p className="text-gray-500 text-base md:text-xl font-medium max-w-2xl mx-auto tracking-wide leading-relaxed px-4">
                        Curating the world's most vibrant and healthy aquatic populations
                        with professional care and state-of-the-art facilities.
                    </p>
                </motion.div>
            </div>


            {/* Featured Categories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-wrap justify-center gap-12 lg:gap-16">
                    {categories.map((cat, idx) => (
                        <CategoryCard key={idx} category={cat} />
                    ))}
                </div>
            </div>
        </div>
    );
};


export default Home;

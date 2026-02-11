import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CategoryCard = ({ category }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative w-full sm:w-[350px] h-[480px] cursor-pointer"
        >
            <div className="ripple-bg group-hover:scale-[2] group-hover:opacity-10 transition-all duration-1000"></div>

            <Link to={`/shop?category=${category.name}`}>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="floating w-full h-full glass-card rounded-[4rem] p-10 flex flex-col items-center justify-center text-center relative z-10 transition-all duration-700 group-hover:shadow-[0_0_60px_rgba(0,180,216,0.3)] group-hover:border-primary/50"
                >
                    {/* Interior Glowing Gradient */}
                    <div className="absolute inset-0 rounded-[4rem] bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {/* Logo Area */}
                    <div className="relative mb-12 transform-gpu group-hover:translate-z-10 transition-transform duration-700">
                        <div className="w-32 h-32 bg-gradient-to-tr from-primary to-accent rounded-[2.5rem] flex items-center justify-center shadow-2xl transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
                            <span className="text-5xl font-black text-white italic">AK</span>
                        </div>
                        {/* Sparkle effect */}
                        <div className="absolute -top-4 -right-4 text-primary animate-pulse">
                            <Sparkles className="w-8 h-8" />
                        </div>
                    </div>

                    <h3 className="text-3xl font-black text-white italic mb-6 transition-all duration-500 group-hover:text-primary group-hover:drop-shadow-[0_0_15px_rgba(0,180,216,0.5)] transform-gpu group-hover:translate-z-5">
                        {category.name}
                    </h3>

                    <p className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mb-10 opacity-60 group-hover:opacity-100 transition-all">
                        Pure Quality Species
                    </p>

                    <div className="flex items-center gap-3 text-primary font-black uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        Explore Collection <ArrowRight className="w-4 h-4" />
                    </div>
                </motion.div>
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
        <div className="relative min-h-screen py-32 flex flex-col items-center justify-center">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "circOut" }}
                >
                    <span className="inline-block px-6 py-2 glass-card rounded-full text-primary font-black uppercase text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.4em] mb-10 border border-primary/20">
                        Welcome to AK Fish Farms
                    </span>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white italic leading-tight mb-8">
                        The <span className="text-primary italic drop-shadow-[0_0_20px_rgba(0,180,216,0.5)]">Aquatic</span><br />Standard
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto tracking-wide leading-relaxed">
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

            {/* Subtle Gradient Shadow bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-dark to-transparent -z-10" />
        </div>
    );
};

export default Home;

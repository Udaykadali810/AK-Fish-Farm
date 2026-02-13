import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UnderwaterBackground from './UnderwaterBackground';

const IntroAnimation = ({ onComplete }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const text = "AK FISH FARMS";
    const letters = text.split("");

    useEffect(() => {
        // Show content after a slight delay for background to settle
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleContinue = () => {
        // 1. Play Netflix Ta-Dum Sound
        const tadum = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-cinematic-deep-drums-logo-607.mp3');
        tadum.volume = 0.8;
        tadum.play().catch(e => console.log("Audio blocked", e));

        // 2. Trigger Slide Transition
        setIsExiting(true);

        // 3. Smooth Redirect
        setTimeout(() => {
            window.location.href = "https://ak-fish-farm-lu3i.vercel.app/";
        }, 1200);
    };

    // Check if seen before
    const hasSeenIntro = localStorage.getItem('ak_fish_farm_intro_seen');
    if (hasSeenIntro) {
        // If they already saw it, we just complete immediately in the background
        // but the prompt says play once on first visit. 
        // I will handle the visibility in App.jsx but keep the logic here for redirection if needed.
    }

    return (
        <motion.div
            initial={{ x: 0 }}
            animate={{ x: isExiting ? '-100%' : 0 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[100] bg-[#000428] flex items-center justify-center overflow-hidden"
        >
            {/* High Quality Background */}
            <UnderwaterBackground />

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col items-center text-center px-4">
                <div className="flex space-x-1 md:space-x-3 mb-4">
                    {letters.map((char, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                            animate={isVisible ? {
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)"
                            } : {}}
                            transition={{
                                duration: 1,
                                delay: i * 0.1,
                                ease: "easeOut"
                            }}
                            className={`text-5xl md:text-8xl font-black italic tracking-tighter ${char === " " ? "w-4 md:w-8" : "bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-[#00d2ff]"} `}
                            style={{
                                textShadow: "0 0 30px rgba(0, 210, 255, 0.6)",
                            }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </div>

                {/* Quote */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 0.8 } : {}}
                    transition={{ duration: 1.5, delay: 2.5 }}
                    className="text-text-main text-sm md:text-lg font-light tracking-[0.3em] uppercase mb-12 italic"
                >
                    Nurturing Life Beneath the Water.
                </motion.p>

                {/* Continue Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isVisible ? {
                        opacity: 1,
                        scale: 1,
                    } : {}}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 1, delay: 3.5 }}
                    onClick={handleContinue}
                    className="group relative px-12 py-4 bg-primary/20 backdrop-blur-md border border-primary/50 rounded-full overflow-hidden transition-all duration-300 hover:bg-primary/40"
                >
                    {/* Pulsing Effect */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.2, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-primary/20 rounded-full"
                    />

                    <span className="relative z-10 text-white font-black tracking-[0.4em] uppercase text-sm group-hover:drop-shadow-[0_0_8px_white]">
                        Continue
                    </span>
                </motion.button>
            </div>

            {/* Dark Side Overlay for Netflix Slide */}
            <div className="absolute top-0 right-[-10%] w-[10%] h-full bg-black/20 blur-2xl z-[110]" />
        </motion.div>
    );
};

export default IntroAnimation;

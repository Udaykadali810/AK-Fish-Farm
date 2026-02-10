import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FISH_TYPES = [
    { type: 'arowana', label: 'Arowana', color: '#c5a059' }, // Silver/Gold
    { type: 'guppy', label: 'Guppy', color: '#00d2ff' }, // Neon Blue
    { type: 'goldfish', label: 'Goldfish', color: '#ff8c00' }, // Vibrant Orange
    { type: 'betta', label: 'Betta', color: '#dc2626' }, // Deep Red
    { type: 'tetra', label: 'Tetra', color: '#3b82f6' }, // Electric Blue
    { type: 'angelfish', label: 'Angelfish', color: '#f8fafc' }  // Pearly White
];

const FishSVG = ({ type, color }) => {
    switch (type) {
        case 'arowana':
            return (
                <svg viewBox="0 0 120 40" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                    <defs>
                        <linearGradient id={`grad-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.8 }} />
                            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.2 }} />
                        </linearGradient>
                    </defs>
                    <path d="M5,20 C10,10 30,5 90,12 C105,15 115,22 110,30 C100,38 70,42 20,32 C5,28 -5,25 5,20 Z" fill={`url(#grad-${type})`} />
                    <path d="M85,12 Q100,5 115,10 M85,30 Q105,38 118,32" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.5" />
                    <circle cx="12" cy="16" r="1.2" fill="white" fillOpacity="0.8" />
                </svg>
            );
        case 'angelfish':
            return (
                <svg viewBox="0 0 80 100" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                    <path d="M40,5 C55,30 75,50 40,95 C25,70 15,40 40,5 Z" fill={color} fillOpacity="0.6" />
                    <path d="M40,20 Q65,45 40,80 Q20,50 40,20" fill={color} fillOpacity="0.3" />
                    <circle cx="45" cy="35" r="2" fill="white" fillOpacity="0.6" />
                </svg>
            );
        case 'betta':
            return (
                <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                    <path d="M10,30 C30,10 80,-10 95,20 C100,45 80,65 50,55 C20,45 5,45 10,30 Z" fill={color} fillOpacity="0.4" />
                    <path d="M15,30 Q40,20 70,30 Q40,45 15,30" fill={color} fillOpacity="0.8" />
                    <circle cx="25" cy="28" r="1.5" fill="white" fillOpacity="0.7" />
                </svg>
            );
        case 'goldfish':
            return (
                <svg viewBox="0 0 80 50" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                    <ellipse cx="30" cy="25" rx="22" ry="14" fill={color} fillOpacity="0.7" />
                    <path d="M50,25 C70,5 85,15 75,25 C85,35 70,45 50,25" fill={color} fillOpacity="0.5" />
                    <circle cx="22" cy="22" r="2" fill="white" fillOpacity="0.6" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 60 30" className="w-full h-full drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
                    <path d="M5,15 C20,5 45,8 55,15 C45,22 20,25 5,15 Z" fill={color} fillOpacity="0.7" />
                    <path d="M50,15 L60,8 M50,15 L60,22" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
                </svg>
            );
    }
};

const RealisticFish = ({ delay, duration, type, initialY, scale, direction, blur, scrollYProgress }) => {
    // Parallax effect based on depth (blur)
    const parallax = useTransform(scrollYProgress, [0, 1], [0, (4 - blur) * 120]);

    return (
        <motion.div
            initial={{ x: direction === 1 ? -300 : '110vw', y: initialY, scale, opacity: 0 }}
            animate={{
                x: direction === 1 ? '110vw' : -300,
                y: [initialY, initialY - 40, initialY + 30, initialY],
                opacity: [0, 0.5, 0.5, 0]
            }}
            style={{ y: parallax }}
            transition={{
                x: { duration, repeat: Infinity, delay, ease: "linear" },
                y: { duration: duration / 5, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration, repeat: Infinity, delay, ease: "linear" }
            }}
            className="absolute"
            style={{
                width: type === 'arowana' ? 240 : type === 'angelfish' ? 100 : 100,
                height: type === 'angelfish' ? 140 : 80,
                filter: `blur(${blur}px)`,
                zIndex: blur > 1.5 ? -3 : -2,
                transform: direction === -1 ? 'scaleX(-1)' : 'none',
                color: FISH_TYPES.find(f => f.type === type).color
            }}
        >
            <FishSVG type={type} color={FISH_TYPES.find(f => f.type === type).color} />
        </motion.div>
    );
};

const UnderwaterBackground = () => {
    const { scrollYProgress } = useScroll();
    const [bubbles, setBubbles] = useState([]);

    const fishScene = useMemo(() => {
        return Array.from({ length: 18 }).map((_, i) => ({
            id: i,
            type: FISH_TYPES[i % FISH_TYPES.length].type,
            delay: Math.random() * 25,
            duration: 35 + Math.random() * 35,
            initialY: `${5 + Math.random() * 90}vh`,
            scale: 0.3 + Math.random() * 1.0,
            direction: Math.random() > 0.5 ? 1 : -1,
            blur: Math.random() * 4
        }));
    }, []);

    useEffect(() => {
        const newBubbles = Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            size: 4 + Math.random() * 18,
            duration: 12 + Math.random() * 18,
            delay: Math.random() * 15,
            opacity: 0.05 + Math.random() * 0.15
        }));
        setBubbles(newBubbles);
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
            {/* Deep Water Gradient Base */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#001f3f] via-[#000d1a] to-[#000428]" />

            {/* Sunlight Rays (Caustics) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ rotate: [0, 10, 0], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-100%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_0%,transparent_0deg,#00d2ff1c_20deg,transparent_40deg,#00f2fe1a_60deg,transparent_80deg)]"
                />
            </div>

            {/* Moving Water Bubbles */}
            {bubbles.map((bubble) => (
                <motion.div
                    key={bubble.id}
                    initial={{ y: '110vh', x: bubble.left, opacity: 0 }}
                    animate={{
                        y: '-20vh',
                        x: [bubble.left, `calc(${bubble.left} + 25px)`, `calc(${bubble.left} - 25px)`, bubble.left],
                        opacity: [0, bubble.opacity, bubble.opacity, 0]
                    }}
                    transition={{
                        y: { duration: bubble.duration, repeat: Infinity, delay: bubble.delay, ease: "linear" },
                        x: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                        opacity: { duration: bubble.duration, repeat: Infinity, delay: bubble.delay, ease: "linear" }
                    }}
                    className="absolute rounded-full border border-white/20 bg-white/5"
                    style={{ width: bubble.size, height: bubble.size, filter: 'blur(1px)' }}
                />
            ))}

            {/* Fish Population with Scroll-Linked Parallax */}
            {fishScene.map((fish) => (
                <RealisticFish key={fish.id} {...fish} scrollYProgress={scrollYProgress} />
            ))}

            {/* Glass Distort / Refractive Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/water-drop.png')] opacity-10 mix-blend-overlay pointer-events-none animate-[waves_30s_linear_infinite]" />
            <div className="absolute inset-0 bg-primary/5 backdrop-blur-[0.5px] pointer-events-none" />

            {/* Particles / Plankton */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[size:150px_150px] animate-[floating_20s_infinite]" />

            <style>{`
                @keyframes waves {
                    from { background-position: 0 0; }
                    to { background-position: 0 1000px; }
                }
                @keyframes floating {
                    0% { transform: translate(0, 0); }
                    50% { transform: translate(10px, 10px); }
                    100% { transform: translate(0, 0); }
                }
            `}</style>
        </div>
    );
};

export default UnderwaterBackground;

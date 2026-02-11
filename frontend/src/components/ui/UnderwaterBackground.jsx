import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FISH_TYPES = [
    { type: 'arowana', label: 'Arowana', color: '#ffd700', size: 280 },
    { type: 'guppy', label: 'Guppy', color: '#00d2ff', size: 100 },
    { type: 'goldfish', label: 'Goldfish', color: '#ff8c00', size: 120 },
    { type: 'betta', label: 'Betta', color: '#ff4d4d', size: 110 },
    { type: 'tetra', label: 'Tetra', color: '#00ffff', size: 70 },
    { type: 'angelfish', label: 'Angelfish', color: '#ffffff', size: 140 },
    { type: 'discus', label: 'Discus', color: '#ff00ff', size: 130 }
];

const FishSVG = ({ type, color }) => {
    switch (type) {
        case 'arowana':
            return (
                <svg viewBox="0 0 120 40" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
                    <defs>
                        <linearGradient id={`grad-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.9 }} />
                            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.4 }} />
                        </linearGradient>
                    </defs>
                    <path d="M5,20 C10,10 30,5 90,12 C105,15 115,22 110,30 C100,38 70,42 20,32 C5,28 -5,25 5,20 Z" fill={`url(#grad-${type})`} />
                    <path d="M85,12 Q100,5 115,10 M85,30 Q105,38 118,32" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.5" />
                    <circle cx="12" cy="16" r="1.2" fill="white" fillOpacity="0.8" />
                </svg>
            );
        case 'angelfish':
            return (
                <svg viewBox="0 0 80 100" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
                    <path d="M40,5 C55,30 75,50 40,95 C25,70 15,40 40,5 Z" fill={color} fillOpacity="0.7" />
                    <path d="M40,20 Q65,45 40,80 Q20,50 40,20" fill={color} fillOpacity="0.4" />
                    <circle cx="45" cy="35" r="2" fill="white" fillOpacity="0.6" />
                </svg>
            );
        case 'discus':
            return (
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
                    <circle cx="50" cy="50" r="45" fill={color} fillOpacity="0.6" />
                    <path d="M50,10 Q80,50 50,90 Q20,50 50,10" fill={color} fillOpacity="0.3" />
                    <circle cx="25" cy="40" r="3" fill="red" fillOpacity="0.8" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 60 30" className="w-full h-full drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)]">
                    <path d="M5,15 C20,5 45,8 55,15 C45,22 20,25 5,15 Z" fill={color} fillOpacity="0.8" />
                    <path d="M50,15 L60,8 M50,15 L60,22" stroke={color} strokeWidth="1" strokeOpacity="0.7" />
                </svg>
            );
    }
};

const RealisticFish = ({ delay, duration, type, initialY, scale, direction, blur, scrollYProgress }) => {
    const parallax = useTransform(scrollYProgress, [0, 1], [0, (4 - blur) * 180]);
    const fishInfo = FISH_TYPES.find(f => f.type === type) || FISH_TYPES[0];

    // Natural wandering path (using keyframes for Y and subtle X variation)
    return (
        <motion.div
            initial={{ x: direction === 1 ? -400 : '110vw', y: initialY, scale, opacity: 0 }}
            animate={{
                x: direction === 1 ? '110vw' : -400,
                y: [
                    initialY,
                    `calc(${initialY} - ${30 + Math.random() * 50}px)`,
                    `calc(${initialY} + ${30 + Math.random() * 50}px)`,
                    `calc(${initialY} - ${10 + Math.random() * 20}px)`,
                    initialY
                ],
                opacity: [0, 0.8, 0.8, 0],
                rotate: [0, direction * 5, -direction * 5, 0]
            }}
            transition={{
                x: { duration, repeat: Infinity, delay, ease: "linear" },
                y: { duration: duration / 3, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration, repeat: Infinity, delay, ease: "linear" },
                rotate: { duration: duration / 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute"
            style={{
                y: parallax,
                width: fishInfo.size * scale,
                height: (fishInfo.size / 1.5) * scale,
                filter: `blur(${blur}px)`,
                zIndex: blur > 2 ? -3 : -2,
                transform: direction === -1 ? 'scaleX(-1)' : 'none',
                color: fishInfo.color
            }}
        >
            <FishSVG type={type} color={fishInfo.color} />
        </motion.div>
    );
};

// Schooling fish move in groups
const SchoolingFish = ({ id, delay, duration, initialY, direction, blur, count = 5 }) => {
    return (
        <React.Fragment>
            {Array.from({ length: count }).map((_, idx) => (
                <motion.div
                    key={`${id}-${idx}`}
                    initial={{
                        x: direction === 1 ? -200 : '105vw',
                        y: `calc(${initialY} + ${idx * 20}px)`,
                        scale: 0.4,
                        opacity: 0
                    }}
                    animate={{
                        x: direction === 1 ? '110vw' : -200,
                        y: [
                            `calc(${initialY} + ${idx * 20}px)`,
                            `calc(${initialY} + ${idx * 20 - 10}px)`,
                            `calc(${initialY} + ${idx * 20 + 10}px)`,
                            `calc(${initialY} + ${idx * 20}px)`
                        ],
                        opacity: [0, 0.6, 0.6, 0]
                    }}
                    transition={{
                        x: { duration, repeat: Infinity, delay: delay + (idx * 0.2), ease: "linear" },
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        opacity: { duration, repeat: Infinity, delay: delay + (idx * 0.2), ease: "linear" }
                    }}
                    className="absolute"
                    style={{
                        width: 60,
                        height: 30,
                        filter: `blur(${blur}px)`,
                        zIndex: -3,
                        transform: direction === -1 ? 'scaleX(-1)' : 'none',
                        color: '#00ffff'
                    }}
                >
                    <FishSVG type="tetra" color="#00ffff" />
                </motion.div>
            ))}
        </React.Fragment>
    );
};

const Seaweed = ({ left, height, delay, color }) => (
    <motion.div
        className="absolute bottom-[-20px] origin-bottom"
        style={{ left, height, width: 30, zIndex: -4 }}
        initial={{ rotate: -8 }}
        animate={{ rotate: 8 }}
        transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay
        }}
    >
        <svg viewBox="0 0 20 100" className="w-full h-full">
            <path
                d="M10,100 Q20,75 10,50 Q0,25 10,0"
                fill="none"
                stroke={color}
                strokeWidth="12"
                strokeLinecap="round"
                strokeOpacity="0.4"
            />
            <path
                d="M10,100 Q0,75 10,50 Q20,25 10,0"
                fill="none"
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeOpacity="0.2"
                style={{ filter: 'blur(3px)' }}
            />
        </svg>
    </motion.div>
);

const UnderwaterBackground = () => {
    const { scrollYProgress } = useScroll();
    const [bubbles, setBubbles] = useState([]);
    const [plants, setPlants] = useState([]);

    const individualFish = useMemo(() => {
        return Array.from({ length: 35 }).map((_, i) => ({
            id: i,
            type: FISH_TYPES[i % FISH_TYPES.length].type,
            delay: Math.random() * 40,
            duration: 10 + Math.random() * 15, // FASTER: was 25-70s
            initialY: `${5 + Math.random() * 90}vh`,
            scale: 0.5 + Math.random() * 1.3,
            direction: Math.random() > 0.5 ? 1 : -1,
            blur: Math.random() * 3.5
        }));
    }, []);

    const schools = useMemo(() => {
        return Array.from({ length: 4 }).map((_, i) => ({
            id: `school-${i}`,
            delay: Math.random() * 30,
            duration: 8 + Math.random() * 10, // FASTER: was 20-40s
            initialY: `${20 + Math.random() * 60}vh`,
            direction: Math.random() > 0.5 ? 1 : -1,
            blur: 1 + Math.random() * 2,
            count: 4 + Math.floor(Math.random() * 4)
        }));
    }, []);

    useEffect(() => {
        const newBubbles = Array.from({ length: 60 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            size: 2 + Math.random() * 18,
            duration: 8 + Math.random() * 18,
            delay: Math.random() * 25,
            opacity: 0.1 + Math.random() * 0.25
        }));
        setBubbles(newBubbles);

        const newPlants = Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            height: 150 + Math.random() * 350,
            delay: Math.random() * 10,
            color: i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#059669' : '#047857'
        }));
        setPlants(newPlants);
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
            {/* Cleaner, more vibrant water gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#006d77] via-[#2a9d8f] to-[#124559] opacity-95" />

            {/* Enhanced Light Rays */}
            <div className="absolute inset-0 opacity-40">
                {[1, 2, 3, 4].map((ray) => (
                    <motion.div
                        key={ray}
                        animate={{
                            rotate: [ray * 8, ray * 8 + 6, ray * 8],
                            opacity: [0.15, 0.35, 0.15],
                            scaleX: [1, 1.2, 1]
                        }}
                        transition={{ duration: 12 + ray * 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-60%] left-[-30%] w-[160%] h-[250%] bg-[conic-gradient(from_0deg_at_50%_0%,transparent_0deg,#ffffff11_10deg,transparent_20deg,#ffffff08_40deg,transparent_50deg)]"
                        style={{ filter: 'blur(30px)' }}
                    />
                ))}
            </div>

            {/* Lush Seaweed Forest */}
            {plants.map((plant) => (
                <Seaweed key={plant.id} {...plant} />
            ))}

            {/* Realistic Bubble Streams */}
            {bubbles.map((bubble) => (
                <motion.div
                    key={bubble.id}
                    initial={{ y: '110vh', x: bubble.left, opacity: 0 }}
                    animate={{
                        y: '-20vh',
                        x: [bubble.left, `calc(${bubble.left} + 40px)`, `calc(${bubble.left} - 40px)`, bubble.left],
                        opacity: [0, bubble.opacity, bubble.opacity, 0]
                    }}
                    transition={{
                        y: { duration: bubble.duration, repeat: Infinity, delay: bubble.delay, ease: "linear" },
                        x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        opacity: { duration: bubble.duration, repeat: Infinity, delay: bubble.delay, ease: "linear" }
                    }}
                    className="absolute rounded-full border border-white/40 bg-white/15"
                    style={{ width: bubble.size, height: bubble.size, filter: 'blur(0.5px)' }}
                />
            ))}

            {/* Schooling Fish (Tetras) */}
            {schools.map((school) => (
                <SchoolingFish key={school.id} {...school} />
            ))}

            {/* Individual Large/Medium Tropical Fish */}
            {individualFish.map((fish) => (
                <RealisticFish key={fish.id} {...fish} scrollYProgress={scrollYProgress} />
            ))}

            {/* Water Surface Ripple Effect */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/water-drop.png')] opacity-25 mix-blend-overlay animate-[waves_35s_linear_infinite]" />

            {/* Sunlight Top Glow */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white/20 to-transparent" />

            {/* Underwater "Dust" Particles */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#fff_1px,transparent_1.5px)] bg-[size:180px_180px] animate-[floating_22s_infinite]" />

            <style>{`
                @keyframes waves {
                    from { background-position: 0 0; }
                    to { background-position: 0 1400px; }
                }
                @keyframes floating {
                    0% { transform: translate(0, 0); }
                    50% { transform: translate(25px, 20px); }
                    100% { transform: translate(0, 0); }
                }
            `}</style>
        </div>
    );
};

export default UnderwaterBackground;

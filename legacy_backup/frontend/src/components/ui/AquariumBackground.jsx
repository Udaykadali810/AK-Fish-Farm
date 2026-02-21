import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AquariumBackground = () => {
    const [bubbles, setBubbles] = useState([]);

    useEffect(() => {
        const bubbleCount = 20;
        const newBubbles = Array.from({ length: bubbleCount }).map((_, i) => ({
            id: i,
            size: Math.random() * 20 + 5,
            left: Math.random() * 100,
            duration: Math.random() * 10 + 5,
            delay: Math.random() * 5,
        }));
        setBubbles(newBubbles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Spotlight Lighting */}
            <div className="absolute top-0 left-1/4 w-[40%] h-[100%] bg-white/5 blur-[120px] rounded-full transform -skew-x-12"></div>
            <div className="absolute top-0 right-1/4 w-[30%] h-[100%] bg-primary/5 blur-[100px] rounded-full transform skew-x-12"></div>

            {/* Bubble Particles */}
            {bubbles.map((b) => (
                <div
                    key={b.id}
                    className="bubble"
                    style={{
                        width: `${b.size}px`,
                        height: `${b.size}px`,
                        left: `${b.left}%`,
                        animation: `bubble ${b.duration}s linear infinite`,
                        animationDelay: `${b.delay}s`,
                    }}
                />
            ))}

            {/* Slow Swimming Fish (Symbolic/Animated 3D-ish feel with motion) */}
            <Fish left="-10%" top="20%" color="rgba(14, 165, 233, 0.2)" scale={1.5} duration={25} />
            <Fish left="-20%" top="60%" color="rgba(45, 212, 191, 0.15)" scale={1} duration={35} delay={5} />
            <Fish left="110%" top="40%" color="rgba(14, 165, 233, 0.1)" scale={2} duration={30} delay={10} reverse />
        </div>
    );
};

const Fish = ({ left, top, color, scale, duration, delay = 0, reverse = false }) => {
    return (
        <motion.div
            initial={{ x: reverse ? '100vw' : '-20vw', y: top }}
            animate={{
                x: reverse ? '-20vw' : '100vw',
                y: [top, `calc(${top} + 5%)`, top]
            }}
            transition={{
                x: { duration, repeat: Infinity, ease: "linear", delay },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute z-0 opacity-20 pointer-events-none"
            style={{ scale: reverse ? -scale : scale }}
        >
            <svg width="100" height="60" viewBox="0 0 100 60" fill={color}>
                <path d="M0 30C0 30 20 0 50 0C80 0 100 30 100 30C100 30 80 60 50 60C20 60 0 30 0 30Z" />
                <path d="M100 30L80 15V45L100 30Z" />
                <circle cx="20" cy="25" r="3" fill="white" />
            </svg>
        </motion.div>
    );
};

export default AquariumBackground;

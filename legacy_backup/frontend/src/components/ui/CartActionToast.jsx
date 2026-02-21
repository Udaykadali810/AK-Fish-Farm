import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartActionToast = () => {
    const { lastAddedItem, setLastAddedItem } = useCart();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (lastAddedItem) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(() => setLastAddedItem(null), 500);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [lastAddedItem, setLastAddedItem]);

    return (
        <AnimatePresence>
            {visible && lastAddedItem && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-24 lg:bottom-10 left-6 right-6 md:left-auto md:right-8 md:w-96 z-[1000]"
                >
                    <div className="glass-card rounded-[2rem] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[#00E5FF]/20 flex items-center gap-5 bg-[#071A2F]/90 backdrop-blur-3xl">
                        <div className="w-14 h-14 bg-[#00E5FF] rounded-2xl flex items-center justify-center flex-shrink-0 text-[#071A2F] shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#00E5FF] mb-1">Added to Cart</p>
                            <h4 className="text-[#BFEFFF] font-black italic truncate uppercase tracking-tight">{lastAddedItem.name}</h4>
                        </div>
                        <button
                            onClick={() => setVisible(false)}
                            className="p-3 hover:bg-[#BFEFFF]/5 rounded-xl transition-colors text-[#BFEFFF]/20 hover:text-[#BFEFFF]"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CartActionToast;

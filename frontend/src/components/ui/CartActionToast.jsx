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
                    className="fixed bottom-24 left-6 right-6 md:left-auto md:right-8 md:w-96 z-[100]"
                >
                    <div className="glass-morphism rounded-3xl p-6 shadow-2xl border border-primary/20 flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Added to Cart</p>
                            <h4 className="text-dark font-black italic truncate">{lastAddedItem.name}</h4>
                        </div>
                        <button
                            onClick={() => setVisible(false)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CartActionToast;

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
    return (
        <motion.a
            href="https://wa.me/919492045766"
            target="_blank"
            rel="noreferrer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="fixed bottom-10 right-8 z-[40] w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center hover:rotate-12 transition-all group"
        >
            <MessageCircle className="w-8 h-8 fill-white" />
            <div className="absolute right-full mr-4 bg-white dark:bg-slate-900 text-dark dark:text-white px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap font-bold text-sm">
                Chat with Specialist
            </div>
            {/* Pulsing indicator */}
            <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        </motion.a>
    );
};

export default WhatsAppButton;

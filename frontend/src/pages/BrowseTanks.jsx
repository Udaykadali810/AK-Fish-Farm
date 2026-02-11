import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { products } from '../data/products';

const TankCard = ({ fish }) => {
    const handleWhatsApp = () => {
        const message = `Hi AK Fish Farms, I'm interested in the ${fish.name} from your tank gallery!`;
        window.open(`https://wa.me/919492045766?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-[3rem] p-6 lg:p-8 flex flex-col items-center group hover:shadow-2xl hover:shadow-primary/10 transition-all border border-white/20"
        >
            <div className="w-full aspect-square rounded-[2rem] overflow-hidden mb-8 relative">
                <img
                    src={fish.image || "https://images.unsplash.com/photo-1524704659695-9f52093ea897?q=80&w=600&auto=format&fit=crop"}
                    alt={fish.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-primary/90 text-dark font-black px-4 py-2 rounded-2xl text-xs">
                    ₹{fish.price} / pair
                </div>
            </div>

            <h3 className="text-2xl font-black text-dark italic mb-3">{fish.name}</h3>
            <p className="text-gray-500 text-sm font-medium text-center line-clamp-2 mb-8 leading-relaxed px-4">
                {fish.description}
            </p>

            <button
                onClick={handleWhatsApp}
                className="w-full py-5 bg-[#FF6B6B] text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-[#FF6B6B]/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
                <MessageCircle className="w-5 h-5" /> Enquire on WhatsApp
            </button>
        </motion.div>
    );
};

const BrowseTanks = () => {
    return (
        <div className="min-h-screen pt-32 pb-40 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-6"
                    >
                        Live Gallery
                    </motion.span>
                    <h1 className="text-5xl lg:text-8xl font-black text-dark italic mb-8">
                        Browse Our <span className="text-primary italic">Tanks</span>
                    </h1>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto tracking-wide">
                        Explore our professionally curated tanks and find the perfect addition to your aquatic world.
                        Every species is hand-picked for vibrancy and health.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                    {products.map((fish, idx) => (
                        <TankCard key={idx} fish={fish} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrowseTanks;

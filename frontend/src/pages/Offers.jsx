import React, { useState, useEffect } from 'react';
import { Tag, Copy, CheckCircle2, Gift, Ticket, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Offers = () => {
    const [copied, setCopied] = useState('');
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const baseUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${baseUrl}/api/offers`);
            const data = await res.json();
            setOffers(data);
        } catch (err) {
            console.error('Failed to fetch offers');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(''), 3000);
    };

    return (
        <div className="bg-bg-main min-h-screen pb-24 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-aqua/10 text-aqua rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8 border border-aqua/30">
                        <Gift className="w-4 h-4" /> Exclusive Deals
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-8xl font-black text-white mb-6 italic transition-all">Aquatic <span className="text-aqua italic glow-text">Bundles</span></h1>
                    <p className="text-white/40 font-medium max-w-xl mx-auto leading-relaxed">Save big on your next aquarium addition with our curated discount tokens.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-aqua border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {offers.map((offer, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                key={offer.id || idx}
                                className="glass-card rounded-[3.5rem] p-10 shadow-xl border-2 border-dashed border-white/10 relative overflow-hidden group bg-dark"
                            >
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-aqua/5 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>

                                <div className="flex items-start justify-between mb-10">
                                    <div className="p-5 bg-white/5 text-aqua rounded-2xl group-hover:rotate-12 transition-transform border border-white/10">
                                        <Ticket className="w-10 h-10" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Discount</p>
                                        <p className="text-4xl font-black text-aqua italic glow-text">{offer.discount}</p>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-white mb-4 italic leading-tight uppercase tracking-tighter">{offer.title}</h3>
                                <p className="text-sm font-medium text-white/40 mb-10 leading-relaxed">
                                    Valid on all aquatic species and supplies. Limited time promotion within the AK Ecosystem.
                                </p>

                                {offer.code && (
                                    <div className="flex items-center gap-4">
                                        <div className="flex-grow p-5 bg-white/5 rounded-3xl border border-white/10 font-black text-lg sm:text-2xl text-white text-center tracking-[0.2em] sm:tracking-[0.3em] border-dashed truncate">
                                            {offer.code}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(offer.code)}
                                            className={`p-5 rounded-3xl transition-all shadow-xl flex items-center justify-center ${copied === offer.code ? 'bg-green-500 text-white' : 'bg-aqua text-dark hover:scale-105 shadow-[0_0_20px_rgba(14,165,233,0.3)]'}`}
                                        >
                                            {copied === offer.code ? <CheckCircle2 className="w-7 h-7" /> : <Copy className="w-7 h-7" />}
                                        </button>
                                    </div>
                                )}

                                <div className="mt-8 flex justify-between items-center px-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 rounded-full bg-aqua animate-pulse shadow-[0_0_10px_#0EA5E9]" /> Live Protocol
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Offer Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-24 p-8 sm:p-12 lg:p-20 glass-card text-white rounded-[3rem] sm:rounded-[4rem] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 border border-white/5 bg-dark"
                >
                    <Droplets className="absolute -left-20 -bottom-20 w-80 h-80 text-white/5" />
                    <div className="relative z-10 max-w-2xl text-center lg:text-left">
                        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black italic mb-6 uppercase tracking-tighter">Bulk Setup <span className="text-aqua italic glow-text">Protocol?</span></h2>
                        <p className="text-white/40 text-base sm:text-lg font-medium leading-relaxed mb-10">We provide special pricing for new hobbyists and bulk institutional orders. Connect with our experts for a personalized technical quote.</p>
                        <Link to="/contact" className="px-10 sm:px-12 py-5 bg-aqua text-dark rounded-[2rem] font-black text-lg sm:text-xl hover:scale-105 transition-all shadow-2xl shadow-aqua/20 inline-block uppercase tracking-widest">Establish Contact</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Offers;

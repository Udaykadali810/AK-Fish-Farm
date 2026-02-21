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
        <div className="min-h-screen pb-32 pt-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="text-center mb-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center gap-3 px-8 py-3 bg-[#0B2A4A]/60 text-[#00E5FF] rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 border border-[#00E5FF]/20 backdrop-blur-3xl">
                            <Gift className="w-4 h-4" /> Exclusive Deals
                        </div>
                        <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-[#BFEFFF] mb-8 italic leading-[0.9] tracking-tighter uppercase">Aquatic <span className="text-[#00E5FF] glow-text">Bundles</span></h1>
                        <p className="text-[#BFEFFF]/40 font-medium max-w-xl mx-auto leading-relaxed uppercase text-xs tracking-widest leading-relaxed">Save big on your next aquarium addition with our curated discount tokens.</p>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-32">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#00E5FF] border-t-transparent shadow-[0_0_30px_rgba(0,229,255,0.2)]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {offers.map((offer, idx) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                key={offer.id || idx}
                                className="glass-card rounded-[3.5rem] p-10 border-2 border-dashed border-[#00E5FF]/20 relative overflow-hidden group bg-[#071A2F]/60"
                            >
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#00E5FF]/5 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>

                                <div className="flex items-start justify-between mb-10">
                                    <div className="p-6 bg-[#0B2A4A] text-[#00E5FF] rounded-2xl group-hover:rotate-12 transition-transform border border-[#00E5FF]/10 shadow-2xl">
                                        <Ticket className="w-10 h-10" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-[#BFEFFF]/20 uppercase tracking-widest mb-1">Efficiency Boost</p>
                                        <p className="text-5xl font-black text-[#00E5FF] italic drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">{offer.discount}</p>
                                    </div>
                                </div>

                                <h3 className="text-3xl font-black text-[#BFEFFF] mb-6 italic leading-tight uppercase tracking-tighter">{offer.title}</h3>
                                <p className="text-[11px] font-medium text-[#BFEFFF]/40 mb-10 leading-relaxed uppercase tracking-wider">
                                    Valid on all aquatic species and supplies. Limited time promotion within the AK Ecosystem.
                                </p>

                                {offer.code && (
                                    <div className="flex items-center gap-5">
                                        <div className="flex-grow p-6 bg-[#071A2F]/80 rounded-[2rem] border-2 border-dashed border-[#00E5FF]/20 font-black text-2xl text-[#BFEFFF] text-center tracking-[0.3em] uppercase truncate shadow-inner">
                                            {offer.code}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(offer.code)}
                                            className={`w-20 h-20 rounded-[2rem] transition-all shadow-2xl flex items-center justify-center border-2 ${copied === offer.code ? 'bg-green-500 border-green-400 text-white' : 'bg-[#00E5FF] border-[#00E5FF] text-[#071A2F] hover:scale-105 active:scale-95'}`}
                                        >
                                            {copied === offer.code ? <CheckCircle2 className="w-8 h-8" /> : <Copy className="w-8 h-8" />}
                                        </button>
                                    </div>
                                )}

                                <div className="mt-10 flex justify-between items-center px-2">
                                    <div className="flex items-center gap-3 text-[10px] font-black text-[#BFEFFF]/20 uppercase tracking-[0.3em]">
                                        <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse shadow-[0_0_15px_rgba(0,229,255,0.6)]" /> Live Protocol Active
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
                    className="mt-32 p-12 lg:p-24 glass-card text-[#BFEFFF] rounded-[4rem] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-16 border border-[#00E5FF]/10 bg-gradient-to-br from-[#0B2A4A]/40 to-transparent shadow-[0_50px_100px_rgba(0,0,0,0.7)]"
                >
                    <Droplets className="absolute -left-20 -bottom-20 w-80 h-80 text-[#00E5FF]/5" />
                    <div className="relative z-10 max-w-2xl text-center lg:text-left">
                        <h2 className="text-5xl lg:text-7xl font-black italic mb-8 uppercase tracking-tighter leading-[0.9]">Bulk Setup <span className="text-[#00E5FF] glow-text">Protocol?</span></h2>
                        <p className="text-[#BFEFFF]/40 text-lg font-medium leading-relaxed mb-12 uppercase text-[11px] tracking-widest leading-relaxed">We provide special pricing for new hobbyists and bulk institutional orders. Connect with our experts for a personalized technical quote.</p>
                        <Link to="/contact" className="px-16 h-20 btn-premium inline-flex items-center justify-center text-xs">Establish Contact</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Offers;

import React, { useState } from 'react';
import { Mail, Phone, Instagram, MessageCircle, MapPin, Send, MessageSquare, Droplets, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen pt-40 pb-32 relative overflow-hidden bg-transparent">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00E5FF]/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00C2D1]/5 blur-[120px] rounded-full"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="text-[#00E5FF] text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">Communication Protocol</span>
                        <h1 className="text-6xl lg:text-9xl font-black text-[#BFEFFF] italic mb-8 leading-[0.8] tracking-tighter uppercase">
                            Establish <span className="text-[#00E5FF] drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]">Contact</span>
                        </h1>
                        <p className="text-[#BFEFFF]/40 font-medium tracking-[0.2em] text-xs uppercase max-w-2xl mx-auto leading-relaxed">
                            Direct channel for elite species acquisition and habitat coordination.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {[
                            { icon: <Droplets className="w-6 h-6" />, label: "Proprietor", value: "K. Hari Teja", color: "text-[#00E5FF]", link: "#" },
                            { icon: <Phone className="w-6 h-6" />, label: "Comm Channel", value: "94920 45766", color: "text-[#00C2D1]", link: "tel:+919492045766" },
                            { icon: <MessageCircle className="w-6 h-6" />, label: "WhatsApp Status", value: "Online", color: "text-green-400", link: "https://wa.me/919492045766" },
                            { icon: <Instagram className="w-6 h-6" />, label: "Instagram Link", value: "@akfishfarms", color: "text-pink-400", link: "https://www.instagram.com/akfishfarms/" },
                            { icon: <MapPin className="w-6 h-6" />, label: "Coordinates", value: "Andhra Pradesh", color: "text-orange-400", link: "https://maps.app.goo.gl/GnqDjeTsM2h6eQEy6" }
                        ].map((item, i) => (
                            <motion.a
                                whileHover={{ x: 10, scale: 1.02 }}
                                href={item.link}
                                key={i}
                                className="glass-card p-10 rounded-[3rem] border border-[#00E5FF]/10 flex items-center gap-10 group block"
                            >
                                <div className={`p-5 rounded-3xl bg-[#0B2A4A] ${item.color} group-hover:scale-110 transition-transform duration-500 shadow-xl border border-[#00E5FF]/10`}>
                                    {item.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-[0.3em] mb-2">{item.label}</span>
                                    <span className="text-xl font-black text-[#BFEFFF] italic tracking-tight uppercase">{item.value}</span>
                                </div>
                            </motion.a>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass-card rounded-[4rem] p-12 lg:p-20 border border-[#00E5FF]/20 h-full relative overflow-hidden shadow-2xl bg-gradient-to-br from-[#0B2A4A]/40 to-transparent"
                        >
                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#00E5FF]/10 blur-[100px] rounded-full pointer-events-none"></div>

                            <div className="flex items-center gap-8 mb-16 relative z-10">
                                <div className="p-6 bg-[#00E5FF] text-[#071A2F] rounded-[2rem] shadow-[0_0_30px_rgba(0,229,255,0.4)]"><MessageSquare className="w-8 h-8" /></div>
                                <h2 className="text-4xl sm:text-5xl font-black text-[#BFEFFF] italic uppercase tracking-tighter leading-tight">Drop a <span className="text-[#00E5FF]">Note</span></h2>
                            </div>

                            <AnimatePresence mode='wait'>
                                {sent ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-24 text-center h-full relative z-10"
                                    >
                                        <div className="w-24 h-24 bg-[#00E5FF] text-[#071A2F] rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(0,229,255,0.5)] border-4 border-[#071A2F]">
                                            <CheckCircle2 className="w-12 h-12" />
                                        </div>
                                        <h3 className="text-4xl font-black text-[#BFEFFF] mb-4 italic uppercase tracking-tight">Transmission Secured</h3>
                                        <p className="text-[#BFEFFF]/60 font-medium max-w-sm uppercase text-[10px] tracking-widest">A human operator will respond to your channel shortly.</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-[#00E5FF]/50 uppercase tracking-[0.4em] ml-4">Identifier Name</label>
                                                <input required type="text" className="w-full p-8 rounded-[2.5rem] bg-[#071A2F]/60 border border-[#00E5FF]/20 focus:border-[#00E5FF] focus:ring-4 focus:ring-[#00E5FF]/10 text-[#BFEFFF] font-black transition-all outline-none placeholder-[#BFEFFF]/10 shadow-inner text-sm uppercase tracking-widest" placeholder="Your Full Name" />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-[#00E5FF]/50 uppercase tracking-[0.4em] ml-4">Phone Protocol</label>
                                                <input required type="tel" className="w-full p-8 rounded-[2.5rem] bg-[#071A2F]/60 border border-[#00E5FF]/20 focus:border-[#00E5FF] focus:ring-4 focus:ring-[#00E5FF]/10 text-[#BFEFFF] font-black transition-all outline-none placeholder-[#BFEFFF]/10 shadow-inner text-sm uppercase tracking-widest" placeholder="10-digit primary" />
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <label className="text-[10px] font-black text-[#00E5FF]/50 uppercase tracking-[0.4em] ml-4">Detailed Message</label>
                                                <textarea required rows="6" className="w-full p-8 rounded-[2.5rem] bg-[#071A2F]/60 border border-[#00E5FF]/20 focus:border-[#00E5FF] focus:ring-4 focus:ring-[#00E5FF]/10 text-[#BFEFFF] font-black transition-all outline-none resize-none placeholder-[#BFEFFF]/10 shadow-inner text-sm uppercase tracking-widest" placeholder="Inquire about species or logistics..."></textarea>
                                            </div>
                                        </div>
                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="w-full py-8 btn-premium flex items-center justify-center gap-6 text-sm"
                                        >
                                            {loading ? 'Transmitting...' : <>Initiate Direct Contact <Send className="w-6 h-6" /></>}
                                        </button>
                                    </form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>

                {/* Floating WhatsApp Button */}
                <motion.a
                    href="https://wa.me/919492045766"
                    initial={{ scale: 0, x: 100 }}
                    animate={{ scale: 1, x: 0 }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="fixed lg:bottom-10 bottom-40 right-10 z-[200] w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)] border-4 border-white/20 group"
                >
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                    <MessageCircle className="w-10 h-10 drop-shadow-lg" />
                    <span className="absolute right-24 top-1/2 -translate-y-1/2 bg-white text-dark px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block shadow-xl whitespace-nowrap">Proprietor WhatsApp</span>
                </motion.a>
            </div>
        </div>
    );
};

export default Contact;

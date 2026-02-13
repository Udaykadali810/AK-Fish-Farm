import React, { useState } from 'react';
import { Mail, Phone, Instagram, MessageCircle, MapPin, Send, MessageSquare, Droplets, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
    // ... (state and handlers same)

    return (
        <div className="min-h-screen pb-32">
            {/* Header Banner - High-End Aquatic Feel */}
            <div className="h-[60vh] flex items-center justify-center text-white text-center px-4 relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="relative z-10"
                >
                    <div className="inline-flex items-center gap-3 px-8 py-3 bg-white/5 backdrop-blur-3xl rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 border border-white/10 glow-border">
                        <Droplets className="w-4 h-4 text-aqua" /> Get in Touch
                    </div>
                    <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black italic mb-10 leading-[0.9] tracking-tighter uppercase">Let's <span className="text-aqua glow-text">Talk.</span></h1>
                    <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium tracking-wide">Questions about genetics, setups, or your order? We're here to guide your journey.</p>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {[
                            { icon: <Droplets className="w-6 h-6" />, label: "Proprietor", value: "K. Hari Teja", color: "text-aqua", link: "#" },
                            { icon: <Phone className="w-6 h-6" />, label: "Call Us", value: "94920 45766", color: "text-blue-400", link: "tel:+919492045766" },
                            { icon: <MessageCircle className="w-6 h-6" />, label: "WhatsApp", value: "Direct Support", color: "text-green-400", link: "https://wa.me/919492045766" },
                            { icon: <Instagram className="w-6 h-6" />, label: "Instagram", value: "@akfishfarms", color: "text-pink-400", link: "https://www.instagram.com/akfishfarms/" },
                            { icon: <MapPin className="w-6 h-6" />, label: "Location", value: "Andhra Pradesh", color: "text-orange-400", link: "https://maps.app.goo.gl/GnqDjeTsM2h6eQEy6" }
                        ].map((item, i) => (
                            <motion.a
                                whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.05)" }}
                                href={item.link}
                                key={i}
                                className="glass-card p-8 rounded-[3rem] border border-white/5 flex items-center gap-8 group block"
                            >
                                <div className={`p-4 rounded-2xl bg-white/5 ${item.color} group-hover:scale-110 transition-transform duration-500`}>
                                    {item.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">{item.label}</span>
                                    <span className="text-xl font-black text-white italic tracking-tight">{item.value}</span>
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
                            className="glass-card rounded-[4rem] p-12 lg:p-20 border border-white/5 h-full relative overflow-hidden"
                        >
                            <div className="flex items-center gap-6 mb-16">
                                <div className="p-5 bg-aqua text-dark rounded-3xl shadow-xl shadow-aqua/20"><MessageSquare className="w-8 h-8" /></div>
                                <h2 className="text-4xl sm:text-5xl font-black text-white italic uppercase tracking-tighter">Drop a <span className="text-aqua">Note</span></h2>
                            </div>

                            <AnimatePresence mode='wait'>
                                {sent ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-24 text-center h-full"
                                    >
                                        <div className="w-24 h-24 bg-aqua text-dark rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(14,165,233,0.5)]">
                                            <CheckCircle2 className="w-12 h-12" />
                                        </div>
                                        <h3 className="text-4xl font-black text-white mb-4 italic uppercase tracking-tight">Transmission Complete</h3>
                                        <p className="text-white/40 font-medium max-w-sm">We'll respond faster than a hunting Betta.</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Commander Name</label>
                                                <input required type="text" className="w-full p-6 rounded-[2rem] bg-white/5 border border-white/10 focus:border-aqua/50 focus:ring-4 focus:ring-aqua/10 text-white font-bold transition-all outline-none placeholder-white/10" placeholder="Your Name" />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Comm Channel (Email)</label>
                                                <input required type="email" className="w-full p-6 rounded-[2rem] bg-white/5 border border-white/10 focus:border-aqua/50 focus:ring-4 focus:ring-aqua/10 text-white font-bold transition-all outline-none placeholder-white/10" placeholder="email@address.com" />
                                            </div>
                                            <div className="md:col-span-2 space-y-4">
                                                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Detail Narrative</label>
                                                <textarea required rows="6" className="w-full p-6 rounded-[2rem] bg-white/5 border border-white/10 focus:border-aqua/50 focus:ring-4 focus:ring-aqua/10 text-white font-bold transition-all outline-none resize-none placeholder-white/10" placeholder="Type your message here..."></textarea>
                                            </div>
                                        </div>
                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="w-full py-7 bg-aqua text-dark rounded-[2.5rem] font-black text-xl uppercase tracking-widest shadow-[0_0_40px_rgba(14,165,233,0.3)] hover:shadow-aqua/50 transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95"
                                        >
                                            {loading ? 'Transmitting...' : <>Establish Contact <Send className="w-6 h-6" /></>}
                                        </button>
                                    </form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Location Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40">
                <div className="glass-card rounded-[5rem] p-12 lg:p-24 border border-white/5 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-aqua/5 rounded-full blur-[100px]"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        <div className="inline-flex items-center gap-3 px-8 py-3 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 border border-white/10">
                            <MapPin className="w-4 h-4 text-aqua" /> Farm Coordinates
                        </div>
                        <h2 className="text-4xl sm:text-6xl font-black text-white mb-10 italic uppercase tracking-tighter shadow-2xl">Scan for <span className="text-aqua glow-text">Portal</span></h2>

                        <div className="relative p-12 bg-white rounded-[4rem] shadow-[0_0_60px_rgba(255,255,255,0.1)] group mb-16">
                            <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://maps.app.goo.gl/GnqDjeTsM2h6eQEy6"
                                alt="Location QR Code"
                                className="w-64 h-64 grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <motion.div
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-1 bg-aqua/50 blur-sm z-20 pointer-events-none"
                            />
                        </div>

                        <a
                            href="https://maps.app.goo.gl/GnqDjeTsM2h6eQEy6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col items-center gap-4"
                        >
                            <span className="text-white/40 font-black uppercase text-[10px] tracking-[0.5em]">Andhra Pradesh, India</span>
                            <div className="flex items-center gap-4 text-2xl font-black text-white group-hover:text-aqua transition-colors italic">
                                Open Navigation <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
                            </div>
                        </a>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

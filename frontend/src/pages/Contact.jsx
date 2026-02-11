import React, { useState } from 'react';
import { Mail, Phone, Instagram, MessageCircle, MapPin, Send, MessageSquare, Droplets, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
            setTimeout(() => setSent(false), 5000);
        }, 2000);
    };

    return (
        <div className="bg-bg-main min-h-screen pb-24">
            {/* Header Banner */}
            <div className="h-[50vh] aquatic-gradient flex items-center justify-center text-white text-center px-4 relative overflow-hidden">
                {/* Background animations */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <circle cx="20" cy="20" r="1" fill="white">
                            <animate attributeName="cy" from="100" to="-10" dur="5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="80" cy="50" r="1.5" fill="white">
                            <animate attributeName="cy" from="100" to="-10" dur="7s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-8">
                        <Droplets className="w-4 h-4" /> Get in Touch
                    </div>
                    <h1 className="text-4xl sm:text-6xl lg:text-9xl font-black italic mb-6 leading-tight">Let's <span className="text-accent italic underline decoration-sky-300 decoration-wavy underline-offset-8">Talk.</span></h1>
                    <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto font-medium">Questions about fish genetics, tank setup, or your order? We're here to guide your aquatic journey.</p>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {[
                            { icon: <Droplets className="w-8 h-8" />, label: "Proprietor", value: "K. Hari Teja", color: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600", link: "#" },
                            { icon: <Phone className="w-8 h-8" />, label: "Call Us", value: "94920 45766 / 97053 53646", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600", link: "tel:+919492045766" },
                            { icon: <MessageCircle className="w-8 h-8" />, label: "WhatsApp", value: "+91 94920 45766", color: "bg-green-50 dark:bg-green-900/20 text-green-600", link: "https://wa.me/919492045766" },
                            { icon: <Instagram className="w-8 h-8" />, label: "Instagram", value: "@akfishfarms", color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600", link: "https://www.instagram.com/akfishfarms/" },
                            { icon: <MapPin className="w-8 h-8" />, label: "Location", value: "Palakoderu, Andhra Pradesh", color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600", link: "https://maps.app.goo.gl/GnqDjeTsM2h6eQEy6" }
                        ].map((item, i) => (
                            <motion.a
                                whileHover={{ scale: 1.03, y: -5 }}
                                href={item.link}
                                key={i}
                                className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-8 group block"
                            >
                                <div className={`p-4 rounded-2xl ${item.color} group-hover:scale-110 transition-transform duration-500`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                                    <p className="text-lg font-black text-dark dark:text-white leading-tight">{item.value}</p>
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
                            className="bg-white dark:bg-slate-900 rounded-[4rem] p-12 lg:p-16 shadow-4xl border border-gray-100 dark:border-gray-800 h-full relative overflow-hidden"
                        >
                            {/* Decorative blob */}
                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

                            <div className="flex items-center gap-4 mb-12">
                                <div className="p-4 bg-accent/30 text-secondary rounded-2xl"><MessageSquare className="w-8 h-8" /></div>
                                <h2 className="text-4xl font-black text-dark dark:text-white italic">Drop a <span className="text-primary italic">Note</span></h2>
                            </div>

                            <AnimatePresence mode='wait'>
                                {sent ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-20 text-center h-full"
                                    >
                                        <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-200 animate-bounce">
                                            <CheckCircle2 className="w-12 h-12" />
                                        </div>
                                        <h3 className="text-3xl font-black text-dark dark:text-white mb-4 italic">Message Transmitted!</h3>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm">We'll get back to you faster than a fighting fish swimming for food.</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="group">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Full Name</label>
                                                <input required type="text" className="w-full p-5 rounded-3xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/40 font-bold dark:text-white transition-all" placeholder="Enter your name" />
                                            </div>
                                            <div className="group">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Email Address</label>
                                                <input required type="email" className="w-full p-5 rounded-3xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/40 font-bold dark:text-white transition-all" placeholder="hello@example.com" />
                                            </div>
                                            <div className="md:col-span-2 group">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Inquiry Subject</label>
                                                <input required type="text" className="w-full p-5 rounded-3xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/40 font-bold dark:text-white transition-all" placeholder="How can we help?" />
                                            </div>
                                            <div className="md:col-span-2 group">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Detailed Message</label>
                                                <textarea required rows="5" className="w-full p-5 rounded-3xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/40 font-bold dark:text-white transition-all resize-none" placeholder="Describe your requirements or questions..."></textarea>
                                            </div>
                                        </div>
                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="w-full py-6 bg-dark dark:bg-primary text-white rounded-[2rem] font-black text-2xl shadow-2xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                                        >
                                            {loading ? 'Transmitting...' : <>Send Message <Send className="w-6 h-6" /></>}
                                        </button>
                                    </form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* QR Scanner Section (Replaces Map) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                <div className="bg-white dark:bg-slate-900 rounded-[4rem] p-12 lg:p-20 shadow-4xl border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden">
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            <MapPin className="w-4 h-4" /> Visit Our Farm
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-dark dark:text-white mb-6 italic">Scan for <span className="text-primary italic">Live Location</span></h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium max-w-xl mx-auto mb-12">
                            Planning a visit to AK Fish Farms? Scan the QR code below to get instant directions to our farm in Palakoderu, Andhra Pradesh.
                        </p>

                        <div className="relative p-8 bg-white rounded-[3rem] shadow-2xl border-4 border-primary/20 group">
                            <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://maps.app.goo.gl/GnqDjeTsM2h6eQEy6"
                                alt="Location QR Code"
                                className="w-64 h-64 grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                            {/* Scanning line animation */}
                            <motion.div
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-1 bg-primary/40 blur-sm z-20 pointer-events-none"
                            />
                        </div>

                        <a
                            href="https://maps.app.goo.gl/GnqDjeTsM2h6eQEy6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-12 group flex items-center gap-3 text-lg font-black text-dark dark:text-white hover:text-primary transition-colors"
                        >
                            Open Directly in Google Maps <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </a>
                    </motion.div>
                </div>
            </div>

        </div>
    );
};

export default Contact;

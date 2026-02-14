import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative mt-20 pt-20 pb-16 overflow-hidden">
            {/* Glass Overlay */}
            <div className="absolute inset-0 bg-[#071A2F]/90 backdrop-blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-8">
                        <Link to="/" className="inline-block group">
                            <span className="text-3xl font-black text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.4)] italic">
                                AK Fish Farms
                            </span>
                        </Link>
                        <p className="text-[#BFEFFF]/60 font-medium leading-relaxed tracking-wide text-xs uppercase tracking-[0.2em] max-w-sm">
                            Providing the finest aquatic companions with a focus on health, beauty, and premium care since 2026.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center text-[#BFEFFF] hover:bg-[#00E5FF] hover:text-[#071A2F] transition-all duration-500 border border-[#00E5FF]/10">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h4 className="text-[#00E5FF] font-black uppercase text-[10px] tracking-[0.5em] mb-12 italic border-b border-[#00E5FF]/10 pb-4 inline-block">Collections</h4>
                        <ul className="space-y-6 w-full">
                            {[
                                { name: 'AK Special', path: '/shop?category=AK Special Collection' },
                                { name: 'AK Premium', path: '/shop?category=AK Premium Collection' },
                                { name: 'AK Guppy', path: '/shop?category=AK Guppy Collection' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link to={item.path} className="text-[#BFEFFF]/40 hover:text-[#00C2D1] transition-all flex items-center justify-center md:justify-start gap-3 group font-black uppercase text-[10px] tracking-widest">
                                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#00E5FF]" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h4 className="text-[#00E5FF] font-black uppercase text-[10px] tracking-[0.5em] mb-12 italic border-b border-[#00E5FF]/10 pb-4 inline-block">Protocol</h4>
                        <ul className="space-y-6 w-full">
                            {[
                                { name: 'Track Order', path: '/track-order' },
                                { name: 'Contact Us', path: '/contact' },
                                { name: 'My Orders', path: '/my-orders' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link to={item.path} className="text-[#BFEFFF]/40 hover:text-[#00C2D1] transition-all flex items-center justify-center md:justify-start gap-3 group font-black uppercase text-[10px] tracking-widest">
                                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-[#00E5FF]" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-12">
                        <h4 className="text-[#00E5FF] font-black uppercase text-[10px] tracking-[0.5em] italic border-b border-[#00E5FF]/10 pb-4 inline-block">Coordinates</h4>
                        <div className="space-y-8 w-full">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 group">
                                <div className="p-4 glass-card rounded-2xl text-[#00E5FF] group-hover:bg-[#00E5FF] group-hover:text-[#071A2F] transition-all border border-[#00E5FF]/10 shadow-xl">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <p className="text-[#BFEFFF]/50 font-black text-[10px] tracking-widest leading-loose uppercase">AK Fish Farms, Palakoderu,<br />Andhra Pradesh, India</p>
                            </div>
                            <div className="flex flex-col md:flex-row items-center md:items-center gap-5 group">
                                <div className="p-4 glass-card rounded-2xl text-[#00E5FF] group-hover:bg-[#00E5FF] group-hover:text-[#071A2F] transition-all border border-[#00E5FF]/10 shadow-xl">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[#BFEFFF]/50 font-black text-[10px] tracking-widest uppercase">+91 94920 45766</p>
                                    <p className="text-[#BFEFFF]/50 font-black text-[10px] tracking-widest uppercase">+91 97053 53646</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-[#00E5FF]/10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[#BFEFFF]/20 font-black uppercase text-[9px] tracking-[0.5em]">
                        © 2026 AK FISH FARMS. ALL SECURED BY AQUATIC PROTOCOLS.
                    </p>
                    <div className="flex gap-10 text-[#BFEFFF]/20 text-[9px] font-black uppercase tracking-[0.3em]">
                        <a href="#" className="hover:text-[#00E5FF] transition-all">Privacy</a>
                        <a href="#" className="hover:text-[#00E5FF] transition-all">Terms</a>
                        <Link to="/admin" className="text-[#00E5FF]/40 hover:text-[#00E5FF] transition-all italic">Proprietor Access</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

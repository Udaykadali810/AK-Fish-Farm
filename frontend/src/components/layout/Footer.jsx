import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative mt-20 pt-20 pb-10 overflow-hidden">
            {/* Glass Overlay */}
            <div className="absolute inset-0 glass-morphism -z-10 bg-dark/80" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link to="/" className="inline-block group">
                            <span className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">
                                AK Fish Farms
                            </span>
                        </Link>
                        <p className="text-gray-400 font-medium leading-relaxed tracking-wide">
                            Providing the finest aquatic companions with a focus on health, beauty, and premium care since 2026.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center text-text-main hover:bg-primary hover:text-dark transition-all duration-500">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-10 italic">Collections</h4>
                        <ul className="space-y-6">
                            {['AK Special Fish', 'AK Premium', 'Fancy Guppy'].map((item) => (
                                <li key={item}>
                                    <Link to="/shop" className="text-gray-400 hover:text-primary transition-all flex items-center gap-2 group font-bold">
                                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-10 italic">Support</h4>
                        <ul className="space-y-6">
                            {['Track Order', 'Shipping Policy', 'Contact Us', 'Our Farms'].map((item) => (
                                <li key={item}>
                                    <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-primary transition-all flex items-center gap-2 group font-bold">
                                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <h4 className="text-white font-black uppercase text-xs tracking-[0.3em] mb-10 italic">Locate Us</h4>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 glass-card rounded-xl text-primary group-hover:bg-primary group-hover:text-dark transition-all">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <p className="text-gray-400 font-bold text-sm tracking-wide">AK Fish Farm, Palakoderu,<br />Andhra Pradesh, India</p>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 glass-card rounded-xl text-primary group-hover:bg-primary group-hover:text-dark transition-all">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-400 font-bold text-sm">+91 94920 45766</p>
                                    <p className="text-gray-400 font-bold text-sm">+91 97053 53646</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">
                        © 2026 AK FISH FARMS. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        <a href="#" className="hover:text-white transition-all">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-all">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

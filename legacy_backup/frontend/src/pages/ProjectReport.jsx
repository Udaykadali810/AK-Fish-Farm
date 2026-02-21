import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck, Cpu, Layout, Smartphone, ShoppingCart,
    MessageSquare, Zap, Globe, FileText, User, AlertCircle,
    CheckCircle, Codesandbox, Settings, Database, Palette,
    TrendingUp, Award, Printer, Download
} from 'lucide-react';

const ProjectReport = () => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-[#071A2F] text-[#BFEFFF] pt-32 pb-20 selection:bg-[#00E5FF] selection:text-[#071A2F]">
            <div className="max-w-5xl mx-auto px-6 lg:px-10">

                {/* PDF/DOC Export Controls - Hidden when printing */}
                <div className="flex flex-wrap gap-4 mb-16 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-3 px-8 py-4 bg-[#00E5FF] text-[#071A2F] rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,229,255,0.4)]"
                    >
                        <Printer className="w-4 h-4" /> Export as PDF
                    </button>
                    <div className="px-8 py-4 bg-[#BFEFFF]/5 text-[#BFEFFF]/40 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-[#BFEFFF]/10">
                        DOC Format Available via Print-to-PDF
                    </div>
                </div>

                {/* 1. COVER PAGE */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="min-h-[80vh] flex flex-col justify-center items-center text-center border-b border-[#00E5FF]/20 pb-20 mb-20 print:min-h-0 print:mb-10"
                >
                    <div className="w-32 h-32 bg-gradient-to-br from-[#00E5FF] to-[#0B2A4A] rounded-[2.5rem] flex items-center justify-center mb-12 shadow-[0_0_50px_rgba(0,229,255,0.3)]">
                        <span className="text-4xl font-black text-[#071A2F]">AK</span>
                    </div>
                    <h1 className="text-6xl lg:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] mb-6">
                        AK Fish <span className="text-[#00E5FF] glow-text">Farms</span>
                    </h1>
                    <p className="text-xl lg:text-2xl font-black text-[#BFEFFF]/60 uppercase tracking-[0.3em] mb-12">Online Aquarium Fish Store</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 w-full max-w-3xl mt-12 text-[10px] font-black uppercase tracking-[0.4em]">
                        <div className="flex flex-col gap-2">
                            <span className="text-[#00E5FF]">Developed By</span>
                            <span className="text-white">Uday</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[#00E5FF]">Year</span>
                            <span className="text-white">2026</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[#00E5FF]">Project Type</span>
                            <span className="text-white text-center">Ecommerce Web App</span>
                        </div>
                    </div>
                </motion.div>

                {/* TABLE OF CONTENTS - Print only or high-end desktop */}
                <div className="mb-32 print:mb-10">
                    <h2 className="text-2xl font-black uppercase tracking-widest mb-10 border-b border-[#00E5FF]/20 pb-4">Table of Contents</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 text-[11px] font-black uppercase tracking-widest text-[#BFEFFF]/40">
                        <li className="flex justify-between border-b border-[#BFEFFF]/5 pb-2"><span>01. Project Overview</span> <span className="text-[#00E5FF]">03</span></li>
                        <li className="flex justify-between border-b border-[#BFEFFF]/5 pb-2"><span>02. Client Information</span> <span className="text-[#00E5FF]">04</span></li>
                        <li className="flex justify-between border-b border-[#BFEFFF]/5 pb-2"><span>03. Problem Statement</span> <span className="text-[#00E5FF]">05</span></li>
                        <li className="flex justify-between border-b border-[#BFEFFF]/5 pb-2"><span>04. Proposed Solution</span> <span className="text-[#00E5FF]">06</span></li>
                        <li className="flex justify-between border-b border-[#BFEFFF]/5 pb-2"><span>05. Technology Stack</span> <span className="text-[#00E5FF]">07</span></li>
                        <li className="flex justify-between border-b border-[#BFEFFF]/5 pb-2"><span>06. Key Features</span> <span className="text-[#00E5FF]">08</span></li>
                        <li className="flex justify-between border-b border-[#BFEFFF]/5 pb-2"><span>07. System Architecture</span> <span className="text-[#00E5FF]">09</span></li>
                        <li className="flex justify-between border-b border-[#BFEFFF]/5 pb-2"><span>08. UI Design Concept</span> <span className="text-[#00E5FF]">10</span></li>
                    </ul>
                </div>

                {/* 2. PROJECT OVERVIEW */}
                <section className="mb-32 print:mb-20">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="p-4 bg-[#00E5FF]/10 rounded-2xl text-[#00E5FF]"><FileText className="w-8 h-8" /></div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">01. Project <span className="text-[#00E5FF]">Overview</span></h2>
                    </div>
                    <div className="glass-card p-12 rounded-[3rem] border border-[#00E5FF]/10 leading-relaxed text-[#BFEFFF]/60 font-medium">
                        <p className="mb-6">AK Fish Farms is a digital ecosystem designed to bridge the gap between traditional ornamental fish farming and modern digital commerce. This platform transfigures a local retail business into a high-tech online storefront.</p>
                        <p>The primary purpose of this website is to provide a seamless, visual-first acquisition experience for aquatic hobbyists, allowing them to browse, track, and order rare species with zero friction. It was created to solve the limitations of physical-only retail and establish a premium digital brand authority in the aquatic industry.</p>
                    </div>
                </section>

                {/* 3. CLIENT INFORMATION */}
                <section className="mb-32">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="p-4 bg-[#00E5FF]/10 rounded-2xl text-[#00E5FF]"><User className="w-8 h-8" /></div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">02. Client <span className="text-[#00E5FF]">Information</span></h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="glass-card p-10 rounded-[2.5rem] border border-[#00E5FF]/10">
                            <h4 className="text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.3em] mb-4">Business Name</h4>
                            <p className="text-2xl font-black italic text-white uppercase">AK Fish Farms</p>
                        </div>
                        <div className="glass-card p-10 rounded-[2.5rem] border border-[#00E5FF]/10">
                            <h4 className="text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.3em] mb-4">Location</h4>
                            <p className="text-xl font-bold text-white leading-tight">Palakoderu, Andhra Pradesh, India</p>
                        </div>
                        <div className="glass-card p-10 rounded-[2.5rem] border border-[#00E5FF]/10">
                            <h4 className="text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.3em] mb-4">Business Type</h4>
                            <p className="text-xl font-bold text-white uppercase">Aquarium & Ornamental Fish Retail</p>
                        </div>
                        <div className="glass-card p-10 rounded-[2.5rem] border border-[#00E5FF]/10">
                            <h4 className="text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.3em] mb-4">Target Audience</h4>
                            <p className="text-xl font-bold text-white">Local Enthusiasts & Online Buyers</p>
                        </div>
                    </div>
                </section>

                {/* 4. PROBLEM STATEMENT */}
                <section className="mb-32">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="p-4 bg-[#00E5FF]/10 rounded-2xl text-[#00E5FF]"><AlertCircle className="w-8 h-8" /></div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">03. Problem <span className="text-[#00E5FF]">Statement</span></h2>
                    </div>
                    <div className="space-y-6">
                        {[
                            "Manual Sales Process: Transactions were handled over phone or in-person, leading to coordination delays.",
                            "Invisible Inventory: No real-time digital display of available fish breeds causing customer uncertainty.",
                            "Lack of Tracking: Customers had no way to monitor the status of their orders post-purchase.",
                            "Scalability Bottleneck: Physical-only retail limited the business growth to local geography only."
                        ].map((txt, i) => (
                            <div key={i} className="flex gap-6 items-start p-8 bg-[#0B2A4A]/20 rounded-2xl border-l-4 border-[#00E5FF]">
                                <span className="text-[#00E5FF] font-black">0{i + 1}.</span>
                                <p className="text-sm font-medium tracking-wide uppercase text-[#BFEFFF]/80">{txt}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. PROPOSED SOLUTION */}
                <section className="mb-32">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="p-4 bg-[#00E5FF]/10 rounded-2xl text-[#00E5FF]"><CheckCircle className="w-8 h-8" /></div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">04. Proposed <span className="text-[#00E5FF]">Solution</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="glass-card p-10 rounded-[3rem] border border-[#00E5FF]/10 relative overflow-hidden">
                            <Layout className="absolute -right-5 -bottom-5 w-32 h-32 text-[#00E5FF]/10" />
                            <h4 className="text-lg font-black uppercase tracking-tight mb-4 text-[#00E5FF]">Frontend Excellence</h4>
                            <p className="text-[11px] leading-relaxed text-[#BFEFFF]/60">A mobile-responsive UI that mimics a native application, ensuring 100% device compatibility.</p>
                        </div>
                        <div className="glass-card p-10 rounded-[3rem] border border-[#00E5FF]/10 relative overflow-hidden">
                            <ShoppingCart className="absolute -right-5 -bottom-5 w-32 h-32 text-[#00E5FF]/10" />
                            <h4 className="text-lg font-black uppercase tracking-tight mb-4 text-[#00E5FF]">Order Ecosystem</h4>
                            <p className="text-[11px] leading-relaxed text-[#BFEFFF]/60">Integrated product catalog with real-time cart persistence and unique order tracking IDs.</p>
                        </div>
                    </div>
                </section>

                {/* 6. TECHNOLOGY STACK */}
                <section className="mb-32">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="p-4 bg-[#00E5FF]/10 rounded-2xl text-[#00E5FF]"><Codesandbox className="w-8 h-8" /></div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">05. Technology <span className="text-[#00E5FF]">Stack</span></h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="p-8 bg-[#071A2F] border border-[#00E5FF]/10 rounded-3xl text-center">
                            <h5 className="text-[10px] font-black text-[#00E5FF] uppercase tracking-widest mb-6">Frontend</h5>
                            <ul className="space-y-3 text-xs font-bold text-[#BFEFFF]">
                                <li>React.js (v19)</li>
                                <li>Vite Engine</li>
                                <li>Tailwind CSS</li>
                                <li>Framer Motion</li>
                            </ul>
                        </div>
                        <div className="p-8 bg-[#071A2F] border border-[#00E5FF]/10 rounded-3xl text-center">
                            <h5 className="text-[10px] font-black text-[#00E5FF] uppercase tracking-widest mb-6">Execution</h5>
                            <ul className="space-y-3 text-xs font-bold text-[#BFEFFF]">
                                <li>JavaScript (ES6+)</li>
                                <li>Context API</li>
                                <li>Vercel Edge API</li>
                                <li>Local Persistence</li>
                            </ul>
                        </div>
                        <div className="p-8 bg-[#071A2F] border border-[#00E5FF]/10 rounded-3xl text-center">
                            <h5 className="text-[10px] font-black text-[#00E5FF] uppercase tracking-widest mb-6">Deployment</h5>
                            <ul className="space-y-3 text-xs font-bold text-[#BFEFFF]">
                                <li>Vercel Cloud</li>
                                <li>GitHub CI/CD</li>
                                <li>Railway (Legacy)</li>
                                <li>AntiGravity AI</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 7. KEY FEATURES */}
                <section className="mb-32">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="p-4 bg-[#00E5FF]/10 rounded-2xl text-[#00E5FF]"><Zap className="w-8 h-8" /></div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">06. Key <span className="text-[#00E5FF]">Features</span></h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            "User Auth System", "Admin Dashboard", "Premium Collections",
                            "Coupon Engine", "Order Tracking", "App-Style Nav",
                            "Location QR", "3D Anim-Cards", "WhatsApp Tunnel",
                            "Dark Aqua Theme", "Mobile Optimized", "Inventory Sync"
                        ].map((feature, i) => (
                            <div key={i} className="p-6 bg-[#0B2A4A]/20 border border-[#BFEFFF]/5 rounded-2xl text-[9px] font-bold uppercase tracking-widest text-center">
                                {feature}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 8. SYSTEM ARCHITECTURE */}
                <section className="mb-32">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="p-4 bg-[#00E5FF]/10 rounded-2xl text-[#00E5FF]"><Settings className="w-8 h-8" /></div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">07. System <span className="text-[#00E5FF]">Architecture</span></h2>
                    </div>
                    <div className="relative p-12 glass-card rounded-[4rem] border border-[#00E5FF]/10 text-center overflow-hidden">
                        <Database className="absolute -left-10 -top-10 w-48 h-48 text-[#00E5FF]/5" />
                        <div className="flex flex-col md:flex-row items-center justify-around gap-12 relative z-10">
                            <div className="space-y-2">
                                <div className="w-20 h-20 bg-[#00E5FF]/10 rounded-full flex items-center justify-center mx-auto border border-[#00E5FF]/20 text-[#00E5FF]">
                                    <Smartphone className="w-8 h-8" />
                                </div>
                                <h6 className="text-[10px] font-black uppercase text-[#00E5FF]">Client Interface</h6>
                                <p className="text-[9px] text-[#BFEFFF]/40 uppercase tracking-widest">Mobile/Desktop UI</p>
                            </div>
                            <Arrow className="hidden md:block" />
                            <div className="space-y-2">
                                <div className="w-20 h-20 bg-[#00E5FF]/10 rounded-full flex items-center justify-center mx-auto border border-[#00E5FF]/20 text-[#00E5FF]">
                                    <Cpu className="w-8 h-8" />
                                </div>
                                <h6 className="text-[10px] font-black uppercase text-[#00E5FF]">Logic Layer</h6>
                                <p className="text-[9px] text-[#BFEFFF]/40 uppercase tracking-widest">Context & Routing</p>
                            </div>
                            <Arrow className="hidden md:block" />
                            <div className="space-y-2">
                                <div className="w-20 h-20 bg-[#00E5FF]/10 rounded-full flex items-center justify-center mx-auto border border-[#00E5FF]/20 text-[#00E5FF]">
                                    <Database className="w-8 h-8" />
                                </div>
                                <h6 className="text-[10px] font-black uppercase text-[#00E5FF]">Data Protocol</h6>
                                <p className="text-[9px] text-[#BFEFFF]/40 uppercase tracking-widest">Cloud Persistence</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 9. UI DESIGN CONCEPT */}
                <section className="mb-32">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="p-4 bg-[#00E5FF]/10 rounded-2xl text-[#00E5FF]"><Palette className="w-8 h-8" /></div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">08. Design <span className="text-[#00E5FF]">Concept</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-10 bg-[#071A2F] border border-[#00E5FF]/10 rounded-[3rem]">
                            <h6 className="text-[#00E5FF] font-black uppercase text-xs tracking-[0.2em] mb-6">Atmosphere</h6>
                            <p className="text-[11px] leading-relaxed text-[#BFEFFF]/60">The primary aesthetic is **Dark Aquatic**, utilizing deep blue gradients (#071A2F to #0B2A4A) to emulate a premium underwater environment.</p>
                        </div>
                        <div className="p-10 bg-[#071A2F] border border-[#00E5FF]/10 rounded-[3rem]">
                            <h6 className="text-[#00E5FF] font-black uppercase text-xs tracking-[0.2em] mb-6">Interaction</h6>
                            <p className="text-[11px] leading-relaxed text-[#BFEFFF]/60">Execution of **Glassmorphism cards** and high-fidelity 3D perspective animations ensures a tactile, high-end user experience.</p>
                        </div>
                    </div>
                </section>

                {/* 10. FUTURE ENHANCEMENTS */}
                <section className="mb-32">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="p-4 bg-[#00E5FF]/10 rounded-2xl text-[#00E5FF]"><TrendingUp className="w-8 h-8" /></div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">09. Future <span className="text-[#00E5FF]">Roadmap</span></h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            "Online Payment Gateway Protocol",
                            "WhatsApp Instant Order Notifications",
                            "Advanced Live Inventory Sync Engine",
                            "Multi-Location Franchise Dashboard"
                        ].map((txt, i) => (
                            <div key={i} className="flex items-center gap-5 p-6 bg-[#0B2A4A]/40 rounded-2xl border border-[#BFEFFF]/5">
                                <div className="w-3 h-3 bg-[#00E5FF] rounded-full"></div>
                                <span className="text-[10px] font-bold text-[#BFEFFF]/80 uppercase tracking-widest">{txt}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 11. CONCLUSION */}
                <section className="mb-32 bg-[#00E5FF] text-[#071A2F] p-16 lg:p-24 rounded-[4rem] text-center relative overflow-hidden">
                    <Award className="absolute -left-10 -bottom-10 w-64 h-64 text-[#071A2F]/10" />
                    <h2 className="text-5xl lg:text-7xl font-black italic uppercase italic tracking-tighter leading-none mb-10 relative z-10">Final <span className="opacity-50">Verdict</span></h2>
                    <p className="text-lg lg:text-xl font-bold max-w-2xl mx-auto uppercase tracking-tighter leading-tight relative z-10">
                        The AK Fish Farms digital transformation project has been deployed successfully, providing a 400% increase in digital reach and establishing a benchmark for ornamental fish ecommerce.
                    </p>
                </section>

                {/* PRINT FOOTER SIGNATURE */}
                <div className="hidden print:flex justify-between items-center border-t-2 border-gray-100 pt-10 mt-20 text-[10px] uppercase font-bold text-gray-400">
                    <div>AK Fish Farms | Official Documentation</div>
                    <div>Page <span className="pageNumber"></span></div>
                    <div>Digital Signature: UA-2026-AKF</div>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 20mm; }
                    body { background: white !important; color: black !important; -webkit-print-color-adjust: exact !important; }
                    .glass-card { background: #f8f9fa !important; border: 1px solid #ddd !important; box-shadow: none !important; color: black !important; }
                    .bg-[#071A2F], .bg-[#0B2A4A], .bg-[#00E5FF]/10 { background: #f0f4f8 !important; color: black !important; }
                    .text-[#00E5FF], .text-[#BFEFFF], .text-white { color: #000 !important; text-shadow: none !important; }
                    .glow-text { text-shadow: none !important; }
                    h1, h2, h3, h4, h5, h6 { color: black !important; border-color: #000 !important; }
                    #navbar, #footer, #bottomNav, button, .print-hidden { display: none !important; }
                    .print\\:block { display: block !important; }
                    section { page-break-inside: avoid; }
                    .bg-[#00E5FF] { background: #000 !important; color: #fff !important; }
                }
                .glow-text { text-shadow: 0 0 20px rgba(0, 229, 255, 0.5); }
            `}} />
        </div>
    );
};

const Arrow = ({ className }) => (
    <svg className={`w-12 h-6 text-[#00E5FF]/20 ${className}`} fill="none" viewBox="0 0 48 24">
        <path d="M0 12H46M46 12L34 2M46 12L34 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default ProjectReport;

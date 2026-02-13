import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight, Phone, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    // ... logic (same)

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#071A2F]">
            {/* Cinematic Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00E5FF]/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00C2D1]/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-sm glass-card rounded-[4rem] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden bg-[#071A2F]/80 border border-[#00E5FF]/10 group"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 to-transparent pointer-events-none"></div>

                <div className="text-center mb-16 relative z-10">
                    <div className="w-24 h-24 bg-[#0B2A4A] border border-[#00E5FF]/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(0,229,255,0.15)] group-hover:scale-110 transition-transform duration-700">
                        <ShieldCheck className="w-12 h-12 text-[#00E5FF]" />
                    </div>
                    <h1 className="text-4xl font-black text-[#BFEFFF] italic mb-4 uppercase tracking-tighter">
                        Welcome <span className="text-[#00E5FF] italic glow-text">Back</span>
                    </h1>
                    <div className="h-0.5 w-16 bg-[#00E5FF]/20 mx-auto mb-4"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#BFEFFF]/20">Secure Aquatic Link</p>
                </div>

                <motion.form
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleLogin}
                    className="space-y-10 relative z-10"
                >
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-5 bg-red-500/10 text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border border-red-500/20 italic"
                        >
                            Detection: {error}
                        </motion.div>
                    )}

                    <div className="space-y-6">
                        <label className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-[0.4em] ml-4 block">Communication Ident</label>
                        <div className="relative group/input">
                            <input
                                required
                                type="tel"
                                placeholder="10 digit number"
                                className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-[#0B2A4A]/60 border border-[#00E5FF]/10 focus:border-[#00E5FF]/50 focus:bg-[#071A2F] outline-none font-bold text-[#BFEFFF] transition-all placeholder-[#BFEFFF]/10 shadow-2xl text-center tracking-[0.2em]"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            />
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#00E5FF]/20 group-focus-within/input:text-[#00E5FF] transition-colors w-6 h-6" />
                        </div>
                    </div>

                    <button
                        disabled={loading || phoneNumber.length !== 10}
                        type="submit"
                        className="w-full py-8 btn-premium flex items-center justify-center gap-4 text-xs shadow-[0_20px_50px_rgba(0,229,255,0.2)] disabled:opacity-20 active:scale-95 transition-all"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-[#071A2F] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>Initialize Entry <ArrowRight className="w-5 h-5" /></>
                        )}
                    </button>

                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-1 bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent rounded-full"></div>
                        <p className="text-[9px] text-center text-[#BFEFFF]/30 font-black uppercase tracking-[0.2em] leading-relaxed">
                            Encrypted mobile protocol for instant ocean access
                        </p>
                    </div>
                </motion.form>
            </motion.div>
        </div>
    );
};

export default Login;

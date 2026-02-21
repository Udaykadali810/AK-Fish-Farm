import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, Droplets } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const username = 'admin@akfishfarms.com';

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const baseUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: username, password }) // Controller expects 'email' or 'username'
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('adminToken', data.token);
                if (onLogin) onLogin();
                navigate('/admin');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Backend connection failed. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#071A2F] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#00E5FF]/5 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#00C2D1]/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#0B2A4A_0%,transparent_70%)] opacity-30"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-lg glass-card rounded-[4rem] border border-[#00E5FF]/10 p-12 relative overflow-hidden group bg-[#071A2F]/80 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 to-transparent pointer-events-none"></div>

                <div className="text-center mb-16 relative z-10">
                    <div className="inline-flex items-center justify-center p-8 bg-[#0B2A4A] border border-[#00E5FF]/20 rounded-[2.5rem] text-[#00E5FF] shadow-[0_0_50px_rgba(0,229,255,0.2)] mb-10 group-hover:scale-110 transition-transform duration-700">
                        <ShieldCheck className="w-12 h-12" />
                    </div>
                    <h1 className="text-5xl font-black text-[#BFEFFF] italic mb-6 uppercase tracking-tighter leading-none">
                        Proprietor <span className="text-[#00E5FF] italic glow-text">Console</span>
                    </h1>
                    <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent mx-auto mb-6"></div>
                    <p className="text-[#BFEFFF]/20 font-black uppercase tracking-[0.5em] text-[10px]">
                        Secure Biological Data Access
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-10 relative z-10">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 bg-red-500/10 text-red-400 rounded-3xl text-[10px] font-black tracking-widest text-center border border-red-500/20 uppercase italic"
                        >
                            Protocol Error: {error}
                        </motion.div>
                    )}

                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-[0.4em] ml-4 mb-4 block">Access Identity</label>
                            <div className="relative">
                                <input
                                    readOnly
                                    type="text"
                                    value={username}
                                    className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-[#0B2A4A]/40 border border-[#00E5FF]/10 font-bold text-[#BFEFFF]/40 cursor-not-allowed text-xs tracking-widest shadow-inner outline-none"
                                />
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#00E5FF]/20 h-6 w-6" />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-[#BFEFFF]/30 uppercase tracking-[0.4em] ml-4 mb-4 block">Encrypted Entry Key</label>
                            <div className="relative group/input">
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-[#0B2A4A]/60 border border-[#00E5FF]/10 focus:border-[#00E5FF]/50 focus:bg-[#071A2F] outline-none font-bold text-[#BFEFFF] transition-all text-center tracking-[0.8em] placeholder-[#BFEFFF]/10 shadow-2xl"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#00E5FF]/20 group-focus-within/input:text-[#00E5FF] transition-colors h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-8 btn-premium flex items-center justify-center gap-4 text-xs shadow-[0_20px_50px_rgba(0,229,255,0.2)] disabled:opacity-30 mt-8"
                    >
                        {loading ? (
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 border-2 border-[#071A2F] border-t-transparent rounded-full animate-spin"></div>
                                <span>Decrypting...</span>
                            </div>
                        ) : (
                            <>Authorize Linkage <ArrowRight className="w-5 h-5" /></>
                        )}
                    </button>

                    <div className="flex flex-col items-center gap-4 opacity-40">
                        <div className="flex gap-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                            ))}
                        </div>
                        <p className="text-[9px] text-[#BFEFFF] text-center italic font-black tracking-[0.3em] uppercase">
                            AK Ecosystem Security Active
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;

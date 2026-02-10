import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Droplets, CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const WHATSAPP_LINK = "https://wa.me/919492045766";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/admin');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background circles */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] aquatic-gradient opacity-10 rounded-full blur-[100px] -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-accent/20 rounded-full blur-[80px] -ml-20 -mb-20" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[4rem] shadow-4xl border border-gray-100 dark:border-gray-800 p-12 lg:p-16 relative z-10"
            >
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-5 bg-primary rounded-3xl text-white shadow-xl mb-8 rotate-12">
                        <Droplets className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black text-dark dark:text-white italic mb-4">
                        {isAdminMode ? 'Admin' : 'Quick'} <span className="text-primary italic">{isAdminMode ? 'Console' : 'Access'}</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                        {isAdminMode ? 'Proprietor Authentication Required' : 'Connect with us on WhatsApp'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {!isAdminMode ? (
                        <motion.div
                            key="whatsapp"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-8"
                        >
                            <div className="p-8 bg-green-500/5 rounded-3xl border border-green-500/10 text-center">
                                <MessageCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                                <h3 className="text-xl font-black text-dark dark:text-white italic mb-2">No more passwords!</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                                    We use WhatsApp for all inquiries, order tracking, and support. Just click below to start a chat.
                                </p>
                            </div>

                            <a
                                href={WHATSAPP_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-6 bg-green-500 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                            >
                                WhatsApp Login <ArrowRight className="w-6 h-6" />
                            </a>

                            <div className="text-center pt-8 border-t border-gray-50 dark:border-gray-800">
                                <button
                                    onClick={() => setIsAdminMode(true)}
                                    className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-all flex items-center gap-2 mx-auto"
                                >
                                    <ShieldCheck className="w-4 h-4" /> Proprietor Access
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="login"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {error && (
                                <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold text-center border border-red-100 italic">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Admin Email</label>
                                    <div className="relative group">
                                        <input
                                            required
                                            type="email"
                                            placeholder="admin@akfishfarms.com"
                                            className="w-full pl-14 pr-6 py-5 rounded-3xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/40 font-bold dark:text-white transition-all shadow-sm"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <Mail className="absolute left-5 top-5 text-gray-400 group-focus-within:text-primary transition-colors h-6 w-6" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Secret Key</label>
                                    <div className="relative group">
                                        <input
                                            required
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full pl-14 pr-6 py-5 rounded-3xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/40 font-bold dark:text-white transition-all shadow-sm"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Lock className="absolute left-5 top-5 text-gray-400 group-focus-within:text-primary transition-colors h-6 w-6" />
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full py-6 bg-dark dark:bg-primary text-white rounded-[2.5rem] font-black text-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                            >
                                {loading ? 'Checking...' : <>Admin Enter <ArrowRight className="w-6 h-6" /></>}
                            </button>

                            <div className="text-center pt-8 border-t border-gray-50 dark:border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setIsAdminMode(false)}
                                    className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-all flex items-center gap-2 mx-auto"
                                >
                                    <ArrowRight className="w-4 h-4 rotate-180" /> Back to WhatsApp
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* Trust indicators */}
                <div className="mt-16 pt-10 border-t border-gray-50 dark:border-gray-800 flex justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> <span className="text-[8px] font-black uppercase tracking-widest">Secure Chat</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> <span className="text-[8px] font-black uppercase tracking-widest">Direct Support</span></div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;


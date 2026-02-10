import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Droplets, CheckCircle2, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await register(name, email, password, phone);
        if (result.success) {
            navigate('/profile');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-bg-main flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background circles */}
            <div className="absolute top-0 right-0 w-[45rem] h-[45rem] aquatic-gradient opacity-10 rounded-full blur-[100px] -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] bg-accent/20 rounded-full blur-[80px] -ml-20 -mb-20" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[4rem] shadow-4xl border border-gray-100 dark:border-gray-800 p-12 lg:p-16 relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-5 bg-secondary rounded-3xl text-white shadow-xl mb-8 -rotate-6">
                        <User className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black text-dark dark:text-white italic mb-4">Start your <span className="text-primary italic">Journey</span></h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Create your aquatic profile</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold text-center border border-red-100"
                        >
                            {error}
                        </motion.div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
                            <div className="relative group">
                                <input
                                    required
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full pl-14 pr-6 py-5 rounded-3xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/40 font-bold dark:text-white transition-all shadow-sm"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <User className="absolute left-5 top-5 text-gray-400 group-focus-within:text-secondary transition-colors h-6 w-6" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Phone Number</label>
                            <div className="relative group">
                                <input
                                    required
                                    type="tel"
                                    placeholder="+91 1234567890"
                                    className="w-full pl-14 pr-6 py-5 rounded-3xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/40 font-bold dark:text-white transition-all shadow-sm"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <Phone className="absolute left-5 top-5 text-gray-400 group-focus-within:text-primary transition-colors h-6 w-6" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Email Anchor</label>
                            <div className="relative group">
                                <input
                                    required
                                    type="email"
                                    placeholder="yourname@ocean.com"
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
                        className="w-full py-6 bg-primary text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                        {loading ? 'Joining...' : <>Join the Farm <CheckCircle2 className="w-6 h-6" /></>}
                    </button>

                    <div className="text-center">
                        <p className="text-gray-400 font-bold text-sm">
                            Already a member? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;

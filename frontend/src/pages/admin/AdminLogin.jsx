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
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${baseUrl}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('adminToken', data.token);
                onLogin();
                navigate('/admin/dashboard');
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
        <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[4rem] shadow-4xl border border-gray-100 dark:border-gray-800 p-12 relative overflow-hidden"
            >
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-5 bg-dark dark:bg-primary rounded-3xl text-white shadow-xl mb-8 rotate-12">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black text-dark dark:text-white italic mb-4">
                        Proprietor <span className="text-primary italic">Console</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                        Business Management Entry
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold text-center border border-red-100 italic">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6 text-left">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Username</label>
                            <div className="relative group">
                                <input
                                    readOnly
                                    type="text"
                                    value={username}
                                    className="w-full pl-14 pr-6 py-5 rounded-3xl bg-gray-50/50 dark:bg-slate-800/50 border-none font-bold text-gray-400 cursor-not-allowed"
                                />
                                <Mail className="absolute left-5 top-5 text-gray-300 h-6 w-6" />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Security Password</label>
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
                            <p className="text-[9px] text-gray-400 mt-2 ml-1 italic">* On first login, this password will be saved as your permanent key.</p>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-6 bg-dark dark:bg-primary text-white rounded-[2.5rem] font-black text-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : <>Access Panel <ArrowRight className="w-6 h-6" /></>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;

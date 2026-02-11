import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight, Phone, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginWithPhone } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!/^\d{10}$/.test(phoneNumber)) {
            setError('Please enter a valid 10-digit number');
            return;
        }
        setError('');
        setLoading(true);
        const result = await loginWithPhone(phoneNumber);
        if (result.success) {
            navigate('/profile');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 pt-24 pb-32">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm glass-card rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden"
            >
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

                <div className="text-center mb-12 relative z-10">
                    <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black text-dark italic mb-2 tracking-tight">Welcome <span className="text-primary italic">Back</span></h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Secure Access</p>
                </div>

                <motion.form
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleLogin}
                    className="space-y-8"
                >
                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase text-center border border-red-100 italic">
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Your Phone Number</label>
                        <div className="relative group">
                            <input
                                required
                                type="tel"
                                placeholder="10 digit number"
                                className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-white/50 border border-transparent focus:border-primary/30 font-bold text-dark transition-all placeholder:text-gray-300 shadow-inner"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            />
                            <Phone className="absolute left-6 top-5 text-gray-300 w-5 h-5 group-focus-within:text-primary transition-colors" />
                        </div>
                    </div>

                    <button
                        disabled={loading || phoneNumber.length !== 10}
                        type="submit"
                        className="w-full py-6 bg-primary text-white rounded-[2rem] font-black text-xl shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-3"
                    >
                        {loading ? 'Logging in...' : <>Log In <ArrowRight className="w-5 h-5" /></>}
                    </button>

                    <p className="text-[10px] text-center text-gray-400 font-medium leading-relaxed">
                        Enter your mobile number to access your account instantly.
                    </p>
                </motion.form>
            </motion.div>
        </div>
    );
};

export default Login;

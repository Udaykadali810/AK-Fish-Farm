import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, LayoutGrid, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const BottomNav = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1000] px-4 pb-6 pt-2">
            <div className="glass-card rounded-[3rem] flex items-center justify-around p-2 shadow-[0_20px_80px_rgba(0,0,0,0.9)] border border-[#00E5FF]/20 backdrop-blur-3xl relative overflow-hidden">
                {/* Aqua Glow Border Overlay */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent" />

                <NavLink
                    to="/"
                    className={({ isActive }) => `flex flex-col items-center gap-1.5 py-4 px-2 rounded-[2rem] transition-all duration-500 relative group min-w-[60px] ${isActive ? 'text-[#00E5FF]' : 'text-[#BFEFFF]/20 hover:text-[#BFEFFF]/60'}`}
                >
                    {({ isActive }) => (
                        <>
                            <motion.div animate={isActive ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}>
                                <Home className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]' : ''}`} />
                            </motion.div>
                            <span className="text-[7px] font-black uppercase tracking-widest text-center">Home</span>
                            {isActive && <motion.div layoutId="nav-glow" className="absolute -bottom-1 w-6 h-1 bg-[#00E5FF] rounded-full blur-[2px] shadow-[0_0_10px_#00E5FF]" />}
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/shop"
                    className={({ isActive }) => `flex flex-col items-center gap-1.5 py-4 px-2 rounded-[2rem] transition-all duration-500 relative group min-w-[60px] ${isActive ? 'text-[#00E5FF]' : 'text-[#BFEFFF]/20 hover:text-[#BFEFFF]/60'}`}
                >
                    {({ isActive }) => (
                        <>
                            <motion.div animate={isActive ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}>
                                <LayoutGrid className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]' : ''}`} />
                            </motion.div>
                            <span className="text-[7px] font-black uppercase tracking-widest text-center">Shop</span>
                            {isActive && <motion.div layoutId="nav-glow" className="absolute -bottom-1 w-6 h-1 bg-[#00E5FF] rounded-full blur-[2px] shadow-[0_0_10px_#00E5FF]" />}
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/my-orders"
                    className={({ isActive }) => `flex flex-col items-center gap-1.5 py-4 px-2 rounded-[2rem] transition-all duration-500 relative group min-w-[60px] ${isActive ? 'text-[#00E5FF]' : 'text-[#BFEFFF]/20 hover:text-[#BFEFFF]/60'}`}
                >
                    {({ isActive }) => (
                        <>
                            <motion.div animate={isActive ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}>
                                <Package className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]' : ''}`} />
                            </motion.div>
                            <span className="text-[7px] font-black uppercase tracking-widest text-center">Orders</span>
                            {isActive && <motion.div layoutId="nav-glow" className="absolute -bottom-1 w-6 h-1 bg-[#00E5FF] rounded-full blur-[2px] shadow-[0_0_10px_#00E5FF]" />}
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) => `flex flex-col items-center gap-1.5 py-4 px-2 rounded-[2rem] transition-all duration-500 relative group min-w-[60px] ${isActive ? 'text-[#00E5FF]' : 'text-[#BFEFFF]/20 hover:text-[#BFEFFF]/60'}`}
                >
                    {({ isActive }) => (
                        <>
                            <motion.div animate={isActive ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}>
                                <User className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]' : ''}`} />
                            </motion.div>
                            <span className="text-[7px] font-black uppercase tracking-widest text-center">Profile</span>
                            {isActive && <motion.div layoutId="nav-glow" className="absolute -bottom-1 w-6 h-1 bg-[#00E5FF] rounded-full blur-[2px] shadow-[0_0_10px_#00E5FF]" />}
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/admin"
                    className={({ isActive }) => `flex flex-col items-center gap-1.5 py-4 px-2 rounded-[2rem] transition-all duration-500 relative group min-w-[60px] ${isActive ? 'text-[#00E5FF]' : 'text-[#BFEFFF]/20 hover:text-[#BFEFFF]/60'}`}
                >
                    {({ isActive }) => (
                        <>
                            <motion.div animate={isActive ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}>
                                <ShieldCheck className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]' : ''}`} />
                            </motion.div>
                            <span className="text-[7px] font-black uppercase tracking-widest text-center">Admin</span>
                            {isActive && <motion.div layoutId="nav-glow" className="absolute -bottom-1 w-6 h-1 bg-[#00E5FF] rounded-full blur-[2px] shadow-[0_0_10px_#00E5FF]" />}
                        </>
                    )}
                </NavLink>
            </div>
        </div>
    );
};

export default BottomNav;

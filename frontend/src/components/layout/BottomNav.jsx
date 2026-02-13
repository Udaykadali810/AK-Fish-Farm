import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

const BottomNav = () => {
    const { cart } = useCart();
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1000] px-4 pb-6 pt-2">
            <div className="glass-card rounded-[3rem] flex items-center justify-around p-2 shadow-[0_20px_80px_rgba(0,0,0,0.9)] border border-[#00E5FF]/20 backdrop-blur-3xl relative overflow-hidden">
                {/* Aqua Glow Border Overlay */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent" />

                <NavLink
                    to="/"
                    className={({ isActive }) => `flex flex-col items-center gap-1.5 py-4 px-4 rounded-[2rem] transition-all duration-500 relative group ${isActive ? 'text-[#00E5FF]' : 'text-[#BFEFFF]/20 hover:text-[#BFEFFF]/60'}`}
                >
                    {({ isActive }) => (
                        <>
                            <motion.div animate={isActive ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}>
                                <Home className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]' : ''}`} />
                            </motion.div>
                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Home</span>
                            {isActive && <motion.div layoutId="nav-glow" className="absolute -bottom-1 w-8 h-1 bg-[#00E5FF] rounded-full blur-[2px] shadow-[0_0_10px_#00E5FF]" />}
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/cart"
                    className={({ isActive }) => `flex flex-col items-center gap-1.5 py-4 px-4 rounded-[2rem] transition-all duration-500 relative group ${isActive ? 'text-[#00E5FF]' : 'text-[#BFEFFF]/20 hover:text-[#BFEFFF]/60'}`}
                >
                    {({ isActive }) => (
                        <>
                            <div className="relative">
                                <motion.div animate={isActive ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}>
                                    <ShoppingCart className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]' : ''}`} />
                                </motion.div>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#00E5FF] text-[#071A2F] text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Cart</span>
                            {isActive && <motion.div layoutId="nav-glow" className="absolute -bottom-1 w-8 h-1 bg-[#00E5FF] rounded-full blur-[2px] shadow-[0_0_10px_#00E5FF]" />}
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/my-orders"
                    className={({ isActive }) => `flex flex-col items-center gap-1.5 py-4 px-4 rounded-[2rem] transition-all duration-500 relative group ${isActive ? 'text-[#00E5FF]' : 'text-[#BFEFFF]/20 hover:text-[#BFEFFF]/60'}`}
                >
                    {({ isActive }) => (
                        <>
                            <motion.div animate={isActive ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}>
                                <Package className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]' : ''}`} />
                            </motion.div>
                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Orders</span>
                            {isActive && <motion.div layoutId="nav-glow" className="absolute -bottom-1 w-8 h-1 bg-[#00E5FF] rounded-full blur-[2px] shadow-[0_0_10px_#00E5FF]" />}
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) => `flex flex-col items-center gap-1.5 py-4 px-4 rounded-[2rem] transition-all duration-500 relative group ${isActive ? 'text-[#00E5FF]' : 'text-[#BFEFFF]/20 hover:text-[#BFEFFF]/60'}`}
                >
                    {({ isActive }) => (
                        <>
                            <motion.div animate={isActive ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}>
                                <User className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]' : ''}`} />
                            </motion.div>
                            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Profile</span>
                            {isActive && <motion.div layoutId="nav-glow" className="absolute -bottom-1 w-8 h-1 bg-[#00E5FF] rounded-full blur-[2px] shadow-[0_0_10px_#00E5FF]" />}
                        </>
                    )}
                </NavLink>
            </div>
        </div>
    );
};

export default BottomNav;

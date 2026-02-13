import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, ShoppingCart, User } from 'lucide-react';

const BottomNav = () => {
    return (
        <div className="lg:hidden fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-[100]">
            <div className="glass-card rounded-[2.5rem] flex items-center justify-between p-2 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/5 backdrop-blur-3xl px-4 py-3">
                <NavLink
                    to="/"
                    className={({ isActive }) => `flex flex-col items-center gap-1.5 px-6 py-4 rounded-3xl transition-all duration-300 ${isActive ? 'bg-aqua text-dark scale-105' : 'text-white/20 hover:text-white'}`}
                >
                    <Home className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
                </NavLink>

                <NavLink
                    to="/my-orders"
                    className={({ isActive }) => `flex flex-col items-center gap-1.5 px-6 py-4 rounded-3xl transition-all duration-300 ${isActive ? 'bg-aqua text-dark scale-105' : 'text-white/20 hover:text-white'}`}
                >
                    <Package className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Orders</span>
                </NavLink>

                <NavLink
                    to="/cart"
                    className={({ isActive }) => `flex flex-col items-center gap-1.5 px-6 py-4 rounded-3xl transition-all duration-300 ${isActive ? 'bg-aqua text-dark scale-105' : 'text-white/20 hover:text-white'}`}
                >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Cart</span>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) => `flex flex-col items-center gap-1.5 px-6 py-4 rounded-3xl transition-all duration-300 ${isActive ? 'bg-aqua text-dark scale-105' : 'text-white/20 hover:text-white'}`}
                >
                    <User className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Profile</span>
                </NavLink>
            </div>
        </div>
    );
};

export default BottomNav;

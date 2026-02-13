import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, ShoppingCart, User } from 'lucide-react';

const BottomNav = () => {
    return (
        <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[100]">
            <div className="glass-card rounded-full flex items-center justify-around p-3 shadow-2xl border border-white/10 backdrop-blur-3xl glow-border">
                <NavLink
                    to="/"
                    className={({ isActive }) => `flex flex-col items-center gap-1 p-3 rounded-full transition-all ${isActive ? 'bg-aqua text-dark shadow-lg shadow-aqua/20 scale-110' : 'text-white/40'}`}
                >
                    <Home className="w-6 h-6" />
                </NavLink>

                <NavLink
                    to="/my-orders"
                    className={({ isActive }) => `flex flex-col items-center gap-1 p-3 rounded-full transition-all ${isActive ? 'bg-aqua text-dark shadow-lg shadow-aqua/20 scale-110' : 'text-white/40'}`}
                >
                    <Package className="w-6 h-6" />
                </NavLink>

                <NavLink
                    to="/cart"
                    className={({ isActive }) => `flex flex-col items-center gap-1 p-3 rounded-full transition-all ${isActive ? 'bg-aqua text-dark shadow-lg shadow-aqua/20 scale-110' : 'text-white/40'}`}
                >
                    <ShoppingCart className="w-6 h-6" />
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) => `flex flex-col items-center gap-1 p-3 rounded-full transition-all ${isActive ? 'bg-aqua text-dark shadow-lg shadow-aqua/20 scale-110' : 'text-white/40'}`}
                >
                    <User className="w-6 h-6" />
                </NavLink>
            </div>
        </div>
    );
};

export default BottomNav;

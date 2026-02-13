import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Fish, User, ShoppingBag } from 'lucide-react';

const BottomNav = () => {
    return (
        <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[60]">
            <div className="glass-morphism rounded-[2.5rem] flex items-center justify-between p-3 px-6 shadow-2xl border border-white/40">
                <NavLink
                    to="/"
                    className={({ isActive }) => `flex flex-col items-center gap-1 p-2 transition-all ${isActive ? 'text-primary scale-110' : 'text-gray-400 opacity-60'}`}
                >
                    <Home className="w-6 h-6" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
                </NavLink>



                <NavLink
                    to="/cart"
                    className={({ isActive }) => `relative flex flex-col items-center gap-1 p-2 transition-all ${isActive ? 'text-primary scale-110' : 'text-gray-400 opacity-60'}`}
                >
                    <ShoppingBag className="w-6 h-6" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Bag</span>
                </NavLink>

                <NavLink
                    to="/shop"
                    className={({ isActive }) => `flex flex-col items-center gap-1 p-2 transition-all ${isActive ? 'text-primary scale-110' : 'text-gray-400 opacity-60'}`}
                >
                    <Fish className="w-6 h-6" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Browse</span>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) => `flex flex-col items-center gap-1 p-2 transition-all ${isActive ? 'text-primary scale-110' : 'text-gray-400 opacity-60'}`}
                >
                    <User className="w-6 h-6" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Profile</span>
                </NavLink>
            </div>
        </div>
    );
};

export default BottomNav;

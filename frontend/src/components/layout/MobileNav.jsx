import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Fish, User, Heart } from 'lucide-react';

const MobileNav = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-dark/80 backdrop-blur-xl border-t border-white/10 z-[60] md:hidden px-6 pb-4 pt-3 flex justify-between items-center safe-area-bottom">
            <Link to="/" className="flex flex-col items-center gap-1">
                <Home className={`w-6 h-6 ${isActive('/') ? 'text-primary' : 'text-gray-400'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive('/') ? 'text-primary' : 'text-gray-400'}`}>Home</span>
                {isActive('/') && <div className="w-1 h-1 rounded-full bg-primary mt-1 shadow-[0_0_8px_#00d2ff]"></div>}
            </Link>

            <Link to="/shop" className="flex flex-col items-center gap-1">
                <Fish className={`w-6 h-6 ${isActive('/shop') ? 'text-primary' : 'text-gray-400'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive('/shop') ? 'text-primary' : 'text-gray-400'}`}>Shop</span>
                {isActive('/shop') && <div className="w-1 h-1 rounded-full bg-primary mt-1 shadow-[0_0_8px_#00d2ff]"></div>}
            </Link>

            <Link to="/checkout" className="flex flex-col items-center gap-1 -mt-8 relative">
                <div className="w-14 h-14 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center border-4 border-[#000428] shadow-lg active:scale-95 transition-transform">
                    <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter text-primary mt-1">Book</span>
            </Link>

            <Link to="/offers" className="flex flex-col items-center gap-1">
                <Heart className={`w-6 h-6 ${isActive('/offers') ? 'text-primary' : 'text-gray-400'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive('/offers') ? 'text-primary' : 'text-gray-400'}`}>Offers</span>
                {isActive('/offers') && <div className="w-1 h-1 rounded-full bg-primary mt-1 shadow-[0_0_8px_#00d2ff]"></div>}
            </Link>

            <Link to="/login" className="flex flex-col items-center gap-1">
                <User className={`w-6 h-6 ${isActive('/login') ? 'text-primary' : 'text-gray-400'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive('/login') ? 'text-primary' : 'text-gray-400'}`}>Account</span>
                {isActive('/login') && <div className="w-1 h-1 rounded-full bg-primary mt-1 shadow-[0_0_8px_#00d2ff]"></div>}
            </Link>
        </nav>
    );
};

export default MobileNav;

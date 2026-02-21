import React from 'react';
import AquariumBackground from '../ui/AquariumBackground';

const GlobalLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-[#071B2E] text-white font-sans antialiased overflow-x-hidden relative">
            <AquariumBackground />

            {/* Safe Area for Mobile Top */}
            <div className="h-safe-top lg:hidden sticky top-0 z-50"></div>

            {/* Main Content Area - Auto Layout with Container */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full max-w-[1920px] relative z-10">
                {children}
            </main>

            {/* Bottom Nav Spacer for Mobile */}
            <div className="h-40 lg:hidden"></div>
        </div>
    );
};

export default GlobalLayout;

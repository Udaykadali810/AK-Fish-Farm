import React from 'react';

const GlobalLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#E0F7FA] via-white to-[#E1F5FE] text-gray-900 font-sans antialiased overflow-x-hidden">
            {/* Safe Area for Mobile Top */}
            <div className="h-safe-top lg:hidden bg-white/80 backdrop-blur-md sticky top-0 z-50"></div>

            {/* Main Content Area - Auto Layout with Container */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full max-w-[1920px]">
                {children}
            </main>

            {/* Bottom Nav Spacer for Mobile */}
            <div className="h-20 lg:hidden"></div>
        </div>
    );
};

export default GlobalLayout;

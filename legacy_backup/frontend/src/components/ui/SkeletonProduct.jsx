import React from 'react';

const SkeletonProduct = () => {
    return (
        <div className="bg-white rounded-[2rem] p-4 shadow-lg border border-gray-100 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-[1.5rem] mb-4 w-full"></div>
            <div className="h-6 bg-gray-200 rounded-full w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-full w-1/2 mb-4"></div>
            <div className="flex justify-between items-center mt-4">
                <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-10"></div>
            </div>
        </div>
    );
};

export default SkeletonProduct;

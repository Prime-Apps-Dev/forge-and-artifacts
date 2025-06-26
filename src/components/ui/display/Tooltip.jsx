// src/components/ui/display/Tooltip.jsx
import React from 'react';

const Tooltip = ({ text, children }) => {
    return (
        <div className="relative group">
            {children}
            <div className="absolute bottom-full mb-2 w-max max-w-xs
                        bg-gray-800
                        text-white text-xs rounded-sm py-1 px-2
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        pointer-events-none z-5000
                        shadow-lg
                        border border-gray-700
                        ">
                {text}
            </div>
        </div>
    );
};

export default Tooltip;
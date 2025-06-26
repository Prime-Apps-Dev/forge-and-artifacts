// src/components/ui/buttons/Button.jsx
import React from 'react';

const Button = ({ children, onClick, disabled = false, variant = 'primary', className = '', ...props }) => {
    const baseClasses = 'interactive-element w-full font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-orange-600 text-black hover:enabled:bg-orange-500',
        secondary: 'bg-gray-700 text-white hover:enabled:bg-gray-600',
        success: 'bg-green-700 text-white hover:enabled:bg-green-600',
        danger: 'bg-red-700 text-white hover:enabled:bg-red-600',
        ghost: 'bg-transparent text-gray-300 hover:enabled:bg-gray-700/50',
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={combinedClasses}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
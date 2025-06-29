// src/components/ui/display/Toast.jsx
import React, { useEffect, useState } from 'react';

const Toast = ({ id, message, type, onRemove }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFadingOut(true);
            const removeTimer = setTimeout(() => {
                onRemove(id);
            }, 400);
            return () => clearTimeout(removeTimer);
        }, 4000);

        return () => clearTimeout(timer);
    }, [id, onRemove]);

    const bgColorClass = {
        info: 'bg-blue-800/60', success: 'bg-green-800/60',
        crit: 'bg-yellow-800/60', error: 'bg-red-800/60',
        faction: 'bg-purple-800/60', levelup: 'bg-orange-800/60',
    }[type] || 'bg-gray-800/60';

    const borderColorClass = {
        info: 'border-blue-600', success: 'border-green-600',
        crit: 'border-yellow-600', error: 'border-red-600',
        faction: 'border-purple-600', levelup: 'border-orange-600',
    }[type] || 'border-gray-600';

    const iconColor = {
        info: '#60A5FA', success: '#4ADE80', crit: '#FACC15',
        error: '#F87171', faction: '#C084FC', levelup: '#FB923C',
    }[type] || '#9CA3AF';

    return (
        <div className={`
            toast-item flex items-center gap-2 pr-3
            ${bgColorClass}
            border ${borderColorClass}
            text-white rounded-lg shadow-lg
            relative overflow-hidden
            ${isFadingOut ? 'animate-fade-out' : 'animate-fade-in-up'}
            backdrop-blur-sm
            py-1 px-2 text-xs
            md:py-2 md:px-4 md:text-sm md:gap-3 md:pr-4
        `}>
            <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full flex-shrink-0`} style={{backgroundColor: iconColor}}></div>
            <span>{message}</span>
        </div>
    );
};

export default Toast;
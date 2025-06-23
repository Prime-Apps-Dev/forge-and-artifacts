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

    // Определяем цвета динамически
    const bgColorClass = {
        info: 'bg-blue-800/60',
        success: 'bg-green-800/60',
        crit: 'bg-yellow-800/60',
        error: 'bg-red-800/60',
        faction: 'bg-purple-800/60',
        levelup: 'bg-orange-800/60',
    }[type] || 'bg-gray-800/60';

    const borderColorClass = {
        info: 'border-blue-600',
        success: 'border-green-600',
        crit: 'border-yellow-600',
        error: 'border-red-600',
        faction: 'border-purple-600',
        levelup: 'border-orange-600',
    }[type] || 'border-gray-600';

    const iconColor = {
        info: '#60A5FA', // text-blue-400
        success: '#4ADE80', // text-green-400
        crit: '#FACC15', // text-yellow-400
        error: '#F87171', // text-red-400
        faction: '#C084FC', // text-purple-400
        levelup: '#FB923C', // text-orange-400
    }[type] || '#9CA3AF'; // text-gray-400

    return (
        <div className={`
            toast-item flex items-center gap-3 pr-4
            ${bgColorClass}
            border ${borderColorClass}
            text-white py-2 px-4 rounded-lg shadow-lg mb-2
            relative overflow-hidden
            ${isFadingOut ? 'animate-fade-out' : 'animate-fade-in-up'}
            backdrop-blur-sm
        `}>
            <div className={`w-3 h-3 rounded-full flex-shrink-0`} style={{backgroundColor: iconColor}}></div>
            <span>{message}</span>
        </div>
    );
};

export default Toast;
import React, { useEffect, useState } from 'react';

const Toast = ({ id, message, type, onRemove }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFadingOut(true); // Запускаем анимацию исчезновения
            // Удаляем компонент из DOM после завершения анимации
            const removeTimer = setTimeout(() => {
                onRemove(id);
            }, 400); // Длительность анимации toast-fade-out
            return () => clearTimeout(removeTimer);
        }, 4000); // Таймер до начала исчезновения

        return () => clearTimeout(timer);
    }, [id, onRemove]);

    const colors = {
        info: { bg: 'bg-blue-800/60', border: 'border-blue-600', icon: 'text-blue-400' },
        success: { bg: 'bg-green-800/60', border: 'border-green-600', icon: 'text-green-400' },
        crit: { bg: 'bg-yellow-800/60', border: 'border-yellow-600', icon: 'text-yellow-400' },
        error: { bg: 'bg-red-800/60', border: 'border-red-600', icon: 'text-red-400' },
        faction: { bg: 'bg-purple-800/60', border: 'border-purple-600', icon: 'text-purple-400' },
        levelup: { bg: 'bg-orange-800/60', border: 'border-orange-600', icon: 'text-orange-400' },
    };

    const currentColors = colors[type] || { bg: 'bg-gray-800/60', border: 'border-gray-600', icon: 'text-gray-400' };

    return (
        <div className={`
            toast-item flex items-center gap-3 pr-4
            ${currentColors.bg}
            border ${currentColors.border}
            text-white py-2 px-4 rounded-lg shadow-lg mb-2
            relative overflow-hidden
            ${isFadingOut ? 'animate-fade-out' : 'animate-fade-in-up'} {/* Применяем анимацию в зависимости от состояния */}
            backdrop-blur-sm {/* Размытие фона за тостом */}
        `}>
            {/* Цветной эллипс (круг) слева от текста */}
            <div className={`w-3 h-3 rounded-full flex-shrink-0`} style={{backgroundColor: currentColors.icon.replace('text-', '#')}}></div>
            <span>{message}</span>
        </div>
    );
};

export default Toast;
// src/components/LoadingScreen.jsx
import React, { useEffect, useState } from 'react';
import { IMAGE_PATHS } from '../constants/paths'; //

const LoadingScreen = ({ progress }) => {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        // Анимация zoom-in/zoom-out
        const interval = setInterval(() => {
            setScale(prev => prev === 1 ? 1.1 : 1); // Переключаем масштаб между 1 и 1.1
        }, 500); // Каждые 0.5 секунды

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-[100001] text-white">
            <h1 className="font-cinzel text-4xl mb-8 text-orange-400 text-shadow-glow">Forge & Artifacts</h1>
            
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                <img
                    src={IMAGE_PATHS.UI.ANVIL} //
                    alt="Loading Anvil"
                    className="object-contain"
                    style={{ transform: `scale(${scale})`, transition: 'transform 0.5s ease-in-out' }}
                />
            </div>

            <div className="w-64 bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-100 ease-out"
                    style={{ width: `${progress * 100}%` }}
                ></div>
            </div>
            <p className="mt-4 text-gray-300">Загрузка ресурсов... {Math.floor(progress * 100)}%</p>
        </div>
    );
};

export default LoadingScreen;
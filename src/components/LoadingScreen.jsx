// src/components/LoadingScreen.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { IMAGE_PATHS } from '../constants/paths';
import { loadingScreenTips } from '../data/loadingScreenTips';

const LoadingScreen = ({ progress }) => {
    const [scale, setScale] = useState(1);
    const [currentTip, setCurrentTip] = useState('');

    const shuffledTips = useMemo(() => 
        loadingScreenTips.sort(() => 0.5 - Math.random()), 
    []);

    useEffect(() => {
        // Анимация zoom-in/zoom-out для наковальни
        const scaleInterval = setInterval(() => {
            setScale(prev => prev === 1 ? 1.05 : 1);
        }, 500);

        // Устанавливаем первый совет немедленно
        setCurrentTip(shuffledTips[0]);

        // Логика смены советов каждые 3 секунды
        let tipIndex = 0;
        const tipInterval = setInterval(() => {
            tipIndex = (tipIndex + 1) % shuffledTips.length;
            setCurrentTip(shuffledTips[tipIndex]);
        }, 3000); // Меняем совет каждые 3 секунды

        return () => {
            clearInterval(scaleInterval);
            clearInterval(tipInterval);
        };
    }, [shuffledTips]);

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-[100001] text-white p-4">
            <h1 className="font-cinzel text-4xl mb-8 text-orange-400 text-shadow-glow">Forge & Artifacts</h1>
            
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                <img
                    src={IMAGE_PATHS.UI.ANVIL}
                    alt="Loading Anvil"
                    className="object-contain"
                    style={{ transform: `scale(${scale})`, transition: 'transform 0.5s ease-in-out' }}
                />
            </div>

            <div className="w-full max-w-sm bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-100 ease-out"
                    style={{ width: `${progress * 100}%` }}
                ></div>
            </div>
            <p className="mt-4 text-gray-300">Загрузка ресурсов... {Math.floor(progress * 100)}%</p>
            
            <div className="absolute bottom-8 px-6 text-center">
                <p className="font-bold text-gray-400">Совет:</p>
                <p className="text-gray-300 italic transition-opacity duration-500 ease-in-out">{currentTip}</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
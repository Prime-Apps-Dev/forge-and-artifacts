// src/components/layout/MobileHeader.jsx
import React from 'react';
import WorldEventIndicator from '../ui/display/WorldEventIndicator'; // Импортируем компонент

const MobileHeader = ({ onBurgerClick }) => {
    return (
        // Изменяем justify-start на justify-between, чтобы разнести элементы по краям
        <header className="w-full h-16 bg-gray-800/80 backdrop-blur-md border-b-2 border-gray-700 flex items-center justify-between px-2 md:px-4 flex-shrink-0 gap-2">
            <div className="flex items-center gap-1">
                <button onClick={onBurgerClick} className="interactive-element p-2 mt-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700/50">
                    <span className="material-icons-outlined text-3xl">menu</span>
                </button>
                <h1 className="font-cinzel text-lg md:text-xl text-orange-400">Forge & Artifacts</h1>
            </div>

            {/* Добавляем индикатор мирового события */}
            <div className="flex-shrink-0">
                <WorldEventIndicator />
            </div>
        </header>
    );
};

export default MobileHeader;
// src/components/layout/MobileHeader.jsx
import React from 'react';

const MobileHeader = ({ onBurgerClick }) => {
    return (
        // Класс "items-center" обеспечивает идеальное вертикальное выравнивание всех элементов внутри шапки.
        <header className="w-full h-16 bg-gray-800/80 backdrop-blur-md border-b-2 border-gray-700 flex items-center justify-start px-4 flex-shrink-0 gap-1">
            <button onClick={onBurgerClick} className="interactive-element p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700/50 mt-2">
                <span className="material-icons-outlined text-3xl">menu</span>
            </button>
            <h1 className="font-cinzel text-xl text-orange-400">Forge & Artifacts</h1>
        </header>
    );
};

export default MobileHeader;
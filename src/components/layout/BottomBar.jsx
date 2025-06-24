// src/components/layout/BottomBar.jsx
import React, { memo } from 'react';
import { formatNumber } from '../../utils/formatters';
import { definitions } from '../../data/definitions';

const BottomBar = memo(({ gameState, onToggleInventoryModal, onToggleSettingsModal, onToggleProfileModal, onToggleBottomBarVisibility }) => {
    const currentAvatarSrc = definitions.avatars[gameState.playerAvatarId]?.src || '/img/default_avatar.png';

    return (
        <div className="w-full h-full flex items-center justify-between px-4">
            <div className="flex items-center gap-4">

                <button
                    onClick={onToggleProfileModal}
                    className="interactive-element p-1 rounded-full bg-gray-800 border-2 border-yellow-500 shadow-md hover:shadow-lg transition-shadow interactive-element-scale-inner"
                    title="Профиль Мастера"
                >
                    <img src={currentAvatarSrc} alt="Аватар Мастера" className="w-10 h-10 rounded-full object-cover" />
                </button>
                
                <div className="flex flex-col text-sm">
                    <p className="text-white font-cinzel font-bold">{gameState.playerName}</p>
                    <p className="text-yellow-400">Уровень {gameState.masteryLevel}</p>
                </div>
            </div>


            <div className="bottom-bar-divider"></div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="material-icons-outlined text-yellow-400">bolt</span>
                    <span className="text-white font-bold text-lg">{formatNumber(gameState.sparks, true)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="material-icons-outlined text-purple-400">bubble_chart</span>
                    <span className="text-white font-bold text-lg">{formatNumber(gameState.matter, true)}</span>
                </div>
            </div>


            <div className="bottom-bar-divider"></div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onToggleInventoryModal}

                    className="interactive-element p-2 rounded-full text-gray-400 material-icons-outlined text-2xl hover:text-white interactive-element-scale-inner" 
                    title="Инвентарь"
                >
                    backpack
                </button>
                <button
                    onClick={onToggleSettingsModal}

                    className="interactive-element p-2 rounded-full text-gray-400 material-icons-outlined text-2xl hover:text-white interactive-element-scale-inner" 
                    title="Настройки"
                >
                    settings
                </button>
                
                <button
                    onClick={onToggleBottomBarVisibility}

                    className="interactive-element p-2 rounded-full text-gray-400 material-icons-outlined text-2xl hover:text-white interactive-element-scale-inner" 
                    title="Скрыть панель"
                >
                    keyboard_arrow_down
                </button>
            </div>
        </div>
    );
});

export default BottomBar;
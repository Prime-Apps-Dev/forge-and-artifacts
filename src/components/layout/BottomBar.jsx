// src/components/layout/BottomBar.jsx
import React, { memo } from 'react';
import { formatNumber } from '../../utils/formatters.jsx';
import { definitions } from '../../data/definitions/index.js';
import { useGame } from '../../context/GameContext.jsx';
import Tooltip from '../ui/display/Tooltip.jsx';

export const WorldEventIndicator = memo(() => {
    const { displayedGameState: gameState } = useGame();
    const event = gameState.market.worldEvent;
    const now = Date.now();

    if (!event || event.id === 'stable' || !event.endTime || event.endTime <= now) {
        return null;
    }
    
    const timeLeft = Math.round((event.endTime - now) / 1000);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const tooltipText = `${event.message} (Осталось: ${minutes}м ${seconds}с)`;

    return (
        <Tooltip text={tooltipText}>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700 cursor-help backdrop-blur-sm">
                <div className="flex items-center gap-2 animate-pulse">
                    <span className="material-icons-outlined text-blue-300 text-lg">{event.icon || 'public'}</span>
                    <span className="text-xs text-blue-200 font-semibold">{event.name}</span>
                </div>
            </div>
        </Tooltip>
    );
});


const BottomBar = memo(({ onToggleInventoryModal, onToggleSettingsModal, onToggleProfileModal, onToggleBottomBarVisibility }) => {
    const { displayedGameState: gameState } = useGame();
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
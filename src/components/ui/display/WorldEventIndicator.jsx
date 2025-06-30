// src/components/ui/display/WorldEventIndicator.jsx
import React, { memo } from 'react';
import { useGame } from '../../../context/useGame.js';
import Tooltip from './Tooltip';

const WorldEventIndicator = memo(() => {
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

    // Добавляем класс для мобильных устройств, чтобы иконка и текст были меньше
    return (
        <Tooltip text={tooltipText}>
            <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700 cursor-help backdrop-blur-sm">
                <div className="flex items-center gap-1 md:gap-2 animate-pulse">
                    <span className="material-icons-outlined text-blue-300 text-base md:text-lg">{event.icon || 'public'}</span>
                    <span className="hidden sm:inline text-xs text-blue-200 font-semibold">{event.name}</span>
                </div>
            </div>
        </Tooltip>
    );
});

export default WorldEventIndicator;
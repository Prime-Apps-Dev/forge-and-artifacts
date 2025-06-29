// src/components/layout/BottomBar.jsx
import React, { memo } from 'react';
import { formatNumber } from '../../utils/formatters.jsx';
import { definitions } from '../../data/definitions/index.js';
import { useGame } from '../../context/GameContext.jsx';
import Tooltip from '../ui/display/Tooltip.jsx';
import { IMAGE_PATHS } from '../../constants/paths.js';

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


const BottomBar = memo(({ isBottomBarVisible, onToggleBottomBarVisibility }) => {
    const { displayedGameState: gameState, handlers, isWorking } = useGame();
    const currentAvatarSrc = definitions.avatars[gameState.playerAvatarId]?.src || '/img/default_avatar.png';

    return (
        <>
            {/* --- DESKTOP Bottom Bar --- */}
            <div className="hidden md:block">
                {/* ИСПРАВЛЕНИЕ: Убраны классы для трансформации с контейнера */}
                <div className="bottom-bar-panel-container">
                    {/* ИСПРАВЛЕНИЕ: Класс для скрытия панели теперь применяется здесь, и используется новый класс 'bottom-bar-panel-hidden' */}
                    <div className={`bottom-bar-panel ${isBottomBarVisible ? '' : 'bottom-bar-panel-hidden'}`}>
                        <div className="w-full h-full flex items-center justify-between px-4">
                            <div className="flex items-center gap-4">
                                <button onClick={handlers.handleOpenProfileModal} className="interactive-element p-1 rounded-full bg-gray-800 border-2 border-yellow-500 shadow-md hover:shadow-lg transition-shadow" title="Профиль Мастера">
                                    <img src={currentAvatarSrc} alt="Аватар Мастера" className="w-10 h-10 rounded-full object-cover" />
                                </button>
                                <div className="flex flex-col text-sm">
                                    <p className="text-white font-cinzel font-bold">{gameState.playerName}</p>
                                    <p className="text-yellow-400">Уровень {gameState.masteryLevel}</p>
                                </div>
                            </div>
                            <div className="bottom-bar-divider"></div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2"><span className="material-icons-outlined text-yellow-400">bolt</span><span className="text-white font-bold text-lg">{formatNumber(gameState.sparks, true)}</span></div>
                                <div className="flex items-center gap-2"><span className="material-icons-outlined text-purple-400">bubble_chart</span><span className="text-white font-bold text-lg">{formatNumber(gameState.matter, true)}</span></div>
                            </div>
                            <div className="bottom-bar-divider"></div>
                            <div className="flex items-center gap-2">
                                <button onClick={handlers.handleOpenInventoryModal} className="interactive-element p-2 rounded-full text-gray-400 material-icons-outlined text-2xl hover:text-white" title="Инвентарь">backpack</button>
                                <button onClick={handlers.handleOpenSettingsModal} className="interactive-element p-2 rounded-full text-gray-400 material-icons-outlined text-2xl hover:text-white" title="Настройки">settings</button>
                                <button onClick={onToggleBottomBarVisibility} className="interactive-element p-2 rounded-full text-gray-400 material-icons-outlined text-2xl hover:text-white" title="Скрыть панель">keyboard_arrow_down</button>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className={`fixed left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out z-20 ${isBottomBarVisible ? 'bottom-[112px]' : 'bottom-6'}`}>
                    <div className="flex items-center gap-4">
                        {!isBottomBarVisible && (
                            <button onClick={onToggleBottomBarVisibility} className="bg-gray-900/70 border border-gray-700 backdrop-blur-md pointer-events-auto hover:bg-gray-800/80 focus:outline-none w-12 h-12 flex items-center justify-center rounded-full" title="Показать панель">
                                <span className="material-icons-outlined text-gray-400 text-2xl">keyboard_arrow_up</span>
                            </button>
                        )}
                        <WorldEventIndicator />
                    </div>
                </div>
            </div>

             {/* --- MOBILE Bottom Bar --- */}
             <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-gray-800/80 backdrop-blur-md border-t-2 border-gray-700 flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                     <div className="flex items-center gap-1">
                        <span className="material-icons-outlined text-yellow-400 text-lg">bolt</span>
                        <span className="text-white font-bold text-base">{formatNumber(gameState.sparks)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="material-icons-outlined text-purple-400 text-lg">bubble_chart</span>
                        <span className="text-white font-bold text-base">{formatNumber(gameState.matter)}</span>
                    </div>
                </div>
                
                <div 
                    onClick={handlers.handleStrikeAnvil} 
                    className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-orange-600 rounded-full flex items-center justify-center border-4 border-gray-900 shadow-lg interactive-element cursor-pointer transition-transform ${isWorking ? 'anvil-working' : ''}`}
                >
                     <img src={IMAGE_PATHS.UI.ANVIL} alt="Наковальня" className="w-16 h-16 drop-shadow-lg" />
                </div>
                <div className="w-1/3"></div>
             </div>
        </>
    );
});

export default BottomBar;
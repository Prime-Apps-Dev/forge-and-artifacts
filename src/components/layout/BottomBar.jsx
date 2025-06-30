// src/components/layout/BottomBar.jsx
import React, { memo } from 'react';
import { formatNumber } from '../../utils/formatters.jsx';
import { definitions } from '../../data/definitions/index.js';
import { useGame } from '../../context/useGame.js';
import Tooltip from '../ui/display/Tooltip.jsx';
import { IMAGE_PATHS } from '../../constants/paths.js';
import { getResourceImageSrc } from '../../utils/helpers.js';
import WorldEventIndicator from '../ui/display/WorldEventIndicator.jsx'; // Импортируем новый компонент

const BottomBar = memo(({ isBottomBarVisible, onToggleBottomBarVisibility }) => {
    const { displayedGameState: gameState, handlers, isWorking, activeMobileView, selectedMineOre, selectedShopShelfIndex } = useGame();
    const currentAvatarSrc = definitions.avatars[gameState.playerAvatarId]?.src || '/img/default_avatar.png';

    const renderMobileActionButton = () => {
        const visibleOnViews = ['forge', 'mine', 'playerShop'];
        if (!visibleOnViews.includes(activeMobileView)) {
            return null;
        }
    
        let iconElement;
        let onClickAction = (e) => handlers.handleStrikeAnvil(e);
        let isDisabled = false;
        let buttonClass = 'bg-orange-600';

        if (activeMobileView === 'mine') {
            const iconSrc = getResourceImageSrc(selectedMineOre, 128);
            iconElement = <img src={iconSrc} alt="Action Icon" className="w-16 h-16 drop-shadow-lg object-contain" />;
            onClickAction = (e) => handlers.handleMineOre(selectedMineOre, e.clientX, e.clientY);
            buttonClass = 'bg-gray-600';
        } else if (activeMobileView === 'playerShop') {
            // ИСПРАВЛЕНИЕ: Заменяем отсутствующую картинку на Material Icon
            iconElement = <span className="material-icons-outlined text-white text-5xl drop-shadow-lg">paid</span>;
            const shelf = selectedShopShelfIndex !== null ? gameState.shopShelves[selectedShopShelfIndex] : null;
            isDisabled = !shelf || !shelf.customer;
            onClickAction = isDisabled ? () => {} : (e) => handlers.handleClickSale(selectedShopShelfIndex);
            buttonClass = isDisabled ? 'bg-gray-700' : 'bg-green-600';
        } else { // 'forge'
            iconElement = <img src={IMAGE_PATHS.UI.ANVIL} alt="Action Icon" className="w-16 h-16 drop-shadow-lg object-contain" />;
        }

        return (
            <div 
                onClick={onClickAction} 
                className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-24 h-24 ${buttonClass} rounded-full flex items-center justify-center border-4 border-gray-900 shadow-lg interactive-element cursor-pointer transition-all duration-200 ${isWorking && activeMobileView === 'forge' ? 'anvil-working' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                 {iconElement}
            </div>
        );
    };

    return (
        <>
            {/* --- DESKTOP Bottom Bar --- */}
            <div className="hidden md:block">
                <div className="bottom-bar-panel-container">
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
                <div className="flex items-center gap-2 w-1/3">
                     <div className="flex items-center gap-1">
                        <span className="material-icons-outlined text-yellow-400 text-lg">bolt</span>
                        <span className="text-white font-bold text-base">{formatNumber(gameState.sparks)}</span>
                    </div>
                </div>
                
                {renderMobileActionButton()}
                
                <div className="flex items-center gap-2 w-1/3 justify-end">
                    <div className="flex items-center gap-1">
                        <span className="material-icons-outlined text-purple-400 text-lg">bubble_chart</span>
                        <span className="text-white font-bold text-base">{formatNumber(gameState.matter)}</span>
                    </div>
                </div>
             </div>
        </>
    );
});

export default BottomBar;
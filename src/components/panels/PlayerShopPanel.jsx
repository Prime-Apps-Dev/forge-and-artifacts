// src/components/panels/PlayerShopPanel.jsx
import React, { useMemo } from 'react';
import { definitions } from '../../data/definitions/index.js';
import ShopUpgradeButton from '../ui/buttons/ShopUpgradeButton';
import Tooltip from '../ui/display/Tooltip';
import { getItemImageSrc } from '../../utils/helpers';
import { useGame } from '../../context/useGame.js';
import Button from '../ui/buttons/Button.jsx';
import { formatNumber } from '../../utils/formatters.jsx';

const ShopShelf = ({ shelf, index, isSelected, onSelect }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    
    const item = shelf.itemId ? gameState.inventory.find(item => item.uniqueId === shelf.itemId) : null;

    const assignedTrader = useMemo(() => Object.values(gameState.hiredPersonnel).find(p => {
        const assignment = gameState.personnelAssignment[p.uniqueId];
        return assignment && assignment.role === 'trader' && assignment.assignment === `shelf_${index}` && !p.isResting;
    }), [gameState.hiredPersonnel, gameState.personnelAssignment, index]);
    
    if (!item) {
        return (
            <div className="h-full bg-black/20 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center relative min-h-[220px] w-48 flex-shrink-0">
                {assignedTrader && (
                    <div className="absolute top-1 left-1 z-10">
                         <Tooltip text={`Торговец: ${assignedTrader.name} (Ур. ${assignedTrader.level})`}>
                            <img src={definitions.personnel[assignedTrader.personnelId].faceImg} alt={assignedTrader.name} className="w-8 h-8 rounded-full border-2 border-yellow-500 bg-gray-800 object-contain"/>
                        </Tooltip>
                    </div>
                )}
                <p className="text-gray-600 text-sm">Пустая полка</p>
            </div>
        );
    }

    const itemDef = definitions.items?.[item.itemKey];
    if (!itemDef) return null;
    
    const isCustomerWaiting = !!shelf.customer;
    let borderColor = 'border-gray-700/50';
    if (isCustomerWaiting) {
        borderColor = isSelected ? 'border-green-400 ring-2 ring-green-500/70 shadow-lg shadow-green-500/20' : 'border-yellow-500 shadow-lg shadow-yellow-500/10';
    }

    const eloquenceLevel = gameState.upgradeLevels.eloquence || 0;
    const comfortableQuality = 1.0 + (eloquenceLevel * 0.5);
    const showQualityWarning = item.quality > comfortableQuality;
    
    const qualityPenalty = 1 + Math.max(0, item.quality - gameState.maxComfortableQuality);
    const requiredProgress = shelf.marketPrice * definitions.gameConfig.SALE_REQUIRED_PROGRESS_MULTIPLIER * qualityPenalty;
    const saleProgressPercentage = (shelf.saleProgress / Math.max(50, requiredProgress)) * 100;

    return (
        <div 
            onClick={() => onSelect(index)}
            className={`bg-black/40 border rounded-lg p-3 flex flex-col text-center items-center transition-all duration-300 relative cursor-pointer min-h-[220px] w-48 flex-shrink-0 ${borderColor}`}
        >
            {assignedTrader && (
                <div className="absolute top-1 left-1 z-10">
                     <Tooltip text={`Торговец: ${assignedTrader.name} (Ур. ${assignedTrader.level})`}>
                        <img src={definitions.personnel[assignedTrader.personnelId].faceImg} alt={assignedTrader.name} className="w-8 h-8 rounded-full border-2 border-yellow-500 bg-gray-800 object-contain"/>
                    </Tooltip>
                </div>
            )}
            
            <div className="w-full text-center mb-2">
                <p className="text-white font-bold truncate">{itemDef.name}</p>
                <div className="flex items-center justify-center gap-2">
                    <p className="text-sm text-yellow-400">Качество: {item.quality.toFixed(2)}</p>
                    {showQualityWarning && (
                         <Tooltip text={`Ваш уровень Красноречия (${eloquenceLevel}) может быть недостаточен для эффективной продажи такого качественного товара.`}>
                            <span className="material-icons-outlined text-yellow-500 text-base animate-pulse">warning_amber</span>
                        </Tooltip>
                    )}
                </div>
            </div>

            <div className="w-full flex-grow flex items-center justify-center my-2">
                <img
                    src={getItemImageSrc(item.itemKey, 64)}
                    alt={itemDef.name}
                    className="w-20 h-20 object-contain drop-shadow-lg"
                />
            </div>
            
            <div className="w-full mt-auto h-28 flex flex-col justify-end">
                {isCustomerWaiting ? (
                    <div className="w-full bg-black/30 p-2 rounded-md border border-gray-600 h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                                <img src={shelf.customer.faceImg} alt={shelf.customer.name} className="w-8 h-8 rounded-full border-2 border-gray-500 object-contain flex-shrink-0"/>
                                <div className="text-left min-w-0">
                                    <p className="text-xs text-gray-400">Клиент:</p>
                                    <p className="text-sm text-white font-semibold leading-tight truncate">{shelf.customer.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-xs text-gray-400 gap-1 flex-shrink-0">
                                <span className="material-icons-outlined text-sm">timer</span>
                                <span className="text-xs">{Math.ceil(shelf.saleTimer)}с</span>
                            </div>
                        </div>
                        
                        <div className="w-full bg-gray-900 rounded-full h-2.5 mt-2 border border-gray-700 overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full transition-width duration-100" style={{ width: `${saleProgressPercentage}%` }}></div>
                        </div>

                        <div className="hidden md:block mt-2">
                            <Button size="sm" onClick={(e) => { e.stopPropagation(); handlers.handleClickSale(index); }} variant="success">
                                Продать!
                            </Button>
                        </div>
                    </div>
                ) : (
                     <div className="h-full flex flex-col items-center justify-end gap-2">
                        <div className="text-center">
                            <p className="text-xs text-gray-400">Цена:</p>
                            <p className="font-bold text-lg text-white">{formatNumber(shelf.userPrice)}</p>
                        </div>
                        <div className="flex gap-1 w-full">
                            {gameState.purchasedSkills.marketInsight && (
                                <Button onClick={(e) => { e.stopPropagation(); handlers.handleOpenSetPriceModal(index); }} variant="secondary" className="py-1 text-sm grow">
                                    <span className="material-icons-outlined text-base">sell</span>
                                </Button>
                            )}
                            <Button
                                onClick={(e) => { e.stopPropagation(); handlers.handleRemoveItemFromShelf(item.uniqueId); }}
                                disabled={!!gameState.activeOrder || !!gameState.activeFreeCraft || !!gameState.currentEpicOrder}
                                variant="danger"
                                className="py-1 text-sm grow"
                            >
                                <span className="material-icons-outlined text-base">inventory_2</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const PlayerShopPanel = () => {
    const { displayedGameState: gameState, handlers, selectedShopShelfIndex } = useGame();

    const availableShopUpgrades = useMemo(() => {
        return Object.keys(definitions.shopUpgrades).filter(id => {
            const upgrade = definitions.shopUpgrades[id];
            if (!upgrade) return false;
            const level = gameState.upgradeLevels[id] || 0;
            if (upgrade.isMultiLevel) {
                return level < upgrade.maxLevel;
            } else {
                return level === 0;
            }
        });
    }, [gameState.upgradeLevels]);

    return (
        <div className="panel-section">
            <h3 className="font-cinzel text-lg text-gray-400 border-b border-gray-700/50 pb-1 mb-4">Мой Магазин</h3>
            <p className="text-gray-400 text-sm mb-4">Выставляйте предметы на продажу. Когда появится клиент, у вас будет ограниченное время, чтобы обслужить его быстрыми кликами! Назначенные торговцы будут делать это за вас.</p>
            
            <h4 className="font-cinzel text-orange-400 text-lg mb-3">Торговые Полки ({gameState.shopShelves.filter(s => s.itemId !== null).length}/{gameState.shopShelves.length})</h4>
            <div className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto pb-3">
                {gameState.shopShelves.map((shelf, index) => (
                    <ShopShelf 
                        key={shelf.id || index} 
                        shelf={shelf} 
                        index={index}
                        isSelected={selectedShopShelfIndex === index}
                        onSelect={handlers.handleSelectShopShelf}
                    />
                ))}
            </div>

            <div className="mt-6">
                <h4 className="font-cinzel text-orange-400 text-lg mb-3">Улучшения Магазина</h4>
                 <div className="flex flex-col gap-4">
                    {availableShopUpgrades.length > 0 ? (
                        availableShopUpgrades.map(id => (
                            <ShopUpgradeButton
                                key={id}
                                upgradeId={id}
                                upgradeType="shopUpgrades"
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 italic text-center">
                            В данный момент нет доступных улучшений для магазина. Повышайте репутацию магазина, чтобы разблокировать новые!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayerShopPanel;
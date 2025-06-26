// src/components/panels/PlayerShopPanel.jsx
import React, { useMemo } from 'react';
import { definitions } from '../../data/definitions/index.js';
import ShopUpgradeButton from '../ui/buttons/ShopUpgradeButton';
import Tooltip from '../ui/display/Tooltip';
import { getItemImageSrc } from '../../utils/helpers';
import { useGame } from '../../context/GameContext.jsx';
import Button from '../ui/buttons/Button.jsx';

const ShopShelf = ({ shelf, index }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    
    const item = shelf.itemId ? gameState.inventory.find(item => item.uniqueId === shelf.itemId) : null;

    const assignedTrader = useMemo(() => Object.values(gameState.hiredPersonnel).find(p => {
        const assignment = gameState.personnelAssignment[p.uniqueId];
        return assignment && assignment.role === 'trader' && assignment.assignment === `shelf_${index}` && !p.isResting;
    }), [gameState.hiredPersonnel, gameState.personnelAssignment, index]);
    
    if (!item) {
        return (
            <div className="h-full bg-black/20 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center relative">
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
    const baseValue = itemDef.components.reduce((sum, c) => sum + c.progress, 0);
    const requiredProgress = (baseValue * item.quality) / 2;

    return (
        <div className={`bg-black/40 border rounded-lg p-3 flex flex-col text-center items-center transition-all duration-300 relative ${isCustomerWaiting ? 'border-yellow-500 shadow-lg shadow-yellow-500/10' : 'border-gray-700'}`}>
            {assignedTrader && (
                <div className="absolute top-1 left-1 z-10">
                     <Tooltip text={`Торговец: ${assignedTrader.name} (Ур. ${assignedTrader.level})`}>
                        <img src={definitions.personnel[assignedTrader.personnelId].faceImg} alt={assignedTrader.name} className="w-8 h-8 rounded-full border-2 border-yellow-500 bg-gray-800 object-contain"/>
                    </Tooltip>
                </div>
            )}
            <img
                src={getItemImageSrc(item.itemKey, 64)}
                alt={itemDef.name}
                className="w-16 h-16 object-contain"
            />
            <p className="text-base font-bold mt-2 grow">{itemDef.name}</p>
            <p className="text-sm text-yellow-400">Кач-во: {item.quality.toFixed(2)}</p>
            
            <div className="w-full mt-3 space-y-2 h-24 flex flex-col justify-end">
                {isCustomerWaiting ? (
                    <div className="w-full">
                        <Tooltip text={`Клиент: ${shelf.customer.name}`}>
                            <p className="text-xs text-yellow-300 mb-1 animate-pulse">Клиент ждет! (Осталось: {Math.ceil(shelf.saleTimer)}с)</p>
                        </Tooltip>
                        <Button
                            onClick={() => handlers.handleClickSale(index)}
                            variant="success"
                        >
                            Продать!
                        </Button>
                        <div className="w-full bg-gray-900 rounded-full h-2 mt-1 border border-gray-600">
                            <div 
                                className="bg-green-500 h-full rounded-full" 
                                style={{ width: `${(shelf.saleProgress / Math.max(50, requiredProgress)) * 100}%`, transition: 'width 0.1s linear' }}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <Button
                        onClick={() => handlers.handleRemoveItemFromShelf(item.uniqueId)}
                        disabled={!!gameState.activeOrder || !!gameState.activeFreeCraft || !!gameState.currentEpicOrder}
                        variant="danger"
                        className="py-1 text-sm"
                    >
                        Убрать с полки
                    </Button>
                )}
            </div>
        </div>
    );
};

const PlayerShopPanel = () => {
    const { displayedGameState: gameState, handlers } = useGame();

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
            <div className="grid grid-cols-3 gap-4 min-h-[14rem]">
                {gameState.shopShelves.map((shelf, index) => (
                    <ShopShelf key={shelf.id || index} shelf={shelf} index={index} />
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
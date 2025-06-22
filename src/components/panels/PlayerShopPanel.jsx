// src/components/panels/PlayerShopPanel.jsx
import React from 'react';
import { definitions } from '../../data/definitions';
import { formatNumber } from '../../utils/helpers';
import ShopUpgradeButton from '../ui/ShopUpgradeButton';
import Tooltip from '../ui/Tooltip';
import { getItemImageSrc } from '../../utils/helpers'; // Импортируем новую функцию

// Компонент для одной полки с новой логикой
const ShopShelf = ({ shelf, index, gameState, handlers }) => {
    const item = shelf.itemId ? gameState.inventory.find(item => item.uniqueId === shelf.itemId) : null;
    
    if (!item) {
        return <div className="h-full bg-black/20 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center"><p className="text-gray-600 text-sm">Пустая полка</p></div>;
    }

    const itemDef = definitions.items?.[item.itemKey]; // Безопасный доступ
    if (!itemDef) return null; // Если itemDef не найден, ничего не рендерим

    const isCustomerWaiting = !!shelf.customer;
    const baseValue = itemDef.components.reduce((sum, c) => sum + c.progress, 0);
    const requiredProgress = (baseValue * item.quality) / 2;

    return (
        <div className={`bg-black/40 border rounded-lg p-3 flex flex-col text-center items-center transition-all duration-300 ${isCustomerWaiting ? 'border-yellow-500 shadow-lg shadow-yellow-500/10' : 'border-gray-700'}`}>
            <img
                src={getItemImageSrc(item.itemKey, 64)} // Используем новую функцию
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
                        <button
                            onClick={() => handlers.handleClickSale(index)}
                            className="interactive-element w-full bg-green-700 text-white font-bold py-2 px-3 rounded-md hover:bg-green-600"
                        >
                            Продать!
                        </button>
                        <div className="w-full bg-gray-900 rounded-full h-2 mt-1 border border-gray-600">
                            <div 
                                className="bg-green-500 h-full rounded-full" 
                                style={{ width: `${(shelf.saleProgress / Math.max(50, requiredProgress)) * 100}%`, transition: 'width 0.1s linear' }}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => handlers.handleRemoveItemFromShelf(item.uniqueId)}
                        disabled={!!gameState.activeOrder || !!gameState.activeFreeCraft || !!gameState.currentEpicOrder}
                        className="text-sm interactive-element w-full bg-red-800/80 text-white font-bold py-1 px-2 rounded-md hover:enabled:bg-red-700 disabled:opacity-50"
                    >
                        Убрать с полки
                    </button>
                )}
            </div>
        </div>
    );
};

// Основной компонент панели
const PlayerShopPanel = ({ gameState, handlers }) => {
    const availableShopUpgrades = Object.keys(definitions.shopUpgrades).filter(id => {
        const upgrade = definitions.shopUpgrades[id];
        const level = gameState.upgradeLevels[id] || 0;
        if (upgrade.isMultiLevel) {
            return level < upgrade.maxLevel;
        } else {
            return level === 0;
        }
    });

    return (
        <div className="panel-section">
            <h3 className="font-cinzel text-lg text-gray-400 border-b border-gray-700/50 pb-1 mb-4">Мой Магазин</h3>
            <p className="text-gray-400 text-sm mb-4">Выставляйте предметы на продажу. Когда появится клиент, у вас будет ограниченное время, чтобы обслужить его быстрыми кликами!</p>
            
            <h4 className="font-cinzel text-orange-400 text-lg mb-3">Торговые Полки ({gameState.shopShelves.filter(s => s.itemId !== null).length}/{gameState.shopShelves.length})</h4>
            <div className="grid grid-cols-3 gap-4 min-h-[14rem]">
                {gameState.shopShelves.map((shelf, index) => (
                    <ShopShelf key={index} shelf={shelf} index={index} gameState={gameState} handlers={handlers} />
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
                                gameState={gameState}
                                onBuyUpgrade={(...args) => handlers.handleBuyUpgrade(id, 'shopUpgrades', ...args)}
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
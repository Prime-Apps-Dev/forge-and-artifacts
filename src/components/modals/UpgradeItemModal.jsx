// src/components/modals/UpgradeItemModal.jsx
import React from 'react';
import { useGame } from '../../context/GameContext';
import { definitions } from '../../data/definitions/index';
import { formatCostsJsx, formatNumber } from '../../utils/formatters';
import Button from '../ui/buttons/Button';
import { getItemImageSrc } from '../../utils/helpers';

const UpgradeItemModal = ({ isOpen, onClose, itemId }) => {
    const { displayedGameState: gameState, handlers } = useGame();

    if (!isOpen || !itemId) return null;

    const item = gameState.inventory.find(i => i.uniqueId === itemId);
    if (!item) return null;

    const itemDef = definitions.items[item.itemKey];
    const currentLevel = item.level;
    const nextLevel = currentLevel + 1;
    const isMaxLevel = currentLevel >= itemDef.maxLevel;

    const upgradeCost = isMaxLevel ? {} : itemDef.upgradeCosts[currentLevel - 1];
    const canAfford = !isMaxLevel && Object.entries(upgradeCost).every(([res, cost]) => (gameState[res] || 0) >= cost);

    const getBonusesForLevel = (level) => {
        const bonuses = { ...itemDef.bonuses };
        if (level > 1) {
            for (const key in itemDef.bonusesPerLevel) {
                bonuses[key] = (bonuses[key] || 0) + itemDef.bonusesPerLevel[key] * (level - 1);
            }
        }
        return bonuses;
    };
    
    const currentBonuses = getBonusesForLevel(currentLevel);
    const nextLevelBonuses = isMaxLevel ? {} : getBonusesForLevel(nextLevel);

    const formatBonus = (key, value) => `${key}: +${value.toFixed(2)}`;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-2xl p-6 w-full max-w-lg modal-content" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-cinzel text-2xl text-yellow-400">Улучшение предмета</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white material-icons-outlined">close</button>
                </div>

                <div className="flex flex-col items-center text-center">
                    <img src={getItemImageSrc(item.itemKey, 96)} alt={itemDef.name} className="w-24 h-24 object-contain mb-2" />
                    <h3 className="font-bold text-xl text-white">{itemDef.name}</h3>
                    <p className="text-gray-400">Текущий уровень: <span className="font-bold text-white">{currentLevel}</span></p>
                </div>

                <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="bg-black/20 p-3 rounded-md">
                        <h4 className="font-bold text-center text-gray-300">Текущие бонусы</h4>
                        <ul className="text-sm text-gray-400 mt-2">
                            {Object.entries(currentBonuses).map(([key, value]) => <li key={key}>{formatBonus(key, value)}</li>)}
                        </ul>
                    </div>
                     <div className={`bg-black/20 p-3 rounded-md ${isMaxLevel ? 'opacity-50' : ''}`}>
                        <h4 className="font-bold text-center text-gray-300">Бонусы след. уровня</h4>
                         {isMaxLevel ? (
                            <p className="text-sm text-center text-yellow-400 mt-2">Достигнут макс. уровень</p>
                         ) : (
                             <ul className="text-sm text-green-400 mt-2">
                                {Object.entries(nextLevelBonuses).map(([key, value]) => <li key={key}>{formatBonus(key, value)}</li>)}
                            </ul>
                         )}
                    </div>
                </div>

                {!isMaxLevel && (
                    <div className="mt-4 text-center">
                        <p className="text-gray-300 mb-2">Стоимость улучшения:</p>
                        <div className="flex justify-center gap-4">{formatCostsJsx(upgradeCost, gameState)}</div>
                        <Button onClick={() => handlers.handleUpgradeItem(itemId)} disabled={!canAfford} className="mt-6 w-full">
                            {canAfford ? 'Улучшить' : 'Недостаточно ресурсов'}
                        </Button>
                    </div>
                )}
                 <Button onClick={onClose} variant="secondary" className={`mt-2 ${isMaxLevel ? 'w-full' : ''}`}>Закрыть</Button>
            </div>
        </div>
    );
};

export default UpgradeItemModal;
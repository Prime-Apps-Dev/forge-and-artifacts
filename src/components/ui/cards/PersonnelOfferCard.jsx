// src/components/ui/cards/PersonnelOfferCard.jsx
import React, { memo } from 'react';
import Tooltip from '../display/Tooltip';
import { definitions } from '../../../data/definitions/index.js';
import { formatCostsJsx } from '../../../utils/formatters.jsx';
import { useGame } from '../../../context/GameContext.jsx';
import Button from '../buttons/Button.jsx';
import ImageWithFallback from '../display/ImageWithFallback.jsx';
import { UI_CONSTANTS } from '../../../constants/ui.js';

const PersonnelOfferCard = memo(({ offer, isHiringDisabled }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const personnelDef = definitions.personnel[offer.personnelId];
    if (!personnelDef) return null;

    const canAffordHire = Object.entries(offer.hireCost).every(([res, cost]) => (gameState[res] || gameState.specialItems[res] || 0) >= cost);
    const canAffordFirstWage = Object.entries(offer.wage).every(([res, cost]) => (gameState[res] || gameState.specialItems[res] || 0) >= cost);
    const hasFreeSlot = (gameState.personnelSlots.total - gameState.personnelSlots.used) > 0;
    const isRoleUnlocked = !personnelDef.requiredSkill || gameState.purchasedSkills[personnelDef.requiredSkill];
    const isMaxQuantityReached = personnelDef.maxQuantity && gameState.hiredPersonnel.filter(p => p.personnelId === offer.personnelId).length >= personnelDef.maxQuantity;
    const isDisabled = isHiringDisabled || !hasFreeSlot || !canAffordHire || !canAffordFirstWage || !isRoleUnlocked || isMaxQuantityReached;

    let hireButtonText = "Нанять";
    if (!hasFreeSlot) hireButtonText = "Нет свободных слотов";
    else if (!canAffordHire) hireButtonText = "Нет средств на найм";
    else if (!canAffordFirstWage) hireButtonText = "Нет средств на ЗП";
    else if (!isRoleUnlocked) hireButtonText = "Роль не разблокирована";
    else if (isMaxQuantityReached) hireButtonText = "Максимум этого типа";

    const currentAbilities = {};
    for (const key in personnelDef.baseAbilities) {
        currentAbilities[key] = (personnelDef.baseAbilities[key] || 0) + (offer.level - 1) * (personnelDef.abilitiesPerLevel?.[key] || 0);
    }
    
    const formatAbility = (key, value) => {
        switch (key) {
            case 'miningSpeed': return `Добыча: +${value.toFixed(2)}/сек`;
            case 'miningQuality': return `Качество добычи: x${value.toFixed(2)}`;
            case 'smeltingSpeed': return `Плавка: +${value.toFixed(2)}/сек`;
            case 'smeltingEfficiency': return `Эффективность плавки: +${(value * 100).toFixed(1)}%`;
            case 'salesSpeedModifier': return `Скорость продаж: +${(value * 100).toFixed(0)}%`;
            case 'tipChanceModifier': return `Шанс чаевых: +${(value * 100).toFixed(1)}%`;
            case 'wageReduction': return `Снижение ЗП: -${(value * 100).toFixed(0)}%`;
            case 'progressPerClick': return `Прогресс/клик: +${value.toFixed(1)}`;
            case 'clientWaitTimeModifier': return `Ожидание клиентов: +${(value * 100).toFixed(0)}%`;
            default: return `${key}: ${value.toFixed(2)}`;
        }
    };

    const rarityStyles = {
        common: 'border-gray-600 hover:border-orange-500',
        rare: 'border-blue-500 hover:border-blue-400',
        epic: 'border-purple-500 hover:border-purple-400',
        legendary: 'border-yellow-500 hover:border-yellow-400 shadow-yellow-500/20'
    };
    const rarityBorderClass = rarityStyles[offer.rarity] || rarityStyles.common;

    return (
        <div className={`bg-black/30 p-4 rounded-lg border-2 flex flex-col h-full ${isDisabled ? 'border-gray-700 opacity-60' : rarityBorderClass}`}>
            <ImageWithFallback
                src={personnelDef.faceImg}
                fallbackSrc={UI_CONSTANTS.DEFAULT_AVATAR_SRC}
                alt={personnelDef.name}
                className={`mx-auto mb-2 w-20 h-20 object-contain rounded-full border-2 ${rarityBorderClass}`}
            />
            <h3 className="font-cinzel text-lg font-bold text-white">{personnelDef.name}</h3>
            <p className="text-sm text-gray-400 my-1 grow">{personnelDef.description}</p>
            
            {offer.traits?.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-700/50">
                    <p className="text-xs text-gray-400 text-center mb-2">Черты характера:</p>
                    <div className="flex justify-center flex-wrap gap-2">
                        {offer.traits.map(traitId => {
                            const traitDef = definitions.personnelTraits[traitId];
                            if (!traitDef) return null;
                            const traitColor = traitDef.type === 'positive' ? 'text-green-400' : 'text-red-400';
                            return (
                                <Tooltip key={traitId} text={`${traitDef.name}: ${traitDef.description}`}>
                                    <span className={`material-icons-outlined text-xl ${traitColor}`}>{traitDef.icon}</span>
                                </Tooltip>
                            );
                        })}
                    </div>
                </div>
            )}
            
            <div className="text-left text-sm mt-auto pt-2 border-t border-gray-700/50">
                <p className="text-white">Уровень: <span className="font-bold">{offer.level}</span></p>
                <p className="text-white">Настроение: <span className="font-bold text-green-400">{offer.mood}%</span></p>
                <p className="mt-1 font-bold text-yellow-300">Способности:</p>
                <ul className="list-disc list-inside text-xs text-white ml-2">
                    {Object.entries(currentAbilities).map(([key, value]) => (
                        <li key={key}>{formatAbility(key, value)}</li>
                    ))}
                </ul>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700 text-left">
                <p className="font-bold text-sm text-white">Стоимость найма:</p>
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs">
                    {formatCostsJsx(offer.hireCost, gameState)}
                </div>
                <p className="font-bold text-sm text-white mt-2">Зарплата (10 мин):</p>
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs">
                    {formatCostsJsx(offer.wage, gameState)}
                </div>
            </div>

            <Button onClick={() => handlers.handleHirePersonnel(offer.uniqueId)} disabled={isDisabled} className="mt-4">
                {hireButtonText}
            </Button>
        </div>
    );
});

export default PersonnelOfferCard;
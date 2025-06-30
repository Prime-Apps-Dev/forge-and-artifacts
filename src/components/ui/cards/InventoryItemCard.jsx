// src/components/ui/cards/InventoryItemCard.jsx
import React, { useState } from 'react';
import { definitions } from '../../../data/definitions/index.js';
import Tooltip from '../display/Tooltip';
import { getItemImageSrc } from '../../../utils/helpers';
import Button from '../buttons/Button.jsx';
import { STAT_ICONS } from '../../../constants/ui.js';
import { useGame } from '../../../context/useGame.js';
import DisassembleModal from '../../modals/DisassembleModal.jsx'; // Импортируем модальное окно

const STAT_NAMES = {
    damage: 'Урон', defense: 'Защита', durability: 'Прочность', sharpness: 'Острота', handling: 'Удобство',
    speed: 'Скорость', utility: 'Полезность', armorPenetration: 'Пробитие', energyDamage: 'Энерг. урон',
    resonance: 'Резонанс', appeal: 'Привлекательность', critChance: 'Шанс крита', comfort: 'Комфорт',
    flexibility: 'Гибкость', capacity: 'Вместимость', precision: 'Точность', power: 'Мощность',
    clarity: 'Чистота', coreDensity: 'Плотность ядра', structuralIntegrity: 'Прочность', energyResistance: 'Энергозащита',
    purity: 'Чистота', weight: 'Вес', focusPower: 'Сила фокуса', miningSpeed: 'Скорость добычи', 
    salesSpeedModifier: 'Скорость продаж', tipChanceModifier: 'Шанс чаевых'
};

const InventoryItemCard = ({ item, onAction, actionLabel, isAnyActiveProject }) => {
    const { handlers } = useGame();
    const [isDisassembleModalOpen, setIsDisassembleModalOpen] = useState(false); // Состояние для модалки
    const itemDef = definitions.items?.[item.itemKey];
    if (!itemDef) return null;

    const actionButtonDisabled = isAnyActiveProject;

    const maxSlots = itemDef.hasInlaySlots ? (item.quality >= 10 ? 3 : item.quality >= 8 ? 2 : item.quality >= 6 ? 1 : 0) : 0;
    const currentSlotsUsed = (item.inlaySlots || []).length;

    const isPersonnelItem = itemDef.purpose === 'personnel';
    const canBeUpgraded = isPersonnelItem && item.level < itemDef.maxLevel;
    const canBeDisassembled = !itemDef.isQuestRecipe && itemDef.components && itemDef.components.length > 0;


    let rarityClass = { bg: 'from-gray-800/70 to-gray-900/80', border: 'border-gray-600', shadow: 'shadow-gray-900/50', accent: 'text-gray-300' };
    if (itemDef.baseIngotType === 'uncommon') rarityClass = { bg: 'from-blue-900/70 to-blue-900/80', border: 'border-blue-700', shadow: 'shadow-blue-700/30', accent: 'text-blue-300' };
    else if (itemDef.baseIngotType === 'rare') rarityClass = { bg: 'from-purple-900/70 to-purple-900/80', border: 'border-purple-700', shadow: 'shadow-purple-700/40', accent: 'text-purple-300' };
    else if (isPersonnelItem) rarityClass = { bg: 'from-teal-900/70 to-teal-900/80', border: 'border-teal-700', shadow: 'shadow-teal-700/30', accent: 'text-teal-300'};


    return (
        <>
            <div className={`bg-gradient-to-b ${rarityClass.bg} ${rarityClass.border} border-2 rounded-lg p-3 flex flex-col justify-between relative overflow-hidden shadow-lg ${rarityClass.shadow} transition-all duration-300 min-w-[280px] h-full`}>
                <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                     {isPersonnelItem && (
                        <Tooltip text={`Предмет для персонала (Ур. ${item.level})`}>
                            <div className="bg-gray-900/70 text-teal-300 text-xs font-bold px-2 py-0.5 rounded-full border border-teal-500/50 flex items-center gap-1">
                                <span className="material-icons-outlined text-xs">group</span>
                                {item.level}
                            </div>
                        </Tooltip>
                     )}
                     {item.gravingLevel > 0 && (
                        <Tooltip text={`Уровень гравировки: ${item.gravingLevel}`}>
                            <div className="bg-gray-900/70 text-yellow-300 text-xs font-bold px-2 py-0.5 rounded-full border border-yellow-500/50 flex items-center gap-1">
                                <span className="material-icons-outlined text-xs">edit</span>
                                {item.gravingLevel}
                            </div>
                        </Tooltip>
                    )}
                    {itemDef.hasInlaySlots && (
                        <Tooltip text={`Слоты для инкрустации: ${currentSlotsUsed}/${maxSlots}`}>
                            <div className="bg-gray-900/70 text-pink-300 text-xs font-bold px-2 py-0.5 rounded-full border border-pink-500/50 flex items-center gap-1">
                                <span className="material-icons-outlined text-xs">auto_awesome</span>
                                {currentSlotsUsed}/{maxSlots}
                            </div>
                        </Tooltip>
                    )}
                </div>

                <div className="w-full text-center">
                    <p className={`text-lg font-cinzel font-bold ${rarityClass.accent} truncate`}>{itemDef.name}</p>
                </div>

                <div className="flex items-center justify-center my-3 gap-4">
                    <div className="p-1 bg-black/20 rounded-3xl">
                        <img src={getItemImageSrc(item.itemKey, 128)} alt={itemDef.name} className="w-20 h-20 object-contain drop-shadow-lg rounded-2xl" />
                    </div>
                    {!isPersonnelItem && (
                        <div className="text-left border-l-2 border-gray-700 pl-4">
                            <p className="text-sm text-gray-400">Общее качество</p>
                            <p className="text-3xl font-bold text-yellow-300 tracking-wider">{item.quality.toFixed(2)}x</p>
                        </div>
                    )}
                </div>

                <div className="w-full text-sm text-gray-300 flex-grow mb-3">
                     {item.stats || isPersonnelItem ? (
                        <ul className="space-y-1 border-t-2 border-gray-700/50 pt-2 mt-2">
                             {item.stats && Object.entries(item.stats).map(([stat, value]) => (
                                 <li key={stat} className="flex justify-between items-center bg-black/20 hover:bg-black/40 p-1.5 rounded-md">
                                     <div className="flex items-center gap-2">
                                         <Tooltip text={STAT_NAMES[stat] || stat}>
                                            <span className="material-icons-outlined text-lg text-gray-400">{STAT_ICONS[stat] || 'help'}</span>
                                         </Tooltip>
                                         <span className="text-gray-300 font-semibold">{STAT_NAMES[stat] || stat}</span>
                                     </div>
                                     <span className="font-bold text-white text-base">+{value.toFixed(1)}</span>
                                </li>
                            ))}
                            {isPersonnelItem && Object.entries(itemDef.bonuses).map(([stat, value]) => (
                                 <li key={stat} className="flex justify-between items-center bg-black/20 hover:bg-black/40 p-1.5 rounded-md">
                                     <div className="flex items-center gap-2">
                                         <Tooltip text={STAT_NAMES[stat] || stat}>
                                            <span className="material-icons-outlined text-lg text-teal-400">{STAT_ICONS[stat] || 'help'}</span>
                                         </Tooltip>
                                         <span className="text-gray-300 font-semibold">{STAT_NAMES[stat] || stat}</span>
                                     </div>
                                     <span className="font-bold text-white text-base">+{value.toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    ) : <div className="h-full flex items-center justify-center text-gray-600 italic text-center py-4">Нет особых характеристик</div>}
                </div>
                
                <div className="w-full mt-auto space-y-2">
                    {isPersonnelItem ? (
                        canBeUpgraded && (
                            <Button onClick={() => handlers.handleOpenUpgradeItemModal(item.uniqueId)} disabled={actionButtonDisabled} className="w-full py-2 bg-teal-700 hover:enabled:bg-teal-600">
                               Улучшить
                            </Button>
                        )
                    ) : (
                        onAction && (
                            <div className="flex gap-2">
                                <Button onClick={onAction} disabled={actionButtonDisabled} className="w-full py-2">
                                    {actionLabel}
                                </Button>
                                {canBeDisassembled && (
                                    <Tooltip text="Разобрать предмет">
                                        <Button onClick={() => setIsDisassembleModalOpen(true)} disabled={actionButtonDisabled} variant="danger" className="w-auto px-3">
                                            <span className="material-icons-outlined">delete_forever</span>
                                        </Button>
                                    </Tooltip>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
            {isDisassembleModalOpen && (
                <DisassembleModal 
                    isOpen={isDisassembleModalOpen}
                    onClose={() => setIsDisassembleModalOpen(false)}
                    itemId={item.uniqueId}
                />
            )}
        </>
    );
};

export default InventoryItemCard;
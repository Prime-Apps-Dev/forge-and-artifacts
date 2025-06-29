// src/components/modals/ManagePersonnelModal.jsx
import React, { memo, useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { definitions } from '../../data/definitions/index.js';
import Button from '../ui/buttons/Button.jsx';
import ImageWithFallback from '../ui/display/ImageWithFallback.jsx';
import { UI_CONSTANTS } from '../../constants/ui.js';
import { formatCostsJsx, formatNumber } from '../../utils/formatters.jsx';
import Tooltip from '../ui/display/Tooltip.jsx';
import { getItemImageSrc } from '../../utils/helpers.js';

const EquipmentSlot = ({ slotType, personnel, onEquipClick }) => {
    const { displayedGameState: gameState } = useGame();
    const itemId = personnel.equipment?.[slotType];
    const item = itemId ? gameState.inventory.find(i => i.uniqueId === itemId) : null;
    const itemDef = item ? definitions.items[item.itemKey] : null;

    const slotName = slotType === 'tool' ? 'Инструмент' : 'Снаряжение';

    return (
        <div onClick={onEquipClick} className="bg-black/20 border-2 border-dashed border-gray-600 rounded-lg h-24 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-black/40">
            {item && itemDef ? (
                <Tooltip text={`${itemDef.name} (Ур. ${item.level})`}>
                    <div className="flex flex-col items-center">
                        <img src={getItemImageSrc(item.itemKey, 48)} alt={itemDef.name} className="w-12 h-12 object-contain" />
                        <p className="text-xs text-white mt-1">Ур. {item.level}</p>
                    </div>
                </Tooltip>
            ) : (
                <div className="text-center">
                    <span className="material-icons-outlined text-gray-500 text-3xl">{slotType === 'tool' ? 'construction' : 'shield'}</span>
                    <p className="text-xs text-gray-500">{slotName}</p>
                </div>
            )}
        </div>
    );
};


const AssignmentControls = ({ personnel, personnelDef, onClose }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const currentAssignment = gameState.personnelAssignment[personnel.uniqueId];
    const [selectedAssignment, setSelectedAssignment] = useState(currentAssignment?.assignment || 'unassigned');

    const handleApplyAssignment = () => {
        handlers.handleAssignPersonnel(personnel.uniqueId, personnelDef.role, selectedAssignment === 'unassigned' ? null : selectedAssignment);
        onClose();
    };

    const renderControls = () => {
        switch (personnelDef.role) {
            case 'miner': {
                const availableOres = Object.keys(definitions.resources).filter(key => 
                    key.endsWith('Ore') && (!key.includes('copper') || gameState.purchasedSkills.findCopper) &&
                    (!key.includes('mithril') || gameState.purchasedSkills.mithrilProspecting) &&
                    (!key.includes('adamantite') || gameState.purchasedSkills.adamantiteMining)
                );
                return (
                    <select value={selectedAssignment} onChange={(e) => setSelectedAssignment(e.target.value)} className="w-full h-12 px-2 bg-gray-800 border border-gray-600 rounded-md text-white font-semibold">
                        <option value="unassigned">Снять с работы</option>
                        {availableOres.map(oreKey => (
                            <option key={oreKey} value={oreKey}>{definitions.resources[oreKey].name}</option>
                        ))}
                    </select>
                );
            }
            case 'trader': {
                 const assignedShelves = Object.values(gameState.personnelAssignment)
                    .filter(a => a.role === 'trader' && a.assignment !== currentAssignment?.assignment)
                    .map(a => a.assignment);
                const availableShelves = gameState.shopShelves.filter((shelf, index) => !assignedShelves.includes(`shelf_${index}`));

                return (
                    <select value={selectedAssignment} onChange={(e) => setSelectedAssignment(e.target.value)} className="w-full h-12 px-2 bg-gray-800 border border-gray-600 rounded-md text-white font-semibold">
                        <option value="unassigned">Снять с работы</option>
                        {availableShelves.map((shelf, index) => {
                            const actualIndex = gameState.shopShelves.findIndex(s => s.id === shelf.id);
                            return <option key={shelf.id || index} value={`shelf_${actualIndex}`}>Полка #{actualIndex + 1}</option>
                        })}
                    </select>
                );
            }
            case 'smelter': {
                const isAssigned = currentAssignment && currentAssignment.assignment === 'smelter';
                return (
                    <Button onClick={() => handlers.handleAssignPersonnel(personnel.uniqueId, 'smelter', isAssigned ? null : 'smelter')} variant={isAssigned ? 'danger' : 'success'}>
                        {isAssigned ? 'Снять с плавильни' : 'Назначить на плавильню'}
                    </Button>
                );
            }
            default:
                return <p className="text-sm text-gray-500 italic">Для этой роли нет конкретных назначений.</p>;
        }
    };
    
    if (personnelDef.role === 'smelter' || ['manager', 'engineer', 'assistant'].includes(personnelDef.role)) {
        return <div className="space-y-2">{renderControls()}</div>;
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex-grow">{renderControls()}</div>
            <Tooltip text="Применить назначение">
                 <button 
                    onClick={handleApplyAssignment} 
                    className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-green-700 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed interactive-element"
                 >
                    <span className="material-icons-outlined text-white">check</span>
                </button>
            </Tooltip>
        </div>
    );
};


const ManagePersonnelModal = ({ personnelId, onClose }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    
    const personnel = useMemo(() => 
        gameState.hiredPersonnel.find(p => p.uniqueId === personnelId),
        [gameState.hiredPersonnel, personnelId]
    );

    const personnelDef = useMemo(() => 
        personnel ? definitions.personnel[personnel.personnelId] : null,
        [personnel]
    );

    const [wage, setWage] = useState(personnel ? { ...personnel.wage } : { sparks: 0, matter: 0 });

    if (!personnel || !personnelDef) {
        return null;
    }
    
    const xpProgressPercentage = (personnel.xpToNextLevel > 0) ? (personnel.xp / personnel.xpToNextLevel) * 100 : 100;
    const moodColor = personnel.mood > 70 ? 'text-green-400' : personnel.mood > 30 ? 'text-yellow-400' : 'text-red-400';
    
    const rarityStyles = {
        common: 'border-gray-500',
        rare: 'border-blue-500',
        epic: 'border-purple-500',
        legendary: 'border-yellow-500'
    };
    const rarityBorderClass = rarityStyles[personnel.rarity] || rarityStyles.common;

    const handleWageChange = (type, value) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 0) {
            setWage(prev => ({ ...prev, [type]: numValue }));
        }
    };
    
    const handleSaveWage = () => {
        handlers.handlePersonnelAction(personnel.uniqueId, 'adjust_wage', wage);
    };

    const getGiftableItems = () => {
        if (!personnelDef.preferences) return [];
        const allPreferences = [
            ...(personnelDef.preferences.love || []),
            ...(personnelDef.preferences.like || []),
            ...(personnelDef.preferences.dislike || [])
        ];
        return allPreferences.filter(itemKey => (gameState[itemKey] || 0) > 0 || (gameState.specialItems[itemKey] || 0) > 0);
    };

    const giftableItems = getGiftableItems();

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div
                className="bg-gray-900 border-2 border-gray-700 rounded-lg shadow-2xl p-6 w-full max-w-lg flex flex-col modal-content max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-cinzel text-2xl text-orange-400">Управление: {personnel.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white material-icons-outlined">close</button>
                </div>

                <div className="grow overflow-y-auto pr-2 space-y-4">
                    <div className="bg-black/20 p-3 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-4">
                            <ImageWithFallback
                                src={personnelDef.faceImg}
                                fallbackSrc={UI_CONSTANTS.DEFAULT_AVATAR_SRC}
                                alt={personnel.name}
                                className={`w-20 h-20 object-contain rounded-full border-4 ${rarityBorderClass}`}
                            />
                            <div className="flex-grow">
                                <h3 className="font-cinzel text-xl font-bold text-white">{personnel.name}</h3>
                                <p className="text-gray-400 text-sm">{personnelDef.name}</p>
                                <div className="w-full bg-gray-800 rounded-full h-2.5 mt-2">
                                    <div className="bg-green-500 h-full rounded-full" style={{ width: `${xpProgressPercentage}%` }}></div>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-2.5 mt-1">
                                    <div className={`h-full rounded-full ${personnel.mood < 30 ? 'bg-red-500' : personnel.mood < 70 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${personnel.mood}%` }}></div>
                                </div>
                            </div>
                        </div>
                        {personnel.traits?.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-700/50">
                                <div className="flex justify-center flex-wrap gap-3">
                                    {personnel.traits.map(traitId => {
                                        const traitDef = definitions.personnelTraits[traitId];
                                        if (!traitDef) return null;
                                        const traitColor = traitDef.type === 'positive' ? 'text-green-400' : 'text-red-400';
                                        return (
                                            <Tooltip key={traitId} text={`${traitDef.name}: ${traitDef.description}`}>
                                                <span className={`material-icons-outlined text-2xl ${traitColor}`}>{traitDef.icon}</span>
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- НОВАЯ СЕКЦИЯ: ЭКИПИРОВКА --- */}
                    <div className="bg-black/20 p-4 rounded-lg border border-gray-700">
                        <h3 className="font-cinzel text-lg text-teal-400 mb-3">Экипировка</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <EquipmentSlot slotType="tool" personnel={personnel} onEquipClick={() => handlers.handleOpenEquipItemModal(personnelId, 'tool')} />
                            <EquipmentSlot slotType="gear" personnel={personnel} onEquipClick={() => handlers.handleOpenEquipItemModal(personnelId, 'gear')} />
                        </div>
                    </div>
                    {/* --- --------------------------- --- */}

                    <div className="bg-black/20 p-4 rounded-lg border border-gray-700">
                        <h3 className="font-cinzel text-lg text-blue-400 mb-3">Назначение на работу</h3>
                         <AssignmentControls personnel={personnel} personnelDef={personnelDef} onClose={onClose} />
                    </div>

                     <div className="bg-black/20 p-4 rounded-lg border border-gray-700">
                        <h3 className="font-cinzel text-lg text-purple-400 mb-3">Книга Учёта</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span>Общее время на работе:</span> <span className="font-bold">{formatTime(personnel.timeWorked || 0)}</span></div>
                            <div className="flex justify-between"><span>Получено подарков:</span> <span className="font-bold">{personnel.giftsReceived || 0}</span></div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-700/50">
                            <h4 className="font-bold text-gray-300 mb-2">Результат за текущую смену (до з/п):</h4>
                            {Object.keys(personnel.sessionStats?.mined || {}).length === 0 && (personnel.sessionStats?.smeltedProgress || 0) === 0 && (personnel.sessionStats?.salesValue || 0) === 0 ? (
                                <p className="text-xs text-gray-500 italic">Сотрудник еще не приступал к работе в этой смене.</p>
                            ) : (
                                <div className="space-y-1 text-xs">
                                    {Object.entries(personnel.sessionStats?.mined || {}).map(([ore, amount]) => (
                                        <div key={ore} className="flex items-center gap-2">
                                            <img src={UI_CONSTANTS.ICON_MAP[ore].icon} className="w-4 h-4" /> 
                                            <span>{definitions.resources[ore].name}:</span> 
                                            <span className="font-bold ml-auto">+{formatNumber(amount)}</span>
                                        </div>
                                    ))}
                                    {(personnel.sessionStats?.smeltedProgress || 0) > 0 && 
                                        <div className="flex items-center gap-2">
                                             <span className="material-icons-outlined text-sm text-orange-400">local_fire_department</span>
                                             <span>Прогресс плавки:</span> 
                                             <span className="font-bold ml-auto">+{formatNumber(personnel.sessionStats.smeltedProgress)}</span>
                                        </div>
                                    }
                                    {(personnel.sessionStats?.salesValue || 0) > 0 && 
                                        <div className="flex items-center gap-2">
                                            <span className="material-icons-outlined text-sm text-yellow-400">bolt</span>
                                            <span>Доход от продаж:</span> 
                                            <span className="font-bold ml-auto">+{formatNumber(personnel.sessionStats.salesValue)}</span>
                                        </div>
                                    }
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-black/20 p-4 rounded-lg border border-gray-700">
                        <h3 className="font-cinzel text-lg text-yellow-400 mb-3">Настройка зарплаты</h3>
                        <p className="text-sm text-gray-400 mb-4">Зарплата выплачивается каждые 10 минут. Повышение зарплаты может улучшить настроение.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-white mb-2">
                                    <span className="material-icons-outlined text-yellow-400">bolt</span>
                                    Искры: {wage.sparks}
                                </label>
                                <input type="range" min={personnelDef.baseWage.sparks || 0} max={(personnelDef.baseWage.sparks || 0) * 5} step="10" value={wage.sparks} onChange={e => handleWageChange('sparks', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 select-none" />
                            </div>
                             <div>
                                <label className="flex items-center gap-2 text-white mb-2">
                                    <span className="material-icons-outlined text-purple-400">bubble_chart</span>
                                    Материя: {wage.matter}
                                </label>
                                <input type="range" min={personnelDef.baseWage.matter || 0} max={(personnelDef.baseWage.matter || 0) * 5} step="1" value={wage.matter} onChange={e => handleWageChange('matter', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500 select-none" />
                            </div>
                        </div>
                         <Button onClick={handleSaveWage} className="mt-4 w-full" variant="primary">
                            Установить зарплату
                         </Button>
                    </div>

                    <div className="bg-black/20 p-4 rounded-lg border border-gray-700">
                        <h3 className="font-cinzel text-lg text-green-400 mb-3">Сделать подарок</h3>
                        <p className="text-sm text-gray-400 mb-4">Подарки значительно повышают настроение. Эффективность зависит от предпочтений сотрудника.</p>
                        <p className="text-sm text-white mb-2">Настроение: <span className={moodColor}>{Math.round(personnel.mood)}%</span></p>
                        {giftableItems.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {giftableItems.map(itemKey => {
                                    const itemDef = definitions.specialItems[itemKey] || definitions.resources[itemKey];
                                    const cost = { [itemKey]: 1 };
                                    return (
                                        <Button 
                                            key={itemKey}
                                            variant="secondary"
                                            className="h-full flex flex-col items-center justify-center text-xs p-1"
                                            onClick={() => handlers.handlePersonnelAction(personnel.uniqueId, 'give_gift', itemKey)}
                                        >
                                            <p className="mb-1">{itemDef.name}</p>
                                            ({formatCostsJsx(cost, gameState)})
                                        </Button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">У вас нет предметов, которые можно подарить.</p>
                        )}
                    </div>
                </div>

                <Button onClick={onClose} className="mt-6">
                    Закрыть
                </Button>
            </div>
        </div>
    );
};

export default ManagePersonnelModal;
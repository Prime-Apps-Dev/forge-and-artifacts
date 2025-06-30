// src/components/ui/cards/ComponentItem.jsx
import React, { memo, useMemo } from 'react';
import { definitions } from '../../../data/definitions/index.js';
import { useGame } from '../../../context/useGame.js'; // ИЗМЕНЕН ПУТЬ ИМПОРТА
import { getScaledComponentProgress } from '../../../utils/helpers.js';

const STAT_NAMES = {
    damage: 'Урон',
    defense: 'Защита',
    durability: 'Прочность',
    sharpness: 'Острота',
    handling: 'Удобство',
    speed: 'Скорость',
    utility: 'Полезность',
    armorPenetration: 'Пробитие',
    energyDamage: 'Энерг. урон',
    resonance: 'Резонанс',
    appeal: 'Привлекательность',
    critChance: 'Шанс крита',
    comfort: 'Комфорт',
    flexibility: 'Гибкость',
    capacity: 'Вместимость',
    precision: 'Точность',
    power: 'Мощность',
    clarity: 'Чистота',
    coreDensity: 'Плотность ядра',
    structuralIntegrity: 'Прочность',
    energyResistance: 'Энергозащита',
    purity: 'Чистота',
    weight: 'Вес',
    focusPower: 'Сила фокуса'
};

const ComponentItem = memo(({ component, orderState }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const itemDef = definitions.items[orderState.itemKey];

    const progress = orderState.componentProgress[component.id] || 0;
    const isComplete = !!orderState.completedComponents[component.id];
    const isActive = orderState.activeComponentId === component.id;

    const scaledRequiredProgress = useMemo(() => 
        getScaledComponentProgress(itemDef, component),
    [itemDef, component]);

    const dependenciesMet = useMemo(() => 
        !component.requires || component.requires.every(reqId => 
            !!orderState.completedComponents[reqId]
        ), 
    [component.requires, orderState.completedComponents]);

    const canSelect = !isComplete && dependenciesMet;

    let classes = "p-3 border-l-4 transition-colors duration-200 rounded-r-md ";
    if (isComplete) {
        classes += "border-green-500 bg-green-500/10";
    } else if (isActive) {
        classes += "border-orange-500 bg-orange-500/20 shadow-lg shadow-orange-500/10";
    } else if (canSelect) {
        classes += "border-gray-500 hover:bg-gray-700/50 cursor-pointer";
    } else {
        classes += "border-gray-800 filter grayscale opacity-60 cursor-not-allowed";
    }

    const costString = useMemo(() => {
        if (!component.cost) return 'Бесплатно';
        const costWithReduction = {};
        for(const res in component.cost) {
            if (res === 'sparks' || res === 'matter') {
                costWithReduction[res] = component.cost[res];
            } else {
                 costWithReduction[res] = Math.max(0, component.cost[res] - (gameState.componentCostReduction || 0));
            }
        }

        return Object.entries(costWithReduction).map(([key, value]) => {
            const resourceName = definitions.specialItems[key]?.name || definitions.resources[key]?.name || key;
            return `${value} ${resourceName}`;
        }).join(', ');
    }, [component.cost, gameState.componentCostReduction]);

    const completedData = orderState.completedComponents[component.id];

    return (
        <div className={classes} onClick={() => canSelect && handlers.handleSelectComponent(component.id)}>
            <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                    <span className="material-icons-outlined text-base text-gray-500">{definitions.workstations[component.workstation].icon}</span>
                    <span className="font-bold">{component.name}</span>
                </div>
                {!isComplete && (
                    <span className="text-xs text-gray-400">{costString}</span>
                )}
                 {isComplete && (
                    <span className="font-bold text-green-400 flex items-center gap-1">
                        <span className="material-icons-outlined text-sm">check_circle</span>
                        Готово
                    </span>
                )}
            </div>
            {!isComplete ? (
                <div className="w-full bg-gray-900 rounded-full h-2.5 mt-2 relative overflow-hidden border border-black/20">
                    <div
                        className="bg-orange-500 h-full rounded-full transition-width duration-200"
                        style={{ width: `${(progress / scaledRequiredProgress) * 100}%` }}
                    ></div>
                </div>
            ) : (
                <div className="text-xs mt-2 text-gray-300 bg-black/20 p-2 rounded-md">
                    <p>Качество компонента: <span className="font-bold text-yellow-400">{completedData.quality.toFixed(2)}x</span></p>
                    {completedData.finalStats && Object.keys(completedData.finalStats).length > 0 && (
                        <div className="flex flex-wrap gap-x-3">
                            <span>Характеристики:</span>
                            {Object.entries(completedData.finalStats).map(([stat, value]) => (
                                <span key={stat} className="text-white">
                                    {STAT_NAMES[stat] || stat}: <span className="font-semibold text-green-400">+{value.toFixed(1)}</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

export default ComponentItem;
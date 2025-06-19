import React from 'react';
import { definitions } from '../../data/definitions';
import { formatCosts, formatNumber } from '../../utils/helpers';
import Tooltip from './Tooltip';

const PersonnelUpgradeButton = React.memo(({ upgradeId, gameState, onBuyUpgrade }) => {
    const upgrade = definitions.personnel[upgradeId];
    if (!upgrade) return null;

    const level = gameState.upgradeLevels[upgradeId] || 0;
    let isDisabled = false;
    let displayCosts1 = {};
    let displayCosts10 = {}; // Будет использоваться для тултипа

    // Логика определения стоимости для 1 уровня
    if (level >= upgrade.maxLevel) {
        isDisabled = true;
    } else {
        for (const resourceType in upgrade.baseCost) {
            displayCosts1[resourceType] = Math.floor(upgrade.baseCost[resourceType] * Math.pow(upgrade.costIncrease, level));
        }

        // Проверка доступности для 1 уровня
        for (const resourceType in displayCosts1) {
            const costAmount = displayCosts1[resourceType];
            const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType === 'matter' ? 'main' : 'specialItems';
            const currentAmount = resourceStorage === 'main' ? gameState[resourceType] : gameState.specialItems?.[resourceType] || 0;
            if (currentAmount < costAmount) {
                isDisabled = true;
                break;
            }
        }

        // Логика определения стоимости для 10 уровней (для тултипа)
        let tempIsDisabled10 = false;
        for (let i = 0; i < 10; i++) {
            if (level + i < upgrade.maxLevel) {
                for (const resourceType in upgrade.baseCost) {
                    displayCosts10[resourceType] = (displayCosts10[resourceType] || 0) + Math.floor(upgrade.baseCost[resourceType] * Math.pow(upgrade.costIncrease, level + i));
                }
            } else {
                tempIsDisabled10 = true; // Невозможно купить все 10 уровней
                break;
            }
        }
        if (!tempIsDisabled10) { // Проверяем, если покупка 10 уровней не выходит за maxLevel
            for (const resourceType in displayCosts10) {
                const costAmount = displayCosts10[resourceType];
                const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType === 'matter' ? 'main' : 'specialItems';
                const currentAmount = resourceStorage === 'main' ? gameState[resourceType] : gameState.specialItems?.[resourceType] || 0;
                if (currentAmount < costAmount) {
                    tempIsDisabled10 = true;
                    break;
                }
            }
        }
    }
    
    // Текст для тултипа
    let tooltipContent = '';
    if (level >= upgrade.maxLevel) {
        tooltipContent = `Максимальный уровень: ${level}`;
    } else {
        tooltipContent = `Нажмите для улучшения. Стоимость x1: ${formatCosts(displayCosts1, gameState).replace(/<[^>]*>/g, '')}`; // Убираем HTML-теги для тултипа
        if (!Object.keys(displayCosts10).every(key => displayCosts10[key] === 0) && level + 10 <= upgrade.maxLevel) { // Проверяем, что displayCosts10 не пустой
            tooltipContent += `\nСтоимость x10: ${formatCosts(displayCosts10, gameState).replace(/<[^>]*>/g, '')}`;
        }
        if (isDisabled) {
             tooltipContent += "\nНедостаточно ресурсов.";
        }
    }
    
    return (
        <Tooltip text={tooltipContent}>
            <button 
                onClick={() => { if (!isDisabled) onBuyUpgrade(upgradeId, 'personnel', 1); }} // Клик по карточке покупает x1
                disabled={isDisabled}
                className="interactive-element bg-transparent border border-gray-700 p-4 rounded-lg w-full flex flex-col items-start hover:enabled:border-orange-500 hover:enabled:shadow-lg hover:enabled:shadow-orange-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <div className="grow">
                    <h4 className="font-bold font-cinzel text-white">{upgrade.name} {level > 0 && `(Ур. ${level})`}</h4>
                    <p className="text-sm text-gray-400 my-1">{upgrade.description}</p>
                </div>
                {level >= upgrade.maxLevel ? (
                    <span className="font-bold text-sm text-green-400 mt-2">Макс. Уровень ({level})</span>
                ) : (
                    <div className='mt-2 text-sm flex flex-col items-start w-full' dangerouslySetInnerHTML={{ __html: formatCosts(displayCosts1, gameState) }}></div>
                )}
            </button>
        </Tooltip>
    );
});

export default PersonnelUpgradeButton;
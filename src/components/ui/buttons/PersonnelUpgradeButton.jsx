// src/components/ui/buttons/PersonnelUpgradeButton.jsx
import React from 'react';
import { definitions } from '../../../data/definitions';
import { formatCosts, formatNumber } from '../../../utils/formatters';
import Tooltip from '../display/Tooltip';

const PersonnelUpgradeButton = React.memo(({ upgradeId, gameState, onBuyUpgrade }) => {
    const upgrade = definitions.personnel[upgradeId];
    if (!upgrade) return null;

    const level = gameState.upgradeLevels[upgradeId] || 0;
    let isDisabled = false;
    let displayCosts1 = {};

    if (level >= upgrade.maxLevel) {
        isDisabled = true;
    } else {
        for (const resourceType in upgrade.baseCost) {
            displayCosts1[resourceType] = Math.floor(upgrade.baseCost[resourceType] * Math.pow(upgrade.costIncrease, level));
        }

        for (const resourceType in displayCosts1) {
            const costAmount = displayCosts1[resourceType];
            const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType === 'matter' ? 'main' : 'specialItems';
            const currentAmount = resourceStorage === 'main' ? gameState[resourceType] : gameState.specialItems?.[resourceType] || 0;
            if (currentAmount < costAmount) {
                isDisabled = true;
                break;
            }
        }
    }
    
    let canBuy10 = false;
    let displayCosts10 = {};
    if (level + 10 <= upgrade.maxLevel) {
        let tempCanBuy10 = true;
        let calculatedCosts10 = {};
        for (let i = 0; i < 10; i++) {
            for (const resourceType in upgrade.baseCost) {
                calculatedCosts10[resourceType] = (calculatedCosts10[resourceType] || 0) + Math.floor(upgrade.baseCost[resourceType] * Math.pow(upgrade.costIncrease, level + i));
            }
        }

        for (const resourceType in calculatedCosts10) {
            const costAmount = calculatedCosts10[resourceType];
            const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType === 'matter' ? 'main' : 'specialItems';
            const currentAmount = resourceStorage === 'main' ? gameState[resourceType] : gameState.specialItems?.[resourceType] || 0;
            if (currentAmount < costAmount) {
                tempCanBuy10 = false;
                break;
            }
        }
        if (tempCanBuy10) {
            canBuy10 = true;
            displayCosts10 = calculatedCosts10;
        }
    }


    let tooltipContent = '';
    if (level >= upgrade.maxLevel) {
        tooltipContent = `Максимальный уровень: ${level}`;
    } else {
        tooltipContent = `Нажмите для улучшения. Стоимость x1: ${formatCosts(displayCosts1, gameState).replace(/<[^>]*>/g, '')}`;
        if (!Object.keys(displayCosts10).every(key => displayCosts10[key] === 0) && level + 10 <= upgrade.maxLevel) {
            tooltipContent += `\nСтоимость x10: ${formatCosts(displayCosts10, gameState).replace(/<[^>]*>/g, '')}`;
        }
        if (isDisabled) {
             tooltipContent += "\nНедостаточно ресурсов.";
        }
    }
    
    return (
        <Tooltip text={tooltipContent}>
            <button 
                onClick={() => { if (!isDisabled) onBuyUpgrade(upgradeId, 'personnel', 1); }}
                disabled={isDisabled}
                className="interactive-element bg-transparent border border-gray-700 p-4 rounded-lg w-full flex flex-col items-start hover:enabled:border-orange-500 hover:enabled:shadow-lg hover:enabled:shadow-orange-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <div className="grow">
                    <h4 className="font-bold font-cinzel text-white text-left">{upgrade.name} {level > 0 && `(Ур. ${level}/${upgrade.maxLevel})`}</h4> {/* Обновлено: добавлено text-left */}
                    <p className="text-sm text-gray-400 my-1">{upgrade.description}</p>
                </div>
                {level >= upgrade.maxLevel ? (
                    <span className="font-bold text-sm text-green-400 mt-2">Макс. Уровень ({level})</span>
                ) : (
                    <div className='mt-2 text-sm flex flex-col items-start w-full'>
                        <span className="font-bold text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: formatCosts(displayCosts1, gameState) }}></span>
                        {canBuy10 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); if (canBuy10) onBuyUpgrade(upgradeId, 'personnel', 10); }}
                                disabled={!canBuy10 || isDisabled}
                                className="interactive-element mt-2 bg-orange-800/80 text-white text-xs px-2 py-1 rounded-md hover:enabled:bg-orange-700 disabled:opacity-50"
                            >
                                Купить x10 (<span dangerouslySetInnerHTML={{ __html: formatCosts(displayCosts10, gameState) }}></span>)
                            </button>
                        )}
                    </div>
                )}
            </button>
        </Tooltip>
    );
});

export default PersonnelUpgradeButton;
import React from 'react';
import { definitions } from '../../data/definitions';
import { formatCosts, formatNumber } from '../../utils/helpers'; // Импортируем formatCosts
import { hasReputation } from '../../utils/helpers';

const FactionUpgradeButton = React.memo(({ upgradeId, gameState, onBuyFactionUpgrade }) => {
    const upgrade = definitions.factionUpgrades[upgradeId];
    if (!upgrade) return null;

    const isPurchased = gameState.purchasedFactionUpgrades[upgradeId];
    if (isPurchased) {
         return (
            <div className="bg-green-800/20 border border-green-700 p-3 rounded-lg text-left w-full opacity-70">
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-green-300">{upgrade.name}</h4>
                    <span className="material-icons-outlined text-green-400">check_circle</span>
                </div>
                <p className="text-sm text-gray-400 my-1">{upgrade.description}</p>
            </div>
        );
    }
    
    const displayCosts = { ...upgrade.cost }; // Копируем стоимость
    let isDisabled = false;
    let buttonText = '';

    const meetsRep = hasReputation(gameState.reputation, upgrade.factionId, upgrade.requiredRep);
    
    if (!meetsRep) {
        const repName = definitions.reputationLevels.find(r => r.id === upgrade.requiredRep).name;
        isDisabled = true;
        buttonText = `Нужно: ${repName}`;
    } else {
        // Проверка доступности ресурсов
        for (const resourceType in displayCosts) {
            const costAmount = displayCosts[resourceType];
            const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType === 'matter' ? 'main' : 'specialItems';
            const currentAmount = resourceStorage === 'main' ? gameState[resourceType] : gameState.specialItems?.[resourceType] || 0;
            if (currentAmount < costAmount) {
                isDisabled = true;
                break;
            }
        }
        // Если не отключено из-за репутации и есть ресурсы, формируем текст стоимости
        if (!isDisabled) {
            buttonText = `<div class="flex items-center justify-center gap-1">${formatCosts(displayCosts, gameState)}</div>`;
        } else {
            // Если не хватает ресурсов
            buttonText = `<div class="flex items-center justify-center gap-1 opacity-50">${formatCosts(displayCosts, gameState)}</div>`;
        }
    }


    return (
        <div className="bg-black/20 border border-gray-700 p-3 rounded-lg text-left w-full">
            <h4 className="font-bold text-orange-300">{upgrade.name}</h4>
            <p className="text-sm text-gray-400 my-1">{upgrade.description}</p>
            <button 
                onClick={() => onBuyFactionUpgrade(upgradeId)}
                disabled={isDisabled}
                className="interactive-element w-full text-center mt-2 bg-orange-800/70 text-white font-bold px-4 py-2 rounded-md hover:enabled:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               <span dangerouslySetInnerHTML={{__html: buttonText}}></span>
            </button>
        </div>
    );
});

export default FactionUpgradeButton;
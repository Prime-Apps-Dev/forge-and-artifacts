import React, { useState } from 'react';
import { definitions } from '../../../data/definitions';
import { formatCosts, formatNumber } from '../../../utils/formatters';
import Tooltip from '../display/Tooltip';

const ShopUpgradeButton = React.memo(({ upgradeId, gameState, onBuyUpgrade, upgradeType = 'upgrades' }) => {
    const upgradeDefs = upgradeType === 'upgrades' ? definitions.upgrades : definitions.shopUpgrades;
    const upgrade = upgradeDefs[upgradeId];
    if (!upgrade) return null;

    const [multiplier, setMultiplier] = useState(1);

    const level = gameState.upgradeLevels[upgradeId] || 0;

    const isMultiLevel = 'isMultiLevel' in upgrade && upgrade.isMultiLevel;
    let isDisabled = false;
    let displayCosts = {};
    let buttonText = '';

    const availableMultipliers = [1, 2, 5, 10, 20, 50];
    let filteredMultipliers = availableMultipliers;

    if (isMultiLevel) {
        filteredMultipliers = availableMultipliers.filter(mult => (level + mult) <= upgrade.maxLevel);
        if (filteredMultipliers.length === 0) filteredMultipliers = [1];
        if (!filteredMultipliers.includes(multiplier)) {
            setMultiplier(filteredMultipliers[0]);
        }

        if (level >= upgrade.maxLevel) {
            isDisabled = true;
            buttonText = `Макс. (${level})`;
        } else {
            const baseCosts = upgrade.baseCost;
            for (const resourceType in baseCosts) {
                displayCosts[resourceType] = Math.floor(baseCosts[resourceType] * Math.pow(upgrade.costIncrease, level));
            }
            for (const resourceType in displayCosts) {
                displayCosts[resourceType] *= multiplier;
            }
        }
    } else {
        if (level > 0) {
            isDisabled = true;
            buttonText = "Куплено";
        } else {
            displayCosts = { ...upgrade.cost };
        }
        filteredMultipliers = [1];
        if (multiplier !== 1) setMultiplier(1);
    }

    if (!isDisabled) {
        for (const resourceType in displayCosts) {
            const costAmount = displayCosts[resourceType];
            const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType === 'matter' ? 'main' : 'specialItems';
            const currentAmount = resourceStorage === 'main' ? gameState[resourceType] : gameState.specialItems?.[resourceType] || 0;
            if (currentAmount < costAmount) {
                isDisabled = true;
                break;
            }
        }
    }

    if (upgradeType === 'shopUpgrades' && upgrade.requiredShopReputation) {
        if (gameState.shopReputation < upgrade.requiredShopReputation) {
            isDisabled = true;
            buttonText = `Репутация: ${upgrade.requiredShopReputation}`;
        }
    }
    
    if (buttonText === '') {
        buttonText = `<div class="flex flex-col items-start w-full">${formatCosts(displayCosts, gameState)}</div>`;
    }

    const getNextMultiplier = (current, multipliersArray) => {
        const currentIndex = multipliersArray.indexOf(current);
        const nextIndex = (currentIndex + 1) % multipliersArray.length;
        return multipliersArray[nextIndex];
    };

    return (
        <button
            onClick={() => { if (!isDisabled) onBuyUpgrade(multiplier); }}
            disabled={isDisabled}
            className="interactive-element bg-transparent border border-gray-700 p-4 rounded-lg text-left w-full hover:enabled:border-orange-500 hover:enabled:shadow-lg hover:enabled:shadow-orange-500/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between"
        >
            <div className="flex-grow">
                <h4 className="font-bold font-cinzel">{upgrade.name} {isMultiLevel && level > 0 && `(Ур. ${level})`}</h4>
                <p className="text-sm text-gray-400 my-1">{upgrade.description}</p>
                <span className={`font-bold text-sm text-gray-300`} dangerouslySetInnerHTML={{ __html: buttonText }}></span>
            </div>

            {isMultiLevel && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setMultiplier(prev => getNextMultiplier(prev, filteredMultipliers));
                    }}
                    disabled={isDisabled || filteredMultipliers.length <= 1}
                    className="interactive-element bg-gray-700 text-white text-xs px-2 py-1 rounded-md hover:bg-gray-600 flex-shrink-0"
                    title="Кликните для смены множителя покупки"
                >
                    x{multiplier}
                </button>
            )}
        </button>
    );
});

export default ShopUpgradeButton;
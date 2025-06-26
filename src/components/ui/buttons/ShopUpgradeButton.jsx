// src/components/ui/buttons/ShopUpgradeButton.jsx
import React, { useState, useMemo } from 'react';
import { definitions } from '../../../data/definitions/index.js';
import { formatCostsJsx } from '../../../utils/formatters.jsx';
import Tooltip from '../display/Tooltip';
import { useGame } from '../../../context/GameContext.jsx';

const ShopUpgradeButton = React.memo(({ upgradeId, upgradeType = 'upgrades' }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const upgradeDefs = upgradeType === 'upgrades' ? definitions.upgrades : definitions.shopUpgrades;
    const upgrade = upgradeDefs[upgradeId];
    if (!upgrade) return null;

    const [multiplier, setMultiplier] = useState(1);
    const level = gameState.upgradeLevels[upgradeId] || 0;
    const isMultiLevel = 'isMultiLevel' in upgrade && upgrade.isMultiLevel;

    const { isDisabled, buttonContent, filteredMultipliers } = useMemo(() => {
        let isDisabled = false;
        let buttonContent = null;
        const availableMultipliers = [1, 2, 5, 10, 20, 50];
        let displayCosts = {};
        
        let currentFilteredMultipliers = isMultiLevel 
            ? availableMultipliers.filter(mult => (level + mult) <= upgrade.maxLevel) 
            : [1];
        if (currentFilteredMultipliers.length === 0) currentFilteredMultipliers = [1];
        const currentMultiplier = currentFilteredMultipliers.includes(multiplier) ? multiplier : currentFilteredMultipliers[0];

        if (isMultiLevel) {
            if (level >= upgrade.maxLevel) {
                isDisabled = true;
                buttonContent = `Макс. (${level})`;
            } else {
                const baseCosts = upgrade.baseCost;
                for (let i = 0; i < currentMultiplier; i++) {
                     for (const resourceType in baseCosts) {
                        displayCosts[resourceType] = (displayCosts[resourceType] || 0) + Math.floor(baseCosts[resourceType] * Math.pow(upgrade.costIncrease, level + i));
                    }
                }
            }
        } else {
            if (level > 0) {
                isDisabled = true;
                buttonContent = "Куплено";
            } else {
                displayCosts = { ...upgrade.cost };
            }
        }

        if (buttonContent === null) {
            for (const resourceType in displayCosts) {
                const costAmount = displayCosts[resourceType];
                const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType === 'matter' ? 'main' : 'specialItems';
                const currentAmount = resourceStorage === 'main' ? gameState[resourceType] : gameState.specialItems?.[resourceType] || 0;
                if (currentAmount < costAmount) {
                    isDisabled = true;
                    break;
                }
            }
            buttonContent = <div className="flex flex-wrap items-center gap-2">{formatCostsJsx(displayCosts, gameState)}</div>;
        }

        if (upgradeType === 'shopUpgrades' && upgrade.requiredShopReputation) {
            if (gameState.shopXP < upgrade.requiredShopReputation) {
                isDisabled = true;
                buttonContent = `Репутация: ${upgrade.requiredShopReputation}`;
            }
        }

        return { isDisabled, buttonContent, filteredMultipliers: currentFilteredMultipliers, displayCosts };
    }, [upgrade, level, multiplier, gameState]);

    const getNextMultiplier = (current, multipliersArray) => {
        const currentIndex = multipliersArray.indexOf(current);
        return multipliersArray[(currentIndex + 1) % multipliersArray.length];
    };

    return (
        <button
            onClick={() => { if (!isDisabled) handlers.handleBuyUpgrade(upgradeId, upgradeType, multiplier); }}
            disabled={isDisabled}
            className="interactive-element bg-transparent border border-gray-700 p-4 rounded-lg text-left w-full hover:enabled:border-orange-500 hover:enabled:shadow-lg hover:enabled:shadow-orange-500/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between"
        >
            <div className="flex-grow">
                <h4 className="font-bold font-cinzel text-white">{upgrade.name} {isMultiLevel && level > 0 && `(Ур. ${level}/${upgrade.maxLevel})`}</h4>
                <p className="text-sm text-gray-400 my-1">{upgrade.description}</p>
                <div className="font-bold text-sm text-gray-300">{buttonContent}</div>
            </div>

            {isMultiLevel && (level < upgrade.maxLevel) && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setMultiplier(prev => getNextMultiplier(prev, filteredMultipliers));
                    }}
                    disabled={isDisabled || filteredMultipliers.length <= 1}
                    className="interactive-element bg-gray-700 text-white text-xs px-2 py-1 rounded-md hover:bg-gray-600 flex-shrink-0 disabled:opacity-50"
                    title="Кликните для смены множителя покупки"
                >
                    x{multiplier}
                </button>
            )}
        </button>
    );
});

export default ShopUpgradeButton;
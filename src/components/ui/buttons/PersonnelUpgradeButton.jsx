// src/components/ui/buttons/PersonnelUpgradeButton.jsx
import React from 'react';
import { definitions } from '../../../data/definitions/index.js';
import { formatCostsJsx } from '../../../utils/formatters.jsx';
import Tooltip from '../display/Tooltip';
import { useGame } from '../../../context/useGame.js';
import Button from './Button.jsx';

const PersonnelUpgradeButton = React.memo(({ upgradeId }) => {
    const { displayedGameState: gameState, handlers } = useGame();
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

    return (
        <Tooltip text={upgrade.description}>
            <button
                onClick={() => { if (!isDisabled) handlers.handleBuyUpgrade(upgradeId, 'personnel', 1); }}
                disabled={isDisabled}
                className="interactive-element bg-transparent border border-gray-700 p-4 rounded-lg w-full flex flex-col items-start hover:enabled:border-orange-500 hover:enabled:shadow-lg hover:enabled:shadow-orange-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <div className="grow">
                    <h4 className="font-bold font-cinzel text-white text-left">{upgrade.name} {level > 0 && `(Ур. ${level}/${upgrade.maxLevel})`}</h4>
                    <p className="text-sm text-gray-400 my-1">{upgrade.description}</p>
                </div>
                {level >= upgrade.maxLevel ? (
                    <span className="font-bold text-sm text-green-400 mt-2">Макс. Уровень ({level})</span>
                ) : (
                    <div className='mt-2 text-sm flex items-center justify-start w-full'>
                        {formatCostsJsx(displayCosts1, gameState)}
                    </div>
                )}
            </button>
        </Tooltip>
    );
});

export default PersonnelUpgradeButton;
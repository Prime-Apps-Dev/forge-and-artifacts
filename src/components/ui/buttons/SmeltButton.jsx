// src/components/ui/buttons/SmeltButton.jsx
import React, { memo } from 'react';
import Tooltip from '../display/Tooltip';
import { definitions } from '../../../data/definitions/index.js';
import { getResourceImageSrc } from '../../../utils/helpers';
import { useGame } from '../../../context/useGame.js';

const SmeltButton = memo(({ recipeId }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const recipe = definitions.recipes[recipeId];
    if (!recipe) return null;

    let hasEnough = true;
    for (const resourceKey in recipe.input) {
        const cost = recipe.input[resourceKey];
        const currentAmount = gameState[resourceKey] || gameState.specialItems[resourceKey] || 0;
        if (currentAmount < cost) {
            hasEnough = false;
            break;
        }
    }

    let isDisabled = false;
    if (gameState.purchasedSkills.smeltingAutomation) {
        isDisabled = gameState.smeltingQueue.length >= gameState.smeltingQueueCapacity;
    } else {
        isDisabled = !!gameState.smeltingProcess;
    }

    if (!hasEnough) {
        isDisabled = true;
    }

    const costStrings = Object.entries(recipe.input).map(([key, value]) => {
        const resourceName = definitions.resources[key]?.name || definitions.specialItems[key]?.name || key;
        return `${value} ${resourceName}`;
    });
    
    let tooltipText = `Требуется: ${costStrings.join(' + ')}`;
    if (isDisabled) {
        if (!hasEnough) {
            tooltipText = `Недостаточно ресурсов. Требуется: ${costStrings.join(' + ')}`;
        } else if (gameState.purchasedSkills.smeltingAutomation) {
            tooltipText = "Очередь плавки заполнена";
        } else {
            tooltipText = "Плавильня занята";
        }
    }

    const buttonElement = (
        <button
            onClick={() => handlers.handleSmelt(recipeId)}
            disabled={isDisabled}
            className={`flex flex-col items-center justify-start text-center
                bg-gray-700/50 rounded-lg p-4 h-48 w-40 flex-shrink-0
                border-2 ${isDisabled ? 'border-gray-800 opacity-50 cursor-not-allowed' : 'border-gray-600 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10'}
                interactive-element`}
        >
           <img
               src={recipe.icon || getResourceImageSrc(Object.keys(recipe.output)[0], 96)}
               alt={recipe.name}
               className="h-24 w-auto mb-2 object-contain img-rounded-corners"
           />
           <span className="font-bold text-base leading-tight flex-grow overflow-hidden text-ellipsis px-1">
               {recipe.name}
           </span>
        </button>
    );

    return (
        <Tooltip text={tooltipText}>
            <div>{buttonElement}</div>
        </Tooltip>
    );
});

export default SmeltButton;
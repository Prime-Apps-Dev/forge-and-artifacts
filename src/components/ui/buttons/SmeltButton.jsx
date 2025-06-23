// src/components/ui/SmeltButton.jsx
import React, { memo } from 'react';
import Tooltip from '../display/Tooltip';
import { definitions } from '../../../data/definitions';
import { getResourceImageSrc } from '../../../utils/helpers';

const resourceNames = {
    ironOre: 'железной руды',
    copperOre: 'медной руды',
    mithrilOre: 'мифриловой руды',
    adamantiteOre: 'адамантитовой руды',
    ironIngots: 'железных слитков',
    copperIngots: 'медных слитков',
    adamantiteIngots: 'адамантитовых слитков',
    matter: 'материи',
    sparks: 'искр'
};

const SmeltButton = memo(({ recipeId, onClick, disabled, gameState }) => {
    const recipe = definitions.recipes[recipeId];
    if (!recipe) return null;

    const costStrings = Object.entries(recipe.input).map(([resourceKey, baseCost]) => {
        let finalCost = baseCost;
        if (resourceKey === 'ironOre' && gameState.purchasedSkills.efficientBellows) {
            finalCost = Math.max(1, baseCost - 2);
        }
        if (resourceKey === 'copperOre' && gameState.purchasedSkills.crucibleRefinement) {
            finalCost = Math.max(1, baseCost - 2);
        }
        
        const resourceName = resourceNames[resourceKey] || resourceKey;
        return `${finalCost} ${resourceName}`;
    });
    
    const tooltipText = `Требуется: ${costStrings.join(' + ')}`;

    const buttonContent = (
        <button
            onClick={() => onClick(recipeId)}
            disabled={disabled}
            className={`flex flex-col items-center justify-start text-center
                bg-gray-700/50 rounded-lg p-4
                h-48 w-40 flex-shrink-0 flex-grow-0 max-w-[160px] max-h-[192px]
                border-2 ${disabled ? 'border-gray-800 opacity-50 cursor-not-allowed' : 'border-gray-600 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10'}
                interactive-element`}
        >
           <img
               src={getResourceImageSrc(Object.keys(recipe.output)[0], 96)}
               alt={recipe.name}
               className="h-24 w-auto mb-2 object-contain img-rounded-corners"
           />
           <span className="font-bold text-base leading-tight flex-grow overflow-hidden text-ellipsis px-1">
               {recipe.name}
           </span>
        </button>
    );

    return (
        <div className="group">
            <Tooltip text={tooltipText}>
                {buttonContent}
            </Tooltip>
        </div>
    );
});

export default SmeltButton;
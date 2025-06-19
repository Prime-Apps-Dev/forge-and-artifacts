import React, { memo } from 'react';
import Tooltip from './Tooltip';
import { definitions } from '../../data/definitions';

// Словарь для правильных названий ресурсов
const resourceNames = {
    ironOre: 'железной руды',
    copperOre: 'медной руды',
    mithrilOre: 'мифриловой руды',
    adamantiteOre: 'адамантитовой руды',
    ironIngots: 'железных слитков',
    copperIngots: 'медных слитков',
    adamantiteIngots: 'адамантитовых слитков',
    matter: 'материи'
};

const SmeltButton = memo(({ recipeId, children, onClick, disabled, gameState }) => {
    const recipe = definitions.recipes[recipeId];
    if (!recipe) return null;

    // ИЗМЕНЕНИЕ: Рассчитываем реальную стоимость и генерируем текст подсказки
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

    return (
        <Tooltip text={tooltipText}>
            <button
                onClick={() => onClick(recipeId)}
                disabled={disabled}
                className={`interactive-element flex-1 bg-gray-700/50 border border-gray-600 text-white p-4 rounded-lg cursor-pointer text-base flex flex-col items-center gap-2
                    hover:enabled:border-orange-500 hover:enabled:text-orange-400
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${!disabled && 'disabled:border-red-800/50'}`}
            >
               {children}
            </button>
        </Tooltip>
    );
});

export default SmeltButton;
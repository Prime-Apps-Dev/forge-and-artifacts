// src/components/ui/cards/FreeCraftRecipeCard.jsx
import React from 'react';
import { getItemImageSrc } from '../../../utils/helpers';
import { definitions } from '../../../data/definitions/index.js';
import { useGame } from '../../../context/useGame.js';
import Button from '../buttons/Button.jsx';

const FreeCraftRecipeCard = ({ itemDef, itemKey, isDisabled }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    
    const blueprintRequired = itemDef.blueprintId && !(gameState.specialItems[itemDef.blueprintId] > 0);
    const actualIsDisabled = isDisabled || blueprintRequired;

    let tooltipText = '';
    if (isDisabled) {
        tooltipText = 'Вы заняты другим проектом.';
    } else if (blueprintRequired) {
        tooltipText = `Требуется чертеж: "${definitions.specialItems[itemDef.blueprintId]?.name || 'Неизвестный чертеж'}" (доступен в Лавке)`;
    }

    return (
        <div className={`p-3 bg-black/30 rounded-lg border flex flex-col items-center text-center ${actualIsDisabled ? 'border-gray-700 opacity-60' : 'border-gray-600'}`}>
            <img
                src={getItemImageSrc(itemKey, 64)}
                alt={itemDef.name}
                className="w-16 h-16 object-contain mb-2 img-rounded-corners"
            />
            <h4 className="font-bold text-base text-white mt-2 grow">{itemDef.name}</h4>
            <Button
                onClick={() => handlers.handleStartFreeCraft(itemKey)}
                disabled={actualIsDisabled}
                className="mt-3 bg-orange-800/80 hover:enabled:bg-orange-700"
            >
                {actualIsDisabled ? (blueprintRequired ? 'Нужен чертеж' : 'Вы заняты') : 'Создать'}
            </Button>
        </div>
    );
};

export default FreeCraftRecipeCard;
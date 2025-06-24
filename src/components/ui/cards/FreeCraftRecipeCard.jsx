// src/components/ui/FreeCraftRecipeCard.jsx
import React from 'react';
import { getItemImageSrc } from '../../../utils/helpers';
import { definitions } from '../../../data/definitions'; // Импортируем definitions

const FreeCraftRecipeCard = ({ itemDef, itemKey, onCraft, isDisabled, gameState }) => { // Добавлен gameState
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
            <button
                onClick={() => onCraft(itemKey)}
                disabled={actualIsDisabled}
                className="interactive-element w-full mt-3 bg-orange-800/80 text-white font-bold py-2 px-4 rounded-md hover:enabled:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {actualIsDisabled ? (blueprintRequired ? 'Нужен чертеж' : 'Вы заняты') : 'Создать'}
            </button>
        </div>
    );
};

export default FreeCraftRecipeCard;
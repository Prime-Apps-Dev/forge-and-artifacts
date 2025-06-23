// src/components/ui/FreeCraftRecipeCard.jsx
import React from 'react';
import { getItemImageSrc } from '../../../utils/helpers';

const FreeCraftRecipeCard = ({ itemDef, itemKey, onCraft, isDisabled }) => {
    return (
        <div className={`p-3 bg-black/30 rounded-lg border flex flex-col items-center text-center ${isDisabled ? 'border-gray-700 opacity-60' : 'border-gray-600'}`}>
            <img
                src={getItemImageSrc(itemKey, 64)}
                alt={itemDef.name}
                className="w-16 h-16 object-contain mb-2 img-rounded-corners"
            />
            <h4 className="font-bold text-base text-white mt-2 grow">{itemDef.name}</h4>
            <button
                onClick={() => onCraft(itemKey)}
                disabled={isDisabled}
                className="interactive-element w-full mt-3 bg-orange-800/80 text-white font-bold py-2 px-4 rounded-md hover:enabled:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isDisabled ? 'Вы заняты' : 'Создать'}
            </button>
        </div>
    );
};

export default FreeCraftRecipeCard;
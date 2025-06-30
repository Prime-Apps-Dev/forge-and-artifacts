// src/components/ui/buttons/MineButton.jsx
import React, { memo } from 'react';
import Tooltip from '../display/Tooltip';
import { getResourceImageSrc } from '../../../utils/helpers';

const MineButton = memo(({ oreType, name, onSelect, isSelected }) => {
    const imgSrc = getResourceImageSrc(oreType, 128);
    
    // Добавлен класс для подсветки выбранной жилы
    const selectionClass = isSelected ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-gray-700 hover:border-orange-500';

    const buttonContent = (
        <div
            className={`interactive-element flex flex-col items-center justify-start text-center
                bg-black/20 rounded-lg p-4 h-48 w-40 flex-shrink-0 cursor-pointer
                border-2 ${selectionClass}`}
            onClick={() => {
                if (typeof onSelect === 'function') {
                    onSelect(oreType);
                }
            }}
        >
            <div className="flex flex-col items-center interactive-element-scale-inner w-full h-full justify-center">
                <img src={imgSrc} alt={name} className="h-24 mb-2 drop-shadow-lg object-contain img-rounded-corners" />
                <h4 className="font-cinzel text-base font-bold leading-tight">{name}</h4>
            </div>
        </div>
    );

    return <div className="group">{buttonContent}</div>;
});

export default MineButton;
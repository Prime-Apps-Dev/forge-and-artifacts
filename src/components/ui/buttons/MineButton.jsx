// src/components/ui/buttons/MineButton.jsx
import React, { memo } from 'react';
import Tooltip from '../display/Tooltip';
import { getResourceImageSrc } from '../../../utils/helpers';

const MineButton = memo(({ oreType, name, onClick, isLocked, lockText }) => {
    const imgSrc = getResourceImageSrc(oreType, 128);
    
    const buttonContent = (
        <div
            className={`interactive-element flex flex-col items-center justify-start text-center
                bg-black/20 rounded-lg p-4 h-48 w-40 flex-shrink-0
                border-2 ${isLocked ? 'border-gray-800 filter grayscale opacity-60 cursor-not-allowed' : 'border-gray-700 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10'}`}
            onClick={(e) => {
                if (!isLocked && typeof onClick === 'function') {
                    onClick(oreType, e.clientX, e.clientY);
                }
            }}
        >
            <div className="flex flex-col items-center interactive-element-scale-inner w-full h-full justify-center">
                <img src={imgSrc} alt={name} className="h-24 mb-2 drop-shadow-lg object-contain img-rounded-corners" />
                <h4 className="font-cinzel text-base font-bold leading-tight">{name}</h4>
            </div>
        </div>
    );

    return isLocked ? <Tooltip text={lockText}>{buttonContent}</Tooltip> : <div className="group">{buttonContent}</div>;
});

export default MineButton;
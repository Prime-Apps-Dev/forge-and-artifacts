import React, { memo } from 'react';
import Tooltip from './Tooltip';

// MineButton - мемоизированный компонент для кнопок добычи руды.
// ИЗМЕНЕНИЕ: Удален пропс `description`
const MineButton = memo(({ oreType, name, imgSrc, onClick, isLocked, lockText }) => {
    const buttonContent = (
        <div
            className={`interactive-element flex-1 border-2 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-black/20
                ${isLocked ? 'border-gray-800 filter grayscale opacity-60 cursor-not-allowed' : 'border-gray-700 cursor-pointer hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10'}`}
            onClick={() => {
                // Debug-логи, которые можно удалить после исправления
                console.log(`[MineButton Debug] Button clicked for oreType: ${oreType}`);
                console.log(`[MineButton Debug] isLocked: ${isLocked}`);
                console.log(`[MineButton Debug] typeof onClick: ${typeof onClick}`);

                if (!isLocked && typeof onClick === 'function') {
                    onClick(oreType);
                    console.log(`[MineButton Debug] onClick called for oreType: ${oreType}`);
                } else if (isLocked) {
                    console.log(`[MineButton Debug] Button is locked, onClick not called.`);
                } else {
                    console.log(`[MineButton Debug] onClick is not a function. It's: ${onClick}`);
                }
            }}
        >
            <img src={imgSrc} alt={name} className="h-32 mb-4 drop-shadow-lg" />
            <h4 className="font-cinzel text-lg">{name}</h4>
            {/* ИЗМЕНЕНИЕ: Удален <p className="text-gray-400 text-sm">{description}</p> */}
        </div>
    );

    return isLocked ? <Tooltip text={lockText}>{buttonContent}</Tooltip> : buttonContent;
});

export default MineButton;
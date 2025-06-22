// src/components/views/MineView.jsx
import React from 'react';
import MineButton from '../ui/MineButton';
import { formatNumber } from '../../utils/helpers';
import Tooltip from '../ui/Tooltip';
import { definitions } from '../../data/definitions';

const MineView = ({ gameState, handlers }) => {
    const { purchasedSkills, isFirstPlaythrough } = gameState;
    
    const getOreData = (oreType, skillRequired, lockedByPlaythrough = false) => {
        const isUnlocked = skillRequired ? purchasedSkills[skillRequired] : true;
        const isPlaythroughLocked = lockedByPlaythrough && isFirstPlaythrough;
        const isTotallyLocked = !isUnlocked || isPlaythroughLocked;
        
        let lockText = '';
        if (!isUnlocked) {
            const skillDef = definitions.skills[skillRequired];
            lockText = `Изучите навык '${skillDef?.name || skillRequired}' для разблокировки.`;
        } else if (isPlaythroughLocked) {
            lockText = "Доступно после первого Переселения.";
        }

        return {
            oreType,
            name: definitions.resources?.[oreType]?.name || oreType.replace('Ore', ' руда').replace('ironOre', 'Железная руда').replace('copperOre', 'Медная руда').replace('mithrilOre', 'Мифриловая руда').replace('adamantiteOre', 'Адамантитовая руда'),
            amount: gameState[oreType] || 0,
            isLocked: isTotallyLocked, // Этот флаг теперь используется для полного скрытия
            lockText: lockText,
            skillLearnedButLocked: isUnlocked && isPlaythroughLocked
        };
    };

    const ores = [
        getOreData('ironOre'),
        getOreData('copperOre', 'findCopper'),
        getOreData('mithrilOre', 'mithrilProspecting', true),
        getOreData('adamantiteOre', 'adamantiteMining', true),
    ];

    return (
        <div>
            <h2 className="font-cinzel text-2xl accent-glow-color text-shadow-glow flex items-center gap-2 border-b border-gray-700 pb-4 mb-6">
                <span className="material-icons-outlined">terrain</span> Шахта
            </h2>
            <p className="text-gray-400 mb-6">Здесь можно добыть ценную руду для будущих шедевров. Подмастерья будут добывать только базовые типы руды.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ores.map(ore => (
                    // ИЗМЕНЕНО: Условный рендеринг всего блока, если не заблокирован
                    !ore.isLocked ? (
                        <div key={ore.oreType} className="flex flex-col items-center">
                            <MineButton
                                oreType={ore.oreType}
                                name={ore.name}
                                onClick={handlers.handleMineOre}
                                isLocked={false} // Кнопка не заблокирована, если отображается
                                lockText=""
                            />
                            <p className={`text-sm mt-2 ${ore.oreType === 'mithrilOre' ? 'text-cyan-400' : ore.oreType === 'adamantiteOre' ? 'text-indigo-400' : 'text-gray-400'}`}>
                                В наличии: {formatNumber(ore.amount)}
                            </p>
                        </div>
                    ) : null // Если заблокирован, ничего не рендерим
                ))}
            </div>
        </div>
    );
};

export default MineView;
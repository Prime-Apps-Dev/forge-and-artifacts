// src/components/views/MineView.jsx
import React, { useMemo } from 'react';
import MineButton from '../ui/buttons/MineButton';
import { formatNumber } from '../../utils/formatters.jsx';
import Tooltip from '../ui/display/Tooltip';
import { definitions } from '../../data/definitions/index.js';
import { useGame } from '../../context/GameContext.jsx';

const MinerIndicator = ({ oreType }) => {
    const { displayedGameState: gameState } = useGame();
    const assignedMiners = useMemo(() => Object.values(gameState.hiredPersonnel).filter(p => {
        const assignment = gameState.personnelAssignment[p.uniqueId];
        return assignment && assignment.role === 'miner' && assignment.assignment === oreType && !p.isResting;
    }), [gameState.hiredPersonnel, gameState.personnelAssignment, oreType]);

    if (assignedMiners.length === 0) return null;

    return (
        <div className="absolute -top-2 -right-2 flex -space-x-3">
            {assignedMiners.map(miner => {
                const pDef = definitions.personnel[miner.personnelId];
                return (
                    <Tooltip key={miner.uniqueId} text={`Шахтер: ${miner.name} (Ур. ${miner.level})`}>
                        <img src={pDef.faceImg} alt={miner.name} className="w-8 h-8 rounded-full border-2 border-yellow-500 bg-gray-800 object-contain"/>
                    </Tooltip>
                );
            })}
        </div>
    );
};

const MineView = () => {
    const { displayedGameState: gameState, handlers } = useGame();
    
    const ores = useMemo(() => {
        const getOreData = (oreType, skillRequired = null, lockedByPlaythrough = false) => {
            const isUnlocked = skillRequired ? gameState.purchasedSkills[skillRequired] : true;
            const isPlaythroughLocked = lockedByPlaythrough && gameState.isFirstPlaythrough;
            
            return {
                oreType,
                name: definitions.resources?.[oreType]?.name || oreType.replace('Ore', ' руда'),
                amount: gameState[oreType] || 0,
                isLocked: !isUnlocked || isPlaythroughLocked,
            };
        };

        return [
            getOreData('ironOre'),
            getOreData('copperOre', 'findCopper'),
            getOreData('mithrilOre', 'mithrilProspecting', true),
            getOreData('adamantiteOre', 'adamantiteMining', true),
        ].filter(ore => !ore.isLocked); // Фильтруем массив, оставляя только разблокированные руды

    }, [gameState.purchasedSkills, gameState.isFirstPlaythrough, gameState.ironOre, gameState.copperOre, gameState.mithrilOre, gameState.adamantiteOre]);

    return (
        <div>
            <h2 className="font-cinzel text-2xl accent-glow-color text-shadow-glow flex items-center gap-2 border-b border-gray-700 pb-4 mb-6">
                <span className="material-icons-outlined">terrain</span> Шахта
            </h2>
            <p className="text-gray-400 mb-6">Здесь можно добыть ценную руду для будущих шедевров. Назначайте шахтёров, чтобы автоматизировать добычу.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ores.map(ore => (
                    <div key={ore.oreType} className="relative flex flex-col items-center">
                        <MineButton
                            oreType={ore.oreType}
                            name={ore.name}
                            onClick={handlers.handleMineOre}
                            isLocked={false}
                            lockText=""
                        />
                        <MinerIndicator oreType={ore.oreType} />
                        <p className={`text-sm mt-2 ${ore.oreType === 'mithrilOre' ? 'text-cyan-400' : ore.oreType === 'adamantiteOre' ? 'text-indigo-400' : 'text-gray-400'}`}>
                            В наличии: {formatNumber(ore.amount)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MineView;
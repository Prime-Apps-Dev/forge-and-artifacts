import React from 'react';
import { definitions } from '../../../data/definitions'; // Импортируем definitions
import { formatNumber } from '../../../utils/formatters';
import { getReputationLevel } from '../../../utils/helpers';

const FactionReputation = React.memo(({ factionId, gameState }) => { // Добавляем gameState
    const faction = definitions.factions[factionId];
    const reputation = gameState.reputation[factionId];
    const currentLevel = getReputationLevel(reputation);
    const nextLevelIndex = definitions.reputationLevels.findIndex(l => l.id === currentLevel.id) + 1;
    const nextLevel = definitions.reputationLevels[nextLevelIndex];

    const progressToBase = currentLevel.threshold;
    const progressToNext = nextLevel ? nextLevel.threshold : currentLevel.threshold;
    const repInCurrentLevel = reputation - progressToBase;
    const range = progressToNext - progressToBase;
    const repPercentage = range > 0 ? Math.min(100, (repInCurrentLevel / range) * 100) : 100;

    return (
        <div className="mb-4 bg-black/20 p-3 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-2">
                 <div className={`flex items-center gap-2 text-${faction.color}`}>
                    <span className="material-icons-outlined">{faction.icon}</span>
                    <h5 className="font-bold">{faction.name}</h5>
                </div>
                <span className="text-sm font-semibold">{currentLevel.name}</span>
            </div>
             <div className="w-full bg-gray-900 rounded-full h-2.5">
                <div
                    className={`bg-${faction.color} h-2.5 rounded-full`}
                    style={{ width: `${repPercentage}%`, transition: 'width 0.2s linear' }}
                ></div>
            </div>
             <div className="text-right text-xs text-gray-400 mt-1">
                 {formatNumber(reputation)} / {formatNumber(progressToNext)}
             </div>
        </div>
    );
});

export default FactionReputation;
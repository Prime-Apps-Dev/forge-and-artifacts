import React from 'react';
import { definitions } from '../../../data/definitions';
import { hasReputation } from '../../../utils/helpers';

const FactionQuestCard = React.memo(({ factionId, gameState, onStartQuest }) => {
    const faction = definitions.factions[factionId];
    const hasQuest = gameState.journal.activeQuests.some(q => q.factionId === factionId);
    const canTakeQuest = hasReputation(gameState.reputation, factionId, 'honor');

    if (hasQuest || !canTakeQuest) return null;

    return (
        <div className={`p-4 bg-black/30 border-2 rounded-lg text-center border-dashed border-${faction.color.replace('500', '700')}`}>
             <h3 className={`font-cinzel text-lg text-${faction.color}`}>Задание от {faction.name}</h3>
             <p className="text-gray-400 my-2">Вы достигли достаточной репутации. {faction.name} предлагает вам особое, очень сложное задание.</p>
             <button onClick={() => onStartQuest(factionId)} className={`interactive-element bg-${faction.color} text-black font-bold py-2 px-4 rounded-lg`}>
                 Принять задание
             </button>
        </div>
    )
});

export default FactionQuestCard;
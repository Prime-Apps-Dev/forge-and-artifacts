// src/components/ui/cards/EternalSkillNode.jsx
import React, { memo } from 'react';
import { definitions } from '../../../data/definitions/index.js';
import { formatNumber } from '../../../utils/formatters.jsx';
import Tooltip from '../display/Tooltip';
import { useGame } from '../../../context/GameContext.jsx';

const EternalSkillNode = memo(({ skillId }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const skill = definitions.eternalSkills[skillId];
    if (!skill) return null;

    const isPurchased = gameState.eternalSkills && gameState.eternalSkills[skillId];

    const requirementsMet = skill.requires.every(reqId =>
        gameState.eternalSkills && gameState.eternalSkills[reqId]
    );

    const cost = skill.cost.prestigePoints || 0;
    const canAfford = gameState.prestigePoints >= cost;

    const isPurchaseLockedInFirstPlaythrough = gameState.isFirstPlaythrough;

    const isLockedByRequirements = !requirementsMet;
    const isLocked = isLockedByRequirements || isPurchaseLockedInFirstPlaythrough;
    const isPurchasable = !isPurchased && !isLocked && canAfford;

    let nodeClass = "border-gray-700 bg-black/20 ";

    if (isPurchased) {
        nodeClass += "border-purple-500 bg-purple-500/20 text-purple-300";
    } else if (isPurchaseLockedInFirstPlaythrough) {
        nodeClass += "opacity-30 filter grayscale cursor-not-allowed border-red-800";
    } else if (isLockedByRequirements) {
        nodeClass += "opacity-50 filter grayscale cursor-not-allowed";
    } else if (isPurchasable) {
        nodeClass += "border-purple-500 cursor-pointer hover:bg-purple-500/10";
    } else {
        nodeClass += "border-red-500/50 opacity-60";
    }

    let tooltipText = skill.description;
    if (!isPurchased) {
        if (isPurchaseLockedInFirstPlaythrough) {
            tooltipText = "Этот навык можно купить только после первого Переселения.";
        } else if (isLockedByRequirements) {
            const missingSkills = skill.requires.filter(reqId => !gameState.eternalSkills[reqId])
                                               .map(reqId => definitions.eternalSkills[reqId]?.name || reqId);
            tooltipText = `Требуются предыдущие навыки: ${missingSkills.join(', ')}`;
        } else if (!canAfford) {
            tooltipText = `Недостаточно Осколков Памяти: ${formatNumber(cost)} требуется.`;
        }
    }


    return (
        <Tooltip text={tooltipText}>
            <div
                className={`interactive-element w-48 h-56 p-3 border-2 rounded-lg text-center flex flex-col transition-all duration-200 ${nodeClass}`}
                onClick={() => {
                    if (isPurchasable) {
                        handlers.handleBuyEternalSkill(skillId);
                    }
                }}
            >
                <div className="w-full flex items-center justify-center mb-2">
                    <span className={`material-icons-outlined text-4xl`}>{skill.icon}</span>
                </div>
                <h4 className="font-cinzel text-sm font-bold">{skill.name}</h4>
                <div className="fade-scroll-wrapper my-1">
                    <p className="text-xs text-gray-400 fade-scroll-content">
                        {skill.description}
                    </p>
                </div>
                {
                    isPurchased ? (
                        <span className="font-bold mt-1 text-sm">Изучено</span>
                    ) : isPurchaseLockedInFirstPlaythrough ? (
                        <span className="font-bold mt-1 text-sm text-red-400">После Переселения</span>
                    ) : (
                        <div className='mt-1 text-sm flex flex-col items-start w-full'>
                            <span className={`flex items-center gap-1 ${canAfford ? 'text-white' : 'text-red-400'}`}>
                                <span className="material-icons-outlined text-sm text-purple-400">token</span>
                                {formatNumber(cost)} О.П.
                            </span>
                        </div>
                    )
                }
            </div>
        </Tooltip>
    );
});

export default EternalSkillNode;
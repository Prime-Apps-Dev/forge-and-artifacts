// src/components/ui/SkillNode.jsx
import React, { memo } from 'react';
import { definitions } from '../../data/definitions';
import { formatCosts } from '../../utils/helpers';
import Tooltip from './Tooltip'; // Убедитесь, что Tooltip импортирован

const SkillNode = memo(({ skillId, gameState, onBuySkill }) => {
    const skill = definitions.skills[skillId];
    if (!skill) return null;

    const isPurchased = gameState.purchasedSkills && gameState.purchasedSkills[skillId];

    const requirementsMet = skill.requires.every(reqId => {
        const requiredSkillDef = definitions.skills[reqId];
        if (gameState.isFirstPlaythrough && requiredSkillDef?.firstPlaythroughLocked) {
            return true;
        }
        return gameState.purchasedSkills && gameState.purchasedSkills[reqId];
    });
    
    const isOffSpec = skill.requiredSpecialization && gameState.specialization && skill.requiredSpecialization !== gameState.specialization;
    const isLockedByFirstPlaythrough = gameState.isFirstPlaythrough && skill.firstPlaythroughLocked;

    const displayCosts = { ...skill.cost };
    for (const resourceType in displayCosts) {
        if (resourceType === 'matter') {
            if (isOffSpec) {
                displayCosts[resourceType] *= 5;
            }
            if (gameState.matterCostReduction > 0) {
                displayCosts[resourceType] = Math.max(1, Math.floor(displayCosts[resourceType] * (1 - gameState.matterCostReduction)));
            }
        }
    }

    let canAfford = true;
    if (!isLockedByFirstPlaythrough) {
        for (const resourceType in displayCosts) {
            const costAmount = displayCosts[resourceType];
            const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType === 'matter' ? 'main' : 'specialItems';
            const currentAmount = resourceStorage === 'main' ? gameState[resourceType] : gameState.specialItems?.[resourceType] || 0;
            if (currentAmount < costAmount) {
                canAfford = false;
                break;
            }
        }
    } else {
        canAfford = false;
    }


    const isLocked = !requirementsMet || isLockedByFirstPlaythrough;
    const isPurchasable = !isPurchased && !isLocked && canAfford;

    let nodeClass = "border-gray-700 bg-black/20 ";
    
    if(isPurchased) {
        nodeClass += "border-orange-500 bg-orange-500/20 text-orange-300";
    } else if(isLockedByFirstPlaythrough) {
        nodeClass += "opacity-30 filter grayscale cursor-not-allowed border-red-800";
    } else if(!requirementsMet) { // Если заблокировано требованиями (не изучены предыдущие)
        nodeClass += "opacity-50 filter grayscale cursor-not-allowed";
    } else if(isOffSpec) {
        nodeClass += "border-indigo-500/50 hover:bg-indigo-500/10 cursor-pointer";
        if (!canAfford) {
            nodeClass += " opacity-60";
        }
    } else if(isPurchasable) {
        nodeClass += "border-orange-500 cursor-pointer hover:bg-orange-500/10";
    } else {
        nodeClass += "border-red-500/50 opacity-60";
    }
    
    return (
        <Tooltip text={skill.description}> {/* Тултип теперь берет описание напрямую */}
            <div
                className={`interactive-element w-48 h-56 p-3 border-2 rounded-lg text-center flex flex-col transition-all duration-200 ${nodeClass}`}
                onClick={() => {
                    if (!isPurchased && !isLocked) {
                        onBuySkill(skillId);
                    } else if (isLockedByFirstPlaythrough) {
                        // showToast("Этот навык будет доступен после первого Переселения!", "info");
                    }
                }}
            >
                <div className="w-full flex items-center justify-center mb-2">
                    <span className={`material-icons-outlined text-4xl`}>{skill.icon}</span>
                </div>
                <h4 className="font-cinzel text-sm font-bold">{skill.name}</h4>
                {/* ИЗМЕНЕНО: Удалены классы fade-scroll-wrapper и fade-scroll-content, тени */}
                <p className="text-xs text-gray-400 my-1 overflow-y-auto flex-grow">
                    {/* УДАЛЕНА АНИМАЦИЯ И ЗАГЛУШКА ПРОКРУТКИ */}
                    {skill.description}
                </p>
                {/* УДАЛЕНА ТЕНЬ СВЕРХУ/СНИЗУ */}
                {/* <div className="fade-scroll-wrapper my-1">
                    <p className="text-xs text-gray-400 fade-scroll-content">
                        {skill.description}
                    </p>
                </div> */}
                {
                    isPurchased ? (
                        <span className="font-bold mt-1 text-sm">Изучено</span>
                    ) : isLockedByFirstPlaythrough ? (
                        <span className="font-bold mt-1 text-sm text-red-400">После Переселения</span>
                    ) : (
                        <div className='mt-1 text-sm flex flex-col items-start w-full' dangerouslySetInnerHTML={{ __html: formatCosts(displayCosts, gameState) }}></div>
                    )
                }
                {isOffSpec && !isPurchased && <div className='text-xs text-indigo-400'>(Вне специализации)</div>}
            </div>
        </Tooltip>
    )
});

export default SkillNode;
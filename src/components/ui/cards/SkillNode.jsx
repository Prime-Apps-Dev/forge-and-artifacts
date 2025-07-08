// src/components/ui/cards/SkillNode.jsx
import React, { memo, useState, useRef, useEffect } from 'react';
import { definitions } from '../../../data/definitions/index.js';
import { formatCostsJsx } from '../../../utils/formatters.jsx';
import Tooltip from '../display/Tooltip';
import { useGame } from '../../../context/useGame.js';

const SkillNode = memo(({ skillId, onOpenModal }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const skill = definitions.skills[skillId];

    const [isHolding, setIsHolding] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);
    const holdIntervalRef = useRef(null);
    const holdTimeoutRef = useRef(null);
    const isTouchDeviceRef = useRef(false);

    useEffect(() => {
        isTouchDeviceRef.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }, []);

    if (!skill) return null;

    const isPurchased = gameState.purchasedSkills && gameState.purchasedSkills[skillId];
    const requirementsMet = skill.requires.every(reqId => gameState.purchasedSkills && gameState.purchasedSkills[reqId]);
    const isOffSpec = skill.requiredSpecialization && gameState.specialization && skill.requiredSpecialization !== gameState.specialization;
    const isLockedByFirstPlaythrough = gameState.isFirstPlaythrough && skill.firstPlaythroughLocked;

    const displayCosts = { ...skill.cost };
    for (const resourceType in displayCosts) {
        if (resourceType === 'matter') {
            if (isOffSpec) displayCosts[resourceType] *= 5;
            if (gameState.matterCostReduction > 0) {
                displayCosts[resourceType] = Math.max(1, Math.floor(displayCosts[resourceType] * (1 - gameState.matterCostReduction)));
            }
        }
    }

    let canAfford = true;
    if (!isLockedByFirstPlaythrough) {
        for (const resourceType in displayCosts) {
            const currentAmount = gameState[resourceType] || gameState.specialItems[resourceType] || 0;
            if (currentAmount < displayCosts[resourceType]) {
                canAfford = false;
                break;
            }
        }
    } else {
        canAfford = false;
    }

    const isLocked = !requirementsMet || isLockedByFirstPlaythrough;
    const isPurchasable = !isPurchased && !isLocked && canAfford;
    
    // --- Hold-to-buy logic ---
    const startHold = () => {
        if (!isPurchasable || isTouchDeviceRef.current) return;
        setIsHolding(true);
        holdIntervalRef.current = setInterval(() => {
            setHoldProgress(prev => prev + (100 / 1500 * 15)); // 1.5 seconds total
        }, 15);
        holdTimeoutRef.current = setTimeout(() => {
            handlers.handleBuySkill(skillId);
            resetHold();
        }, 1500);
    };

    const resetHold = () => {
        setIsHolding(false);
        setHoldProgress(0);
        clearInterval(holdIntervalRef.current);
        clearTimeout(holdTimeoutRef.current);
    };
    // --- End hold-to-buy logic ---

    let nodeClass = "border-gray-700 bg-black/20 ";
    if (isPurchased) nodeClass += "border-orange-500 bg-orange-500/20 text-orange-300";
    else if (isLockedByFirstPlaythrough) nodeClass += "opacity-30 filter grayscale cursor-not-allowed border-red-800";
    else if (!requirementsMet) nodeClass += "opacity-50 filter grayscale cursor-not-allowed";
    else if (isOffSpec) nodeClass += "border-indigo-500/50 hover:bg-indigo-500/10 cursor-pointer";
    else if (isPurchasable) nodeClass += "border-orange-500 cursor-pointer hover:bg-orange-500/10";
    else nodeClass += "border-red-500/50 opacity-60";
    
    // --- MOBILE/TOUCH RENDER ---
    if (isTouchDeviceRef.current) {
        return (
            <button
                onClick={() => onOpenModal(skillId)}
                className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 interactive-element transition-all ${nodeClass}`}
            >
                <span className={`material-icons-outlined text-3xl`}>{skill.icon}</span>
            </button>
        );
    }

    // --- DESKTOP RENDER ---
    const circumference = 2 * Math.PI * 22; // r=22
    const offset = circumference - (holdProgress / 100) * circumference;

    return (
        <Tooltip text={skill.description}>
            <div
                className={`interactive-element w-48 h-56 p-3 border-2 rounded-lg text-center flex flex-col transition-all duration-200 relative ${nodeClass}`}
                onMouseDown={startHold}
                onMouseUp={resetHold}
                onMouseLeave={resetHold}
            >
                {isHolding && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 48 56">
                        <circle
                            stroke="rgba(249, 115, 22, 0.7)"
                            strokeWidth="2"
                            fill="transparent"
                            r="22"
                            cx="24"
                            cy="28"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            transform="rotate(-90 24 28)"
                        />
                    </svg>
                )}
                <div className="w-full flex items-center justify-center mb-2">
                    <span className={`material-icons-outlined text-4xl`}>{skill.icon}</span>
                </div>
                <h4 className="font-cinzel text-sm font-bold">{skill.name}</h4>
                <p className="text-xs text-gray-400 my-1 overflow-y-auto flex-grow">
                    {skill.description}
                </p>
                {isPurchased ? (
                    <span className="font-bold mt-1 text-sm">Изучено</span>
                ) : isLockedByFirstPlaythrough ? (
                    <span className="font-bold mt-1 text-sm text-red-400">После Переселения</span>
                ) : (
                    <div className='mt-1 text-sm flex flex-col items-start w-full'>
                        {formatCostsJsx(displayCosts, gameState)}
                    </div>
                )}
                {isOffSpec && !isPurchased && <div className='text-xs text-indigo-400'>(Вне специализации)</div>}
            </div>
        </Tooltip>
    );
});

export default SkillNode;
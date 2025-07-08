// src/components/ui/modals/SkillInfoModal.jsx
import React from 'react';
import { definitions } from '../../../data/definitions/index.js';
import { useGame } from '../../../context/useGame.js';
import { useDraggableModal } from '../../../hooks/useDraggableModal.js';
import { formatCostsJsx } from '../../../utils/formatters.jsx';
import ModalDragHandle from '../display/ModalDragHandle.jsx';
import Button from '../buttons/Button.jsx';

const SkillInfoModal = ({ isOpen, onClose, skillId }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const { touchHandlers } = useDraggableModal(onClose);

    if (!isOpen || !skillId) return null;

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

    return (
        <div className="fixed inset-0 bg-black/80 flex items-end justify-center md:items-center z-50 modal-backdrop" onClick={onClose}>
            <div 
                className="bg-gray-900 border-t-2 md:border-2 border-orange-500 w-full rounded-t-2xl md:rounded-lg shadow-2xl p-6 flex flex-col modal-content animate-slide-in-up md:animate-none md:relative md:max-w-md max-h-[85vh] md:h-auto"
                onClick={e => e.stopPropagation()}
                {...touchHandlers}
            >
                <ModalDragHandle />

                <div className="text-center">
                    <span className={`material-icons-outlined text-6xl text-orange-400`}>{skill.icon}</span>
                    <h2 className="font-cinzel text-2xl text-white mt-2">{skill.name}</h2>
                    {isOffSpec && !isPurchased && <p className='text-sm text-indigo-400'>(Вне специализации)</p>}
                </div>
                
                <p className="text-gray-400 my-4 text-center text-sm">{skill.description}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-700">
                    {isPurchased ? (
                        <p className="text-center font-bold text-green-400">Навык уже изучен</p>
                    ) : isLockedByFirstPlaythrough ? (
                         <p className="text-center font-bold text-red-400">Доступно после Переселения</p>
                    ) : !requirementsMet ? (
                        <p className="text-center font-bold text-red-400">Требуются предыдущие навыки</p>
                    ) : (
                        <>
                            <p className="text-center text-gray-300 mb-2">Стоимость изучения:</p>
                            <div className="flex justify-center flex-wrap gap-x-4 gap-y-1">
                                {formatCostsJsx(displayCosts, gameState)}
                            </div>
                            <Button 
                                onClick={() => handlers.handleBuySkill(skillId)} 
                                disabled={!isPurchasable} 
                                className="mt-6 w-full"
                            >
                                {isPurchasable ? 'Изучить' : 'Недостаточно ресурсов'}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillInfoModal;
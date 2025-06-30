// src/components/views/forge/WorkstationSelector.jsx
import React, { memo, useMemo } from 'react';
import { definitions } from '../../../data/definitions/index.js';
import { formatNumber } from '../../../utils/formatters.jsx';
import { useGame } from '../../../context/useGame.js';
import Tooltip from '../../ui/display/Tooltip';

const WorkstationSelector = memo(() => {
    const { displayedGameState: gameState, handlers } = useGame();
    const { purchasedSkills, activeWorkstationId, workstations, activeOrder, activeFreeCraft, currentEpicOrder, activeReforge, activeInlay, activeGraving } = gameState;
    
    const activePlayerProject = activeOrder || activeFreeCraft;
    const isEpicCraft = !!currentEpicOrder;

    const requiredWorkstation = useMemo(() => {
        if (activeReforge) return 'anvil';
        if (activeInlay) return 'grindstone';
        if (activeGraving) return 'workbench';
        if (activePlayerProject && activePlayerProject.activeComponentId) {
            const itemDef = definitions.items[activePlayerProject.itemKey];
            const activeComponent = itemDef?.components.find(c => c.id === activePlayerProject.activeComponentId);
            if (activeComponent) return activeComponent.workstation;
        }
        if (isEpicCraft) {
            const artifactDef = definitions.greatArtifacts[currentEpicOrder.artifactId];
            const epicStageDef = artifactDef?.epicOrder.find(s => s.stage === currentEpicOrder.currentStage);
            if (epicStageDef) return epicStageDef.workstation;
        }
        return null;
    }, [activePlayerProject, isEpicCraft, activeReforge, activeInlay, activeGraving, currentEpicOrder]);

    if (!purchasedSkills.divisionOfLabor) return null;

    return (
        <div className="flex justify-center gap-4 my-4 p-2 bg-black/20 rounded-lg">
            {Object.entries(definitions.workstations).map(([id, station]) => {
                const currentWorkstationState = workstations[id];
                const xpProgress = (currentWorkstationState.xpToNextLevel > 0) ? (currentWorkstationState.xp / currentWorkstationState.xpToNextLevel) * 100 : 100;
                const isMaxLevel = currentWorkstationState.level >= station.maxLevel;
                let tooltipContent = `${station.name}\nУровень: ${currentWorkstationState.level} / ${station.maxLevel}`;
                if (!isMaxLevel) { tooltipContent += `\nXP: ${formatNumber(currentWorkstationState.xp, true)} / ${formatNumber(currentWorkstationState.xpToNextLevel, true)}`; }
                if (activeWorkstationId === id) { tooltipContent += "\n(Активный)"; } 
                else if (requiredWorkstation === id) { tooltipContent += "\n(Требуется)"; }
                if (station.bonusesPerLevel) {
                    tooltipContent += "\nБонусы за уровень:";
                    for (const bonusType in station.bonusesPerLevel) {
                        const bonusValue = station.bonusesPerLevel[bonusType];
                        const totalBonus = bonusValue * (currentWorkstationState.level - 1);
                        tooltipContent += `\n- ${bonusType}: +${(totalBonus * 100).toFixed(1)}%`;
                    }
                }
                const isRequiredAndNotActive = requiredWorkstation && requiredWorkstation === id && activeWorkstationId !== id;
                const isDisabled = requiredWorkstation && requiredWorkstation !== id;
                return (
                    <Tooltip key={id} text={tooltipContent}>
                        <button
                            onClick={() => handlers.handleSelectWorkstation(id)}
                            className={`interactive-element p-3 rounded-lg border-2 transition-all duration-200 relative overflow-hidden ${activeWorkstationId === id ? 'bg-orange-500/20 border-orange-500' : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'} ${isRequiredAndNotActive ? 'animate-pulse !border-blue-500' : ''} ${isDisabled ? '!opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isDisabled}
                        >
                            <span className={`material-icons-outlined text-4xl ${activeWorkstationId === id ? 'text-orange-400' : 'text-gray-400'}`}>{station.icon}</span>
                            <div className="absolute bottom-0 left-0 w-full bg-black/50 text-center text-xs font-bold">Ур. {currentWorkstationState.level}</div>
                            {!isMaxLevel && (<div className="absolute bottom-0 left-0 h-1 bg-yellow-500" style={{ width: `${xpProgress}%` }}></div>)}
                        </button>
                    </Tooltip>
                );
            })}
        </div>
    );
});

export default WorkstationSelector;
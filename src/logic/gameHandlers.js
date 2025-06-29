// src/logic/gameHandlers.js
import { definitions } from '../data/definitions/index.js';
import { audioController } from '../utils/audioController';
import {
    handleFreeCraftCompletion,
    handleCompleteReforge,
    handleCompleteInlay,
    handleCompleteGraving,
    handleOrderCompletion,
    updateQuestProgress
} from './gameCompletions';
import { visualEffects } from '../utils/visualEffects';
import { gameConfig as GAME_CONFIG } from '../constants/gameConfig.js';
import { canAffordAndPay } from '../utils/gameUtils';

export function createGameHandlers({
    updateState,
    showToast,
    setIsWorking,
    workTimeoutRef,
    setCompletedOrderInfo
}) {
    const triggerWorkAnimation = () => {
        setIsWorking(true);
        if (workTimeoutRef.current) clearTimeout(workTimeoutRef.current);
        workTimeoutRef.current = setTimeout(() => setIsWorking(false), 200);
    };

    /**
     * Применяет прогресс к активному проекту.
     * @returns {boolean} - Возвращает true, если прогресс был успешно применен, иначе false.
     */
    const applyProgress = (state, progressAmount, clickX, clickY) => {
        const activeProject = state.activeOrder || state.activeFreeCraft;
        if (!activeProject || !activeProject.activeComponentId) {
            return false;
        }

        const itemDef = definitions.items[activeProject.itemKey];
        const componentDef = itemDef.components.find(c => c.id === activeProject.activeComponentId);
        
        if (!componentDef || activeProject.completedComponents[componentDef.id]) {
             return false;
        }

        // --- ИСПРАВЛЕНИЕ: Проверка верстака теперь происходит только ПОСЛЕ изучения навыка "Разделение труда"
        if (state.purchasedSkills.divisionOfLabor && componentDef.workstation !== state.activeWorkstationId) {
            showToast(`Неверный верстак! Требуется: ${definitions.workstations[componentDef.workstation].name}`, 'error');
            return false;
        }
        // --- -----------------------------------------------------------------------------------------

        state.totalClicks = (state.totalClicks || 0) + 1;
        updateQuestProgress(state, 'totalClicks', {}, showToast);
        
        const workstationMod = state.workstationBonus[state.activeWorkstationId] || 1.0;
        progressAmount *= workstationMod;

        const currentWorkstation = state.workstations[state.activeWorkstationId];
        const workstationDef = definitions.workstations[state.activeWorkstationId];
        if (currentWorkstation && workstationDef && currentWorkstation.level < workstationDef.maxLevel) {
            currentWorkstation.xp += progressAmount;
            if (currentWorkstation.xp >= currentWorkstation.xpToNextLevel) {
                while (currentWorkstation.xp >= currentWorkstation.xpToNextLevel && currentWorkstation.level < workstationDef.maxLevel) {
                    currentWorkstation.xp -= currentWorkstation.xpToNextLevel;
                    currentWorkstation.level += 1;
                    currentWorkstation.xpToNextLevel = Math.floor(currentWorkstation.xpToNextLevel * workstationDef.xpToNextLevelMultiplier);
                }
                showToast(`Верстак "${workstationDef.name}" повышен! Уровень ${currentWorkstation.level}!`, 'levelup');
                audioController.play('levelup', 'E5', '4n');
                if (clickX !== null && clickY !== null) {
                    visualEffects.showParticleEffect(clickX, clickY, 'workstation_levelup');
                }
            }
        }
        
        if (activeProject.componentProgress[componentDef.id] === undefined) {
            activeProject.componentProgress[componentDef.id] = 0;
        }

        if (activeProject.componentProgress[componentDef.id] === 0 && componentDef.cost) {
            if (!canAffordAndPay(state, componentDef.cost, showToast)) {
                return false; // Оплата не удалась, прогресс не засчитываем
            }
        }
        
        activeProject.componentProgress[componentDef.id] = Math.min(componentDef.progress, activeProject.componentProgress[componentDef.id] + progressAmount);

        if (activeProject.componentProgress[componentDef.id] >= componentDef.progress) {
             if (!activeProject.completedComponents[componentDef.id]) {
                const quality = activeProject.minigameQualityBuffer?.[componentDef.id] || 1.0;
                
                const finalStats = {};
                if (componentDef.baseStats) {
                    for (const statName in componentDef.baseStats) {
                        finalStats[statName] = componentDef.baseStats[statName] * quality;
                    }
                }
                activeProject.completedComponents[componentDef.id] = { quality, finalStats };
                activeProject.activeComponentId = null;

                if(activeProject.minigameQualityBuffer?.[componentDef.id]) {
                    delete activeProject.minigameQualityBuffer[componentDef.id];
                }

                showToast(`Компонент "${componentDef.name}" завершен!`, 'success');
                audioController.play('complete', 'A4', '8n');

                const totalComponents = itemDef.components.length;
                const completedCount = Object.keys(activeProject.completedComponents).length;

                if (completedCount >= totalComponents) {
                    if (state.activeOrder) handleOrderCompletion(state, state.activeOrder, showToast, setCompletedOrderInfo);
                    else if (state.activeFreeCraft) handleFreeCraftCompletion(state, activeProject, showToast);
                }
            }
        }
        return true; // Прогресс успешно применен
    };
    
    const handleMinigameCompletion = (state, project, success, quality) => {
        project.minigameState = null;
        const componentDef = definitions.items[project.itemKey]?.components.find(c => c.id === project.activeComponentId);
        if (!componentDef) return;

        project.minigameQualityBuffer = project.minigameQualityBuffer || {};
        project.minigameQualityBuffer[componentDef.id] = quality;
        
        if (success) {
            showToast(`Результат мини-игры: Качество x${quality.toFixed(2)}. Продолжайте работу!`, 'info');
            const currentProgress = project.componentProgress[componentDef.id] || 0;
            const remainingProgress = componentDef.progress - currentProgress;
            const calculatedBonus = componentDef.progress * (0.01 + Math.random() * 0.09);
            const progressBonus = Math.min(calculatedBonus, remainingProgress > 1 ? remainingProgress - 1 : 0);
            
            if (progressBonus > 0) {
                 project.componentProgress[componentDef.id] += progressBonus;
            }
        } else {
            showToast(`Мини-игра провалена! Качество компонента пострадает (x${quality.toFixed(2)}).`, 'error');
        }
    };

    const handleStrikeAnvil = (e) => {
        triggerWorkAnimation();
        const clickX = e.clientX;
        const clickY = e.clientY;

        updateState(state => {
            const project = state.activeOrder || state.activeFreeCraft;

            if (state.activeReforge) { /* Reforge logic */ return state; }
            if (state.activeInlay) { /* Inlay logic */ return state; }
            if (state.activeGraving) { /* Graving logic */ return state; }
            if (state.currentEpicOrder) { /* Epic order logic */ return state; }

            if (!project) {
                 showToast("Выберите проект для работы!", "error");
                 return state;
            }
            
            if (!project.activeComponentId) {
                showToast("Выберите компонент для работы!", "error");
                return state;
            }

            const componentDef = definitions.items[project.itemKey]?.components.find(c => c.id === project.activeComponentId);
            if (!componentDef) return state;

            if (project.minigameState?.active) {
                if (project.minigameState.type === 'bar_precision') {
                    const pos = project.minigameState.position;
                    let success = false;
                    let quality = 1.0 - GAME_CONFIG.MINIGAME_PENALTY_QUALITY_DECREASE;
                    for (const zone of componentDef.minigame.zones) {
                        if (pos >= zone.from && pos <= zone.to) {
                            success = true;
                            quality = zone.qualityBonus;
                            break;
                        }
                    }
                    audioController.play(success ? 'crit' : 'click', 'A4');
                    handleMinigameCompletion(state, project, success, quality);
                }
                return state;
            }
            
            const canTriggerMinigame = (project.minigameCount || 0) < 3;
            if (componentDef.minigame && canTriggerMinigame && !project.completedComponents[componentDef.id] && Math.random() < componentDef.minigame.triggerChance) {
                project.minigameCount = (project.minigameCount || 0) + 1;
                showToast("Момент истины!", "info");
                audioController.play('complete', 'C4', '8n');
                project.minigameState = { active: true, type: componentDef.minigame.type, startTime: Date.now() };
                
                if (project.minigameState.type === 'click_points') {
                    project.minigameState.points = [];
                    project.minigameState.totalPoints = Math.floor(Math.random() * (componentDef.minigame.pointsCount.max - componentDef.minigame.pointsCount.min + 1)) + componentDef.minigame.pointsCount.min;
                    project.minigameState.hitPoints = 0;
                }
                if (project.minigameState.type === 'hold_and_release') {
                    project.minigameState.fillPercentage = 0;
                    project.minigameState.isHolding = false;
                    const zoneSize = Math.floor(Math.random() * (componentDef.minigame.zoneSize.max - componentDef.minigame.zoneSize.min + 1)) + componentDef.minigame.zoneSize.min;
                    const perfectSize = Math.floor(Math.random() * (componentDef.minigame.perfectZoneSize.max - componentDef.minigame.perfectZoneSize.min + 1)) + componentDef.minigame.perfectZoneSize.min;
                    const targetStart = Math.random() * (100 - zoneSize);
                    project.minigameState.targetZone = { from: targetStart, to: targetStart + zoneSize };
                    const perfectStart = targetStart + Math.random() * (zoneSize - perfectSize);
                    project.minigameState.perfectZone = { from: perfectStart, to: perfectStart + perfectSize };
                }
                if(project.minigameState.type === 'bar_precision') {
                    project.minigameState.position = 0;
                }
                return state;
            } 
            
            const wasProgressApplied = applyProgress(state, state.progressPerClick, clickX, clickY);

            // Проверяем, не была ли работа заблокирована проверкой верстака
            if (!state.purchasedSkills.divisionOfLabor || componentDef.workstation === state.activeWorkstationId) {
                 audioController.play('click', 'C3');
                 visualEffects.showParticleEffect(clickX, clickY, 'default');
            }

            return state;
        });
    };
    
    const handleMinigameClickPoint = (pointId) => {
        updateState(state => {
            const project = state.activeOrder || state.activeFreeCraft;
            if (!project?.minigameState?.active || project.minigameState.type !== 'click_points') return state;

            const minigameState = project.minigameState;
            const componentDef = definitions.items[project.itemKey].components.find(c => c.id === project.activeComponentId)?.minigame;

            const pointIndex = minigameState.points.findIndex(p => p.id === pointId);
            if (pointIndex === -1) return state;

            minigameState.points.splice(pointIndex, 1);
            minigameState.hitPoints += 1;
            audioController.play('click', 'G5', '16n');

            if (minigameState.hitPoints >= minigameState.totalPoints) {
                const qualityBonus = componentDef.qualityBonus;
                handleMinigameCompletion(state, project, true, qualityBonus);
            }
            return state;
        });
    };
    
    const handleMinigameRelease = () => {
         updateState(state => {
            const project = state.activeOrder || state.activeFreeCraft;
            if (!project?.minigameState?.active || project.minigameState.type !== 'hold_and_release') return state;
            
            project.minigameState.isHolding = false;
            const minigameState = project.minigameState;
            const minigameDef = definitions.items[project.itemKey].components.find(c => c.id === project.activeComponentId)?.minigame;
            
            let success = false;
            let quality = 1.0 - GAME_CONFIG.MINIGAME_PENALTY_QUALITY_DECREASE;

            if (minigameState.fillPercentage >= minigameState.perfectZone.from && minigameState.fillPercentage <= minigameState.perfectZone.to) {
                success = true;
                quality = minigameDef.perfectQualityBonus;
                audioController.play('crit', 'C5', '8n');
            } else if (minigameState.fillPercentage >= minigameState.targetZone.from && minigameState.fillPercentage <= minigameState.targetZone.to) {
                success = true;
                quality = minigameDef.qualityBonus;
                audioController.play('click', 'A4', '8n');
            } else {
                audioController.play('click', 'C3', '8n');
            }
            handleMinigameCompletion(state, project, success, quality);
            return state;
        });
    };

    return {
        handleStrikeAnvil,
        handleSelectComponent: (componentId) => {
            updateState(state => {
                const project = state.activeOrder || state.activeFreeCraft;
                if (project) {
                    project.activeComponentId = componentId;
                }
                return state;
            });
        },
        handleSelectWorkstation: (workstationId) => {
             updateState(state => {
                state.activeWorkstationId = workstationId;
                return state;
            });
        },
        handleCloseRewardModal: () => setCompletedOrderInfo(null),
        handleMinigameClickPoint,
        handleMinigameRelease
    };
}

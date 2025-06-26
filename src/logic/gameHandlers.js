// src/logic/gameHandlers.js
import { definitions } from '../data/definitions/index.js';
import { audioController } from '../utils/audioController';
import {
    handleFreeCraftCompletion,
    handleCompleteReforge,
    handleCompleteInlay,
    handleCompleteGraving,
    handleOrderCompletion,
    handleSaleCompletion,
    updateQuestProgress // Импортируем нашу новую функцию
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

    const endMinigame = (project, success, qualityBonus = 0, progressBonus = 0) => {
        if (!project || !project.minigameState) return 0;
        
        if (success) {
            showToast(`Отличный удар! (+${qualityBonus.toFixed(1)} к качеству)`, 'crit');
            project.qualityPoints = (project.qualityPoints || 0) + qualityBonus;
            project.qualityHits = (project.qualityHits || 0) + 1;
        } else {
            showToast("Промах!", "error");
            project.qualityPoints = (project.qualityPoints || 0) - GAME_CONFIG.MINIGAME_PENALTY_QUALITY_DECREASE;
        }
        
        project.minigameState = null;
        return progressBonus;
    };
    
    const applyProgress = (state, progressAmount, clickX, clickY) => {
        state.totalClicks = (state.totalClicks || 0) + 1;
        // Накопительные квесты проверяются здесь, так как они не зависят от успеха/неудачи действия
        updateQuestProgress(state, 'totalClicks', {}, showToast);
        if (state.totalMatterSpent > 0) { // Проверяем, тратилась ли материя
            updateQuestProgress(state, 'totalMatterSpent', {}, showToast);
        }

        const workstationMod = state.workstationBonus[state.activeWorkstationId] || 1;
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
        
        if (state.currentEpicOrder) {
            const epicOrder = state.currentEpicOrder;
            const artifactDef = definitions.greatArtifacts[epicOrder.artifactId];
            const stageDef = artifactDef.epicOrder.find(s => s.stage === epicOrder.currentStage);

            if (state.purchasedSkills.divisionOfLabor && stageDef.workstation !== state.activeWorkstationId) {
                showToast(`Не тот станок! Требуется: ${definitions.workstations[stageDef.workstation].name}`, "error");
                return state;
            }
            if (epicOrder.progress === 0 && stageDef.cost) {
                if (!canAffordAndPay(state, stageDef.cost, showToast)) {
                    return state;
                }
            }
            epicOrder.progress += progressAmount;
            if (epicOrder.progress >= stageDef.progress) {
                const isLastStage = epicOrder.currentStage === artifactDef.epicOrder.length;
                if (isLastStage) {
                    audioController.play('levelup', 'C6', '1n');
                    state.artifacts[epicOrder.artifactId].status = 'completed';
                    setCompletedOrderInfo({ isArtifact: true, artifactId: epicOrder.artifactId });
                    state.currentEpicOrder = null;
                    showToast(`Шедевр создан: ${artifactDef.name}!`, 'levelup');
                } else {
                    audioController.play('complete', 'A4', '8n');
                    epicOrder.currentStage += 1;
                    epicOrder.progress = 0;
                    showToast(`Этап ${stageDef.stage} завершен!`, 'success');
                }
            }
            return state;
        }
        
        const activeProject = state.activeOrder || state.activeFreeCraft;

        if (activeProject) {
            const itemDef = definitions.items[activeProject.itemKey];
            const componentDef = itemDef.components.find(c => c.id === activeProject.activeComponentId);

            if (!componentDef || (activeProject.componentProgress[componentDef.id] || 0) >= componentDef.progress) return state;
            
            if ((activeProject.componentProgress[componentDef.id] || 0) === 0 && componentDef.cost) {
                if (!canAffordAndPay(state, componentDef.cost, showToast)) return state;
            }

            if (!activeProject.componentProgress[componentDef.id]) activeProject.componentProgress[componentDef.id] = 0;
            activeProject.componentProgress[componentDef.id] = Math.min(componentDef.progress, activeProject.componentProgress[componentDef.id] + progressAmount);

            if (itemDef.components.every(c => (activeProject.componentProgress[c.id] || 0) >= c.progress)) {
                if (state.activeOrder) handleOrderCompletion(state, state.activeOrder, showToast, setCompletedOrderInfo);
                else if (state.activeFreeCraft) handleFreeCraftCompletion(state, activeProject, showToast);
            }
        } else if (state.activeReforge) {
            state.activeReforge.progress += progressAmount;
            if (state.activeReforge.progress >= state.activeReforge.requiredProgress) handleCompleteReforge(state, state.activeReforge, showToast);
        } else if (state.activeInlay) {
            state.activeInlay.progress += progressAmount;
            if (state.activeInlay.progress >= state.activeInlay.requiredProgress) handleCompleteInlay(state, state.activeInlay, showToast);
        } else if (state.activeGraving) {
            state.activeGraving.progress += progressAmount;
            if (state.activeGraving.progress >= state.activeGraving.requiredProgress) handleCompleteGraving(state, state.activeGraving, showToast);
        }
        return state;
    };
    
    const handleMinigameClickPoint = (pointId) => {
        updateState(state => {
            const project = state.activeOrder || state.activeFreeCraft;
            if (!project?.minigameState?.active || project.minigameState.type !== 'click_points') return state;

            const minigameState = project.minigameState;
            const pointIndex = minigameState.points.findIndex(p => p.id === pointId);
            if (pointIndex === -1) return state;

            minigameState.points.splice(pointIndex, 1);
            minigameState.hitPoints += 1;
            audioController.play('click', 'G5', '16n');

            if (minigameState.hitPoints >= minigameState.totalPoints) {
                const minigameDef = definitions.items[project.itemKey].components.find(c => c.id === project.activeComponentId)?.minigame;
                const qualityBonus = minigameState.totalPoints * minigameDef.qualityBonus;
                const progressBonus = minigameState.totalPoints * minigameDef.progressBonus;
                const finalProgressBonus = endMinigame(project, true, qualityBonus, progressBonus);
                applyProgress(state, state.progressPerClick + finalProgressBonus, 0, 0);
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
            let qualityBonus = 0;
            let progressBonus = 0;

            if (minigameState.fillPercentage >= minigameState.perfectZone.from && minigameState.fillPercentage <= minigameState.perfectZone.to) {
                success = true;
                qualityBonus = minigameDef.perfectQualityBonus;
                progressBonus = minigameDef.perfectProgressBonus;
                 audioController.play('crit', 'C5', '8n');
            } else if (minigameState.fillPercentage >= minigameState.targetZone.from && minigameState.fillPercentage <= minigameState.targetZone.to) {
                success = true;
                qualityBonus = minigameDef.qualityBonus;
                progressBonus = minigameDef.progressBonus;
                 audioController.play('click', 'A4', '8n');
            } else {
                 audioController.play('click', 'C3', '8n');
            }
            const finalProgressBonus = endMinigame(project, success, qualityBonus, progressBonus);
            applyProgress(state, state.progressPerClick + finalProgressBonus, 0, 0);
            return state;
        });
    };


    return {
        handleStrikeAnvil: (e) => {
            triggerWorkAnimation();
            const clickX = e.clientX;
            const clickY = e.clientY;

            updateState(state => {
                const project = state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving;
                if (!project) {
                    showToast("Выберите проект для работы!", "error");
                    return state;
                }
                
                if((state.activeOrder || state.activeFreeCraft) && !project.activeComponentId){
                    showToast("Выберите компонент для работы!", "error");
                    return state;
                }
                
                const craftProject = state.activeOrder || state.activeFreeCraft;
                const componentDef = craftProject ? definitions.items[craftProject.itemKey]?.components.find(c => c.id === craftProject.activeComponentId) : null;

                if (craftProject && craftProject.minigameState?.active) {
                    if (craftProject.minigameState.type === 'bar_precision') {
                        const pos = craftProject.minigameState.position;
                        let hitQuality = 'miss';
                        let progressBonus = 0;
                        let qualityBonus = 0;
                        for (const zone of componentDef.minigame.zones) {
                            if (pos >= zone.from && pos <= zone.to) {
                                hitQuality = zone.quality;
                                progressBonus = zone.progressBonus;
                                qualityBonus = zone.qualityBonus;
                                break;
                            }
                        }
                        const finalProgressBonus = endMinigame(craftProject, hitQuality !== 'miss', qualityBonus, progressBonus);
                        applyProgress(state, state.progressPerClick + finalProgressBonus, clickX, clickY);
                        audioController.play(hitQuality !== 'miss' ? 'crit' : 'click', 'A4');
                    }
                    return state;
                }
                
                if (craftProject && componentDef?.minigame && Math.random() < componentDef.minigame.triggerChance) {
                    showToast("Момент истины!", "info");
                    audioController.play('complete', 'C4', '8n');
                    const minigameDef = componentDef.minigame;
                    
                    craftProject.minigameState = { active: true, type: minigameDef.type, startTime: Date.now() };

                    if (minigameDef.type === 'click_points') {
                        craftProject.minigameState.points = [];
                        craftProject.minigameState.totalPoints = Math.floor(Math.random() * (minigameDef.pointsCount.max - minigameDef.pointsCount.min + 1)) + minigameDef.pointsCount.min;
                        craftProject.minigameState.hitPoints = 0;
                    }
                    if (minigameDef.type === 'hold_and_release') {
                        craftProject.minigameState.fillPercentage = 0;
                        craftProject.minigameState.isHolding = false;
                        const zoneSize = Math.floor(Math.random() * (minigameDef.zoneSize.max - minigameDef.zoneSize.min + 1)) + minigameDef.zoneSize.min;
                        const perfectSize = Math.floor(Math.random() * (minigameDef.perfectZoneSize.max - minigameDef.perfectZoneSize.min + 1)) + minigameDef.perfectZoneSize.min;
                        const targetStart = Math.random() * (100 - zoneSize);
                        craftProject.minigameState.targetZone = { from: targetStart, to: targetStart + zoneSize };
                        const perfectStart = targetStart + Math.random() * (zoneSize - perfectSize);
                        craftProject.minigameState.perfectZone = { from: perfectStart, to: perfectStart + perfectSize };
                    }
                    if(minigameDef.type === 'bar_precision') {
                        craftProject.minigameState.position = 0;
                    }
                } else {
                    audioController.play('click', 'C3');
                    visualEffects.showParticleEffect(clickX, clickY, 'default');
                    applyProgress(state, state.progressPerClick, clickX, clickY);
                }

                return state;
            });
        },
        handleSelectComponent: (componentId) => {
            updateState(state => {
                if (state.activeOrder) state.activeOrder.activeComponentId = componentId;
                else if (state.activeFreeCraft) state.activeFreeCraft.activeComponentId = componentId;
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
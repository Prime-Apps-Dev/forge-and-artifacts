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
import { getScaledComponentProgress } from '../utils/helpers.js';

/**
 * Обрабатывает случайные события во время крафта: применяет активные и генерирует новые.
 * @param {object} state - Мутируемый объект состояния игры.
 * @param {function} showToast - Функция для отображения уведомлений.
 */
function handleCraftingEvents(state, showToast) {
    const now = Date.now();
    
    // Сбрасываем временные модификаторы перед каждым ударом
    state.craftingEventModifiers = {
        progressMultiplier: 1.0,
        isNextCritGuaranteed: false,
        skipNextClick: false,
        minigameZoneSizeModifier: 1.0,
    };

    // Применяем эффекты от активных событий и уменьшаем их длительность
    if (state.activeCraftingEvents) {
        state.activeCraftingEvents = state.activeCraftingEvents.filter(event => {
            const eventDef = definitions.craftingEvents[event.id];
            if (!eventDef) return false;

            if (event.duration_type === 'seconds' && now > event.startTime + event.duration * 1000) {
                return false; // Время вышло
            }
            if (event.duration_type === 'clicks' && event.duration <= 0) {
                return false; // Клики закончились
            }

            // Применяем активный эффект
            switch (event.id) {
                case 'brittle_metal':
                    state.craftingEventModifiers.progressMultiplier *= 0.5;
                    break;
                case 'distraction':
                    state.craftingEventModifiers.skipNextClick = true;
                    break;
                case 'tool_wear':
                    state.craftingEventModifiers.progressMultiplier *= 0.9;
                    break;
                case 'inspiration':
                    state.craftingEventModifiers.isNextCritGuaranteed = true;
                    break;
                case 'master_touch':
                    state.craftingEventModifiers.minigameZoneSizeModifier = 1.5;
                    break;
            }
            return true;
        });
    }


    // С шансом 1.5% генерируем новое событие
    if (Math.random() < 0.015) {
        const eventPool = Object.values(definitions.craftingEvents);
        const randomEventDef = eventPool[Math.floor(Math.random() * eventPool.length)];
        
        showToast(randomEventDef.name, randomEventDef.type);
        audioController.play(randomEventDef.type === 'positive' ? 'levelup' : 'crit', 'C4');

        if (randomEventDef.isImmediate) {
            // Мгновенные события, которые не добавляются в очередь
            switch (randomEventDef.id) {
                case 'lucky_strike':
                    const project = state.activeOrder || state.activeFreeCraft;
                    if (project && project.activeComponentId) {
                        const itemDef = definitions.items[project.itemKey];
                        const componentDef = itemDef.components.find(c => c.id === project.activeComponentId);
                        if (componentDef) {
                            const bonusProgress = getScaledComponentProgress(itemDef, componentDef) * 0.1;
                            project.componentProgress[componentDef.id] = (project.componentProgress[componentDef.id] || 0) + bonusProgress;
                        }
                    }
                    break;
                case 'resource_find':
                    const amount = Math.floor(Math.random() * 5) + 1;
                    state.ironOre += amount;
                    showToast(`Найдено: +${amount} железной руды!`, 'success');
                    break;
                case 'sudden_insight':
                    const matterAmount = Math.floor(Math.random() * 3) + 1;
                    state.matter += matterAmount;
                    showToast(`Озарение: +${matterAmount} материи!`, 'success');
                    break;
                case 'slippery_grip':
                    const sparksLost = Math.floor(state.sparks * 0.01);
                    state.sparks = Math.max(0, state.sparks - sparksLost);
                    showToast(`Потеряно: -${sparksLost} искр!`, 'error');
                    break;
            }
        } else {
            // События с длительностью, добавляем в массив активных
            const newEvent = {
                id: randomEventDef.id,
                duration: randomEventDef.duration,
                duration_type: randomEventDef.duration_type,
                startTime: now
            };
            state.activeCraftingEvents.push(newEvent);
        }
    }
}


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

    const applyProgress = (state, progressAmount, clickX, clickY) => {
        const activeProject = state.activeOrder || state.activeFreeCraft;
        if (!activeProject || !activeProject.activeComponentId) return false;

        const itemDef = definitions.items[activeProject.itemKey];
        const componentDef = itemDef.components.find(c => c.id === activeProject.activeComponentId);
        
        if (!componentDef || activeProject.completedComponents[componentDef.id]) return false;

        if (state.purchasedSkills.divisionOfLabor && componentDef.workstation !== state.activeWorkstationId) {
            showToast(`Неверный верстак! Требуется: ${definitions.workstations[componentDef.workstation].name}`, 'error');
            return false;
        }
        
        // Декремент для событий, зависящих от кликов
        state.activeCraftingEvents.forEach(event => {
            if(event.duration_type === 'clicks') event.duration -=1;
        });

        if (state.craftingEventModifiers.skipNextClick) {
            return false; 
        }

        state.totalClicks = (state.totalClicks || 0) + 1;
        updateQuestProgress(state, 'totalClicks', {}, showToast);
        
        const isCrit = state.craftingEventModifiers.isNextCritGuaranteed || Math.random() < state.critChance;
        if(isCrit && activeProject.craftingMetadata) {
            activeProject.craftingMetadata.critSuccessCount++;
        }
        let finalProgress = isCrit ? progressAmount * state.critBonus : progressAmount;
        finalProgress *= state.craftingEventModifiers.progressMultiplier;

        const workstationMod = state.workstationBonus[state.activeWorkstationId] || 1.0;
        finalProgress *= workstationMod;

        const materialType = itemDef.baseIngot.replace('Ingots', '');
        const speedModifiers = state.craftingSpeedModifiers || {};
        finalProgress *= (speedModifiers.all || 1.0) * (speedModifiers[materialType] || 1.0);

        const currentWorkstation = state.workstations[state.activeWorkstationId];
        const workstationDef = definitions.workstations[state.activeWorkstationId];
        if (currentWorkstation && workstationDef && currentWorkstation.level < workstationDef.maxLevel) {
            currentWorkstation.xp += finalProgress;
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
        
        if (activeProject.componentProgress[componentDef.id] === undefined) activeProject.componentProgress[componentDef.id] = 0;

        if (activeProject.componentProgress[componentDef.id] === 0 && componentDef.cost) {
            if (!canAffordAndPay(state, componentDef.cost, showToast)) return false;
        }
        
        const scaledRequiredProgress = getScaledComponentProgress(itemDef, componentDef);
        activeProject.componentProgress[componentDef.id] = Math.min(scaledRequiredProgress, activeProject.componentProgress[componentDef.id] + finalProgress);

        if (activeProject.componentProgress[componentDef.id] >= scaledRequiredProgress) {
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

                if(activeProject.minigameQualityBuffer?.[componentDef.id]) delete activeProject.minigameQualityBuffer[componentDef.id];

                showToast(`Компонент "${componentDef.name}" завершен!`, 'success');
                audioController.play('complete', 'A4', '8n');

                if (Object.keys(activeProject.completedComponents).length >= itemDef.components.length) {
                    if (state.activeOrder) handleOrderCompletion(state, state.activeOrder, showToast, setCompletedOrderInfo);
                    else if (state.activeFreeCraft) handleFreeCraftCompletion(state, activeProject, showToast);
                }
            }
        }
        return true; 
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
            const requiredProgress = getScaledComponentProgress(definitions.items[project.itemKey], componentDef);
            const remainingProgress = requiredProgress - currentProgress;
            const calculatedBonus = requiredProgress * (0.01 + Math.random() * 0.09);
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
            
            handleCraftingEvents(state, showToast);

            const wasProgressApplied = applyProgress(state, state.progressPerClick, clickX, clickY);

            if (wasProgressApplied) {
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
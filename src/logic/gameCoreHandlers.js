// src/logic/gameCoreHandlers.js
import { definitions } from '../data/definitions';
import { audioController } from '../utils/audioController';
import { gameConfig as GAME_CONFIG } from '../constants/gameConfig';
import {
    handleFreeCraftCompletion,
    handleCompleteReforge,
    handleCompleteInlay,
    handleCompleteGraving,
    handleOrderCompletion,
    handleSaleCompletion
} from './gameCompletions';
import { visualEffects } from '../utils/visualEffects';

export function createCoreHandlers({
    showToast,
    setIsWorking,
    workTimeoutRef,
    setCompletedOrderInfo,
    updateState
}) {
    const triggerWorkAnimation = () => {
        setIsWorking(true);
        if (workTimeoutRef.current) clearTimeout(workTimeoutRef.current);
        workTimeoutRef.current = setTimeout(() => setIsWorking(false), 200);
    };

    const applyProgress = (state, progressAmount, clickX = null, clickY = null) => {
        state.totalClicks = (state.totalClicks || 0) + 1;

        const workstationMod = state.workstationBonus[state.activeWorkstationId] || 1;
        progressAmount *= workstationMod;

        // Начисление опыта верстаку
        const currentWorkstation = state.workstations[state.activeWorkstationId];
        const workstationDef = definitions.workstations[state.activeWorkstationId];
        if (currentWorkstation && workstationDef) {
            if (currentWorkstation.level < workstationDef.maxLevel) {
                currentWorkstation.xp += progressAmount; // XP начисляется от базового прогресса, не от модифицированного
                while (currentWorkstation.xp >= currentWorkstation.xpToNextLevel && currentWorkstation.level < workstationDef.maxLevel) {
                    currentWorkstation.xp -= currentWorkstation.xpToNextLevel;
                    currentWorkstation.level += 1;
                    currentWorkstation.xpToNextLevel = Math.floor(currentWorkstation.xpToNextLevel * workstationDef.xpToNextLevelMultiplier);
                    showToast(`Верстак "${workstationDef.name}" повышен! Уровень ${currentWorkstation.level}!`, 'levelup');
                    audioController.play('levelup', 'E5', '4n');
                    // Вызов эффекта частиц при повышении уровня верстака
                    if (clickX !== null && clickY !== null) {
                        visualEffects.showParticleEffect(clickX, clickY, 'workstation_levelup');
                    }
                    // Пересчет модификаторов после повышения уровня верстака
                    // Это будет сделано в recalculateAllModifiers
                }
            } else {
                currentWorkstation.xp = currentWorkstation.xpToNextLevel; // Чтобы не превышать XP на макс. уровне
            }
        }


        if (state.activeSale) {
            const saleProject = state.activeSale;
            saleProject.progress += progressAmount / workstationMod;
            if (saleProject.progress >= saleProject.requiredProgress) {
                handleSaleCompletion(state, saleProject.shelfIndex, showToast);
            }
            return state;
        }

        if (state.activeInlay) {
            const inlayProject = state.activeInlay;
            if (state.purchasedSkills.divisionOfLabor && state.activeWorkstationId !== 'grindstone') {
                showToast(`Не тот станок для инкрустации! Требуется: ${definitions.workstations.grindstone.name}`, "error");
                return state;
            }
            inlayProject.progress += progressAmount;
            if (inlayProject.progress >= inlayProject.requiredProgress) {
                handleCompleteInlay(state, inlayProject, showToast);
            }
            return state;
        }

        if (state.activeReforge) {
            const reforgeProject = state.activeReforge;
            if (state.purchasedSkills.divisionOfLabor && state.activeWorkstationId !== 'anvil') {
                showToast(`Не тот станок для перековки! Требуется: ${definitions.workstations.anvil.name}`, "error");
                return state;
            }
            reforgeProject.progress += progressAmount;
            if (reforgeProject.progress >= reforgeProject.requiredProgress) {
                handleCompleteReforge(state, reforgeProject, showToast);
            }
            return state;
        }

        if (state.activeGraving) {
            const gravingProject = state.activeGraving;
            if (state.purchasedSkills.divisionOfLabor && state.activeWorkstationId !== 'workbench') {
                showToast(`Не тот станок для гравировки! Требуется: ${definitions.workstations.workbench.name}`, "error");
                return state;
            }
            gravingProject.progress += progressAmount;
            if (gravingProject.progress >= gravingProject.requiredProgress) {
                handleCompleteGraving(state, gravingProject, showToast);
            }
            return state;
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
                for (const resource in stageDef.cost) {
                    const cost = stageDef.cost[resource];
                    const resourceStorage = resource in state.specialItems ? 'specialItems' : 'main';
                    const currentAmount = resourceStorage === 'main' ? state[resource] : state.specialItems[resource];
                    if (currentAmount < cost) {
                        let resourceName = definitions.specialItems[resource]?.name || resource.replace('Ingots', ' слитков').replace('sparks',' искр').replace('matter',' материи');
                        showToast(`Недостаточно для этапа: ${resourceName} (${cost} требуется)!`, 'error');
                        return state;
                    }
                }
                for (const resource in stageDef.cost) {
                    const cost = stageDef.cost[resource];
                    const resourceStorage = resource in state.specialItems ? 'specialItems' : 'main';
                    if(resourceStorage === 'main') { state[resource] -= cost; }
                    else { state.specialItems[resource] -= cost; }
                    if (resource === 'matter') state.totalMatterSpent += cost;
                }
            }
            epicOrder.progress += progressAmount;
            if (epicOrder.progress >= stageDef.progress * state.componentProgressRequiredModifier) {
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

            if (!componentDef) {
                showToast("Ошибка: Выбранный компонент для работы не найден! Выберите компонент.", "error");
                return state;
            }

            if ((activeProject.componentProgress[componentDef.id] || 0) >= componentDef.progress) {
                showToast(`Компонент "${componentDef.name}" уже завершен. Выберите следующий!`, "info");
                return state;
            }

            if (state.purchasedSkills.divisionOfLabor && componentDef.workstation !== state.activeWorkstationId) {
                showToast(`Не тот станок! Для компонента "${componentDef.name}" требуется: ${definitions.workstations[componentDef.workstation].name}`, "error");
                return state;
            }

            if ((activeProject.componentProgress[componentDef.id] || 0) === 0 && componentDef.cost) {
                if (state.artifacts.aegis.status === 'completed' && Math.random() < 0.10) {
                    showToast("Эгида защитила вас от трат!", 'levelup');
                } else {
                    let canAfford = true;
                    for (const resource in componentDef.cost) {
                        const actualCost = Math.max(1, componentDef.cost[resource] - (state.componentCostReduction || 0));
                        const resourceStorage = resource in state.specialItems ? 'specialItems' : 'main';
                        const currentAmount = resourceStorage === 'main' ? state[resource] : state.specialItems[resource];
                        if (currentAmount < actualCost) {
                            let resourceName = definitions.specialItems[resource]?.name || resource.replace('Ingots', ' слитков').replace('sparks',' искр').replace('matter',' материи');
                            showToast(`Недостаточно: ${resourceName} (${actualCost} требуется)!`, 'error');
                            canAfford = false;
                            break;
                        }
                    }
                    if (!canAfford) return state;
                    for (const resource in componentDef.cost) {
                        const actualCost = Math.max(1, componentDef.cost[resource] - (state.componentCostReduction || 0));
                        const resourceStorage = resource in state.specialItems ? 'specialItems' : 'main';
                        if (resourceStorage === 'main') { state[resource] -= actualCost; }
                        else { state.specialItems[resource] -= actualCost; }
                        if (resource === 'matter') state.totalMatterSpent += actualCost;
                    }
                }
            }

            let criticalProgressBonus = 0;
            if (state.purchasedSkills.mithrilCritStrike && Math.random() < 0.1) {
                criticalProgressBonus += (progressAmount * (state.critBonusModifier || 0.5));
                showToast("Критический удар Мифрила: Дополнительный прогресс!", "crit");
            }
            if (state.purchasedSkills.legendaryCritStrike && Math.random() < 0.05) {
                criticalProgressBonus += (progressAmount * (state.critBonusModifier || 1.0));
                showToast("Критический удар Легенды: Огромный бонус!", "crit");
            }
            progressAmount += criticalProgressBonus;

            if (!activeProject.componentProgress[componentDef.id]) activeProject.componentProgress[componentDef.id] = 0;
            activeProject.componentProgress[componentDef.id] = Math.min(componentDef.progress, activeProject.componentProgress[componentDef.id] + progressAmount);

            const allComponentsComplete = itemDef.components.every(c => (activeProject.componentProgress[c.id] || 0) >= c.progress);

            if (allComponentsComplete) {
                if (state.activeOrder) {
                    handleOrderCompletion(state, state.activeOrder, showToast, setCompletedOrderInfo);
                } else if (state.activeFreeCraft) {
                    handleFreeCraftCompletion(state, activeProject, showToast);
                }
            }
            return state;
        }

        return state;
    };

    const handleStrikeAnvil = (state, clickX = null, clickY = null) => {
        triggerWorkAnimation();

        const isSale = !!state.activeSale;
        const activeProject = state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving;

        if (!activeProject) {
            showToast("Выберите проект для работы!", "error");
            return state;
        }

        const component = activeProject.itemKey ? definitions.items[activeProject.itemKey].components.find(c => c.id === activeProject.activeComponentId) : null;
        const minigameDef = component?.minigame;

        // Если активна мини-игра
        if (minigameDef && activeProject.minigameState?.active) {
            audioController.play('crit', 'A4');
            let hitQuality = 'miss';
            let progressBonus = 0;
            let qualityBonus = 0;

            if (minigameDef.type === 'bar_precision') {
                const pos = activeProject.minigameState.position;
                if (minigameDef.zones) {
                    for (const zone of minigameDef.zones) {
                        if (pos >= zone.from && pos <= zone.to) {
                            hitQuality = zone.quality;
                            progressBonus = zone.progressBonus * state.critBonus;
                            qualityBonus = zone.qualityBonus;
                            break;
                        }
                    }
                }
            } else if (minigameDef.type === 'hold_and_release') {
                const fillPercentage = activeProject.minigameState.fillPercentage;
                const targetZone = activeProject.minigameState.targetZone;
                const perfectZone = activeProject.minigameState.perfectZone;

                if (fillPercentage >= perfectZone.from && fillPercentage <= perfectZone.to) {
                    hitQuality = 'perfect';
                    progressBonus = minigameDef.perfectProgressBonus * state.critBonus;
                    qualityBonus = minigameDef.perfectQualityBonus;
                } else if (fillPercentage >= targetZone.from && fillPercentage <= targetZone.to) {
                    hitQuality = 'good';
                    progressBonus = minigameDef.progressBonus * state.critBonus;
                    qualityBonus = minigameDef.qualityBonus;
                }
                activeProject.minigameState.isHolding = false; // Отпускаем кнопку
            } else if (minigameDef.type === 'click_points') {
                // В этом режиме клик по наковальне завершает мини-игру или засчитывает промах
                // Если нет hitPoints набраных, то провал. Если есть - считаем завершенным успешно.
                if ((activeProject.minigameState.hitPoints || 0) > 0) {
                    hitQuality = 'good'; // Считаем, что если хоть что-то набрали, то успех
                    progressBonus = (activeProject.minigameState.hitPoints * minigameDef.progressBonus) * state.critBonus;
                    qualityBonus = (activeProject.minigameState.hitPoints * minigameDef.qualityBonus);
                } else {
                    hitQuality = 'miss'; // Полный провал
                }
            }

            if (hitQuality !== 'miss') {
                showToast(`Отличный удар! (+${qualityBonus.toFixed(1)} к качеству)`, hitQuality === 'perfect' ? 'crit' : 'success');
                activeProject.qualityPoints = (activeProject.qualityPoints || 0) + qualityBonus;
                activeProject.qualityHits = (activeProject.qualityHits || 0) + 1;
                applyProgress(state, state.progressPerClick + progressBonus, clickX, clickY);
            } else {
                showToast("Промах!", "error");
                applyProgress(state, state.progressPerClick * 0.5, clickX, clickY);
                // Штраф к качеству предмета при провале мини-игры
                if (minigameDef.penalty) {
                    const itemInInventory = state.inventory.find(i => i.uniqueId === activeProject.uniqueId); // Если это существующий предмет
                    if (itemInInventory) {
                        itemInInventory.quality = Math.max(1.0, itemInInventory.quality - minigameDef.penalty);
                    } else if (activeProject.quality) { // Если это новый предмет, который формируется
                        activeProject.quality = Math.max(1.0, activeProject.quality - minigameDef.penalty);
                    }
                    showToast(`Штраф: Качество предмета снижено!`, 'error');
                }
            }
            activeProject.minigameState = null; // Завершаем мини-игру
        } else {
            // Обычный удар или запуск мини-игры
            audioController.play('click', 'C3');
            applyProgress(state, state.progressPerClick, clickX, clickY);

            if (state.activeOrder && component?.minigame && Math.random() < component.minigame.triggerChance) {
                // Запускаем мини-игру
                let newMinigameState = {
                    active: true,
                    type: minigameDef.type,
                    startTime: Date.now(),
                    initialBlockSet: false, // Флаг для блокировки наковальни
                };

                if (minigameDef.type === 'bar_precision') {
                    newMinigameState.position = 0;
                    newMinigameState.direction = 1;
                } else if (minigameDef.type === 'hold_and_release') {
                    newMinigameState.isHolding = false;
                    newMinigameState.fillPercentage = 0;
                    // Генерируем случайную позицию для целевой и идеальной зоны
                    const zoneStart = Math.random() * (100 - GAME_CONFIG.MINIGAME_QUALITY_ZONE_MAX_SIZE);
                    const zoneEnd = zoneStart + (GAME_CONFIG.MINIGAME_QUALITY_ZONE_MIN_SIZE + Math.random() * (GAME_CONFIG.MINIGAME_QUALITY_ZONE_MAX_SIZE - GAME_CONFIG.MINIGAME_QUALITY_ZONE_MIN_SIZE));
                    const perfectZoneStart = zoneStart + Math.random() * (zoneEnd - zoneStart - GAME_CONFIG.MINIGAME_PERFECT_ZONE_MIN_SIZE);
                    const perfectZoneEnd = perfectZoneStart + (GAME_CONFIG.MINIGAME_PERFECT_ZONE_MIN_SIZE + Math.random() * (GAME_CONFIG.MINIGAME_PERFECT_ZONE_MAX_SIZE - GAME_CONFIG.MINIGAME_PERFECT_ZONE_MIN_SIZE));

                    newMinigameState.targetZone = { from: zoneStart, to: zoneEnd };
                    newMinigameState.perfectZone = { from: perfectZoneStart, to: perfectZoneEnd };
                } else if (minigameDef.type === 'click_points') {
                    newMinigameState.points = [];
                    newMinigameState.hitPoints = 0;
                    newMinigameState.totalPoints = Math.floor(Math.random() * (minigameDef.pointsCount.max - minigameDef.pointsCount.min + 1)) + minigameDef.pointsCount.min;
                }

                activeProject.minigameState = newMinigameState;
                showToast("Момент истины! Приготовьтесь к мини-игре!", "info");
                audioController.play('complete', 'C4', '8n');
            }
        }
        return state;
    };

    const handleClickPointMinigame = (state, pointId) => {
        const activeProject = state.activeOrder || state.activeFreeCraft;
        if (!activeProject || !activeProject.minigameState || activeProject.minigameState.type !== 'click_points') {
            return state;
        }

        const minigameState = activeProject.minigameState;
        const itemDef = definitions.items[activeProject.itemKey];
        const componentDef = itemDef.components.find(c => c.id === activeProject.activeComponentId);
        const minigameDef = componentDef?.minigame;

        const pointIndex = minigameState.points.findIndex(p => p.id === pointId);

        if (pointIndex !== -1) {
            minigameState.points.splice(pointIndex, 1); // Удаляем точку
            minigameState.hitPoints = (minigameState.hitPoints || 0) + 1; // Увеличиваем счетчик попаданий
            showToast("Попал!", "success");
            audioController.play('click', 'C5', '16n');
        } else if (pointId === null) {
             // Это случай, когда мини-игра завершается из-за истечения времени
             let hitQuality = 'miss';
             let progressBonus = 0;
             let qualityBonus = 0;

             if ((minigameState.hitPoints || 0) > 0) {
                 hitQuality = 'good';
                 progressBonus = (minigameState.hitPoints * minigameDef.progressBonus) * state.critBonus;
                 qualityBonus = (minigameState.hitPoints * minigameDef.qualityBonus);
             }

             if (hitQuality !== 'miss') {
                 showToast(`Мини-игра завершена! (+${qualityBonus.toFixed(1)} к качеству)`, 'success');
                 activeProject.qualityPoints = (activeProject.qualityPoints || 0) + qualityBonus;
                 activeProject.qualityHits = (activeProject.qualityHits || 0) + 1;
                 applyProgress(state, state.progressPerClick + progressBonus);
             } else {
                 showToast("Мини-игра провалена!", "error");
                 applyProgress(state, state.progressPerClick * 0.5);
                 if (minigameDef.penalty) {
                     const itemInInventory = state.inventory.find(i => i.uniqueId === activeProject.uniqueId); // Если это существующий предмет
                     if (itemInInventory) {
                         itemInInventory.quality = Math.max(1.0, itemInInventory.quality - minigameDef.penalty);
                     } else if (activeProject.quality) { // Если это новый предмет, который формируется
                         activeProject.quality = Math.max(1.0, activeProject.quality - minigameDef.penalty);
                     }
                     showToast(`Штраф: Качество предмета снижено!`, 'error');
                 }
             }
             activeProject.minigameState = null; // Завершаем мини-игру
        }

        return state;
    };

    const handleSelectWorkstation = (state, workstationId) => {
        state.activeWorkstationId = workstationId;
        return state;
    };

    const handleSelectComponent = (state, componentId) => {
        if (state.activeOrder) {
            state.activeOrder.activeComponentId = componentId;
        }
        if (state.activeFreeCraft) {
            state.activeFreeCraft.activeComponentId = componentId;
        }
        return state;
    };

    const handleCloseRewardModal = () => {
        setCompletedOrderInfo(null);
    };

    // Добавляем updateMinigameState в возвращаемые хэндлеры
    const updateMinigameState = (updater) => {
        updateState(updater);
    };

    return {
        applyProgress,
        handleStrikeAnvil,
        handleClickPointMinigame,
        handleSelectWorkstation,
        handleSelectComponent,
        handleCloseRewardModal,
        updateMinigameState,
    };
}
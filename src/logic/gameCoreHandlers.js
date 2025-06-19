// src/logic/gameCoreHandlers.js
import { definitions } from '../data/definitions';
import { audioController } from '../utils/audioController';
import {
    handleFreeCraftCompletion,
    handleCompleteReforge,
    handleCompleteInlay,
    handleCompleteGraving,
    handleOrderCompletion,
    checkForNewQuests,
    handleSaleCompletion
} from './gameCompletions';

/**
 * Фабрика для создания основных низкоуровневых обработчиков игры.
 */
export function createCoreHandlers({
    updateState,
    showToast,
    setIsWorking,
    workTimeoutRef,
    setCompletedOrderInfo,
}) {

    const triggerWorkAnimation = () => {
        setIsWorking(true);
        if (workTimeoutRef.current) clearTimeout(workTimeoutRef.current);
        workTimeoutRef.current = setTimeout(() => setIsWorking(false), 200);
    };

    /**
     * Применяет прогресс к текущему активному проекту.
     */
    const applyProgress = (state, progressAmount) => {
        const workstationMod = state.workstationBonus[state.activeWorkstationId] || 1;
        progressAmount *= workstationMod;

        if (state.artifacts.bastion?.status === 'completed') {
            progressAmount *= 1.15;
        }

        if (state.activeSale) {
            const saleProject = state.activeSale;
            saleProject.progress += progressAmount / workstationMod;
            if (saleProject.progress >= saleProject.requiredProgress) {
                handleSaleCompletion(state, saleProject, showToast);
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

        const activeProject = state.activeOrder || state.activeFreeCraft;

        if (state.currentEpicOrder) {
            const epicOrder = state.currentEpicOrder;
            const artifactDef = definitions.greatArtifacts[epicOrder.artifactId];
            const stageDef = artifactDef.epicOrder.find(s => s.stage === epicOrder.currentStage);

            // ИЗМЕНЕНИЕ: УДАЛЕНО: Блокировка крафта артефактов в первом прохождении из gameCoreHandlers
            // Это будет обрабатываться в usePlayerActions.handleCraftArtifact.

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
                }
            }
            epicOrder.progress += progressAmount;
            if (epicOrder.progress >= stageDef.progress) {
                const isLastStage = epicOrder.currentStage === artifactDef.epicOrder.length;
                if (isLastStage) {
                    audioController.play('levelup', 'C6', '1n');
                    state.artifacts[epicOrder.artifactId].status = 'completed';
                    if (epicOrder.artifactId === 'crown') {
                        state.sparksModifier += 0.25;
                        state.matterModifier += 0.25;
                    }
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

        if (activeProject) {
            const itemDef = definitions.items[activeProject.itemKey];

            // ИЗМЕНЕНИЕ: УДАЛЕНО: Блокировка крафта предметов в первом прохождении из gameCoreHandlers
            // Это будет обрабатываться в usePlayerActions.handleStartFreeCraft.

            const componentDef = itemDef.components.find(c => c.id === activeProject.activeComponentId);
            if (!componentDef || (activeProject.componentProgress[componentDef.id] || 0) >= componentDef.progress) {
                return state;
            }
            if (state.purchasedSkills.divisionOfLabor && componentDef.workstation !== state.activeWorkstationId) {
                showToast(`Не тот станок! Требуется: ${definitions.workstations[componentDef.workstation].name}`, "error");
                return state;
            }
            if ((activeProject.componentProgress[componentDef.id] || 0) === 0 && componentDef.cost) {
                let canAfford = true;
                if (state.artifacts.aegis.status === 'completed' && Math.random() < 0.10) {
                    showToast("Эгида защитила вас от трат!", 'levelup');
                } else {
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
                    }
                }
            }
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

    const handleStrikeAnvil = (state) => {
        triggerWorkAnimation();

        const activeProject = state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving || state.activeSale;

        if (!activeProject) {
            showToast("Выберите проект для работы!", "error");
            return state;
        }

        if ((state.activeOrder || state.activeFreeCraft) && !state.activeReforge && !state.activeInlay && !state.activeGraving && !state.activeSale && !activeProject.activeComponentId) {
             showToast("Выберите компонент для работы!", "error");
            return state;
        }

        const isSale = !!state.activeSale;
        const minigameState = state.activeOrder?.minigameState;

        if (!isSale && minigameState?.active && state.activeOrder) {
            const component = definitions.items[state.activeOrder.itemKey].components.find(c => c.id === state.activeOrder.activeComponentId);
            if (component?.minigame) {
                audioController.play('crit', 'A4');
                const pos = minigameState.position;
                let hitQuality = 'miss';
                let progressBonus = 0;
                let qualityBonus = 0;
                if (component.minigame.zones) {
                    for (const zone of component.minigame.zones) {
                        if (pos >= zone.from && pos <= zone.to) {
                            hitQuality = zone.quality;
                            progressBonus = zone.progressBonus * state.progressPerClick;
                            qualityBonus = zone.qualityBonus;
                            break;
                        }
                    }
                }
                if (hitQuality !== 'miss') {
                    showToast(`Отличный удар! (+${qualityBonus.toFixed(1)} к качеству)`, hitQuality === 'perfect' ? 'crit' : 'success');
                    state.activeOrder.qualityPoints = (state.activeOrder.qualityPoints || 0) + qualityBonus;
                    state.activeOrder.qualityHits = (state.activeOrder.qualityHits || 0) + 1;
                    applyProgress(state, state.progressPerClick + progressBonus);
                } else {
                    showToast("Промах!", "error");
                    applyProgress(state, state.progressPerClick * 0.5);
                }
                minigameState.active = false;
            }
        } else {
            audioController.play('click', 'C3');
            applyProgress(state, state.progressPerClick);
            
            if (state.activeOrder && !isSale) {
                const itemDef = definitions.items[state.activeOrder.itemKey];
                // ИЗМЕНЕНИЕ: УДАЛЕНО: Блокировка крафта предметов в первом прохождении здесь
                // if (state.isFirstPlaythrough && itemDef.firstPlaythroughLocked) { ... }

                const component = itemDef.components.find(c => c.id === state.activeOrder.activeComponentId);
                if(component?.minigame && Math.random() < component.minigame.triggerChance) {
                       state.activeOrder.minigameState = { active: true, position: 0, direction: 1 };
                       showToast("Момент истины!", "info");
                       audioController.play('complete', 'C4', '8n');
                }
            }
        }
        return state;
    }

    const handleSelectWorkstation = (state, workstationId) => {
        state.activeWorkstationId = workstationId;
        return state;
    }

    const handleSelectComponent = (state, componentId) => {
        if (state.activeOrder) state.activeOrder.activeComponentId = componentId;
        if (state.activeFreeCraft) state.activeFreeCraft.activeComponentId = componentId;
        return state;
    }

    const handleCloseRewardModal = () => {
        setCompletedOrderInfo(null);
    }

    return {
        applyProgress,
        handleStrikeAnvil,
        handleSelectWorkstation,
        handleSelectComponent,
        handleCloseRewardModal,
    };
}
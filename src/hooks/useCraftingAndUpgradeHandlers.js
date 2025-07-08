// src/hooks/useCraftingAndUpgradeHandlers.js
import { useCallback, useMemo } from 'react';
import { definitions } from '../data/definitions/index.js';
import { formatNumber } from '../utils/formatters.jsx';
import { recalculateAllModifiers } from '../utils/gameStateUtils';
import {
    handleFreeCraftCompletion,
    handleCompleteReforge,
    handleCompleteInlay,
    handleCompleteGraving,
    handleOrderCompletion,
} from '../logic/gameCompletions';
import { gameConfig as GAME_CONFIG } from '../constants/gameConfig';
import { audioController } from '../utils/audioController';
import { visualEffects } from '../utils/visualEffects';
import { canAffordAndPay } from '../utils/gameUtils';

export const useCraftingAndUpgradeHandlers = ({ updateState, showToast, setCompletedOrderInfo, gameStateRef }) => {

    const handleAcceptOrder = useCallback((orderId) => {
        updateState(state => {
            if (state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving) { showToast("Вы уже заняты другим проектом!", 'error'); return state; }
            const orderIndex = state.orderQueue.findIndex(o => o.id === orderId);
            if (orderIndex === -1) return state;
            const [orderToAccept] = state.orderQueue.splice(orderIndex, 1);
            if (orderToAccept.isRisky) {
                const now = Date.now();
                const randomPenaltyType = Math.random();
                if (randomPenaltyType < 0.5) {
                    const penaltySparks = Math.floor(orderToAccept.rewards.sparks * (GAME_CONFIG.RISKY_ORDER_SPARK_PENALTY_MIN_MULTIPLIER + Math.random() * GAME_CONFIG.RISKY_ORDER_SPARK_PENALTY_RANDOM_MULTIPLIER));
                    state.sparks = Math.max(0, state.sparks - penaltySparks);
                    showToast(`Рискованный заказ: Вы потеряли ${formatNumber(penaltySparks)} искр!`, 'error');
                } else if (randomPenaltyType < 0.8) {
                    const lockDuration = GAME_CONFIG.SHOP_LOCK_DURATION_MIN * (1 + Math.random() * GAME_CONFIG.SHOP_LOCK_DURATION_RANDOM_MULTIPLIER);
                    state.isShopLocked = true;
                    state.shopLockEndTime = now + lockDuration * 1000;
                    showToast(`Рискованный заказ: Ваш магазин заблокирован на ${Math.round(lockDuration)} сек.!`, 'error');
                } else {
                    const penaltyDuration = GAME_CONFIG.RISKY_ORDER_BROKEN_TOOL_DURATION * (1 + Math.random() * 1);
                    state.progressPerClick = Math.max(1, state.progressPerClick - 1);
                    setTimeout(() => updateState(s => { s.progressPerClick += 1; showToast("Инструмент починен, прогресс восстановлен!", "info"); return s; }), penaltyDuration * 1000);
                    showToast(`Рискованный заказ: Ваш инструмент поврежден, прогресс снижен!`, 'error');
                }
            }
            orderToAccept.startTime = Date.now();
            orderToAccept.timeLimits = { gold: (definitions.items[orderToAccept.itemKey].components.reduce((sum, c) => sum + c.progress, 0) / 2) * state.timeLimitModifier, silver: definitions.items[orderToAccept.itemKey].components.reduce((sum, c) => sum + c.progress, 0) * state.timeLimitModifier };
            
            orderToAccept.completedComponents = {};
            orderToAccept.activeComponentId = null; 
            orderToAccept.minigameCount = 0;
            orderToAccept.minigameQualityBuffer = {}; 
            orderToAccept.craftingMetadata = {
                critSuccessCount: 0,
            };

            state.activeOrder = orderToAccept;
            state.masteryXP = (state.masteryXP || 0) + Math.max(1, Math.floor((definitions.items[orderToAccept.itemKey].components.reduce((sum, c) => sum + c.progress, 0) * 0.05)));
            showToast("Заказ принят в работу!", "info");
            return state;
        });
    }, [updateState, showToast]);

    const handleStartFreeCraft = useCallback((itemKey) => {
        updateState(state => {
            if (state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving) { showToast("Вы уже заняты другим проектом!", 'error'); return state; }
            const item = definitions.items[itemKey];
            if (!item) return state;
            if (state.isFirstPlaythrough && item.firstPlaythroughLocked) {
                showToast(`Этот предмет доступен для создания только после первого Переселения!`, "error");
                return state;
            }
            if (item.blueprintId && !(state.specialItems[item.blueprintId] > 0)) {
                showToast(`Необходим чертеж "${definitions.specialItems[item.blueprintId]?.name || item.blueprintId}" для создания этого предмета!`, "error");
                return state;
            }
            
            state.activeFreeCraft = {
                itemKey,
                componentProgress: {}, 
                completedComponents: {}, 
                activeComponentId: null, 
                minigameCount: 0,
                minigameQualityBuffer: {},
                craftingMetadata: {
                    critSuccessCount: 0,
                },
            };

            showToast(`Начато создание предмета: ${item.name}`, "info");
            return state;
        });
    }, [updateState, showToast]);

    const handleStartReforge = useCallback((itemUniqueId) => {
        const state = gameStateRef.current;
        const baseRisk = GAME_CONFIG.REFORGE_BASE_RISK;
        const riskModifier = state.riskModifier || 1.0;
        const finalRiskPercent = (baseRisk * riskModifier * 100).toFixed(0);
        let confirmationMessage = "Перековка — рискованный процесс, который может ухудшить качество предмета. Продолжить?";
        if (state.purchasedSkills.riskAssessment) {
            confirmationMessage = `Перековка рискованна! Шанс неудачи: ${finalRiskPercent}%. Продолжить?`;
        }
        if (window.confirm(confirmationMessage)) {
            updateState(state => {
                if (state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving) { showToast("Вы уже заняты другим проектом!", 'error'); return state; }
                const item = state.inventory.find(i => i.uniqueId === itemUniqueId);
                if (!item) { showToast("Предмет для перековки не найден!", 'error'); return state; }

                const reforgeCost = definitions.items[item.itemKey].reforgeCost || { sparks: 500 };
                if (!canAffordAndPay(state, reforgeCost, showToast)) {
                    return state;
                }

                state.activeReforge = { itemUniqueId: itemUniqueId, progress: 0, requiredProgress: GAME_CONFIG.REFORGE_REQUIRED_PROGRESS };
                showToast(`Начата перековка предмета: ${definitions.items[item.itemKey].name}`, "info");
                return state;
            });
        }
    }, [updateState, showToast, gameStateRef]);

    const handleStartInlay = useCallback((itemUniqueId, gemType) => {
        const state = gameStateRef.current;
        const baseRisk = GAME_CONFIG.INLAY_BASE_RISK;
        const riskModifier = state.riskModifier || 1.0;
        const finalRiskPercent = (baseRisk * riskModifier * 100).toFixed(0);
        let confirmationMessage = "Инкрустация — рискованный процесс. В случае неудачи самоцвет будет утерян. Продолжить?";
        if (state.purchasedSkills.riskAssessment) {
            confirmationMessage = `Инкрустация рискованна! Шанс утери самоцвета: ${finalRiskPercent}%. Продолжить?`;
        }
        if (window.confirm(confirmationMessage)) {
            updateState(state => {
                if (state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving) { showToast("Вы уже заняты другим проектом!", 'error'); return state; }
                const item = state.inventory.find(i => i.uniqueId === itemUniqueId);
                if (!item) { showToast("Предмет для инкрустации не найден!", 'error'); return state; }

                const inlayCost = definitions.items[item.itemKey].inlayCost || { gem: 1 };
                const actualInlayCost = { [gemType]: 1 };
                if (!canAffordAndPay(state, actualInlayCost, showToast)) {
                    return state;
                }

                state.activeInlay = { itemUniqueId: itemUniqueId, gemType: gemType, progress: 0, requiredProgress: GAME_CONFIG.INLAY_REQUIRED_PROGRESS };
                showToast(`Начата инкрустация предмета: ${definitions.items[item.itemKey].name}`, "info");
                return state;
            });
        }
    }, [updateState, showToast, gameStateRef]);

    const handleStartGraving = useCallback((itemUniqueId) => {
        const state = gameStateRef.current;
        const baseRisk = GAME_CONFIG.GRAVING_BASE_RISK;
        const riskModifier = state.riskModifier || 1.0;
        const finalRiskPercent = (baseRisk * riskModifier * 100).toFixed(0);
        let confirmationMessage = "Гравировка требует точности и может не получиться с первого раза. Продолжить?";
         if (state.purchasedSkills.riskAssessment) {
            confirmationMessage = `Гравировка рискованна! Шанс неудачи: ${finalRiskPercent}%. Продолжить?`;
        }
        if (window.confirm(confirmationMessage)) {
            updateState(state => {
                if (state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving) { showToast("Вы уже заняты другим проектом!", 'error'); return state; }
                const item = state.inventory.find(i => i.uniqueId === itemUniqueId);
                if (!item) { showToast("Предмет для гравировки не найден!", 'error'); return state; }

                const gravingCost = definitions.items[item.itemKey].gravingCost || { matter: 200 };
                if (!canAffordAndPay(state, gravingCost, showToast)) {
                    return state;
                }

                state.activeGraving = { itemUniqueId: itemUniqueId, progress: 0, requiredProgress: GAME_CONFIG.GRAVING_REQUIRED_PROGRESS };
                showToast(`Начата гравировка предмета: ${definitions.items[item.itemKey].name}`, "info");
                return state;
            });
        }
    }, [updateState, showToast, gameStateRef]);

    const handleMineOre = useCallback((oreType, clickX = null, clickY = null) => {
        updateState(state => {
            const now = Date.now();
            const minTimeBetweenClicks = GAME_CONFIG.DEFAULT_MIN_TIME_BETWEEN_CLICKS;
            if (now - state.lastClickTime < minTimeBetweenClicks) { return state; }
            state.lastClickTime = now;

            let playerEpoch = 1;
            if (state.purchasedSkills.adamantiteMining) playerEpoch = 7;
            else if (state.purchasedSkills.mithrilProspecting) playerEpoch = 5;
            else if (state.purchasedSkills.artOfAlloys) playerEpoch = 3;
            else if (state.purchasedSkills.findCopper) playerEpoch = 2;

            const oreEpochKey = oreType.replace('Ore', 'Ingots');
            const oreEpoch = GAME_CONFIG.EPOCH_DEFINITIONS[oreEpochKey] || 1;
            const epochDifference = playerEpoch - oreEpoch;
            
            let multiplier = 1.0;
            if (epochDifference === -1) {
                multiplier = 0.5;
            } else if (epochDifference < -1) {
                multiplier = 0.25;
            }

            let amountGained = state.orePerClick * multiplier;
            
            const region = definitions.regions[state.currentRegion];
            const miningModifier = region?.modifiers?.miningSpeed?.[oreType] || 1.0;
            amountGained *= miningModifier;

            if (oreType === 'copperOre' && state.bonusCopperChance > 0) {
                if (Math.random() < state.bonusCopperChance) {
                    amountGained++;
                    showToast("Удача! Найдена дополнительная медная руда!", 'crit');
                }
            }
            state[oreType] = (state[oreType] || 0) + amountGained;
            showToast(`Добыто: +${formatNumber(amountGained)} ед. ${definitions.resources[oreType].name}!`, 'success');

            return state;
        });
    }, [updateState, showToast]);

    const handleSmelt = useCallback((recipeId) => {
        updateState(state => {
            const recipe = definitions.recipes[recipeId];
            if (!recipe) return state;

            if (recipe.requiredSkill && !state.purchasedSkills[recipe.requiredSkill]) {
                showToast(`Требуется навык: '${definitions.skills[recipe.requiredSkill]?.name}'!`, 'error');
                return state;
            }

            if (state.purchasedSkills.smeltingAutomation) {
                if (state.smeltingQueue.length >= state.smeltingQueueCapacity) {
                    showToast("Очередь плавки заполнена!", 'error');
                    return state;
                }
                state.smeltingQueue.push(recipeId);
                showToast(`"${recipe.name}" добавлен в очередь плавки.`, 'info');
                audioController.play('click', 'D4', '16n');
            } else {
                if (state.smeltingProcess) {
                    showToast("Плавильня уже занята!", 'error');
                    return state;
                }
                if (!canAffordAndPay(state, recipe.input, showToast)) {
                    return state;
                }
                state.smeltingProcess = { recipeId, progress: 0 };
                showToast(`Плавка: ${recipe.name} началась!`, 'info');
            }
            return state;
        });
    }, [updateState, showToast]);

    const handleBuyUpgrade = useCallback((upgradeId, type = 'upgrades', amount = 1) => {
        updateState(state => {
            const upgradeDefs = definitions[type] || definitions.upgrades;
            const upgrade = upgradeDefs[upgradeId];
            if (!upgrade) return state;
            let level = state.upgradeLevels[upgradeId] || 0;
            const isMultiLevel = 'isMultiLevel' in upgrade && upgrade.isMultiLevel;
            if (!isMultiLevel && level > 0) { showToast(`Улучшение "${upgrade.name}" уже куплено!`, 'error'); return state; }
            if (isMultiLevel && level >= upgrade.maxLevel) { showToast(`Улучшение "${upgrade.name}" уже на максимальном уровне!`, 'error'); return state; }
            if (type === 'shopUpgrades' && upgrade.requiredShopReputation && state.shopXP < upgrade.requiredShopReputation) {
                showToast(`Недостаточно репутации магазина (${upgrade.requiredShopReputation} XP требуется)!`, 'error');
                return state;
            }
            if (upgrade.requiredSkill && !state.purchasedSkills[upgrade.requiredSkill]) {
                showToast(`Требуется навык: '${definitions.skills[upgrade.requiredSkill]?.name}'!`, 'error');
                return state;
            }

            const totalCosts = {};
            if (isMultiLevel) {
                const baseCosts = upgrade.baseCost;
                for (let i = 0; i < amount; i++) {
                    if (level + i < upgrade.maxLevel) {
                        for (const resourceType in baseCosts) {
                            totalCosts[resourceType] = (totalCosts[resourceType] || 0) + Math.floor(baseCosts[resourceType] * Math.pow(upgrade.costIncrease, level + i));
                        }
                    } else {
                        amount = i;
                        break;
                    }
                }
            } else {
                for (const resourceType in upgrade.cost) {
                    totalCosts[resourceType] = upgrade.cost[resourceType];
                }
            }

            if (amount === 0 || !canAffordAndPay(state, totalCosts, showToast)) {
                return state;
            }

            state.upgradeLevels[upgradeId] = (state.upgradeLevels[upgradeId] || 0) + amount;
            
            if (upgrade.id === 'personnelSlotExpansion') {
                state.personnelSlots.total += amount;
            } else if (typeof upgrade.apply === 'function' && !isMultiLevel) {
                upgrade.apply(state);
            }

            recalculateAllModifiers(state);

            showToast(`Улучшение "${upgrade.name}" куплено! (x${amount})`, 'success'); return state;
        });
    }, [updateState, showToast]);

    const handleCraftArtifact = useCallback((artifactId) => {
        updateState(state => {
            if (state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving) { showToast("Вы уже заняты другим проектом!", 'error'); return state; }
            const artifact = state.artifacts[artifactId];
            const artifactDef = definitions.greatArtifacts[artifactId];

            if (artifact.status !== 'available') { showToast("Артефакт не готов к созданию.", 'error'); return state; }

            const epicCost = definitions.greatArtifacts[artifactId].epicOrder[0].cost;
            if (epicCost && !canAffordAndPay(state, epicCost, showToast)) {
                return state;
            }

            state.currentEpicOrder = { artifactId, currentStage: 1, progress: 0 };
            showToast(`Вы приступаете к созданию шедевра: ${definitions.greatArtifacts[artifactId].name}!`, 'levelup');
            return state;
        });
    }, [updateState, showToast]);

    const handleCancelSmelt = useCallback(() => {
        updateState(state => {
            if (!state.smeltingProcess) {
                showToast("Нет активной плавки для отмены.", "error");
                return state;
            }

            const recipe = definitions.recipes[state.smeltingProcess.recipeId];
            if (!recipe) return state;

            Object.entries(recipe.input).forEach(([resource, amount]) => {
                const refundAmount = Math.floor(amount * 0.75);
                if (refundAmount > 0) {
                    if(state.hasOwnProperty(resource)) {
                        state[resource] = (state[resource] || 0) + refundAmount;
                    } else if (state.specialItems.hasOwnProperty(resource)) {
                        state.specialItems[resource] = (state.specialItems[resource] || 0) + refundAmount;
                    }
                }
            });
            
            showToast(`Плавка "${recipe.name}" отменена. Часть ресурсов возвращена.`, "info");
            state.smeltingProcess = null;
            return state;
        });
    }, [updateState, showToast]);
    
    const handleUpgradeItem = useCallback((itemUniqueId) => {
        updateState(state => {
            const item = state.inventory.find(i => i.uniqueId === itemUniqueId);
            if (!item) { showToast("Предмет не найден!", "error"); return state; }
            
            const itemDef = definitions.items[item.itemKey];
            if (!itemDef || item.level >= itemDef.maxLevel) {
                showToast("Предмет нельзя улучшить!", "error"); return state;
            }

            const cost = itemDef.upgradeCosts[item.level - 1];
            if (!canAffordAndPay(state, cost, showToast)) {
                return state;
            }

            item.level += 1;
            showToast(`Предмет "${itemDef.name}" улучшен до уровня ${item.level}!`, 'success');
            audioController.play('levelup', 'D5', '8n');
            recalculateAllModifiers(state); 
            return state;
        });
    }, [updateState, showToast]);
    
    const handleDisassembleItem = useCallback((itemUniqueId) => {
        updateState(state => {
            const itemIndex = state.inventory.findIndex(i => i.uniqueId === itemUniqueId);
            if (itemIndex === -1) {
                showToast("Предмет не найден!", "error");
                return state;
            }

            const item = state.inventory[itemIndex];
            const itemDef = definitions.items[item.itemKey];

            if (!itemDef.components || itemDef.components.length === 0) {
                 showToast("Этот предмет нельзя разобрать.", "error");
                return state;
            }

            const refundedResources = {};
            itemDef.components.forEach(component => {
                if (component.cost) {
                    for (const resource in component.cost) {
                        refundedResources[resource] = (refundedResources[resource] || 0) + component.cost[resource];
                    }
                }
            });

            let toastMessages = [];
            for (const resource in refundedResources) {
                const amountToRefund = Math.floor(refundedResources[resource] * 0.30);
                if (amountToRefund > 0) {
                    if (state.hasOwnProperty(resource)) {
                        state[resource] += amountToRefund;
                    } else if (state.specialItems.hasOwnProperty(resource)) {
                        state.specialItems[resource] += amountToRefund;
                    }
                    const resourceName = definitions.resources[resource]?.name || definitions.specialItems[resource]?.name || resource;
                    toastMessages.push(`+${formatNumber(amountToRefund)} ${resourceName}`);
                }
            }

            state.inventory.splice(itemIndex, 1);
            
            showToast(`Предмет "${itemDef.name}" разобран. Возвращено: ${toastMessages.join(', ')}`, 'success');
            audioController.play('crit', 'A3', '8n');
            
            return state;
        });
    }, [updateState, showToast]);


    return useMemo(() => ({
        handleAcceptOrder,
        handleStartFreeCraft,
        handleStartReforge,
        handleStartInlay,
        handleStartGraving,
        handleMineOre,
        handleSmelt,
        handleBuyUpgrade,
        handleCraftArtifact,
        handleCancelSmelt,
        handleUpgradeItem,
        handleDisassembleItem, 
    }), [
        handleAcceptOrder,
        handleStartFreeCraft,
        handleStartReforge,
        handleStartInlay,
        handleStartGraving,
        handleMineOre,
        handleSmelt,
        handleBuyUpgrade,
        handleCraftArtifact,
        handleCancelSmelt,
        handleUpgradeItem,
        handleDisassembleItem, 
    ]);
};
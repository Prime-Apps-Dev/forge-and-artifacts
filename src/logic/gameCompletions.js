// src/logic/gameCompletions.js
import { definitions } from '../data/definitions';
import { audioController } from '../utils/audioController';
import { formatNumber } from '../utils/formatters';
import { getReputationLevel } from '../utils/helpers';
import { checkForNewQuests } from '../utils/gameEventChecks';
import { gameConfig as GAME_CONFIG } from '../constants/gameConfig.js';
import { visualEffects } from '../utils/visualEffects';

// Вспомогательная функция для применения наград к состоянию игры
export function applyRewardToState(state, reward, showToast) {
    if (!reward) return;

    // Применение базовых ресурсов
    if (reward.sparks) {
        state.sparks += reward.sparks;
        state.totalSparksEarned += reward.sparks;
    }
    if (reward.matter) {
        state.matter += reward.matter;
    }
    if (reward.ironOre) { state.ironOre += reward.ironOre; }
    if (reward.copperOre) { state.copperOre += reward.copperOre; }
    if (reward.mithrilOre) { state.mithrilOre += reward.mithrilOre; }
    if (reward.adamantiteOre) { state.adamantiteOre += reward.adamantiteOre; }

    // Специальные награды (например, добавление полок, увеличение инвентаря)
    if (reward.shopShelf) {
        for(let i=0; i < reward.shopShelf; i++) {
            state.shopShelves.push({ id: `shelf_${Date.now()}_${Math.random()}`, itemId: null, customer: null, saleProgress: 0, saleTimer: 0 });
        }
        showToast(`Получено: +${reward.shopShelf} торговых полок!`, 'success');
    }
    if (reward.inventoryCapacity) {
        state.inventoryCapacity += reward.inventoryCapacity;
    }
    // Добавьте здесь другие одноразовые эффекты, которые не влияют на eternalAchievementBonuses
    if (reward.prestigePoints) {
        state.prestigePoints = (state.prestigePoints || 0) + reward.prestigePoints;
    }
}


export function updateMastery(state, xpEarned, showToast) {
    const oldLevel = state.masteryLevel;
    
    const maxPlayerRankLevel = definitions.playerRanks[definitions.playerRanks.length - 1].level;

    // Если игрок уже на максимальном уровне, не начисляем XP и не повышаем уровень
    if (state.masteryLevel >= maxPlayerRankLevel) {
        state.masteryXP = 0; // На максимальном уровне XP обнуляется
        state.masteryXPToNextLevel = 0; // На максимальном уровне XP больше не требуется
        return;
    }

    state.masteryXP += xpEarned;

    while (state.masteryXP >= state.masteryXPToNextLevel && state.masteryLevel < maxPlayerRankLevel) {
        state.masteryXP -= state.masteryXPToNextLevel;
        state.masteryLevel += 1;
        
        // Если это последний уровень, устанавливаем XPToNextLevel в 0
        if (state.masteryLevel >= maxPlayerRankLevel) {
            state.masteryXPToNextLevel = 0;
            state.masteryXP = 0; // Обнуляем XP на максимальном уровне
        } else {
            // Пересчет XP до следующего уровня
            state.masteryXPToNextLevel = Math.floor(state.masteryXPToNextLevel * GAME_CONFIG.MASTERY_XP_LEVEL_MULTIPLIER);
            // Защита от слишком малого xpToNextLevel (минимум 1, чтобы избежать деления на ноль)
            if (state.masteryXPToNextLevel < 1) state.masteryXPToNextLevel = 1;
        }

        showToast(`Уровень Мастерства повышен! Уровень ${state.masteryLevel}!`, 'levelup');
        audioController.play('levelup', 'E5', '4n');
        // Вызов эффекта частиц при повышении уровня игрока
        visualEffects.showParticleEffect(window.innerWidth / 2, window.innerHeight / 2, 'levelup');
    }
}

function handleQuestCompletion(state, questDef, showToast) {
    state.journal.completedQuests.push(questDef.id);
    state.journal.activeQuests = state.journal.activeQuests.filter(q => q.id !== questDef.id);
    delete state.journal.questProgress[questDef.id];
    showToast(`Задание "${questDef.title}" выполнено!`, 'levelup');
    audioController.play('levelup', 'G5', '2n');

    let xpEarnedForQuest = 0;

    if (questDef.reward) {
        // Здесь используем applyRewardToState для ресурсов
        applyRewardToState(state, questDef.reward, showToast);
        
        // Модификаторы квестов теперь должны быть частью applyRewardToState
        // или напрямую влиять на eternalAchievementBonuses, если они постоянны
        if (questDef.reward.riskReduction) {
            state.riskModifier = (state.riskModifier || 1.0) * (1 - questDef.reward.riskReduction);
        }
        if (questDef.reward.passiveGeneration) {
            if (questDef.reward.passiveGeneration.resourceType === 'allOre') {
                state.passiveGeneration.ironOre += questDef.reward.passiveGeneration.amount;
                state.passiveGeneration.copperOre += questDef.reward.passiveGeneration.amount;
                state.passiveGeneration.mithrilOre = (state.passiveGeneration.mithrilOre || 0) + questDef.reward.passiveGeneration.amount;
                state.passiveGeneration.adamantiteOre = (state.passiveGeneration.adamantiteOre || 0) + questDef.reward.passiveGeneration.amount;
            } else {
                state.passiveGeneration[questDef.reward.passiveGeneration.resourceType] = (state.passiveGeneration[questDef.reward.passiveGeneration.resourceType] || 0) + questDef.reward.passiveGeneration.amount;
            }
        }
        if (questDef.reward.matterModifier) {
            state.matterModifier += questDef.reward.matterModifier;
        }
        if (questDef.reward.smeltingSpeedModifier) {
            state.smeltingSpeedModifier += questDef.reward.smeltingSpeedModifier;
        }
        if (questDef.reward.progressPerClick) {
            state.progressPerClick += questDef.reward.progressPerClick;
        }

        // Если награда типа unlock_recipe, она просто открывает возможность, не меняя state напрямую здесь
        if (questDef.reward.type === 'unlock_recipe') {
             // showToast(`Разблокирован новый рецепт!`, 'success'); // Это уже было в usePlayerActions
        }

        // XP за квесты
        if (questDef.reward.sparks) { // Если XP начисляется от искр
            xpEarnedForQuest += questDef.reward.sparks / GAME_CONFIG.QUEST_XP_SPARK_DIVIDER;
        }
    }
    xpEarnedForQuest = Math.floor(xpEarnedForQuest * (state.masteryXpModifier || 1.0));
    updateMastery(state, xpEarnedForQuest, showToast);
}

export function handleCompleteMission(state, activeMissionId, showToast) {
    const missionIndex = state.activeMissions.findIndex(m => m.id === activeMissionId);
    if (missionIndex === -1) return;

    const [completedMission] = state.activeMissions.splice(missionIndex, 1);
    const missionDef = definitions.missions[completedMission.missionId];

    let rewardToast = [`Экспедиция "${missionDef.name}" завершена!`];

    // Здесь используем applyRewardToState для базовых наград миссии
    applyRewardToState(state, missionDef.baseReward, showToast);

    if (missionDef.baseReward.reputation) {
        for (const factionId in missionDef.baseReward.reputation) {
            state.reputation[factionId] = (state.reputation[factionId] || 0) + missionDef.baseReward.reputation[factionId];
            rewardToast.push(`+${missionDef.baseReward.reputation[factionId]} репутации с ${definitions.factions[factionId].name}`);
        }
    }

    const bonus = completedMission.qualityBonus;
    if (bonus > 0) {
        if (missionDef.bonusReward.sparksPerQualityPoint) {
            const bonusSparks = Math.floor(bonus * missionDef.bonusReward.sparksPerQualityPoint);
            state.sparks += bonusSparks;
            state.totalSparksEarned += bonusSparks;
            rewardToast.push(`Бонус: +${formatNumber(bonusSparks)} искр`);
        }
        if (missionDef.bonusReward.matterPerQualityPoint) {
            const bonusMatter = Math.floor(bonus * missionDef.bonusReward.matterPerQualityPoint);
            state.matter += bonusMatter;
            rewardToast.push(`Бонус: +${formatNumber(bonusMatter)} материи`);
        }
    }

    let xpEarned = Math.max(1, Math.floor(missionDef.baseReward.sparks / GAME_CONFIG.MISSION_XP_SPARK_DIVIDER));
    xpEarned = Math.floor(xpEarned * (state.masteryXpModifier || 1.0));
    updateMastery(state, xpEarned, showToast);

    showToast(rewardToast.join(' '), 'success');
    audioController.play('levelup', 'A4', '4n');
    checkForNewQuests(state, showToast);
}

export function handleSaleCompletion(state, shelfIndex, showToast) {
    const shelf = state.shopShelves[shelfIndex];
    if (!shelf || !shelf.itemId) return state;

    const itemSold = state.inventory.find(item => item.uniqueId === shelf.itemId);
    if (!itemSold) {
        showToast("Ошибка: проданный предмет не найден в инвентаре!", "error");
        state.shopShelves[shelfIndex] = { itemId: null, customer: null, saleProgress: 0, saleTimer: 0 };
        return state;
    }

    const itemDef = definitions.items[itemSold.itemKey];
    const baseValue = itemDef.components.reduce((sum, c) => sum + c.progress, 0);
    const salePrice = Math.floor((baseValue * GAME_CONFIG.SALE_BASE_PRICE_MULTIPLIER) * itemSold.quality);

    state.sparks += salePrice;
    state.totalSparksEarned += salePrice;

    const client = shelf.customer;
    const tipChance = client?.demands?.tipChance || 0;
    if (Math.random() < tipChance) {
        const tipAmount = Math.floor(salePrice * 0.1);
        state.sparks += tipAmount;
        state.totalSparksEarned += tipAmount;
        showToast(`Клиент в восторге! Вы получили ${formatNumber(tipAmount)} искр в качестве чаевых!`, 'crit');
    }

    // shopXP обновляется и проверяется уровень магазина
    const oldShopLevel = state.shopLevel;
    state.shopXP = (state.shopXP || 0) + GAME_CONFIG.SHOP_REPUTATION_XP_PER_SALE;
    
    const nextShopLevelDef = definitions.shopLevels.find(lvl => lvl.level === state.shopLevel + 1);
    if (nextShopLevelDef && state.shopXP >= nextShopLevelDef.requiredXP) {
        state.shopLevel += 1;
        state.shopXPToNextLevel = nextShopLevelDef.requiredXP;

        showToast(`Уровень Магазина повышен! Уровень ${state.shopLevel}!`, 'levelup');
        audioController.play('levelup', 'E5', '4n');
        // Вызов эффекта частиц при повышении уровня магазина
        visualEffects.showParticleEffect(window.innerWidth / 2, window.innerHeight / 2, 'shop_levelup');
    }


    let xpEarned = Math.max(1, Math.floor(salePrice / GAME_CONFIG.SALE_XP_SALE_PRICE_DIVIDER));
    xpEarned = Math.floor(xpEarned * (state.masteryXpModifier || 1.0));
    updateMastery(state, xpEarned, showToast);

    state.inventory = state.inventory.filter(item => item.uniqueId !== shelf.itemId);
    state.shopShelves[shelfIndex] = { itemId: null, customer: null, saleProgress: 0, saleTimer: 0 };

    showToast(`Продан "${itemDef.name}" за ${formatNumber(salePrice)} искр!`, 'success');
    audioController.play('cash', 'C5', '16n');

    checkForNewQuests(state, showToast);
    return state;
}

export function handleFreeCraftCompletion(state, craftProject, showToast) {
    const itemDef = definitions.items[craftProject.itemKey];
    const quality = 1.0 + (Math.random() * 0.5);
    const newItem = {
        uniqueId: `item_${Date.now()}_${Math.random()}`,
        itemKey: craftProject.itemKey,
        quality: quality,
        tier: 'bronze',
        creationTimestamp: Date.now(),
        location: 'inventory',
        inlaySlots: [],
        gravingLevel: state.initialGravingLevel || 0,
    };
    if (state.inventory.length < state.inventoryCapacity) {
        state.inventory.push(newItem);
        showToast(`Создан предмет: "${itemDef.name}" (добавлен в инвентарь)!`, 'success');
        state.totalItemsCrafted = (state.totalItemsCrafted || 0) + 1;
    } else {
        showToast(`Инвентарь полон! Предмет "${itemDef.name}" утерян.`, 'error');
    }
    state.activeFreeCraft = null;

    let xpEarned = Math.max(1, Math.floor(itemDef.components.reduce((sum, c) => sum + c.progress, 0) / GAME_CONFIG.CRAFT_XP_PROGRESS_DIVIDER));
    xpEarned = Math.floor(xpEarned * (state.masteryXpModifier || 1.0));
    updateMastery(state, xpEarned, showToast);

    Object.values(definitions.quests).forEach(quest => {
        const questDef = definitions.quests[quest.id];
        if (state.journal.activeQuests.some(activeQuest => activeQuest.id === quest.id) && questDef.target.type === 'craft' && questDef.target.itemId === craftProject.itemKey) {
            state.journal.questProgress[quest.id] = (state.journal.questProgress[quest.id] || 0) + 1;
            if (state.journal.questProgress[quest.id] >= questDef.target.count) {
                handleQuestCompletion(state, questDef, showToast);
            }
        }
    });

    checkForNewQuests(state, showToast);
    return state;
}

export function handleCompleteReforge(state, reforgeProject, showToast) {
    const item = state.inventory.find(i => i.uniqueId === reforgeProject.itemUniqueId);
    if (item) {
        const baseRisk = GAME_CONFIG.REFORGE_BASE_RISK;
        const riskModifier = state.riskModifier || 1.0;
        const finalRisk = baseRisk * riskModifier;

        if (Math.random() < finalRisk) {
            const qualityDecrease = GAME_CONFIG.REFORGE_QUALITY_DECREASE_MIN + Math.random() * GAME_CONFIG.REFORGE_QUALITY_DECREASE_RANDOM;
            item.quality = Math.max(1.0, item.quality - qualityDecrease);
            item.location = 'inventory';
            showToast(`Перековка не удалась! Качество "${definitions.items[item.itemKey].name}" слегка ухудшилось до ${item.quality.toFixed(2)}`, "error");
            audioController.play('crit', 'C3', '8n');
        } else {
            const qualityIncrease = GAME_CONFIG.REFORGE_QUALITY_INCREASE_MIN + Math.random() * GAME_CONFIG.REFORGE_QUALITY_INCREASE_RANDOM;
            item.quality = Math.min(10.0, item.quality + qualityIncrease);
            item.location = 'inventory';
            showToast(`Перековка "${definitions.items[item.itemKey].name}" завершена! Качество: ${item.quality.toFixed(2)}`, "success");

            let xpEarned = Math.max(1, Math.floor(item.quality * GAME_CONFIG.REFORGE_XP_QUALITY_MULTIPLIER));
            xpEarned = Math.floor(xpEarned * (state.masteryXpModifier || 1.0));
            updateMastery(state, xpEarned, showToast);
        }
    } else {
        showToast("Ошибка: предмет для перековки не найден.", "error");
    }
    state.activeReforge = null;
    checkForNewQuests(state, showToast);
    return state;
}

export function handleCompleteInlay(state, inlayProject, showToast) {
    const item = state.inventory.find(i => i.uniqueId === inlayProject.itemUniqueId);
    if (item) {
        const baseRisk = GAME_CONFIG.INLAY_BASE_RISK;
        const riskModifier = state.riskModifier || 1.0;
        const finalRisk = baseRisk * riskModifier;

        if (Math.random() < finalRisk) {
            item.location = 'inventory';
            showToast(`Инкрустация не удалась! Самоцвет утерян.`, "error");
            audioController.play('crit', 'C3', '8n');
        } else {
            item.inlaySlots = item.inlaySlots || [];
            item.inlaySlots.push({ type: inlayProject.gemType, qualityBonus: GAME_CONFIG.INLAY_QUALITY_BONUS });
            const qualityIncrease = GAME_CONFIG.INLAY_QUALITY_INCREASE_MIN + Math.random() * GAME_CONFIG.INLAY_QUALITY_INCREASE_RANDOM;
            item.quality = Math.min(10.0, item.quality + qualityIncrease);
            item.location = 'inventory';
            showToast(`Инкрустация "${definitions.items[item.itemKey].name}" завершена! Качество: ${item.quality.toFixed(2)}`, "success");
            state.totalInlayedItems = (state.totalInlayedItems || 0) + 1;

            let xpEarned = Math.max(1, Math.floor(item.quality * GAME_CONFIG.INLAY_XP_QUALITY_MULTIPLIER));
            xpEarned = Math.floor(xpEarned * (state.masteryXpModifier || 1.0));
            updateMastery(state, xpEarned, showToast);

            Object.values(definitions.quests).forEach(quest => {
                const questDef = definitions.quests[quest.id];
                if (state.journal.activeQuests.some(activeQuest => activeQuest.id === quest.id) && questDef.target.type === 'inlay') {
                    state.journal.questProgress[quest.id] = (state.journal.questProgress[quest.id] || 0) + 1;
                    if (state.journal.questProgress[quest.id] >= questDef.target.count) {
                        handleQuestCompletion(state, questDef, showToast);
                    }
                }
            });
        }
    } else {
        showToast("Ошибка: предмет для инкрустации не найден.", "error");
    }
    state.activeInlay = null;
    checkForNewQuests(state, showToast);
    return state;
}

export function handleCompleteGraving(state, gravingProject, showToast) {
    const item = state.inventory.find(i => i.uniqueId === gravingProject.itemUniqueId);
    if (item) {
        const baseRisk = GAME_CONFIG.GRAVING_BASE_RISK;
        const riskModifier = state.riskModifier || 1.0;
        const finalRisk = baseRisk * riskModifier;

        if (Math.random() < finalRisk) {
            item.location = 'inventory';
            showToast(`Гравировка не удалась!`, "error");
            audioController.play('crit', 'C3', '8n');
        } else {
            item.gravingLevel = (item.gravingLevel || 0) + 1;
            item.location = 'inventory';
            showToast(`Гравировка "${definitions.items[item.itemKey].name}" завершена! Уровень гравировки: ${item.gravingLevel}`, "success");

            const xpEarned = Math.max(1, Math.floor((item.gravingLevel || 0) * GAME_CONFIG.GRAVING_XP_LEVEL_MULTIPLIER));
            xpEarned = Math.floor(xpEarned * (state.masteryXpModifier || 1.0));
            updateMastery(state, xpEarned, showToast);

            Object.values(definitions.quests).forEach(quest => {
                const questDef = definitions.quests[quest.id];
                if (state.journal.activeQuests.some(activeQuest => activeQuest.id === quest.id) && questDef.target.type === 'grave') {
                    state.journal.questProgress[quest.id] = (state.journal.questProgress[quest.id] || 0) + 1;
                    if (state.journal.questProgress[quest.id] >= questDef.target.count) {
                        handleQuestCompletion(state, questDef, showToast);
                    }
                }
            });
        }
    } else {
        showToast("Ошибка: предмет для гравировки не найден.", "error");
    }
    state.activeGraving = null;
    checkForNewQuests(state, showToast);
    return state;
}

export function handleOrderCompletion(state, order, showToast, setCompletedOrderInfo) {
    if (!order || !definitions.items[order.itemKey]) return state;
    audioController.play('complete', 'C5', '4n');
    const itemDef = definitions.items[order.itemKey];
    const timeTaken = (Date.now() - order.startTime) / 1000;
    let tier = 'bronze';
    if (timeTaken <= order.timeLimits.gold) tier = 'gold';
    else if (timeTaken <= order.timeLimits.silver) tier = 'silver';
    const qualityMultiplier = order.qualityHits > 0 ? (order.qualityPoints / order.qualityHits) : 1;
    let rewardMultiplier = 0.5;
    if (tier === 'gold') rewardMultiplier *= 2.0;
    else if (tier === 'silver') rewardMultiplier *= 1.5;
    rewardMultiplier *= qualityMultiplier;

    let finalSparks = Math.floor(order.rewards.sparks * rewardMultiplier * state.sparksModifier);
    let finalMatter = Math.floor(order.rewards.matter * rewardMultiplier * state.matterModifier);

    if (state.artifacts.quill?.status === 'completed') {
        finalMatter += Math.floor(finalSparks / 100);
    }

    state.sparks += finalSparks;
    state.totalSparksEarned += finalSparks;
    state.matter += finalMatter;

    let xpEarned = Math.max(1, Math.floor((definitions.items[order.itemKey].components.reduce((sum, c) => sum + c.progress, 0) / GAME_CONFIG.ORDER_XP_PROGRESS_DIVIDER) * rewardMultiplier));
    xpEarned = Math.floor(xpEarned * (state.masteryXpModifier || 1.0));
    updateMastery(state, xpEarned, showToast);
    state.totalItemsCrafted = (state.totalItemsCrafted || 0) + 1;

    // Флаг для отслеживания рискованных заказов подряд
    if (order.isRisky) {
        state.consecutiveRiskyOrders = (state.consecutiveRiskyOrders || 0) + 1;
    } else {
        state.consecutiveRiskyOrders = 0; // Сбрасываем, если заказ не рискованный
    }

    Object.values(definitions.quests).forEach(quest => {
        const questDef = definitions.quests[quest.id];
        if (state.journal.activeQuests.some(activeQuest => activeQuest.id === quest.id)) {
            // Обновление прогресса для новых типов целей
            if (questDef.target.type === 'craft' && questDef.target.itemId === order.itemKey) {
                state.journal.questProgress[quest.id] = (state.journal.questProgress[quest.id] || 0) + 1;
            }
            else if (questDef.target.type === 'risky_order' && order.isRisky) {
                state.journal.questProgress[quest.id] = (state.journal.questProgress[quest.id] || 0) + 1;
            }
            // НОВЫЕ ТИПЫ ЦЕЛЕЙ
            else if (questDef.target.type === 'complex_order') {
                const itemComplexity = itemDef.components.length;
                if (itemComplexity >= 3) { // Определяем "сложный заказ" по количеству компонентов
                    state.journal.questProgress[quest.id] = (state.journal.questProgress[quest.id] || 0) + 1;
                }
            }
            else if (questDef.target.type === 'craft_quality' && itemDef.itemType === questDef.target.itemType && itemSold.quality >= questDef.target.minQuality) {
                state.journal.questProgress[quest.id] = (state.journal.questProgress[quest.id] || 0) + 1;
            }
            else if (questDef.target.type === 'risky_order_consecutive' && order.isRisky) {
                // Прогресс уже отслеживается через state.consecutiveRiskyOrders
                if (state.consecutiveRiskyOrders >= questDef.target.count) {
                    // Это будет засчитано как завершение квеста, но прогресс нужно обнулить
                    state.journal.questProgress[quest.id] = questDef.target.count; // Засчитываем сразу
                }
            }
            else if (questDef.target.type === 'craft_item_tag' && itemDef.tags?.includes(questDef.target.itemTag)) { // Предполагаем наличие tags в items.js
                state.journal.questProgress[quest.id] = (state.journal.questProgress[quest.id] || 0) + 1;
            }
            else if (questDef.target.type === 'inlay_item_tag' && itemSold.inlaySlots?.some(slot => definitions.items[itemSold.itemKey].tags?.includes(questDef.target.itemTag))) { // Для инкрустации с тегом
                state.journal.questProgress[quest.id] = (state.journal.questProgress[quest.id] || 0) + 1;
            }

            if (questDef.factionId === 'court') {
                state.totalCourtOrdersCompleted = (state.totalCourtOrdersCompleted || 0) + 1;
            }
            if (order.isRisky) {
                state.totalRiskyOrdersCompleted = (state.totalRiskyOrdersCompleted || 0) + 1;
            }

            if (state.journal.questProgress[quest.id] >= questDef.target.count) {
                handleQuestCompletion(state, questDef, showToast);
                // Если квест risky_order_consecutive, обнуляем счетчик после завершения
                if (questDef.target.type === 'risky_order_consecutive') {
                    state.consecutiveRiskyOrders = 0;
                }
            }
        }
    });
    setCompletedOrderInfo({ item: itemDef, sparks: finalSparks, matter: finalMatter, tier, reputationChange: {} });
    state.activeOrder = null;
    checkForNewQuests(state, showToast);
    return state;
}
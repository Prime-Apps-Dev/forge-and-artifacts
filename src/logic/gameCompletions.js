// src/logic/gameCompletions.js
import { definitions } from '../data/definitions/index.js';
import { audioController } from '../utils/audioController';
import { formatNumber } from '../utils/formatters.jsx';
import { getReputationLevel } from '../utils/helpers';
import { checkForNewQuests } from '../utils/gameEventChecks';
import { gameConfig as GAME_CONFIG } from '../constants/gameConfig.js';
import { visualEffects } from '../utils/visualEffects';

export function applyRewardToState(state, reward, showToast) {
    if (!reward) return;
    if (reward.sparks) {
        state.sparks += reward.sparks;
        state.totalSparksEarned = (state.totalSparksEarned || 0) + reward.sparks;
    }
    if (reward.matter) state.matter += reward.matter;
    if (reward.ironOre) state.ironOre += reward.ironOre;
    if (reward.copperOre) state.copperOre += reward.copperOre;
    if (reward.mithrilOre) state.mithrilOre += reward.mithrilOre;
    if (reward.adamantiteOre) state.adamantiteOre += reward.adamantiteOre;
    if (reward.shopShelf) {
        for(let i=0; i < reward.shopShelf; i++) {
            state.shopShelves.push({ id: `shelf_${Date.now()}_${Math.random()}`, itemId: null, customer: null, saleProgress: 0, saleTimer: 0 });
        }
        showToast(`Получено: +${reward.shopShelf} торговых полок!`, 'success');
    }
    if (reward.inventoryCapacity) state.inventoryCapacity += reward.inventoryCapacity;
    if (reward.prestigePoints) state.prestigePoints = (state.prestigePoints || 0) + reward.prestigePoints;
}

export function updateMastery(state, xpEarned, showToast) {
    const maxPlayerRankLevel = definitions.playerRanks[definitions.playerRanks.length - 1].level;
    if (state.masteryLevel >= maxPlayerRankLevel) {
        state.masteryXP = 0;
        state.masteryXPToNextLevel = 0;
        return;
    }
    state.masteryXP += xpEarned;
    while (state.masteryXP >= state.masteryXPToNextLevel && state.masteryLevel < maxPlayerRankLevel) {
        state.masteryXP -= state.masteryXPToNextLevel;
        state.masteryLevel += 1;
        if (state.masteryLevel >= maxPlayerRankLevel) {
            state.masteryXPToNextLevel = 0;
            state.masteryXP = 0;
        } else {
            state.masteryXPToNextLevel = Math.floor(state.masteryXPToNextLevel * GAME_CONFIG.MASTERY_XP_LEVEL_MULTIPLIER);
            if (state.masteryXPToNextLevel < 1) state.masteryXPToNextLevel = 1;
        }
        showToast(`Уровень Мастерства повышен! Уровень ${state.masteryLevel}!`, 'levelup');
        audioController.play('levelup', 'E5', '4n');
        visualEffects.showParticleEffect(window.innerWidth / 2, window.innerHeight / 2, 'levelup');
    }
}

function handleQuestCompletion(state, questDef, showToast) {
    if (!state.journal.activeQuests.some(q => q.id === questDef.id)) return;
    
    state.journal.completedQuests.push(questDef.id);
    state.journal.activeQuests = state.journal.activeQuests.filter(q => q.id !== questDef.id);
    delete state.journal.questProgress[questDef.id];
    showToast(`Задание "${questDef.title}" выполнено!`, 'levelup');
    audioController.play('levelup', 'G5', '2n');

    if (questDef.reward) {
        let xpEarnedForQuest = 0;
        if(questDef.reward.type === 'item') {
            state.specialItems[questDef.reward.itemId] = (state.specialItems[questDef.reward.itemId] || 0) + (questDef.reward.amount || 1);
        } else if (questDef.reward.type === 'reputation') {
            state.reputation[questDef.reward.factionId] = (state.reputation[questDef.reward.factionId] || 0) + questDef.reward.amount;
        } else {
             applyRewardToState(state, questDef.reward, showToast);
        }

        if (questDef.reward.sparks) {
            xpEarnedForQuest += questDef.reward.sparks / GAME_CONFIG.QUEST_XP_SPARK_DIVIDER;
        }
        if(xpEarnedForQuest > 0) {
            updateMastery(state, Math.floor(xpEarnedForQuest * (state.masteryXpModifier || 1.0)), showToast);
        }
    }
    checkForNewQuests(state, showToast);
}

export function updateQuestProgress(state, type, options = {}, showToast) {
    state.journal.activeQuests.forEach(activeQuest => {
        const questDef = definitions.quests[activeQuest.id];
        if (!questDef || questDef.target.type !== type) return;

        let progressMade = false;
        
        if (['inlay', 'grave', 'risky_order', 'craft'].includes(type)) {
            if (type === 'craft' && questDef.target.itemId && options.itemId !== questDef.target.itemId) return;
            state.journal.questProgress[questDef.id] = (state.journal.questProgress[questDef.id] || 0) + 1;
            progressMade = true;
        }
        
        if (progressMade && (state.journal.questProgress[questDef.id] >= questDef.target.count)) {
            handleQuestCompletion(state, questDef, showToast);
        }
    });
}

export function handleCompleteMission(state, activeMissionId, showToast) {
    const missionIndex = state.activeMissions.findIndex(m => m.id === activeMissionId);
    if (missionIndex === -1) return;
    const [completedMission] = state.activeMissions.splice(missionIndex, 1);
    const missionDef = definitions.missions[completedMission.missionId];
    let rewardToast = [`Экспедиция "${missionDef.name}" завершена!`];
    applyRewardToState(state, missionDef.baseReward, showToast);
    if (missionDef.baseReward.reputation) {
        for (const factionId in missionDef.baseReward.reputation) {
            state.reputation[factionId] = (state.reputation[factionId] || 0) + missionDef.baseReward.reputation[factionId];
            rewardToast.push(`+${missionDef.baseReward.reputation[factionId]} реп. с ${definitions.factions[factionId].name}`);
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
    let xpEarned = Math.max(1, Math.floor((missionDef.baseReward.sparks || 0) / GAME_CONFIG.MISSION_XP_SPARK_DIVIDER));
    xpEarned = Math.floor(xpEarned * (state.masteryXpModifier || 1.0));
    updateMastery(state, xpEarned, showToast);
    showToast(rewardToast.join(' '), 'success');
    audioController.play('levelup', 'A4', '4n');
    checkForNewQuests(state, showToast);
}

export function handleSaleCompletion(state, shelfIndex, showToast) {
    const shelf = state.shopShelves[shelfIndex];
    if (!shelf || !shelf.itemId) return;
    const itemSold = state.inventory.find(item => item.uniqueId === shelf.itemId);
    if (!itemSold) {
        state.shopShelves[shelfIndex] = { id: `shelf_${shelfIndex}`, itemId: null, customer: null, saleProgress: 0, saleTimer: 0 };
        return;
    }
    const itemDef = definitions.items[itemSold.itemKey];
    const baseValue = itemDef.components.reduce((sum, c) => sum + c.progress, 0);
    const salePrice = Math.floor((baseValue * GAME_CONFIG.SALE_BASE_PRICE_MULTIPLIER) * itemSold.quality);
    state.sparks += salePrice;
    state.totalSparksEarned += salePrice;
    const client = shelf.customer;
    const tipChance = (client?.demands?.tipChance || 0) + (state.tipChance || 0);
    if (Math.random() < tipChance) {
        const tipAmount = Math.floor(salePrice * 0.1);
        state.sparks += tipAmount;
        state.totalSparksEarned += tipAmount;
        showToast(`Клиент в восторге! Вы получили ${formatNumber(tipAmount)} искр в качестве чаевых!`, 'crit');
    }
    state.shopXP = (state.shopXP || 0) + GAME_CONFIG.SHOP_REPUTATION_XP_PER_SALE;
    const nextShopLevelDef = definitions.shopLevels.find(lvl => lvl.level === state.shopLevel + 1);
    if (nextShopLevelDef && state.shopXP >= state.shopXPToNextLevel) {
        state.shopLevel += 1;
        state.shopXPToNextLevel = nextShopLevelDef.requiredXP;
        showToast(`Уровень Магазина повышен! Уровень ${state.shopLevel}!`, 'levelup');
        audioController.play('levelup', 'E5', '4n');
        visualEffects.showParticleEffect(window.innerWidth / 2, window.innerHeight / 2, 'shop_levelup');
    }
    let xpEarned = Math.max(1, Math.floor(salePrice / GAME_CONFIG.SALE_XP_SALE_PRICE_DIVIDER));
    xpEarned = Math.floor(xpEarned * (state.masteryXpModifier || 1.0));
    updateMastery(state, xpEarned, showToast);
    state.inventory = state.inventory.filter(item => item.uniqueId !== shelf.itemId);
    state.shopShelves[shelfIndex] = { id: `shelf_${shelfIndex}`, itemId: null, customer: null, saleProgress: 0, saleTimer: 0 };
    showToast(`Продан "${itemDef.name}" за ${formatNumber(salePrice)} искр!`, 'success');
    audioController.play('cash', 'C5', '16n');
    checkForNewQuests(state, showToast);
}

export function handleFreeCraftCompletion(state, craftProject, showToast) {
    const itemDef = definitions.items[craftProject.itemKey];
    const quality = 1.0 + (craftProject.qualityPoints || 0) + (Math.random() * 0.5);
    const newItem = {
        uniqueId: `item_${Date.now()}_${Math.random()}`,
        itemKey: craftProject.itemKey,
        quality: quality,
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
    updateMastery(state, Math.floor(xpEarned * (state.masteryXpModifier || 1.0)), showToast);
    updateQuestProgress(state, 'craft', { itemId: craftProject.itemKey }, showToast);
    checkForNewQuests(state, showToast);
    return state;
}

export function handleCompleteReforge(state, reforgeProject, showToast) {
    const item = state.inventory.find(i => i.uniqueId === reforgeProject.itemUniqueId);
    if (item) {
        const finalRisk = GAME_CONFIG.REFORGE_BASE_RISK * (state.riskModifier || 1.0);
        if (Math.random() < finalRisk) {
            const qualityDecrease = GAME_CONFIG.REFORGE_QUALITY_DECREASE_MIN + Math.random() * GAME_CONFIG.REFORGE_QUALITY_DECREASE_RANDOM;
            item.quality = Math.max(1.0, item.quality - qualityDecrease);
            showToast(`Перековка не удалась! Качество "${definitions.items[item.itemKey].name}" слегка ухудшилось до ${item.quality.toFixed(2)}`, "error");
            audioController.play('crit', 'C3', '8n');
        } else {
            const qualityIncrease = GAME_CONFIG.REFORGE_QUALITY_INCREASE_MIN + Math.random() * GAME_CONFIG.REFORGE_QUALITY_INCREASE_RANDOM;
            item.quality = Math.min(10.0, item.quality + qualityIncrease);
            showToast(`Перековка "${definitions.items[item.itemKey].name}" завершена! Качество: ${item.quality.toFixed(2)}`, "success");
            let xpEarned = Math.max(1, Math.floor(item.quality * GAME_CONFIG.REFORGE_XP_QUALITY_MULTIPLIER));
            updateMastery(state, xpEarned, showToast);
        }
    }
    state.activeReforge = null;
    checkForNewQuests(state, showToast);
    return state;
}

export function handleCompleteInlay(state, inlayProject, showToast) {
    const item = state.inventory.find(i => i.uniqueId === inlayProject.itemUniqueId);
    if (item) {
        if (Math.random() >= (GAME_CONFIG.INLAY_BASE_RISK * (state.riskModifier || 1.0))) {
            item.inlaySlots = item.inlaySlots || [];
            item.inlaySlots.push({ type: inlayProject.gemType, qualityBonus: GAME_CONFIG.INLAY_QUALITY_BONUS });
            item.quality = Math.min(10.0, item.quality + (GAME_CONFIG.INLAY_QUALITY_INCREASE_MIN + Math.random() * GAME_CONFIG.INLAY_QUALITY_INCREASE_RANDOM));
            showToast(`Инкрустация "${definitions.items[item.itemKey].name}" завершена! Качество: ${item.quality.toFixed(2)}`, "success");
            state.totalInlayedItems = (state.totalInlayedItems || 0) + 1;
            updateMastery(state, Math.max(1, Math.floor(item.quality * GAME_CONFIG.INLAY_XP_QUALITY_MULTIPLIER)), showToast);
            updateQuestProgress(state, 'inlay', {}, showToast);
        } else {
            showToast(`Инкрустация не удалась! Самоцвет утерян.`, "error");
            audioController.play('crit', 'C3', '8n');
        }
    }
    state.activeInlay = null;
    checkForNewQuests(state, showToast);
    return state;
}

export function handleCompleteGraving(state, gravingProject, showToast) {
    const item = state.inventory.find(i => i.uniqueId === gravingProject.itemUniqueId);
    if (item) {
        if (Math.random() >= (GAME_CONFIG.GRAVING_BASE_RISK * (state.riskModifier || 1.0))) {
            item.gravingLevel = (item.gravingLevel || 0) + 1;
            showToast(`Гравировка "${definitions.items[item.itemKey].name}" завершена! Уровень: ${item.gravingLevel}`, "success");
            updateMastery(state, Math.max(1, Math.floor(item.gravingLevel * GAME_CONFIG.GRAVING_XP_LEVEL_MULTIPLIER)), showToast);
            updateQuestProgress(state, 'grave', {}, showToast);
        } else {
            showToast(`Гравировка не удалась!`, "error");
            audioController.play('crit', 'C3', '8n');
        }
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
    const qualityMultiplier = order.qualityHits > 0 ? (1 + order.qualityPoints / order.qualityHits) : 1;
    let rewardMultiplier = 0.5;
    if (tier === 'gold') rewardMultiplier *= 2.0;
    if (tier === 'silver') rewardMultiplier *= 1.5;
    rewardMultiplier *= qualityMultiplier;
    let finalSparks = Math.floor(order.rewards.sparks * rewardMultiplier * state.sparksModifier);
    let finalMatter = Math.floor(order.rewards.matter * rewardMultiplier * state.matterModifier);
    if (state.artifacts.quill?.status === 'completed') finalMatter += Math.floor(finalSparks / 100);
    state.sparks += finalSparks;
    state.totalSparksEarned += finalSparks;
    state.matter += finalMatter;
    let xpEarned = Math.max(1, Math.floor((itemDef.components.reduce((sum, c) => sum + c.progress, 0) / GAME_CONFIG.ORDER_XP_PROGRESS_DIVIDER) * rewardMultiplier));
    updateMastery(state, Math.floor(xpEarned * (state.masteryXpModifier || 1.0)), showToast);
    state.totalItemsCrafted = (state.totalItemsCrafted || 0) + 1;
    if (order.isRisky) {
        state.totalRiskyOrdersCompleted = (state.totalRiskyOrdersCompleted || 0) + 1;
        state.consecutiveRiskyOrders = (state.consecutiveRiskyOrders || 0) + 1;
        updateQuestProgress(state, 'risky_order', {}, showToast);
    } else {
        state.consecutiveRiskyOrders = 0;
    }
    updateQuestProgress(state, 'craft', { itemId: order.itemKey }, showToast);
    setCompletedOrderInfo({ item: itemDef, sparks: finalSparks, matter: finalMatter, tier, reputationChange: {} });
    state.activeOrder = null;
    checkForNewQuests(state, showToast);
    return state;
}
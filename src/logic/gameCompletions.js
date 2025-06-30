// src/logic/gameCompletions.js
import { definitions } from '../data/definitions/index.js';
import { audioController } from '../utils/audioController';
import { formatNumber } from '../utils/formatters.jsx';
import { getReputationLevel } from '../utils/helpers';
import { checkForNewQuests } from '../utils/gameEventChecks';
import { gameConfig as GAME_CONFIG } from '../constants/gameConfig.js';
import { visualEffects } from '../utils/visualEffects';
import { getScaledComponentProgress } from '../utils/helpers.js';

export function applyRewardToState(state, reward, showToast) {
    if (!reward) return;

    if (reward.sparks) {
        state.sparks += reward.sparks;
        state.totalSparksEarned = (state.totalSparksEarned || 0) + reward.sparks;
    }
    if (reward.matter) state.matter += reward.matter;
    if (reward.reputation) {
        for (const factionId in reward.reputation) {
            state.reputation[factionId] = (state.reputation[factionId] || 0) + reward.reputation[factionId];
        }
    }
    if (reward.specialItems) {
        for (const itemId in reward.specialItems) {
            state.specialItems[itemId] = (state.specialItems[itemId] || 0) + reward.specialItems[itemId];
        }
    }
    // ... и другие типы наград
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

function handleQuestCompletion(state, quest, showToast) {
    const questId = quest.id;
    if (!state.journal.activeQuests.some(q => q.id === questId)) return;
    
    state.journal.completedQuests.push(questId);
    state.journal.activeQuests = state.journal.activeQuests.filter(q => q.id !== questId);
    delete state.journal.questProgress[questId];
    
    const questDef = quest.type === 'standard' ? definitions.quests[questId] : quest;
    showToast(`Задание "${questDef.title}" выполнено!`, 'levelup');
    audioController.play('levelup', 'G5', '2n');

    if (questDef.reward) {
        applyRewardToState(state, questDef.reward, showToast);
        let xpEarnedForQuest = 0;
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
        const questDef = activeQuest.type === 'bulletin' ? activeQuest : definitions.quests[activeQuest.id];
        if (!questDef) return;

        if (activeQuest.type === 'bulletin' && type === 'craft_free') {
            const { item, craftingMetadata } = options;
            const progress = state.journal.questProgress[activeQuest.id];
            if (!progress) return;

            let allRequirementsMet = true;
            for(let i = 0; i < questDef.requirements.length; i++) {
                const req = questDef.requirements[i];
                let requirementSatisfied = false;

                if (req.type === 'count' && req.itemKey === item.itemKey) {
                    const subReqs = questDef.requirements.filter(r => r.itemKey === req.itemKey && r.type !== 'count');
                    const itemSatisfiesSubReqs = subReqs.every(subReq => {
                        if (subReq.type === 'quality') {
                            const comparison = subReq.comparison === 'gte' ? item.quality >= subReq.value : item.quality <= subReq.value;
                            return comparison;
                        }
                        if (subReq.type === 'craftingStat') {
                            const statValue = craftingMetadata[subReq.stat] || 0;
                            if(subReq.comparison === 'eq') return statValue === subReq.value;
                            if(subReq.comparison === 'lte') return statValue <= subReq.value;
                            if(subReq.comparison === 'gte') return statValue >= subReq.value;
                        }
                        return true;
                    });
                    
                    if (itemSatisfiesSubReqs && progress[i] && progress[i].length < req.value) {
                        progress[i].push(item);
                    }
                }
                
                if (req.type === 'count') {
                    if (progress[i] && progress[i].length >= req.value) {
                        requirementSatisfied = true;
                    }
                } else {
                    requirementSatisfied = true; 
                }

                if (!requirementSatisfied) {
                    allRequirementsMet = false;
                }
            }
            
            if (allRequirementsMet) {
                handleQuestCompletion(state, activeQuest, showToast);
            }

        } else if (questDef.target?.type === type) {
            let progressMade = false;
            if (['inlay', 'grave', 'risky_order'].includes(type) || (type === 'craft' && questDef.target.itemId === options.itemId)) {
                state.journal.questProgress[questDef.id] = (state.journal.questProgress[questDef.id] || 0) + 1;
                progressMade = true;
            }
            if (progressMade && state.journal.questProgress[questDef.id] >= questDef.target.count) {
                handleQuestCompletion(state, activeQuest, showToast);
            }
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
    const baseValue = Object.values(itemSold.stats || {}).reduce((sum, statVal) => sum + statVal, 0) * 5;

    const now = Date.now();
    const itemKey = itemSold.itemKey;
    state.marketFatigue = state.marketFatigue || {};
    state.marketPricePenalties = state.marketPricePenalties || {};

    if (!state.marketFatigue[itemKey]) state.marketFatigue[itemKey] = [];
    state.marketFatigue[itemKey].push({ timestamp: now });

    const window = GAME_CONFIG.MARKET_FATIGUE_SALE_TRACKING_WINDOW_MS;
    state.marketFatigue[itemKey] = state.marketFatigue[itemKey].filter(sale => now - sale.timestamp < window);

    const salesCount = state.marketFatigue[itemKey].length;
    if (salesCount > GAME_CONFIG.MARKET_FATIGUE_THRESHOLD) {
        const itemsOverThreshold = salesCount - GAME_CONFIG.MARKET_FATIGUE_THRESHOLD;
        const penalty = Math.min(GAME_CONFIG.MARKET_FATIGUE_MAX_PENALTY, itemsOverThreshold * GAME_CONFIG.MARKET_FATIGUE_PENALTY_PER_ITEM);
        const duration = GAME_CONFIG.MARKET_FATIGUE_DURATION_MIN_MS + Math.random() * (GAME_CONFIG.MARKET_FATIGUE_DURATION_MAX_MS - GAME_CONFIG.MARKET_FATIGUE_DURATION_MIN_MS);
        
        state.marketPricePenalties[itemKey] = { penalty, endTime: now + duration };
        showToast(`Рынок перенасыщен "${itemDef.name}"! Цена временно снижена.`, 'error');
    }

    Object.keys(state.marketPricePenalties).forEach(key => {
        if (key !== itemKey && state.marketPricePenalties[key].endTime > now) {
            state.marketPricePenalties[key].endTime -= GAME_CONFIG.MARKET_FATIGUE_RECOVERY_PER_SALE_MS;
        }
    });

    let priceMultiplier = 1.0;
    if (state.marketPricePenalties[itemKey] && state.marketPricePenalties[itemKey].endTime > now) {
        priceMultiplier = 1.0 - state.marketPricePenalties[itemKey].penalty;
    }

    const salePrice = Math.floor((baseValue * GAME_CONFIG.SALE_BASE_PRICE_MULTIPLIER) * itemSold.quality * priceMultiplier);
    state.sparks += salePrice;
    state.totalSparksEarned += salePrice;
    
    const assignmentEntry = Object.entries(state.personnelAssignment).find(
        ([pId, assignment]) => assignment.role === 'trader' && assignment.assignment === `shelf_${shelfIndex}`
    );
    if (assignmentEntry) {
        const traderId = assignmentEntry[0];
        const trader = state.hiredPersonnel.find(p => p.uniqueId === traderId);
        if (trader) {
            trader.sessionStats.salesValue = (trader.sessionStats.salesValue || 0) + salePrice;
        }
    }
    
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

function completeCraft(state, project, showToast, setCompletedOrderInfo) {
    const itemDef = definitions.items[project.itemKey];
    if (!itemDef || !project.completedComponents) {
        return;
    }

    const finalStats = {};
    let totalQualityBonus = 0;

    for (const compId in project.completedComponents) {
        const compData = project.completedComponents[compId];
        if (compData.finalStats) {
            for (const statName in compData.finalStats) {
                finalStats[statName] = (finalStats[statName] || 0) + compData.finalStats[statName];
            }
        }
        if (compData.quality > 1.0) {
            totalQualityBonus += (compData.quality - 1.0);
        }
    }
    
    const finalItemQuality = 1.0 + totalQualityBonus;
    state.totalItemsCrafted = (state.totalItemsCrafted || 0) + 1;
    
    const isOrder = !!project.client;

    const newItem = {
        uniqueId: `item_${Date.now()}_${Math.random()}`,
        itemKey: project.itemKey,
        quality: finalItemQuality,
        stats: finalStats,
        location: 'inventory',
        inlaySlots: [],
        gravingLevel: state.initialGravingLevel || 0,
        level: 1, 
    };

    if (isOrder) { // ORDER
        audioController.play('complete', 'C5', '4n');
        const timeTaken = (Date.now() - project.startTime) / 1000;
        let tier = 'bronze';
        if (timeTaken <= project.timeLimits.gold) tier = 'gold';
        else if (timeTaken <= project.timeLimits.silver) tier = 'silver';
        
        const rewardMultiplier = tier === 'gold' ? 2.0 : tier === 'silver' ? 1.5 : 0.5;
        
        let finalSparks = Math.floor(project.rewards.sparks * rewardMultiplier * state.sparksModifier);
        let finalMatter = Math.floor(project.rewards.matter * rewardMultiplier * state.matterModifier);
        
        if (state.artifacts.quill?.status === 'completed') finalMatter += Math.floor(finalSparks / 100);
        state.sparks += finalSparks;
        state.totalSparksEarned += finalSparks;
        state.matter += finalMatter;
        
        let xpEarned = Math.max(1, Math.floor((getScaledComponentProgress(itemDef, { progress: itemDef.components.reduce((sum, c) => sum + c.progress, 0) }) / GAME_CONFIG.ORDER_XP_PROGRESS_DIVIDER) * rewardMultiplier));
        updateMastery(state, Math.floor(xpEarned * (state.masteryXpModifier || 1.0)), showToast);
        
        if (project.isRisky) {
            state.totalRiskyOrdersCompleted = (state.totalRiskyOrdersCompleted || 0) + 1;
            state.consecutiveRiskyOrders = (state.consecutiveRiskyOrders || 0) + 1;
            updateQuestProgress(state, 'risky_order', {}, showToast);
        } else {
            state.consecutiveRiskyOrders = 0;
        }
        setCompletedOrderInfo({ item: itemDef, sparks: finalSparks, matter: finalMatter, tier, reputationChange: {} });
        state.activeOrder = null;
    } else { // FREE CRAFT
        if (state.inventory.length < state.inventoryCapacity) {
            state.inventory.push(newItem);
            showToast(`Создан предмет: "${itemDef.name}" (добавлен в инвентарь)!`, 'success');
        } else {
            showToast(`Инвентарь полон! Предмет "${itemDef.name}" утерян.`, 'error');
        }
        state.activeFreeCraft = null;
        let xpEarned = Math.max(1, Math.floor(getScaledComponentProgress(itemDef, { progress: itemDef.components.reduce((sum, c) => sum + c.progress, 0) }) / GAME_CONFIG.CRAFT_XP_PROGRESS_DIVIDER));
        updateMastery(state, Math.floor(xpEarned * (state.masteryXpModifier || 1.0)), showToast);
    }

    updateQuestProgress(state, isOrder ? 'craft_order' : 'craft_free', { item: newItem, craftingMetadata: project.craftingMetadata }, showToast);
    checkForNewQuests(state, showToast);
}

export function handleOrderCompletion(state, order, showToast, setCompletedOrderInfo) {
    completeCraft(state, order, showToast, setCompletedOrderInfo);
}

export function handleFreeCraftCompletion(state, craftProject, showToast) {
    completeCraft(state, craftProject, showToast, null);
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
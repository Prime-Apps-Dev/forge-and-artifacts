// src/logic/gameCompletions.js
import * as Tone from 'tone';
import { definitions } from '../data/definitions';
import { audioController } from '../utils/audioController';
import { formatNumber, hasReputation, getReputationLevel } from '../utils/helpers';

export function handleCompleteMission(state, activeMissionId, showToast) {
    const missionIndex = state.activeMissions.findIndex(m => m.id === activeMissionId);
    if (missionIndex === -1) return;

    const [completedMission] = state.activeMissions.splice(missionIndex, 1);
    const missionDef = definitions.missions[completedMission.missionId];

    let rewardToast = [`Экспедиция "${missionDef.name}" завершена!`];

    if (missionDef.baseReward.sparks) {
        state.sparks += missionDef.baseReward.sparks;
        rewardToast.push(`+${formatNumber(missionDef.baseReward.sparks)} искр`);
    }
    if (missionDef.baseReward.matter) {
        state.matter += missionDef.baseReward.matter;
        rewardToast.push(`+${formatNumber(missionDef.baseReward.matter)} материи`);
    }
    if (missionDef.baseReward.ironOre) {
        state.ironOre += missionDef.baseReward.ironOre;
        rewardToast.push(`+${formatNumber(missionDef.baseReward.ironOre)} железной руды`);
    }
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
            rewardToast.push(`Бонус: +${formatNumber(bonusSparks)} искр`);
        }
        if (missionDef.bonusReward.matterPerQualityPoint) {
            const bonusMatter = Math.floor(bonus * missionDef.bonusReward.matterPerQualityPoint);
            state.matter += bonusMatter;
            rewardToast.push(`Бонус: +${formatNumber(bonusMatter)} материи`);
        }
    }
    
    const xpEarned = Math.max(1, Math.floor(missionDef.baseReward.sparks / 100));
    state.masteryXP += xpEarned;

    while (state.masteryXP >= state.masteryXPToNextLevel) {
        state.masteryXP -= state.masteryXPToNextLevel;
        state.masteryLevel += 1;
        state.masteryXPToNextLevel = Math.floor(state.masteryXPToNextLevel * 1.5);
        showToast(`Уровень Мастерства повышен! Уровень ${state.masteryLevel}!`, 'levelup');
        audioController.play('levelup', 'A4', '4n');
    }

    showToast(rewardToast.join(' '), 'success');
    audioController.play('levelup', 'A4', '4n'); // Добавил проигрывание звука здесь, если его не было
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
    const salePrice = Math.floor((baseValue * 1.2) * itemSold.quality);

    state.sparks += salePrice;

    const client = shelf.customer;
    const tipChance = client?.demands?.tipChance || 0;
    if (Math.random() < tipChance) {
        const tipAmount = Math.floor(salePrice * 0.1);
        state.sparks += tipAmount;
        showToast(`Клиент в восторге! Вы получили ${formatNumber(tipAmount)} искр в качестве чаевых!`, 'crit');
    }

    state.shopReputation = (state.shopReputation || 0) + Math.floor(salePrice / 100);
    const xpEarned = Math.max(1, Math.floor(salePrice / 200));
    state.masteryXP += xpEarned;
    
    while (state.masteryXP >= state.masteryXPToNextLevel) {
        state.masteryXP -= state.masteryXPToNextLevel;
        state.masteryLevel += 1;
        state.masteryXPToNextLevel = Math.floor(state.masteryXPToNextLevel * 1.5);
        showToast(`Уровень Мастерства повышен! Уровень ${state.masteryLevel}!`, 'levelup');
        audioController.play('levelup', 'E5', '4n');
    }

    state.inventory = state.inventory.filter(item => item.uniqueId !== shelf.itemId);
    state.shopShelves[shelfIndex] = { itemId: null, customer: null, saleProgress: 0, saleTimer: 0 };

    showToast(`Продан "${itemDef.name}" за ${formatNumber(salePrice)} искр!`, 'success');
    audioController.play('cash', 'C5', '16n');
    
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
        gravingLevel: 0,
    };
    if (state.inventory.length < state.inventoryCapacity) {
        state.inventory.push(newItem);
        showToast(`Создан предмет: "${itemDef.name}" (добавлен в инвентарь)!`, 'success');
        state.totalItemsCrafted = (state.totalItemsCrafted || 0) + 1; // <-- Увеличиваем счетчик
    } else {
        showToast(`Инвентарь полон! Предмет "${itemDef.name}" утерян.`, 'error');
    }
    state.activeFreeCraft = null;
    
    const xpEarned = Math.max(1, Math.floor(itemDef.components.reduce((sum, c) => sum + c.progress, 0) / 50));
    state.masteryXP += xpEarned;

    while (state.masteryXP >= state.masteryXPToNextLevel) {
        state.masteryXP -= state.masteryXPToNextLevel;
        state.masteryLevel += 1;
        state.masteryXPToNextLevel = Math.floor(state.masteryXPToNextLevel * 1.5);
        showToast(`Уровень Мастерства повышен! Уровень ${state.masteryLevel}!`, 'levelup');
        audioController.play('levelup', 'E5', '4n');
    }

    return state;
}

export function handleCompleteReforge(state, reforgeProject, showToast) {
    const item = state.inventory.find(i => i.uniqueId === reforgeProject.itemUniqueId);
    if (item) {
        const baseRisk = 0.15;
        const riskModifier = state.riskModifier || 1.0;
        const finalRisk = baseRisk * riskModifier;

        if (Math.random() < finalRisk) {
            const qualityDecrease = 0.01 + Math.random() * 0.02;
            item.quality = Math.max(1.0, item.quality - qualityDecrease);
            item.location = 'inventory';
            showToast(`Перековка не удалась! Качество "${definitions.items[item.itemKey].name}" слегка ухудшилось до ${item.quality.toFixed(2)}`, "error");
            audioController.play('crit', 'C3', '8n');
        } else {
            const qualityIncrease = 0.05 + Math.random() * 0.1;
            item.quality = Math.min(10.0, item.quality + qualityIncrease);
            item.location = 'inventory';
            showToast(`Перековка "${definitions.items[item.itemKey].name}" завершена! Качество: ${item.quality.toFixed(2)}`, "success");
            
            const xpEarned = Math.max(1, Math.floor(item.quality * 20));
            state.masteryXP += xpEarned;

            while (state.masteryXP >= state.masteryXPToNextLevel) {
                state.masteryXP -= state.masteryXPToNextLevel;
                state.masteryLevel += 1;
                state.masteryXPToNextLevel = Math.floor(state.masteryXPToNextLevel * 1.5);
                showToast(`Уровень Мастерства повышен! Уровень ${state.masteryLevel}!`, 'levelup');
                audioController.play('levelup', 'E5', '4n');
            }
        }
    } else {
        showToast("Ошибка: предмет для перековки не найден.", "error");
    }
    state.activeReforge = null;
    return state;
}

export function handleCompleteInlay(state, inlayProject, showToast) {
    const item = state.inventory.find(i => i.uniqueId === inlayProject.itemUniqueId);
    if (item) {
        const baseRisk = 0.10;
        const riskModifier = state.riskModifier || 1.0;
        const finalRisk = baseRisk * riskModifier;

        if (Math.random() < finalRisk) {
            item.location = 'inventory';
            showToast(`Инкрустация не удалась! Самоцвет утерян.`, "error");
            audioController.play('crit', 'C3', '8n');
        } else {
            item.inlaySlots = item.inlaySlots || [];
            item.inlaySlots.push({ type: inlayProject.gemType, qualityBonus: 0.10 });
            const qualityIncrease = 0.05 + Math.random() * 0.05;
            item.quality = Math.min(10.0, item.quality + qualityIncrease);
            item.location = 'inventory';
            showToast(`Инкрустация "${definitions.items[item.itemKey].name}" завершена! Качество: ${item.quality.toFixed(2)}`, "success");

            const xpEarned = Math.max(1, Math.floor(item.quality * 30));
            state.masteryXP += xpEarned;

            while (state.masteryXP >= state.masteryXPToNextLevel) {
                state.masteryXP -= state.masteryXPToNextLevel;
                state.masteryLevel += 1;
                state.masteryXPToNextLevel = Math.floor(state.masteryXPToNextLevel * 1.5);
                showToast(`Уровень Мастерства повышен! Уровень ${state.masteryLevel}!`, 'levelup');
                audioController.play('levelup', 'E5', '4n');
            }
        }
    } else {
        showToast("Ошибка: предмет для инкрустации не найден.", "error");
    }
    state.activeInlay = null;
    return state;
}

export function handleCompleteGraving(state, gravingProject, showToast) {
    const item = state.inventory.find(i => i.uniqueId === gravingProject.itemUniqueId);
    if (item) {
        const baseRisk = 0.05;
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

            const xpEarned = Math.max(1, Math.floor((item.gravingLevel || 0) * 50));
            state.masteryXP += xpEarned;

            while (state.masteryXP >= state.masteryXPToNextLevel) {
                state.masteryXP -= state.masteryXPToNextLevel;
                state.masteryLevel += 1;
                state.masteryXPToNextLevel = Math.floor(state.masteryXPToNextLevel * 1.5);
                showToast(`Уровень Мастерства повышен! Уровень ${state.masteryLevel}!`, 'levelup');
                audioController.play('levelup', 'E5', '4n');
            }
        }
    } else {
        showToast("Ошибка: предмет для гравировки не найден.", "error");
    }
    state.activeGraving = null;
    return state;
}

export function checkForNewQuests(state, showToast) {
    Object.values(definitions.quests).forEach(quest => {
        if (state.journal.availableQuests.includes(quest.id) || state.journal.activeQuests.some(activeQuest => activeQuest.id === quest.id) || state.journal.completedQuests.includes(quest.id)) return;
        const trigger = quest.trigger;
        let canStart = false;
        if (trigger.type === 'reputation' && hasReputation(state.reputation, trigger.factionId, trigger.level)) canStart = true;
        else if (trigger.type === 'skill' && state.purchasedSkills[trigger.skillId]) canStart = true;
        else if (trigger.type === 'quest' && state.journal.completedQuests.includes(trigger.questId)) canStart = true;
        if (canStart) {
            state.journal.availableQuests.push(quest.id);
            showToast(`Новое задание доступно в журнале!`, 'faction');
        }
    });
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
    state.matter += finalMatter;
    const xpEarned = Math.max(1, Math.floor((definitions.items[order.itemKey].components.reduce((sum, c) => sum + c.progress, 0) / 10) * rewardMultiplier));
    state.masteryXP += xpEarned;
    // Увеличиваем счетчик созданных предметов здесь
    state.totalItemsCrafted = (state.totalItemsCrafted || 0) + 1; // <-- Увеличиваем счетчик

    while (state.masteryXP >= state.masteryXPToNextLevel) {
        state.masteryXP -= state.masteryXPToNextLevel;
        state.masteryLevel += 1;
        state.masteryXPToNextLevel = Math.floor(state.masteryXPToNextLevel * 1.5);
        showToast(`Уровень Мастерства повышен! Уровень ${state.masteryLevel}!`, 'levelup');
        audioController.play('levelup', 'E5', '4n');
    }
    Object.values(definitions.quests).forEach(quest => {
        const questDef = definitions.quests[quest.id];
        if (state.journal.activeQuests.some(activeQuest => activeQuest.id === quest.id) && questDef.target.type === 'craft' && questDef.target.itemId === order.itemKey) {
            state.journal.questProgress[quest.id] = (state.journal.questProgress[quest.id] || 0) + 1;
            if (state.journal.questProgress[quest.id] >= questDef.target.count) {
                state.journal.completedQuests.push(quest.id);
                state.journal.activeQuests = state.journal.activeQuests.filter(q => q.id !== quest.id);
                delete state.journal.questProgress[quest.id];
                showToast(`Задание "${questDef.title}" выполнено!`, 'levelup');
                audioController.play('levelup', 'G5', '2n');
                if (questDef.reward) {
                    if (questDef.reward.type === 'item') {
                        state.specialItems[questDef.reward.itemId] = (state.specialItems[quest.reward.itemId] || 0) + questDef.reward.amount;
                        showToast(`Получено: ${questDef.reward.amount} x ${definitions.specialItems[questDef.reward.itemId].name}!`, 'success');
                        Object.keys(state.artifacts).forEach(artId => {
                            const artifact = state.artifacts[artId];
                            const allObtained = Object.values(artifact.components).every(comp => state.specialItems[comp.itemId] > 0);
                            if (allObtained && artifact.status === 'locked') {
                                artifact.status = 'available';
                                showToast(`Все компоненты для артефакта "${definitions.greatArtifacts[artId].name}" собраны!`, 'levelup');
                            }
                        });
                    } else if (questDef.reward.type === 'unlock_recipe') {
                        showToast(`Разблокирован новый рецепт!`, 'success');
                    }
                }
            }
        }
    });
    setCompletedOrderInfo({ item: itemDef, sparks: finalSparks, matter: finalMatter, tier, reputationChange: {} });
    state.activeOrder = null;
    checkForNewQuests(state, showToast);
    return state;
}
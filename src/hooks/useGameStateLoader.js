// src/hooks/useGameStateLoader.js

import { useState, useRef } from 'react';
import { definitions } from '../data/definitions.js';
import { recalculateAllModifiers } from '../utils/gameStateUtils.js';

export const initialGameState = {
    sparks: 0, matter: 0,
    ironOre: 10, copperOre: 0, mithrilOre: 0, adamantiteOre: 0,
    ironIngots: 0, copperIngots: 0, bronzeIngots: 0, sparksteelIngots: 0, mithrilIngots: 0, adamantiteIngots: 0, arcaniteIngots: 0,
    specialItems: { gem: 0, expeditionMap: 0, material_guardianHeart: 0, material_adamantFrame: 0, material_lavaAgate: 0, material_ironwoodHandle: 0, material_sunTear: 0, material_purifiedGold: 0, component_adamantiteCore: 0, component_stabilizingGyroscope: 0, component_purifiedMithril: 0, component_focusingLens: 0 },
    inventory: [],
    inventoryCapacity: 8,
    shopShelves: [
        { id: 'shelf_0', itemId: null, customer: null, saleProgress: 0, saleTimer: 0 },
        { id: 'shelf_1', itemId: null, customer: null, saleProgress: 0, saleTimer: 0 },
        { id: 'shelf_2', itemId: null, customer: null, saleProgress: 0, saleTimer: 0 }
    ],
    passiveGeneration: { ironOre: 0, copperOre: 0, ironIngots: 0, forgeProgress: 0, sparks: 0 },
    orderQueue: [],
    activeOrder: null,
    activeFreeCraft: null,
    currentEpicOrder: null,
    smeltingProcess: null,
    activeWorkstationId: 'anvil',
    workstationBonus: { anvil: 1, workbench: 1, grindstone: 1 },
    progressPerClick: 1, orePerClick: 1,
    sparksModifier: 1.0, matterModifier: 1.0,
    critChance: 0.0, critBonus: 2.0,
    smeltingSpeedModifier: 1.0, timeLimitModifier: 1.0,
    componentCostReduction: 0,
    isAutoOrderOn: true,
    passiveIncomeModifier: 1.0,
    upgradeLevels: {},
    purchasedSkills: {},
    reputation: { merchants: 0, adventurers: 0, court: 0 },
    market: { prices: { ironOre: { buy: 5, sell: 2 }, copperOre: { buy: 12, sell: 6 }, mithrilOre: { buy: 40, sell: 25 }, adamantiteOre: { buy: 100, sell: 60}, ironIngots: { buy: 25, sell: 15 }, copperIngots: { buy: 50, sell: 30 }, bronzeIngots: { buy: 100, sell: 70 }, sparksteelIngots: { buy: 200, sell: 150 }, mithrilIngots: { buy: 500, sell: 350 }, adamantiteIngots: { buy: 1000, sell: 600 }, arcaniteIngots: { buy: 2500, sell: 1800 } }, worldEvent: { message: "Рынок стабилен, priceModifiers: {}" }, nextEventIn: 300 },
    investments: { merchants: false },
    artifacts: JSON.parse(JSON.stringify(definitions.greatArtifacts)),
    journal: { availableQuests: [], activeQuests: [], completedQuests: [], unlockedRecipes: [], questProgress: {} },
    settings: { sfxVolume: 50, musicVolume: 30 },
    specialization: null,
    purchasedFactionUpgrades: {},
    marketBuyModifier: 1,
    reputationGainModifier: { court: 1, merchants: 1, adventurers: 1 },
    expeditionMapCostModifier: 1,
    marketTradeSpeedModifier: 1.0,
    playerShopSalesSpeedModifier: 1.0,
    matterCostReduction: 0,
    masteryLevel: 1,
    masteryXP: 0,
    masteryXPToNextLevel: 100,
    shopReputation: 0,
    lastClickTime: 0,
    clickCount: 0,
    isShopLocked: false,
    shopLockEndTime: 0,
    activeReforge: null,
    activeInlay: null,
    activeGraving: null,
    activeInfoModal: null,
    currentRegion: 'iron_hills',
    activeMissions: [],
    activeSale: null,
    apprenticeOrder: null, // ИЗМЕНЕНО: Активный заказ подмастерья
    apprenticeOrderQueue: [], // ИЗМЕНЕНО: Очередь заказов подмастерья
    prestigePoints: 0,
    regionsVisited: [],
    isFirstPlaythrough: true,
    eternalSkills: {},
    initialGravingLevel: 0,
    regionUnlockCostReduction: 0,
    questRewardModifier: 1.0,
    completedAchievements: [],
    appliedAchievementRewards: [],
    totalItemsCrafted: 0,
    totalIngotsSmelted: 0,
    totalClicks: 0,
    totalSparksEarned: 0,
    totalMatterSpent: 0,
    totalExpeditionMapsBought: 0,
    totalCourtOrdersCompleted: 0,
    totalRiskyOrdersCompleted: 0,
};


export function useGameStateLoader(showToast) {
    const [displayedGameState, setDisplayedGameState] = useState(() => {
        let savedState = localStorage.getItem('forgeAndArtifacts_v10');
        let parsed = {};
        if (savedState) {
            try {
                parsed = JSON.parse(savedState);
            } catch (e) {
                console.error("Failed to parse saved state:", e);
                showToast("Ошибка загрузки сохранения! Загружена новая игра.", "error");
                localStorage.removeItem('forgeAndArtifacts_v10');
                return initialGameState;
            }
        } else {
            return initialGameState;
        }

        const tempState = JSON.parse(JSON.stringify(initialGameState));

        Object.keys(initialGameState).forEach(key => {
            if (key === 'artifacts') {
                tempState.artifacts = JSON.parse(JSON.stringify(initialGameState.artifacts));
                if (parsed.artifacts) {
                    Object.keys(tempState.artifacts).forEach(artId => {
                        if (parsed.artifacts[artId]) {
                            tempState.artifacts[artId].status = parsed.artifacts[artId].status;
                            if (parsed.artifacts[artId].components) {
                                Object.keys(tempState.artifacts[artId].components).forEach(compId => {
                                    if (parsed.artifacts[artId].components[compId]) {
                                        tempState.artifacts[artId].components[compId].obtained =
                                            parsed.artifacts[artId].components[compId].obtained ||
                                            parsed.specialItems?.[tempState.artifacts[artId].components[compId].itemId] > 0;
                                    }
                                });
                            }
                        }
                    });
                }
            } else if (key === 'activeMissions' && parsed[key]) {
                tempState[key] = parsed[key];
            } else if (initialGameState[key] && typeof initialGameState[key] === 'object' && !Array.isArray(initialGameState[key])) {
                tempState[key] = { ...(initialGameState[key]), ...(parsed[key] || {}) };
            } else if (Array.isArray(initialGameState[key])) {
                if (key === 'inventory') {
                    tempState.inventory = (parsed.inventory || []).map(item => ({
                        ...item,
                        inlaySlots: item.inlaySlots || [],
                        gravingLevel: item.gravingLevel || 0,
                    }));
                } else if (key === 'shopShelves') {
                    // Копируем сохраненные полки, но сбрасываем активные состояния
                    const loadedShelves = parsed.shopShelves || initialGameState.shopShelves;
                    tempState.shopShelves = loadedShelves.map((shelf, index) => ({
                        id: shelf.id || `shelf_${index}`,
                        itemId: shelf.itemId || null,
                        customer: null,
                        saleProgress: 0,
                        saleTimer: 0
                    }));
                } else if (key === 'completedAchievements' || key === 'appliedAchievementRewards') {
                    tempState[key] = parsed[key] || [];
                }
                else {
                    tempState[key] = parsed[key] !== undefined ? parsed[key] : initialGameState[key];
                }
            }
            else if (['eternalSkills', 'prestigePoints', 'regionsVisited', 'isFirstPlaythrough', 'initialGravingLevel', 'regionUnlockCostReduction', 'questRewardModifier', 'playerAvatarId', 'totalItemsCrafted', 'totalIngotsSmelted', 'totalClicks', 'totalSparksEarned', 'totalMatterSpent', 'totalExpeditionMapsBought', 'totalCourtOrdersCompleted', 'totalRiskyOrdersCompleted', 'apprenticeOrder', 'apprenticeOrderQueue'].includes(key)) { // ИЗМЕНЕНО: Добавлены apprenticeOrder и apprenticeOrderQueue
                tempState[key] = parsed[key] !== undefined ? parsed[key] : initialGameState[key];
            }
            else if (['lastClickTime', 'clickCount', 'activeReforge', 'activeInlay', 'activeGraving', 'activeInfoModal', 'activeOrder', 'activeFreeCraft', 'currentEpicOrder', 'smeltingProcess', 'activeSale'].includes(key)) { // ИЗМЕНЕНО: apprenticeOrder удален отсюда
                 tempState[key] = initialGameState[key];
            } else {
                tempState[key] = parsed[key] !== undefined ? parsed[key] : initialGameState[key];
            }
        });

        while (tempState.shopShelves.length < initialGameState.shopShelves.length) {
            tempState.shopShelves.push({ id: `shelf_${tempState.shopShelhes.length}`, itemId: null, customer: null, saleProgress: 0, saleTimer: 0 });
        }

        if (parsed.masterFame !== undefined && tempState.masteryXP === undefined) {
            tempState.masteryXP = parsed.masterFame;
        }
        tempState.masteryXP = tempState.masteryXP !== undefined ? tempState.masteryXP : initialGameState.masteryXP;
        tempState.masteryLevel = tempState.masteryLevel !== undefined ? tempState.masteryLevel : initialGameState.masteryLevel;
        tempState.masteryXPToNextLevel = tempState.masteryXPToNextLevel !== undefined ? tempState.masteryXPToNextLevel : initialGameState.masteryXPToNextLevel;


        tempState.isShopLocked = parsed.isShopLocked || initialGameState.isShopLocked;
        tempState.shopLockEndTime = parsed.shopLockEndTime || initialGameState.shopLockEndTime;
        if (tempState.isShopLocked && Date.now() > tempState.shopLockEndTime) {
            tempState.isShopLocked = false;
            tempState.shopLockEndTime = 0;
        }

        // --- НОВОЕ: ПРИМЕНЕНИЕ ЭФФЕКТОВ ДОСТИЖЕНИЙ ПРИ ЗАГРУЗКЕ ИГРЫ (ОДИН РАЗ) ---
        // Итерируем по всем завершенным достижениям и применяем их эффекты, если они еще не были применены.
        // Это необходимо, чтобы эффекты сохранялись после перезагрузки.
        Object.values(definitions.achievements).forEach(achievementDef => {
            const achievementStatus = achievementDef.check(tempState, definitions); // Проверяем статус для текущего tempState
            if (achievementStatus.isComplete) {
                // Если достижение одноуровневое
                if (!achievementDef.levels) {
                    if (!tempState.appliedAchievementRewards.includes(achievementDef.id)) {
                        achievementDef.apply(tempState); // Применяем эффект
                        tempState.appliedAchievementRewards.push(achievementDef.id); // Помечаем как примененное
                    }
                } 
                // Если достижение многоуровневое
                else {
                    achievementDef.levels.forEach((level, index) => {
                        const levelId = `${achievementDef.id}_level_${index + 1}`;
                        if (achievementStatus.current >= level.target && !tempState.appliedAchievementRewards.includes(levelId)) {
                            // Применяем только специфичный эффект для этого уровня
                            if (level.reward.sparksModifier) tempState.sparksModifier += level.reward.sparksModifier;
                            if (level.reward.matterModifier) tempState.matterModifier += level.reward.matterModifier;
                            if (level.reward.critChance) tempState.critChance += level.reward.critChance;
                            if (level.reward.orePerClick) tempState.orePerClick += level.reward.orePerClick;
                            if (level.reward.progressPerClick) tempState.progressPerClick += level.reward.progressPerClick;
                            if (level.reward.smeltingSpeedModifier) tempState.smeltingSpeedModifier += level.reward.smeltingSpeedModifier;
                            if (level.reward.matterCostReduction) tempState.matterCostReduction += level.reward.matterCostReduction;
                            if (level.reward.reputationGainModifier) {
                                for (const factionId in level.reward.reputationGainModifier) {
                                    tempState.reputationGainModifier[factionId] = (tempState.reputationGainModifier[factionId] || 1) + level.reward.reputationGainModifier[factionId];
                                }
                            }
                            if (level.reward.riskModifier) tempState.riskModifier = (tempState.riskModifier || 1.0) * (1 - level.reward.riskModifier); // Уменьшение риска
                            if (level.reward.expeditionMapCostModifier) tempState.expeditionMapCostModifier = (tempState.expeditionMapCostModifier || 1.0) * (1 - level.reward.expeditionMapCostModifier); // Снижение стоимости карт
                            if (level.reward.passiveIncomeModifier) tempState.passiveIncomeModifier = (tempState.passiveIncomeModifier || 1.0) + level.reward.passiveIncomeModifier; // Эффективность подмастерьев
                            if (level.reward.masteryXpModifier) tempState.masteryXpModifier = (tempState.masteryXpModifier || 1.0) + level.reward.masteryXpModifier; // XP модификатор
                            if (level.reward.regionUnlockCostReduction) tempState.regionUnlockCostReduction = (tempState.regionUnlockCostReduction || 0) + level.reward.regionUnlockCostReduction; // Снижение стоимости регионов
                            if (level.reward.questRewardModifier) tempState.questRewardModifier = (tempState.questRewardModifier || 1.0) + level.reward.questRewardModifier; // Награды за квесты

                            // Специальные эффекты, которые не являются простыми модификаторами
                            if (level.reward.item) {
                                tempState.specialItems[level.reward.item.id] = (tempState.specialItems[level.reward.item.id] || 0) + level.reward.item.amount;
                            }
                            if (level.reward.shopShelf) {
                                tempState.shopShelves.push({ id: `shelf_${tempState.shopShelves.length}`, itemId: null, customer: null, saleProgress: 0, saleTimer: 0 });
                            }
                            // Если эффект артефакта, который мы могли добавить напрямую, здесь не требуется, т.к. они из artifacts.js

                            tempState.appliedAchievementRewards.push(levelId); // Помечаем как примененное
                        }
                    });
                }
            }
        });

        // Теперь recalculateAllModifiers не будет повторно применять эффекты достижений.
        recalculateAllModifiers(tempState);

        return tempState;
    });

    const gameStateRef = useRef(displayedGameState);

    return { displayedGameState, setDisplayedGameState, gameStateRef };
}
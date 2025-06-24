// src/hooks/useGameStateLoader.js
import { useState, useRef } from 'react';
import { definitions } from '../data/definitions.js';
import { recalculateAllModifiers } from '../utils/gameStateUtils.js';
import { IMAGE_PATHS } from '../constants/paths.js';
import { applyRewardToState } from '../logic/gameCompletions.js';

export const initialGameState = {
    sparks: 0, matter: 0,
    ironOre: 10, copperOre: 0, mithrilOre: 0, adamantiteOre: 0,
    ironIngots: 0, copperIngots: 0, bronzeIngots: 0, sparksteelIngots: 0, mithrilIngots: 0, adamantiteIngots: 0, arcaniteIngots: 0,
    specialItems: { gem: 0, expeditionMap: 0, material_guardianHeart: 0, material_adamantFrame: 0, material_lavaAgate: 0, material_ironwoodHandle: 0, material_sunTear: 0, material_purifiedGold: 0, component_adamantiteCore: 0, component_stabilizingGyroscope: 0, component_purifiedMithril: 0, component_focusingLens: 0 },
    inventory: [],
    inventoryCapacity: 8,
    shopShelves: [
        { id: 'shelf_0', itemId: null, customer: null, saleProgress: 0, saleTimer: 0 },
        { id: 'shelf_1', itemId: null, customer: null, saleProgress: 0, saleTimer: 0 }
    ],
    passiveGeneration: { ironOre: 0, copperOre: 0, ironIngots: 0, forgeProgress: 0, sparks: 0 },
    orderQueue: [],
    activeOrder: null,
    activeFreeCraft: null,
    currentEpicOrder: null,
    smeltingProcess: null,
    activeWorkstationId: 'anvil',
    workstations: {
        anvil: { level: 1, xp: 0, xpToNextLevel: definitions.workstations.anvil.baseXpToNextLevel },
        workbench: { level: 1, xp: 0, xpToNextLevel: definitions.workstations.workbench.baseXpToNextLevel },
        grindstone: { level: 1, xp: 0, xpToNextLevel: definitions.workstations.grindstone.baseXpToNextLevel },
    },
    workstationBonus: { anvil: 1, workbench: 1, grindstone: 1 },
    progressPerClick: 1, orePerClick: 1,
    sparksModifier: 1.0, matterModifier: 1.0,
    critChance: 0.0, critBonus: 2.0,
    smeltingSpeedModifier: 1.0, timeLimitModifier: 1.0,
    componentCostReduction: 0,
    matterCostReduction: 0,
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
    shopLevel: 1,
    shopXP: 0,
    shopXPToNextLevel: definitions.shopLevels[0].requiredXP,
    claimedShopLevelRewards: [],
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
    playerAvatarId: IMAGE_PATHS.AVATARS.DEFAULT_MALE,
    playerName: 'Безымянный Кузнец',
    claimedMasteryLevelRewards: [],
    eternalAchievementBonuses: {}, // Объект для хранения всех постоянных бонусов от достижений
    masteryXP: 0,
    masteryLevel: 1,
    masteryXPToNextLevel: definitions.gameConfig.MASTERY_XP_LEVEL_START,
    consecutiveRiskyOrders: 0, // Добавлен для отслеживания рискованных заказов подряд
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
            } else if (key === 'workstations') {
                for (const workstationId in initialGameState.workstations) {
                    tempState.workstations[workstationId] = {
                        level: parsed.workstations?.[workstationId]?.level || initialGameState.workstations[workstationId].level,
                        xp: parsed.workstations?.[workstationId]?.xp || initialGameState.workstations[workstationId].xp,
                        xpToNextLevel: parsed.workstations?.[workstationId]?.xpToNextLevel || initialGameState.workstations[workstationId].xpToNextLevel,
                    };
                }
            }
            else if (key === 'eternalAchievementBonuses') {
                tempState.eternalAchievementBonuses = { ...(initialGameState.eternalAchievementBonuses), ...(parsed.eternalAchievementBonuses || {}) };
            }
            else if (initialGameState[key] && typeof initialGameState[key] === 'object' && !Array.isArray(initialGameState[key])) {
                tempState[key] = { ...(initialGameState[key]), ...(parsed[key] || {}) };
            } else if (Array.isArray(initialGameState[key])) {
                if (key === 'inventory') {
                    tempState.inventory = (parsed.inventory || []).map(item => ({
                        ...item,
                        inlaySlots: item.inlaySlots || [],
                        gravingLevel: item.gravingLevel || 0,
                    }));
                } else if (key === 'shopShelves') {
                    const loadedShelves = parsed.shopShelves || initialGameState.shopShelves;
                    tempState.shopShelves = loadedShelves.map((shelf, index) => ({
                        id: shelf.id || `shelf_${index}`,
                        itemId: shelf.itemId || null,
                        customer: null,
                        saleProgress: 0,
                        saleTimer: 0
                    }));
                } else if (key === 'completedAchievements' || key === 'appliedAchievementRewards' || key === 'claimedMasteryLevelRewards' || key === 'claimedShopLevelRewards') {
                    tempState[key] = parsed[key] || [];
                }
                else {
                    tempState[key] = parsed[key] !== undefined ? parsed[key] : initialGameState[key];
                }
            }
            else if (['eternalSkills', 'prestigePoints', 'regionsVisited', 'isFirstPlaythrough', 'initialGravingLevel', 'regionUnlockCostReduction', 'questRewardModifier', 'playerAvatarId', 'totalItemsCrafted', 'totalIngotsSmelted', 'totalClicks', 'totalSparksEarned', 'totalMatterSpent', 'totalExpeditionMapsBought', 'totalCourtOrdersCompleted', 'totalRiskyOrdersCompleted', 'playerName', 'shopLevel', 'shopXP', 'shopXPToNextLevel', 'consecutiveRiskyOrders'].includes(key)) { // Добавлен consecutiveRiskyOrders
                tempState[key] = parsed[key] !== undefined ? parsed[key] : initialGameState[key];
            }
            else if (['lastClickTime', 'clickCount', 'activeReforge', 'activeInlay', 'activeGraving', 'activeInfoModal', 'activeOrder', 'activeFreeCraft', 'currentEpicOrder', 'smeltingProcess', 'activeSale'].includes(key)) {
                 tempState[key] = initialGameState[key];
            } else {
                tempState[key] = parsed[key] !== undefined ? parsed[key] : initialGameState[key];
            }
        });

        // Ensure shopShelves count matches initial state if not parsed correctly
        while (tempState.shopShelves.length < initialGameState.shopShelves.length) {
            tempState.shopShelves.push({ id: `shelf_${tempState.shopShelves.length}`, itemId: null, customer: null, saleProgress: 0, saleTimer: 0 });
        }

        // Handle old shopReputation field for migration
        if (parsed.shopReputation !== undefined && tempState.shopXP === initialGameState.shopXP) {
            tempState.shopXP = parsed.shopReputation;
            let tempShopLevel = 1;
            let tempShopXPToNextLevel = definitions.shopLevels[0].requiredXP;
            while (tempShopXPToNextLevel !== undefined && tempState.shopXP >= tempShopXPToNextLevel && tempShopLevel < definitions.shopLevels.length) {
                tempShopLevel++;
                const nextLevelDef = definitions.shopLevels[tempShopLevel - 1];
                tempShopXPToNextLevel = nextLevelDef ? nextLevelDef.requiredXP : tempShopXPToNextLevel * 1.5;
            }
            tempState.shopLevel = tempShopLevel;
            tempState.shopXPToNextLevel = tempShopXPToNextLevel || definitions.shopLevels[definitions.shopLevels.length - 1].requiredXP; // Ensure it's not undefined
        }


        // ОБНОВЛЕНО: Корректная инициализация masteryXPToNextLevel при загрузке
        if (parsed.masteryLevel !== undefined) {
            tempState.masteryLevel = parsed.masteryLevel;
            tempState.masteryXP = parsed.masteryXP !== undefined ? parsed.masteryXP : 0;
            
            // Если игрок на максимальном уровне, XPToNextLevel = 0
            const maxPlayerRankLevel = definitions.playerRanks[definitions.playerRanks.length - 1].level;
            if (tempState.masteryLevel >= maxPlayerRankLevel) {
                tempState.masteryXPToNextLevel = 0;
                tempState.masteryXP = 0;
            } else {
                let calculatedXPToNext = definitions.gameConfig.MASTERY_XP_LEVEL_START; // Базовое значение для уровня 1
                for (let i = 1; i < tempState.masteryLevel; i++) {
                    calculatedXPToNext = Math.floor(calculatedXPToNext * definitions.gameConfig.MASTERY_XP_LEVEL_MULTIPLIER);
                }
                tempState.masteryXPToNextLevel = calculatedXPToNext;
            }
        } else {
            // Если данных нет, используем начальные значения из initialGameState
            tempState.masteryXP = initialGameState.masteryXP;
            tempState.masteryLevel = initialGameState.masteryLevel;
            tempState.masteryXPToNextLevel = initialGameState.masteryXPToNextLevel;
        }
        // Защита от 0 или отрицательных значений XPToNextLevel на НЕ максимальном уровне
        if (tempState.masteryLevel < definitions.playerRanks[definitions.playerRanks.length - 1].level && tempState.masteryXPToNextLevel <= 0) {
            tempState.masteryXPToNextLevel = definitions.gameConfig.MASTERY_XP_LEVEL_START; // Сброс к базовому значению, если сломалось
        }


        // Reapply achievement rewards (persistent ones) on load
        const appliedAchievementRewardsSnapshot = parsed.appliedAchievementRewards || [];
        tempState.appliedAchievementRewards = []; // Clear current list for reapplication
        
        Object.values(definitions.achievements).forEach(achievementDef => {
            if (!achievementDef.levels) { // Single-level achievement
                const rewardId = achievementDef.id;
                if (appliedAchievementRewardsSnapshot.includes(rewardId)) {
                    if (!achievementDef.isOneTimeReward) { // Reapply only if it's NOT a one-time reward.
                        achievementDef.apply(tempState);
                    }
                    tempState.appliedAchievementRewards.push(rewardId);
                }
            } else { // Multi-level achievement
                achievementDef.levels.forEach((levelData, index) => {
                    const levelId = `${achievementDef.id}_level_${index + 1}`;
                    if (appliedAchievementRewardsSnapshot.includes(levelId)) {
                        if (!(levelData.reward && levelData.reward.isOneTimeReward)) {
                            achievementDef.apply(tempState, levelData.reward);
                        }
                        tempState.appliedAchievementRewards.push(levelId);
                    }
                });
            }
        });


        // Apply mastery level rewards from saved state (these are applied via recalculateAllModifiers)
        const claimedMasteryLevelRewardsSnapshot = parsed.claimedMasteryLevelRewards || [];
        tempState.claimedMasteryLevelRewards = [];
        Object.values(definitions.masteryLevelRewards).forEach(rewardDef => {
            const rewardId = rewardDef.id;
            if (claimedMasteryLevelRewardsSnapshot.includes(rewardId)) {
                tempState.claimedMasteryLevelRewards.push(rewardId);
            }
        });

        // Apply shop level rewards from saved state (these are applied via recalculateAllModifiers)
        const claimedShopLevelRewardsSnapshot = parsed.claimedShopLevelRewards || [];
        tempState.claimedShopLevelRewards = [];
        Object.values(definitions.shopLevels).forEach(levelDef => {
            if (levelDef.reward && levelDef.reward.id && claimedShopLevelRewardsSnapshot.includes(levelDef.reward.id)) {
                tempState.claimedShopLevelRewards.push(levelDef.reward.id);
            }
        });

        recalculateAllModifiers(tempState);

        return tempState;
    });

    const gameStateRef = useRef(displayedGameState);

    return { displayedGameState, setDisplayedGameState, gameStateRef };
}
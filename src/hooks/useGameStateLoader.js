// src/hooks/useGameStateLoader.js

import { useState, useRef } from 'react';
import { definitions } from '../data/definitions';
import { recalculateAllModifiers } from '../utils/gameStateUtils';

export const initialGameState = {
    sparks: 0, matter: 0,
    ironOre: 10, copperOre: 0, mithrilOre: 0, adamantiteOre: 0,
    ironIngots: 0, copperIngots: 0, bronzeIngots: 0, sparksteelIngots: 0, mithrilIngots: 0, adamantiteIngots: 0, arcaniteIngots: 0,
    specialItems: { gem: 0, expeditionMap: 0, material_guardianHeart: 0, material_adamantFrame: 0, material_lavaAgate: 0, material_ironwoodHandle: 0, material_sunTear: 0, material_purifiedGold: 0, component_adamantiteCore: 0, component_stabilizingGyroscope: 0, component_purifiedMithril: 0, component_focusingLens: 0 },
    inventory: [],
    inventoryCapacity: 8,
    shopShelves: [
        { itemId: null, customer: null, saleProgress: 0, saleTimer: 0 },
        { itemId: null, customer: null, saleProgress: 0, saleTimer: 0 },
        { itemId: null, customer: null, saleProgress: 0, saleTimer: 0 }
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
    market: { prices: { ironOre: { buy: 5, sell: 2 }, copperOre: { buy: 12, sell: 6 }, mithrilOre: { buy: 40, sell: 25 }, adamantiteOre: { buy: 100, sell: 60}, ironIngots: { buy: 25, sell: 15 }, copperIngots: { buy: 50, sell: 30 }, bronzeIngots: { buy: 100, sell: 70 }, mithrilIngots: { buy: 200, sell: 150 }, adamantiteIngots: { buy: 500, sell: 350 }, arcaniteIngots: { buy: 2500, sell: 1800 } }, worldEvent: { message: "Рынок стабилен, priceModifiers: {}" }, nextEventIn: 300 },
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
    apprenticeOrder: null,
    prestigePoints: 0,
    regionsVisited: [],
    isFirstPlaythrough: true,
    eternalSkills: {},
    initialGravingLevel: 0,
    regionUnlockCostReduction: 0,
    questRewardModifier: 1.0,
    completedAchievements: [],
    totalItemsCrafted: 0, // <-- НОВОЕ ПОЛЕ: Общее количество созданных предметов
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
                    tempState.shopShelves = initialGameState.shopShelves.map((initialShelf, index) => {
                        const savedShelfData = parsed.shopShelves?.[index];
                        if (savedShelfData && typeof savedShelfData === 'object' && 'itemId' in savedShelfData) {
                            return {
                                itemId: savedShelfData.itemId,
                                customer: null,
                                saleProgress: 0,
                                saleTimer: 0
                            };
                        }
                        return initialShelf;
                    });
                } else if (key === 'completedAchievements') {
                    tempState.completedAchievements = parsed.completedAchievements || [];
                }
                else {
                    tempState[key] = parsed[key] || initialGameState[key];
                }
            }
            else if (['eternalSkills', 'prestigePoints', 'regionsVisited', 'isFirstPlaythrough', 'initialGravingLevel', 'regionUnlockCostReduction', 'questRewardModifier', 'playerAvatarId', 'totalItemsCrafted'].includes(key)) { // <-- ДОБАВЛЕНО 'totalItemsCrafted'
                tempState[key] = parsed[key] !== undefined ? parsed[key] : initialGameState[key];
            }
            else if (['lastClickTime', 'clickCount', 'activeReforge', 'activeInlay', 'activeGraving', 'activeInfoModal', 'activeOrder', 'activeFreeCraft', 'currentEpicOrder', 'smeltingProcess', 'activeSale', 'apprenticeOrder'].includes(key)) {
                 tempState[key] = initialGameState[key];
            } else {
                tempState[key] = parsed[key] !== undefined ? parsed[key] : initialGameState[key];
            }
        });

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

        recalculateAllModifiers(tempState);

        return tempState;
    });

    const gameStateRef = useRef(displayedGameState);

    return { displayedGameState, setDisplayedGameState, gameStateRef };
}
// src/hooks/useGameStateLoader.js

import { useState, useRef, useEffect } from 'react';
import { definitions } from '../data/definitions/index.js';
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
    passiveGeneration: { ironOre: 0, copperOre: 0, ironIngots: 0, sparks: 0 },
    orderQueue: [],
    activeOrder: null,
    smeltingProcess: null,
    smeltingQueue: [],
    smeltingQueueCapacity: 0,
    activeFreeCraft: null,
    currentEpicOrder: null,
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
    market: {
        prices: { ironOre: { buy: 5, sell: 2 }, copperOre: { buy: 12, sell: 6 }, mithrilOre: { buy: 40, sell: 25 }, adamantiteOre: { buy: 100, sell: 60}, ironIngots: { buy: 25, sell: 15 }, copperIngots: { buy: 50, sell: 30 }, bronzeIngots: { buy: 100, sell: 70 }, sparksteelIngots: { buy: 200, sell: 150 }, mithrilIngots: { buy: 500, sell: 350 }, adamantiteIngots: { buy: 1000, sell: 600 }, arcaniteIngots: { buy: 2500, sell: 1800 } },
        worldEvent: { id: 'stable', message: "Рынок стабилен", effects: {}, endTime: 0 },
        nextEventIn: 300
    },
    investments: { merchants: false },
    artifacts: JSON.parse(JSON.stringify(definitions.greatArtifacts)),
    journal: { availableQuests: [], activeQuests: [], completedQuests: [], unlockedRecipes: [], questProgress: {} },
    settings: { sfxVolume: 50, musicVolume: 30 },
    specialization: null,
    purchasedFactionUpgrades: {},
    marketBuyModifier: 1,
    reputationGainModifier: { court: 1.0, merchants: 1.0, adventurers: 1.0 },
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
    eternalAchievementBonuses: {},
    masteryXP: 0,
    masteryLevel: 1,
    masteryXPToNextLevel: definitions.gameConfig.MASTERY_XP_LEVEL_START,
    consecutiveRiskyOrders: 0,
    missionMinQualityReduction: 0,
    hiredPersonnel: [],
    personnelOffers: [],
    lastPersonnelOfferRollTime: 0,
    personnelRollCost: { sparks: 1000 },
    personnelRollCount: 0,
    personnelRestCooldowns: {},
    personnelAssignment: {},
    personnelSlots: {
        total: 2,
        used: 0,
        unlockedRoles: {
            trader: false,
            manager: false,
            engineer: false,
            assistant: false,
        }
    },
    personnelMoodModifier: 1.0,
    personnelWageReduction: 0,
    lastWagePaymentTime: Date.now(),
};

function b64DecodeUnicode(str) {
    try {
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    } catch (e) {
        console.error("Failed to decode base64 string:", e);
        return null;
    }
}

export function useGameStateLoader(showToast) {
    const [displayedGameState, setDisplayedGameState] = useState(() => {
        let savedState = localStorage.getItem('forgeAndArtifacts_v10');
        let parsed = {};
        if (savedState) {
            try {
                const decodedState = b64DecodeUnicode(savedState);
                if (decodedState) {
                    parsed = JSON.parse(decodedState);
                } else {
                    throw new Error("b64DecodeUnicode failed");
                }
            } catch (e) {
                console.error("Failed to parse saved state, could be corrupted or old version:", e);
                showToast("Ошибка загрузки сохранения! Загружена новая игра.", "error");
                localStorage.removeItem('forgeAndArtifacts_v10');
                return initialGameState;
            }
        } else {
            return initialGameState;
        }

        const tempState = JSON.parse(JSON.stringify(initialGameState));

        Object.keys(initialGameState).forEach(key => {
            if (parsed[key] === undefined) {
                 tempState[key] = initialGameState[key];
                 return;
            }

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
            } else if (key === 'activeOrder' || key === 'activeFreeCraft') {
                const project = parsed[key];
                if (project && typeof project === 'object') {
                    tempState[key] = { ...project, minigameState: null };
                } else {
                    tempState[key] = null;
                }
            }
            else if (['lastClickTime', 'clickCount', 'activeReforge', 'activeInlay', 'activeGraving', 'activeInfoModal', 'currentEpicOrder', 'activeSale', 'smeltingProcess'].includes(key)) {
                 tempState[key] = initialGameState[key];
            } else if (typeof initialGameState[key] === 'object' && initialGameState[key] !== null && !Array.isArray(initialGameState[key])) {
                 tempState[key] = { ...(initialGameState[key]), ...(parsed[key] || {}) };
            } else {
                 tempState[key] = parsed[key];
            }
        });
        
        if (tempState.hiredPersonnel && Array.isArray(tempState.hiredPersonnel)) {
             tempState.hiredPersonnel.forEach(p => {
                 p.previousAssignment = p.previousAssignment || null;
             });
             tempState.personnelSlots.used = tempState.hiredPersonnel.length;
        }

        recalculateAllModifiers(tempState);

        return tempState;
    });

    const gameStateRef = useRef(displayedGameState);
    
    useEffect(() => {
        gameStateRef.current = displayedGameState;
    }, [displayedGameState]);


    return { displayedGameState, setDisplayedGameState, gameStateRef };
}
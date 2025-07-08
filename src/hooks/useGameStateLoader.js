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
        { id: 'shelf_0', itemId: null, customer: null, saleProgress: 0, saleTimer: 0, marketPrice: 0, userPrice: 0 },
        { id: 'shelf_1', itemId: null, customer: null, saleProgress: 0, saleTimer: 0, marketPrice: 0, userPrice: 0 }
    ],
    playerEquipment: { tool: null, gear: null, accessory1: null, accessory2: null, accessory3: null },
    passiveGeneration: { ironOre: 0, copperOre: 0, mithrilOre: 0, adamantiteOre: 0, sparks: 0, matter: 0 },
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
        prices: {
            ironOre: { buy: 30, sell: 5 },
            copperOre: { buy: 90, sell: 14 },
            mithrilOre: { buy: 40, sell: 25 },
            adamantiteOre: { buy: 100, sell: 60 },
            ironIngots: { buy: 100, sell: 15 },
            copperIngots: { buy: 300, sell: 45 },
            bronzeIngots: { buy: 900, sell: 135 },
            sparksteelIngots: { buy: 2700, sell: 405 },
            mithrilIngots: { buy: 8100, sell: 1215 },
            adamantiteIngots: { buy: 24300, sell: 3645 },
            arcaniteIngots: { buy: 72900, sell: 10935 }
        },
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
    appliedAchievementLevels: {}, 
    totalItemsCrafted: 0,
    totalIngotsSmelted: 0,
    totalClicks: 0,
    totalSparksEarned: 0,
    totalMatterSpent: 0,
    totalExpeditionMapsBought: 0,
    totalCourtOrdersCompleted: 0,
    totalRiskyOrdersCompleted: 0,
    totalOreMinedByPersonnel: 0,
    playerAvatarId: 'default_avatar_male',
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
    personnelWageReduction: 0,
    lastWagePaymentTime: Date.now(),
    craftingSpeedModifiers: { all: 1.0, iron: 1.0, copper: 1.0, bronze: 1.0, sparksteel: 1.0, mithril: 1.0, adamantite: 1.0, arcanite: 1.0 },
    minigameBarSpeedModifier: 1.0,
    bonusCopperChance: 0,
    multitouchEnabled: false,
    unlockedFeatures: { bulletinBoard: false },
    activeCraftingEvents: [],
    craftingEventModifiers: {
        progressMultiplier: 1.0,
        isNextCritGuaranteed: false,
        skipNextClick: false,
        minigameZoneSizeModifier: 1.0,
    },
    marketFatigue: {},
    marketPricePenalties: {},
    bulletinBoard: {
        orders: [],
        nextRefresh: 0,
    },
    legacyStats: {
        passiveBonuses: {
            ore: 0,
            sparks: 0,
            matter: 0,
        }
    },
    maxComfortableQuality: 1.2,
    maxMatterTip: 10,
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
        let savedLegacyStats = localStorage.getItem('forgeAndArtifacts_v10_legacy'); 
        
        let parsed = {};
        let parsedLegacy = {}; 

        if (savedState) {
            try {
                const decodedState = b64DecodeUnicode(savedState);
                if (decodedState) {
                    parsed = JSON.parse(decodedState);
                } else {
                    throw new Error("b64DecodeUnicode for main state failed");
                }
            } catch (e) {
                console.error("Failed to parse saved state, could be corrupted or old version:", e);
                showToast("Ошибка загрузки сохранения! Загружена новая игра.", "error");
                localStorage.removeItem('forgeAndArtifacts_v10');
                localStorage.removeItem('forgeAndArtifacts_v10_legacy');
                return initialGameState;
            }
        }
        
        if (savedLegacyStats) {
             try {
                const decodedLegacy = b64DecodeUnicode(savedLegacyStats);
                 if (decodedLegacy) {
                    parsedLegacy = JSON.parse(decodedLegacy);
                } else {
                    throw new Error("b64DecodeUnicode for legacy state failed");
                }
             } catch(e) {
                console.error("Failed to parse legacy stats:", e);
                localStorage.removeItem('forgeAndArtifacts_v10_legacy');
                parsedLegacy = {};
             }
        }

        const tempState = JSON.parse(JSON.stringify(initialGameState));
        
        if(parsedLegacy) {
            tempState.legacyStats = { ...initialGameState.legacyStats, ...parsedLegacy };
        }

        Object.keys(initialGameState).forEach(key => {
            if (key === 'legacyStats') return;

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
            } else if (['activeOrder', 'activeFreeCraft', 'lastClickTime', 'clickCount', 'activeReforge', 'activeInlay', 'activeGraving', 'activeInfoModal', 'currentEpicOrder', 'activeSale', 'smeltingProcess', 'activeCraftingEvents', 'craftingEventModifiers', 'marketFatigue', 'marketPricePenalties', 'bulletinBoard'].includes(key)) {
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
                 p.rarity = p.rarity || 'common';
                 p.traits = p.traits || [];
                 p.timeWorked = p.timeWorked || 0;
                 p.giftsReceived = p.giftsReceived || 0;
                 p.equipment = p.equipment || { tool: null, gear: null }; 
                 if (!p.sessionStats) {
                     p.sessionStats = {
                         mined: {},
                         smeltedProgress: 0,
                         salesValue: 0,
                         startTime: Date.now(),
                     };
                 }
             });
             tempState.personnelSlots.used = tempState.hiredPersonnel.length;
        }
        if (tempState.inventory && Array.isArray(tempState.inventory)) {
            tempState.inventory.forEach(item => {
                item.level = item.level || 1; 
            });
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
// src/utils/gameStateUtils.js
import { definitions } from '../data/definitions';

export function recalculateAllModifiers(state) {
    // Сбрасываем все модификаторы до базовых значений
    state.passiveGeneration = { ironOre: 0, copperOre: 0, ironIngots: 0, sparks: 0, matter: 0 };
    state.sparksModifier = 1.0;
    state.matterModifier = 1.0;
    state.smeltingSpeedModifier = 1.0;
    state.progressPerClick = 1;
    state.orePerClick = 1;
    state.critChance = 0.0;
    state.critBonus = 2.0;
    state.critBonusModifier = 0;
    state.timeLimitModifier = 1.0;
    state.componentCostReduction = 0;
    state.matterCostReduction = 0;
    state.marketTradeSpeedModifier = 1.0;
    state.playerShopSalesSpeedModifier = 1.0;
    state.marketBuyModifier = 1.0; // Сброс к 1.0 для перемножаемых модификаторов
    state.reputationGainModifier = { court: 1.0, merchants: 1.0, adventurers: 1.0 }; // Сброс к 1.0
    state.expeditionMapCostModifier = 1.0; // Сброс к 1.0
    state.workstationBonus = { anvil: 1.0, workbench: 1.0, grindstone: 1.0 }; // Сбрасываем и применяем заново
    state.initialGravingLevel = 0;
    state.regionUnlockCostReduction = 0;
    state.questRewardModifier = 1.0;
    state.masteryXpModifier = 1.0;
    state.riskModifier = 1.0; // Сброс к 1.0
    state.componentProgressRequiredModifier = 1.0;
    state.prestigePointsGainModifier = 1.0;
    state.tipChance = 0; // Сбрасываем бонус к шансу чаевых

    // Применяем постоянные бонусы от достижений (из eternalAchievementBonuses)
    for (const key in state.eternalAchievementBonuses) {
        const value = state.eternalAchievementBonuses[key];
        // Обработка вложенных объектов
        if (typeof value === 'object' && value !== null) {
            if (key === 'passiveGeneration') {
                for (const resType in value) {
                    state.passiveGeneration[resType] = (state.passiveGeneration[resType] || 0) + value[resType];
                }
            } else if (key === 'reputationGainModifier') {
                for (const factionId in value) {
                    state.reputationGainModifier[factionId] = (state.reputationGainModifier[factionId] || 1.0) + value[factionId];
                }
            }
        } else {
            // Применяем простые числовые модификаторы
            if (key === 'riskModifier' || key === 'expeditionMapCostModifier' || key === 'marketBuyModifier') {
                state[key] *= value; // Эти модификаторы перемножаются
            } else if (key.endsWith('Modifier') || key === 'componentCostReduction' || key === 'matterCostReduction' || key === 'critChance' || key === 'critBonus' || key === 'progressPerClick' || key === 'orePerClick' || key === 'tipChance' || key === 'regionUnlockCostReduction' || key === 'prestigePointsGainModifier') {
                state[key] += value; // Другие модификаторы и прямые числовые свойства суммируются
            } else {
                // Для других свойств, если они есть, которые должны суммироваться
                state[key] = (state[key] || 0) + value;
            }
        }
    }


    // Бонусы от уровней верстаков
    Object.entries(state.workstations).forEach(([workstationId, workstationData]) => {
        const workstationDef = definitions.workstations[workstationId];
        if (workstationDef && workstationData.level > 1) {
            for (const bonusType in workstationDef.bonusesPerLevel) {
                const bonusValue = workstationDef.bonusesPerLevel[bonusType];
                const totalBonus = bonusValue * (workstationData.level - 1);
                
                if (state.hasOwnProperty(bonusType)) {
                    if (bonusType.endsWith('Modifier')) {
                        state[bonusType] += totalBonus;
                    } else if (bonusType === 'componentCostReduction' || bonusType === 'matterCostReduction') {
                        state[bonusType] += Math.round(totalBonus);
                    }
                    else if (bonusType === 'progressPerClick' || bonusType === 'critChance' || bonusType === 'critBonus' || bonusType === 'orePerClick') {
                        state[bonusType] += totalBonus;
                    }
                }
                if (workstationId === 'anvil' && bonusType === 'progressPerClick') {
                    state.workstationBonus.anvil += totalBonus;
                }
            }
        }
    });

    // Бонусы от уровней мастерства (Battle Pass)
    Object.values(definitions.masteryLevelRewards).forEach(rewardDef => {
        if (rewardDef.reward && state.claimedMasteryLevelRewards.includes(rewardDef.id)) {
            if (typeof rewardDef.reward.apply === 'function') {
                rewardDef.reward.apply(state);
            } else { // Если apply не функция, то это прямой объект модификаторов
                for (const key in rewardDef.reward) {
                    const value = rewardDef.reward[key];
                    if (state.hasOwnProperty(key)) {
                         if (key.endsWith('Modifier')) {
                            state[key] += value;
                        } else if (key === 'passiveGeneration') {
                            for (const resType in value) {
                                state.passiveGeneration[resType] = (state.passiveGeneration[resType] || 0) + value[resType];
                            }
                        } else if (key === 'reputationGainModifier') {
                            for (const factionId in value) {
                                state.reputationGainModifier[factionId] = (state.reputationGainModifier[factionId] || 1) + value[factionId];
                            }
                        } else if (key === 'expeditionMapCostModifier' || key === 'marketBuyModifier' || key === 'marketTradeSpeedModifier') { // Multiplicative from BattlePass
                            state[key] *= (1 - value); // Example for reduction
                        } else { // Прямые числовые свойства, которые суммируются
                            state[key] = (state[key] || 0) + value;
                        }
                    }
                }
            }
        }
    });

    // Бонусы от уровней магазина
    Object.values(definitions.shopLevels).forEach(levelDef => {
        if (levelDef.reward && state.claimedShopLevelRewards.includes(levelDef.reward.id)) {
            if (typeof levelDef.reward.apply === 'function') {
                levelDef.reward.apply(state);
            } else {
                for (const key in levelDef.reward) {
                    const value = levelDef.reward[key];
                    if (state.hasOwnProperty(key)) {
                        if (key.endsWith('Modifier')) {
                            state[key] += value;
                        } else if (key === 'marketBuyModifier' || key === 'marketTradeSpeedModifier') {
                            state[key] *= (1 - value);
                        } else if (key === 'inventoryCapacity') {
                            state.inventoryCapacity += value;
                        }
                    }
                }
            }
        }
    });

    Object.entries(state.purchasedSkills).forEach(([skillId, isPurchased]) => {
        const skillDef = definitions.skills[skillId];
        if (isPurchased && skillDef && typeof skillDef.apply === 'function') {
            skillDef.apply(state);
        }
    });

    Object.entries(state.eternalSkills).forEach(([skillId, isPurchased]) => {
        const eternalSkillDef = definitions.eternalSkills[skillId];
        if (isPurchased && eternalSkillDef && typeof eternalSkillDef.apply === 'function') {
            eternalSkillDef.apply(state);
        }
    });

    Object.entries(state.upgradeLevels).forEach(([id, lvl]) => {
        const def = definitions.upgrades[id];
        if (def && typeof def.apply === 'function') {
            if (def.isMultiLevel) {
                for (let i = 0; i < lvl; i++) {
                    def.apply(state);
                }
            } else if (lvl > 0) {
                def.apply(state);
            }
        }
    });

    Object.entries(state.upgradeLevels).forEach(([id, lvl]) => {
        const def = definitions.shopUpgrades[id];
        if (def && typeof def.apply === 'function') {
            if (def.isMultiLevel) {
                for (let i = 0; i < lvl; i++) {
                    def.apply(state);
                }
            } else if (lvl > 0) {
                def.apply(state);
            }
        }
    });

    Object.entries(state.upgradeLevels).forEach(([id, lvl]) => {
        const def = definitions.personnel[id];
        if (def && def.isMultiLevel && typeof def.apply === 'function') {
            for (let i = 0; i < lvl; i++) {
                def.apply(state);
            }
        }
    });


    Object.entries(state.purchasedFactionUpgrades).forEach(([upgradeId, isPurchased]) => {
        const upgradeDef = definitions.factionUpgrades[upgradeId];
        if (isPurchased && upgradeDef && typeof upgradeDef.apply === 'function') {
            upgradeDef.apply(state);
        }
    });

    Object.keys(state.artifacts).forEach(artId => {
        if (state.artifacts[artId].status === 'completed') {
            const artifactDef = definitions.greatArtifacts[artId];
            if (artifactDef && typeof artifactDef.apply === 'function') {
                artifactDef.apply(state);
            }
        }
    });
}
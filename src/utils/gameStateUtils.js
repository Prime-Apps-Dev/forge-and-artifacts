// src/utils/gameStateUtils.js
import { definitions } from '../data/definitions/index.js';

export function recalculateAllModifiers(state) {
    // Сбрасываем все модификаторы до базовых значений
    state.passiveGeneration = { ironOre: 0, copperOre: 0, mithrilOre: 0, adamantiteOre: 0, sparks: 0, matter: 0 };
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
    state.marketBuyModifier = 1.0;
    state.reputationGainModifier = { court: 1.0, merchants: 1.0, adventurers: 1.0 };
    state.expeditionMapCostModifier = 1.0;
    state.workstationBonus = { anvil: 1.0, workbench: 1.0, grindstone: 1.0 };
    state.initialGravingLevel = 0;
    state.regionUnlockCostReduction = 0;
    state.questRewardModifier = 1.0;
    state.masteryXpModifier = 1.0;
    state.riskModifier = 1.0;
    state.componentProgressRequiredModifier = 1.0;
    state.prestigePointsGainModifier = 1.0;
    state.tipChance = 0;
    state.missionMinQualityReduction = 0;
    state.personnelWageReduction = 0;
    state.craftingSpeedModifiers = { all: 1.0, iron: 1.0, copper: 1.0, bronze: 1.0, sparksteel: 1.0, mithril: 1.0, adamantite: 1.0, arcanite: 1.0 };
    state.minigameBarSpeedModifier = 1.0;
    state.bonusCopperChance = 0;
    state.multitouchEnabled = false;
    state.unlockedFeatures = { ...(state.unlockedFeatures || {}), bulletinBoard: false };

    // ДОБАВЛЕНО: Применяем бонусы Наследия
    if (state.legacyStats?.passiveBonuses) {
        state.passiveGeneration.ore = (state.passiveGeneration.ore || 0) + (state.legacyStats.passiveBonuses.ore || 0);
        // Примечание: пассивный доход руды от наследия будет добавляться ко всем типам руды в игровом цикле.
        state.passiveGeneration.sparks = (state.passiveGeneration.sparks || 0) + (state.legacyStats.passiveBonuses.sparks || 0);
        state.passiveGeneration.matter = (state.passiveGeneration.matter || 0) + (state.legacyStats.passiveBonuses.matter || 0);
    }
    
    // Применяем постоянные бонусы от достижений (из eternalAchievementBonuses)
    for (const key in state.eternalAchievementBonuses) {
        const value = state.eternalAchievementBonuses[key];
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
            if (key === 'riskModifier' || key === 'expeditionMapCostModifier' || key === 'marketBuyModifier') {
                state[key] *= value;
            } else if (key.endsWith('Modifier') || key === 'componentCostReduction' || key === 'matterCostReduction' || key === 'critChance' || key === 'critBonus' || key === 'progressPerClick' || key === 'orePerClick' || key === 'tipChance' || key === 'regionUnlockCostReduction' || key === 'prestigePointsGainModifier' || key === 'missionMinQualityReduction') {
                state[key] += value;
            } else {
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
                     if (bonusType === 'progressPerClick' || bonusType === 'critChance' || bonusType === 'critBonus' || bonusType === 'orePerClick' || bonusType === 'componentCostReduction') {
                        state[bonusType] += totalBonus;
                    } else if (bonusType.endsWith('Modifier')) {
                        state[bonusType] += totalBonus;
                    }
                }
            }
        }
    });

    // Бонусы от уровней мастерства
    Object.values(definitions.masteryLevelRewards).forEach(rewardDef => {
        if (rewardDef.reward && state.claimedMasteryLevelRewards.includes(rewardDef.id)) {
            if (typeof rewardDef.reward.apply === 'function') {
                rewardDef.reward.apply(state);
            } else {
                for (const key in rewardDef.reward) {
                    if (key === 'id' || key === 'apply') continue;
                    const value = rewardDef.reward[key];
                    if (state.hasOwnProperty(key) || key === 'passiveGeneration' || key === 'reputationGainModifier') {
                         if (key === 'passiveGeneration') {
                            for (const resType in value) {
                                state.passiveGeneration[resType] = (state.passiveGeneration[resType] || 0) + value[resType];
                            }
                        } else if (key === 'reputationGainModifier') {
                            for (const factionId in value) {
                                state.reputationGainModifier[factionId] = (state.reputationGainModifier[factionId] || 1) + value[factionId];
                            }
                        } else {
                            state[key] += value;
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
            }
        }
    });

    // Модификаторы от мировых событий
    const now = Date.now();
    const currentEvent = state.market.worldEvent;
    if (currentEvent && currentEvent.endTime > now && currentEvent.effects) {
        for (const key in currentEvent.effects) {
            const value = currentEvent.effects[key];
            if (state.hasOwnProperty(key)) {
                if (key === 'progressPerClick' || key === 'orePerClick' || key === 'critChance' || key === 'critBonus') {
                    state[key] += value;
                } else if (key.endsWith('Modifier')) {
                    state[key] += value;
                }
            }
        }
    }

    // Бонусы от купленных навыков
    Object.keys(state.purchasedSkills).forEach(skillId => {
        const skillDef = definitions.skills[skillId];
        if (skillDef && typeof skillDef.apply === 'function') {
            skillDef.apply(state);
        }
    });

    // Бонусы от вечных навыков
    Object.keys(state.eternalSkills).forEach(skillId => {
        const eternalSkillDef = definitions.eternalSkills[skillId];
        if (eternalSkillDef && typeof eternalSkillDef.apply === 'function') {
            eternalSkillDef.apply(state);
        }
    });

    // Бонусы от улучшений
    Object.entries(state.upgradeLevels).forEach(([id, lvl]) => {
        const def = definitions.upgrades[id] || definitions.shopUpgrades[id] || definitions.personnel[id];
        if (def && typeof def.apply === 'function') {
            if (def.isMultiLevel) {
                for (let i = 0; i < lvl; i++) def.apply(state);
            } else if (lvl > 0) {
                def.apply(state);
            }
        }
    });

    // Бонусы от нанятого персонала
    state.hiredPersonnel.forEach(p => {
        const pDef = definitions.personnel[p.personnelId];
        if (!pDef || p.isResting) return;
        const moodEfficiency = p.mood / 100;
        const effectiveAbilities = {};
        for (const abilityKey in pDef.baseAbilities) {
            effectiveAbilities[abilityKey] = (pDef.baseAbilities[abilityKey] || 0) +
                                             (p.level - 1) * (pDef.abilitiesPerLevel?.[abilityKey] || 0);
        }

        if (pDef.role === 'manager') state.personnelWageReduction += (effectiveAbilities.wageReduction || 0) * moodEfficiency;
        if (pDef.role === 'engineer') state.progressPerClick += (effectiveAbilities.progressPerClick || 0) * moodEfficiency;
        if (pDef.role === 'assistant') state.timeLimitModifier += (effectiveAbilities.clientWaitTimeModifier || 0) * moodEfficiency;
    });

    // Бонусы от улучшений фракций
    Object.keys(state.purchasedFactionUpgrades).forEach(upgradeId => {
        const upgradeDef = definitions.factionUpgrades[upgradeId];
        if (upgradeDef && typeof upgradeDef.apply === 'function') {
            upgradeDef.apply(state);
        }
    });

    // Бонусы от артефактов
    Object.keys(state.artifacts).forEach(artId => {
        if (state.artifacts[artId].status === 'completed') {
            const artifactDef = definitions.greatArtifacts[artId];
            if (artifactDef && typeof artifactDef.apply === 'function') {
                artifactDef.apply(state);
            }
        }
    });
}
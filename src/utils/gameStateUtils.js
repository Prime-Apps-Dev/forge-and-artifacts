// src/utils/gameStateUtils.js

import { definitions } from '../data/definitions';

/**
 * Пересчитывает все игровые модификаторы "с чистого листа" на основе
 * текущих купленных навыков, улучшений, персонала, фракционных апгрейдов, артефактов и достижений.
 * Важно: эта функция мутирует переданный объект `state`.
 * @param {object} state - Текущее состояние игры (передаваемое по ссылке, будет изменено).
 */
export function recalculateAllModifiers(state) {
    // Сбрасываем все модификаторы до их базовых значений перед применением
    state.passiveGeneration = { ironOre: 0, copperOre: 0, ironIngots: 0, forgeProgress: 0, sparks: 0 };
    state.sparksModifier = 1.0;
    state.matterModifier = 1.0;
    state.smeltingSpeedModifier = 1.0;
    state.progressPerClick = 1;
    state.orePerClick = 1;
    state.critChance = 0.0;
    state.critBonus = 2.0;
    state.timeLimitModifier = 1.0;
    state.componentCostReduction = 0;
    state.matterCostReduction = 0;
    state.marketTradeSpeedModifier = 1.0;
    state.playerShopSalesSpeedModifier = 1.0;
    state.marketBuyModifier = 1;
    state.reputationGainModifier = { court: 1, merchants: 1, adventurers: 1 };
    state.expeditionMapCostModifier = 1;
    state.workstationBonus = { anvil: 1, workbench: 1, grindstone: 1 };
    state.initialGravingLevel = 0;
    state.regionUnlockCostReduction = 0;
    state.questRewardModifier = 1.0;

    // 1. Эффекты от купленных навыков (purchasedSkills)
    Object.entries(state.purchasedSkills).forEach(([skillId, isPurchased]) => {
        if (isPurchased && definitions.skills[skillId]?.apply) {
            definitions.skills[skillId].apply(state);
        }
    });

    // 2. Эффекты от улучшений мастерской (definitions.upgrades)
    Object.entries(state.upgradeLevels).forEach(([id, lvl]) => {
        const def = definitions.upgrades[id];
        if (def) {
            if (def.isMultiLevel) {
                for (let i = 0; i < lvl; i++) {
                    if (def.apply) { def.apply(state); }
                }
            } else if (lvl > 0 && def.apply) {
                def.apply(state);
            }
        }
    });

    // 3. Эффекты от улучшений магазина (definitions.shopUpgrades)
    Object.entries(state.upgradeLevels).forEach(([id, lvl]) => {
        const def = definitions.shopUpgrades[id];
        if (def) {
            if (def.isMultiLevel) {
                for (let i = 0; i < lvl; i++) {
                    if (def.apply) { def.apply(state); }
                }
            } else if (lvl > 0 && def.apply) {
                def.apply(state);
            }
        }
    });

    // 4. Эффекты от персонала (definitions.personnel)
    Object.entries(state.upgradeLevels).forEach(([id, lvl]) => {
        const def = definitions.personnel[id];
        if (def && def.isMultiLevel) {
            for (let i = 0; i < lvl; i++) {
                if (def.apply) { def.apply(state); }
            }
        }
    });

    // 5. Эффекты от фракционных улучшений (definitions.factionUpgrades)
    Object.entries(state.purchasedFactionUpgrades).forEach(([upgradeId, isPurchased]) => {
        if (isPurchased && definitions.factionUpgrades[upgradeId]?.apply) {
            definitions.factionUpgrades[upgradeId].apply(state);
        }
    });

    // 6. Эффекты от завершенных Великих Артефактов (definitions.greatArtifacts)
    Object.keys(state.artifacts).forEach(artId => {
        if (state.artifacts[artId].status === 'completed') {
            const artifactDef = definitions.greatArtifacts[artId];
            if (artifactDef.apply) { // Если у артефакта есть прямая функция apply
                artifactDef.apply(state);
            } else { // Предыдущая логика, если apply отсутствует в определении артефакта
                if (artId === 'crown') {
                    state.sparksModifier += 0.25;
                    state.matterModifier += 0.25;
                }
                if (artId === 'bastion') {
                    state.progressPerClick *= 1.15;
                }
                // Quill эффект обрабатывается в handleOrderCompletion
            }
        }
    });

    // 7. Эффекты от Вечных Навыков (eternalSkills)
    Object.entries(state.eternalSkills).forEach(([skillId, isPurchased]) => {
        if (isPurchased && definitions.eternalSkills[skillId]?.apply) {
            definitions.eternalSkills[skillId].apply(state);
        }
    });

    // 8. Эффекты от Завершенных Достижений (achievements)
    state.completedAchievements.forEach(achId => {
        const achievementDef = definitions.achievements[achId];
        if (achievementDef?.apply) {
            achievementDef.apply(state);
        }
    });
}
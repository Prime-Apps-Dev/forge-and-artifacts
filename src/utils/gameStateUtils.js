// src/utils/gameStateUtils.js
import { definitions } from '../data/definitions';

export function recalculateAllModifiers(state) {
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
    state.marketBuyModifier = 1;
    state.reputationGainModifier = { court: 1, merchants: 1, adventurers: 1 };
    state.expeditionMapCostModifier = 1;
    state.workstationBonus = { anvil: 1, workbench: 1, grindstone: 1 };
    state.initialGravingLevel = 0;
    state.regionUnlockCostReduction = 0;
    state.questRewardModifier = 1.0;
    state.masteryXpModifier = 1.0;
    state.riskModifier = 1.0;
    state.componentProgressRequiredModifier = 1.0;

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

    // Удаляем логику применения эффектов forgeApprentice, так как этот подмастерье удален
    // Вместо этого, если есть другие подмастерья в definitions.personnel
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
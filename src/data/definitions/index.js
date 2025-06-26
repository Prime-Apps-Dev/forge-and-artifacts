// src/data/definitions/index.js
import { items } from './items.js';
import { skills } from './skills.js';
import { quests } from './quests.js';
import { achievements } from './achievements.js';
import { specializations } from './specializations.js';
import { factionUpgrades } from './factionUpgrades.js';
import { regions } from './regions.js';
import { eternalSkills } from './eternalSkills.js';
import { avatars } from './avatars.js';
import { personnel } from './personnel.js';
import { sharedDefinitions } from './shared.js';
import { masteryLevelRewards } from './masteryLevelRewards.js';
import { playerRanks } from './playerRanks.js';
import { shopLevels } from './shopLevels.js';
import { greatArtifacts } from './greatArtifacts.js';
import { specialItems } from './specialItems.js';
import { upgrades } from './upgrades.js';
import { shopUpgrades } from './shopUpgrades.js';
import { recipes } from './recipes.js';
import { gameConfig } from '../../constants/gameConfig.js';

/**
 * Централизованный объект, содержащий все игровые определения.
 * Собирается из модульных файлов для удобства поддержки.
 */
export const definitions = {
    items,
    skills,
    quests,
    achievements,
    specializations,
    factionUpgrades,
    regions,
    eternalSkills,
    avatars,
    personnel,
    masteryLevelRewards,
    playerRanks,
    shopLevels,
    greatArtifacts,
    specialItems,
    upgrades,
    shopUpgrades,
    recipes,
    gameConfig,
    // Определения из shared.js
    factions: sharedDefinitions.factions,
    reputationLevels: sharedDefinitions.reputationLevels,
    workstations: sharedDefinitions.workstations,
    clients: sharedDefinitions.clients,
    worldEvents: sharedDefinitions.worldEvents,
    missions: sharedDefinitions.missions,
    resources: sharedDefinitions.resources,
};
// src/data/definitions.js
import { items } from './definitions/items.js';
import { skills } from './definitions/skills.js';
import { quests } from './definitions/quests.js';
import { achievements } from './definitions/achievements.js';
import { specializations } from './definitions/specializations.js';
import { factionUpgrades } from './definitions/factionUpgrades.js';
import { regions } from './definitions/regions.js';
import { eternalSkills } from './definitions/eternalSkills.js';
import { avatars } from './definitions/avatars.js';
import { personnel } from './definitions/personnel.js';
import { sharedDefinitions } from './definitions/shared.js';

// Импортируем из отдельных файлов
import { greatArtifacts } from './definitions/greatArtifacts.js';
import { specialItems } from './definitions/specialItems.js';
import { upgrades } from './definitions/upgrades.js';
import { shopUpgrades } from './definitions/shopUpgrades.js';
import { recipes } from './definitions/recipes.js';
import { gameConfig } from '../constants/gameConfig.js'; // ИЗМЕНЕНО: Теперь импортируется как gameConfig

// Вспомогательная константа для resourceIcons, т.к. она ссылается на пути, а не на объекты
import { IMAGE_PATHS } from '../constants/paths.js';

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

    // Получаем из импортированного объекта sharedDefinitions
    factions: sharedDefinitions.factions,
    reputationLevels: sharedDefinitions.reputationLevels,
    workstations: sharedDefinitions.workstations,
    clients: sharedDefinitions.clients,
    worldEvents: sharedDefinitions.worldEvents,
    missions: sharedDefinitions.missions,
    resources: sharedDefinitions.resources,

    greatArtifacts,
    specialItems,
    upgrades,
    shopUpgrades,
    recipes,
    gameConfig, // Здесь используется как свойство объекта definitions

    resourceIcons: {
        ironOre: IMAGE_PATHS.ORES.IRON,
        copperOre: IMAGE_PATHS.ORES.COPPER,
        mithrilOre: IMAGE_PATHS.ORES.MITHRIL,
        adamantiteOre: IMAGE_PATHS.ORES.ADAMANTITE,
    },
};
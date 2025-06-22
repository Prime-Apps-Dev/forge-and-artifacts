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
import { personnel } from './definitions/personnel.js'; // ИЗМЕНЕНО: Правильный импорт personnel
import {
    factions,
    reputationLevels,
    greatArtifacts,
    specialItems,
    // personnel, // ИЗМЕНЕНО: Удалено personnel из деструктуризации main.js
    workstations,
    clients,
    upgrades,
    shopUpgrades,
    recipes,
    worldEvents,
    gameConfig,
    missions,
    resourceIcons,
    resources // Добавлено, если resources экспортируется из main.js
} from './definitions/main.js';

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
    personnel, // Теперь personnel будет взят из правильного импорта
    factions,
    reputationLevels,
    greatArtifacts,
    specialItems,
    workstations,
    clients,
    upgrades,
    shopUpgrades,
    recipes,
    worldEvents,
    gameConfig,
    missions,
    resourceIcons,
    resources // Включено, если resources экспортируется из main.js
};
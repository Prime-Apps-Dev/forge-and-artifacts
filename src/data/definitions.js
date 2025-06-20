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
import {
    factions,
    reputationLevels,
    greatArtifacts,
    specialItems,
    personnel,
    workstations,
    clients,
    upgrades,
    shopUpgrades,
    recipes,
    worldEvents,
    gameConfig,
    missions,
    resourceIcons // <-- НОВЫЙ ИМПОРТ И ЭКСПОРТ
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
    missions,
    factions,
    reputationLevels,
    greatArtifacts,
    specialItems,
    personnel,
    workstations,
    clients,
    upgrades,
    shopUpgrades,
    recipes,
    worldEvents,
    gameConfig,
    resourceIcons // <-- НОВЫЙ ЭКСПОРТ
};
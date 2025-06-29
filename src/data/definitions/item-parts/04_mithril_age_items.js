// src/data/definitions/items/04_mithril_age_items.js
import { IMAGE_PATHS } from '../../../constants/paths';

export const mithrilAgeItems = {
    mithrilDagger: {
        name: "Мифриловый кинжал", icon: IMAGE_PATHS.ITEMS.MITHRIL_DAGGER, requiredSkill: 'blueprint_mithrilCrafting', baseIngot: 'mithrilIngots', baseIngotType: 'rare', hasInlaySlots: true, firstPlaythroughLocked: true, blueprintId: 'blueprint_mithrilCrafting_item',
        components: [
            {
                id: 'blade', name: 'Мифриловый клинок', progress: 500, cost: { mithrilIngots: 5 }, workstation: 'anvil',
                baseStats: { damage: 30, sharpness: 25, speed: 10 },
                minigame: { type: 'bar_precision', triggerChance: 0.05, barSpeed: 2.2, zones: [ { from: 48, to: 52, quality: 'perfect', qualityBonus: 2.6, progressBonus: 13 }, { from: 40, to: 60, quality: 'good', qualityBonus: 1.6, progressBonus: 6.5 } ] }
            },
            {
                id: 'hilt', name: 'Укрепленная рукоять', progress: 150, cost: { ironIngots: 10 }, workstation: 'workbench',
                baseStats: { handling: 12, durability: 15 },
                minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 2.1, zoneSize: { min: 10, max: 18 }, perfectZoneSize: { min: 2, max: 5 }, qualityBonus: 1.2, perfectQualityBonus: 1.7, progressBonus: 3, perfectProgressBonus: 6 }
            },
            {
                id: 'sharpening', name: 'Магическая заточка', progress: 300, cost: { sparks: 2500 }, workstation: 'grindstone', requires: ['blade'],
                baseStats: { sharpness: 15, energyDamage: 5 },
                minigame: { type: 'click_points', triggerChance: 0.1, pointsCount: { min: 6, max: 9 }, pointLifetimeFactor: 0.8, qualityBonus: 1.0, progressBonus: 2, penalty: 0.06 }
            },
            { id: 'assembly', name: 'Сборка', progress: 100, requires: ['blade', 'hilt'], workstation: 'workbench' }
        ]
    },
    mithrilShield: {
        name: "Мифриловый щит", icon: IMAGE_PATHS.ITEMS.MITHRIL_SHIELD, requiredSkill: 'blueprint_mithrilCrafting', baseIngot: 'mithrilIngots', baseIngotType: 'rare', hasInlaySlots: true, firstPlaythroughLocked: true, blueprintId: 'blueprint_mithrilCrafting_item',
        components: [
           {
             id: 'base', name: 'Мифриловая основа', progress: 800, cost: { mithrilIngots: 8 }, workstation: 'anvil',
             baseStats: { defense: 40, durability: 35 },
             minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 1.5, zoneSize: { min: 10, max: 18 }, perfectZoneSize: { min: 2, max: 4 }, qualityBonus: 1.3, perfectQualityBonus: 2.0, progressBonus: 4, perfectProgressBonus: 8 }
           },
           {
               id: 'edging', name: 'Бронзовая окантовка', progress: 200, cost: { bronzeIngots: 20 }, workstation: 'anvil',
               baseStats: { durability: 20 },
               minigame: { type: 'bar_precision', triggerChance: 0.08, barSpeed: 2.0, zones: [ { from: 46, to: 54, quality: 'perfect', qualityBonus: 1.5, progressBonus: 5 }, { from: 38, to: 62, quality: 'good', qualityBonus: 1.1, progressBonus: 2 } ] }
           },
           {
               id: 'infusion', name: 'Насыщение материей', progress: 400, cost: { matter: 1500 }, workstation: 'workbench', requires: ['base'],
               baseStats: { energyResistance: 15 },
               minigame: { type: 'click_points', triggerChance: 0.1, pointsCount: { min: 8, max: 12 }, pointLifetimeFactor: 0.9, qualityBonus: 1.0, progressBonus: 3, penalty: 0.1 }
           },
           { id: 'assembly', name: 'Сборка', progress: 150, requires: ['base', 'edging', 'infusion'], workstation: 'workbench' }
        ]
    },
    mithrilLongsword: {
        name: "Мифриловый длинный меч", icon: IMAGE_PATHS.ITEMS.MITHRIL_LONGSWORD, requiredSkill: 'blueprint_mithrilCrafting', baseIngot: 'mithrilIngots', baseIngotType: 'rare', hasInlaySlots: true, firstPlaythroughLocked: true, blueprintId: 'blueprint_mithrilCrafting_item',
        components: [
            {
                id: "blade", name: "Длинный клинок", progress: 900, cost: { mithrilIngots: 10 }, workstation: 'anvil',
                baseStats: { damage: 45, sharpness: 30 },
                minigame: { type: 'bar_precision', triggerChance: 0.04, barSpeed: 2.6, zones: [ { from: 48, to: 52, quality: 'perfect', qualityBonus: 3.0, progressBonus: 16 }, { from: 40, to: 60, quality: 'good', qualityBonus: 2.0, progressBonus: 8 } ] }
            },
            { 
                id: "guard", name: "Бронзовая гарда", progress: 250, cost: { bronzeIngots: 8 }, workstation: 'anvil',
                baseStats: { defense: 10, durability: 15 },
                minigame: { type: 'click_points', triggerChance: 0.1, pointsCount: { min: 5, max: 8 }, pointLifetimeFactor: 1.0, qualityBonus: 1.1, progressBonus: 3, penalty: 0.08 }
            },
            { 
                id: "hilt", name: "Эфес из железного дерева", progress: 300, cost: { sparks: 3000 }, workstation: 'workbench',
                baseStats: { handling: 15, durability: 20 },
                minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 2.0, zoneSize: { min: 10, max: 15 }, perfectZoneSize: { min: 2, max: 4 }, qualityBonus: 1.3, perfectQualityBonus: 1.9, progressBonus: 5, perfectProgressBonus: 9 }
            },
            { 
                id: "sharpening", name: "Финальная заточка", progress: 400, cost: { mithrilIngots: 2 }, requires: ['blade'], workstation: 'grindstone',
                baseStats: { sharpness: 20 },
                minigame: { type: 'bar_precision', triggerChance: 0.1, barSpeed: 2.5, zones: [ { from: 49, to: 51, quality: 'perfect', qualityBonus: 1.8, progressBonus: 9 }, { from: 43, to: 57, quality: 'good', qualityBonus: 1.3, progressBonus: 4 } ] }
            },
            { id: "assembly", name: "Сборка", progress: 100, requires: ['blade', 'guard', 'hilt'], workstation: 'workbench'}
        ]
    },
    mithrilChainmail: {
        name: "Мифриловая кольчуга", icon: IMAGE_PATHS.ITEMS.MITHRIL_CHAINMAIL, requiredSkill: 'blueprint_mithrilCrafting', baseIngot: 'mithrilIngots', baseIngotType: 'rare', hasInlaySlots: true, firstPlaythroughLocked: true, blueprintId: 'blueprint_mithrilCrafting_item',
        components: [
            {
                id: "rings", name: "Плетение колец", progress: 1500, cost: { mithrilIngots: 15 }, workstation: 'workbench',
                baseStats: { defense: 50, flexibility: 15 },
                minigame: { type: 'click_points', triggerChance: 0.08, pointsCount: { min: 6, max: 10 }, pointLifetimeFactor: 0.6, qualityBonus: 0.9, progressBonus: 3, penalty: 0.10 }
            },
            { 
                id: "straps", name: "Ремни и заклепки", progress: 300, cost: { ironIngots: 20 }, workstation: 'workbench',
                baseStats: { durability: 25 },
                minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 2.1, zoneSize: { min: 12, max: 20 }, perfectZoneSize: { min: 3, max: 6 }, qualityBonus: 1.1, perfectQualityBonus: 1.4, progressBonus: 2, perfectProgressBonus: 4 }
            },
            { id: "assembly", name: "Сборка", progress: 200, requires: ['rings', 'straps'], workstation: 'workbench'}
        ]
    },
    mithrilBow: {
        name: 'Мифриловый Лук', icon: IMAGE_PATHS.ITEMS.MITHRIL_BOW, requiredSkill: 'blueprint_mithrilCrafting', baseIngot: 'mithrilIngots', baseIngotType: 'rare', hasInlaySlots: true, firstPlaythroughLocked: true, blueprintId: 'archersMastery_item',
        components: [
            {
                id: 'limb_core', name: "Основа плеч", progress: 600, cost: { mithrilIngots: 7 }, workstation: 'anvil',
                baseStats: { damage: 40, power: 35 },
                minigame: { type: 'bar_precision', triggerChance: 0.04, barSpeed: 2.4, zones: [ { from: 48, to: 52, quality: 'perfect', qualityBonus: 2.7, progressBonus: 14 }, { from: 40, to: 60, quality: 'good', qualityBonus: 1.7, progressBonus: 7 } ] }
            },
            { 
                id: 'string', name: "Тетива", progress: 200, cost: { sparks: 2000, matter: 100 }, workstation: 'workbench',
                baseStats: { speed: 20 },
                minigame: { type: 'hold_and_release', triggerChance: 0.15, releaseSpeed: 2.5, zoneSize: { min: 10, max: 15 }, perfectZoneSize: { min: 2, max: 4 }, qualityBonus: 1.3, perfectQualityBonus: 1.9, progressBonus: 4, perfectProgressBonus: 8 }
            },
            { 
                id: 'grip', name: "Рукоять", progress: 150, cost: { bronzeIngots: 10 }, workstation: 'workbench',
                baseStats: { handling: 20, durability: 15 },
                minigame: { type: 'click_points', triggerChance: 0.1, pointsCount: { min: 5, max: 8 }, pointLifetimeFactor: 1.0, qualityBonus: 1.0, progressBonus: 2, penalty: 0.06 }
            },
            { id: 'assembly', name: "Сборка", progress: 100, requires: ["limb_core", "string", "grip"], workstation: 'workbench' }
        ]
    },
    craftable_purifiedMithril: {
        name: "Очищенный Мифрил",
        isQuestRecipe: true,
        isArtifactComponent: true,
        icon: IMAGE_PATHS.ITEMS.CRAFTABLE_PURIFIED_MITHRIL,
        firstPlaythroughLocked: true,
        components: [
            {
                id: 'remelting', name: "Многократная переплавка", progress: 3000, cost: {mithrilIngots: 20}, workstation: 'anvil',
                baseStats: { purity: 80, weight: -10 },
                minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 1.5, zoneSize: { min: 15, max: 20 }, perfectZoneSize: { min: 4, max: 6 }, qualityBonus: 1.3, perfectQualityBonus: 1.8, progressBonus: 5, perfectProgressBonus: 10 }
            },
            {
                id: 'filtering', name: "Фильтрация через искры", progress: 2000, cost: {sparks: 30000}, workstation: 'workbench', requires:['remelting'],
                baseStats: { purity: 20, resonance: 15 },
                minigame: { type: 'click_points', triggerChance: 0.15, pointsCount: { min: 10, max: 15 }, pointLifetimeFactor: 0.7, qualityBonus: 1.0, progressBonus: 2, penalty: 0.1 }
            }
        ]
    },
};
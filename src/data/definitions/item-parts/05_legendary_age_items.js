// src/data/definitions/items/05_legendary_age_items.js
import { IMAGE_PATHS } from '../../../constants/paths';

export const legendaryAgeItems = {
    ornateGreatsword: {
        name: "Богато украшенный меч", icon: IMAGE_PATHS.ITEMS.ORNATE_GREATSWORD, requiredSkill: 'blueprint_masterwork', baseIngot: 'bronzeIngots', baseIngotType: 'rare', hasInlaySlots: true, firstPlaythroughLocked: true, blueprintId: 'blueprint_masterwork_item',
        components: [
            {
                id: "blade", name: "Дамасский клинок", progress: 400, cost: { bronzeIngots: 15, ironIngots: 10 }, workstation: 'anvil',
                baseStats: { damage: 40, sharpness: 25, durability: 20 },
                minigame: { type: 'bar_precision', triggerChance: 0.05, barSpeed: 2.1, zones: [ { from: 43, to: 57, quality: 'perfect', qualityBonus: 2.5, progressBonus: 12 }, { from: 33, to: 67, quality: 'good', qualityBonus: 1.5, progressBonus: 6 } ] }
            },
            {
                id: "guard", name: "Серебряная гарда", progress: 150, cost: { copperIngots: 10, sparks: 500 }, workstation: 'workbench',
                baseStats: { defense: 10, appeal: 15 },
                minigame: { type: 'click_points', triggerChance: 0.1, pointsCount: { min: 8, max: 12 }, pointLifetimeFactor: 0.8, qualityBonus: 1.0, progressBonus: 2, penalty: 0.05 }
            },
            {
                id: "hilt", name: "Украшенный эфес", progress: 120, cost: { ironIngots: 5, matter: 100 }, workstation: 'workbench',
                baseStats: { handling: 10, appeal: 20 },
                minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 2.0, zoneSize: { min: 10, max: 15 }, perfectZoneSize: { min: 2, max: 4 }, qualityBonus: 1.3, perfectQualityBonus: 1.9, progressBonus: 4, perfectProgressBonus: 8 }
            },
            {
                id: "engraving", name: "Гравировка", progress: 200, cost: { sparks: 1000 }, workstation: 'grindstone', requires: ["blade"],
                baseStats: { appeal: 30, critChance: 2 },
                minigame: { type: 'click_points', triggerChance: 0.2, pointsCount: { min: 10, max: 15 }, pointLifetimeFactor: 0.7, qualityBonus: 1.2, progressBonus: 3, penalty: 0.1 }
            },
            { id: 'assembly', name: 'Финальная сборка', progress: 80, requires: ['blade', 'guard', 'hilt', 'engraving'], workstation: 'workbench' }
        ]
     },
     royalCrown: {
          name: "Королевская корона", icon: IMAGE_PATHS.ITEMS.ROYAL_CROWN, requiredSkill: 'blueprint_masterwork', baseIngot: 'copperIngots', baseIngotType: 'rare', hasInlaySlots: true, firstPlaythroughLocked: true, blueprintId: 'blueprint_masterwork_item',
          components: [
            {
                id: 'frame', name: "Золотая основа", progress: 300, cost: { copperIngots: 20, sparks: 2000 }, workstation: 'anvil',
                baseStats: { appeal: 40, defense: 5 },
                minigame: { type: 'click_points', triggerChance: 0.15, pointsCount: { min: 5, max: 8 }, pointLifetimeFactor: 0.8, qualityBonus: 1.0, progressBonus: 2, penalty: 0.10 }
            },
            {
                id: 'filigree', name: "Серебряная филигрань", progress: 250, cost: { copperIngots: 15, sparks: 1500 }, workstation: 'workbench',
                baseStats: { appeal: 50 },
                minigame: { type: 'hold_and_release', triggerChance: 0.18, releaseSpeed: 2.4, zoneSize: { min: 8, max: 14 }, perfectZoneSize: { min: 1, max: 3 }, qualityBonus: 1.4, perfectQualityBonus: 2.0, progressBonus: 5, perfectProgressBonus: 10 }
            },
            {
                id: 'gem_setting', name: "Оправка для камней", progress: 150, cost: { bronzeIngots: 10, matter: 200 }, workstation: 'workbench',
                baseStats: { appeal: 25, critChance: 3 },
                minigame: { type: 'bar_precision', triggerChance: 0.12, barSpeed: 2.3, zones: [ { from: 48, to: 52, quality: 'perfect', qualityBonus: 1.7, progressBonus: 8 }, { from: 40, to: 60, quality: 'good', qualityBonus: 1.2, progressBonus: 4 } ] }
            },
            { id: 'assembly', name: 'Финальная сборка', progress: 100, requires: ['frame', 'filigree', 'gem_setting'], workstation: 'workbench' }
          ]
     },
    adamantitePlatebody: {
        name: "Адамантитовый нагрудник", icon: IMAGE_PATHS.ITEMS.ADAMANTITE_PLATEBODY, requiredSkill: "blueprint_adamantiteForging", baseIngot: 'adamantiteIngots', baseIngotType: 'rare', hasInlaySlots: true, firstPlaythroughLocked: true, blueprintId: 'blueprint_adamantiteForging_item',
        components: [
            {
                id: 'main_plate', name: 'Цельная пластина', progress: 2000, cost: { adamantiteIngots: 10 }, workstation: 'anvil',
                baseStats: { defense: 60, durability: 50 },
                minigame: { type: 'bar_precision', triggerChance: 0.03, barSpeed: 3.0, zones: [ { from: 46, to: 54, quality: 'perfect', qualityBonus: 3.5, progressBonus: 20 }, { from: 36, to: 64, quality: 'good', qualityBonus: 2.5, progressBonus: 10 } ] }
            },
            { 
                id: 'joint_plates', name: 'Соединительные пластины', progress: 1200, cost: { mithrilIngots: 25 }, workstation: 'anvil',
                baseStats: { defense: 20, flexibility: 10 },
                minigame: { type: 'hold_and_release', triggerChance: 0.05, releaseSpeed: 1.4, zoneSize: { min: 10, max: 15 }, perfectZoneSize: { min: 2, max: 4 }, qualityBonus: 1.5, perfectQualityBonus: 2.2, progressBonus: 6, perfectProgressBonus: 12 }
            },
            { 
                id: 'padding', name: 'Силовая подкладка', progress: 800, cost: { matter: 500 }, workstation: 'workbench',
                baseStats: { comfort: 15, energyResistance: 10 },
                minigame: { type: 'click_points', triggerChance: 0.1, pointsCount: { min: 10, max: 15 }, pointLifetimeFactor: 0.8, qualityBonus: 1.0, progressBonus: 3, penalty: 0.08 }
            },
            { id: 'assembly', name: 'Сборка', progress: 500, requires: ['main_plate', 'joint_plates', 'padding'], workstation: 'workbench'}
        ]
    },
    arcaniteSpellblade: {
        name: "Небесный Клинок", // THEMATIC CHANGE
        icon: IMAGE_PATHS.ITEMS.ARCANITE_SPELLBLADE, requiredSkill: "blueprint_arcaniteMastery", baseIngot: 'arcaniteIngots', baseIngotType: 'rare', hasInlaySlots: true, firstPlaythroughLocked: true, blueprintId: 'blueprint_arcaniteMastery_item',
        components: [
            {
                id: 'core', name: 'Ядро из арканита', progress: 3000, cost: { arcaniteIngots: 5 }, workstation: 'anvil',
                baseStats: { energyDamage: 30, resonance: 20 },
                minigame: { type: 'hold_and_release', triggerChance: 0.08, releaseSpeed: 1.0, zoneSize: { min: 8, max: 15 }, perfectZoneSize: { min: 1, max: 3 }, qualityBonus: 1.5, perfectQualityBonus: 2.5, progressBonus: 5, perfectProgressBonus: 10 }
            },
            {
                id: 'edge', name: 'Мифриловые лезвия', progress: 1500, cost: { mithrilIngots: 20 }, workstation: 'grindstone',
                baseStats: { sharpness: 25, damage: 10 },
                minigame: { type: 'bar_precision', triggerChance: 0.1, barSpeed: 2.8, zones: [ { from: 49, to: 51, quality: 'perfect', qualityBonus: 1.8, progressBonus: 8 }, { from: 42, to: 58, quality: 'good', qualityBonus: 1.2, progressBonus: 4 } ] }
            },
            {
                id: 'hilt', name: 'Рукоять с самоцветом', progress: 1000, cost: { gem: 20, sparks: 25000 }, workstation: 'workbench',
                baseStats: { handling: 15, durability: 20 },
                minigame: { type: 'click_points', triggerChance: 0.12, pointsCount: { min: 5, max: 8 }, pointLifetimeFactor: 0.9, qualityBonus: 1.0, progressBonus: 3, penalty: 0.08 }
            },
            {
                id: 'enchanting', name: 'Филигранная полировка и гравировка', progress: 2500, cost: { matter: 15000 }, requires:['core', 'edge', 'hilt'], workstation: 'workbench', // THEMATIC CHANGE
                baseStats: { appeal: 50, critChance: 5 },
                minigame: { type: 'click_points', triggerChance: 0.15, pointsCount: { min: 8, max: 12 }, pointLifetimeFactor: 0.7, qualityBonus: 1.2, progressBonus: 4, penalty: 0.1 }
            }
        ]
    },
    adamantiteHelmet: {
        name: 'Адамантитовый Шлем', icon: IMAGE_PATHS.ITEMS.ADAMANTITE_HELMET, requiredSkill: 'blueprint_adamantiteForging', baseIngot: 'adamantiteIngots', baseIngotType: 'rare', hasInlaySlots: true, firstPlaythroughLocked: true, blueprintId: 'adamantiteArmorCrafting_item',
        components: [
            {
                id: 'main_shell', name: "Основная оболочка", progress: 1500, cost: { adamantiteIngots: 8 }, workstation: 'anvil',
                baseStats: { defense: 50, durability: 45 },
                minigame: { type: 'click_points', triggerChance: 0.06, pointsCount: { min: 7, max: 10 }, pointLifetimeFactor: 0.7, qualityBonus: 1.1, progressBonus: 4, penalty: 0.12 }
            },
            { 
                id: 'visor_plate', name: "Пластина забрала", progress: 800, cost: { adamantiteIngots: 4 }, workstation: 'anvil', requires: ["main_shell"],
                baseStats: { defense: 25, durability: 20 },
                minigame: { type: 'bar_precision', triggerChance: 0.08, barSpeed: 2.8, zones: [ { from: 48, to: 52, quality: 'perfect', qualityBonus: 1.9, progressBonus: 9 }, { from: 40, to: 60, quality: 'good', qualityBonus: 1.3, progressBonus: 5 } ] }
            },
            { 
                id: 'inner_lining', name: "Внутренняя подкладка", progress: 600, cost: { matter: 300, sparks: 5000 }, workstation: 'workbench', requires: ["main_shell"],
                baseStats: { comfort: 20, energyResistance: 12 },
                minigame: { type: 'hold_and_release', triggerChance: 0.12, releaseSpeed: 1.7, zoneSize: { min: 12, max: 18 }, perfectZoneSize: { min: 3, max: 5 }, qualityBonus: 1.3, perfectQualityBonus: 1.8, progressBonus: 5, perfectProgressBonus: 10 }
            },
            { id: 'assembly', name: "Финальная сборка", progress: 400, requires: ["main_shell", "visor_plate", "inner_lining"], workstation: 'workbench' }
        ]
    },
    arcaniteAmulet: {
        name: 'Арканитовый Амулет', icon: IMAGE_PATHS.ITEMS.ARCANITE_AMULET, requiredSkill: 'blueprint_arcaniteMastery', baseIngot: 'arcaniteIngots', baseIngotType: 'rare', hasInlaySlots: true, firstPlaythroughLocked: true, blueprintId: 'arcaniteJewelry_item',
        components: [
            {
                id: 'pendant_base', name: "Основа подвески", progress: 2000, cost: { arcaniteIngots: 3 }, workstation: 'anvil',
                baseStats: { appeal: 50, resonance: 25 },
                minigame: { type: 'bar_precision', triggerChance: 0.02, barSpeed: 3.8, zones: [ { from: 48, to: 52, quality: 'perfect', qualityBonus: 4.5, progressBonus: 28 }, { from: 40, to: 60, quality: 'good', qualityBonus: 3.5, progressBonus: 14 } ] }
            },
            { 
                id: 'gem_setting', name: "Оправа для самоцвета", progress: 1000, cost: { gem: 10, sparks: 10000 }, workstation: 'workbench', requires: ["pendant_base"],
                baseStats: { appeal: 30, energyResistance: 15 },
                minigame: { type: 'click_points', triggerChance: 0.15, pointsCount: { min: 8, max: 12 }, pointLifetimeFactor: 0.8, qualityBonus: 1.2, progressBonus: 3, penalty: 0.09 }
            },
            { 
                id: 'enchantment', name: "Нанесение узоров", progress: 1500, cost: { matter: 8000 }, workstation: 'workbench', requires: ["pendant_base", "gem_setting"],
                baseStats: { critChance: 5, appeal: 20 },
                minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 1.5, zoneSize: { min: 8, max: 14 }, perfectZoneSize: { min: 1, max: 3 }, qualityBonus: 1.6, perfectQualityBonus: 2.4, progressBonus: 6, perfectProgressBonus: 12 }
            }
        ]
    },
     craftable_adamantiteCore: {
        name: "Адамантитовое ядро",
        isQuestRecipe: true,
        isArtifactComponent: true,
        icon: IMAGE_PATHS.ITEMS.CRAFTABLE_ADAMANTITE_CORE,
        firstPlaythroughLocked: true,
        components: [
            {
                id: 'molding', name: "Отливка формы", progress: 2500, cost: {adamantiteIngots: 15}, workstation: 'anvil',
                baseStats: { coreDensity: 50, durability: 30 },
                minigame: { type: 'bar_precision', triggerChance: 0.1, barSpeed: 3.0, zones: [ { from: 49, to: 51, quality: 'perfect', qualityBonus: 2.0, progressBonus: 10 }, { from: 40, to: 60, quality: 'good', qualityBonus: 1.3, progressBonus: 5 } ] }
            },
            {
                id: 'compression', name: "Сверхплотное сжатие", progress: 3500, cost: {sparks: 50000}, workstation: 'anvil', requires:['molding'],
                baseStats: { coreDensity: 30, structuralIntegrity: 40 },
                 minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 1.3, zoneSize: { min: 10, max: 15 }, perfectZoneSize: { min: 1, max: 3 }, qualityBonus: 1.6, perfectQualityBonus: 2.4, progressBonus: 8, perfectProgressBonus: 15 }
            },
            {
                id: 'cooling', name: "Магическое охлаждение", progress: 1500, cost: {matter: 7500}, workstation: 'workbench', requires:['compression'],
                baseStats: { energyResistance: 25 },
                minigame: { type: 'click_points', triggerChance: 0.15, pointsCount: { min: 8, max: 12 }, pointLifetimeFactor: 0.8, qualityBonus: 1.1, progressBonus: 3, penalty: 0.09 }
            }
        ]
    },
    craftable_runeOfFortitude: {
        name: "Укрепляющий Сердечник", // THEMATIC CHANGE
        isQuestRecipe: true,
        isArtifactComponent: true,
        icon: IMAGE_PATHS.ITEMS.CRAFTABLE_RUNE_OF_FORTITUDE,
        firstPlaythroughLocked: true,
        components: [
            {
                id: 'carving', name: "Высокоточная обработка сердечника", progress: 4000, cost: {arcaniteIngots: 3}, workstation: 'grindstone', // THEMATIC CHANGE
                baseStats: { structuralIntegrity: 40, defense: 10 },
                minigame: { type: 'bar_precision', triggerChance: 0.1, barSpeed: 3.2, zones: [ { from: 49.5, to: 50.5, quality: 'perfect', qualityBonus: 2.0, progressBonus: 15 }, { from: 45, to: 55, quality: 'good', qualityBonus: 1.4, progressBonus: 7 } ] }
            },
            {
                id: 'empowering', name: "Закалка в драконьем пламени", progress: 5000, cost: {matter: 12000}, workstation: 'workbench', requires:['carving'], // THEMATIC CHANGE
                baseStats: { energyResistance: 50, durability: 25 },
                minigame: { type: 'hold_and_release', triggerChance: 0.12, releaseSpeed: 1.2, zoneSize: { min: 10, max: 15 }, perfectZoneSize: { min: 2, max: 4 }, qualityBonus: 1.4, perfectQualityBonus: 2.2, progressBonus: 6, perfectProgressBonus: 12 }
            }
        ]
    },
    craftable_focusingLens: {
        name: "Фокусирующая Линза",
        isQuestRecipe: true,
        isArtifactComponent: true,
        icon: IMAGE_PATHS.ITEMS.CRAFTABLE_FOCUSING_LENS,
        firstPlaythroughLocked: true,
        components: [
            {
                id: 'casting', name: "Отливка основы линзы", progress: 3500, cost: {arcaniteIngots: 2}, workstation: 'anvil',
                baseStats: { focusPower: 30 },
                minigame: { type: 'bar_precision', triggerChance: 0.1, barSpeed: 3.5, zones: [ { from: 49.8, to: 50.2, quality: 'perfect', qualityBonus: 2.5, progressBonus: 20 }, { from: 48, to: 52, quality: 'good', qualityBonus: 1.8, progressBonus: 10 } ] }
            },
            {
                id: 'polishing', name: "Ювелирная полировка", progress: 4500, cost: {gem: 15}, workstation: 'grindstone', requires:['casting'],
                baseStats: { focusPower: 20, clarity: 40 },
                minigame: { type: 'click_points', triggerChance: 0.2, pointsCount: { min: 12, max: 18 }, pointLifetimeFactor: 0.6, qualityBonus: 1.2, progressBonus: 4, penalty: 0.15 }
            }
        ]
    },
};
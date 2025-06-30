// src/data/definitions/items/03_sparksteel_age_items.js
import { IMAGE_PATHS } from '../../../constants/paths';

export const sparksteelAgeItems = {
    sparksteelMace: {
        name: "Булава из Искростали",
        icon: IMAGE_PATHS.ITEMS.SPARKSTEEL_MACE,
        requiredSkill: 'artOfAlloys',
        baseIngot: 'sparksteelIngots',
        baseIngotType: 'uncommon',
        hasInlaySlots: true, blueprintId: 'blueprint_sparksteelMace',
        components: [
            {
                id: "head", name: "Навершие из Искростали", progress: 350, cost: { sparksteelIngots: 5 }, workstation: 'anvil',
                baseStats: { damage: 35, energyDamage: 10 },
                minigame: { type: 'bar_precision', triggerChance: 0.08, barSpeed: 2.2, zones: [ { from: 45, to: 55, quality: 'perfect', qualityBonus: 2.3, progressBonus: 11 }, { from: 35, to: 65, quality: 'good', qualityBonus: 1.5, progressBonus: 5.5 } ] }
            },
            {
                id: "handle", name: "Укрепленная рукоять", progress: 100, cost: { ironIngots: 15 }, workstation: 'workbench',
                baseStats: { durability: 25, handling: 5 },
                minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 1.8, zoneSize: { min: 12, max: 18 }, perfectZoneSize: { min: 3, max: 5 }, qualityBonus: 1.2, perfectQualityBonus: 1.8, progressBonus: 4, perfectProgressBonus: 8 }
            },
            {
                id: "spikes", name: "Энергетические шипы", progress: 150, cost: { sparks: 2500 }, workstation: 'grindstone', requires: ["head"],
                baseStats: { energyDamage: 15, armorPenetration: 5 },
                minigame: { type: 'click_points', triggerChance: 0.1, pointsCount: { min: 4, max: 7 }, pointLifetimeFactor: 0.9, qualityBonus: 1.1, progressBonus: 3, penalty: 0.08 }
            },
            { id: "assembly", name: "Сборка", progress: 70, requires: ["head", "handle", "spikes"], workstation: 'workbench' }
        ]
    },
    sparksteelToolset: {
        name: 'Комплект инструментов из Искростали', icon: IMAGE_PATHS.ITEMS.SPARKSTEEL_TOOLSET, requiredSkill: 'optimizedSmelting', baseIngot: 'sparksteelIngots', baseIngotType: 'uncommon', hasInlaySlots: false, blueprintId: 'blueprint_sparksteelToolset',
        components: [
            {
                id: 'hammer_head', name: "Боек молота", progress: 150, cost: { sparksteelIngots: 2 }, workstation: 'anvil',
                baseStats: { utility: 15, durability: 10 },
                minigame: { type: 'bar_precision', triggerChance: 0.1, barSpeed: 2.0, zones: [ { from: 46, to: 54, quality: 'perfect', qualityBonus: 1.6, progressBonus: 6 }, { from: 38, to: 62, quality: 'good', qualityBonus: 1.2, progressBonus: 3 } ] }
            },
            {
                id: 'chisel_blade', name: "Лезвие зубила", progress: 120, cost: { sparksteelIngots: 1 }, workstation: 'grindstone',
                baseStats: { utility: 10, precision: 8 },
                minigame: { type: 'bar_precision', triggerChance: 0.15, barSpeed: 2.2, zones: [ { from: 48, to: 52, quality: 'perfect', qualityBonus: 1.8, progressBonus: 7 }, { from: 40, to: 60, quality: 'good', qualityBonus: 1.3, progressBonus: 4 } ] }
            },
            {
                id: 'pliers_jaws', name: "Губки клещей", progress: 100, cost: { sparksteelIngots: 1 }, workstation: 'anvil',
                baseStats: { utility: 8, handling: 5 },
                minigame: { type: 'click_points', triggerChance: 0.12, pointsCount: { min: 3, max: 5 }, pointLifetimeFactor: 1.0, qualityBonus: 1.0, progressBonus: 2, penalty: 0.05 }
            },
            {
                id: 'handles', name: "Рукояти", progress: 80, cost: { ironIngots: 10 }, workstation: 'workbench',
                baseStats: { durability: 12 },
                minigame: { type: 'hold_and_release', triggerChance: 0.15, releaseSpeed: 1.9, zoneSize: { min: 15, max: 25 }, perfectZoneSize: { min: 4, max: 8 }, qualityBonus: 1.1, perfectQualityBonus: 1.5, progressBonus: 2, perfectProgressBonus: 5 }
            },
            { id: 'assembly', name: "Сборка комплекта", progress: 100, cost: { matter: 50 }, requires: ["hammer_head", "chisel_blade", "pliers_jaws", "handles"], workstation: 'workbench' }
        ]
    },
    sparksteelJewelersKit: {
        name: 'Набор ювелирных инструментов из Искростали', icon: IMAGE_PATHS.ITEMS.SPARKSTEEL_JEWELERS_KIT, requiredSkill: 'jewelersKit', baseIngot: 'sparksteelIngots', baseIngotType: 'uncommon', hasInlaySlots: false, blueprintId: 'blueprint_sparksteelJewelersKit',
        components: [
            {
                id: 'mini_anvil', name: "Мини-наковальня", progress: 100, cost: { sparksteelIngots: 1 }, workstation: 'anvil',
                baseStats: { precision: 10, durability: 8 },
                minigame: { type: 'bar_precision', triggerChance: 0.1, barSpeed: 2.1, zones: [ { from: 48, to: 52, quality: 'perfect', qualityBonus: 1.9, progressBonus: 8 }, { from: 42, to: 58, quality: 'good', qualityBonus: 1.3, progressBonus: 4 } ] }
            },
            {
                id: 'precision_pliers', name: "Прецизионные клещи", progress: 80, cost: { sparksteelIngots: 1 }, workstation: 'workbench',
                baseStats: { handling: 12, precision: 15 },
                minigame: { type: 'click_points', triggerChance: 0.15, pointsCount: { min: 5, max: 8 }, pointLifetimeFactor: 0.9, qualityBonus: 1.2, progressBonus: 3, penalty: 0.05 }
            },
            {
                id: 'fine_file', name: "Надфиль", progress: 60, cost: { sparksteelIngots: 1 }, workstation: 'grindstone',
                baseStats: { appeal: 10, precision: 10 },
                minigame: { type: 'hold_and_release', triggerChance: 0.2, releaseSpeed: 2.5, zoneSize: { min: 10, max: 18 }, perfectZoneSize: { min: 2, max: 4 }, qualityBonus: 1.3, perfectQualityBonus: 1.8, progressBonus: 3, perfectProgressBonus: 6 }
            },
            { id: 'assembly', name: "Сборка набора", progress: 50, requires: ["mini_anvil", "precision_pliers", "fine_file"], workstation: 'workbench' }
        ]
    },
    sparksteelCrossbow: {
        name: 'Арбалет из Искростали', icon: IMAGE_PATHS.ITEMS.SPARKSTEEL_CROSSBOW, requiredSkill: 'crossbowMastery', baseIngot: 'sparksteelIngots', baseIngotType: 'uncommon', hasInlaySlots: true, blueprintId: 'blueprint_sparksteelCrossbow',
        components: [
            {
                id: 'limb_core', name: "Плечи арбалета", progress: 400, cost: { sparksteelIngots: 5 }, workstation: 'anvil',
                baseStats: { damage: 40, power: 30 },
                minigame: { type: 'bar_precision', triggerChance: 0.07, barSpeed: 2.3, zones: [ { from: 46, to: 54, quality: 'perfect', qualityBonus: 2.4, progressBonus: 12 }, { from: 36, to: 64, quality: 'good', qualityBonus: 1.6, progressBonus: 6 } ] }
            },
            {
                id: 'stock', name: "Ложа", progress: 150, cost: { ironIngots: 15 }, workstation: 'workbench',
                baseStats: { durability: 20, handling: 10 },
                minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 2.0, zoneSize: { min: 15, max: 22 }, perfectZoneSize: { min: 4, max: 7 }, qualityBonus: 1.2, perfectQualityBonus: 1.7, progressBonus: 4, perfectProgressBonus: 7 }
            },
            {
                id: 'trigger_mechanism', name: "Спусковой механизм", progress: 120, cost: { bronzeIngots: 5, sparks: 1500 }, workstation: 'workbench', requires: ["limb_core"],
                baseStats: { precision: 20, speed: 5 },
                minigame: { type: 'click_points', triggerChance: 0.15, pointsCount: { min: 6, max: 9 }, pointLifetimeFactor: 0.8, qualityBonus: 1.1, progressBonus: 3, penalty: 0.08 }
            },
            { id: 'assembly', name: "Финальная сборка", progress: 80, requires: ["limb_core", "stock", "trigger_mechanism"], workstation: 'workbench' }
        ]
    },
    sparksteelPincers: {
        name: 'Клещи из Искростали', icon: IMAGE_PATHS.ITEMS.SPARKSTEEL_PINCERS, requiredSkill: 'universalPincers', baseIngot: 'sparksteelIngots', baseIngotType: 'uncommon', hasInlaySlots: false, blueprintId: 'blueprint_sparksteelPincers',
        components: [
            { 
                id: 'jaws', name: "Губки", progress: 100, cost: { sparksteelIngots: 2 }, workstation: 'anvil',
                baseStats: { utility: 12, precision: 8 },
                minigame: { type: 'bar_precision', triggerChance: 0.1, barSpeed: 2.0, zones: [ { from: 47, to: 53, quality: 'perfect', qualityBonus: 1.7, progressBonus: 7 }, { from: 40, to: 60, quality: 'good', qualityBonus: 1.2, progressBonus: 3 } ] }
            },
            { 
                id: 'pivot', name: "Шарнир", progress: 40, cost: { ironIngots: 3 }, workstation: 'workbench',
                baseStats: { durability: 10 },
                minigame: { type: 'click_points', triggerChance: 0.15, pointsCount: { min: 3, max: 4 }, pointLifetimeFactor: 1.1, qualityBonus: 0.9, progressBonus: 2, penalty: 0.05 }
            },
            { 
                id: 'handles', name: "Рукояти", progress: 60, cost: { sparks: 500 }, workstation: 'grindstone',
                baseStats: { handling: 10 },
                minigame: { type: 'hold_and_release', triggerChance: 0.15, releaseSpeed: 1.9, zoneSize: { min: 18, max: 28 }, perfectZoneSize: { min: 5, max: 9 }, qualityBonus: 1.1, perfectQualityBonus: 1.4, progressBonus: 2, perfectProgressBonus: 4 }
            },
            { id: 'assembly', name: "Сборка", progress: 30, requires: ["jaws", "pivot", "handles"], workstation: 'workbench' }
        ]
    },
    sparksteelArmorPlates: {
        name: 'Бронепластины из Искростали', icon: IMAGE_PATHS.ITEMS.SPARKSTEEL_ARMOR_PLATES, requiredSkill: 'armorPlating', baseIngot: 'sparksteelIngots', baseIngotType: 'uncommon', hasInlaySlots: true, blueprintId: 'blueprint_sparksteelArmorPlates',
        components: [
            {
                id: 'molding', name: "Формовка", progress: 300, cost: { sparksteelIngots: 4 }, workstation: 'anvil',
                baseStats: { defense: 25, energyResistance: 10 },
                minigame: { type: 'bar_precision', triggerChance: 0.06, barSpeed: 2.1, zones: [ { from: 45, to: 55, quality: 'perfect', qualityBonus: 2.3, progressBonus: 11 }, { from: 35, to: 65, quality: 'good', qualityBonus: 1.5, progressBonus: 5.5 } ] }
            },
            { 
                id: 'reinforcements', name: "Усиление", progress: 150, cost: { bronzeIngots: 8 }, workstation: 'anvil', requires: ["molding"],
                baseStats: { durability: 20 },
                minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 1.8, zoneSize: { min: 14, max: 20 }, perfectZoneSize: { min: 3, max: 6 }, qualityBonus: 1.2, perfectQualityBonus: 1.8, progressBonus: 4, perfectProgressBonus: 7 }
            },
            { 
                id: 'polishing', name: "Полировка", progress: 100, cost: { sparks: 1000 }, workstation: 'grindstone', requires: ["molding"],
                baseStats: { appeal: 5 },
                minigame: { type: 'click_points', triggerChance: 0.15, pointsCount: { min: 7, max: 10 }, pointLifetimeFactor: 1.0, qualityBonus: 0.8, progressBonus: 2, penalty: 0.05 }
            }
        ]
    },
    sparksteelWatch: {
        name: 'Часы из Искростали', icon: IMAGE_PATHS.ITEMS.SPARKSTEEL_WATCH, requiredSkill: 'precisionChronometry', baseIngot: 'sparksteelIngots', baseIngotType: 'uncommon', hasInlaySlots: true, blueprintId: 'blueprint_sparksteelWatch',
        components: [
            { 
                id: 'gear_assembly', name: "Сборка шестеренок", progress: 200, cost: { sparksteelIngots: 2 }, workstation: 'workbench',
                baseStats: { precision: 25, utility: 5 },
                minigame: { type: 'click_points', triggerChance: 0.2, pointsCount: { min: 10, max: 15 }, pointLifetimeFactor: 0.7, qualityBonus: 1.3, progressBonus: 4, penalty: 0.1 }
            },
            { 
                id: 'casing', name: "Корпус", progress: 180, cost: { copperIngots: 10, sparks: 500 }, workstation: 'anvil',
                baseStats: { durability: 10, appeal: 15 },
                minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 2.3, zoneSize: { min: 10, max: 15 }, perfectZoneSize: { min: 2, max: 4 }, qualityBonus: 1.2, perfectQualityBonus: 1.6, progressBonus: 3, perfectProgressBonus: 6 }
            },
            { 
                id: 'face_crystal', name: "Лицевой кристалл", progress: 120, cost: { gem: 1 }, workstation: 'grindstone',
                baseStats: { clarity: 20, appeal: 20 },
                minigame: { type: 'bar_precision', triggerChance: 0.15, barSpeed: 2.4, zones: [ { from: 48, to: 52, quality: 'perfect', qualityBonus: 1.8, progressBonus: 8 }, { from: 42, to: 58, quality: 'good', qualityBonus: 1.2, progressBonus: 4 } ] }
            },
            { 
                id: 'mechanism', name: "Малый механизм", progress: 250, cost: { matter: 100, sparks: 2000 }, workstation: 'workbench', requires: ["gear_assembly", "casing"],
                baseStats: { precision: 30 },
                minigame: { type: 'click_points', triggerChance: 0.18, pointsCount: { min: 8, max: 12 }, pointLifetimeFactor: 0.8, qualityBonus: 1.1, progressBonus: 2, penalty: 0.08 }
            },
            { id: 'final_assembly', name: "Финальная сборка", progress: 100, requires: ["gear_assembly", "casing", "face_crystal", "mechanism"], workstation: 'workbench' }
        ]
    }
};
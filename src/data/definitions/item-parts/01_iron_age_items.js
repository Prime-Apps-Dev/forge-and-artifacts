// src/data/definitions/items/01_iron_age_items.js
import { IMAGE_PATHS } from '../../../constants/paths';

export const ironAgeItems = {
    nail: {
        name: 'Простой Гвоздь', icon: IMAGE_PATHS.ITEMS.NAIL, requiredSkill: null, baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: false,
        components: [{
            id: 'forging', name: "Ковка", progress: 10, cost: { ironIngots: 1 }, workstation: 'anvil',
            baseStats: { utility: 1 },
            minigame: { type: 'bar_precision', triggerChance: 0.2, barSpeed: 1.2, zones: [{ from: 40, to: 60, quality: 'good', qualityBonus: 1.2, progressBonus: 2 }] }
        }]
    },
    horseshoe: {
        name: 'Подкова', icon: IMAGE_PATHS.ITEMS.HORSESHOE, requiredSkill: null, baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: false,
        components: [{
            id: "shaping", name: "Формовка", progress: 25, cost: { ironIngots: 2 }, workstation: 'anvil',
            baseStats: { durability: 5, speed: 1 },
            minigame: { type: 'hold_and_release', triggerChance: 0.15, releaseSpeed: 1.5, zoneSize: { min: 20, max: 30 }, perfectZoneSize: { min: 5, max: 10 }, qualityBonus: 1.1, perfectQualityBonus: 1.5, progressBonus: 3, perfectProgressBonus: 6 }
        }]
    },
    dagger: {
        name: 'Простой Кинжал', icon: IMAGE_PATHS.ITEMS.DAGGER, requiredSkill: null, baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: false,
        components: [
            {
                id: "blade", name: "Лезвие", progress: 40, cost: { ironIngots: 3 }, workstation: 'anvil',
                baseStats: { damage: 8, sharpness: 5 },
                minigame: { type: 'bar_precision', triggerChance: 0.1, barSpeed: 1.5, zones: [ { from: 48, to: 52, quality: 'perfect', qualityBonus: 1.5, progressBonus: 5 }, { from: 40, to: 60, quality: 'good', qualityBonus: 1.0, progressBonus: 2 } ] }
            },
            {
                id: "hilt", name: "Рукоять", progress: 20, cost: { ironIngots: 2 }, workstation: 'workbench',
                baseStats: { durability: 4, handling: 2 },
                minigame: { type: 'click_points', triggerChance: 0.15, pointsCount: { min: 2, max: 4 }, pointLifetimeFactor: 1.2, qualityBonus: 0.8, progressBonus: 1, penalty: 0.05 }
            },
            { id: "assembly", name: "Сборка", progress: 10, requires: ["blade", "hilt"], workstation: 'workbench' }
        ]
    },
    ironHelmet: {
        name: "Железный шлем", icon: IMAGE_PATHS.ITEMS.IRON_HELMET, requiredSkill: 'blueprint_basicArmor', baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: true, blueprintId: 'blueprint_basicArmor_item',
        components: [
            {
                id: "dome", name: "Купол", progress: 60, cost: { ironIngots: 5 }, workstation: 'anvil',
                baseStats: { defense: 10, durability: 8 },
                minigame: { type: 'bar_precision', triggerChance: 0.08, barSpeed: 1.6, zones: [ { from: 47, to: 53, quality: 'perfect', qualityBonus: 1.8, progressBonus: 6 }, { from: 38, to: 62, quality: 'good', qualityBonus: 1.1, progressBonus: 3 } ] }
            },
            {
                id: "visor", name: "Забрало", progress: 30, cost: { ironIngots: 3 }, workstation: 'anvil', requires: ["dome"],
                baseStats: { defense: 5 },
                minigame: { type: 'click_points', triggerChance: 0.1, pointsCount: { min: 3, max: 5 }, pointLifetimeFactor: 1.0, qualityBonus: 0.9, progressBonus: 2, penalty: 0.06 }
            },
            {
                id: "padding", name: "Подкладка", progress: 20, cost: { sparks: 50 }, workstation: 'workbench', requires: ["dome"],
                baseStats: { comfort: 5, durability: 2 },
                minigame: { type: 'hold_and_release', triggerChance: 0.2, releaseSpeed: 2.0, zoneSize: { min: 18, max: 28 }, perfectZoneSize: { min: 4, max: 8 }, qualityBonus: 1.0, perfectQualityBonus: 1.4, progressBonus: 2, perfectProgressBonus: 5 }
            },
            { id: "assembly", name: "Сборка", progress: 15, requires: ["dome", "visor", "padding"], workstation: 'workbench' }
        ]
    },
    ironGreaves: {
        name: "Железные поножи", icon: IMAGE_PATHS.ITEMS.IRON_GREAVES, requiredSkill: 'blueprint_basicArmor', baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: true, blueprintId: 'blueprint_basicArmor_item',
        components: [
            {
                id: "plates", name: "Пластины", progress: 80, cost: { ironIngots: 7 }, workstation: 'anvil',
                baseStats: { defense: 12, durability: 10 },
                minigame: { type: 'hold_and_release', triggerChance: 0.15, releaseSpeed: 2.0, zoneSize: { min: 15, max: 25 }, perfectZoneSize: { min: 3, max: 7 }, qualityBonus: 1.0, perfectQualityBonus: 1.5, progressBonus: 2, perfectProgressBonus: 5 }
            },
            {
                id: "straps", name: "Ремни", progress: 25, cost: { sparks: 70 }, workstation: 'workbench', requires: ["plates"],
                baseStats: { durability: 5 },
                minigame: { type: 'click_points', triggerChance: 0.2, pointsCount: { min: 4, max: 6 }, pointLifetimeFactor: 1.1, qualityBonus: 0.7, progressBonus: 1, penalty: 0.04 }
            },
            { id: "assembly", name: "Сборка", progress: 20, requires: ["plates", "straps"], workstation: 'workbench' }
        ]
    },
    twoHandedAxe: {
        name: "Двуручный топор", icon: IMAGE_PATHS.ITEMS.TWO_HANDED_AXE, requiredSkill: 'blueprint_advancedTools', baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: true, blueprintId: 'blueprint_advancedTools_item',
        components: [
            {
                id: "axehead", name: "Лезвие топора", progress: 120, cost: { ironIngots: 10 }, workstation: 'anvil',
                baseStats: { damage: 25, armorPenetration: 5 },
                minigame: { type: 'click_points', triggerChance: 0.1, pointsCount: { min: 3, max: 5 }, pointLifetimeFactor: 1.0, qualityBonus: 0.8, progressBonus: 1, penalty: 0.05 }
            },
            {
                id: "handle", name: "Древко", progress: 40, cost: { ironIngots: 4 }, workstation: 'workbench',
                baseStats: { durability: 15, handling: -5 },
                 minigame: { type: 'hold_and_release', triggerChance: 0.15, releaseSpeed: 1.8, zoneSize: { min: 15, max: 25 }, perfectZoneSize: { min: 5, max: 8 }, qualityBonus: 1.1, perfectQualityBonus: 1.6, progressBonus: 3, perfectProgressBonus: 7 }
            },
            {
                id: "sharpening", name: "Заточка", progress: 50, cost: { sparks: 100 }, workstation: 'grindstone', requires: ["axehead"],
                baseStats: { sharpness: 10, damage: 5 },
                minigame: { type: 'bar_precision', triggerChance: 0.12, barSpeed: 1.9, zones: [ { from: 48, to: 52, quality: 'perfect', qualityBonus: 1.6, progressBonus: 6 }, { from: 40, to: 60, quality: 'good', qualityBonus: 1.1, progressBonus: 3 } ] }
            },
            { id: "assembly", name: "Сборка", progress: 30, requires: ["axehead", "handle"], workstation: 'workbench' }
        ]
    },
    reinforcedShield: {
        name: "Усиленный щит", icon: IMAGE_PATHS.ITEMS.REINFORCED_SHIELD, requiredSkill: 'blueprint_advancedTools', baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: true, blueprintId: 'blueprint_advancedTools_item',
        components: [
            {
                id: "base", name: "Основа", progress: 90, cost: { ironIngots: 8 }, workstation: 'anvil',
                baseStats: { defense: 15, durability: 20 },
                minigame: { type: 'bar_precision', triggerChance: 0.07, barSpeed: 1.7, zones: [ { from: 47, to: 53, quality: 'perfect', qualityBonus: 1.7, progressBonus: 6 }, { from: 38, to: 62, quality: 'good', qualityBonus: 1.0, progressBonus: 3 } ] }
            },
            {
                id: "iron_rim", name: "Железная окантовка", progress: 50, cost: { ironIngots: 5 }, workstation: 'anvil', requires: ["base"],
                baseStats: { durability: 15 },
                minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 1.6, zoneSize: { min: 20, max: 30 }, perfectZoneSize: { min: 6, max: 9 }, qualityBonus: 1.2, perfectQualityBonus: 1.7, progressBonus: 4, perfectProgressBonus: 8 }
            },
            {
                id: "boss", name: "Умбон", progress: 40, cost: { ironIngots: 3 }, workstation: 'anvil', requires: ["base"],
                baseStats: { defense: 10 },
                minigame: { type: 'click_points', triggerChance: 0.1, pointsCount: { min: 2, max: 3 }, pointLifetimeFactor: 0.8, qualityBonus: 1.5, progressBonus: 5, penalty: 0.1 }
            },
            { id: "assembly", name: "Сборка", progress: 25, requires: ["base", "iron_rim", "boss"], workstation: 'workbench' }
        ]
    },
    ironCrowbar: {
        name: 'Железный Лом', icon: IMAGE_PATHS.ITEMS.IRON_CROWBAR, requiredSkill: null, baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: false, blueprintId: 'sturdyVice_item',
        components: [
            { 
                id: 'shaping', name: "Формовка", progress: 30, cost: { ironIngots: 2 }, workstation: 'anvil',
                baseStats: { utility: 5, damage: 3 },
                minigame: { type: 'bar_precision', triggerChance: 0.1, barSpeed: 1.3, zones: [ { from: 45, to: 55, quality: 'perfect', qualityBonus: 1.3, progressBonus: 3 }, { from: 35, to: 65, quality: 'good', qualityBonus: 1.1, progressBonus: 1 } ] }
            },
            { 
                id: 'handle', name: "Рукоять", progress: 15, cost: { ironIngots: 1 }, workstation: 'workbench', requires: ["shaping"],
                baseStats: { handling: 2, durability: 4 },
                minigame: { type: 'hold_and_release', triggerChance: 0.15, releaseSpeed: 1.6, zoneSize: { min: 15, max: 25 }, perfectZoneSize: { min: 5, max: 10 }, qualityBonus: 1.0, perfectQualityBonus: 1.4, progressBonus: 2, perfectProgressBonus: 4 }
            }
        ]
    },
    ironVice: {
        name: 'Железные Тиски', icon: IMAGE_PATHS.ITEMS.IRON_VICE, requiredSkill: 'divisionOfLabor', baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: false, blueprintId: 'divisionOfLabor_item',
        components: [
            { 
                id: 'frame', name: "Основа", progress: 100, cost: { ironIngots: 8 }, workstation: 'anvil',
                baseStats: { durability: 20, utility: 10 },
                minigame: { type: 'bar_precision', triggerChance: 0.1, barSpeed: 1.8, zones: [ { from: 46, to: 54, quality: 'perfect', qualityBonus: 1.5, progressBonus: 5 }, { from: 38, to: 62, quality: 'good', qualityBonus: 1.1, progressBonus: 2 } ] }
            },
            { 
                id: 'screw', name: "Винтовой механизм", progress: 50, cost: { ironIngots: 4 }, workstation: 'workbench', requires: ["frame"],
                baseStats: { precision: 15 },
                minigame: { type: 'click_points', triggerChance: 0.1, pointsCount: { min: 4, max: 6 }, pointLifetimeFactor: 1.0, qualityBonus: 0.9, progressBonus: 3, penalty: 0.08 }
            },
            { id: 'assembly', name: "Сборка", progress: 30, requires: ["frame", "screw"], workstation: 'workbench' }
        ]
    },
    armorRepairKit: {
        name: 'Комплект для Ремонта Брони', icon: IMAGE_PATHS.ITEMS.ARMOR_REPAIR_KIT, requiredSkill: 'blueprint_eliteArmor', baseIngot: 'ironIngots', baseIngotType: 'basic', hasInlaySlots: false, blueprintId: 'repairWorkshop_item',
        components: [
            { 
                id: 'plates', name: "Ремкомплектные пластины", progress: 80, cost: { ironIngots: 5, copperIngots: 3 }, workstation: 'anvil',
                baseStats: { repairValue: 20, durability: 10 },
                minigame: { type: 'bar_precision', triggerChance: 0.1, barSpeed: 1.7, zones: [ { from: 45, to: 55, quality: 'perfect', qualityBonus: 1.4, progressBonus: 4 }, { from: 35, to: 65, quality: 'good', qualityBonus: 1.1, progressBonus: 2 } ] }
            },
            { 
                id: 'tools', name: "Специальные инструменты", progress: 60, cost: { sparks: 200 }, workstation: 'grindstone',
                baseStats: { repairValue: 15, precision: 5 },
                minigame: { type: 'click_points', triggerChance: 0.15, pointsCount: { min: 3, max: 5 }, pointLifetimeFactor: 1.1, qualityBonus: 1.0, progressBonus: 2, penalty: 0.05 }
            },
            { 
                id: 'pouches', name: "Сумка для инструментов", progress: 40, cost: { matter: 50 }, workstation: 'workbench',
                baseStats: { utility: 10, capacity: 5 },
                minigame: { type: 'hold_and_release', triggerChance: 0.18, releaseSpeed: 1.9, zoneSize: { min: 15, max: 25 }, perfectZoneSize: { min: 4, max: 8 }, qualityBonus: 1.0, perfectQualityBonus: 1.3, progressBonus: 1, perfectProgressBonus: 3 }
            },
            { id: 'packing', name: "Упаковка", progress: 20, requires: ["plates", "tools", "pouches"], workstation: 'workbench' }
        ]
    },
};
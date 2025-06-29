// src/data/definitions/items/02_copper_bronze_age_items.js
import { IMAGE_PATHS } from '../../../constants/paths';

export const copperBronzeAgeItems = {
    copperBracelet: {
        name: 'Медный браслет', icon: IMAGE_PATHS.ITEMS.COPPER_BRACELET, requiredSkill: 'jewelryCrafting', baseIngot: 'copperIngots', baseIngotType: 'basic', hasInlaySlots: true, blueprintId: 'jewelryCrafting_item',
        components: [
             {
                  id: "shaping", name: "Формовка", progress: 50, cost: { copperIngots: 4 }, workstation: 'anvil',
                  baseStats: { appeal: 10, durability: 5 },
                  minigame: { type: 'bar_precision', triggerChance: 0.15, barSpeed: 1.4, zones: [ { from: 45, to: 55, quality: 'perfect', qualityBonus: 1.4, progressBonus: 4 }, { from: 35, to: 65, quality: 'good', qualityBonus: 1.1, progressBonus: 2 } ] }
             },
             {
                 id: "polishing", name: "Полировка", progress: 30, cost: { copperIngots: 2 }, workstation: 'grindstone', requires: ["shaping"],
                 baseStats: { appeal: 15 },
                 minigame: { type: 'hold_and_release', triggerChance: 0.18, releaseSpeed: 2.5, zoneSize: { min: 10, max: 20 }, perfectZoneSize: { min: 2, max: 5 }, qualityBonus: 1.2, perfectQualityBonus: 1.8, progressBonus: 3, perfectProgressBonus: 7 }
             }
        ]
    },
    copperAmulet: {
        name: "Медный амулет", icon: IMAGE_PATHS.ITEMS.COPPER_AMULET, requiredSkill: 'jewelryCrafting', baseIngot: 'copperIngots', baseIngotType: 'basic', hasInlaySlots: true, blueprintId: 'jewelryCrafting_item',
        components: [
            {
                id: "pendant", name: "Подвеска", progress: 70, cost: { copperIngots: 6 }, workstation: 'anvil',
                baseStats: { appeal: 20, durability: 8 },
                minigame: { type: 'bar_precision', triggerChance: 0.10, barSpeed: 1.5, zones: [ { from: 47, to: 53, quality: 'perfect', qualityBonus: 1.7, progressBonus: 6 }, { from: 38, to: 62, quality: 'good', qualityBonus: 1.0, progressBonus: 2.5 } ] }
            },
            {
                id: "chain", name: "Цепочка", progress: 40, cost: { copperIngots: 4 }, workstation: 'workbench', requires: ["pendant"],
                baseStats: { durability: 10 },
                minigame: { type: 'click_points', triggerChance: 0.15, pointsCount: { min: 5, max: 8 }, pointLifetimeFactor: 1.3, qualityBonus: 0.8, progressBonus: 2, penalty: 0.05 }
            }
        ]
    },
    bronzeShield: {
        name: 'Бронзовый щит', icon: IMAGE_PATHS.ITEMS.BRONZE_SHIELD, requiredSkill: 'artOfAlloys', baseIngot: 'bronzeIngots', baseIngotType: 'uncommon', hasInlaySlots: true, blueprintId: 'artOfAlloys_item',
        components: [
            {
                id: 'base', name: 'Основа щита', progress: 100, cost: { bronzeIngots: 3 }, workstation: 'anvil',
                baseStats: { defense: 20, durability: 25 },
                minigame: { type: 'bar_precision', triggerChance: 0.08, barSpeed: 1.8, zones: [ { from: 46, to: 54, quality: 'perfect', qualityBonus: 1.9, progressBonus: 7 }, { from: 36, to: 64, quality: 'good', qualityBonus: 1.1, progressBonus: 3.5 } ] }
            },
            {
                id: 'handle', name: 'Рукоять', progress: 30, cost: { ironIngots: 2 }, workstation: 'workbench',
                baseStats: { handling: 5, durability: 5 },
                minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 1.7, zoneSize: { min: 18, max: 25 }, perfectZoneSize: { min: 5, max: 8 }, qualityBonus: 1.1, perfectQualityBonus: 1.5, progressBonus: 2, perfectProgressBonus: 4 }
            },
            {
                id: 'edging', name: 'Окантовка', progress: 20, cost: { bronzeIngots: 1 }, workstation: 'anvil', requires: ['base'],
                baseStats: { durability: 10 },
                minigame: { type: 'click_points', triggerChance: 0.12, pointsCount: { min: 3, max: 4 }, pointLifetimeFactor: 1.0, qualityBonus: 1.0, progressBonus: 3, penalty: 0.06 }
            },
            { id: 'assembly', name: 'Сборка', progress: 15, requires: ['base', 'handle', 'edging'], workstation: 'workbench' }
        ]
    },
    bronzeSword: {
        name: "Бронзовый меч", icon: IMAGE_PATHS.ITEMS.BRONZE_SWORD, requiredSkill: 'artOfAlloys', baseIngot: 'bronzeIngots', baseIngotType: 'uncommon', hasInlaySlots: true, blueprintId: 'blueprint_fineWeapons_item',
         components: [
            {
                id: "blade", name: "Клинок", progress: 150, cost: { bronzeIngots: 8 }, workstation: 'anvil',
                baseStats: { damage: 20, sharpness: 15 },
                minigame: { type: 'bar_precision', triggerChance: 0.07, barSpeed: 1.9, zones: [ { from: 45, to: 55, quality: 'perfect', qualityBonus: 2.1, progressBonus: 9 }, { from: 35, to: 65, quality: 'good', qualityBonus: 1.3, progressBonus: 4.5 } ] }
            },
            {
                id: "guard", name: "Гарда", progress: 50, cost: { bronzeIngots: 3 }, workstation: 'anvil',
                baseStats: { defense: 5, durability: 8 },
                minigame: { type: 'click_points', triggerChance: 0.1, pointsCount: { min: 3, max: 5 }, pointLifetimeFactor: 0.9, qualityBonus: 0.9, progressBonus: 2, penalty: 0.07 }
            },
            {
                id: "hilt", name: "Эфес", progress: 40, cost: { ironIngots: 2 }, workstation: 'workbench',
                baseStats: { handling: 8, durability: 5 },
                minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 1.9, zoneSize: { min: 12, max: 20 }, perfectZoneSize: { min: 4, max: 7 }, qualityBonus: 1.2, perfectQualityBonus: 1.6, progressBonus: 3, perfectProgressBonus: 5 }
            },
            { id: "assembly", name: "Сборка", progress: 30, requires: ["blade", "guard", "hilt"], workstation: 'workbench' }
        ]
    },
    bronzeCuirass: {
        name: "Бронзовая кираса", icon: IMAGE_PATHS.ITEMS.BRONZE_CUIRASS, requiredSkill: 'blueprint_eliteArmor', baseIngot: 'bronzeIngots', baseIngotType: 'uncommon', hasInlaySlots: true, blueprintId: 'blueprint_eliteArmor_item',
        components: [
            {
                id: 'breastplate', name: "Нагрудник", progress: 250, cost: { bronzeIngots: 12 }, workstation: 'anvil',
                baseStats: { defense: 30, durability: 25 },
                minigame: { type: 'hold_and_release', triggerChance: 0.12, releaseSpeed: 1.8, zoneSize: { min: 12, max: 22 }, perfectZoneSize: { min: 3, max: 6 }, qualityBonus: 1.0, perfectQualityBonus: 1.6, progressBonus: 3, perfectProgressBonus: 6 }
            },
            {
                id: 'backplate', name: "Наспинник", progress: 200, cost: { bronzeIngots: 10 }, workstation: 'anvil',
                baseStats: { defense: 25, durability: 20 },
                minigame: { type: 'bar_precision', triggerChance: 0.1, barSpeed: 1.9, zones: [ { from: 44, to: 56, quality: 'perfect', qualityBonus: 1.8, progressBonus: 8 }, { from: 34, to: 66, quality: 'good', qualityBonus: 1.2, progressBonus: 4 } ] }
            },
            {
                id: 'straps', name: "Крепления", progress: 80, cost: { ironIngots: 5 }, workstation: 'workbench',
                baseStats: { durability: 10 },
                minigame: { type: 'click_points', triggerChance: 0.15, pointsCount: { min: 6, max: 9 }, pointLifetimeFactor: 1.2, qualityBonus: 0.8, progressBonus: 1, penalty: 0.05 }
            },
            { id: 'assembly', name: 'Сборка', progress: 50, requires: ['breastplate', 'backplate', 'straps'], workstation: 'workbench' }
        ]
    },
    bronzeGauntlets: {
        name: "Бронзовые перчатки", icon: IMAGE_PATHS.ITEMS.BRONZE_GAUNTLETS, requiredSkill: 'blueprint_eliteArmor', baseIngot: 'bronzeIngots', baseIngotType: 'uncommon', hasInlaySlots: true, blueprintId: 'blueprint_eliteArmor_item',
         components: [
            {
                id: 'plates', name: "Пластины", progress: 120, cost: { bronzeIngots: 6 }, workstation: 'anvil',
                baseStats: { defense: 8, durability: 10 },
                minigame: { type: 'bar_precision', triggerChance: 0.08, barSpeed: 1.8, zones: [ { from: 46, to: 54, quality: 'perfect', qualityBonus: 1.9, progressBonus: 7 }, { from: 36, to: 64, quality: 'good', qualityBonus: 1.1, progressBonus: 3.5 } ] }
            },
            {
                id: 'joints', name: "Суставы", progress: 100, cost: { copperIngots: 4 }, workstation: 'workbench',
                baseStats: { handling: 3, flexibility: 5 },
                minigame: { type: 'click_points', triggerChance: 0.12, pointsCount: { min: 7, max: 10 }, pointLifetimeFactor: 1.1, qualityBonus: 0.9, progressBonus: 2, penalty: 0.04 }
            },
            {
                id: 'lining', name: "Подкладка", progress: 50, cost: { sparks: 250 }, workstation: 'workbench',
                baseStats: { comfort: 8, durability: 3 },
                minigame: { type: 'hold_and_release', triggerChance: 0.15, releaseSpeed: 2.2, zoneSize: { min: 15, max: 25 }, perfectZoneSize: { min: 3, max: 6 }, qualityBonus: 1.0, perfectQualityBonus: 1.3, progressBonus: 2, perfectProgressBonus: 4 }
            },
            { id: 'assembly', name: 'Сборка', progress: 40, requires: ['plates', 'joints', 'lining'], workstation: 'workbench' }
        ]
    },
    bronzeHelmet: {
        name: "Бронзовый шлем", icon: IMAGE_PATHS.ITEMS.BRONZE_HELMET, requiredSkill: 'blueprint_eliteArmor', baseIngot: 'bronzeIngots', baseIngotType: 'uncommon', hasInlaySlots: true, blueprintId: 'blueprint_eliteArmor_item',
        components: [
            {
                id: "dome", name: "Купол", progress: 200, cost: { bronzeIngots: 8 }, workstation: 'anvil',
                baseStats: { defense: 18, durability: 22 },
                minigame: { type: 'bar_precision', triggerChance: 0.07, barSpeed: 1.9, zones: [ { from: 45, to: 55, quality: 'perfect', qualityBonus: 2.1, progressBonus: 9 }, { from: 35, to: 65, quality: 'good', qualityBonus: 1.3, progressBonus: 4.5 } ] }
            },
            {
                id: "cheek_guards", name: "Нащечники", progress: 80, cost: { bronzeIngots: 4 }, workstation: 'anvil', requires: ["dome"],
                baseStats: { defense: 10 },
                minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 2.0, zoneSize: { min: 14, max: 24 }, perfectZoneSize: { min: 4, max: 7 }, qualityBonus: 1.1, perfectQualityBonus: 1.5, progressBonus: 3, perfectProgressBonus: 6 }
            },
            {
                id: "padding", name: "Прочная подкладка", progress: 70, cost: { sparks: 200 }, workstation: 'workbench', requires: ["dome"],
                baseStats: { comfort: 10, durability: 5 },
                minigame: { type: 'click_points', triggerChance: 0.18, pointsCount: { min: 5, max: 8 }, pointLifetimeFactor: 1.2, qualityBonus: 0.8, progressBonus: 1, penalty: 0.03 }
            },
            { id: "assembly", name: "Сборка", progress: 40, requires: ["dome", "cheek_guards", "padding"], workstation: 'workbench' }
        ]
    },
    bronzeGreaves: {
      name: "Бронзовые поножи", icon: IMAGE_PATHS.ITEMS.BRONZE_GREAVES, requiredSkill: 'blueprint_eliteArmor', baseIngot: 'bronzeIngots', baseIngotType: 'uncommon', hasInlaySlots: true, blueprintId: 'blueprint_eliteArmor_item',
      components: [
          {
              id: "plates", name: "Фигурные пластины", progress: 220, cost: { bronzeIngots: 10 }, workstation: 'anvil',
              baseStats: { defense: 22, durability: 20 },
              minigame: { type: 'bar_precision', triggerChance: 0.06, barSpeed: 2.0, zones: [ { from: 44, to: 56, quality: 'perfect', qualityBonus: 2.2, progressBonus: 10 }, { from: 34, to: 66, quality: 'good', qualityBonus: 1.4, progressBonus: 5 } ] }
          },
          {
              id: "straps", name: "Кожаные ремни", progress: 60, cost: { sparks: 250 }, workstation: 'workbench', requires: ["plates"],
              baseStats: { durability: 8 },
              minigame: { type: 'click_points', triggerChance: 0.16, pointsCount: { min: 6, max: 8 }, pointLifetimeFactor: 1.1, qualityBonus: 0.7, progressBonus: 1, penalty: 0.04 }
          },
          { id: "assembly", name: "Сборка", progress: 50, requires: ["plates", "straps"], workstation: 'workbench' }
      ]
    },
    copperCauldron: {
        name: 'Медный Котелок', icon: IMAGE_PATHS.ITEMS.COPPER_CAULDRON, requiredSkill: 'findCopper', baseIngot: 'copperIngots', baseIngotType: 'basic', hasInlaySlots: false, blueprintId: 'findCopper_item',
        components: [
            {
                id: 'body', name: "Корпус", progress: 80, cost: { copperIngots: 6 }, workstation: 'anvil',
                baseStats: { capacity: 15, durability: 10 },
                minigame: { type: 'bar_precision', triggerChance: 0.1, barSpeed: 1.6, zones: [ { from: 46, to: 54, quality: 'perfect', qualityBonus: 1.8, progressBonus: 6 }, { from: 38, to: 62, quality: 'good', qualityBonus: 1.0, progressBonus: 3 } ] }
            },
            { 
                id: 'handle', name: "Ручка", progress: 30, cost: { copperIngots: 2 }, workstation: 'workbench', requires: ["body"],
                baseStats: { handling: 5, durability: 5 },
                minigame: { type: 'hold_and_release', triggerChance: 0.15, releaseSpeed: 1.7, zoneSize: { min: 20, max: 28 }, perfectZoneSize: { min: 6, max: 10 }, qualityBonus: 1.1, perfectQualityBonus: 1.4, progressBonus: 2, perfectProgressBonus: 4 }
            }
        ]
    },
    bronzeGreataxe: {
        name: 'Бронзовая Секира', icon: IMAGE_PATHS.ITEMS.BRONZE_GREATAXE, requiredSkill: 'blueprint_fineWeapons', baseIngot: 'bronzeIngots', baseIngotType: 'uncommon', hasInlaySlots: true, blueprintId: 'blueprint_fineWeapons_item',
        components: [
            {
                id: 'axehead', name: "Лезвие секиры", progress: 180, cost: { bronzeIngots: 10 }, workstation: 'anvil',
                baseStats: { damage: 30, armorPenetration: 8 },
                minigame: { type: 'click_points', triggerChance: 0.12, pointsCount: { min: 4, max: 7 }, pointLifetimeFactor: 0.9, qualityBonus: 0.9, progressBonus: 2, penalty: 0.08 }
            },
            { 
                id: 'haft', name: "Древко", progress: 60, cost: { ironIngots: 5 }, workstation: 'workbench',
                baseStats: { durability: 18, handling: -8 },
                minigame: { type: 'hold_and_release', triggerChance: 0.1, releaseSpeed: 1.7, zoneSize: { min: 14, max: 22 }, perfectZoneSize: { min: 4, max: 7 }, qualityBonus: 1.1, perfectQualityBonus: 1.6, progressBonus: 3, perfectProgressBonus: 6 }
            },
            { 
                id: 'sharpening', name: "Заточка", progress: 70, cost: { sparks: 200 }, workstation: 'grindstone', requires: ["axehead"],
                baseStats: { sharpness: 12, damage: 8 },
                minigame: { type: 'bar_precision', triggerChance: 0.1, barSpeed: 2.1, zones: [ { from: 47, to: 53, quality: 'perfect', qualityBonus: 1.7, progressBonus: 7 }, { from: 39, to: 61, quality: 'good', qualityBonus: 1.2, progressBonus: 3 } ] }
            },
            { id: 'assembly', name: "Сборка", progress: 40, requires: ["axehead", "haft"], workstation: 'workbench' }
        ]
    },
    copperChain: {
        name: 'Медная Цепь', icon: IMAGE_PATHS.ITEMS.COPPER_CHAIN, requiredSkill: 'findCopper', baseIngot: 'copperIngots', baseIngotType: 'basic', hasInlaySlots: false, blueprintId: 'chainWeaving_item',
        components: [
            { 
                id: 'links', name: "Плетение звеньев", progress: 60, cost: { copperIngots: 5 }, workstation: 'workbench',
                baseStats: { durability: 12, utility: 5 },
                minigame: { type: 'click_points', triggerChance: 0.18, pointsCount: { min: 10, max: 15 }, pointLifetimeFactor: 1.0, qualityBonus: 0.8, progressBonus: 1, penalty: 0.04 }
            },
            { 
                id: 'fastener', name: "Застежка", progress: 20, cost: { copperIngots: 1 }, workstation: 'anvil', requires: ["links"],
                baseStats: { utility: 8 },
                minigame: { type: 'bar_precision', triggerChance: 0.2, barSpeed: 1.5, zones: [ { from: 48, to: 52, quality: 'perfect', qualityBonus: 1.5, progressBonus: 3 }, { from: 40, to: 60, quality: 'good', qualityBonus: 1.1, progressBonus: 1 } ] }
            }
        ]
    },
    bronzeHammer: {
        name: 'Бронзовый Молот', icon: IMAGE_PATHS.ITEMS.BRONZE_HAMMER, requiredSkill: 'artOfAlloys', baseIngot: 'bronzeIngots', baseIngotType: 'uncommon', hasInlaySlots: true, blueprintId: 'artOfAlloys_item',
        components: [
            {
                id: 'head', name: "Боек", progress: 100, cost: { bronzeIngots: 5 }, workstation: 'anvil',
                baseStats: { damage: 18, durability: 15 },
                minigame: { type: 'bar_precision', triggerChance: 0.1, barSpeed: 1.8, zones: [ { from: 47, to: 53, quality: 'perfect', qualityBonus: 2.0, progressBonus: 8 }, { from: 38, to: 62, quality: 'good', qualityBonus: 1.2, progressBonus: 4 } ] }
            },
            { 
                id: 'handle', name: "Рукоять", progress: 40, cost: { ironIngots: 3 }, workstation: 'workbench',
                baseStats: { handling: 5, durability: 10 },
                minigame: { type: 'hold_and_release', triggerChance: 0.12, releaseSpeed: 1.6, zoneSize: { min: 15, max: 25 }, perfectZoneSize: { min: 4, max: 8 }, qualityBonus: 1.1, perfectQualityBonus: 1.4, progressBonus: 2, perfectProgressBonus: 5 }
            },
            { id: 'assembly', name: "Сборка", progress: 20, requires: ["head", "handle"], workstation: 'workbench' }
        ]
    },
};
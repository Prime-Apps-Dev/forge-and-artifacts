// src/data/definitions/item-parts/07_player_equipment.js
import { IMAGE_PATHS } from '../../../constants/paths';

export const playerEquipment = {
    masterBlacksmithHammer: {
        name: "Молот Мастера-Кузнеца",
        icon: IMAGE_PATHS.ITEMS.BRONZE_HAMMER, // Оригинальная иконка молота
        purpose: 'player', 
        equipSlot: 'tool', 
        maxLevel: 5,
        bonuses: { 
            progressPerClick: 2,
        },
        bonusesPerLevel: { 
            progressPerClick: 1,
            critChance: 0.005, 
        },
        upgradeCosts: [ 
            { sparks: 10000, bronzeIngots: 50 },
            { sparks: 25000, sparksteelIngots: 25 },
            { sparks: 50000, mithrilIngots: 15, matter: 1000 },
            { sparks: 100000, adamantiteIngots: 10, matter: 2500 },
        ],
        requiredSkill: 'artOfAlloys', 
        baseIngot: 'bronzeIngots',
        baseIngotType: 'uncommon',
        hasInlaySlots: false,
        components: [
            { id: "head", name: "Тяжелый боек", progress: 500, cost: { bronzeIngots: 20, ironIngots: 40 }, workstation: 'anvil' },
            { id: "handle", name: "Эргономичная рукоять", progress: 250, cost: { sparks: 5000 }, workstation: 'workbench' },
            { id: "assembly", name: "Сборка", progress: 100, requires: ["head", "handle"], workstation: 'workbench' }
        ]
    },
    sturdyApron: {
        name: "Прочный Фартук",
        icon: IMAGE_PATHS.ITEMS.BRONZE_CUIRASS, // Иконка кирасы, символизирующая прочную защиту
        purpose: 'player',
        equipSlot: 'gear', 
        maxLevel: 5,
        bonuses: {
            critBonus: 0.5,
        },
        bonusesPerLevel: {
            critBonus: 0.25,
            componentCostReduction: 0.2, 
        },
        upgradeCosts: [
            { sparks: 8000, copperIngots: 100 },
            { sparks: 20000, bronzeIngots: 75 },
            { sparks: 45000, sparksteelIngots: 40, matter: 800 },
            { sparks: 90000, mithrilIngots: 30, matter: 2000 },
        ],
        requiredSkill: 'findCopper',
        baseIngot: 'copperIngots',
        baseIngotType: 'basic',
        hasInlaySlots: false,
        components: [
            { id: "leather_parts", name: "Кожаные элементы", progress: 300, cost: { sparks: 2000 }, workstation: 'workbench' },
            { id: "metal_plates", name: "Укрепляющие пластины", progress: 400, cost: { copperIngots: 50 }, workstation: 'anvil' },
            { id: "straps", name: "Ремни и застежки", progress: 150, cost: { ironIngots: 20 }, workstation: 'workbench' }
        ]
    },
};
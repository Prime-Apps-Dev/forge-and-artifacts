// src/data/definitions/item-parts/06_personnel_equipment.js
import { IMAGE_PATHS } from '../../../constants/paths';

export const personnelEquipment = {
    minersPickaxe: {
        name: "Кирка шахтёра",
        icon: IMAGE_PATHS.ITEMS.TWO_HANDED_AXE, // ЗАГЛУШКА
        purpose: 'personnel', // Указывает, что это предмет для персонала
        targetRole: 'miner', // Для какой роли предназначен
        equipSlot: 'tool', // В какой слот экипируется
        maxLevel: 3,
        bonuses: { // Бонусы 1-го уровня
            miningSpeed: 0.01,
        },
        bonusesPerLevel: { // Прибавка за каждый уровень, начиная со 2-го
            miningSpeed: 0.015,
        },
        upgradeCosts: [ // Стоимость улучшения до уровня 2, 3
            { sparks: 1000, ironIngots: 50 },
            { sparks: 5000, bronzeIngots: 25 },
        ],
        // Стандартные поля для крафта
        requiredSkill: 'apprenticeship', 
        baseIngot: 'ironIngots',
        baseIngotType: 'basic',
        hasInlaySlots: false,
        components: [
            { id: "head", name: "Наконечник", progress: 100, cost: { ironIngots: 10 }, workstation: 'anvil' },
            { id: "handle", name: "Рукоять", progress: 50, cost: { ironIngots: 5 }, workstation: 'workbench' },
            { id: "assembly", name: "Сборка", progress: 20, requires: ["head", "handle"], workstation: 'workbench' }
        ]
    },
    tradersLedger: {
        name: "Счётная книга торговца",
        icon: IMAGE_PATHS.ITEMS.SPARKSTEEL_TOOLSET, // ЗАГЛУШКА
        purpose: 'personnel',
        targetRole: 'trader',
        equipSlot: 'tool',
        maxLevel: 3,
        bonuses: {
            salesSpeedModifier: 0.05,
        },
        bonusesPerLevel: {
            salesSpeedModifier: 0.05,
            tipChanceModifier: 0.01,
        },
        upgradeCosts: [
            { sparks: 2000, copperIngots: 30 },
            { sparks: 8000, bronzeIngots: 40, matter: 100 },
        ],
        requiredSkill: 'unlockTrader',
        baseIngot: 'copperIngots',
        baseIngotType: 'basic',
        hasInlaySlots: false,
        components: [
            { id: "binding", name: "Переплёт", progress: 120, cost: { sparks: 500 }, workstation: 'workbench' },
            { id: "paper", name: "Страницы", progress: 80, cost: { matter: 50 }, workstation: 'workbench' }
        ]
    }
};
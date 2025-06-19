// src/data/definitions/upgrades.js

export const upgrades = {
    hammerHandle: { name: "Улучшенная рукоять молота", description: "Позволяет бить сильнее. Увеличивает прогресс за клик на 1.", cost: { sparks: 100, ironIngots: 5 }, apply: (state) => { state.progressPerClick += 1; } }, // ИЗМЕНЕНО
    goodGloves: { name: "Хорошие рукавицы", description: "Удобный хват дает 10% шанс нанести 'критический удар' (+2 к прогрессу).", cost: { sparks: 250, copperIngots: 10 }, apply: (state) => { state.critChance += 0.10; } }, // ИЗМЕНЕНО
    matterCostReduction: {
        id: 'matterCostReduction',
        name: "Снижение стоимости Материи",
        description: "Навыки требуют меньше Материи для изучения (-5% за уровень).",
        isMultiLevel: true,
        maxLevel: 5,
        baseCost: { sparks: 1000, matter: 50 }, // ИЗМЕНЕНО
        costIncrease: 2.0,
        apply: (state) => { state.matterCostReduction = (state.matterCostReduction || 0) + 0.05; }
    },
    tradeSpeed: {
        id: 'tradeSpeed',
        name: "Скорость торговли",
        description: "Ваши караваны двигаются быстрее. Ускоряет мировые торговые события.",
        isMultiLevel: true,
        maxLevel: 5,
        baseCost: { sparks: 1500, copperIngots: 20 }, // ИЗМЕНЕНО
        costIncrease: 2.0,
        apply: (state) => { state.marketTradeSpeedModifier = (state.marketTradeSpeedModifier || 1.0) + 0.1; }
    },
    improvedAnvil: {
        id: 'improvedAnvil',
        name: 'Улучшенная Наковальня',
        description: 'Местные рудокопы делятся секретами обработки железа. +10% к прогрессу на наковальне.',
        cost: { sparks: 5000, ironIngots: 100 }, // ИЗМЕНЕНО
        region: 'iron_hills',
        apply: (state) => { state.workstationBonus.anvil += 0.1; }
    },
    gemPolisher: {
        id: 'gemPolisher',
        name: 'Ювелирная полироль',
        description: 'Местные ювелиры знают толк в блеске. Увеличивает шанс на "чаевые" при продаже на 5%.',
        cost: { matter: 2000, gem: 1 }, // ИЗМЕНЕНО
        region: 'golden_harbor',
        apply: (state) => { /* Логика в handleSaleCompletion */ }
    }
};
// src/data/definitions/upgrades.js

export const upgrades = {
    hammerHandle: { name: "Улучшенная рукоять молота", description: "Позволяет бить сильнее. Увеличивает прогресс за клик на 1.", cost: { sparks: 100, ironIngots: 5 }, apply: (state) => { state.progressPerClick += 1; } },
    goodGloves: { name: "Хорошие рукавицы", description: "Удобный хват дает 10% шанс нанести 'критический удар' (+2 к прогрессу).", cost: { sparks: 250, copperIngots: 10 }, apply: (state) => { state.critChance += 0.10; } },
    matterCostReduction: {
        id: 'matterCostReduction',
        name: "Снижение стоимости Материи",
        description: "Навыки требуют меньше Материи для изучения (-5% за уровень).",
        isMultiLevel: true,
        maxLevel: 5,
        baseCost: { sparks: 1000, matter: 50 },
        costIncrease: 2.0,
        apply: (state) => { state.matterCostReduction = (state.matterCostReduction || 0) + 0.05; }
    },
    improvedAnvil: {
        id: 'improvedAnvil',
        name: 'Улучшенная Наковальня',
        description: 'Местные рудокопы делятся секретами обработки железа. +10% к прогрессу на наковальне.',
        cost: { sparks: 5000, ironIngots: 100 },
        region: 'iron_hills',
        apply: (state) => { state.workstationBonus.anvil += 0.1; }
    },
    gemPolisher: {
        id: 'gemPolisher',
        name: 'Ювелирная полироль',
        description: 'Местные ювелиры знают толк в блеске. Увеличивает шанс на "чаевые" при продаже на 5%.',
        cost: { matter: 2000, gem: 1 },
        region: 'golden_harbor',
        apply: (state) => { state.tipChance = (state.tipChance || 0) + 0.05; }
    },
    // --- НОВЫЕ УЛУЧШЕНИЯ (ТЗ 5.1) ---
    hardenedHands: {
        id: 'hardenedHands',
        name: "Закалённые Руки",
        description: "+5% к скорости крафта всех предметов.",
        cost: { sparks: 1500, matter: 20 },
        apply: (state) => { state.craftingSpeedModifiers.all += 0.05; }
    },
    geologyKnowledge: {
        id: 'geologyKnowledge',
        name: "Знание Геологии",
        description: "+10% к шансу найти дополнительную медную руду.",
        cost: { sparks: 2200, copperOre: 100 },
        requiredSkill: 'findCopper',
        apply: (state) => { state.bonusCopperChance = (state.bonusCopperChance || 0) + 0.1; } // Логика будет в handleMineOre
    },
    sharpEye: {
        id: 'sharpEye',
        name: "Острый Глаз",
        description: "-5% к скорости ползунка в мини-игре 'Нажми вовремя'.",
        isMultiLevel: true,
        maxLevel: 5,
        baseCost: { sparks: 3000, copperIngots: 50 },
        costIncrease: 1.8,
        apply: (state) => { state.minigameBarSpeedModifier -= 0.05; }
    },
    improvedHammerHead: {
        id: 'improvedHammerHead',
        name: "Улучшенная головка молота",
        description: "+2% к скорости крафта всех предметов.",
        cost: { sparks: 1800 },
        apply: (state) => { state.craftingSpeedModifiers.all += 0.02; }
    },
    ironHammer: {
        id: 'ironHammer',
        name: "Железный молот",
        description: "+3% к скорости крафта предметов из железа.",
        cost: { sparks: 2500, ironIngots: 80 },
        apply: (state) => { state.craftingSpeedModifiers.iron += 0.03; }
    },
    copperSledgehammer: {
        id: 'copperSledgehammer',
        name: "Медная кувалда",
        description: "+2,5% к скорости крафта предметов из меди.",
        cost: { sparks: 3500, copperIngots: 60 },
        requiredSkill: 'findCopper',
        apply: (state) => { state.craftingSpeedModifiers.copper += 0.025; }
    },
    bronzeWorkingBook: {
        id: 'bronzeWorkingBook',
        name: "Книга о работе с Бронзой",
        description: "+1% к скорости крафта предметов из бронзы.",
        cost: { sparks: 4500, bronzeIngots: 40 },
        requiredSkill: 'artOfAlloys',
        apply: (state) => { state.craftingSpeedModifiers.bronze += 0.01; }
    },
    speedMining: {
        id: 'speedMining',
        name: "Скоростная добыча",
        description: "Позволяет использовать мультитач для ускорения добычи/ковки.",
        cost: { sparks: 5000, copperIngots: 150 },
        requiredSkill: 'findCopper',
        apply: (state) => { state.multitouchEnabled = true; } // Логика будет в обработчиках кликов
    },
};
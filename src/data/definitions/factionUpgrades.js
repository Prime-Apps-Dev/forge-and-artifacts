// src/data/definitions/factionUpgrades.js

export const factionUpgrades = {
    guildInvestment1: {
        id: 'guildInvestment1',
        name: 'Инвестиции в шахту',
        description: 'Ваши вложения в оборудование для шахт Гильдии увеличивают эффективность добычи всей руды на 10%.',
        factionId: 'merchants',
        requiredRep: 'respect',
        cost: { sparks: 5000, ironIngots: 50 },
        apply: (state) => { state.passiveIncomeModifier += 0.1; }
    },
    advancedLogistics: {
        id: 'advancedLogistics',
        name: 'Продвинутая логистика',
        description: 'Оптимизация торговых путей Гильдии. Все товары на рынке становятся для вас на 5% дешевле при покупке.',
        factionId: 'merchants',
        requiredRep: 'honor',
        cost: { sparks: 12000, copperIngots: 30 },
        apply: (state) => { state.marketBuyModifier = (state.marketBuyModifier || 1) * 0.95; }
    },

    royalAnvil: {
        id: 'royalAnvil',
        name: 'Королевская наковальня',
        description: 'Дворцовые кузнецы делятся с вами секретами закалки. Прогресс работы на Наковальне увеличивается на 15%.',
        factionId: 'court',
        requiredRep: 'respect',
        cost: { matter: 500, bronzeIngots: 10 },
        apply: (state) => { state.workstationBonus.anvil = (state.workstationBonus.anvil || 1) + 0.15; }
    },
    noblePatronage: {
        id: 'noblePatronage',
        name: 'Дворянское покровительство',
        description: 'Ваше имя на слуху у знати. Репутация, получаемая от заказов для Королевского Двора, увеличивается на 20%.',
        factionId: 'court',
        requiredRep: 'honor',
        cost: { matter: 1200, sparks: 10000 },
        apply: (state) => { state.reputationGainModifier.court = (state.reputationGainModifier.court || 1) + 0.2; }
    },

    exoticGrindstone: {
        id: 'exoticGrindstone',
        name: 'Экзотическое точило',
        description: 'Авантюристы привозят вам редкие абразивы. Прогресс работы на Точильном станке увеличивается на 15%.',
        factionId: 'adventurers',
        requiredRep: 'respect',
        cost: { sparks: 7500, copperIngots: 25 },
        apply: (state) => { state.workstationBonus.grindstone = (state.workstationBonus.grindstone || 1) + 0.15; }
    },
    cartographersTools: {
        id: 'cartographersTools',
        name: 'Инструменты картографа',
        description: 'Лига делится с вами более качественными картами. Стоимость покупки Карт вылазок снижена на 25%.',
        factionId: 'adventurers',
        requiredRep: 'honor',
        cost: { matter: 1000, mithrilIngots: 5 },
        apply: (state) => { state.expeditionMapCostModifier = (state.expeditionMapCostModifier || 1) * 0.75; }
    },
};
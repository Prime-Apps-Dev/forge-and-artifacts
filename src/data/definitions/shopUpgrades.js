// src/data/definitions/shopUpgrades.js

export const shopUpgrades = {
    inventoryExpansion: {
        id: 'inventoryExpansion',
        name: "Расширение инвентаря",
        description: "Добавляет 2 дополнительные ячейки в инвентаре.",
        cost: { sparks: 2000, ironIngots: 50 }, // ИЗМЕНЕНО
        requiredShopReputation: 100,
        isMultiLevel: false,
        apply: (state) => { state.inventoryCapacity += 2; }
    },
    shopShelfExpansion: {
        id: 'shopShelfExpansion',
        name: "Дополнительная полка",
        description: "Добавляет 1 торговую полку в магазине.",
        cost: { sparks: 3000, copperIngots: 20 }, // ИЗМЕНЕНО
        requiredShopReputation: 250,
        isMultiLevel: false,
        apply: (state) => { state.shopShelves.push({ itemId: null, customer: null, saleProgress: 0, saleTimer: 0 }); }
    },
    fancyShopSign: {
        id: 'fancyShopSign',
        name: "Шикарная вывеска",
        description: "Привлекает больше элитных клиентов (+5% к наградам от всех заказов).",
        cost: { sparks: 5000, matter: 100 }, // ИЗМЕНЕНО
        requiredShopReputation: 500,
        isMultiLevel: false,
        apply: (state) => { state.sparksModifier += 0.05; state.matterModifier += 0.05; }
    },
    improvedDisplay: {
        id: 'improvedDisplay',
        name: "Улучшенная витрина",
        description: "Увеличивает скорость продажи предметов в магазине на 10%.",
        requiredShopReputation: 150,
        isMultiLevel: true,
        maxLevel: 3,
        baseCost: { matter: 500, bronzeIngots: 10 }, // ИЗМЕНЕНО
        costIncrease: 1.5,
        apply: (state) => { state.playerShopSalesSpeedModifier = (state.playerShopSalesSpeedModifier || 1.0) + 0.1; }
    }
};
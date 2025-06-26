// src/data/definitions/shopUpgrades.js

export const shopUpgrades = {
    inventoryExpansion: {
        id: 'inventoryExpansion',
        name: "Расширение инвентаря",
        description: "Добавляет 2 дополнительные ячейки в инвентаре.",
        cost: { sparks: 2000, ironIngots: 50 },
        requiredShopReputation: 100,
        isMultiLevel: false,
        apply: (state) => { state.inventoryCapacity += 2; }
    },
    shopShelfExpansion: {
        id: 'shopShelfExpansion',
        name: "Дополнительная полка",
        description: "Добавляет 1 торговую полку в магазине.",
        cost: { sparks: 3000, copperIngots: 20 },
        requiredShopReputation: 250,
        isMultiLevel: false,
        apply: (state) => { state.shopShelves.push({ itemId: null, customer: null, saleProgress: 0, saleTimer: 0 }); }
    },
    fancyShopSign: {
        id: 'fancyShopSign',
        name: "Шикарная вывеска",
        description: "Привлекает больше элитных клиентов (+5% к наградам от всех заказов).",
        cost: { sparks: 5000, matter: 100 },
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
        baseCost: { matter: 500, bronzeIngots: 10 },
        costIncrease: 1.5,
        apply: (state) => { state.playerShopSalesSpeedModifier = (state.playerShopSalesSpeedModifier || 1.0) + 0.1; }
    },
    personnelSlotExpansion: {
        id: 'personnelSlotExpansion',
        name: "Расширение штата",
        description: "Добавляет 1 дополнительный слот для найма любого сотрудника.",
        requiredShopReputation: 200,
        isMultiLevel: true,
        maxLevel: 8,
        baseCost: { sparks: 5000, bronzeIngots: 15, matter: 100 },
        costIncrease: 1.9,
    },
    personnelOffice: {
        id: 'personnelOffice',
        name: "Офис найма",
        description: "Снижает стоимость реролла предложений персонала на 10% за уровень.",
        cost: { sparks: 5000, bronzeIngots: 50, matter: 150 },
        requiredShopReputation: 400,
        isMultiLevel: true,
        maxLevel: 5,
        baseCost: { sparks: 5000, bronzeIngots: 50, matter: 150 },
        costIncrease: 2.0,
        apply: (state) => { state.personnelRollCostReduction = (state.personnelRollCostReduction || 0) + 0.1; }
    }
};
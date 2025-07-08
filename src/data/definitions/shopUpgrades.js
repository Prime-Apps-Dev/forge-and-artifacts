// src/data/definitions/shopUpgrades.js

export const shopUpgrades = {
    inventoryExpansion: {
        id: 'inventoryExpansion',
        name: "Расширение инвентаря",
        description: "Добавляет 2 дополнительные ячейки в инвентаре за уровень.",
        requiredShopReputation: 100,
        isMultiLevel: true,
        maxLevel: 6, // 6 уровней * 2 ячейки = +12 ячеек
        baseCost: { sparks: 2000, ironIngots: 50 },
        costIncrease: 1.7,
        apply: (state) => { state.inventoryCapacity += 2; }
    },
    shopShelfExpansion: {
        id: 'shopShelfExpansion',
        name: "Дополнительная полка",
        description: "Добавляет 1 торговую полку в магазине за уровень.",
        requiredShopReputation: 250,
        isMultiLevel: true,
        maxLevel: 8, // 8 уровней * 1 полка = +8 полок
        baseCost: { sparks: 3000, copperIngots: 20 },
        costIncrease: 2.0,
        apply: (state) => { state.shopShelves.push({ id: `shelf_${Date.now()}_${Math.random()}`, itemId: null, customer: null, saleProgress: 0, saleTimer: 0, marketPrice: 0, userPrice: 0 }); }
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
        requiredShopReputation: 400,
        isMultiLevel: true,
        maxLevel: 5,
        baseCost: { sparks: 5000, bronzeIngots: 50, matter: 150 },
        costIncrease: 2.0,
        apply: (state) => { state.personnelRollCostReduction = (state.personnelRollCostReduction || 0) + 0.1; }
    },
    eloquence: {
        id: 'eloquence',
        name: "Красноречие",
        description: "Увеличивает скорость продажи на 5% за уровень и позволяет комфортно продавать более качественные товары.",
        requiredShopReputation: 300,
        isMultiLevel: true,
        maxLevel: 10,
        baseCost: { sparks: 4000, matter: 75 },
        costIncrease: 1.6,
        apply: (state) => {
            state.playerShopSalesSpeedModifier += 0.05;
            state.maxComfortableQuality = (state.maxComfortableQuality || 1.2) + 0.2;
        }
    },
    patientCustomer: {
        id: 'patientCustomer',
        name: "Терпеливый клиент",
        description: "Увеличивает время ожидания клиента на 10% за уровень.",
        requiredShopReputation: 200,
        isMultiLevel: true,
        maxLevel: 5,
        baseCost: { sparks: 3500, copperIngots: 40 },
        costIncrease: 1.7,
        apply: (state) => { state.timeLimitModifier += 0.1; }
    },
    guildLicense: {
        id: 'guildLicense',
        name: "Лицензия гильдии",
        description: "Дает доступ к Доске объявлений с особыми и выгодными заказами.",
        cost: { sparks: 10000, bronzeIngots: 50 },
        requiredShopReputation: 600,
        isMultiLevel: false,
        apply: (state) => { state.unlockedFeatures = { ...(state.unlockedFeatures || {}), bulletinBoard: true }; }
    },
    generousTippers: {
        id: 'generousTippers',
        name: "Щедрые Клиенты",
        description: "Увеличивает максимальный размер чаевых в Материи на 5 за уровень.",
        requiredShopReputation: 800,
        isMultiLevel: true,
        maxLevel: 4,
        baseCost: { sparks: 12000, matter: 250 },
        costIncrease: 2.2,
        apply: (state) => { state.maxMatterTip = (state.maxMatterTip || 10) + 5; }
    }
};
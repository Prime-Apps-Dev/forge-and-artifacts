// src/data/definitions/shopLevels.js

export const shopLevels = [
    {
        level: 1,
        requiredXP: 100, // XP для достижения следующего уровня
        name: "Лавочник-Новичок",
        description: "Основы торгового дела. Никаких особых бонусов пока.",
        reward: null
    },
    {
        level: 2,
        requiredXP: 500,
        name: "Местный Торговец",
        description: "Ваш магазин начинает привлекать больше клиентов. +5% к скорости продажи товаров.",
        reward: {
            id: 'shop_lvl_2_reward',
            apply: (state) => { state.playerShopSalesSpeedModifier += 0.05; }
        }
    },
    {
        level: 3,
        requiredXP: 2000,
        name: "Уважаемый Торговец",
        description: "Ваши цены становятся более конкурентоспособными. -2% к стоимости покупки ресурсов на рынке.",
        reward: {
            id: 'shop_lvl_3_reward',
            apply: (state) => { state.marketBuyModifier = (state.marketBuyModifier || 1) * 0.98; }
        }
    },
    {
        level: 4,
        requiredXP: 5000,
        name: "Магнат Торговли",
        description: "Ваши караваны движутся быстрее. Мировые торговые события ускоряются на 10%.",
        reward: {
            id: 'shop_lvl_4_reward',
            apply: (state) => { state.marketTradeSpeedModifier = (state.marketTradeSpeedModifier || 1.0) + 0.1; }
        }
    },
    {
        level: 5,
        requiredXP: 10000,
        name: "Имперский Купец",
        description: "Ваш инвентарь может вместить больше товаров. +2 ячейки инвентаря.",
        reward: {
            id: 'shop_lvl_5_reward',
            apply: (state) => { state.inventoryCapacity += 2; }
        }
    },
    // Добавьте больше уровней и наград по мере необходимости
];
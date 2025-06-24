// src/data/definitions/masteryLevelRewards.js

export const masteryLevelRewards = [
    {
        id: 'mastery_reward_1',
        level: 2,
        name: 'Новое начало',
        description: 'Ваш путь начинается. Получите базовые ресурсы для комфортного старта.',
        icon: 'stars',
        reward: {
            sparks: 1000,
            ironOre: 50,
            matter: 5
        }
    },
    {
        id: 'mastery_reward_2',
        level: 5,
        name: 'Первые шаги',
        description: 'Вы освоили азы. Увеличьте свою эффективность.',
        icon: 'handyman',
        reward: {
            passiveIncomeModifier: 0.02, // +2% к эффективности подмастерьев
            sparks: 2000
        }
    },
    {
        id: 'mastery_reward_3',
        level: 10,
        name: 'Закалка мастера',
        description: 'Каждый удар теперь мощнее. Увеличение прогресса за клик.',
        icon: 'hardware',
        reward: {
            progressPerClick: 1, // +1 к прогрессу за клик
            matter: 10
        }
    },
    {
        id: 'mastery_reward_4',
        level: 15,
        name: 'Глубокие знания',
        description: 'Ваши исследования приносят плоды. Снижение стоимости Материи для навыков.',
        icon: 'bubble_chart',
        reward: {
            matterCostReduction: 0.02, // -2% к стоимости Материи
            sparks: 5000
        }
    },
    {
        id: 'mastery_reward_5',
        level: 20,
        name: 'Признание Гильдий',
        description: 'Ваша репутация растет. Дополнительный прирост репутации со всеми фракциями.',
        icon: 'gavel',
        reward: {
            reputationGainModifier: { merchants: 0.01, adventurers: 0.01, court: 0.01 }, // +1% ко всем фракциям
            sparks: 7500
        }
    },
    {
        id: 'mastery_reward_6',
        level: 25,
        name: 'Ускорение ремесла',
        description: 'Ваша работа становится быстрее. Увеличение скорости плавки и ковки сплавов.',
        icon: 'speed',
        reward: {
            smeltingSpeedModifier: 0.02, // +2% к скорости плавки
            matter: 25
        }
    },
    {
        id: 'mastery_reward_7',
        level: 30,
        name: 'Богатство земли',
        description: 'Вы научились извлекать больше ресурсов. Увеличение добычи руды за клик.',
        icon: 'terrain',
        reward: {
            orePerClick: 1, // +1 к добыче руды за клик
            sparks: 10000
        }
    },
    {
        id: 'mastery_reward_8',
        level: 35,
        name: 'Искусный ювелир',
        description: 'Ваши изделия становятся изящнее. Увеличение шанса крит. удара.',
        icon: 'diamond',
        reward: {
            critChance: 0.01, // +1% к шансу крита
            matter: 50
        }
    },
    {
        id: 'mastery_reward_9',
        level: 40,
        name: 'Торговый путь',
        description: 'Ваши караваны движутся быстрее. Ускорение мировых торговых событий.',
        icon: 'storefront',
        reward: {
            marketTradeSpeedModifier: 0.02, // +2% к скорости торговых событий
            sparks: 15000
        }
    },
    {
        id: 'mastery_reward_10',
        level: 45,
        name: 'Покровительство Авантюристов',
        description: 'Карты вылазок становятся доступнее. Снижение стоимости покупки Карт вылазок.',
        icon: 'map',
        reward: {
            expeditionMapCostModifier: 0.02, // -2% к стоимости карт вылазок
            matter: 75
        }
    },
    {
        id: 'mastery_reward_11',
        level: 50,
        name: 'Легендарный кузнец',
        description: 'Ваше имя звучит в легендах. Значительное увеличение XP за все действия.',
        icon: 'auto_awesome',
        reward: {
            masteryXpModifier: 0.05, // +5% к XP за все действия
            sparks: 20000
        }
    },
    // Дополнительные уровни для "долгого" прогресса
    { id: 'mastery_reward_12', level: 60, name: 'Секреты мастерства I', description: 'Небольшой бонус к прогрессу за клик и снижение стоимости компонентов.', icon: 'build', reward: { progressPerClick: 0.5, componentCostReduction: 0.25 } },
    { id: 'mastery_reward_13', level: 70, name: 'Энергетический поток I', description: 'Увеличение пассивной генерации искр и материи.', icon: 'bolt', reward: { passiveGeneration: { sparks: 0.05, matter: 0.005 } } },
    { id: 'mastery_reward_14', level: 80, name: 'Критическое преимущество I', description: 'Увеличение шанса и бонуса критического удара.', icon: 'star_half', reward: { critChance: 0.005, critBonus: 0.5 } },
    { id: 'mastery_reward_15', level: 90, name: 'Торговое влияние I', description: 'Снижение цен на покупку и увеличение на продажу на рынке.', icon: 'storefront', reward: { marketBuyModifier: 0.005, playerShopSalesSpeedModifier: 0.005 } },
    { id: 'mastery_reward_16', level: 100, name: 'Грандмастер', description: 'Вершина мастерства! Значительные универсальные бонусы.', icon: 'emoji_events', reward: { sparksModifier: 0.05, matterModifier: 0.05, passiveIncomeModifier: 0.05, progressPerClick: 1 } },
];
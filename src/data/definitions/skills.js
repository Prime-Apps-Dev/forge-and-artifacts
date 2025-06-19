// src/data/definitions/skills.js

export const skills = {
    // ===========================================
    // --- Железный Век (Iron Age) ---
    // Требует: Искры, Материя, Железная Руда, Железные Слитки
    // ===========================================
    basicForging: { name: "Основы ковки", description: "Каждый удар по наковальне становится на 1 ед. эффективнее.", icon: "hardware", cost: { matter: 20, sparks: 50 }, requires: [], apply: (state) => { state.progressPerClick += 1; } },
    sturdyPickaxe: { name: "Крепкая кирка", description: "Каждый удар по железной жиле приносит +1 дополнительную руду.", icon: "construction", cost: { matter: 40, ironOre: 20 }, requires: ["basicForging"], apply: (state) => { state.orePerClick += 1; } },
    apprenticeship: { name: "Наставничество", description: "Увеличивает эффективность работы подмастерьев на 10%.", icon: "engineering", cost: { matter: 50, sparks: 200 }, requires: ["basicForging"], apply: (state) => { state.passiveIncomeModifier += 0.1; } },
    efficientBellows: { name: "Эффективные меха", description: "Уменьшает затраты руды на 2 при плавке железа.", icon: "fireplace", cost: { matter: 60, ironIngots: 10 }, requires: ["basicForging"], apply: (state) => {} },
    fastHands: { name: "Быстрые руки", description: "Увеличивает скорость обработки компонентов на 10%.", icon: "speed", cost: { matter: 80, sparks: 300 }, requires: ["sturdyPickaxe"], apply: (state) => { state.smeltingSpeedModifier += 0.1; } },
    betterTools: { name: "Улучшенные инструменты", description: "Позволяет создавать более сложные железные изделия.", icon: "gite", cost: { matter: 100, ironIngots: 15 }, requires: ["apprenticeship"], apply: (state) => {} },
    advancedClients: { name: "Продвинутые клиенты", description: "Открывает доступ к более прибыльным заказам от авантюристов.", icon: "explore", cost: { matter: 90, sparks: 400 }, requires: ["efficientBellows"], apply: (state) => {} },
    blueprint_basicArmor: { name: "Чертеж: Базовая броня", description: "Позволяет ковать простые элементы железной брони (шлем, поножи).", icon: "sports_martial_arts", cost: { matter: 150, ironIngots: 25 }, requires: ["fastHands", "betterTools"], apply: (state) => {} },
    enduranceTraining: { name: "Тренировка выносливости", description: "Повышает вашу выносливость, увеличивая прогресс за клик еще на 1.", icon: "fitness_center", cost: { matter: 120, sparks: 500 }, requires: ["betterTools", "advancedClients"], apply: (state) => { state.progressPerClick += 1; } },
    divisionOfLabor: { name: "Разделение труда", description: "Позволяет выбирать конкретный верстак для работы и открывает путь к узкой специализации.", icon: "groups", cost: { matter: 200, sparks: 800 }, requires: ["blueprint_basicArmor", "enduranceTraining"], apply: (state) => {} },
    hammerStrength: { name: "Сила Молота", description: "Увеличивает прогресс работы на Наковальне на 10%.", icon: "hardware", cost: { matter: 250, ironIngots: 50 }, requires: ["divisionOfLabor"], apply: (state) => { state.workstationBonus.anvil += 0.1; } },
    preciseTools: { name: "Точные Инструменты", description: "Увеличивает прогресс работы на Верстаке на 10%.", icon: "handyman", cost: { matter: 250, sparks: 1000 }, requires: ["divisionOfLabor"], apply: (state) => { state.workstationBonus.workbench += 0.1; } },
    perfectGrinding: { name: "Идеальная Огранка", description: "Увеличивает прогресс работы на Точильном станке на 10%.", icon: "healing", cost: { matter: 250, ironIngots: 40 }, requires: ["divisionOfLabor"], apply: (state) => { state.workstationBonus.grindstone += 0.1; } },
    sharpeningStone: { name: "Точильный камень", description: "Увеличивает шанс критического удара в кузнице на 5%.", icon: "stream", cost: { matter: 300, sparks: 1500 }, requires: ["hammerStrength", "preciseTools", "perfectGrinding"], apply: (state) => { state.critChance += 0.05; } },
    advancedForging: { name: "Продвинутая ковка", description: "Увеличивает базовый прогресс за удар еще на 2 ед.", icon: "whatshot", cost: { matter: 350, ironIngots: 60 }, requires: ["hammerStrength", "preciseTools", "perfectGrinding"], apply: (state) => { state.progressPerClick += 2; } },
    geologicalSurvey: { name: "Геологоразведка", description: "Изучение старых карт намекает на существование других металлов.", icon: "map", cost: { matter: 200, sparks: 2000 }, requires: ["sharpeningStone", "advancedForging"], apply: (state) => {} },

    // ===========================================
    // --- Медный Век (Copper Age) ---
    // Требует: Медная Руда, Медные Слитки (помимо Железа, Искр, Материи)
    // ===========================================
    findCopper: { name: "Поиски Меди", description: "Открывает возможность добывать Медную руду и плавить Медные слитки. После изучения этого навыка вам предстоит выбрать специализацию.", icon: "filter_alt", cost: { matter: 300, sparks: 2500, ironIngots: 100 }, requires: ["geologicalSurvey"], apply: (state) => {} },
    copperProspecting: { name: "Разведка меди", description: "Увеличивает добычу медной руды вручную на 1 ед.", icon: "search", cost: { matter: 350, copperOre: 50 }, requires: ["findCopper"], apply: (state) => { state.orePerClick += 1; } },
    crucibleRefinement: { name: "Очистка в тигле", description: "Снижает стоимость плавки медных слитков на 2 ед. руды.", icon: "thermostat", cost: { matter: 380, copperIngots: 25 }, requires: ["findCopper"], apply: (state) => {} },
    jewelryCrafting: { name: "Ювелирное дело", description: "Позволяет создавать из меди простые украшения и амулеты.", icon: "diamond", cost: { matter: 350, sparks: 3000, copperIngots: 30 }, requires: ["findCopper"], apply: (state) => {}, requiredSpecialization: 'jeweler', firstPlaythroughLocked: true },
    apprenticeTraining: { name: "Тренировка подмастерьев", description: "Эффективность всех подмастерьев увеличена на 15%.", icon: "engineering", cost: { matter: 400, sparks: 3500, ironIngots: 150 }, requires: ["copperProspecting", "crucibleRefinement"], apply: (state) => { state.passiveIncomeModifier += 0.15; }, requiredSpecialization: 'engineer' },
    qualityControl: { name: "Контроль качества", description: "Увеличивает шанс критического удара еще на 5%.", icon: "verified", cost: { matter: 450, copperIngots: 30 }, requires: ["crucibleRefinement"], apply: (state) => { state.critChance += 0.05; } },
    advancedSmelting: { name: "Продвинутая плавка", description: "Сокращает время плавки всех слитков на 20%.", icon: "local_fire_department", cost: { matter: 500, copperIngots: 50 }, requires: ["apprenticeTraining"], apply: (state) => { state.smeltingSpeedModifier += 0.2; } },
    tradeRoutes: { name: "Торговые пути", description: "Увеличивает награду в Искрах и Материи еще на 15%.", icon: "alt_route", cost: { matter: 550, sparks: 4000, copperIngots: 60 }, requires: ["qualityControl"], apply: (state) => { state.sparksModifier += 0.15; state.matterModifier += 0.15; } },
    guildContracts: { name: "Контракты Гильдии", description: "Ваша репутация растет! Увеличивает шанс получения фракционных и редких заказов.", icon: "request_quote", cost: { matter: 600, sparks: 5000, copperIngots: 80 }, requires: ["tradeRoutes"], apply: (state) => {} },
    masterworkHammers: { name: "Мастерские молоты", description: "Увеличивает бонус критического удара на 5 ед.", icon: "build_circle", cost: { matter: 700, copperIngots: 100 }, requires: ["advancedSmelting", "guildContracts"], apply: (state) => { state.critBonus += 5; } },

    // ===========================================
    // --- Бронзовый Век (Bronze Age) ---
    // Требует: Бронзовые Слитки, Слитки Искростали (помимо предыдущих)
    // ===========================================
    artOfAlloys: { name: "Искусство Сплавов", description: "Открывает возможность создавать Бронзовые слитки и Слитки Искростали в Плавильне.", icon: "shield", cost: { matter: 800, sparks: 6000, copperIngots: 120 }, requires: ['masterworkHammers'], apply: (state) => {} },
    
    // --- НАВЫКИ УПРАВЛЕНИЯ РИСКОМ ---
    riskAssessment: {
        name: "Оценка Рисков",
        description: "Ваш опытный глаз теперь может определить точный шанс неудачи при улучшении предметов.",
        icon: "policy",
        cost: { matter: 1200, sparks: 8000, bronzeIngots: 20 },
        requires: ['masterReforging'],
        firstPlaythroughLocked: true
    },
    steadyHand: {
        name: "Твердая Рука",
        description: "Снижает шанс неудачи при перековке, инкрустации и гравировке на 5% за уровень.",
        icon: "pan_tool",
        cost: { matter: 1500, bronzeIngots: 30, sparks: 10000 },
        isMultiLevel: true,
        maxLevel: 3,
        baseCost: { matter: 1500, bronzeIngots: 30, sparks: 10000 },
        costIncrease: 2.0,
        requires: ['riskAssessment'],
        firstPlaythroughLocked: true
    },

    masterReforging: { name: "Мастер Перековки", description: "Открывает возможность улучшать качество созданных предметов с помощью перековки.", icon: "colorize", cost: { matter: 1000, bronzeIngots: 50 }, requires: ['artOfAlloys'], apply: (state) => {}, firstPlaythroughLocked: true },
    blueprint_eliteArmor: { name: "Чертеж: Элитная броня", description: "Открывает рецепты бронзовой кирасы и перчаток.", icon: "menu_book", cost: { matter: 900, sparks: 7000, bronzeIngots: 60 }, requires: ["artOfAlloys"], apply: (state) => {}, requiredSpecialization: 'armorsmith' },
    blueprint_fineWeapons: { name: "Чертеж: Изящное оружие", description: "Открывает рецепты бронзовых мечей и топоров.", icon: 'gite', cost: { matter: 900, sparks: 7000, bronzeIngots: 60}, requires: ["artOfAlloys"], apply: (state) => {}, requiredSpecialization: 'armorer' },
    reinforcedStructure: { name: "Уменьшение затрат", description: "Уменьшает затраты слитков/искр для всех компонентов на 1.", icon: "category", cost: { matter: 850, sparks: 6500, bronzeIngots: 50 }, requires: ["artOfAlloys"], apply: (state) => { state.componentCostReduction += 1; } },
    ancientKnowledge: { name: "Древние знания", description: "Увеличивает шанс критического удара еще на 5%.", icon: "auto_awesome", cost: { matter: 950, bronzeIngots: 70, sparks: 8000 }, requires: ["artOfAlloys"], apply: (state) => { state.critChance += 0.05; } },
    expeditionPlanning: { name: "Планирование экспедиций", description: "Открывает новые, более сложные типы заказов и клиентов с особыми требованиями.", icon: "map", cost: { matter: 1000, sparks: 9000, bronzeIngots: 80 }, requires: ["blueprint_eliteArmor", "reinforcedStructure"], apply: (state) => {} },
    gildingTechniques: { name: "Техники позолоты", description: "Увеличивает награды Искр и Материи еще на 15%.", icon: "attach_money", cost: { matter: 900, bronzeIngots: 40, sparks: 9500 }, requires: ["reinforcedStructure", "ancientKnowledge"], apply: (state) => { state.sparksModifier += 0.15; state.matterModifier += 0.15; } },
    legendaryClients: { name: "Легендарные клиенты", description: "Открывает доступ к самым прибыльным заказам и экзотическим материалам.", icon: "stars", cost: { matter: 1100, sparks: 12000, sparksteelIngots: 10 }, requires: ["expeditionPlanning"], apply: (state) => {} },
    optimizedSmelting: { name: "Оптимизированная плавка", description: "Ускоряет процесс плавки и ковки сплавов на 15%.", icon: "timer", cost: { matter: 1200, bronzeIngots: 90, sparks: 13000 }, requires: ["expeditionPlanning", "gildingTechniques"], apply: (state) => { state.smeltingSpeedModifier += 0.15; } },
    efficientCrafting: {
        name: "Эффективное ремесло",
        description: "Малые заказы теперь дают больше искр. (+20% к искрам от заказов)",
        icon: "local_gas_station",
        cost: { matter: 1250, sparks: 15000, sparksteelIngots: 15 },
        requires: ["gildingTechniques"],
        apply: (state) => { state.sparksModifier += 0.2; }
    },
    matterAlchemy: { name: "Катализ Материи", description: "Изучение химических реакций, позволяющее извлекать больше чистой материи из побочных продуктов ковки (+20%).", icon: "bubble_chart", cost: { matter: 1300, sparksteelIngots: 20, sparks: 16000 }, requires: ["legendaryClients"], apply: (state) => { state.matterModifier += 0.2; } },
    tradeNegotiation: { name: "Торговые переговоры", description: "Улучшает отношения с торговцами, снижая цены на покупку и увеличивая на продажу на 5%.", icon: "storefront", cost: { matter: 1400, sparks: 18000, sparksteelIngots: 25 }, requires: ["optimizedSmelting"], apply: (state) => {} },
    artisanMentor: { name: "Наставник-Ремесленник", description: "Значительно увеличивает эффективность работы подмастерьев на 20%.", icon: "school", cost: { matter: 1500, sparksteelIngots: 30, sparks: 19000 }, requires: ["efficientCrafting"], apply: (state) => { state.passiveIncomeModifier += 0.2; } },
    timeMastery: { name: "Мастерство Времени", description: "Увеличивает золотые и серебряные лимиты времени на заказах на 10%.", icon: "hourglass_empty", cost: { matter: 1600, sparks: 20000, sparksteelIngots: 35 }, requires: ["matterAlchemy"], apply: (state) => { state.timeLimitModifier += 0.1; } },
    blueprint_masterwork: { name: "Чертеж: Шедевры", description: "Позволяет создавать величайшие изделия, требующие редких материалов.", icon: "auto_stories", cost: { matter: 1800, sparksteelIngots: 40, sparks: 22000 }, requires: ["tradeNegotiation"], apply: (state) => {} },
    truePotential: { name: "Истинный потенциал", description: "Ваша ковка становится еще совершеннее, увеличивая прогресс за клик на 3 и шанс крита на 5%.", icon: "bolt", cost: { matter: 2000, sparksteelIngots: 50, sparks: 25000 }, requires: ["artisanMentor"], apply: (state) => { state.progressPerClick += 3; state.critChance += 0.05; } },

    // ===========================================
    // --- Мифриловая Эпоха (Mithril Age) ---
    // Требует: Мифрил (помимо предыдущих)
    // ===========================================
    mithrilProspecting: { name: "Поиски мифрила", description: "Позволяет находить и добывать мифриловую руду и плавить ее в слитки.", icon: "ac_unit", cost: { matter: 2000, sparks: 25000, sparksteelIngots: 60 }, requires: ['truePotential'], apply: (state) => {}, firstPlaythroughLocked: true },
    blueprint_mithrilCrafting: { name: "Чертеж: Мифриловые изделия", description: "Открывает рецепты для создания мощных предметов из мифрила.", icon: "shield_moon", cost: { matter: 2500, mithrilIngots: 40, sparks: 30000 }, requires: ['mithrilProspecting'], apply: (state) => {}, firstPlaythroughLocked: true },

    // ===========================================
    // --- Эпоха Легенд (Age of Legends) ---
    // Требует: Адамантит, Арканит (помимо предыдущих)
    // ===========================================
    adamantiteMining: { name: "Добыча Адамантита", description: "Техники, позволяющие вскрывать адамантитовые жилы и плавить эту прочнейшую руду.", icon: "diamond", cost: {matter: 5000, sparks: 50000, mithrilIngots: 50 }, requires: ['blueprint_mithrilCrafting'], apply: (state) => {}, firstPlaythroughLocked: true },
    blueprint_adamantiteForging: { name: "Чертеж: Адамантитовая ковка", description: "Древние схемы, описывающие работу с адамантитом для создания почти нерушимой брони.", icon: "castle", cost: {matter: 6000, adamantiteIngots: 20, sparks: 60000 }, requires: ['adamantiteMining'], apply: (state) => {}, firstPlaythroughLocked: true },
    arcaneMetallurgy: { name: "Тайная металлургия", description: "Позволяет сплавлять металлы с чистой материей, создавая магический Арканит.", icon: "auto_fix_high", cost: {matter: 10000, sparks: 100000, adamantiteIngots: 30 }, requires: ['blueprint_adamantiteForging'], apply: (state) => {}, firstPlaythroughLocked: true },
    blueprint_arcaniteMastery: { name: "Чертеж: Арканитовое мастерство", description: "Вершина кузнечного дела. Позволяет создавать легендарные арканитовые предметы.", icon: "star", cost: {matter: 15000, arcaniteIngots: 5, sparks: 150000 }, requires: ['arcaneMetallurgy'], apply: (state) => {}, firstPlaythroughLocked: true },
};
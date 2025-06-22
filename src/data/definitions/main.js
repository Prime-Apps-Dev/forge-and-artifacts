// src/data/definitions/main.js

export const {
    factions,
    reputationLevels,
    greatArtifacts,
    specialItems,
    // personnel, // ИЗМЕНЕНО: Удален personnel из деструктуризации
    workstations,
    clients,
    upgrades,
    shopUpgrades,
    recipes,
    worldEvents,
    gameConfig,
    missions,
    resourceIcons,
    resources
} = {
    factions: {
        name: 'Фракции', // Добавлено name для фракций для консистентности, если потребуется
        merchants: { name: 'Гильдия Торговцев', color: 'yellow-500', icon: 'storefront' },
        adventurers: { name: 'Лига Авантюристов', color: 'green-500', icon: 'explore' },
        court: { name: 'Королевский Двор', color: 'purple-500', icon: 'account_balance' }
    },

    reputationLevels: [
        { id: 'distrust', name: 'Недоверие', threshold: 0 },
        { id: 'neutrality', name: 'Нейтралитет', threshold: 100 },
        { id: 'respect', name: 'Уважение', threshold: 250 },
        { id: 'honor', name: 'Почет', threshold: 500 },
        { id: 'exalted', name: 'Превознесение', threshold: 1000 },
    ],

    greatArtifacts: {
        aegis: {
            name: "Эгида Бессмертного Короля",
            icon: "/img/artifacts/aegis_shield.webp",
            description: "Дает 10% шанс не потратить ресурсы при создании любого компонента.",
            components: {
                blueprint: { name: "Королевский чертеж: Эгида", obtained: false, itemId: 'blueprint_aegis' },
                material1: { name: "Сердце стража", obtained: false, itemId: 'material_guardianHeart' },
                material2: { name: "Адамантиновая основа", obtained: false, itemId: 'material_adamantFrame' },
            },
            status: 'locked',
            epicOrder: [
                { stage: 1, name: "Вплавление Сердца Стража", progress: 10000, workstation: 'anvil', cost: { gem: 5, sparks: 50000, ironIngots: 200 } },
                { stage: 2, name: "Гравировка усилителей", progress: 8000, workstation: 'workbench', cost: { sparks: 50000, matter: 2500, copperIngots: 100 } },
                { stage: 3, name: "Финальная Закалка", progress: 15000, workstation: 'grindstone', cost: { bronzeIngots: 50, sparks: 75000 } }
            ]
        },
        hammer: {
            name: "Молот Горного Сердца",
            icon: "/img/artifacts/mountain_heart_hammer.webp",
            description: "Каждый удар по наковальне имеет 1% шанс дополнительно создать редкий самоцвет.",
            components: {
                blueprint: { name: "Королевский чертеж: Молот", obtained: false, itemId: 'blueprint_hammer' },
                material1: { name: "Лавовый агат", obtained: false, itemId: 'material_lavaAgate' },
                material2: { name: "Рукоять из железного дерева", obtained: false, itemId: 'material_ironwoodHandle' },
            },
            status: 'locked',
             epicOrder: [
                { stage: 1, name: "Прокаливание Лавового агата", progress: 12000, workstation: 'anvil', cost: { copperIngots: 100, sparks: 60000, ironIngots: 300 } },
                { stage: 2, name: "Соединение с Рукоятью", progress: 9000, workstation: 'workbench', cost: { ironIngots: 100, matter: 3000, copperIngots: 150 } },
                { stage: 3, name: "Наделение силой", progress: 18000, workstation: 'grindstone', cost: { matter: 10000, bronzeIngots: 50 } }
            ]
        },
        crown: {
            name: "Корона Солнца",
            icon: "/img/artifacts/sun_crown.webp",
            description: "Значительно увеличивает доход Искр и Материи от всех заказов (+25%).",
            components: {
                blueprint: { name: "Королевский чертеж: Корона", obtained: false, itemId: 'blueprint_crown' },
                material1: { name: "Слеза солнца", obtained: false, itemId: 'material_sunTear' },
                material2: { name: "Очищенное золото", obtained: false, itemId: 'material_purifiedGold' },
            },
            status: 'locked',
            epicOrder: [
                { stage: 1, name: "Огранка Слезы солнца", progress: 15000, workstation: 'grindstone', cost: { gem: 10, sparks: 70000, copperIngots: 200 } },
                { stage: 2, name: "Создание золотого каркаса", progress: 10000, workstation: 'anvil', cost: { sparks: 100000, bronzeIngots: 30, ironIngots: 500 } },
                { stage: 3, name: "Инкрустация и благословение", progress: 20000, workstation: 'workbench', cost: { matter: 15000, sparksteelIngots: 20 } }
            ]
        },
        bastion: {
            name: "Бастион Несокрушимости",
            icon: "/img/artifacts/bastion_of_invincibility.webp",
            description: "Снижает требуемый прогресс для всех компонентов на 15%.",
            components: {
                blueprint: { name: "Древний чертеж: Бастион", obtained: false, itemId: 'blueprint_bastion'},
                material1: { name: "Адамантитовое ядро", obtained: false, itemId: 'component_adamantiteCore'},
                material2: { name: "Стабилизирующий Гироскоп", obtained: false, itemId: 'component_stabilizingGyroscope'},
            },
            status: 'locked',
            epicOrder: [
                { stage: 1, name: "Сборка ядра", progress: 25000, workstation: 'anvil', cost: { bronzeIngots: 100, sparks: 150000 } },
                { stage: 2, name: "Монтаж гироскопа", progress: 20000, workstation: 'workbench', cost: { sparksteelIngots: 30, matter: 10000 } },
                { stage: 3, name: "Насыщение энергией", progress: 30000, workstation: 'workbench', cost: { matter: 25000, gem: 30, sparks: 200000 } }
            ]
        },
        quill: {
            name: "Перо Архивариуса",
            icon: "/img/artifacts/archivists_quill.webp",
            description: "Вы получаете 1 ед. Материи за каждые 100 Искр, заработанных с заказов.",
            components: {
                blueprint: { name: "Древний чертеж: Перо", obtained: false, itemId: 'blueprint_quill'},
                material1: { name: "Очищенный Мифрил", obtained: false, itemId: 'component_purifiedMithril'},
                material2: { name: "Фокусирующая Линза", obtained: false, itemId: 'component_focusingLens'},
            },
            status: 'locked',
            epicOrder: [
                { stage: 1, name: "Ковка пера", progress: 20000, workstation: 'anvil', cost: { sparksteelIngots: 50, sparks: 120000 } },
                { stage: 2, name: "Создание линзы", progress: 22000, workstation: 'workbench', cost: { gem: 25, matter: 8000, bronzeIngots: 80 } },
                { stage: 3, name: "Калибровка потоков", progress: 28000, workstation: 'grindstone', cost: { sparks: 150000, sparksteelIngots: 40 } }
            ]
        }
    },

    specialItems: {
        blueprint_aegis: { name: 'Чертеж: Эгида', description: 'Схема для создания легендарного щита.', cost: { matter: 5000, sparks: 30000 }, requiredFaction: 'court', requiredRep: 'honor', requiredSkill: 'blueprint_adamantiteForging'},
        blueprint_hammer: { name: 'Чертеж: Молот', description: 'Схема для создания легендарного молота.', cost: { matter: 5000, sparks: 30000 }, requiredFaction: 'court', requiredRep: 'honor', requiredSkill: 'blueprint_masterwork'},
        blueprint_crown: { name: 'Чертеж: Корона', description: 'Схема для создания легендарной короны.', cost: { matter: 5000, sparks: 30000 }, requiredFaction: 'court', requiredRep: 'honor', requiredSkill: 'blueprint_masterwork'},
        expeditionMap: { name: "Карта вылазки", description: "Открывает доступ к особой локации с добычей.", cost: { sparks: 1000, ironIngots: 10 }, requiredFaction: 'adventurers', requiredRep: 'respect' },
        gem: { name: "Редкий самоцвет", description: "Драгоценный камень, используемый в самых дорогих изделиях." },
        material_guardianHeart: { name: "Сердце стража", description: "Пульсирующее ядро древнего автоматона. Добывается по спецзаказу Лиги Авантюристов." },
        material_adamantFrame: { name: "Адамантиновая основа", description: "Слиток почти неразрушимого металла. Можно получить, инвестируя в торговые пути Гильдии." },
        material_lavaAgate: { name: "Лавовый агат", description: "Застывшая слеза вулкана." },
        material_ironwoodHandle: { name: "Рукоять из железного дерева", description: "Невероятно прочное дерево." },
        material_sunTear: { name: "Слеза солнца", description: "Кристалл, поглотивший солнечный свет." },
        material_purifiedGold: { name: "Очищенное золото", description: "Золото, свободное от любых примесей." },
        blueprint_bastion: { name: "Чертеж: Бастион", description: 'Схема для создания Бастиона Несокрушимости.', cost: { matter: 10000, sparks: 50000 }, requiredFaction: 'court', requiredRep: 'exalted', requiredSkill: 'blueprint_arcaniteMastery'},
        blueprint_quill: { name: "Чертеж: Перо", description: 'Схема для создания Пера Архивариуса.', cost: { matter: 10000, sparks: 50000 }, requiredFaction: 'court', requiredRep: 'exalted', requiredSkill: 'blueprint_arcaniteMastery'},
        component_adamantiteCore: { name: "Адамантитовое ядро", description: "Сердце Бастиона. Тяжелое и прочное." },
        component_stabilizingGyroscope: { name: "Стабилизирующий Гироскоп", description: "Сложное устройство, использующее принципы резонанса арканита для укрепления структуры любого материала." },
        component_purifiedMithril: { name: "Очищенный Мифрил", description: "Мифрил, избавленный от всех примесей." },
        component_focusingLens: { name: "Фокусирующая Линза", description: "Линза, преобразующая Искры в Материю." },
    },

    workstations: {
        anvil: { name: "Наковальня", icon: "hardware" },
        workbench: { name: "Верстак", icon: "handyman" },
        grindstone: { name: "Точильный станок", icon: "healing" }
    },

    clients: [
        { id: 'farmer', name: 'Фермер', faceImg: '/img/clients/farmer.webp', demands: { quality: 0.8, speed: 1.2, reward: 0.9, saleSpeedModifier: 1.2, tipChance: 0.05 }, unlockLevel: 0, unlockSkill: null },
        { id: 'adventurer', name: 'Авантюрист', faceImg: '/img/clients/adventurer.webp', demands: { quality: 1.0, speed: 0.8, reward: 1.1, saleSpeedModifier: 1.0, tipChance: 0.1 }, unlockLevel: 0, unlockSkill: 'advancedClients' },
        { id: 'noble', name: 'Дворянин', faceImg: '/img/clients/noble.webp', demands: { quality: 1.5, speed: 1.0, reward: 1.5, saleSpeedModifier: 0.8, tipChance: 0.2 }, unlockLevel: 0, unlockSkill: null },
        { id: 'shadowyFigure', name: 'Тайный Заказчик', faceImg: '/img/clients/shadowy_figure.webp', demands: { quality: 1.8, speed: 0.5, reward: 2.5 }, isRisky: true, unlockLevel: 0, unlockSkill: null },
        { id: 'collector', name: 'Коллекционер', faceImg: '/img/clients/collector.webp', demands: { quality: 2.5, speed: 1.0, reward: 3.0, saleSpeedModifier: 0.7, tipChance: 0.3 }, isCollector: true, unlockLevel: 0, unlockSkill: null },

        { id: 'alchemist', name: 'Алхимик', faceImg: '/img/clients/alchemist.webp', demands: { quality: 1.8, speed: 0.7, reward: 2.0, saleSpeedModifier: 0.6, tipChance: 0.15 }, unlockLevel: 5, unlockSkill: 'advancedClients' },
        { id: 'scholar', name: 'Ученый-Археолог', faceImg: '/img/clients/scholar.webp', demands: { quality: 1.2, speed: 1.0, reward: 1.3, saleSpeedModifier: 0.8, tipChance: 0.08 }, unlockLevel: 3, unlockSkill: null },
        { id: 'barbarian', name: 'Варвар-Воин', faceImg: '/img/clients/barbarian.webp', demands: { quality: 0.7, speed: 1.5, reward: 0.8, saleSpeedModifier: 1.3, tipChance: 0.03 }, unlockLevel: 2, unlockSkill: null },
        { id: 'bard', name: 'Бард-Путешественник', faceImg: '/img/clients/bard.webp', demands: { quality: 1.0, speed: 1.1, reward: 1.0, saleSpeedModifier: 1.0, tipChance: 0.12 }, unlockLevel: 4, unlockSkill: 'advancedClients' },
        { id: 'artisan', name: 'Придворный Ремесленник', faceImg: '/img/clients/artisan.webp', demands: { quality: 2.0, speed: 0.5, reward: 2.8, saleSpeedModifier: 0.4, tipChance: 0.25 }, isCollector: true, unlockLevel: 7, unlockSkill: 'legendaryClients' },
        { id: 'miner', name: 'Старатель', faceImg: '/img/clients/miner.webp', demands: { quality: 0.9, speed: 1.3, reward: 0.95, saleSpeedModifier: 1.1, tipChance: 0.06 }, unlockLevel: 1, unlockSkill: null },
        { id: 'hunter', name: 'Охотник', faceImg: '/img/clients/hunter.webp', demands: { quality: 1.1, speed: 1.2, reward: 1.0, saleSpeedModifier: 1.0, tipChance: 0.07 }, unlockLevel: 2, unlockSkill: null },
        { id: 'priestess', name: 'Жрица Света', faceImg: '/img/clients/priestess.webp', demands: { quality: 2.2, speed: 0.8, reward: 3.0, saleSpeedModifier: 0.5, tipChance: 0.30 }, unlockLevel: 8, unlockSkill: 'legendaryClients' },
        { id: 'engineer_client', name: 'Имперский Инженер', faceImg: '/img/clients/engineer_client.webp', demands: { quality: 1.5, speed: 0.9, reward: 1.7, saleSpeedModifier: 0.7, tipChance: 0.18 }, unlockLevel: 6, unlockSkill: 'advancedClients' },
        { id: 'spy', name: 'Тайный Агент', faceImg: '/img/clients/spy.webp', demands: { quality: 1.0, speed: 0.4, reward: 2.5, saleSpeedModifier: 0.1, tipChance: 0.20 }, isRisky: true, unlockLevel: 5, unlockSkill: null },
    ],

    upgrades: {
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
        tradeSpeed: {
            id: 'tradeSpeed',
            name: "Скорость торговли",
            description: "Ваши караваны двигаются быстрее. Ускоряет мировые торговые события.",
            isMultiLevel: true,
            maxLevel: 5,
            baseCost: { sparks: 1500, copperIngots: 20 },
            costIncrease: 2.0,
            apply: (state) => { state.marketTradeSpeedModifier = (state.marketTradeSpeedModifier || 1.0) + 0.1; }
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
            apply: (state) => { /* Логика в handleSaleCompletion */ }
        }
    },

    shopUpgrades: {
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
        }
    },

    recipes: {
        iron: { name: "Железный слиток", input: { ironOre: 10 }, output: { ironIngots: 1 }, requiredProgress: 20, icon: '/img/ingots/iron_ingot.webp' },
        copper: { name: "Медный слиток", input: { copperOre: 10 }, output: { copperIngots: 1 }, requiredProgress: 20, requiredSkill: 'findCopper', icon: '/img/ingots/copper_ingot.webp' },
        mithril: { name: "Мифриловый слиток", input: { mithrilOre: 15 }, output: { mithrilIngots: 1 }, requiredProgress: 30, requiredSkill: 'mithrilProspecting', icon: '/img/ingots/mithril_ingot.webp' },
        adamantite: { name: "Адамантитовый слиток", input: { adamantiteOre: 20 }, output: { adamantiteIngots: 1 }, requiredProgress: 50, requiredSkill: 'adamantiteMining', icon: '/img/ingots/adamantite_ingot.webp' },
        bronze: { name: "Бронзовый слиток", input: { ironIngots: 1, copperIngots: 1 }, output: { bronzeIngots: 1 }, requiredSkill: 'artOfAlloys', icon: '/img/ingots/bronze_ingot.webp' },
        sparksteel: { name: "Слиток Искростали", input: { bronzeIngots: 2, sparks: 1000 }, output: { sparksteelIngots: 1 }, requiredSkill: 'artOfAlloys', icon: '/img/ingots/sparksteel_ingot.webp' },
        arcanite: { name: "Арканитовый слиток", input: { adamantiteIngots: 1, matter: 500 }, output: { arcaniteIngots: 1 }, requiredSkill: 'arcaneMetallurgy', icon: '/img/ingots/arcanite_ingot.webp' },
    },

    worldEvents: [
        { id: 'drought', type: 'market', message: "Засуха в южных провинциях! Поставки руды затруднены.", effects: { ironOre: { buy: 1.25, sell: 1.15 }, copperOre: { buy: 1.25, sell: 1.15 }}},
        { id: 'tournament', type: 'market', message: "Королевский турнир! Спрос на оружие и броню взлетел до небес.", effects: { ironIngots: { sell: 1.20 }, bronzeIngots: { sell: 1.25 }}},
        { id: 'good_harvest', type: 'market', message: "Отличный урожай, караваны идут без задержек. Цены на сырье снижены.", effects: { ironOre: { buy: 0.85 }, copperOre: { buy: 0.85 }}},
        { id: 'merchants_vs_adventurers', type: 'faction_conflict', message: 'Торговая Гильдия обвиняет Авантюристов в пиратстве! Отношения накалены, торговля с обеими фракциями затруднена.', conflictingFactions: ['merchants', 'adventurers']},
        { id: 'court_vs_merchants', type: 'faction_conflict', message: 'Королевский Двор вводит новые налоги, что злит Гильдию Торговцев. Сотрудничество с ними временно приостановлено.', conflictingFactions: ['court', 'merchants']},
        { id: 'adventurers_vs_court', type: 'faction_conflict', message: 'Лига Авантюристов недовольна запретом Короны на исследование древних руин. Услуги обеих фракций недоступны.', conflictingFactions: ['adventurers', 'court']},
    ],

    gameConfig: {
        orderTTL: 90
    },

    missions: {
        scout_old_mine: {
            id: 'scout_old_mine',
            name: 'Разведка старой шахты',
            description: 'Наши геологи обнаружили заброшенную шахту. Отправьте подмастерья на разведку, чтобы оценить её состояние. Им понадобится базовое снаряжение.',
            duration: 600,
            requiredGear: [
                { itemKey: 'horseshoe', count: 2, minQuality: 1.0 },
                { itemKey: 'dagger', count: 1, minQuality: 1.2 },
            ],
            baseReward: { sparks: 5000, ironOre: 200 },
            bonusReward: { matterPerQualityPoint: 5 }
        },
        escort_merchant_caravan: {
            id: 'escort_merchant_caravan',
            name: 'Сопровождение каравана',
            description: 'Торговая Гильдия просит предоставить снаряжение для охраны их каравана. Чем лучше снаряжение, тем увереннее будут себя чувствовать охранники.',
            duration: 1800,
            requiredGear: [
                { itemKey: 'ironHelmet', count: 1, minQuality: 1.5 },
                { itemKey: 'bronzeSword', count: 1, minQuality: 2.0 },
            ],
            baseReward: { sparks: 15000, reputation: { merchants: 50 } },
            bonusReward: { sparksPerQualityPoint: 100 }
        }
    },

    resourceIcons: {
        ironOre: '/img/ores/iron_ore.webp',
        copperOre: '/img/ores/copper_ore.webp',
        mithrilOre: '/img/ores/mithril_ore.webp',
        adamantiteOre: '/img/ores/adamantite_ore.webp',
    },
    resources: {
        ironOre: { name: 'Железная руда' },
        copperOre: { name: 'Медная руда' },
        mithrilOre: { name: 'Мифриловая руда' },
        adamantiteOre: { name: 'Адамантитовая руда' },
        ironIngots: { name: 'Железные слитки' },
        copperIngots: { name: 'Медные слитки' },
        bronzeIngots: { name: 'Бронзовые слитки' },
        sparksteelIngots: { name: 'Слитки Искростали' },
        mithrilIngots: { name: 'Мифриловые слитки' },
        adamantiteIngots: { name: 'Адамантитовые слитки' },
        arcaniteIngots: { name: 'Арканитовые слитки' },
    },
    regions: {},
    eternalSkills: {},
    avatars: {}
};
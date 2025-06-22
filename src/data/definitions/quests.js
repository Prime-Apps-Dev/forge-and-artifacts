// src/data/definitions/quests.js
export const quests = {
    guardianHeartQuest: {
        id: 'guardianHeartQuest',
        title: "Охота на Стража",
        description: "Лига Авантюристов прознала о древнем автоматоне. Создайте богато украшенный меч, чтобы выманить его из руин. Он падок на блестящее.",
        factionId: 'adventurers',
        trigger: { type: 'reputation', factionId: 'adventurers', level: 'honor' },
        target: { type: 'craft', itemId: 'ornateGreatsword', count: 1 },
        reward: { type: 'item', itemId: 'material_guardianHeart', amount: 1 }
    },
    purifiedMithrilQuest: {
        id: 'purifiedMithrilQuest',
        title: "Чистота Металла",
        description: "Торговая Гильдия хочет проверить ваши навыки работы с мифрилом. Изготовьте для них партию из 5 мифриловых кинжалов, и они поделятся секретом очистки.",
        factionId: 'merchants',
        trigger: { type: 'skill', skillId: 'blueprint_mithrilCrafting'},
        target: { type: 'craft', itemId: 'mithrilDagger', count: 5},
        reward: { type: 'unlock_recipe', itemId: 'craftable_purifiedMithril'}
    },
    adamantiteCoreQuest: {
        id: 'adamantiteCoreQuest',
        title: "Королевская Броня",
        description: "Королевский Двор желает укрепить свою гвардию. Создайте для капитана адамантитовый нагрудник, чтобы доказать свое мастерство. Взамен вы получите доступ к секретам создания силовых ядер.",
        factionId: 'court',
        trigger: { type: 'skill', skillId: 'blueprint_adamantiteForging'},
        target: { type: 'craft', itemId: 'adamantitePlatebody', count: 1},
        reward: { type: 'unlock_recipe', itemId: 'craftable_adamantiteCore'}
    },
    focusingLensQuest: {
        id: 'focusingLensQuest',
        title: "Магия в Металле",
        description: "Маги из Лиги Авантюристов изучают арканит. Им нужен образец вашего лучшего чародейского клинка. В награду они научат вас создавать фокусирующие линзы.",
        factionId: 'adventurers',
        trigger: { type: 'skill', skillId: 'blueprint_arcaniteMastery'},
        target: { type: 'craft', itemId: 'arcaniteSpellblade', count: 1},
        reward: { type: 'unlock_recipe', itemId: 'craftable_focusingLens'}
    },
    runeOfFortitudeQuest: {
        id: 'runeOfFortitudeQuest',
        title: "Символ Стойкости",
        description: "Чтобы получить последний секрет, вы должны доказать свое понимание рун. Создайте для Двора Королевскую Корону, и их рунмастеры поделятся с вами знаниями.",
        factionId: 'court',
        trigger: { type: 'quest', questId: 'adamantiteCoreQuest' }, 
        target: { type: 'craft', itemId: 'royalCrown', count: 1 },
        reward: { type: 'unlock_recipe', itemId: 'craftable_runeOfFortitude' }
    },
    // НОВЫЕ КВЕСТЫ (5 штук из предыдущего запроса)
    architect_forger_quest: {
        id: 'architect_forger_quest',
        title: "Кузнец-Архитектор",
        description: "Торговая Гильдия нуждается в крепких, надёжных инструментах для строительства новых складов. Создайте для них партию железных ломов.",
        factionId: 'merchants',
        trigger: { type: 'skill', skillId: 'sturdyVice' },
        target: { type: 'craft', itemId: 'ironCrowbar', count: 5 },
        reward: { type: 'reputation', factionId: 'merchants', amount: 50, sparks: 500 }
    },
    elite_supplier_quest: {
        id: 'elite_supplier_quest',
        title: "Элитный Поставщик",
        description: "Королевский Двор ищет поставщика эксклюзивных инструментов. Создайте комплект инструментов из искростали.",
        factionId: 'court',
        trigger: { type: 'skill', skillId: 'optimizedSmelting' },
        target: { type: 'craft', itemId: 'sparksteelToolset', count: 1 },
        reward: { type: 'sparks', amount: 5000, matter: 100 }
    },
    guild_defender_quest: {
        id: 'guild_defender_quest',
        title: "Защитник Гильдии",
        description: "Лига Авантюристов нуждается в надёжных комплектах для ремонта брони для своих рейдов. Изготовьте один комплект.",
        factionId: 'adventurers',
        trigger: { type: 'skill', skillId: 'repairWorkshop' },
        target: { type: 'craft', itemId: 'armorRepairKit', count: 1 },
        reward: { type: 'reputation', factionId: 'adventurers', amount: 75, sparks: 1500 }
    },
    royal_jeweler_quest: {
        id: 'royal_jeweler_quest',
        title: "Королевский Ювелир",
        description: "Королевский Двор ценит изысканные украшения. Инкрустируйте 3 предмета для знати.",
        factionId: 'court',
        trigger: { type: 'skill', skillId: 'jewelryCrafting' },
        target: { type: 'inlay', count: 3 }, // Новый тип цели: инкрустация
        reward: { type: 'item', itemId: 'gem', amount: 3, sparks: 2500 }
    },
    secret_courier_quest: {
        id: 'secret_courier_quest',
        title: "Тайный Посыльный",
        description: "Тайные заказчики предлагают вам работу повышенной опасности. Выполните 5 рискованных заказов.",
        factionId: 'merchants', // Привязал к Торговцам, чтобы было реалистично
        trigger: { type: 'skill', skillId: 'riskAssessment' },
        target: { type: 'risky_order', count: 5 }, // Новый тип цели: рискованные заказы
        reward: { type: 'sparks', amount: 10000, riskReduction: 0.02 } // Пример награды (риск-редукция)
    },
    // НОВЫЕ КВЕСТЫ (ЕЩЁ 5 штук)
    grand_collector_quest: {
        id: 'grand_collector_quest',
        title: "Великий Коллекционер",
        description: "Соберите обширную коллекцию уникальных предметов, чтобы продемонстрировать ваше мастерство и вкус.",
        factionId: 'merchants',
        trigger: { type: 'achievement', achievementId: 'novice_collector', level: 2 }, // Зависит от 2 уровня достижения "Начинающий Коллекционер"
        target: { type: 'unique_items', count: 30 }, // Новый тип цели: количество уникальных предметов
        reward: { type: 'item', itemId: 'expeditionMap', amount: 1, sparks: 15000 }
    },
    ore_flow_quest: {
        id: 'ore_flow_quest',
        title: "Поток Руды",
        description: "Вам требуется наладить бесперебойные поставки сырья. Накопите огромное количество руды на своем складе.",
        factionId: 'adventurers',
        trigger: { type: 'skill', skillId: 'mithrilProspecting' },
        target: { type: 'totalOre', count: 25000 }, // Новый тип цели: общее количество руды
        reward: { type: 'passiveGeneration', resourceType: 'allOre', amount: 0.05, sparks: 5000 } // +0.05/сек к пассивной добыче всей руды
    },
    energy_master_quest: {
        id: 'energy_master_quest',
        title: "Мастер Энергии",
        description: "Покажите свою эффективность в использовании Материи, потратив значительное количество этого редкого ресурса.",
        factionId: 'court',
        trigger: { type: 'skill', skillId: 'matterAlchemy' },
        target: { type: 'totalMatterSpent', count: 10000 }, // Новый тип цели: потраченная материя
        reward: { type: 'matterModifier', amount: 0.05, sparks: 8000 } // +5% к бонусу Материи от заказов
    },
    smelter_of_souls_quest: {
        id: 'smelter_of_souls_quest',
        title: "Тигель Душ",
        description: "Ваша плавильня должна работать без остановки. Переплавьте огромное количество слитков, доказав свою усердность.",
        factionId: 'merchants',
        trigger: { type: 'achievement', achievementId: 'diligent_smelter', level: 2 }, // Зависит от 2 уровня достижения "Усердный Плавильщик"
        target: { type: 'totalIngotsSmelted', count: 10000 }, // Новый тип цели: переплавленные слитки
        reward: { type: 'smeltingSpeedModifier', amount: 0.05, sparks: 7500 } // +5% к скорости плавки
    },
    tireless_forger_quest: {
        id: 'tireless_forger_quest',
        title: "Неутомимый Кузнец",
        description: "Покажите свою несгибаемую волю и невероятную скорость, нанося тысячи ударов по наковальне.",
        factionId: 'adventurers',
        trigger: { type: 'achievement', achievementId: 'enhanced_clicker', level: 2 }, // Зависит от 2 уровня достижения "Усиленный Кликер"
        target: { type: 'totalClicks', count: 200000 }, // Новый тип цели: количество кликов
        reward: { type: 'progressPerClick', amount: 2, sparks: 12000 } // +2 к прогрессу за клик
    }
};
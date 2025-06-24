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
        target: { type: 'inlay', count: 3 },
        reward: { type: 'item', itemId: 'gem', amount: 3, sparks: 2500 }
    },
    secret_courier_quest: {
        id: 'secret_courier_quest',
        title: "Тайный Посыльный",
        description: "Тайные заказчики предлагают вам работу повышенной опасности. Выполните 5 рискованных заказов.",
        factionId: 'merchants',
        trigger: { type: 'skill', skillId: 'riskAssessment' },
        target: { type: 'risky_order', count: 5 },
        reward: { type: 'sparks', amount: 10000, riskReduction: 0.02 }
    },
    grand_collector_quest: {
        id: 'grand_collector_quest',
        title: "Великий Коллекционер",
        description: "Соберите обширную коллекцию уникальных предметов, чтобы продемонстрировать ваше мастерство и вкус.",
        factionId: 'merchants',
        trigger: { type: 'achievement', achievementId: 'novice_collector', level: 2 },
        target: { type: 'unique_items', count: 30 },
        reward: { type: 'item', itemId: 'expeditionMap', amount: 1, sparks: 15000 }
    },
    ore_flow_quest: {
        id: 'ore_flow_quest',
        title: "Поток Руды",
        description: "Вам требуется наладить бесперебойные поставки сырья. Накопите огромное количество руды на своем складе.",
        factionId: 'adventurers',
        trigger: { type: 'skill', skillId: 'mithrilProspecting' },
        target: { type: 'totalOre', count: 25000 },
        reward: { type: 'passiveGeneration', resourceType: 'allOre', amount: 0.05, sparks: 5000 }
    },
    energy_master_quest: {
        id: 'energy_master_quest',
        title: "Мастер Энергии",
        description: "Покажите свою эффективность в использовании Материи, потратив значительное количество этого редкого ресурса.",
        factionId: 'court',
        trigger: { type: 'skill', skillId: 'matterAlchemy' },
        target: { type: 'totalMatterSpent', count: 10000 },
        reward: { type: 'matterModifier', amount: 0.05, sparks: 8000 }
    },
    smelter_of_souls_quest: {
        id: 'smelter_of_souls_quest',
        title: "Тигель Душ",
        description: "Ваша плавильня должна работать без остановки. Переплавьте огромное количество слитков, доказав свою усердность.",
        factionId: 'merchants',
        trigger: { type: 'achievement', achievementId: 'diligent_smelter', level: 2 },
        target: { type: 'totalIngotsSmelted', count: 10000 },
        reward: { type: 'smeltingSpeedModifier', amount: 0.05, sparks: 7500 }
    },
    tireless_forger_quest: {
        id: 'tireless_forger_quest',
        title: "Неутомимый Кузнец",
        description: "Покажите свою несгибаемую волю и невероятную скорость, нанося тысячи ударов по наковальне.",
        factionId: 'adventurers',
        trigger: { type: 'achievement', achievementId: 'enhanced_clicker', level: 2 },
        target: { type: 'totalClicks', count: 200000 },
        reward: { type: 'progressPerClick', amount: 2, sparks: 12000 }
    },
    // НОВЫЕ КВЕСТЫ ГИЛЬДИЙ
    guild_contracts_ii_quest: {
        id: 'guild_contracts_ii_quest',
        title: "Мастер Гильдейских Контрактов",
        description: "Гильдия Торговцев признает ваше влияние. Выполните 10 сложных заказов, чтобы получить их полное доверие и доступ к особым поручениям.",
        factionId: 'merchants',
        trigger: { type: 'skill', skillId: 'guildContractsII' },
        target: { type: 'complex_order', count: 10 }, // Новый тип цели: сложные заказы
        reward: { type: 'reputation', factionId: 'merchants', amount: 200, matter: 500, sparks: 20000 }
    },
    durable_gear_quest: {
        id: 'durable_gear_quest',
        title: "Поставки для Авантюристов",
        description: "Лиге Авантюристов требуется партия брони высочайшего качества для их самых опасных экспедиций. Создайте 3 элемента брони с качеством не ниже 8.0.",
        factionId: 'adventurers',
        trigger: { type: 'skill', skillId: 'durableGear' },
        target: { type: 'craft_quality', itemType: 'armor', count: 3, minQuality: 8.0 }, // Новый тип цели: крафт с мин. качеством
        reward: { type: 'item', itemId: 'mithrilIngots', amount: 10, reputation: { adventurers: 150 }, sparks: 15000 }
    },
    resource_expert_quest: {
        id: 'resource_expert_quest',
        title: "Контроль Поставок",
        description: "Королевский Двор нуждается в огромном количестве редкой руды для своих проектов. Доставьте 5000 единиц мифриловой или адамантитовой руды.",
        factionId: 'court',
        trigger: { type: 'skill', skillId: 'resourceExpert' },
        target: { type: 'deliver_resources', resources: ['mithrilOre', 'adamantiteOre'], count: 5000 }, // Новый тип цели: доставка ресурсов
        reward: { type: 'matter', amount: 200, reputation: { court: 150 }, sparks: 25000 }
    },
    ancient_ruins_quest: {
        id: 'ancient_ruins_quest',
        title: "Тайны Забытых Шахт",
        description: "Авантюристы обнаружили древние руины, полные ловушек и запечатанных проходов. Они просят вас создать 5 универсальных клещей из искростали для их вскрытия.",
        factionId: 'adventurers',
        trigger: { type: 'skill', skillId: 'ancientRuins' },
        target: { type: 'craft', itemId: 'sparksteelPincers', count: 5 },
        reward: { type: 'item', itemId: 'material_lavaAgate', amount: 1, matter: 1000, sparks: 30000 }
    },
    secret_operations_quest: {
        id: 'secret_operations_quest',
        title: "Негласное Задание",
        description: "Тайные заказчики из Гильдии Торговцев предлагают опасное задание. Выполните его, не привлекая внимания (успешно завершите 3 рискованных заказа подряд).",
        factionId: 'merchants',
        trigger: { type: 'skill', skillId: 'secretOperations' },
        target: { type: 'risky_order_consecutive', count: 3 }, // Новый тип цели: N рискованных заказов подряд
        reward: { type: 'sparks', amount: 50000, riskReduction: 0.05, reputation: { merchants: 200 } }
    },
    // Квесты для более поздних эпох
    legendary_craft_quest: {
        id: 'legendary_craft_quest',
        title: "Высшая Проба",
        description: "Королевский Двор желает получить подтверждение вашего легендарного мастерства. Создайте 1 предмет уровня 'Легенда' (качество 10.0), чтобы получить их абсолютную благосклонность.",
        factionId: 'court',
        trigger: { type: 'skill', skillId: 'blueprint_masterwork' },
        target: { type: 'craft_quality', itemType: 'any', count: 1, minQuality: 10.0 },
        reward: { type: 'matter', amount: 5000, sparks: 100000, reputation: { court: 300 } }
    },
    mithril_supply_chain_quest: {
        id: 'mithril_supply_chain_quest',
        title: "Мифриловые Поставки",
        description: "Торговая Гильдия хочет наладить бесперебойные поставки мифрила. Выполните 5 заказов на мифриловые изделия.",
        factionId: 'merchants',
        trigger: { type: 'skill', skillId: 'mithrilProspecting' },
        target: { type: 'craft_item_tag', itemTag: 'mithril', count: 5 }, // Новый тип цели: крафт по тегу
        reward: { type: 'passiveGeneration', resourceType: 'mithrilOre', amount: 0.1, sparks: 40000 }
    },
    arcanite_master_quest: {
        id: 'arcanite_master_quest',
        title: "Секреты Арканита",
        description: "Лига Авантюристов узнала о ваших успехах с арканитом. Продемонстрируйте свои навыки, инкрустировав 3 арканитовых предмета.",
        factionId: 'adventurers',
        trigger: { type: 'skill', skillId: 'arcaniteJewelry' },
        target: { type: 'inlay_item_tag', itemTag: 'arcanite', count: 3 }, // Новый тип цели: инкрустация по тегу
        reward: { type: 'item', itemId: 'component_focusingLens', amount: 1, matter: 10000, reputation: { adventurers: 250 } }
    },
    eternal_knowledge_quest: {
        id: 'eternal_knowledge_quest',
        title: "Поиск Вечных Знаний",
        description: "Королевский Двор заинтересован в восстановлении древних знаний. Потратьте 10000 единиц материи, чтобы доказать свою приверженность науке.",
        factionId: 'court',
        trigger: { type: 'matter_spent', count: 10000 }, // Новый тип цели: потратить материю
        reward: { type: 'matterModifier', amount: 0.1, sparks: 50000 }
    },
    forge_legend_quest: {
        id: 'forge_legend_quest',
        title: "Выковать Легенду",
        description: "Торговая Гильдия вызывает вас на создание абсолютного шедевра. Создайте артефакт 'Молот Горного Сердца', чтобы войти в историю.",
        factionId: 'merchants',
        trigger: { type: 'artifact_completed', artifactId: 'hammer' }, // Новый тип цели: создание артефакта
        target: { type: 'artifact_completed', artifactId: 'hammer' }, // Цель дублируется для консистентности, но фактически проверяется триггером
        reward: { type: 'prestigePoints', amount: 100, sparks: 100000, matter: 5000 }
    }
};
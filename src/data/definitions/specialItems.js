// src/data/definitions/specialItems.js
import { IMAGE_PATHS } from '../../constants/paths';

export const specialItems = {
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
    component_stabilizingGyroscope: { name: "Укрепляющий Сердечник", description: "Сложное устройство, использующее принципы резонанса для укрепления структуры любого материала." }, // THEMATIC CHANGE
    component_purifiedMithril: { name: "Очищенный Мифрил", description: "Мифрил, избавленный от всех примесей." },
    component_focusingLens: { name: "Фокусирующая Линза", description: "Линза, преобразующая Искры в Материю." },
    
    // НОВЫЕ ЧЕРТЕЖИ ДЛЯ ПОКУПКИ (СВЯЗАННЫЕ С SKILLS.JS)
    blueprint_basicArmor_item: { name: "Чертеж: Базовая броня", description: "Позволяет ковать простые элементы железной брони (шлем, поножи).", cost: { sparks: 2500, ironIngots: 50 }, requiredSkill: 'blueprint_basicArmor' }, // requiredSkill соответствует ID навыка
    blueprint_advancedTools_item: { name: "Чертеж: Продвинутые инструменты", description: "Позволяет ковать двуручные топоры и усиленные щиты.", cost: { sparks: 3500, ironIngots: 75 }, requiredSkill: 'blueprint_advancedTools' }, // requiredSkill соответствует ID навыка
    jewelryCrafting_item: { name: "Чертеж: Ювелирное дело", description: "Позволяет создавать из меди простые украшения и амулеты.", cost: { sparks: 3000, copperIngots: 40 }, requiredSkill: 'jewelryCrafting' },
    artOfAlloys_item: { name: "Чертеж: Искусство сплавов", description: "Открывает возможность создавать бронзовые слитки и слитки искростали.", cost: { sparks: 6000, copperIngots: 100 }, requiredSkill: 'artOfAlloys' },
    blueprint_eliteArmor_item: { name: "Чертеж: Элитная броня", description: "Открывает рецепты бронзовой кирасы и перчаток.", cost: { sparks: 7000, bronzeIngots: 60 }, requiredSkill: 'blueprint_eliteArmor' },
    blueprint_fineWeapons_item: { name: "Чертеж: Изящное оружие", description: "Открывает рецепты бронзовых мечей и топоров.", cost: { sparks: 7000, bronzeIngots: 60 }, requiredSkill: 'blueprint_fineWeapons' },
    blueprint_masterwork_item: { name: "Чертеж: Шедевры", description: "Позволяет создавать величайшие изделия, требующие редких материалов.", cost: { sparks: 22000, sparksteelIngots: 40 }, requiredSkill: 'blueprint_masterwork' },
    blueprint_mithrilCrafting_item: { name: "Чертеж: Мифриловые изделия", description: "Открывает рецепты для создания мощных предметов из мифрила.", cost: { sparks: 30000, mithrilIngots: 50 }, requiredSkill: 'blueprint_mithrilCrafting' },
    blueprint_adamantiteForging_item: { name: "Чертеж: Адамантитовая ковка", description: "Древние схемы для работы с адамантитом.", cost: { sparks: 60000, adamantiteIngots: 20 }, requiredSkill: 'blueprint_adamantiteForging' },
    blueprint_arcaniteMastery_item: { name: "Чертеж: Арканитовое мастерство", description: "Вершина кузнечного дела. Позволяет создавать легендарные арканитовые предметы.", cost: { sparks: 150000, arcaniteIngots: 5 }, requiredSkill: 'blueprint_arcaniteMastery' },
    sturdyVice_item: { name: "Чертеж: Прочные тиски", description: "Позволяет создавать железные тиски.", cost: { sparks: 1000, ironIngots: 50 }, requiredSkill: 'sturdyVice' },
    chainWeaving_item: { name: "Чертеж: Цепевязание", description: "Позволяет создавать прочные медные цепи.", cost: { sparks: 1500, copperIngots: 20 }, requiredSkill: 'chainWeaving' },
    optimizedSmelting_item: { name: "Чертеж: Оптимизированная плавка", description: "Позволяет создавать комплект инструментов из искростали.", cost: { sparks: 13000, sparksteelIngots: 15 }, requiredSkill: 'optimizedSmelting' },
    repairWorkshop_item: { name: "Чертеж: Ремонтная мастерская", description: "Открывает возможность создания комплектов для ремонта брони.", cost: { sparks: 8500, ironIngots: 100 }, requiredSkill: 'repairWorkshop' },
    archersMastery_item: { name: "Чертеж: Мастерство лучника", description: "Позволяет создавать мифриловые луки.", cost: { sparks: 35000, mithrilIngots: 50 }, requiredSkill: 'archersMastery' },
    adamantiteArmorCrafting_item: { name: "Чертеж: Адамантитовая ковка брони", description: "Позволяет ковать адамантитовые шлемы.", cost: { sparks: 70000, adamantiteIngots: 30 }, requiredSkill: 'adamantiteArmorCrafting' },
    arcaniteJewelry_item: { name: "Чертеж: Арканитовое ювелирное дело", description: "Позволяет создавать арканитовые амулеты.", cost: { sparks: 160000, arcaniteIngots: 8 }, requiredSkill: 'arcaniteJewelry' },
    jewelersKit_item: { name: "Чертеж: Набор ювелирных инструментов", description: "Позволяет создавать набор ювелирных инструментов из искростали.", cost: { sparks: 17000, sparksteelIngots: 22 }, requiredSkill: 'jewelersKit' },
    crossbowMastery_item: { name: "Чертеж: Мастер арбалетов", description: "Позволяет создавать арбалеты из искростали.", cost: { sparks: 16000, sparksteelIngots: 20 }, requiredSkill: 'crossbowMastery' },
    universalPincers_item: { name: "Чертеж: Универсальные клещи", description: "Открывает рецепт клещей из искростали.", cost: { sparks: 15000, sparksteelIngots: 15 }, requiredSkill: 'universalPincers' },
    armorPlating_item: { name: "Чертеж: Броневая ковка", description: "Позволяет создавать улучшенные бронепластины из искростали.", cost: { sparks: 18000, sparksteelIngots: 25 }, requiredSkill: 'armorPlating' },
    precisionChronometry_item: { name: "Чертеж: Точное хронометрирование", description: "Позволяет создавать часы из искростали.", cost: { sparks: 20000, sparksteelIngots: 30 }, requiredSkill: 'precisionChronometry' },
};
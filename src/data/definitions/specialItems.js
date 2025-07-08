// src/data/definitions/specialItems.js
import { IMAGE_PATHS } from '../../constants/paths';

export const specialItems = {
    gem: { name: "Редкий самоцвет", icon: "diamond", description: "Драгоценный камень, используемый в самых дорогих изделиях." },
    expeditionMap: { name: "Карта вылазки", description: "Открывает доступ к особой локации с добычей.", cost: { sparks: 1000, ironIngots: 10 }, requiredFaction: 'adventurers', requiredRep: 'respect' },

    // --- КОМПОНЕНТЫ АРТЕФАКТОВ ---
    blueprint_aegis: { name: 'Чертеж: Эгида', description: 'Схема для создания легендарного щита.', cost: { matter: 5000, sparks: 30000 }, requiredFaction: 'court', requiredRep: 'honor' },
    blueprint_hammer: { name: 'Чертеж: Молот', description: 'Схема для создания легендарного молота.', cost: { matter: 5000, sparks: 30000 }, requiredFaction: 'court', requiredRep: 'honor' },
    blueprint_crown: { name: 'Чертеж: Корона', description: 'Схема для создания легендарной короны.', cost: { matter: 5000, sparks: 30000 }, requiredFaction: 'court', requiredRep: 'honor' },
    blueprint_bastion: { name: "Чертеж: Бастион", description: 'Схема для создания Бастиона Несокрушимости.', cost: { matter: 10000, sparks: 50000 }, requiredFaction: 'court', requiredRep: 'exalted' },
    blueprint_quill: { name: "Чертеж: Перо", description: 'Схема для создания Пера Архивариуса.', cost: { matter: 10000, sparks: 50000 }, requiredFaction: 'court', requiredRep: 'exalted' },

    material_guardianHeart: { name: "Сердце стража", description: "Пульсирующее ядро древнего автоматона. Добывается по спецзаказу Лиги Авантюристов." },
    material_adamantFrame: { name: "Адамантиновая основа", description: "Слиток почти неразрушимого металла. Можно получить, инвестируя в торговые пути Гильдии." },
    material_lavaAgate: { name: "Лавовый агат", description: "Застывшая слеза вулкана." },
    material_ironwoodHandle: { name: "Рукоять из железного дерева", description: "Невероятно прочное дерево." },
    material_sunTear: { name: "Слеза солнца", description: "Кристалл, поглотивший солнечный свет." },
    material_purifiedGold: { name: "Очищенное золото", description: "Золото, свободное от любых примесей." },
    component_adamantiteCore: { name: "Адамантитовое ядро", description: "Сердце Бастиона. Тяжелое и прочное." },
    component_stabilizingGyroscope: { name: "Укрепляющий Сердечник", description: "Сложное устройство, использующее принципы резонанса для укрепления структуры любого материала." },
    component_purifiedMithril: { name: "Очищенный Мифрил", description: "Мифрил, избавленный от всех примесей." },
    component_focusingLens: { name: "Фокусирующая Линза", description: "Линза, преобразующая Искры в Материю." },

    // --- ИНДИВИДУАЛЬНЫЕ ЧЕРТЕЖИ ДЛЯ ПОКУПКИ ---
    // Железный век
    blueprint_ironHelmet: { name: "Чертеж: Железный шлем", description: "Позволяет ковать Железные шлемы.", cost: { sparks: 1500, ironIngots: 30 }, requiredSkill: 'betterTools' },
    blueprint_ironGreaves: { name: "Чертеж: Железные поножи", description: "Позволяет ковать Железные поножи.", cost: { sparks: 1500, ironIngots: 30 }, requiredSkill: 'betterTools' },
    blueprint_twoHandedAxe: { name: "Чертеж: Двуручный топор", description: "Позволяет ковать Двуручные топоры.", cost: { sparks: 2000, ironIngots: 40 }, requiredSkill: 'betterTools' },
    blueprint_reinforcedShield: { name: "Чертеж: Усиленный щит", description: "Позволяет ковать Усиленные щиты.", cost: { sparks: 2000, ironIngots: 40 }, requiredSkill: 'betterTools' },
    blueprint_ironCrowbar: { name: "Чертеж: Железный Лом", description: "Позволяет создавать Железные ломы.", cost: { sparks: 800, ironIngots: 20 }, requiredSkill: 'sturdyVice' },
    blueprint_ironVice: { name: "Чертеж: Железные Тиски", description: "Позволяет создавать Железные тиски.", cost: { sparks: 1200, ironIngots: 25 }, requiredSkill: 'sturdyVice' },
    blueprint_armorRepairKit: { name: "Чертеж: Ремкомплект для брони", description: "Позволяет создавать Ремкомплекты для брони.", cost: { sparks: 4000, copperIngots: 20 }, requiredSkill: 'durableGear' },
    
    // Медный и Бронзовый век
    blueprint_copperBracelet: { name: "Чертеж: Медный браслет", description: "Позволяет создавать Медные браслеты.", cost: { sparks: 3500, copperIngots: 30 }, requiredSkill: 'jewelryCrafting' },
    blueprint_copperAmulet: { name: "Чертеж: Медный амулет", description: "Позволяет создавать Медные амулеты.", cost: { sparks: 3500, copperIngots: 30 }, requiredSkill: 'jewelryCrafting' },
    blueprint_copperCauldron: { name: "Чертеж: Медный котелок", description: "Позволяет создавать Медные котелки.", cost: { sparks: 2800, copperIngots: 25 }, requiredSkill: 'findCopper' },
    blueprint_copperChain: { name: "Чертеж: Медная цепь", description: "Позволяет создавать Медные цепи.", cost: { sparks: 4000, copperIngots: 35 }, requiredSkill: 'chainWeaving' },
    blueprint_bronzeShield: { name: "Чертеж: Бронзовый щит", description: "Позволяет ковать Бронзовые щиты.", cost: { sparks: 8000, bronzeIngots: 20 }, requiredSkill: 'artOfAlloys' },
    blueprint_bronzeSword: { name: "Чертеж: Бронзовый меч", description: "Позволяет ковать Бронзовые мечи.", cost: { sparks: 9000, bronzeIngots: 25 }, requiredSkill: 'artOfAlloys' },
    blueprint_bronzeCuirass: { name: "Чертеж: Бронзовая кираса", description: "Позволяет ковать Бронзовые кирасы.", cost: { sparks: 10000, bronzeIngots: 30 }, requiredSkill: 'artOfAlloys' },
    blueprint_bronzeGauntlets: { name: "Чертеж: Бронзовые перчатки", description: "Позволяет ковать Бронзовые перчатки.", cost: { sparks: 8500, bronzeIngots: 22 }, requiredSkill: 'artOfAlloys' },
    blueprint_bronzeHelmet: { name: "Чертеж: Бронзовый шлем", description: "Позволяет ковать Бронзовые шлемы.", cost: { sparks: 8500, bronzeIngots: 22 }, requiredSkill: 'artOfAlloys' },
    blueprint_bronzeGreaves: { name: "Чертеж: Бронзовые поножи", description: "Позволяет ковать Бронзовые поножи.", cost: { sparks: 8500, bronzeIngots: 22 }, requiredSkill: 'artOfAlloys' },
    blueprint_bronzeGreataxe: { name: "Чертеж: Бронзовая секира", description: "Позволяет ковать Бронзовые секиры.", cost: { sparks: 9500, bronzeIngots: 28 }, requiredSkill: 'artOfAlloys' },
    blueprint_bronzeHammer: { name: "Чертеж: Бронзовый молот", description: "Позволяет создавать Бронзовые молоты.", cost: { sparks: 7500, bronzeIngots: 18 }, requiredSkill: 'artOfAlloys' },

    // Век Искростали
    blueprint_sparksteelMace: { name: "Чертеж: Булава из Искростали", description: "Позволяет ковать Булавы из Искростали.", cost: { sparks: 15000, sparksteelIngots: 10 }, requiredSkill: 'artOfAlloys' },
    blueprint_sparksteelToolset: { name: "Чертеж: Инструменты из Искростали", description: "Позволяет создавать наборы инструментов из Искростали.", cost: { sparks: 14000, sparksteelIngots: 8 }, requiredSkill: 'optimizedSmelting' },
    blueprint_sparksteelJewelersKit: { name: "Чертеж: Ювелирный набор", description: "Позволяет создавать ювелирные наборы из Искростали.", cost: { sparks: 18000, sparksteelIngots: 12 }, requiredSkill: 'jewelryCrafting' },
    blueprint_sparksteelCrossbow: { name: "Чертеж: Арбалет из Искростали", description: "Позволяет создавать арбалеты из Искростали.", cost: { sparks: 20000, sparksteelIngots: 15 }, requiredSkill: 'legendaryClients' },
    blueprint_sparksteelPincers: { name: "Чертеж: Клещи из Искростали", description: "Позволяет создавать клещи из Искростали.", cost: { sparks: 16000, sparksteelIngots: 9 }, requiredSkill: 'specializedToolmaking' },
    blueprint_sparksteelArmorPlates: { name: "Чертеж: Бронепластины из Искростали", description: "Позволяет создавать бронепластины из Искростали.", cost: { sparks: 19000, sparksteelIngots: 14 }, requiredSkill: 'efficientCrafting' },
    blueprint_sparksteelWatch: { name: "Чертеж: Часы из Искростали", description: "Позволяет создавать часы из Искростали.", cost: { sparks: 22000, sparksteelIngots: 18 }, requiredSkill: 'specializedToolmaking' },
    
    // Мифриловая Эпоха
    blueprint_mithrilDagger: { name: "Чертеж: Мифриловый кинжал", cost: { sparks: 35000, mithrilIngots: 10 }, requiredSkill: 'mithrilProspecting' },
    blueprint_mithrilShield: { name: "Чертеж: Мифриловый щит", cost: { sparks: 40000, mithrilIngots: 15 }, requiredSkill: 'mithrilProspecting' },
    blueprint_mithrilLongsword: { name: "Чертеж: Мифриловый длинный меч", cost: { sparks: 45000, mithrilIngots: 20 }, requiredSkill: 'mithrilProspecting' },
    blueprint_mithrilChainmail: { name: "Чертеж: Мифриловая кольчуга", cost: { sparks: 50000, mithrilIngots: 25 }, requiredSkill: 'mithrilProspecting' },
    blueprint_mithrilBow: { name: "Чертеж: Мифриловый лук", cost: { sparks: 48000, mithrilIngots: 22 }, requiredSkill: 'mithrilProspecting' },
    
    // Эпоха Легенд
    blueprint_ornateGreatsword: { name: "Чертеж: Богато украшенный меч", cost: { sparks: 70000, matter: 1000 }, requiredSkill: 'truePotential' },
    blueprint_royalCrown: { name: "Чертеж: Королевская корона", cost: { sparks: 75000, matter: 1200 }, requiredSkill: 'truePotential' },
    blueprint_adamantitePlatebody: { name: "Чертеж: Адамантитовый нагрудник", cost: { sparks: 80000, adamantiteIngots: 15 }, requiredSkill: 'adamantiteMining' },
    blueprint_arcaniteSpellblade: { name: "Чертеж: Небесный Клинок", cost: { sparks: 150000, arcaniteIngots: 5 }, requiredSkill: 'arcaneMetallurgy' },
    blueprint_adamantiteHelmet: { name: "Чертеж: Адамантитовый шлем", cost: { sparks: 78000, adamantiteIngots: 12 }, requiredSkill: 'adamantiteMining' },
    blueprint_arcaniteAmulet: { name: "Чертеж: Арканитовый амулет", cost: { sparks: 160000, arcaniteIngots: 3, matter: 500 }, requiredSkill: 'arcaneMetallurgy' },
};
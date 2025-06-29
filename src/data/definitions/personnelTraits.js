// src/data/definitions/personnelTraits.js

/**
 * Определения черт характера персонала.
 * * Структура:
 * - id: Уникальный идентификатор.
 * - name: Отображаемое имя.
 * - description: Описание для всплывающей подсказки.
 * - icon: Название иконки из Material Icons.
 * - type: 'positive' или 'negative'.
 * - rarity: 'common', 'uncommon', 'rare'.
 * - role (опционально): 'miner', 'smelter', etc. для особых черт.
 */
export const personnelTraits = {
    // --- СТАНДАРТНЫЕ ПОЛОЖИТЕЛЬНЫЕ ЧЕРТЫ ---
    workaholic: {
        id: 'workaholic', name: "Трудоголик",
        description: "Этот сотрудник работает немного быстрее, но его настроение падает быстрее.",
        icon: 'bolt', type: 'positive', rarity: 'uncommon',
    },
    optimist: {
        id: 'optimist', name: "Оптимист",
        description: "Всегда в хорошем настроении. Настроение падает медленнее.",
        icon: 'sentiment_very_satisfied', type: 'positive', rarity: 'common',
    },
    fast_learner: {
        id: 'fast_learner', name: "Быстро Учится",
        description: "Получает на 15% больше опыта.",
        icon: 'school', type: 'positive', rarity: 'uncommon',
    },
    thrifty: {
        id: 'thrifty', name: "Бережливый",
        description: "Требует на 10% меньше зарплаты (Искры).",
        icon: 'savings', type: 'positive', rarity: 'rare',
    },
    charismatic: {
        id: 'charismatic', name: "Харизматичный",
        description: "Повышает настроение всех остальных сотрудников.",
        icon: 'theater_comedy', type: 'positive', rarity: 'rare',
    },
    sturdy: {
        id: 'sturdy', name: "Крепкий",
        description: "Реже отдыхает и медленнее устает.",
        icon: 'fitness_center', type: 'positive', rarity: 'common',
    },

    // --- СТАНДАРТНЫЕ ОТРИЦАТЕЛЬНЫЕ ЧЕРТЫ ---
    pessimist: {
        id: 'pessimist', name: "Пессимист",
        description: "Всегда в плохом настроении. Настроение падает быстрее.",
        icon: 'sentiment_very_dissatisfied', type: 'negative', rarity: 'common',
    },
    lazy: {
        id: 'lazy', name: "Лентяй",
        description: "Работает на 10% медленнее.",
        icon: 'bed', type: 'negative', rarity: 'uncommon',
    },
    clumsy: {
        id: 'clumsy', name: "Неуклюжий",
        description: "Имеет небольшой шанс испортить часть ресурсов при работе.",
        icon: 'broken_image', type: 'negative', rarity: 'rare',
    },
    greedy: {
        id: 'greedy', name: "Жадный",
        description: "Требует на 20% больше зарплаты (Искры).",
        icon: 'paid', type: 'negative', rarity: 'uncommon',
    },
    sickly: {
        id: 'sickly', name: "Болезненный",
        description: "Чаще нуждается в отдыхе.",
        icon: 'sick', type: 'negative', rarity: 'common',
    },
    arrogant: {
        id: 'arrogant', name: "Надменный",
        description: "Снижает настроение всех остальных сотрудников.",
        icon: 'sentiment_neutral', type: 'negative', rarity: 'rare',
    },

    // --- ОСОБЫЕ ЧЕРТЫ: ШАХТЕР ---
    geologist: {
        id: 'geologist', name: "Геолог",
        description: "Имеет 5% шанс найти дополнительный редкий самоцвет при добыче.",
        icon: 'diamond', type: 'positive', rarity: 'rare', role: 'miner',
    },
    cave_dweller: {
        id: 'cave_dweller', name: "Житель пещер",
        description: "Скорость добычи увеличена на 15%, но требует больше зарплаты.",
        icon: 'dark_mode', type: 'positive', rarity: 'uncommon', role: 'miner',
    },
    claustrophobic: {
        id: 'claustrophobic', name: "Клаустрофоб",
        description: "Работает на 20% медленнее, если в шахте есть другие шахтеры.",
        icon: 'disabled_by_default', type: 'negative', rarity: 'uncommon', role: 'miner',
    },
    mole_hands: {
        id: 'mole_hands', name: "Руки-крота",
        description: "Добывает руду на 10% быстрее, но качество добываемого материала снижено.",
        icon: 'front_hand', type: 'negative', rarity: 'common', role: 'miner',
    },
    
    // --- ОСОБЫЕ ЧЕРТЫ: ПЛАВИЛЬЩИК ---
    heat_resistant: {
        id: 'heat_resistant', name: "Термостойкий",
        description: "Скорость плавки увеличена на 10%.",
        icon: 'local_fire_department', type: 'positive', rarity: 'uncommon', role: 'smelter',
    },
    alchemist_spark: {
        id: 'alchemist_spark', name: "Искра Алхимика",
        description: "Есть 2% шанс не потратить ресурсы при плавке слитков.",
        icon: 'science', type: 'positive', rarity: 'rare', role: 'smelter',
    },
    impatient_smelter: {
        id: 'impatient_smelter', name: "Нетерпеливый",
        description: "Плавит быстрее, но эффективность плавки снижена на 5%.",
        icon: 'hourglass_empty', type: 'negative', rarity: 'common', role: 'smelter',
    },
    careless_smelter: {
        id: 'careless_smelter', name: "Неосторожный",
        description: "Иногда добавляет в сплав не те компоненты, снижая его итоговое качество.",
        icon: 'error_outline', type: 'negative', rarity: 'uncommon', role: 'smelter',
    }
};
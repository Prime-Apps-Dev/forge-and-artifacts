// src/data/definitions/gameConfig.js

export const gameConfig = {
    orderTTL: 90,
    MASTERY_XP_LEVEL_START: 100, // Начальное XP для 1 уровня мастерства
    MASTERY_XP_LEVEL_MULTIPLIER: 1.15, // Множитель для более медленной прогрессии
    SHOP_REPUTATION_XP_PER_SALE: 50, // XP магазина за каждую продажу

    // Новые константы для начисления XP
    CRAFT_XP_PROGRESS_DIVIDER: 10, // Делитель прогресса для XP за крафт
    SALE_XP_SALE_PRICE_DIVIDER: 20, // Делитель цены продажи для XP за продажу
    QUEST_XP_SPARK_DIVIDER: 100, // Делитель искр для XP за квесты
    MISSION_XP_SPARK_DIVIDER: 50, // Делитель искр для миссии

    // Константы для перековки, инкрустации, гравировки
    REFORGE_BASE_RISK: 0.2, // Базовый шанс неудачи перековки
    REFORGE_QUALITY_DECREASE_MIN: 0.1, // Минимальное снижение качества при провале перековки
    REFORGE_QUALITY_DECREASE_RANDOM: 0.2, // Рандомная часть снижения качества
    REFORGE_QUALITY_INCREASE_MIN: 0.1, // Минимальное увеличение качества при успехе перековки
    REFORGE_QUALITY_INCREASE_RANDOM: 0.3, // Рандомная часть увеличения качества
    REFORGE_REQUIRED_PROGRESS: 1000, // Требуемый прогресс для перековки
    REFORGE_XP_QUALITY_MULTIPLIER: 10, // Множитель качества для XP перековки

    INLAY_BASE_RISK: 0.3, // Базовый шанс неудачи инкрустации
    INLAY_QUALITY_BONUS: 0.5, // Бонус к качеству от инкрустации
    INLAY_QUALITY_INCREASE_MIN: 0.1, // Минимальное увеличение качества при успехе инкрустации
    INLAY_QUALITY_INCREASE_RANDOM: 0.2, // Рандомная часть увеличения качества
    INLAY_REQUIRED_PROGRESS: 800, // Требуемый прогресс для инкрустации
    INLAY_XP_QUALITY_MULTIPLIER: 15, // Множитель качества для XP инкрустации

    GRAVING_BASE_RISK: 0.25, // Базовый шанс неудачи гравировки
    GRAVING_REQUIRED_PROGRESS: 1200, // Требуемый прогресс для гравировки
    GRAVING_XP_LEVEL_MULTIPLIER: 20, // Множитель уровня гравировки для XP

    // Шансы для генерации заказов
    RISKY_ORDER_BASE_CHANCE: 0.05, // Базовый шанс появления рискованного заказа
    RISKY_ORDER_LOCKED_SHOP_CHANCE: 0.15, // Шанс рискованного заказа при заблокированном магазине
    COLLECTOR_ORDER_CHANCE: 0.02, // Шанс появления заказа от коллекционера (если есть гравировка)

    RISKY_ORDER_SPARK_PENALTY_MIN_MULTIPLIER: 0.05, // Минимальный множитель штрафа искр за рискованный заказ
    RISKY_ORDER_SPARK_PENALTY_RANDOM_MULTIPLIER: 0.15, // Рандомный множитель штрафа искр
    SHOP_LOCK_DURATION_MIN: 30, // Минимальная длительность блокировки магазина в секундах
    SHOP_LOCK_DURATION_RANDOM_MULTIPLIER: 1, // Рандомный множитель длительности блокировки
    RISKY_ORDER_BROKEN_TOOL_DURATION: 60, // Длительность дебаффа сломанного инструмента

    ORDER_QUEUE_MAX_LENGTH: 5, // Максимальное количество заказов в очереди
    FACTION_ORDER_SKILL_BONUS: 0.1, // Бонус к шансу фракционного заказа от навыка "Контракты Гильдии"
    FACTION_ORDER_REPUTATION_DIVIDER: 1000, // Делитель общей репутации для шанса фракционного заказа

    PROGRESS_PER_SALE_CLICK: 10, // Прогресс за клик по продаже в магазине
    SALE_BASE_PRICE_MULTIPLIER: 10, // Базовый множитель цены продажи
    SALE_REQUIRED_PROGRESS_MULTIPLIER: 10, // Множитель для требуемого прогресса продажи

    // Новые константы для мини-игр
    MINIGAME_MAX_DURATION: 10, // Максимальная длительность мини-игры в секундах (для плавного перехода)
    MINIGAME_PENALTY_QUALITY_DECREASE: 0.1, // Штраф к качеству при провале мини-игры
    MINIGAME_QUALITY_ZONE_MIN_SIZE: 10, // Минимальный размер зоны качества для "Зажать и отпустить"
    MINIGAME_QUALITY_ZONE_MAX_SIZE: 20, // Максимальный размер зоны качества для "Зажать и отпустить"
    MINIGAME_PERFECT_ZONE_MIN_SIZE: 2, // Минимальный размер идеальной зоны для "Зажать и отпустить"
    MINIGAME_PERFECT_ZONE_MAX_SIZE: 5, // Максимальный размер идеальной зоны для "Зажать и отпустить"
    MINIGAME_CLICK_POINTS_COUNT_MIN: 3, // Минимальное количество точек для "Клик по точкам"
    MINIGAME_CLICK_POINTS_COUNT_MAX: 10, // Максимальное количество точек для "Клик по точкам"
    MINIGAME_CLICK_POINT_LIFETIME_MS: 1500, // Время жизни точки в мс (чем сложнее, тем меньше)
    MINIGAME_CLICK_POINT_FADE_SPEED: 0.05, // Скорость уменьшения прозрачности точки
};
// src/data/definitions/craftingEvents.js

/**
 * Определения случайных событий во время крафта.
 * * - id: Уникальный идентификатор.
 * - name: Название события для уведомления.
 * - description: Описание эффекта для всплывающей подсказки или лога.
 * - type: 'positive' или 'negative'.
 * - duration_type: 'clicks' или 'seconds'.
 * - duration: Длительность эффекта.
 * - isImmediate: true, если эффект применяется мгновенно и не добавляется в очередь.
 */
export const craftingEvents = {
    // --- Позитивные события ---
    inspiration: {
        id: 'inspiration',
        name: 'Вдохновение!',
        description: 'Следующий удар будет критическим!',
        type: 'positive',
        duration_type: 'clicks',
        duration: 1,
    },
    lucky_strike: {
        id: 'lucky_strike',
        name: 'Удачный удар!',
        description: 'Вы мгновенно получаете дополнительный прогресс.',
        type: 'positive',
        isImmediate: true,
    },
    resource_find: {
        id: 'resource_find',
        name: 'Ценная находка!',
        description: 'Вы нашли немного руды в процессе работы.',
        type: 'positive',
        isImmediate: true,
    },
    master_touch: {
        id: 'master_touch',
        name: 'Касание мастера!',
        description: 'Следующая мини-игра будет значительно проще.',
        type: 'positive',
        duration_type: 'seconds',
        duration: 30,
    },
    sudden_insight: {
        id: 'sudden_insight',
        name: 'Внезапное озарение!',
        description: 'Ваше понимание Материи углубляется.',
        type: 'positive',
        isImmediate: true,
    },

    // --- Негативные события ---
    brittle_metal: {
        id: 'brittle_metal',
        name: 'Хрупкий металл...',
        description: 'Следующие 5 ударов приносят на 50% меньше прогресса.',
        type: 'negative',
        duration_type: 'clicks',
        duration: 5,
    },
    slippery_grip: {
        id: 'slippery_grip',
        name: 'Скользкая рукоять!',
        description: 'Вы обронили несколько искр.',
        type: 'negative',
        isImmediate: true,
    },
    distraction: {
        id: 'distraction',
        name: 'Отвлечение...',
        description: 'Следующий удар не принесёт прогресса.',
        type: 'negative',
        duration_type: 'clicks',
        duration: 1,
    },
    moment_of_doubt: {
        id: 'moment_of_doubt',
        name: 'Момент сомнения...',
        description: 'Точность ваших рук временно снижена.',
        type: 'negative',
        duration_type: 'seconds',
        duration: 20,
    },
    tool_wear: {
        id: 'tool_wear',
        name: 'Износ инструмента.',
        description: 'Ваш инструмент затупился, снижая прогресс от ударов на 10 секунд.',
        type: 'negative',
        duration_type: 'seconds',
        duration: 10,
    }
};
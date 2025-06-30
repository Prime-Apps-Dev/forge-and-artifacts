// src/data/definitions/bulletinBoardOrders.js

export const bulletinBoardOrders = [
    {
        id: 'bb_order_001',
        title: "Щит для Гвардейца",
        description: "Капитан городской стражи требует партию бронзовых щитов исключительного качества для своих лучших бойцов. Он не потерпит брака.",
        requirements: [
            { type: 'quality', itemKey: 'bronzeShield', value: 3.0, comparison: 'gte' },
            { type: 'count', itemKey: 'bronzeShield', value: 3 },
        ],
        reward: {
            sparks: 25000,
            matter: 500,
            reputation: { court: 75 }
        },
        timeLimitHours: 48,
    },
    {
        id: 'bb_order_002',
        title: "Безупречный Клинок",
        description: "Загадочный коллекционер желает приобрести бронзовый меч, выкованный без единого критического удара. Он ценит чистоту процесса.",
        requirements: [
            { type: 'quality', itemKey: 'bronzeSword', value: 2.0, comparison: 'gte' },
            { type: 'craftingStat', stat: 'critSuccessCount', value: 0, comparison: 'eq' },
            { type: 'count', itemKey: 'bronzeSword', value: 1 },
        ],
        reward: {
            sparks: 35000,
            specialItems: { gem: 2 }
        },
        timeLimitHours: 24,
    },
    {
        id: 'bb_order_003',
        title: "Срочная Поставка",
        description: "Торговой Гильдии срочно требуется 10 комплектов медных амулетов. Они готовы хорошо заплатить за скорость.",
        requirements: [
            { type: 'count', itemKey: 'copperAmulet', value: 10 },
        ],
        reward: {
            sparks: 15000,
            reputation: { merchants: 100 }
        },
        timeLimitHours: 12,
    },
    {
        id: 'bb_order_004',
        title: "Шедевр Оружейника",
        description: "Лига Авантюристов ищет мастера, способного выковать булаву из Искростали непревзойденного качества, чтобы одолеть магического зверя.",
        requirements: [
            { type: 'quality', itemKey: 'sparksteelMace', value: 5.0, comparison: 'gte' },
            { type: 'count', itemKey: 'sparksteelMace', value: 1 },
        ],
        reward: {
            matter: 1000,
            reputation: { adventurers: 150 },
            specialItems: { expeditionMap: 1 }
        },
        timeLimitHours: 72,
    },
    // Можно добавить еще заказы для разнообразия
];
// src/data/definitions/eternalSkills.js

export const eternalSkills = {
    // ===========================================
    // --- Ветка: Торговая Империя ---
    // Фокус: Экономика, торговля, доход, скорость продажи.
    // ===========================================
    eternal_merchant_insight: {
        id: 'eternal_merchant_insight',
        name: "Вечный Торговый Инсайт",
        description: "Увеличивает базовую награду в Искрах от всех заказов на 5%.",
        icon: "monetization_on",
        cost: { prestigePoints: 10 },
        requires: [],
        apply: (state) => { state.sparksModifier += 0.05; }
    },
    eternal_logistics: {
        id: 'eternal_logistics',
        name: "Вечная Логистика",
        description: "Увеличивает скорость продажи предметов в вашем магазине на 10%.",
        icon: "local_shipping",
        cost: { prestigePoints: 15 },
        requires: ['eternal_merchant_insight'],
        apply: (state) => { state.playerShopSalesSpeedModifier += 0.1; }
    },
    eternal_market_dominance: {
        id: 'eternal_market_dominance',
        name: "Вечное Доминирование на Рынке",
        description: "Снижает цену покупки ресурсов на рынке на 5%.",
        icon: "storefront",
        cost: { prestigePoints: 25 },
        requires: ['eternal_logistics'],
        apply: (state) => { state.marketBuyModifier -= 0.05; } // Пример, если модификатор работает как 1 - X%
    },
    eternal_caravans: {
        id: 'eternal_caravans',
        name: "Вечные Караваны",
        description: "Открывает пассивный доход в Искрах (+1/сек).",
        icon: "train",
        cost: { prestigePoints: 40 },
        requires: ['eternal_market_dominance'],
        apply: (state) => { state.passiveGeneration.sparks += 1; } // Пример, если passiveGeneration может включать искры
    },

    // ===========================================
    // --- Ветка: Технологическое Превосходство ---
    // Фокус: Эффективность крафта, качество, снижение затрат.
    // ===========================================
    eternal_precision_crafting: {
        id: 'eternal_precision_crafting',
        name: "Вечная Точность Крафта",
        description: "Увеличивает базовый прогресс за клик на 1.",
        icon: "precision_manufacturing",
        cost: { prestigePoints: 10 },
        requires: [],
        apply: (state) => { state.progressPerClick += 1; }
    },
    eternal_material_efficiency: {
        id: 'eternal_material_efficiency',
        name: "Вечная Эффективность Материалов",
        description: "Снижает стоимость всех компонентов на 1 ед.",
        icon: "recycling",
        cost: { prestigePoints: 15 },
        requires: ['eternal_precision_crafting'],
        apply: (state) => { state.componentCostReduction += 1; }
    },
    eternal_crit_mastery: {
        id: 'eternal_crit_mastery',
        name: "Вечное Мастерство Крита",
        description: "Увеличивает шанс критического удара на 5%.",
        icon: "star_half",
        cost: { prestigePoints: 25 },
        requires: ['eternal_material_efficiency'],
        apply: (state) => { state.critChance += 0.05; }
    },
    eternal_perfect_graving: {
        id: 'eternal_perfect_graving',
        name: "Вечная Идеальная Гравировка",
        description: "Увеличивает уровень гравировки на всех новых предметах на 1.",
        icon: "brush",
        cost: { prestigePoints: 40 },
        requires: ['eternal_crit_mastery'],
        apply: (state) => { state.initialGravingLevel = (state.initialGravingLevel || 0) + 1; } // Новое поле для gameState
    },

    // ===========================================
    // --- Ветка: Геополитика и Влияние ---
    // Фокус: Репутация, разблокировка регионов, особые квесты.
    // ===========================================
    eternal_diplomacy: {
        id: 'eternal_diplomacy',
        name: "Вечная Дипломатия",
        description: "Увеличивает прирост репутации со всеми фракциями на 10%.",
        icon: "gavel",
        cost: { prestigePoints: 10 },
        requires: [],
        apply: (state) => {
            for (const factionId in state.reputationGainModifier) {
                state.reputationGainModifier[factionId] += 0.1;
            }
        }
    },
    eternal_regional_unlock: {
        id: 'eternal_regional_unlock',
        name: "Вечное Региональное Открытие",
        description: "Снижает требования Осколков Памяти для разблокировки регионов на 10%.",
        icon: "map",
        cost: { prestigePoints: 20 },
        requires: ['eternal_diplomacy'],
        apply: (state) => { state.regionUnlockCostReduction = (state.regionUnlockCostReduction || 0) + 0.1; } // Новое поле для gameState
    },
    eternal_quest_master: {
        id: 'eternal_quest_master',
        name: "Вечный Мастер Квестов",
        description: "Увеличивает награды в Искрах и Материи от выполнения квестов на 15%.",
        icon: "assignment_turned_in",
        cost: { prestigePoints: 30 },
        requires: ['eternal_regional_unlock'],
        apply: (state) => {
            state.questRewardModifier = (state.questRewardModifier || 1.0) + 0.15;
        }
    }
};
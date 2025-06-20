// src/data/definitions/achievements.js

export const achievements = {
    // --- Главная цель ---
    main_goal: {
        id: 'main_goal',
        category: 'Главная Цель',
        title: 'Эхо Древних Мастеров',
        description: 'Мастер, создавший все Великие Артефакты, получает небывалое вдохновение, увеличивающее базовый доход в Искрах и Материи на 5%.',
        effectName: 'Вдохновение Мастера',
        icon: '/img/achievements/main_goal.png', // <-- НОВОЕ ПОЛЕ ICON
        check: (state, defs) => {
            const completed = Object.values(state.artifacts).filter(a => a.status === 'completed').length;
            const total = Object.keys(defs.greatArtifacts).length;
            return { current: completed, target: total, isComplete: completed >= total };
        },
        apply: (state) => {
            state.sparksModifier += 0.05;
            state.matterModifier += 0.05;
            console.log("Достижение 'Создать все Великие Артефакты' применено: +5% к Искрам и Материи.");
        }
    },
    // --- Цели по фракциям ---
    faction_merchants: {
        id: 'faction_merchants',
        category: 'Репутация',
        title: 'Золотые Нити Доверия',
        description: 'Ваша безупречная репутация с Торговой Гильдией делает вас желанным партнером, ускоряя продажу товаров в вашем магазине на 5%.',
        effectName: 'Признание Гильдии',
        icon: '/img/achievements/faction_merchants.png', // <-- НОВОЕ ПОЛЕ ICON
        check: (state, defs) => {
            const exaltedThreshold = defs.reputationLevels.find(l => l.id === 'exalted').threshold;
            const currentRep = state.reputation.merchants || 0;
            return { current: currentRep, target: exaltedThreshold, isComplete: currentRep >= exaltedThreshold };
        },
        apply: (state) => {
            state.playerShopSalesSpeedModifier += 0.05;
            console.log("Достижение 'Превознесение у Торговцев' применено: +5% к скорости продажи.");
        }
    },
    faction_adventurers: {
        id: 'faction_adventurers',
        category: 'Репутация',
        title: 'Путь Неустрашимого',
        description: 'Ваш авторитет среди Авантюристов вдохновляет вас на более смелые удары, увеличивая прогресс за клик на 2.',
        effectName: 'Смелость Авантюриста',
        icon: '/img/achievements/faction_adventurers.png', // <-- НОВОЕ ПОЛЕ ICON
        check: (state, defs) => {
            const exaltedThreshold = defs.reputationLevels.find(l => l.id === 'exalted').threshold;
            const currentRep = state.reputation.adventurers || 0;
            return { current: currentRep, target: exaltedThreshold, isComplete: currentRep >= exaltedThreshold };
        },
        apply: (state) => {
            state.progressPerClick += 2;
            console.log("Достижение 'Превознесение у Авантюристов' применено: +2 к прогрессу за клик.");
        }
    },
    faction_court: {
        id: 'faction_court',
        category: 'Репутация',
        title: 'Корона Благосклонности',
        description: 'Благосклонность Королевского Двора открывает вам доступ к редким материалам, снижая стоимость Материи для навыков на 10%.',
        effectName: 'Благословение Короны',
        icon: '/img/achievements/faction_court.png', // <-- НОВОЕ ПОЛЕ ICON
        check: (state, defs) => {
            const exaltedThreshold = defs.reputationLevels.find(l => l.id === 'exalted').threshold;
            const currentRep = state.reputation.court || 0;
            return { current: currentRep, target: exaltedThreshold, isComplete: currentRep >= exaltedThreshold };
        },
        apply: (state) => {
            state.matterCostReduction += 0.10;
            console.log("Достижение 'Превознесение у Королевского Двора' применено: -10% к стоимости Материи.");
        }
    },
    // --- Цели мастерства ---
    mastery_skills: {
        id: 'mastery_skills',
        category: 'Мастерство',
        title: 'Энциклопедия Знаний',
        description: 'Изучение всех доступных навыков делает вас настоящим полиматом, значительно повышая эффективность ваших подмастерьев на 10%.',
        effectName: 'Мудрость Полимата',
        icon: '/img/achievements/mastery_skills.png', // <-- НОВОЕ ПОЛЕ ICON
        check: (state, defs) => {
            const completed = Object.keys(state.purchasedSkills).length;
            const availableSkillsInCurrentPlaythrough = Object.values(defs.skills).filter(skill =>
                !state.isFirstPlaythrough || !skill.firstPlaythroughLocked
            ).length;

            return { current: completed, target: availableSkillsInCurrentPlaythrough, isComplete: completed >= availableSkillsInCurrentPlaythrough };
        },
        apply: (state) => {
            state.passiveIncomeModifier += 0.10;
            console.log("Достижение 'Изучить все навыки' применено: +10% к эффективности подмастерьев.");
        }
    },
    mastery_quests: {
        id: 'mastery_quests',
        category: 'Мастерство',
        title: 'Хранитель Легенд',
        description: 'Выполнение всех особых заданий доказывает вашу универсальность и увеличивает награды в Искрах и Материи от квестов на 10%.',
        effectName: 'Заслуги Искателя',
        icon: '/img/achievements/mastery_quests.png', // <-- НОВОЕ ПОЛЕ ICON
        check: (state, defs) => {
            const completed = state.journal.completedQuests.length;
            const total = Object.keys(defs.quests).length;
            return { current: completed, target: total, isComplete: completed >= total };
        },
        apply: (state) => {
            state.questRewardModifier += 0.10;
            console.log("Достижение 'Выполнить все задания' применено: +10% к наградам за квесты.");
        }
    },
    mastery_personnel: {
        id: 'mastery_personnel',
        category: 'Мастерство',
        title: 'Легион Помощников',
        description: 'Максимальное развитие вашего персонала приводит к открытию новых, более эффективных методов добычи, увеличивая пассивную генерацию всей руды на 0.2/сек.',
        effectName: 'Армия Подмастерьев',
        icon: '/img/achievements/mastery_personnel.png', // <-- НОВОЕ ПОЛЕ ICON
        check: (state, defs) => {
            let completed = 0;
            const total = Object.keys(defs.personnel).length;
            Object.keys(defs.personnel).forEach(id => {
                const level = state.upgradeLevels[id] || 0;
                if (level >= defs.personnel[id].maxLevel) {
                    completed++;
                }
            });
            return { current: completed, target: total, isComplete: completed >= total };
        },
        apply: (state) => {
            state.passiveGeneration.ironOre += 0.2;
            state.passiveGeneration.copperOre += 0.2;
            state.passiveGeneration.mithrilOre = (state.passiveGeneration.mithrilOre || 0) + 0.2;
            state.passiveGeneration.adamantiteOre = (state.passiveGeneration.adamantiteOre || 0) + 0.2;
            console.log("Достижение 'Макс. персонал' применено: +0.2 к пассивной добыче руды.");
        }
    },
    first_forge: {
        id: 'first_forge',
        category: 'Кузнечное Дело',
        title: 'Первые Искры',
        description: 'Вы выковали свой первый предмет. Получите скромное вознаграждение, чтобы продолжить свой путь.',
        effectName: '+500 Искр',
        icon: '/img/achievements/first_forge.png',
        check: (state, defs) => {
            // ИЗМЕНЕНО: Проверяем totalItemsCrafted
            return { current: state.totalItemsCrafted, target: 1, isComplete: state.totalItemsCrafted >= 1 };
        },
        apply: (state) => {
            state.sparks += 500;
            console.log("Достижение 'Первые Искры' применено: +500 Искр.");
        }
    },
    master_smelter: {
        id: 'master_smelter',
        category: 'Мастерство',
        title: 'Плавильный Тигель',
        description: 'Вы переплавили 100 слитков. Ваши знания о металлах углубляются, увеличивая скорость плавки на 5%.',
        effectName: '+5% к скорости плавки',
        icon: '/img/achievements/master_smelter.png',
        check: (state, defs) => {
            // ИЗМЕНЕНО: Проверяем totalIngotsSmelted
            return { current: state.totalIngotsSmelted || 0, target: 100, isComplete: (state.totalIngotsSmelted || 0) >= 100 };
        },
        apply: (state) => {
            state.smeltingSpeedModifier += 0.05;
            console.log("Достижение 'Плавильный Тигель' применено: +5% к скорости плавки.");
        }
    },
    first_apprentice_hire: {
        id: 'first_apprentice_hire',
        category: 'Персонал',
        title: 'Первый Ученик',
        description: 'Вы наняли своего первого подмастерья. Он приносит вам вдохновение, увеличивая пассивную добычу железной руды на 0.1/сек.',
        effectName: '+0.1/сек Железной Руды',
        icon: '/img/achievements/first_apprentice_hire.png', // <-- НОВОЕ ПОЛЕ ICON
        check: (state, defs) => {
            const hasApprentice = Object.values(defs.personnel).some(p => (state.upgradeLevels[p.id] || 0) > 0);
            return { current: hasApprentice ? 1 : 0, target: 1, isComplete: hasApprentice };
        },
        apply: (state) => {
            state.passiveGeneration.ironOre += 0.1;
            console.log("Достижение 'Первый Ученик' применено: +0.1/сек Железной Руды.");
        }
    },
    shop_expansion: {
        id: 'shop_expansion',
        category: 'Магазин',
        title: 'Магазинное Пространство',
        description: 'Вы продали 5 предметов в вашем магазине. Ваше дело расширяется, и вы открываете новую торговую полку.',
        effectName: '+1 Торговая Полка',
        icon: '/img/achievements/shop_expansion.png', // <-- НОВОЕ ПОЛЕ ICON
        check: (state, defs) => {
            return { current: state.shopReputation, target: 500, isComplete: state.shopReputation >= 500 };
        },
        apply: (state) => {
            if (!state.completedAchievements.includes('shop_expansion_applied')) {
                state.shopShelves.push({ itemId: null, customer: null, saleProgress: 0, saleTimer: 0 });
                state.completedAchievements.push('shop_expansion_applied');
            }
            console.log("Достижение 'Магазинное Пространство' применено: +1 Торговая Полка.");
        }
    }
};
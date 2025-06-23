// src/data/definitions/achievements.js
import { IMAGE_PATHS } from '../../constants/paths';

export const achievements = {
    main_goal: {
        id: 'main_goal',
        category: 'Главная Цель',
        title: 'Эхо Древних Мастеров',
        description: 'Мастер, создавший все Великие Артефакты, получает небывалое вдохновение, увеличивающее базовый доход в Искрах и Материи на 5%.',
        effectName: 'Вдохновение Мастера',
        icon: IMAGE_PATHS.ACHIEVEMENTS.MAIN_GOAL,
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
    faction_merchants: {
        id: 'faction_merchants',
        category: 'Репутация',
        title: 'Золотые Нити Доверия',
        description: 'Ваша безупречная репутация с Торговой Гильдией делает вас желанным партнером, ускоряя продажу товаров в вашем магазине на 5%.',
        effectName: 'Признание Гильдии',
        icon: IMAGE_PATHS.ACHIEVEMENTS.FACTION_MERCHANTS,
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
        icon: IMAGE_PATHS.ACHIEVEMENTS.FACTION_ADVENTURERS,
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
        icon: IMAGE_PATHS.ACHIEVEMENTS.FACTION_COURT,
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
    mastery_skills: {
        id: 'mastery_skills',
        category: 'Мастерство',
        title: 'Энциклопедия Знаний',
        description: 'Изучение всех доступных навыков делает вас настоящим полиматом, значительно повышая эффективность ваших подмастерьев на 10%.',
        effectName: 'Мудрость Полимата',
        icon: IMAGE_PATHS.ACHIEVEMENTS.MASTERY_SKILLS,
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
        icon: IMAGE_PATHS.ACHIEVEMENTS.MASTERY_QUESTS,
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
        icon: IMAGE_PATHS.ACHIEVEMENTS.MASTERY_PERSONNEL,
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
        icon: IMAGE_PATHS.ACHIEVEMENTS.FIRST_FORGE,
        check: (state, defs) => {
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
        icon: IMAGE_PATHS.ACHIEVEMENTS.MASTER_SMELTER,
        check: (state, defs) => {
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
        icon: IMAGE_PATHS.ACHIEVEMENTS.FIRST_APPRENTICE_HIRE,
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
        icon: IMAGE_PATHS.ACHIEVEMENTS.SHOP_EXPANSION,
        check: (state, defs) => {
            return { current: state.shopReputation, target: 500, isComplete: state.shopReputation >= 500 };
        },
        apply: (state) => {
            // Эта проверка должна быть в gameLogic, но оставлю ее здесь пока для ясности.
            // Применение награды в gameLogic должно быть помечено через appliedAchievementRewards
            if (!state.completedAchievements.includes('shop_expansion_applied')) { // Это некорректная проверка здесь
                state.shopShelves.push({ itemId: null, customer: null, saleProgress: 0, saleTimer: 0 });
                state.completedAchievements.push('shop_expansion_applied'); // Это тоже некорректно
            }
            console.log("Достижение 'Магазинное Пространство' применено: +1 Торговая Полка.");
        }
    },
    novice_collector: {
        id: 'novice_collector',
        category: 'Коллекционирование',
        title: 'Начинающий Коллекционер',
        description: 'Соберите различные предметы и станьте признанным ценителем редкостей.',
        effectName: '+1% к шансу крит. удара',
        icon: IMAGE_PATHS.ACHIEVEMENTS.NOVICE_COLLECTOR,
        levels: [
            { target: 5, reward: { critChance: 0.01 }, effectName: '+1% к шансу крит. удара (Ур.1)' },
            { target: 15, reward: { critChance: 0.02 }, effectName: '+2% к шансу крит. удара (Ур.2)' }
        ],
        check: (state, defs) => {
            const uniqueItems = new Set(state.inventory.map(item => item.itemKey));
            let currentLevel = 0;
            const currentTotal = uniqueItems.size;

            for (let i = 0; i < achievements.novice_collector.levels.length; i++) {
                if (currentTotal >= achievements.novice_collector.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.novice_collector.levels[currentLevel]?.target || currentTotal;

            return {
                current: currentTotal,
                target: targetForNextLevel,
                isComplete: currentLevel === achievements.novice_collector.levels.length,
                currentLevel: currentLevel // Добавил текущий уровень для удобства в gameLogic
            };
        },
        apply: (state, levelReward) => { // Теперь apply принимает levelReward
            if (levelReward.critChance) state.critChance += levelReward.critChance;
            console.log(`Достижение 'Начинающий Коллекционер' применено: +${(levelReward.critChance * 100).toFixed(0)}% к шансу крит. удара.`);
        }
    },
    resource_tycoon: {
        id: 'resource_tycoon',
        category: 'Ресурсы',
        title: 'Магнат Ресурсов',
        description: 'Накопите огромные запасы сырья.',
        effectName: '+1 к добыче руды за клик',
        icon: IMAGE_PATHS.ACHIEVEMENTS.RESOURCE_TYCOON,
        levels: [
            { target: 1000, reward: { orePerClick: 1 }, effectName: '+1 к добыче руды за клик (Ур.1)' },
            { target: 10000, reward: { orePerClick: 1 }, effectName: '+1 к добыче руды за клик (Ур.2)' }
        ],
        check: (state, defs) => {
            const totalOre = (state.ironOre || 0) + (state.copperOre || 0) + (state.mithrilOre || 0) + (state.adamantiteOre || 0);
            let currentLevel = 0;
            const currentTotal = totalOre;

            for (let i = 0; i < achievements.resource_tycoon.levels.length; i++) {
                if (currentTotal >= achievements.resource_tycoon.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.resource_tycoon.levels[currentLevel]?.target || currentTotal;

            return {
                current: currentTotal,
                target: targetForNextLevel,
                isComplete: currentLevel === achievements.resource_tycoon.levels.length,
                currentLevel: currentLevel
            };
        },
        apply: (state, levelReward) => {
            if (levelReward.orePerClick) state.orePerClick += levelReward.orePerClick;
            console.log(`Достижение 'Магнат Ресурсов' применено: +${levelReward.orePerClick} к добыче руды за клик.`);
        }
    },
    inlay_master: {
        id: 'inlay_master',
        category: 'Мастерство',
        title: 'Мастер Инкрустации',
        description: 'Ваши навыки инкрустации поражают. Каждый инкрустированный предмет улучшает ваши общие способности.',
        effectName: '+5% к бонусной Материи от заказов',
        icon: IMAGE_PATHS.ACHIEVEMENTS.INLAY_MASTER,
        levels: [
            { target: 1, reward: { matterModifier: 0.05 }, effectName: '+5% к бонусной Материи от заказов (Ур.1)' },
            { target: 5, reward: { matterModifier: 0.05 }, effectName: '+5% к бонусной Материи от заказов (Ур.2)' }
        ],
        check: (state, defs) => {
            const totalInlayedItems = state.totalInlayedItems || 0;
            let currentLevel = 0;
            const currentTotal = totalInlayedItems;

            for (let i = 0; i < achievements.inlay_master.levels.length; i++) {
                if (currentTotal >= achievements.inlay_master.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.inlay_master.levels[currentLevel]?.target || currentTotal;

            return {
                current: currentTotal,
                target: targetForNextLevel,
                isComplete: currentLevel === achievements.inlay_master.levels.length,
                currentLevel: currentLevel
            };
        },
        apply: (state, levelReward) => {
            if (levelReward.matterModifier) state.matterModifier += levelReward.matterModifier;
            console.log(`Достижение 'Мастер Инкрустации' применено: +${(levelReward.matterModifier * 100).toFixed(0)}% к бонусной Материи.`);
        }
    },
    graving_legend: {
        id: 'graving_legend',
        category: 'Мастерство',
        title: 'Гравировщик Легенд',
        description: 'Ваша гравировка безупречна. Гравированные предметы приносят вам больше Искр.',
        effectName: '+5% к бонусным Искрам от заказов',
        icon: IMAGE_PATHS.ACHIEVEMENTS.GRAVING_LEGEND,
        levels: [
            { target: 1, reward: { sparksModifier: 0.05 }, effectName: '+5% к бонусным Искрам от заказов (Ур.1)' },
            { target: 5, reward: { sparksModifier: 0.05 }, effectName: '+5% к бонусным Искрам от заказов (Ур.2)' }
        ],
        check: (state, defs) => {
            const totalGravedItems = state.totalGravedItems || 0;
            let currentLevel = 0;
            const currentTotal = totalGravedItems;

            for (let i = 0; i < achievements.graving_legend.levels.length; i++) {
                if (currentTotal >= achievements.graving_legend.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.graving_legend.levels[currentLevel]?.target || currentTotal;

            return {
                current: currentTotal,
                target: targetForNextLevel,
                isComplete: currentLevel === achievements.graving_legend.levels.length,
                currentLevel: currentLevel
            };
        },
        apply: (state, levelReward) => {
            if (levelReward.sparksModifier) state.sparksModifier += levelReward.sparksModifier;
            console.log(`Достижение 'Гравировщик Легенд' применено: +${(levelReward.sparksModifier * 100).toFixed(0)}% к бонусным Искрам.`);
        }
    },
    veteran_crafter: {
        id: 'veteran_crafter',
        category: 'Кузнечное Дело',
        title: 'Кузнец-Ветеран',
        description: 'Вы стали опытным ремесленником, создав множество предметов.',
        effectName: '+1 к прогрессу за клик',
        icon: IMAGE_PATHS.ACHIEVEMENTS.VETERAN_CRAFTER,
        levels: [
            { target: 10, reward: { progressPerClick: 1 }, effectName: '+1 к прогрессу за клик (Ур.1)' },
            { target: 50, reward: { progressPerClick: 1 }, effectName: '+1 к прогрессу за клик (Ур.2)' }
        ],
        check: (state, defs) => {
            const totalItems = state.totalItemsCrafted || 0;
            let currentLevel = 0;
            const currentTotal = totalItems;

            for (let i = 0; i < achievements.veteran_crafter.levels.length; i++) {
                if (currentTotal >= achievements.veteran_crafter.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.veteran_crafter.levels[currentLevel]?.target || currentTotal;

            return {
                current: currentTotal,
                target: targetForNextLevel,
                isComplete: currentLevel === achievements.veteran_crafter.levels.length,
                currentLevel: currentLevel
            };
        },
        apply: (state, levelReward) => {
            if (levelReward.progressPerClick) state.progressPerClick += levelReward.progressPerClick;
            console.log(`Достижение 'Кузнец-Ветеран' применено: +${levelReward.progressPerClick} к прогрессу за клик.`);
        }
    },
    diligent_smelter: {
        id: 'diligent_smelter',
        category: 'Мастерство',
        title: 'Усердный Плавильщик',
        description: 'Ваши знания о металлах углубляются с каждой переплавленной партией.',
        effectName: '+5% к скорости плавки',
        icon: IMAGE_PATHS.ACHIEVEMENTS.DILIGENT_SMELTER,
        levels: [
            { target: 500, reward: { smeltingSpeedModifier: 0.05 }, effectName: '+5% к скорости плавки (Ур.1)' },
            { target: 2500, reward: { smeltingSpeedModifier: 0.05 }, effectName: '+5% к скорости плавки (Ур.2)' }
        ],
        check: (state, defs) => {
            const totalIngots = state.totalIngotsSmelted || 0;
            let currentLevel = 0;
            const currentTotal = totalIngots;

            for (let i = 0; i < achievements.diligent_smelter.levels.length; i++) {
                if (currentTotal >= achievements.diligent_smelter.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.diligent_smelter.levels[currentLevel]?.target || currentTotal;

            return {
                current: currentTotal,
                target: targetForNextLevel,
                isComplete: currentLevel === achievements.diligent_smelter.levels.length,
                currentLevel: currentLevel
            };
        },
        apply: (state, levelReward) => {
            if (levelReward.smeltingSpeedModifier) state.smeltingSpeedModifier += levelReward.smeltingSpeedModifier;
            console.log(`Достижение 'Усердный Плавильщик' применено: +${(levelReward.smeltingSpeedModifier * 100).toFixed(0)}% к скорости плавки.`);
        }
    },
    treasurer: {
        id: 'treasurer',
        category: 'Экономика',
        title: 'Казначей',
        description: 'Вы накопили значительное состояние, управляя финансами мастерской.',
        effectName: '+5% к Искрам от заказов',
        icon: IMAGE_PATHS.ACHIEVEMENTS.TREASURER,
        levels: [
            { target: 10000, reward: { sparksModifier: 0.05 }, effectName: '+5% к Искрам от заказов (Ур.1)' },
            { target: 100000, reward: { sparksModifier: 0.05 }, effectName: '+5% к Искрам от заказов (Ур.2)' }
        ],
        check: (state, defs) => {
            const totalSparks = state.totalSparksEarned || 0;
            let currentLevel = 0;
            const currentTotal = totalSparks;

            for (let i = 0; i < achievements.treasurer.levels.length; i++) {
                if (currentTotal >= achievements.treasurer.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.treasurer.levels[currentLevel]?.target || currentTotal;

            return {
                current: currentTotal,
                target: targetForNextLevel,
                isComplete: currentLevel === achievements.treasurer.levels.length,
                currentLevel: currentLevel
            };
        },
        apply: (state, levelReward) => {
            if (levelReward.sparksModifier) state.sparksModifier += levelReward.sparksModifier;
            console.log(`Достижение 'Казначей' применено: +${(levelReward.sparksModifier * 100).toFixed(0)}% к Искрам от заказов.`);
        }
    },
    matter_essence_master: {
        id: 'matter_essence_master',
        category: 'Экономика',
        title: 'Мастер Сущности',
        description: 'Вы научились эффективно использовать Материю, превращая её в новые возможности.',
        effectName: '-5% к стоимости Материи для навыков',
        icon: IMAGE_PATHS.ACHIEVEMENTS.MATTER_ESSENCE_MASTER,
        levels: [
            { target: 500, reward: { matterCostReduction: 0.05 }, effectName: '-5% к стоимости Материи для навыков (Ур.1)' },
            { target: 5000, reward: { matterCostReduction: 0.05 }, effectName: '-5% к стоимости Материи для навыков (Ур.2)' }
        ],
        check: (state, defs) => {
            const totalMatter = state.totalMatterSpent || 0;
            let currentLevel = 0;
            const currentTotal = totalMatter;

            for (let i = 0; i < achievements.matter_essence_master.levels.length; i++) {
                if (currentTotal >= achievements.matter_essence_master.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.matter_essence_master.levels[currentLevel]?.target || currentTotal;

            return {
                current: currentTotal,
                target: targetForNextLevel,
                isComplete: currentLevel === achievements.matter_essence_master.levels.length,
                currentLevel: currentLevel
            };
        },
        apply: (state, levelReward) => {
            if (levelReward.matterCostReduction) state.matterCostReduction += levelReward.matterCostReduction;
            console.log(`Достижение 'Мастер Сущности' применено: -${(levelReward.matterCostReduction * 100).toFixed(0)}% к стоимости Материи.`);
        }
    },
    first_resettlement: {
        id: 'first_resettlement',
        category: 'Прогресс',
        title: 'Первое Переселение',
        description: 'Вы начали новую жизнь в новом регионе, сохранив накопленные знания.',
        effectName: '+1 Осколок Памяти за каждый уровень Мастерства',
        icon: IMAGE_PATHS.ACHIEVEMENTS.FIRST_RESETTLEMENT,
        check: (state, defs) => {
            return { current: state.isFirstPlaythrough ? 0 : 1, target: 1, isComplete: !state.isFirstPlaythrough };
        },
        apply: (state) => {
            console.log("Достижение 'Первое Переселение' применено.");
        }
    },
    world_explorer: {
        id: 'world_explorer',
        category: 'Прогресс',
        title: 'Исследователь Мира',
        description: 'Вы открыли новые земли и расширили свои горизонты.',
        effectName: '-10% к стоимости разблокировки регионов',
        icon: IMAGE_PATHS.ACHIEVEMENTS.WORLD_EXPLORER,
        levels: [
            { target: 2, reward: { regionUnlockCostReduction: 0.10 }, effectName: '-10% к стоимости разблокировки регионов (Ур.1)' },
            { target: 3, reward: { regionUnlockCostReduction: 0.10 }, effectName: '-10% к стоимости разблокировки регионов (Ур.2)' }
        ],
        check: (state, defs) => {
            const visitedRegionsCount = state.regionsVisited.length;
            let currentLevel = 0;
            const currentTotal = visitedRegionsCount;

            for (let i = 0; i < achievements.world_explorer.levels.length; i++) {
                if (currentTotal >= achievements.world_explorer.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.world_explorer.levels[currentLevel]?.target || currentTotal;

            return {
                current: currentTotal,
                target: targetForNextLevel,
                isComplete: currentLevel === achievements.world_explorer.levels.length,
                currentLevel: currentLevel
            };
        },
        apply: (state, levelReward) => {
            if (levelReward.regionUnlockCostReduction) state.regionUnlockCostReduction += levelReward.regionUnlockCostReduction;
            console.log(`Достижение 'Исследователь Мира' применено: -${(levelReward.regionUnlockCostReduction * 100).toFixed(0)}% к стоимости разблокировки регионов.`);
        }
    },
    peak_mastery: {
        id: 'peak_mastery',
        category: 'Прогресс',
        title: 'Высшее Мастерство',
        description: 'Вы достигли вершин своего ремесла, значительно превзойдя обычных кузнецов.',
        effectName: '+10% к XP за все действия',
        icon: IMAGE_PATHS.ACHIEVEMENTS.PEAK_MASTERY,
        levels: [
            { target: 5, reward: { masteryXpModifier: 0.10 }, effectName: '+10% к XP за все действия (Ур.1)' },
            { target: 10, reward: { masteryXpModifier: 0.10 }, effectName: '+10% к XP за все действия (Ур.2)' }
        ],
        check: (state, defs) => {
            const currentMasteryLevel = state.masteryLevel || 1;
            let currentLevel = 0;
            const currentTotal = currentMasteryLevel;

            for (let i = 0; i < achievements.peak_mastery.levels.length; i++) {
                if (currentTotal >= achievements.peak_mastery.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.peak_mastery.levels[currentLevel]?.target || currentTotal;

            return {
                current: currentTotal,
                target: targetForNextLevel,
                isComplete: currentLevel === achievements.peak_mastery.levels.length,
                currentLevel: currentLevel
            };
        },
        apply: (state, levelReward) => {
            if (levelReward.masteryXpModifier) state.masteryXpModifier += levelReward.masteryXpModifier;
            console.log(`Достижение 'Высшее Мастерство' применено: +${(levelReward.masteryXpModifier * 100).toFixed(0)}% к XP.`);
        }
    },
    enhanced_clicker: {
        id: 'enhanced_clicker',
        category: 'Кузнечное Дело',
        title: 'Усиленный Кликер',
        description: 'Ваши руки стали невероятно быстрыми и сильными.',
        effectName: '+1 к прогрессу за клик',
        icon: IMAGE_PATHS.ACHIEVEMENTS.ENHANCED_CLICKER,
        levels: [
            { target: 10000, reward: { progressPerClick: 1 }, effectName: '+1 к прогрессу за клик (Ур.1)' },
            { target: 100000, reward: { progressPerClick: 1 }, effectName: '+1 к прогрессу за клик (Ур.2)' }
        ],
        check: (state, defs) => {
            const totalClicks = state.totalClicks || 0;
            let currentLevel = 0;
            const currentTotal = totalClicks;

            for (let i = 0; i < achievements.enhanced_clicker.levels.length; i++) {
                if (currentTotal >= achievements.enhanced_clicker.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.enhanced_clicker.levels[currentLevel]?.target || currentTotal;

            return {
                current: currentTotal,
                target: targetForNextLevel,
                isComplete: currentLevel === achievements.enhanced_clicker.levels.length,
                currentLevel: currentLevel
            };
        },
        apply: (state, levelReward) => {
            if (levelReward.progressPerClick) state.progressPerClick += levelReward.progressPerClick;
            console.log(`Достижение 'Усиленный Кликер' применено: +${levelReward.progressPerClick} к прогрессу за клик.`);
        }
    },
    pathfinders_first_step: {
        id: 'pathfinders_first_step',
        category: 'Прогресс',
        title: 'Начало Пути',
        description: 'Вы выбрали свою специализацию, определив свой уникальный путь мастера.',
        effectName: '+5% к эффективности подмастерьев',
        icon: IMAGE_PATHS.ACHIEVEMENTS.PATHFINDERS_FIRST_STEP,
        check: (state, defs) => {
            return { current: state.specialization ? 1 : 0, target: 1, isComplete: !!state.specialization };
        },
        apply: (state) => {
            state.passiveIncomeModifier += 0.05;
            console.log("Достижение 'Начало Пути' применено: +5% к эффективности подмастерьев.");
        }
    },
    royal_forger: {
        id: 'royal_forger',
        category: 'Фракции',
        title: 'Королевский Кузнец',
        description: 'Ваше мастерство признано самим Королевским Двором.',
        effectName: '+5% к репутации с Двором',
        icon: IMAGE_PATHS.ACHIEVEMENTS.ROYAL_FORGER,
        check: (state, defs) => {
            return { current: state.totalCourtOrdersCompleted || 0, target: 5, isComplete: (state.totalCourtOrdersCompleted || 0) >= 5 };
        },
        apply: (state) => {
            state.reputationGainModifier.court = (state.reputationGainModifier.court || 1) + 0.05;
            console.log("Достижение 'Королевский Кузнец' применено: +5% к репутации с Двором.");
        }
    },
    secret_agent: {
        id: 'secret_agent',
        category: 'Фракции',
        title: 'Тайный Агент',
        description: 'Вы успешно справлялись с опасными и скрытными заказами.',
        effectName: '-5% к риску перековки/инкрустации/гравировки',
        icon: IMAGE_PATHS.ACHIEVEMENTS.SECRET_AGENT,
        check: (state, defs) => {
            return { current: state.totalRiskyOrdersCompleted || 0, target: 15, isComplete: (state.totalRiskyOrdersCompleted || 0) >= 15 };
        },
        apply: (state) => {
            state.riskModifier = (state.riskModifier || 1.0) * 0.95;
            console.log("Достижение 'Тайный Агент' применено: -5% к риску.");
        }
    },
    adventurers_cartographer: {
        id: 'adventurers_cartographer',
        category: 'Фракции',
        title: 'Картограф Авантюриста',
        description: 'Вы снабжаете Лигу Авантюристов самыми точными картами.',
        effectName: '-10% к стоимости Карт Вылазок',
        icon: IMAGE_PATHS.ACHIEVEMENTS.ADVENTURERS_CARTOGRAPHER,
        check: (state, defs) => {
            return { current: state.totalExpeditionMapsBought || 0, target: 5, isComplete: (state.totalExpeditionMapsBought || 0) >= 5 };
        },
        apply: (state) => {
            state.expeditionMapCostModifier = (state.expeditionMapCostModifier || 1) * 0.90;
            console.log("Достижение 'Картограф Авантюриста' применено: -10% к стоимости Карт Вылазок.");
        }
    }
};
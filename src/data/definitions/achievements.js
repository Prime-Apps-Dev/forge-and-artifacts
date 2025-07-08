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
            state.eternalAchievementBonuses.sparksModifier = (state.eternalAchievementBonuses.sparksModifier || 0) + 0.05;
            state.eternalAchievementBonuses.matterModifier = (state.eternalAchievementBonuses.matterModifier || 0) + 0.05;
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
            state.eternalAchievementBonuses.playerShopSalesSpeedModifier = (state.eternalAchievementBonuses.playerShopSalesSpeedModifier || 0) + 0.05;
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
            state.eternalAchievementBonuses.progressPerClick = (state.eternalAchievementBonuses.progressPerClick || 0) + 2;
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
            state.eternalAchievementBonuses.matterCostReduction = (state.eternalAchievementBonuses.matterCostReduction || 0) + 0.10;
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
            state.eternalAchievementBonuses.passiveIncomeModifier = (state.eternalAchievementBonuses.passiveIncomeModifier || 0) + 0.10;
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
            state.eternalAchievementBonuses.questRewardModifier = (state.eternalAchievementBonuses.questRewardModifier || 0) + 0.10;
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
            state.eternalAchievementBonuses.passiveGeneration = state.eternalAchievementBonuses.passiveGeneration || {};
            state.eternalAchievementBonuses.passiveGeneration.ironOre = (state.eternalAchievementBonuses.passiveGeneration.ironOre || 0) + 0.2;
            state.eternalAchievementBonuses.passiveGeneration.copperOre = (state.eternalAchievementBonuses.passiveGeneration.copperOre || 0) + 0.2;
            state.eternalAchievementBonuses.passiveGeneration.mithrilOre = (state.eternalAchievementBonuses.passiveGeneration.mithrilOre || 0) + 0.2;
            state.eternalAchievementBonuses.passiveGeneration.adamantiteOre = (state.eternalAchievementBonuses.passiveGeneration.adamantiteOre || 0) + 0.2;
        }
    },
    first_forge: {
        id: 'first_forge',
        category: 'Кузнечное Дело',
        title: 'Первые Искры',
        description: 'Вы выковали свой первый предмет. Получите скромное вознаграждение, чтобы продолжить свой путь.',
        effectName: '+500 Искр',
        icon: IMAGE_PATHS.ACHIEVEMENTS.FIRST_FORGE,
        isOneTimeReward: true, // ФЛАГ: это разовая награда
        check: (state, defs) => {
            return { current: state.totalItemsCrafted, target: 1, isComplete: state.totalItemsCrafted >= 1 };
        },
        apply: (state) => {
            state.sparks += 500; // Разовая награда, применяется только один раз
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
            state.eternalAchievementBonuses.smeltingSpeedModifier = (state.eternalAchievementBonuses.smeltingSpeedModifier || 0) + 0.05;
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
            state.eternalAchievementBonuses.passiveGeneration = state.eternalAchievementBonuses.passiveGeneration || {};
            state.eternalAchievementBonuses.passiveGeneration.ironOre = (state.eternalAchievementBonuses.passiveGeneration.ironOre || 0) + 0.1;
        }
    },
    shop_expansion: {
        id: 'shop_expansion',
        category: 'Магазин',
        title: 'Развитие Торговли',
        description: 'Вы успешно продали несколько товаров, заработав репутацию у покупателей. Ваше дело расширяется!',
        effectName: '+2500 Искр',
        icon: IMAGE_PATHS.ACHIEVEMENTS.SHOP_EXPANSION,
        isOneTimeReward: true, // ФЛАГ: это разовая награда
        check: (state, defs) => {
            return { current: state.shopXP, target: 500, isComplete: state.shopXP >= 500 };
        },
        apply: (state) => {
            state.sparks += 2500; // Разовая награда
        }
    },
    novice_collector: {
        id: 'novice_collector',
        category: 'Коллекционирование',
        title: 'Начинающий Коллекционер',
        description: 'Соберите различные предметы и станьте признанным ценителем редкостей.',
        icon: IMAGE_PATHS.ACHIEVEMENTS.NOVICE_COLLECTOR,
        levels: [
            { target: 5, reward: { critChance: 0.01 }, effectName: '+1% к шансу крит. удара (Ур.1)' },
            { target: 15, reward: { critChance: 0.02 }, effectName: '+2% к шансу крит. удара (Ур.2)' }
        ],
        check: (state, defs) => {
            const uniqueItems = new Set(state.inventory.map(item => item.itemKey)).size;
            let currentLevel = 0;
            for (let i = 0; i < achievements.novice_collector.levels.length; i++) {
                if (uniqueItems >= achievements.novice_collector.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.novice_collector.levels[currentLevel]?.target || uniqueItems;
            return { current: uniqueItems, target: targetForNextLevel, isComplete: currentLevel === achievements.novice_collector.levels.length, currentLevel: currentLevel };
        },
        apply: (state, levelReward) => {
            state.eternalAchievementBonuses.critChance = (state.eternalAchievementBonuses.critChance || 0) + (levelReward.critChance || 0);
        }
    },
    resource_tycoon: {
        id: 'resource_tycoon',
        category: 'Ресурсы',
        title: 'Магнат Ресурсов',
        description: 'Накопите огромные запасы сырья.',
        icon: IMAGE_PATHS.ACHIEVEMENTS.RESOURCE_TYCOON,
        levels: [
            { target: 1000, reward: { orePerClick: 1 }, effectName: '+1 к добыче руды за клик (Ур.1)' },
            { target: 10000, reward: { orePerClick: 1 }, effectName: '+1 к добыче руды за клик (Ур.2)' }
        ],
        check: (state, defs) => {
            const totalOre = (state.ironOre || 0) + (state.copperOre || 0) + (state.mithrilOre || 0) + (state.adamantiteOre || 0);
            let currentLevel = 0;
            for (let i = 0; i < achievements.resource_tycoon.levels.length; i++) {
                if (totalOre >= achievements.resource_tycoon.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.resource_tycoon.levels[currentLevel]?.target || totalOre;
            return { current: totalOre, target: targetForNextLevel, isComplete: currentLevel === achievements.resource_tycoon.levels.length, currentLevel: currentLevel };
        },
        apply: (state, levelReward) => {
            state.eternalAchievementBonuses.orePerClick = (state.eternalAchievementBonuses.orePerClick || 0) + (levelReward.orePerClick || 0);
        }
    },
    inlay_master: {
        id: 'inlay_master',
        category: 'Мастерство',
        title: 'Мастер Инкрустации',
        description: 'Ваши навыки инкрустации поражают. Каждый инкрустированный предмет улучшает ваши общие способности.',
        icon: IMAGE_PATHS.ACHIEVEMENTS.INLAY_MASTER,
        levels: [
            { target: 1, reward: { matterModifier: 0.05 }, effectName: '+5% к бонусной Материи от заказов (Ур.1)' },
            { target: 5, reward: { matterModifier: 0.05 }, effectName: '+5% к бонусной Материи от заказов (Ур.2)' }
        ],
        check: (state, defs) => {
            const totalInlayedItems = state.totalInlayedItems || 0;
            let currentLevel = 0;
            for (let i = 0; i < achievements.inlay_master.levels.length; i++) {
                if (totalInlayedItems >= achievements.inlay_master.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.inlay_master.levels[currentLevel]?.target || totalInlayedItems;
            return { current: totalInlayedItems, target: targetForNextLevel, isComplete: currentLevel === achievements.inlay_master.levels.length, currentLevel: currentLevel };
        },
        apply: (state, levelReward) => {
            state.eternalAchievementBonuses.matterModifier = (state.eternalAchievementBonuses.matterModifier || 0) + (levelReward.matterModifier || 0);
        }
    },
    graving_legend: {
        id: 'graving_legend',
        category: 'Мастерство',
        title: 'Гравировщик Легенд',
        description: 'Ваша гравировка безупречна. Гравированные предметы приносят вам больше Искр.',
        icon: IMAGE_PATHS.ACHIEVEMENTS.GRAVING_LEGEND,
        levels: [
            { target: 1, reward: { sparksModifier: 0.05 }, effectName: '+5% к бонусным Искрам от заказов (Ур.1)' },
            { target: 5, reward: { sparksModifier: 0.05 }, effectName: '+5% к бонусным Искрам от заказов (Ур.2)' }
        ],
        check: (state, defs) => {
            const totalGravedItems = state.totalGravedItems || 0;
            let currentLevel = 0;
            for (let i = 0; i < achievements.graving_legend.levels.length; i++) {
                if (totalGravedItems >= achievements.graving_legend.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.graving_legend.levels[currentLevel]?.target || totalGravedItems;
            return { current: totalGravedItems, target: targetForNextLevel, isComplete: currentLevel === achievements.graving_legend.levels.length, currentLevel: currentLevel };
        },
        apply: (state, levelReward) => {
            state.eternalAchievementBonuses.sparksModifier = (state.eternalAchievementBonuses.sparksModifier || 0) + (levelReward.sparksModifier || 0);
        }
    },
    veteran_crafter: {
        id: 'veteran_crafter',
        category: 'Кузнечное Дело',
        title: 'Кузнец-Ветеран',
        description: 'Вы стали опытным ремесленником, создав множество предметов.',
        icon: IMAGE_PATHS.ACHIEVEMENTS.VETERAN_CRAFTER,
        levels: [
            { target: 10, reward: { progressPerClick: 1 }, effectName: '+1 к прогрессу за клик (Ур.1)' },
            { target: 50, reward: { progressPerClick: 1 }, effectName: '+1 к прогрессу за клик (Ур.2)' }
        ],
        check: (state, defs) => {
            const totalItems = state.totalItemsCrafted || 0;
            let currentLevel = 0;
            for (let i = 0; i < achievements.veteran_crafter.levels.length; i++) {
                if (totalItems >= achievements.veteran_crafter.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.veteran_crafter.levels[currentLevel]?.target || totalItems;
            return { current: totalItems, target: targetForNextLevel, isComplete: currentLevel === achievements.veteran_crafter.levels.length, currentLevel: currentLevel };
        },
        apply: (state, levelReward) => {
            state.eternalAchievementBonuses.progressPerClick = (state.eternalAchievementBonuses.progressPerClick || 0) + (levelReward.progressPerClick || 0);
        }
    },
    diligent_smelter: {
        id: 'diligent_smelter',
        category: 'Мастерство',
        title: 'Усердный Плавильщик',
        description: 'Ваши знания о металлах углубляются с каждой переплавленной партией.',
        icon: IMAGE_PATHS.ACHIEVEMENTS.DILIGENT_SMELTER,
        levels: [
            { target: 500, reward: { smeltingSpeedModifier: 0.05 }, effectName: '+5% к скорости плавки (Ур.1)' },
            { target: 2500, reward: { smeltingSpeedModifier: 0.05 }, effectName: '+5% к скорости плавки (Ур.2)' }
        ],
        check: (state, defs) => {
            const totalIngots = state.totalIngotsSmelted || 0;
            let currentLevel = 0;
            for (let i = 0; i < achievements.diligent_smelter.levels.length; i++) {
                if (totalIngots >= achievements.diligent_smelter.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.diligent_smelter.levels[currentLevel]?.target || totalIngots;
            return { current: totalIngots, target: targetForNextLevel, isComplete: currentLevel === achievements.diligent_smelter.levels.length, currentLevel: currentLevel };
        },
        apply: (state, levelReward) => {
            state.eternalAchievementBonuses.smeltingSpeedModifier = (state.eternalAchievementBonuses.smeltingSpeedModifier || 0) + (levelReward.smeltingSpeedModifier || 0);
        }
    },
    treasurer: {
        id: 'treasurer',
        category: 'Экономика',
        title: 'Казначей',
        description: 'Вы накопили значительное состояние, управляя финансами мастерской.',
        icon: IMAGE_PATHS.ACHIEVEMENTS.TREASURER,
        levels: [
            { target: 10000, reward: { sparksModifier: 0.05 }, effectName: '+5% к Искрам от заказов (Ур.1)' },
            { target: 100000, reward: { sparksModifier: 0.05 }, effectName: '+5% к Искрам от заказов (Ур.2)' }
        ],
        check: (state, defs) => {
            const totalSparks = state.totalSparksEarned || 0;
            let currentLevel = 0;
            for (let i = 0; i < achievements.treasurer.levels.length; i++) {
                if (totalSparks >= achievements.treasurer.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.treasurer.levels[currentLevel]?.target || totalSparks;
            return { current: totalSparks, target: targetForNextLevel, isComplete: currentLevel === achievements.treasurer.levels.length, currentLevel: currentLevel };
        },
        apply: (state, levelReward) => {
            state.eternalAchievementBonuses.sparksModifier = (state.eternalAchievementBonuses.sparksModifier || 0) + (levelReward.sparksModifier || 0);
        }
    },
    matter_essence_master: {
        id: 'matter_essence_master',
        category: 'Экономика',
        title: 'Мастер Сущности',
        description: 'Вы научились эффективно использовать Материю, превращая её в новые возможности.',
        icon: IMAGE_PATHS.ACHIEVEMENTS.MATTER_ESSENCE_MASTER,
        levels: [
            { target: 500, reward: { matterCostReduction: 0.05 }, effectName: '-5% к стоимости Материи для навыков (Ур.1)' },
            { target: 5000, reward: { matterCostReduction: 0.05 }, effectName: '-5% к стоимости Материи для навыков (Ур.2)' }
        ],
        check: (state, defs) => {
            const totalMatter = state.totalMatterSpent || 0;
            let currentLevel = 0;
            for (let i = 0; i < achievements.matter_essence_master.levels.length; i++) {
                if (totalMatter >= achievements.matter_essence_master.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.matter_essence_master.levels[currentLevel]?.target || totalMatter;
            return { current: totalMatter, target: targetForNextLevel, isComplete: currentLevel === achievements.matter_essence_master.levels.length, currentLevel: currentLevel };
        },
        apply: (state, levelReward) => {
            state.eternalAchievementBonuses.matterCostReduction = (state.eternalAchievementBonuses.matterCostReduction || 0) + (levelReward.matterCostReduction || 0);
        }
    },
    first_resettlement: {
        id: 'first_resettlement',
        category: 'Прогресс',
        title: 'Первое Переселение',
        description: 'Вы начали новую жизнь в новом регионе, сохранив накопленные знания.',
        effectName: '+5% к Осколкам Памяти',
        icon: IMAGE_PATHS.ACHIEVEMENTS.FIRST_RESETTLEMENT,
        check: (state, defs) => {
            return { current: state.isFirstPlaythrough ? 0 : 1, target: 1, isComplete: !state.isFirstPlaythrough };
        },
        apply: (state) => {
            state.eternalAchievementBonuses.prestigePointsGainModifier = (state.eternalAchievementBonuses.prestigePointsGainModifier || 0) + 0.05;
        }
    },
    world_explorer: {
        id: 'world_explorer',
        category: 'Прогресс',
        title: 'Исследователь Мира',
        description: 'Вы открыли новые земли и расширили свои горизонты.',
        icon: IMAGE_PATHS.ACHIEVEMENTS.WORLD_EXPLORER,
        levels: [
            { target: 2, reward: { regionUnlockCostReduction: 0.10 }, effectName: '-10% к стоимости разблокировки регионов (Ур.1)' },
            { target: 3, reward: { regionUnlockCostReduction: 0.10 }, effectName: '-10% к стоимости разблокировки регионов (Ур.2)' }
        ],
        check: (state, defs) => {
            const visitedRegionsCount = state.regionsVisited.length;
            let currentLevel = 0;
            for (let i = 0; i < achievements.world_explorer.levels.length; i++) {
                if (visitedRegionsCount >= achievements.world_explorer.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.world_explorer.levels[currentLevel]?.target || visitedRegionsCount;
            return { current: visitedRegionsCount, target: targetForNextLevel, isComplete: currentLevel === achievements.world_explorer.levels.length, currentLevel: currentLevel };
        },
        apply: (state, levelReward) => {
            state.eternalAchievementBonuses.regionUnlockCostReduction = (state.eternalAchievementBonuses.regionUnlockCostReduction || 0) + (levelReward.regionUnlockCostReduction || 0);
        }
    },
    peak_mastery: {
        id: 'peak_mastery',
        category: 'Прогресс',
        title: 'Высшее Мастерство',
        description: 'Вы достигли вершин своего ремесла, значительно превзойдя обычных кузнецов.',
        icon: IMAGE_PATHS.ACHIEVEMENTS.PEAK_MASTERY,
        levels: [
            { target: 5, reward: { masteryXpModifier: 0.10 }, effectName: '+10% к XP за все действия (Ур.1)' },
            { target: 10, reward: { masteryXpModifier: 0.10 }, effectName: '+10% к XP за все действия (Ур.2)' }
        ],
        check: (state, defs) => {
            const currentMasteryLevel = state.masteryLevel || 1;
            let currentLevel = 0;
            for (let i = 0; i < achievements.peak_mastery.levels.length; i++) {
                if (currentMasteryLevel >= achievements.peak_mastery.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.peak_mastery.levels[currentLevel]?.target || currentMasteryLevel;
            return { current: currentMasteryLevel, target: targetForNextLevel, isComplete: currentLevel === achievements.peak_mastery.levels.length, currentLevel: currentLevel };
        },
        apply: (state, levelReward) => {
            state.eternalAchievementBonuses.masteryXpModifier = (state.eternalAchievementBonuses.masteryXpModifier || 0) + (levelReward.masteryXpModifier || 0);
        }
    },
    enhanced_clicker: {
        id: 'enhanced_clicker',
        category: 'Кузнечное Дело',
        title: 'Усиленный Кликер',
        description: 'Ваши руки стали невероятно быстрыми и сильными.',
        icon: IMAGE_PATHS.ACHIEVEMENTS.ENHANCED_CLICKER,
        levels: [
            { target: 10000, reward: { progressPerClick: 1 }, effectName: '+1 к прогрессу за клик (Ур.1)' },
            { target: 100000, reward: { progressPerClick: 1 }, effectName: '+1 к прогрессу за клик (Ур.2)' }
        ],
        check: (state, defs) => {
            const totalClicks = state.totalClicks || 0;
            let currentLevel = 0;
            for (let i = 0; i < achievements.enhanced_clicker.levels.length; i++) {
                if (totalClicks >= achievements.enhanced_clicker.levels[i].target) {
                    currentLevel = i + 1;
                } else {
                    break;
                }
            }
            const targetForNextLevel = achievements.enhanced_clicker.levels[currentLevel]?.target || totalClicks;
            return { current: totalClicks, target: targetForNextLevel, isComplete: currentLevel === achievements.enhanced_clicker.levels.length, currentLevel: currentLevel };
        },
        apply: (state, levelReward) => {
            state.eternalAchievementBonuses.progressPerClick = (state.eternalAchievementBonuses.progressPerClick || 0) + (levelReward.progressPerClick || 0);
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
            state.eternalAchievementBonuses.passiveIncomeModifier = (state.eternalAchievementBonuses.passiveIncomeModifier || 0) + 0.05;
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
            state.eternalAchievementBonuses.reputationGainModifier = state.eternalAchievementBonuses.reputationGainModifier || {};
            state.eternalAchievementBonuses.reputationGainModifier.court = (state.eternalAchievementBonuses.reputationGainModifier.court || 0) + 0.05;
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
            state.eternalAchievementBonuses.riskModifier = (state.eternalAchievementBonuses.riskModifier || 1.0) * 0.95;
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
            state.eternalAchievementBonuses.expeditionMapCostModifier = (state.eternalAchievementBonuses.expeditionMapCostModifier || 1) * 0.90;
        }
    }
};
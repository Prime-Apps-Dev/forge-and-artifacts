// src/data/definitions/shared.js
import { IMAGE_PATHS } from '../../constants/paths';

export const sharedDefinitions = {
    factions: {
        merchants: { name: 'Гильдия Торговцев', color: 'yellow-500', icon: 'storefront' },
        adventurers: { name: 'Лига Авантюристов', color: 'green-500', icon: 'explore' },
        court: { name: 'Королевский Двор', color: 'purple-500', icon: 'account_balance' }
    },

    reputationLevels: [
        { id: 'distrust', name: 'Недоверие', threshold: 0 },
        { id: 'neutrality', name: 'Нейтралитет', threshold: 100 },
        { id: 'respect', name: 'Уважение', threshold: 250 },
        { id: 'honor', name: 'Почет', threshold: 500 },
        { id: 'exalted', name: 'Превознесение', threshold: 1000 },
    ],

    workstations: {
        anvil: {
            name: "Наковальня", icon: "hardware",
            maxLevel: 100, // Максимальный уровень
            baseXpToNextLevel: 100, // Начальное XP для следующего уровня
            xpToNextLevelMultiplier: 1.1, // Множитель для следующего уровня
            bonusesPerLevel: {
                progressPerClick: 0.1, // +0.1 к прогрессу за клик
                critChance: 0.001, // +0.1% к шансу крита
            }
        },
        workbench: {
            name: "Верстак", icon: "handyman",
            maxLevel: 100,
            baseXpToNextLevel: 100,
            xpToNextLevelMultiplier: 1.1,
            bonusesPerLevel: {
                componentCostReduction: 0.05, // -0.05 к стоимости компонентов (для предметов со стоимостью в материи, искрах)
                matterModifier: 0.001, // +0.1% к материи от заказов
            }
        },
        grindstone: {
            name: "Точильный станок", icon: "healing",
            maxLevel: 100,
            baseXpToNextLevel: 100,
            xpToNextLevelMultiplier: 1.1,
            bonusesPerLevel: {
                critBonus: 0.05, // +0.05 к множителю крит. бонуса
                smeltingSpeedModifier: 0.001, // +0.1% к скорости плавки
            }
        }
    },

    clients: [
        { id: 'farmer', name: 'Фермер', faceImg: IMAGE_PATHS.CLIENTS.FARMER, demands: { quality: 0.8, speed: 1.2, reward: 0.9, saleSpeedModifier: 1.2, tipChance: 0.05 }, unlockLevel: 0, unlockSkill: null },
        { id: 'adventurer', name: 'Авантюрист', faceImg: IMAGE_PATHS.CLIENTS.ADVENTURER, demands: { quality: 1.0, speed: 0.8, reward: 1.1, saleSpeedModifier: 1.0, tipChance: 0.1 }, unlockLevel: 0, unlockSkill: 'advancedClients' },
        { id: 'noble', name: 'Дворянин', faceImg: IMAGE_PATHS.CLIENTS.NOBLE, demands: { quality: 1.5, speed: 1.0, reward: 1.5, saleSpeedModifier: 0.8, tipChance: 0.2 }, unlockLevel: 0, unlockSkill: null },
        { id: 'shadowyFigure', name: 'Тайный Заказчик', faceImg: IMAGE_PATHS.CLIENTS.SHADOWY_FIGURE, demands: { quality: 1.8, speed: 0.5, reward: 2.5 }, isRisky: true, unlockLevel: 0, unlockSkill: null },
        { id: 'collector', name: 'Коллекционер', faceImg: IMAGE_PATHS.CLIENTS.COLLECTOR, demands: { quality: 2.5, speed: 1.0, reward: 3.0, saleSpeedModifier: 0.7, tipChance: 0.3 }, isCollector: true, unlockLevel: 0, unlockSkill: null },

        { id: 'alchemist', name: 'Алхимик', faceImg: IMAGE_PATHS.CLIENTS.ALCHEMIST, demands: { quality: 1.8, speed: 0.7, reward: 2.0, saleSpeedModifier: 0.6, tipChance: 0.15 }, unlockLevel: 5, unlockSkill: 'advancedClients' },
        { id: 'scholar', name: 'Ученый-Археолог', faceImg: IMAGE_PATHS.CLIENTS.SCHOLAR, demands: { quality: 1.2, speed: 1.0, reward: 1.3, saleSpeedModifier: 0.8, tipChance: 0.08 }, unlockLevel: 3, unlockSkill: null },
        { id: 'barbarian', name: 'Варвар-Воин', faceImg: IMAGE_PATHS.CLIENTS.BARBARIAN, demands: { quality: 0.7, speed: 1.5, reward: 0.8, saleSpeedModifier: 1.3, tipChance: 0.03 }, unlockLevel: 2, unlockSkill: null },
        { id: 'bard', name: 'Бард-Путешественник', faceImg: IMAGE_PATHS.CLIENTS.BARD, demands: { quality: 1.0, speed: 1.1, reward: 1.0, saleSpeedModifier: 1.0, tipChance: 0.12 }, unlockLevel: 4, unlockSkill: 'advancedClients' },
        { id: 'artisan', name: 'Придворный Ремесленник', faceImg: IMAGE_PATHS.CLIENTS.ARTISAN, demands: { quality: 2.0, speed: 0.5, reward: 2.8, saleSpeedModifier: 0.4, tipChance: 0.25 }, isCollector: true, unlockLevel: 7, unlockSkill: 'legendaryClients' },
        { id: 'miner', name: 'Старатель', faceImg: IMAGE_PATHS.CLIENTS.MINER, demands: { quality: 0.9, speed: 1.3, reward: 0.95, saleSpeedModifier: 1.1, tipChance: 0.06 }, unlockLevel: 1, unlockSkill: null },
        { id: 'hunter', name: 'Охотник', faceImg: IMAGE_PATHS.CLIENTS.HUNTER, demands: { quality: 1.1, speed: 1.2, reward: 1.0, saleSpeedModifier: 1.0, tipChance: 0.07 }, unlockLevel: 2, unlockSkill: null },
        { id: 'priestess', name: 'Жрица Света', faceImg: IMAGE_PATHS.CLIENTS.PRIESTESS, demands: { quality: 2.2, speed: 0.8, reward: 3.0, saleSpeedModifier: 0.5, tipChance: 0.30 }, unlockLevel: 8, unlockSkill: 'legendaryClients' },
        { id: 'engineer_client', name: 'Имперский Инженер', faceImg: IMAGE_PATHS.CLIENTS.ENGINEER_CLIENT, demands: { quality: 1.5, speed: 0.9, reward: 1.7, saleSpeedModifier: 0.7, tipChance: 0.18 }, unlockLevel: 6, unlockSkill: 'advancedClients' },
        { id: 'spy', name: 'Тайный Агент', faceImg: IMAGE_PATHS.CLIENTS.SPY, demands: { quality: 1.0, speed: 0.4, reward: 2.5, saleSpeedModifier: 0.1, tipChance: 0.20 }, isRisky: true, unlockLevel: 5, unlockSkill: null },
    ],

    worldEvents: [
        { id: 'drought', type: 'market', message: "Засуха в южных провинциях! Поставки руды затруднены.", effects: { ironOre: { buy: 1.25, sell: 1.15 }, copperOre: { buy: 1.25, sell: 1.15 }}},
        { id: 'tournament', type: 'market', message: "Королевский турнир! Спрос на оружие и броню взлетел до небес.", effects: { ironIngots: { sell: 1.20 }, bronzeIngots: { sell: 1.25 }}},
        { id: 'good_harvest', type: 'market', message: "Отличный урожай, караваны идут без задержек. Цены на сырье снижены.", effects: { ironOre: { buy: 0.85 }, copperOre: { buy: 0.85 }}},
        { id: 'merchants_vs_adventurers', type: 'faction_conflict', message: 'Торговая Гильдия обвиняет Авантюристов в пиратстве! Отношения накалены, торговля с обеими фракциями затруднена.', conflictingFactions: ['merchants', 'adventurers']},
        { id: 'court_vs_merchants', type: 'faction_conflict', message: 'Королевский Двор вводит новые налоги, что злит Гильдию Торговцев. Сотрудничество с ними временно приостановлено.', conflictingFactions: ['court', 'merchants']},
        { id: 'adventurers_vs_court', type: 'faction_conflict', message: 'Лига Авантюристов недовольна запретом Короны на исследование древних руин. Услуги обеих фракций недоступны.', conflictingFactions: ['adventurers', 'court']},
    ],

    missions: {
        scout_old_mine: {
            id: 'scout_old_mine',
            name: 'Разведка старой шахты',
            description: 'Наши геологи обнаружили заброшенную шахту. Отправьте подмастерья на разведку, чтобы оценить её состояние. Им понадобится базовое снаряжение.',
            duration: 600,
            requiredGear: [
                { itemKey: 'horseshoe', count: 2, minQuality: 1.0 },
                { itemKey: 'dagger', count: 1, minQuality: 1.2 },
            ],
            baseReward: { sparks: 5000, ironOre: 200 },
            bonusReward: { matterPerQualityPoint: 5 }
        },
        escort_merchant_caravan: {
            id: 'escort_merchant_caravan',
            name: 'Сопровождение каравана',
            description: 'Торговая Гильдия просит предоставить снаряжение для охраны их каравана. Чем лучше снаряжение, тем увереннее будут себя чувствовать охранники.',
            duration: 1800,
            requiredGear: [
                { itemKey: 'ironHelmet', count: 1, minQuality: 1.5 },
                { itemKey: 'bronzeSword', count: 1, minQuality: 2.0 },
            ],
            baseReward: { sparks: 15000, reputation: { merchants: 50 } },
            bonusReward: { sparksPerQualityPoint: 100 }
        }
    },

    resources: {
        ironOre: { name: 'Железная руда' },
        copperOre: { name: 'Медная руда' },
        mithrilOre: { name: 'Мифриловая руда' },
        adamantiteOre: { name: 'Адамантитовая руда' },
        ironIngots: { name: 'Железные слитки' },
        copperIngots: { name: 'Медные слитки' },
        bronzeIngots: { name: 'Бронзовые слитки' },
        sparksteelIngots: { name: 'Слитки Искростали' },
        mithrilIngots: { name: 'Мифриловые слитки' },
        adamantiteIngots: { name: 'Адамантитовые слитки' },
        arcaniteIngots: { name: 'Арканитовые слитки' },
    },
};
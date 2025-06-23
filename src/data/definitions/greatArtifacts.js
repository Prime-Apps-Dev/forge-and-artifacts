// src/data/definitions/greatArtifacts.js
import { IMAGE_PATHS } from '../../constants/paths';

export const greatArtifacts = {
    aegis: {
        name: "Эгида Бессмертного Короля",
        icon: IMAGE_PATHS.ARTIFACTS.AEGIS,
        description: "Дает 10% шанс не потратить ресурсы при создании любого компонента.",
        components: {
            blueprint: { name: "Королевский чертеж: Эгида", obtained: false, itemId: 'blueprint_aegis' },
            material1: { name: "Сердце стража", obtained: false, itemId: 'material_guardianHeart' },
            material2: { name: "Адамантиновая основа", obtained: false, itemId: 'material_adamantFrame' },
        },
        status: 'locked',
        epicOrder: [
            { stage: 1, name: "Вплавление Сердца Стража", progress: 10000, workstation: 'anvil', cost: { gem: 5, sparks: 50000, ironIngots: 200 } },
            { stage: 2, name: "Гравировка усилителей", progress: 8000, workstation: 'workbench', cost: { sparks: 50000, matter: 2500, copperIngots: 100 } },
            { stage: 3, name: "Финальная Закалка", progress: 15000, workstation: 'grindstone', cost: { bronzeIngots: 50, sparks: 75000 } }
        ]
    },
    hammer: {
        name: "Молот Горного Сердца",
        icon: IMAGE_PATHS.ARTIFACTS.HAMMER,
        description: "Каждый удар по наковальне имеет 1% шанс дополнительно создать редкий самоцвет.",
        components: {
            blueprint: { name: "Королевский чертеж: Молот", obtained: false, itemId: 'blueprint_hammer' },
            material1: { name: "Лавовый агат", obtained: false, itemId: 'material_lavaAgate' },
            material2: { name: "Рукоять из железного дерева", obtained: false, itemId: 'material_ironwoodHandle' },
        },
        status: 'locked',
         epicOrder: [
            { stage: 1, name: "Прокаливание Лавового агата", progress: 12000, workstation: 'anvil', cost: { copperIngots: 100, sparks: 60000, ironIngots: 300 } },
            { stage: 2, name: "Соединение с Рукоятью", progress: 9000, workstation: 'workbench', cost: { ironIngots: 100, matter: 3000, copperIngots: 150 } },
            { stage: 3, name: "Наделение силой", progress: 18000, workstation: 'grindstone', cost: { matter: 10000, bronzeIngots: 50 } }
        ]
    },
    crown: {
        name: "Корона Солнца",
        icon: IMAGE_PATHS.ARTIFACTS.CROWN,
        description: "Значительно увеличивает доход Искр и Материи от всех заказов (+25%).",
        components: {
            blueprint: { name: "Королевский чертеж: Корона", obtained: false, itemId: 'blueprint_crown' },
            material1: { name: "Слеза солнца", obtained: false, itemId: 'material_sunTear' },
            material2: { name: "Очищенное золото", obtained: false, itemId: 'material_purifiedGold' },
        },
        status: 'locked',
        epicOrder: [
            { stage: 1, name: "Огранка Слезы солнца", progress: 15000, workstation: 'grindstone', cost: { gem: 10, sparks: 70000, copperIngots: 200 } },
            { stage: 2, name: "Создание золотого каркаса", progress: 10000, workstation: 'anvil', cost: { sparks: 100000, bronzeIngots: 30, ironIngots: 500 } },
            { stage: 3, name: "Инкрустация и благословение", progress: 20000, workstation: 'workbench', cost: { matter: 15000, sparksteelIngots: 20 } }
        ],
        apply: (state) => {
            state.sparksModifier += 0.25;
            state.matterModifier += 0.25;
        }
    },
    bastion: {
        name: "Бастион Несокрушимости",
        icon: IMAGE_PATHS.ARTIFACTS.BASTION,
        description: "Снижает требуемый прогресс для всех компонентов на 15%.",
        components: {
            blueprint: { name: "Древний чертеж: Бастион", obtained: false, itemId: 'blueprint_bastion'},
            material1: { name: "Адамантитовое ядро", obtained: false, itemId: 'component_adamantiteCore'},
            material2: { name: "Стабилизирующий Гироскоп", obtained: false, itemId: 'component_stabilizingGyroscope'},
        },
        status: 'locked',
        epicOrder: [
            { stage: 1, name: "Сборка ядра", progress: 25000, workstation: 'anvil', cost: { bronzeIngots: 100, sparks: 150000 } },
            { stage: 2, name: "Монтаж гироскопа", progress: 20000, workstation: 'workbench', cost: { sparksteelIngots: 30, matter: 10000 } },
            { stage: 3, name: "Насыщение энергией", progress: 30000, workstation: 'workbench', cost: { matter: 25000, gem: 30, sparks: 200000 } }
        ],
        apply: (state) => {
            state.progressPerClick = state.progressPerClick * (1 + 0.15);
        }
    },
    quill: {
        name: "Перо Архивариуса",
        icon: IMAGE_PATHS.ARTIFACTS.QUILL,
        description: "Вы получаете 1 ед. Материи за каждые 100 Искр, заработанных с заказов.",
        components: {
            blueprint: { name: "Древний чертеж: Перо", obtained: false, itemId: 'blueprint_quill'},
            material1: { name: "Очищенный Мифрил", obtained: false, itemId: 'component_purifiedMithril'},
            material2: { name: "Фокусирующая Линза", obtained: false, itemId: 'component_focusingLens'},
        },
        status: 'locked',
        epicOrder: [
            { stage: 1, name: "Ковка пера", progress: 20000, workstation: 'anvil', cost: { sparksteelIngots: 50, sparks: 120000 } },
            { stage: 2, name: "Создание линзы", progress: 22000, workstation: 'workbench', cost: { gem: 25, matter: 8000, bronzeIngots: 80 } },
            { stage: 3, name: "Калибровка потоков", progress: 28000, workstation: 'grindstone', cost: { sparks: 150000, sparksteelIngots: 40 } }
        ]
    }
};
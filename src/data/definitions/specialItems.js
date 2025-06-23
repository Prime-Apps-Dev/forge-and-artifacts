// src/data/definitions/specialItems.js
import { IMAGE_PATHS } from '../../constants/paths';

export const specialItems = {
    blueprint_aegis: { name: 'Чертеж: Эгида', description: 'Схема для создания легендарного щита.', cost: { matter: 5000, sparks: 30000 }, requiredFaction: 'court', requiredRep: 'honor', requiredSkill: 'blueprint_adamantiteForging'},
    blueprint_hammer: { name: 'Чертеж: Молот', description: 'Схема для создания легендарного молота.', cost: { matter: 5000, sparks: 30000 }, requiredFaction: 'court', requiredRep: 'honor', requiredSkill: 'blueprint_masterwork'},
    blueprint_crown: { name: 'Чертеж: Корона', description: 'Схема для создания легендарной короны.', cost: { matter: 5000, sparks: 30000 }, requiredFaction: 'court', requiredRep: 'honor', requiredSkill: 'blueprint_masterwork'},
    expeditionMap: { name: "Карта вылазки", description: "Открывает доступ к особой локации с добычей.", cost: { sparks: 1000, ironIngots: 10 }, requiredFaction: 'adventurers', requiredRep: 'respect' },
    gem: { name: "Редкий самоцвет", description: "Драгоценный камень, используемый в самых дорогих изделиях." },
    material_guardianHeart: { name: "Сердце стража", description: "Пульсирующее ядро древнего автоматона. Добывается по спецзаказу Лиги Авантюристов." },
    material_adamantFrame: { name: "Адамантиновая основа", description: "Слиток почти неразрушимого металла. Можно получить, инвестируя в торговые пути Гильдии." },
    material_lavaAgate: { name: "Лавовый агат", description: "Застывшая слеза вулкана." },
    material_ironwoodHandle: { name: "Рукоять из железного дерева", description: "Невероятно прочное дерево." },
    material_sunTear: { name: "Слеза солнца", description: "Кристалл, поглотивший солнечный свет." },
    material_purifiedGold: { name: "Очищенное золото", description: "Золото, свободное от любых примесей." },
    blueprint_bastion: { name: "Чертеж: Бастион", description: 'Схема для создания Бастиона Несокрушимости.', cost: { matter: 10000, sparks: 50000 }, requiredFaction: 'court', requiredRep: 'exalted', requiredSkill: 'blueprint_arcaniteMastery'},
    blueprint_quill: { name: "Чертеж: Перо", description: 'Схема для создания Пера Архивариуса.', cost: { matter: 10000, sparks: 50000 }, requiredFaction: 'court', requiredRep: 'exalted', requiredSkill: 'blueprint_arcaniteMastery'},
    component_adamantiteCore: { name: "Адамантитовое ядро", description: "Сердце Бастиона. Тяжелое и прочное." },
    component_stabilizingGyroscope: { name: "Стабилизирующий Гироскоп", description: "Сложное устройство, использующее принципы резонанса арканита для укрепления структуры любого материала." },
    component_purifiedMithril: { name: "Очищенный Мифрил", description: "Мифрил, избавленный от всех примесей." },
    component_focusingLens: { name: "Фокусирующая Линза", description: "Линза, преобразующая Искры в Материю." },
};
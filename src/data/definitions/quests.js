export const quests = {
    guardianHeartQuest: {
        id: 'guardianHeartQuest',
        title: "Охота на Стража",
        description: "Лига Авантюристов прознала о древнем автоматоне. Создайте богато украшенный меч, чтобы выманить его из руин. Он падок на блестящее.",
        factionId: 'adventurers',
        trigger: { type: 'reputation', factionId: 'adventurers', level: 'honor' },
        target: { type: 'craft', itemId: 'ornateGreatsword', count: 1 },
        reward: { type: 'item', itemId: 'material_guardianHeart', amount: 1 }
    },
    purifiedMithrilQuest: {
        id: 'purifiedMithrilQuest',
        title: "Чистота Металла",
        description: "Торговая Гильдия хочет проверить ваши навыки работы с мифрилом. Изготовьте для них партию из 5 мифриловых кинжалов, и они поделятся секретом очистки.",
        factionId: 'merchants',
        trigger: { type: 'skill', skillId: 'blueprint_mithrilCrafting'},
        target: { type: 'craft', itemId: 'mithrilDagger', count: 5},
        reward: { type: 'unlock_recipe', itemId: 'craftable_purifiedMithril'}
    },
    adamantiteCoreQuest: {
        id: 'adamantiteCoreQuest',
        title: "Королевская Броня",
        description: "Королевский Двор желает укрепить свою гвардию. Создайте для капитана адамантитовый нагрудник, чтобы доказать свое мастерство. Взамен вы получите доступ к секретам создания силовых ядер.",
        factionId: 'court',
        trigger: { type: 'skill', skillId: 'blueprint_adamantiteForging'},
        target: { type: 'craft', itemId: 'adamantitePlatebody', count: 1},
        reward: { type: 'unlock_recipe', itemId: 'craftable_adamantiteCore'}
    },
    focusingLensQuest: {
        id: 'focusingLensQuest',
        title: "Магия в Металле",
        description: "Маги из Лиги Авантюристов изучают арканит. Им нужен образец вашего лучшего чародейского клинка. В награду они научат вас создавать фокусирующие линзы.",
        factionId: 'adventurers',
        trigger: { type: 'skill', skillId: 'blueprint_arcaniteMastery'},
        target: { type: 'craft', itemId: 'arcaniteSpellblade', count: 1},
        reward: { type: 'unlock_recipe', itemId: 'craftable_focusingLens'}
    },
    runeOfFortitudeQuest: {
        id: 'runeOfFortitudeQuest',
        title: "Символ Стойкости",
        description: "Чтобы получить последний секрет, вы должны доказать свое понимание рун. Создайте для Двора Королевскую Корону, и их рунмастеры поделятся с вами знаниями.",
        factionId: 'court',
        trigger: { type: 'quest', questId: 'adamantiteCoreQuest' }, 
        target: { type: 'craft', itemId: 'royalCrown', count: 1 },
        reward: { type: 'unlock_recipe', itemId: 'craftable_runeOfFortitude' }
    },
};
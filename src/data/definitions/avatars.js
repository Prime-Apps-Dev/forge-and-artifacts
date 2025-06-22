// src/data/definitions/avatars.js

export const avatars = {
    // Базовые аватары, доступные сразу
    default_avatar_male: {
        id: 'default_avatar_male',
        name: 'Кузнец-мужчина',
        src: '/img/avatars/default_male.webp', // Вам нужно будет создать эти файлы изображений
    },
    default_avatar_female: {
        id: 'default_avatar_female',
        name: 'Кузнец-женщина',
        src: '/img/avatars/default_female.webp', // Вам нужно будет создать эти файлы изображений
    },
    // Дополнительные аватары, возможно, разблокируемые в будущем
    master_blacksmith: {
        id: 'master_blacksmith',
        name: 'Мастер-кузнец',
        src: '/img/avatars/master_blacksmith.webp',
        // unlockCondition: { type: 'achievement', id: 'mastery_skills' }, // Пример условия разблокировки
    },
    royal_craftsman: {
        id: 'royal_craftsman',
        name: 'Королевский ремесленник',
        src: '/img/avatars/royal_craftsman.webp',
        // unlockCondition: { type: 'faction_court', level: 'honor' }, // Пример условия разблокировки
    },
    // Можно добавить еще
};
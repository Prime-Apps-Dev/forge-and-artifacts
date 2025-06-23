// src/data/definitions/avatars.js
import { IMAGE_PATHS } from '../../constants/paths';

export const avatars = {
    default_avatar_male: {
        id: 'default_avatar_male',
        name: 'Кузнец-мужчина',
        src: IMAGE_PATHS.AVATARS.DEFAULT_MALE,
    },
    default_avatar_female: {
        id: 'default_avatar_female',
        name: 'Кузнец-женщина',
        src: IMAGE_PATHS.AVATARS.DEFAULT_FEMALE,
    },
    master_blacksmith: {
        id: 'master_blacksmith',
        name: 'Мастер-кузнец',
        src: IMAGE_PATHS.AVATARS.MASTER_BLACKSMITH,
    },
    royal_craftsman: {
        id: 'royal_craftsman',
        name: 'Королевский ремесленник',
        src: IMAGE_PATHS.AVATARS.ROYAL_CRAFTSMAN,
    },
};
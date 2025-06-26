// src/utils/assetLoader.js

import { IMAGE_PATHS, AUDIO_PATHS } from '../constants/paths'; //
import { definitions } from '../data/definitions/index.js'; //
import * as Tone from 'tone'; // Для загрузки аудио через Tone.js

const imageAssets = [];
const audioAssets = [];

// Сбор путей изображений
for (const category in IMAGE_PATHS) { //
    if (typeof IMAGE_PATHS[category] === 'object') {
        for (const key in IMAGE_PATHS[category]) {
            const path = IMAGE_PATHS[category][key]; //
            if (typeof path === 'string') { // Убедимся, что это строка пути
                imageAssets.push(path);
            }
        }
    }
}

// Дополнительные изображения из definitions, если они не в IMAGE_PATHS (например, лица клиентов)
for (const clientId in definitions.clients) { //
    if (definitions.clients[clientId].faceImg) { //
        imageAssets.push(definitions.clients[clientId].faceImg); //
    }
}
// Дополнительные иконки предметов, если они не в IMAGE_PATHS явно
for (const itemId in definitions.items) { //
    if (definitions.items[itemId].icon && definitions.items[itemId].icon.startsWith('/img/')) { //
        imageAssets.push(definitions.items[itemId].icon); //
    }
}
// Иконки великих артефактов
for (const artifactId in definitions.greatArtifacts) { //
    if (definitions.greatArtifacts[artifactId].icon && definitions.greatArtifacts[artifactId].icon.startsWith('/img/')) { //
        imageAssets.push(definitions.greatArtifacts[artifactId].icon); //
    }
}
// Иконки достижений
for (const achievementId in definitions.achievements) { //
    if (definitions.achievements[achievementId].icon && definitions.achievements[achievementId].icon.startsWith('/img/')) { //
        imageAssets.push(definitions.achievements[achievementId].icon); //
    }
}
// Иконки аватаров
for (const avatarId in definitions.avatars) { //
    if (definitions.avatars[avatarId].src && definitions.avatars[avatarId].src.startsWith('/img/')) { //
        imageAssets.push(definitions.avatars[avatarId].src); //
    }
}
// Иконки персонала
for (const personnelId in definitions.personnel) { //
    if (definitions.personnel[personnelId].faceImg && definitions.personnel[personnelId].faceImg.startsWith('/img/')) { //
        imageAssets.push(definitions.personnel[personnelId].faceImg); //
    }
}


// Сбор путей аудио
if (AUDIO_PATHS.MUSIC) { //
    AUDIO_PATHS.MUSIC.forEach(path => audioAssets.push(path)); //
}
// ВНИМАНИЕ: Звуки SFX в Tone.js часто генерируются, а не загружаются из файлов.
// Если SFX используются как семплы, их пути также нужно добавить сюда.
// В текущем коде Tone.js SFX генерируются, поэтому их тут нет.

export const assetLoader = {
    totalAssets: imageAssets.length + audioAssets.length,
    loadedAssets: 0,
    errors: 0,
    isLoaded: false,

    async load() {
        if (this.isLoaded) return true;

        const imagePromises = imageAssets.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = () => {
                    this.loadedAssets++;
                    resolve();
                };
                img.onerror = (e) => {
                    console.error(`Failed to load image: ${src}`, e);
                    this.errors++;
                    resolve(); // Разрешаем даже при ошибке, чтобы не блокировать загрузку
                };
            });
        });

        // Загрузка аудио через Tone.js Buffer (если SFX - это семплы)
        // В данном случае, музыкальные треки - это файлы
        const audioPromises = audioAssets.map(src => {
            return new Promise(async (resolve) => {
                try {
                    // Используем Tone.Buffer.load, чтобы гарантировать, что Tone.js сможет их использовать
                    await new Tone.Buffer(src);
                    this.loadedAssets++;
                    resolve();
                } catch (e) {
                    console.error(`Failed to load audio: ${src}`, e);
                    this.errors++;
                    resolve();
                }
            });
        });
        
        await Promise.all([...imagePromises, ...audioPromises]);
        
        this.isLoaded = true;
        console.log(`Assets loaded: ${this.loadedAssets}/${this.totalAssets} (Errors: ${this.errors})`);
        return true;
    },

    getLoadProgress() {
        if (this.totalAssets === 0) return 1; // Избежать деления на ноль
        return this.loadedAssets / this.totalAssets;
    }
};
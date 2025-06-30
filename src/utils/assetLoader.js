// src/utils/assetLoader.js

import { IMAGE_PATHS, AUDIO_PATHS } from '../constants/paths';
import { definitions } from '../data/definitions/index.js';
import * as Tone from 'tone';

const imageAssets = [];
const audioAssets = [];

// Сбор путей изображений
for (const category in IMAGE_PATHS) {
    if (typeof IMAGE_PATHS[category] === 'object') {
        for (const key in IMAGE_PATHS[category]) {
            const path = IMAGE_PATHS[category][key];
            if (typeof path === 'string') {
                imageAssets.push(path);
            }
        }
    }
}

// Дополнительные изображения из definitions
for (const clientId in definitions.clients) {
    if (definitions.clients[clientId].faceImg) {
        imageAssets.push(definitions.clients[clientId].faceImg);
    }
}
for (const itemId in definitions.items) {
    if (definitions.items[itemId].icon && definitions.items[itemId].icon.startsWith('/img/')) {
        imageAssets.push(definitions.items[itemId].icon);
    }
}
for (const artifactId in definitions.greatArtifacts) {
    if (definitions.greatArtifacts[artifactId].icon && definitions.greatArtifacts[artifactId].icon.startsWith('/img/')) {
        imageAssets.push(definitions.greatArtifacts[artifactId].icon);
    }
}
for (const achievementId in definitions.achievements) {
    if (definitions.achievements[achievementId].icon && definitions.achievements[achievementId].icon.startsWith('/img/')) {
        imageAssets.push(definitions.achievements[achievementId].icon);
    }
}
for (const avatarId in definitions.avatars) {
    if (definitions.avatars[avatarId].src && definitions.avatars[avatarId].src.startsWith('/img/')) {
        imageAssets.push(definitions.avatars[avatarId].src);
    }
}
for (const personnelId in definitions.personnel) {
    if (definitions.personnel[personnelId].faceImg && definitions.personnel[personnelId].faceImg.startsWith('/img/')) {
        imageAssets.push(definitions.personnel[personnelId].faceImg);
    }
}

// ИЗМЕНЕНИЕ: Загружаем только первый трек для ускорения
if (AUDIO_PATHS.MUSIC && AUDIO_PATHS.MUSIC.length > 0) {
    audioAssets.push(AUDIO_PATHS.MUSIC[0]);
}

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
                    resolve();
                };
            });
        });

        const audioPromises = audioAssets.map(src => {
            return new Promise(async (resolve) => {
                try {
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
        if (this.totalAssets === 0) return 1;
        return this.loadedAssets / this.totalAssets;
    }
};
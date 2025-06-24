// src/utils/visualEffects.js

import { v4 as uuidv4 } from 'uuid'; // Для генерации уникальных ID частиц
// Возможно, потребуется установить 'uuid': npm install uuid

const subscribers = [];

export const visualEffects = {
    /**
     * Вызывает эффект частиц в указанной позиции.
     * @param {number} x X-координата (относительно окна).
     * @param {number} y Y-координата (относительно окна).
     * @param {string} type Тип эффекта (например, 'levelup', 'crit', 'success').
     */
    showParticleEffect(x, y, type) {
        const effect = {
            id: uuidv4(),
            x,
            y,
            type,
            timestamp: Date.now()
        };
        subscribers.forEach(callback => callback(effect));
    },

    /**
     * Подписывает компонент на события эффектов частиц.
     * @param {function} callback Функция, которая будет вызвана при появлении нового эффекта.
     * @returns {function} Функция для отписки.
     */
    subscribe(callback) {
        subscribers.push(callback);
        return () => {
            const index = subscribers.indexOf(callback);
            if (index > -1) {
                subscribers.splice(index, 1);
            }
        };
    }
};
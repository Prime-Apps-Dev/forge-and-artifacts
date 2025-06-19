// src/utils/helpers.js

import { definitions } from '../data/definitions';

// ИЗМЕНЕНИЕ: Новая функция formatNumber, которая сокращает большие числа
export function formatNumber(num, isFullNumber = false) {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    if (isFullNumber) return Math.floor(num).toLocaleString('ru-RU'); // В профиле полное число

    if (num >= 1_000_000_000_000) {
        return (num / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T';
    }
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return Math.floor(num).toLocaleString('ru-RU');
}

export const getReputationLevel = (reputation) => {
    let currentLevel = definitions.reputationLevels[0];
    for (const level of definitions.reputationLevels) {
        if (reputation >= level.threshold) {
            currentLevel = level;
        } else {
            break;
        }
    }
    return currentLevel;
};

export const hasReputation = (repState, factionId, requiredRepId) => {
    const requiredThreshold = definitions.reputationLevels.find(l => l.id === requiredRepId)?.threshold || 9999;
    return (repState[factionId] || 0) >= requiredThreshold;
};

export const getItemImageSrc = (itemKey, size = 64) => {
    const itemDef = definitions.items?.[itemKey];
    if (!itemDef || !itemDef.icon) {
        return `https://placehold.co/${size}x${size}/333/FFF?text=ITEM`;
    }

    // ИЗМЕНЕНО: Удалена логика img_placeholder:
    // if (itemDef.icon.startsWith('img_placeholder:')) {
    //     const text = itemDef.icon.split(':')[1].split('_').map(n => n.slice(0, 1)).join('').toUpperCase();
    //     return `https://placehold.co/${size}x${size}/333/FFF?text=${text}`;
    // }
    
    // Если icon теперь является прямым путем, просто возвращаем его
    return itemDef.icon; // Теперь icon - это прямой путь к файлу
};

// ИЗМЕНЕНИЕ: Форматирование множественной стоимости - убран плюсик, добавлены пробелы
export const formatCosts = (costs, state) => {
    if (!costs || Object.keys(costs).length === 0) return 'Бесплатно';
    return Object.entries(costs).map(([resourceType, costAmount]) => {
        let resourceName = '';
        let icon = '';
        let colorClass = '';

        if (resourceType === 'sparks') {
            resourceName = 'искр';
            icon = 'bolt';
            colorClass = 'text-yellow-400';
        } else if (resourceType === 'matter') {
            resourceName = 'материи';
            icon = 'bubble_chart';
            colorClass = 'text-purple-400';
        } else if (resourceType.includes('Ingots')) {
            resourceName = resourceType.replace('Ingots', ' сл.');
            icon = 'view_in_ar';
            colorClass = 'text-gray-300';
        } else if (resourceType.includes('Ore')) {
            resourceName = resourceType.replace('Ore', ' руды');
            icon = 'lens';
            colorClass = 'text-gray-400';
        } else if (definitions.specialItems[resourceType]) {
            resourceName = definitions.specialItems[resourceType].name.toLowerCase();
            icon = definitions.specialItems[resourceType].icon || 'diamond';
            colorClass = 'text-pink-400';
        } else {
            resourceName = resourceType;
            icon = 'help_outline';
            colorClass = 'text-white';
        }

        const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType === 'matter' ? 'main' : 'specialItems';
        const currentAmount = resourceStorage === 'main' ? state[resourceType] : state.specialItems?.[resourceType] || 0;

        const textColor = currentAmount >= costAmount ? 'text-white' : 'text-red-400';

        return (
            `<span class="flex items-center gap-1 ${textColor} whitespace-nowrap">` +
            `<span class="material-icons-outlined text-sm ${colorClass}">${icon}</span>` +
            `${formatNumber(costAmount)} <span class="text-xs">${resourceName}</span>` +
            `</span>`
        );
    }).join(' ');
};
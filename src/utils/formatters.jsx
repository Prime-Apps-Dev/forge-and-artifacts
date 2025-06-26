// src/utils/formatters.jsx
import React from 'react';
import { definitions } from '../data/definitions/index.js';
import { UI_CONSTANTS } from '../constants/ui';

export function formatNumber(num, isFullNumber = false) {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    if (isFullNumber) return Math.floor(num).toLocaleString('ru-RU');

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


/**
 * Новая функция для форматирования стоимости в виде JSX элементов.
 * Безопасная и предпочтительная замена для formatCosts.
 */
export function formatCostsJsx(costs, gameState) {
    if (!costs || Object.keys(costs).length === 0) return 'Бесплатно';

    return Object.entries(costs).map(([resourceType, costAmount]) => {
        const resourceInfo = UI_CONSTANTS.ICON_MAP[resourceType] || {};
        const iconPath = resourceInfo.icon;
        const iconClass = resourceInfo.class;
        const resourceName = UI_CONSTANTS.RESOURCE_NAMES[resourceType] || definitions.specialItems[resourceType]?.name?.toLowerCase() || resourceType.replace(/([A-Z])/g, ' $1').toLowerCase();

        const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType === 'matter' ? 'main' : 'specialItems';
        const currentAmount = resourceStorage === 'main' ? (gameState[resourceType] || 0) : (gameState.specialItems?.[resourceType] || 0);

        const textColor = currentAmount >= costAmount ? 'text-white' : 'text-red-400';

        let iconElement;
        if (iconPath && iconPath.startsWith('/img/')) {
            iconElement = <img src={iconPath} alt={resourceName} className="w-4 h-4 object-contain flex-shrink-0" />;
        } else {
            iconElement = <span className={`material-icons-outlined text-sm ${iconClass}`}>{iconPath || 'help_outline'}</span>;
        }

        return (
            <span key={resourceType} className={`flex items-center gap-1 ${textColor} whitespace-nowrap`}>
                {iconElement}
                {formatNumber(costAmount)}
                <span className="text-xs text-gray-500 ml-1">{resourceName}</span>
            </span>
        );
    });
}


/**
 * Устаревшая функция, генерирующая HTML-строку.
 * Оставлена для обратной совместимости, если потребуется.
 * @deprecated Используйте formatCostsJsx для безопасности и производительности.
 */
export function formatCosts(costs, gameState) {
    if (!costs || Object.keys(costs).length === 0) return 'Бесплатно';

    return Object.entries(costs).map(([resourceType, costAmount]) => {
        const resourceInfo = UI_CONSTANTS.ICON_MAP[resourceType] || {};
        const iconPath = resourceInfo.icon;
        const iconClass = resourceInfo.class;
        const resourceName = UI_CONSTANTS.RESOURCE_NAMES[resourceType] || definitions.specialItems[resourceType]?.name?.toLowerCase() || resourceType.replace(/([A-Z])/g, ' $1').toLowerCase();

        const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType === 'matter' ? 'main' : 'specialItems';
        const currentAmount = resourceStorage === 'main' ? gameState[resourceType] : gameState.specialItems?.[resourceType] || 0;

        const textColor = currentAmount >= costAmount ? 'text-white' : 'text-red-400';

        let iconHtml;
        if (iconPath && iconPath.startsWith('/img/')) {
            iconHtml = `<img src="${iconPath}" alt="${resourceName}" class="w-4 h-4 object-contain flex-shrink-0" />`;
        } else {
            iconHtml = `<span class="material-icons-outlined text-sm ${iconClass}">${iconPath || 'help_outline'}</span>`;
        }

        return (
            `<span class="flex items-center gap-1 ${textColor} whitespace-nowrap">` +
            iconHtml +
            `${formatNumber(costAmount)} <span class="text-xs">${resourceName}</span>` +
            `</span>`
        );
    }).join(' ');
}
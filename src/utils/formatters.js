// src/utils/formatters.js
import { definitions } from '../data/definitions';
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

export function formatCosts(costs, gameState) {
    if (!costs || Object.keys(costs).length === 0) return 'Бесплатно';

    return Object.entries(costs).map(([resourceType, costAmount]) => {
        const resourceInfo = UI_CONSTANTS.ICON_MAP[resourceType] || {};
        const iconPath = resourceInfo.icon;
        const iconClass = resourceInfo.class;
        const resourceName = UI_CONSTANTS.RESOURCE_NAMES[resourceType] || definitions.specialItems[resourceType]?.name?.toLowerCase() || UI_CONSTANTS.RESOURCE_NAMES.default;

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
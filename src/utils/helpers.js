// src/utils/helpers.js

import { definitions } from '../data/definitions.js'; // ИЗМЕНЕНО: Добавлен .js к пути импорта

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
    return itemDef.icon;
};

export const getResourceImageSrc = (resourceId, size = 32) => {
    const iconPath = definitions.resourceIcons[resourceId];
    if (iconPath) {
        return iconPath;
    }
    const recipeKey = Object.keys(definitions.recipes).find(key => definitions.recipes[key].output?.[resourceId]);
    if (recipeKey && definitions.recipes[recipeKey].icon) {
        return definitions.recipes[recipeKey].icon;
    }
    const specialItem = definitions.specialItems[resourceId];
    if (specialItem && specialItem.icon && specialItem.icon.startsWith('/img/')) {
        return specialItem.icon;
    }
    const textFallback = resourceId.slice(0, 3).toUpperCase();
    return `https://placehold.co/${size}x${size}/333/FFF?text=${textFallback}`;
};

export const getArtifactImageSrc = (artifactId, size = 64) => {
    const artifactDef = definitions.greatArtifacts?.[artifactId];
    if (!artifactDef || !artifactDef.icon) {
        const textFallback = artifactId.slice(0, 3).toUpperCase();
        return `https://placehold.co/${size}x${size}/333/FFF?text=ART`;
    }
    return artifactDef.icon;
};

export const formatCosts = (costs, state) => {
    if (!costs || Object.keys(costs).length === 0) return 'Бесплатно';
    return Object.entries(costs).map(([resourceType, costAmount]) => {
        let resourceName = '';
        let icon = '';
        let colorClass = '';

        switch (resourceType) {
            case 'sparks':
                resourceName = 'искр';
                icon = 'bolt';
                colorClass = 'text-yellow-400';
                break;
            case 'matter':
                resourceName = 'материи';
                icon = 'bubble_chart';
                colorClass = 'text-purple-400';
                break;
            case 'ironOre':
                resourceName = 'жел. руды';
                icon = 'lens';
                colorClass = 'text-gray-400';
                break;
            case 'copperOre':
                resourceName = 'медн. руды';
                icon = 'filter_alt';
                colorClass = 'text-orange-400';
                break;
            case 'mithrilOre':
                resourceName = 'мифр. руды';
                icon = 'ac_unit';
                colorClass = 'text-cyan-400';
                break;
            case 'adamantiteOre':
                resourceName = 'адам. руды';
                icon = 'diamond';
                colorClass = 'text-indigo-400';
                break;
            case 'ironIngots':
                resourceName = 'жел. сл.';
                icon = 'view_in_ar';
                colorClass = 'text-gray-300';
                break;
            case 'copperIngots':
                resourceName = 'медн. сл.';
                icon = 'view_in_ar';
                colorClass = 'text-orange-400';
                break;
            case 'bronzeIngots':
                resourceName = 'бронз. сл.';
                icon = 'shield';
                colorClass = 'text-orange-600';
                break;
            case 'sparksteelIngots':
                resourceName = 'искр. сл.';
                icon = 'local_gas_station';
                colorClass = 'text-red-400';
                break;
            case 'mithrilIngots':
                resourceName = 'мифр. сл.';
                icon = 'shield_moon';
                colorClass = 'text-cyan-300';
                break;
            case 'adamantiteIngots':
                resourceName = 'адам. сл.';
                icon = 'security';
                colorClass = 'text-indigo-300';
                break;
            case 'arcaniteIngots':
                resourceName = 'аркан. сл.';
                icon = 'auto_fix_high';
                colorClass = 'text-fuchsia-500';
                break;
            case 'gem':
                resourceName = 'самоцветы';
                icon = 'diamond';
                colorClass = 'text-pink-400';
                break;
            case 'expeditionMap':
                resourceName = 'карт вылазок';
                icon = 'map';
                colorClass = 'text-yellow-600';
                break;
            default:
                const specialItemDef = definitions.specialItems[resourceType];
                if (specialItemDef) {
                    resourceName = specialItemDef.name.toLowerCase();
                    icon = specialItemDef.icon || 'help_outline';
                    colorClass = 'text-white';
                } else {
                    resourceName = resourceType;
                    icon = 'help_outline';
                    colorClass = 'text-white';
                }
        }

        const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType === 'matter' ? 'main' : 'specialItems';
        const currentAmount = resourceStorage === 'main' ? state[resourceType] : state.specialItems?.[resourceType] || 0;

        const textColor = currentAmount >= costAmount ? 'text-white' : 'text-red-400';

        const imageSrcForResource = getResourceImageSrc(resourceType, 16);
        const useImgTag = imageSrcForResource && imageSrcForResource.startsWith('/img/');
        
        let iconHtml;
        if (useImgTag) {
            iconHtml = `<img src="${imageSrcForResource}" alt="${resourceName}" class="w-4 h-4 object-contain flex-shrink-0" />`;
        } else {
            iconHtml = `<span class="material-icons-outlined text-sm ${colorClass}">${icon}</span>`;
        }

        return (
            `<span class="flex items-center gap-1 ${textColor} whitespace-nowrap">` +
            iconHtml +
            `${formatNumber(costAmount)} <span class="text-xs">${resourceName}</span>` +
            `</span>`
        );
    }).join(' ');
};
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

export function formatCostsString(costs) {
    if (!costs || Object.keys(costs).length === 0) return 'Бесплатно';

    return Object.entries(costs).map(([resourceType, costAmount]) => {
        const resourceName = UI_CONSTANTS.RESOURCE_NAMES[resourceType] || definitions.specialItems[resourceType]?.name?.toLowerCase() || resourceType.replace(/([A-Z])/g, ' $1').toLowerCase();
        return `${formatNumber(costAmount)} ${resourceName}`;
    }).join(', ');
}

export function formatCostsJsx(costs, gameState) {
    if (!costs || Object.keys(costs).length === 0) return <span className="text-gray-400">Бесплатно</span>;

    return Object.entries(costs).flatMap(([resourceType, costAmount]) => {
        // --- Обработка репутации ---
        if (resourceType === 'reputation' && typeof costAmount === 'object') {
            return Object.entries(costAmount).map(([factionId, repAmount]) => {
                const factionDef = definitions.factions[factionId];
                if (!factionDef) return null;
                return (
                    <span key={factionId} className="flex items-center gap-1 text-white whitespace-nowrap text-sm">
                        <span className={`material-icons-outlined text-base text-${factionDef.color}`}>{factionDef.icon}</span>
                        {`+${formatNumber(repAmount)} реп. (${factionDef.name})`}
                    </span>
                );
            }).filter(Boolean);
        }

        // --- Обработка особых предметов ---
        if (resourceType === 'specialItems' && typeof costAmount === 'object') {
            return Object.entries(costAmount).map(([itemId, amount]) => {
                const specialItemDef = definitions.specialItems[itemId];
                if (!specialItemDef) return null;
                const resourceInfo = UI_CONSTANTS.ICON_MAP[itemId] || {};
                const iconPath = resourceInfo.icon || specialItemDef.icon;
                const iconClass = resourceInfo.class;
                const currentAmount = gameState?.specialItems?.[itemId] || 0;
                const textColor = currentAmount >= amount ? 'text-white' : 'text-red-400';

                let iconElement = iconPath ? (
                    iconPath.startsWith('/img/') ?
                    <img src={iconPath} alt={specialItemDef.name} className="w-4 h-4 object-contain flex-shrink-0" /> :
                    <span className={`material-icons-outlined text-sm ${iconClass || 'text-pink-400'}`}>{iconPath}</span>
                ) : null;
                
                return (
                    <span key={itemId} className={`flex items-center gap-1 ${textColor} whitespace-nowrap`}>
                        {iconElement}
                        {formatNumber(amount)}
                    </span>
                );
            }).filter(Boolean);
        }
        
        // --- Обработка стандартных ресурсов ---
        const resourceInfo = UI_CONSTANTS.ICON_MAP[resourceType] || {};
        const iconPath = resourceInfo.icon;
        const iconClass = resourceInfo.class;
        const currentAmount = gameState?.[resourceType] || 0;
        const textColor = currentAmount >= costAmount ? 'text-white' : 'text-red-400';

        let iconElement = iconPath ? (
            iconPath.startsWith('/img/') ?
            <img src={iconPath} alt={resourceType} className="w-4 h-4 object-contain flex-shrink-0" /> :
            <span className={`material-icons-outlined text-sm ${iconClass}`}>{iconPath}</span>
        ) : null;

        return (
            <span key={resourceType} className={`flex items-center gap-1 ${textColor} whitespace-nowrap`}>
                {iconElement}
                {formatNumber(costAmount)}
            </span>
        );
    });
}
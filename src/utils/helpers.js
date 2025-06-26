// src/utils/helpers.js
import { definitions } from '../data/definitions/index.js';
import { UI_CONSTANTS } from '../constants/ui';

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
    const requiredThreshold = definitions.reputationLevels.find(l => l.id === requiredRepId)?.threshold || Infinity;
    return (repState[factionId] || 0) >= requiredThreshold;
};

export const getItemImageSrc = (itemKey, size = 64) => {
    const itemDef = definitions.items?.[itemKey];
    if (!itemDef || !itemDef.icon) {
        return UI_CONSTANTS.PLACEHOLDER_ITEM_SRC(size);
    }
    return itemDef.icon;
};

export const getResourceImageSrc = (resourceId, size = 32) => {
    const iconInfo = UI_CONSTANTS.ICON_MAP[resourceId];
    if (iconInfo && iconInfo.icon && iconInfo.icon.startsWith('/img/')) {
        return iconInfo.icon;
    }
    return UI_CONSTANTS.PLACEHOLDER_RESOURCE_SRC(size, resourceId.slice(0, 3).toUpperCase());
};

export const getArtifactImageSrc = (artifactId, size = 64) => {
    const artifactDef = definitions.greatArtifacts?.[artifactId];
    if (!artifactDef || !artifactDef.icon) {
        return UI_CONSTANTS.PLACEHOLDER_ARTIFACT_SRC(size);
    }
    return artifactDef.icon;
};
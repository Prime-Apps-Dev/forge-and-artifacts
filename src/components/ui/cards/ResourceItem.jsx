// src/components/ui/cards/ResourceItem.jsx
import React from 'react';
import SvgIcon from '../display/SvgIcon';
import { formatNumber } from '../../../utils/formatters.jsx';
import { getResourceImageSrc } from '../../../utils/helpers.js';

const ResourceItem = React.memo(({ icon, name, initialValue, resourceId, iconClass, iconType = 'icon' }) => {
    
    const iconSrc = iconType === 'img' ? getResourceImageSrc(resourceId) : null;
    
    return (
        <li className="bg-gray-800/50 border border-gray-700 rounded-md p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
                {iconType === 'icon' ? (
                    <span className={`material-icons-outlined text-2xl ${iconClass}`}>{icon}</span>
                ) : (
                    <img src={iconSrc} alt={name} className="w-6 h-6 object-contain flex-shrink-0" />
                )}
                <p className="text-sm text-gray-300">{name}</p>
            </div>
            <div className="text-right">
                <span className="font-cinzel font-bold text-lg text-white">{formatNumber(initialValue)}</span>
            </div>
        </li>
    );
});

export default ResourceItem;
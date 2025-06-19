import React from 'react';
import SvgIcon from './SvgIcon';
import { formatNumber } from '../../utils/helpers';

const ResourceItem = React.memo(({ icon, name, initialValue, resourceKey, iconClass }) => {
    return (
        <li className="bg-gray-800/50 border border-gray-700 rounded-md p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className={`material-icons-outlined text-2xl ${iconClass}`}>{icon}</span>
                <p className="text-sm text-gray-300">{name}</p>
            </div>
            <div className="text-right">
                <span className="font-cinzel font-bold text-lg text-white">{formatNumber(initialValue)}</span> {/* ИЗМЕНЕНИЕ: Теперь использует сокращенное форматирование */}
            </div>
        </li>
    );
});

export default ResourceItem;
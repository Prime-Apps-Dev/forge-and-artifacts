// src/components/ui/cards/ComponentItem.jsx
import React, { memo } from 'react';
import { definitions } from '../../../data/definitions/index.js';
import { useGame } from '../../../context/GameContext.jsx';

const ComponentItem = memo(({ component, orderState }) => {
    const { displayedGameState: gameState, handlers } = useGame();

    const progress = orderState.componentProgress[component.id] || 0;
    const isComplete = progress >= component.progress;
    const isActive = orderState.activeComponentId === component.id;

    const dependenciesMet = !component.requires || component.requires.every(reqId => {
        const requiredComponentDef = definitions.items[orderState.itemKey].components.find(c => c.id === reqId);
        return (orderState.componentProgress[reqId] || 0) >= (requiredComponentDef?.progress || 0);
    });

    const canSelect = !isComplete && dependenciesMet;

    let classes = "p-2 border-l-4 transition-colors duration-200 ";
    if (isComplete) {
        classes += "border-green-500 bg-green-500/10";
    } else if (isActive) {
        classes += "border-orange-500 bg-orange-500/20";
    } else if (canSelect) {
        classes += "border-gray-500 hover:bg-gray-700/50 cursor-pointer";
    } else {
        classes += "border-gray-800 filter grayscale opacity-60 cursor-not-allowed";
    }

    const costString = component.cost ? Object.entries(component.cost).map(([key, value]) => {
        let resourceName = definitions.specialItems[key]?.name || key.replace('Ingots', ' слитков').replace('sparks', ' искр').replace('matter', ' материи');
        const actualCost = Math.max(1, value - (gameState.componentCostReduction || 0));
        return `${actualCost} ${resourceName}`;
    }).join(', ') : 'Бесплатно';

    return (
        <div className={classes} onClick={() => canSelect && handlers.handleSelectComponent(component.id)}>
            <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                    <span className="material-icons-outlined text-base text-gray-500">{definitions.workstations[component.workstation].icon}</span>
                    <span className="font-bold">{component.name}</span>
                </div>
                <span className="text-xs text-gray-400">{costString}</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-2 mt-1">
                <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${isComplete ? 100 : (progress / component.progress) * 100}%`, transition: 'width 0.2s linear' }}
                ></div>
            </div>
        </div>
    );
});

export default ComponentItem;
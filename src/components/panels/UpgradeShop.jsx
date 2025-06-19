import React from 'react';
import { definitions } from '../../data/definitions';
import ShopUpgradeButton from '../ui/ShopUpgradeButton';

const UpgradeShop = ({ gameState, handlers }) => {
    const availableUpgrades = Object.keys(definitions.upgrades).filter(id => {
        const upgrade = definitions.upgrades[id];
        const level = gameState.upgradeLevels[id] || 0;

        const isRegionLocked = upgrade.region && upgrade.region !== gameState.currentRegion;
        if (isRegionLocked) {
            return false;
        }

        if (upgrade.isMultiLevel) {
            return level < upgrade.maxLevel;
        } else {
            return level === 0;
        }
    });

    return (
        <div className="panel-section">
            <h4 className="font-cinzel text-lg text-gray-400 border-b border-gray-700/50 pb-1 mb-4">Мастерская</h4>
            <div className="flex flex-col gap-4">
                {availableUpgrades.length > 0 ? (
                    availableUpgrades.map(id => (
                        <ShopUpgradeButton
                            key={id}
                            upgradeId={id}
                            gameState={gameState}
                            onBuyUpgrade={(...args) => handlers.handleBuyUpgrade(id, 'upgrades', ...args)}
                            upgradeType="upgrades"
                        />
                    ))
                ) : (
                    <p className="text-gray-500 italic text-center">Все доступные улучшения для мастерской куплены.</p>
                )}
            </div>
        </div>
    );
};

export default UpgradeShop;
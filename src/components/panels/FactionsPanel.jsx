import React from 'react';
import { definitions } from '../../data/definitions';
import FactionReputation from '../ui/cards/FactionReputation'; // Обновленный путь
import FactionUpgradeButton from '../ui/buttons/FactionUpgradeButton'; // Обновленный путь

const FactionsPanel = ({ gameState, onBuyFactionUpgrade }) => {
    const upgradesByFaction = Object.values(definitions.factionUpgrades).reduce((acc, upgrade) => {
        if (!acc[upgrade.factionId]) {
            acc[upgrade.factionId] = [];
        }
        acc[upgrade.factionId].push(upgrade);
        return acc;
    }, {});

    const currentEvent = gameState.market.worldEvent;
    const isConflict = currentEvent.type === 'faction_conflict';
    const conflictingFactions = isConflict ? currentEvent.conflictingFactions : [];

    return (
         <div className="panel-section">
            <h3 className="font-cinzel text-lg text-gray-400 border-b border-gray-700/50 pb-1 mb-4">Фракции</h3>
            <p className="text-gray-400 text-sm mb-4">Выполняйте заказы фракций, чтобы повысить репутацию и получить доступ к уникальным улучшениям для мастерской.</p>
            
            <div className="space-y-6">
                {Object.keys(definitions.factions).map(factionId => {
                    const isInConflict = conflictingFactions.includes(factionId);

                    return (
                        <div key={factionId} className={`p-4 rounded-lg border ${isInConflict ? 'bg-red-900/20 border-red-700' : 'bg-black/20 border-gray-800'}`}>
                            <FactionReputation factionId={factionId} gameState={gameState} />

                            <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                                <h4 className="font-bold text-gray-300">Доступные улучшения:</h4>
                                {isInConflict ? (
                                    <p className="text-sm text-red-400 italic">Улучшения временно недоступны из-за конфликта фракций.</p>
                                ) : (
                                    upgradesByFaction[factionId] && upgradesByFaction[factionId].length > 0 ? (
                                        upgradesByFaction[factionId].map(upgrade => (
                                            <FactionUpgradeButton 
                                                key={upgrade.id}
                                                upgradeId={upgrade.id}
                                                gameState={gameState}
                                                onBuyFactionUpgrade={onBuyFactionUpgrade}
                                            />
                                        ))
                                     ) : (
                                        <p className="text-sm text-gray-500 italic">Нет доступных улучшений от этой фракции.</p>
                                     )
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FactionsPanel;
// src/components/modals/WorldMapModal.jsx

import React from 'react';
import { definitions } from '../../data/definitions';
import Tooltip from '../ui/Tooltip'; // ИЗМЕНЕНО: Исправлен путь к Tooltip
import { formatNumber } from '../../utils/helpers';

const WorldMapModal = ({ isOpen, onClose, gameState, onSelectRegion }) => {
    if (!isOpen) return null;

    const checkRegionUnlockConditions = (region) => {
        if (!region.unlockConditions || region.unlockConditions.length === 0) {
            return { unlocked: true, tooltip: "" };
        }

        let conditionsMet = true;
        let tooltipMessages = [];

        region.unlockConditions.forEach(condition => {
            if (condition.type === 'prestigePoints') {
                if (gameState.prestigePoints < condition.value) {
                    conditionsMet = false;
                    tooltipMessages.push(`Требуется ${formatNumber(condition.value)} Осколков Памяти (у вас: ${formatNumber(gameState.prestigePoints)})`);
                }
            } else if (condition.type === 'regionsVisited') {
                if (!gameState.regionsVisited.includes(condition.regionId)) {
                    conditionsMet = false;
                    tooltipMessages.push(`Требуется посетить регион "${definitions.regions[condition.regionId]?.name || condition.regionId}"`);
                }
            }
        });

        return { unlocked: conditionsMet, tooltip: tooltipMessages.join("\n") };
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div
                className="bg-gray-900 border-2 border-orange-500 rounded-lg shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] flex flex-col modal-content"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="font-cinzel text-3xl text-center text-orange-400 text-shadow-glow mb-4">
                    Выберите Новый Регион
                </h2>
                <p className="text-gray-300 text-center mb-6">
                    Ваша старая мастерская выполнила свое предназначение. Выберите, где основать новую, чтобы продолжить свой путь Мастера!
                    Каждый регион предлагает свои уникальные возможности и вызовы.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
                    {Object.values(definitions.regions).map(region => {
                        const { unlocked, tooltip } = checkRegionUnlockConditions(region);
                        const isCurrentRegion = gameState.currentRegion === region.id;
                        const hasVisitedBefore = gameState.regionsVisited.includes(region.id);

                        return (
                            <Tooltip key={region.id} text={tooltip}>
                                <div
                                    className={`
                                        p-4 rounded-lg border-2 flex flex-col h-full
                                        ${isCurrentRegion ? 'border-yellow-500 bg-yellow-900/20 shadow-lg' :
                                          hasVisitedBefore ? 'border-blue-500 bg-blue-900/20' :
                                          unlocked ? 'border-green-500 bg-green-900/20 hover:bg-green-800/20 cursor-pointer' :
                                          'border-gray-700 bg-black/30 opacity-50 cursor-not-allowed'}
                                    `}
                                    onClick={() => {
                                        if (unlocked && !isCurrentRegion) {
                                            onSelectRegion(region.id);
                                        }
                                    }}
                                >
                                    <h3 className={`font-cinzel text-xl mb-2 ${isCurrentRegion ? 'text-yellow-300' : 'text-orange-400'}`}>
                                        {region.name}
                                    </h3>
                                    <p className="text-gray-300 text-sm grow mb-3">
                                        {region.description}
                                    </p>
                                    <div className="text-sm text-gray-400 mb-2">
                                        <p className="font-bold text-white">Модификаторы:</p>
                                        {Object.entries(region.modifiers.miningSpeed || {}).map(([oreType, mod]) => (
                                            <p key={oreType} className="ml-2">
                                                - Добыча {oreType.replace('Ore', ' руды')}: <span className={mod >= 1.0 ? 'text-green-400' : 'text-red-400'}>{(mod * 100).toFixed(0)}%</span>
                                            </p>
                                        ))}
                                        {Object.entries(region.modifiers.marketDemand || {}).map(([itemType, mod]) => (
                                            <p key={itemType} className="ml-2">
                                                - Спрос на {itemType}: <span className={mod >= 1.0 ? 'text-green-400' : 'text-red-400'}>{(mod * 100).toFixed(0)}%</span>
                                            </p>
                                        ))}
                                    </div>

                                    {isCurrentRegion && (
                                        <p className="text-yellow-300 font-bold mt-auto">Текущий регион</p>
                                    )}
                                    {hasVisitedBefore && !isCurrentRegion && (
                                        <p className="text-blue-300 font-bold mt-auto">Ранее посещен</p>
                                    )}
                                    {!unlocked && (
                                        <p className="text-red-400 font-bold mt-auto">Заблокировано</p>
                                    )}
                                    {unlocked && !isCurrentRegion && !hasVisitedBefore && (
                                        <button
                                            onClick={() => onSelectRegion(region.id)}
                                            className="interactive-element mt-auto w-full bg-orange-600 text-black font-bold py-2 px-4 rounded-lg hover:bg-orange-500"
                                        >
                                            Выбрать этот регион
                                        </button>
                                    )}
                                </div>
                            </Tooltip>
                        );
                    })}
                </div>
                <button
                    onClick={onClose}
                    className="interactive-element mt-6 w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500"
                >
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default WorldMapModal;
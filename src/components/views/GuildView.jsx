import React, { useState, useMemo, useEffect } from 'react';
import { definitions } from '../../data/definitions';
import { formatNumber } from '../../utils/formatters';
import { getItemImageSrc } from '../../utils/helpers';

const MissionRequirement = ({ req, inventory, onSelectGear, selectedItemId, allSelectedGear }) => {
    const itemDef = definitions.items?.[req.itemKey];
    if (!itemDef) return null;

    const suitableItems = useMemo(() => {
        const otherSelectedIds = Object.values(allSelectedGear).filter(id => id !== selectedItemId);

        return inventory.filter(item =>
            item.location === 'inventory' &&
            item.itemKey === req.itemKey &&
            item.quality >= req.minQuality &&
            !otherSelectedIds.includes(item.uniqueId)
        );
    }, [inventory, req, selectedItemId, allSelectedGear]);

    const currentlySelectedItem = inventory.find(item => item.uniqueId === selectedItemId);

    return (
        <div className={`flex flex-col gap-2 bg-gray-900/50 p-2 rounded-md border ${currentlySelectedItem ? 'border-green-500' : 'border-gray-700'}`}>
            <div className="flex items-center gap-2">
                <img
                    src={getItemImageSrc(req.itemKey, 32)}
                    alt={itemDef.name}
                    className="w-8 h-8 object-contain"
                />
                <div className="text-sm">
                    <p className="text-white">{itemDef.name}</p>
                    <p className="text-xs text-gray-400">Качество не ниже: {req.minQuality.toFixed(1)}</p>
                </div>
            </div>

            {currentlySelectedItem ? (
                <div className="bg-black/30 p-1 rounded text-center text-xs">
                    <p>Выбрано: <span className="font-bold text-green-400">Кач-во {currentlySelectedItem.quality.toFixed(2)}</span></p>
                    <button onClick={() => onSelectGear(null)} className="text-red-400 hover:text-red-300 text-xs">(отменить)</button>
                </div>
            ) : (
                <select
                    onChange={(e) => onSelectGear(e.target.value || null)}
                    className="bg-gray-800 border border-gray-600 text-white text-xs rounded-md p-1 w-full focus:outline-none focus:border-orange-500"
                >
                    <option value="">{suitableItems.length > 0 ? 'Выбрать предмет...' : 'Нет подходящих предметов'}</option>
                    {suitableItems.map(item => (
                        <option key={item.uniqueId} value={item.uniqueId}>
                            Качество: {item.quality.toFixed(2)}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

const MissionCard = ({ mission, gameState, handlers }) => {
    const [selectedGear, setSelectedGear] = useState({});

    const expandedRequirements = useMemo(() =>
        mission.requiredGear.flatMap((req, originalIndex) =>
            Array.from({ length: req.count }, (_, i) => ({
                ...req,
                uniqueReqKey: `${mission.id}-${originalIndex}-${i}`
            }))
        ), [mission]);

    const handleSelectGear = (uniqueReqKey, itemUniqueId) => {
        setSelectedGear(prev => {
            const newSelection = { ...prev };
            const isAlreadySelected = Object.values(newSelection).includes(itemUniqueId);
            if (itemUniqueId && isAlreadySelected) {
                handlers.showToast("Этот предмет уже выбран для другого слота!", "error");
                return prev;
            }

            if (itemUniqueId) {
                newSelection[uniqueReqKey] = itemUniqueId;
            } else {
                delete newSelection[uniqueReqKey];
            }
            return newSelection;
        });
    };
    
    const allRequirementsMet = expandedRequirements.length === Object.keys(selectedGear).length;

    const handlePrepareExpedition = () => {
        if (!allRequirementsMet) return;
        handlers.handleStartMission(mission.id, selectedGear);
    };

    return (
        <div className="bg-black/20 p-4 rounded-lg border border-gray-700 flex flex-col">
            <h3 className="font-cinzel text-lg text-orange-400">{mission.name}</h3>
            <p className="text-sm text-gray-400 my-2 grow">{mission.description}</p>
            
            <div className="my-2">
                <h4 className="font-bold text-sm text-gray-300 mb-2">Требуемое снаряжение:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {expandedRequirements.map((req) => (
                        <MissionRequirement
                            key={req.uniqueReqKey}
                            req={req}
                            inventory={gameState.inventory}
                            onSelectGear={(itemUniqueId) => handleSelectGear(req.uniqueReqKey, itemUniqueId)}
                            selectedItemId={selectedGear[req.uniqueReqKey]}
                            allSelectedGear={selectedGear}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700/50">
                <h4 className="font-bold text-sm text-gray-300 mb-2">Базовая награда:</h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {Object.entries(mission.baseReward).map(([key, value]) => {
                        if (key === 'reputation') {
                            return Object.entries(value).map(([factionId, repValue]) => (
                                <p key={factionId} className="text-purple-400">+{repValue} реп. ({definitions.factions?.[factionId]?.name || factionId})</p>
                            ));
                        }
                        return (
                             <p key={key} className="text-yellow-400">+{formatNumber(value)} {key}</p>
                        )
                    })}
                </div>
            </div>
            
            <button
                onClick={handlePrepareExpedition}
                disabled={!allRequirementsMet}
                className="interactive-element w-full mt-4 bg-orange-800/80 text-white font-bold py-2 px-4 rounded-md hover:enabled:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {allRequirementsMet ? 'Отправить экспедицию' : 'Снаряжение не готово'}
            </button>
        </div>
    );
};

const ActiveMission = ({ mission }) => {
    const missionDef = definitions.missions?.[mission.missionId];
    if (!missionDef) return null;

    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const updateTimer = () => {
            const endTime = mission.startTime + mission.duration * 1000;
            const remaining = Math.max(0, endTime - Date.now());
            setTimeLeft(remaining);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [mission]);
    
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = ((timeLeft % 60000) / 1000).toFixed(0).padStart(2, '0');

    return (
        <div className="bg-black/40 p-3 rounded-lg border border-yellow-700/50">
            <p className="font-bold text-yellow-400">{missionDef.name}</p>
            <p className="text-sm text-gray-300">Возвращение через: <span className="font-mono">{minutes}:{seconds}</span></p>
        </div>
    )
}

const GuildView = ({ gameState, handlers }) => {
    const availableMissions = Object.values(definitions.missions).filter(
        missionDef => !gameState.activeMissions.some(active => active.missionId === missionDef.id)
    );

    return (
        <div>
            <h2 className="font-cinzel text-2xl accent-glow-color text-shadow-glow flex items-center gap-2 border-b border-gray-700 pb-4 mb-6">
                <span className="material-icons-outlined">hub</span> Гильдия Мастеров
            </h2>
            <p className="text-gray-400 mb-6">Здесь вы можете браться за особые поручения, требующие не только вашего времени, но и мастерства. Снабдите экспедиции лучшим снаряжением, чтобы получить достойную награду.</p>
            
            {gameState.activeMissions.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-cinzel text-xl text-yellow-400 mb-3">Экспедиции в пути</h3>
                    <div className="space-y-2">
                        {gameState.activeMissions.map(mission => (
                            <ActiveMission key={mission.id} mission={mission} />
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h3 className="font-cinzel text-xl text-orange-400 mb-3">Доступные поручения</h3>
                {availableMissions.length > 0 ? (
                    <div className="space-y-4">
                        {availableMissions.map(mission => (
                            <MissionCard key={mission.id} mission={mission} gameState={gameState} handlers={handlers} />
                        ))}
                    </div>
                ) : (
                     <p className="text-gray-500 italic text-center py-8">В данный момент все доступные экспедиции уже отправлены.</p>
                )}
            </div>
        </div>
    );
};

export default GuildView;
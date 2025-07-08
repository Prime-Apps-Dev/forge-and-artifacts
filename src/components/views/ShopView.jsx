// src/components/views/ShopView.jsx
import React, { useMemo } from 'react';
import { definitions } from '../../data/definitions/index.js';
import { formatCostsJsx } from '../../utils/formatters.jsx';
import { hasReputation } from '../../utils/helpers';
import TradeableResource from '../ui/cards/TradeableResource';
import { useGame } from '../../context/useGame.js';

const ShopView = () => {
    const { displayedGameState: gameState, handlers } = useGame();

    const market = gameState.market;
    const currentEvent = gameState.market.worldEvent;
    const isConflict = currentEvent.type === 'faction_conflict';
    const conflictingFactions = isConflict ? currentEvent.conflictingFactions : [];

    const availableBlueprints = useMemo(() => {
        return Object.entries(definitions.specialItems).filter(([id, item]) =>
            id.includes('blueprint') &&
            !item.requiredFaction &&
            item.requiredSkill && gameState.purchasedSkills[item.requiredSkill] &&
            !(gameState.specialItems[id] > 0)
        );
    }, [gameState.purchasedSkills, gameState.specialItems]);

    const FactionStore = () => {
        const courtSpecialItems = useMemo(() => {
            return Object.entries(definitions.specialItems).filter(([id, item]) =>
                item.requiredFaction === 'court' &&
                (!item.requiredSkill || gameState.purchasedSkills[item.requiredSkill]) &&
                !id.startsWith('blueprint_aegis') && !id.startsWith('blueprint_hammer') && !id.startsWith('blueprint_crown') &&
                !id.startsWith('blueprint_bastion') && !id.startsWith('blueprint_quill')
            );
        }, [gameState.purchasedSkills]);

        return (
            <div className="mt-8">
                <h3 className="font-cinzel text-xl text-orange-400 mb-4">Предложения Фракций</h3>
                <div className="space-y-4">
                    {conflictingFactions.includes('merchants') ? (
                         <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 italic text-sm">Инвестиции временно недоступны из-за конфликта с Гильдией Торговцев.</div>
                    ) : (
                        hasReputation(gameState.reputation, 'merchants', 'exalted') && (
                        <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                            <h4 className="font-bold text-yellow-300 flex items-center gap-2"><span className="material-icons-outlined">monetization_on</span>Инвестиции Гильдии</h4>
                            <p className="text-sm text-yellow-400/80 my-2">Инвестируйте в торговые пути для пассивного дохода.</p>
                            <button onClick={handlers.handleInvest} disabled={gameState.investments.merchants} className="w-full text-left p-2 bg-black/30 rounded-sm hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed">
                                {gameState.investments.merchants ? "Инвестиция сделана" : `Инвестировать 25,000 искр`}
                            </button>
                        </div>
                    ))}
                    {conflictingFactions.includes('adventurers') ? (
                        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 italic text-sm">Товары Лиги Авантюристов временно недоступны из-за конфликта.</div>
                    ) : (
                        hasReputation(gameState.reputation, 'adventurers', 'respect') && (
                        <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                            <h4 className="font-bold text-green-300 flex items-center gap-2"><span className="material-icons-outlined">explore</span>Товары Авантюристов</h4>
                            <button
                                onClick={() => handlers.handleBuySpecialItem('expeditionMap')}
                                disabled={Object.entries(definitions.specialItems.expeditionMap.cost).some(([res, val]) => (gameState[res] || gameState.specialItems[res] || 0) < val)}
                                className="w-full text-left p-2 mt-2 bg-black/30 rounded-sm hover:bg-black/50 flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>Купить: Карта вылазки</span>
                                <span className="text-sm flex gap-2">{formatCostsJsx(definitions.specialItems.expeditionMap.cost, gameState)}</span>
                            </button>
                        </div>
                    ))}
                     {conflictingFactions.includes('court') ? (
                        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 italic text-sm">Доступ к Королевской Сокровищнице временно закрыт из-за конфликта.</div>
                    ) : (
                        hasReputation(gameState.reputation, 'court', 'honor') && (
                        <div className="p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
                            <h4 className="font-bold text-purple-300 flex items-center gap-2"><span className="material-icons-outlined">account_balance</span>Королевская Сокровищница</h4>
                                {courtSpecialItems.length > 0 ? (
                                    courtSpecialItems.map(([id, item]) => (
                                        <button
                                            key={id}
                                            onClick={() => handlers.handleBuySpecialItem(id)}
                                            disabled={gameState.specialItems[id] > 0 || (item.requiredSkill && !gameState.purchasedSkills[item.requiredSkill]) || Object.entries(item.cost).some(([res, val]) => (gameState[res] || gameState.specialItems[res] || 0) < val)}
                                            className="w-full text-left p-2 mt-2 bg-black/30 rounded-sm hover:bg-black/50 flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span>{gameState.specialItems[id] > 0 ? "Куплено:" : "Купить:"} {item.name}</span>
                                            <span className="text-sm flex gap-2">{formatCostsJsx(item.cost, gameState)}</span>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic">Нет доступных предложений от Двора.</p>
                                )}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div>
             <h2 className="font-cinzel text-2xl accent-glow-color text-shadow-glow flex items-center gap-2 border-b border-gray-700 pb-4 mb-6">
                <span className="material-icons-outlined">shopping_cart</span> Лавка
            </h2>
            <div className={`p-4 mb-6 rounded-lg border ${isConflict ? 'bg-red-900/30 border-red-700' : 'bg-blue-900/30 border-blue-700'}`}>
                <h4 className="font-bold flex items-center gap-2"><span className="material-icons-outlined">newspaper</span>Новости Королевства</h4>
                <p className="text-gray-300 italic">"{market.worldEvent.message}"</p>
            </div>
            <h3 className="font-cinzel text-xl text-orange-400 mb-4">Рынок Ресурсов</h3>
            <div className="flex flex-col gap-4">
                <TradeableResource resourceId="ironOre" name={definitions.resources.ironOre.name} icon="lens" iconClass="text-gray-400" />
                <TradeableResource resourceId="ironIngots" name={definitions.resources.ironIngots.name} icon="view_in_ar" iconClass="text-gray-300" />
                <hr className="border-gray-700 my-2" />
                {gameState.purchasedSkills.findCopper && (
                    <>
                        <TradeableResource resourceId="copperOre" name={definitions.resources.copperOre.name} icon="filter_alt" iconClass="text-orange-400" />
                        <TradeableResource resourceId="copperIngots" name={definitions.resources.copperIngots.name} icon="view_in_ar" iconClass="text-orange-400" />
                    </>
                )}
                {gameState.purchasedSkills.artOfAlloys && <TradeableResource resourceId="bronzeIngots" name={definitions.resources.bronzeIngots.name} icon="shield" iconClass="text-orange-600" />}
                {gameState.purchasedSkills.mithrilProspecting && <TradeableResource resourceId="mithrilIngots" name={definitions.resources.mithrilIngots.name} icon="shield_moon" iconClass="text-cyan-300" />}
                {gameState.purchasedSkills.adamantiteMining && <TradeableResource resourceId="adamantiteIngots" name={definitions.resources.adamantiteIngots.name} icon="security" iconClass="text-indigo-300" />}
                {gameState.purchasedSkills.arcaneMetallurgy && <TradeableResource resourceId="arcaniteIngots" name={definitions.resources.arcaniteIngots.name} icon="auto_fix_high" iconClass="text-fuchsia-500" />}
            </div>

            {availableBlueprints.length > 0 && (
                <div className="mt-8">
                    <h3 className="font-cinzel text-xl text-yellow-400 mb-4">Чертежи для покупки</h3>
                    <div className="space-y-4">
                        {availableBlueprints.map(([id, item]) => (
                            <button
                                key={id}
                                onClick={() => handlers.handleBuySpecialItem(id)}
                                disabled={Object.entries(item.cost).some(([res, val]) => (gameState[res] || gameState.specialItems[res] || 0) < val)}
                                className="w-full text-left p-2 bg-black/30 rounded-sm hover:bg-black/50 flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>Купить: {item.name}</span>
                                <span className="text-sm flex gap-2">{formatCostsJsx(item.cost, gameState)}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <FactionStore />
        </div>
    );
};

export default ShopView;
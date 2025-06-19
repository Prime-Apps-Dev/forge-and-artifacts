import React from 'react';
import { definitions } from '../../data/definitions';
import { formatNumber, getReputationLevel, hasReputation, formatCosts } from '../../utils/helpers';
import TradeableResource from '../ui/TradeableResource';

const ShopView = ({ gameState, handlers }) => {
    const market = gameState.market;

    const currentEvent = gameState.market.worldEvent;
    const isConflict = currentEvent.type === 'faction_conflict';
    const conflictingFactions = isConflict ? currentEvent.conflictingFactions : [];

    const FactionStore = () => {
        return (
            <div className="mt-8">
                <h3 className="font-cinzel text-xl text-orange-400 mb-4">Предложения Фракций</h3>
                <div className="space-y-4">
                    {/* Гильдия Торговцев */}
                    {conflictingFactions.includes('merchants') ? (
                         <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 italic text-sm">Инвестиции временно недоступны из-за конфликта с Гильдией Торговцев.</div>
                    ) : (
                        hasReputation(gameState.reputation, 'merchants', 'exalted') && (
                        <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                            <h4 className="font-bold text-yellow-300 flex items-center gap-2"><span className="material-icons-outlined">monetization_on</span>Инвестиции Гильдии</h4>
                            <p className="text-sm text-yellow-400/80 my-2">Инвестируйте в торговые пути для пассивного дохода.</p>
                            <button onClick={handlers.handleInvest} disabled={gameState.investments.merchants} className="w-full text-left p-2 bg-black/30 rounded-sm hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed">
                                {gameState.investments.merchants ? "Инвестиция сделана" : `Инвестировать ${formatNumber(25000)} искр`}
                            </button>
                        </div>
                    ))}
                    {/* Лига Авантюристов */}
                    {conflictingFactions.includes('adventurers') ? (
                        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 italic text-sm">Товары Лиги Авантюристов временно недоступны из-за конфликта.</div>
                    ) : (
                        hasReputation(gameState.reputation, 'adventurers', 'respect') && (
                        <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                            <h4 className="font-bold text-green-300 flex items-center gap-2"><span className="material-icons-outlined">explore</span>Товары Авантюристов</h4>
                            {/* Карта вылазки */}
                            <button
                                onClick={() => handlers.handleBuySpecialItem('expeditionMap')}
                                disabled={Object.entries(definitions.specialItems.expeditionMap.cost).some(([res, val]) => (gameState[res] || gameState.specialItems[res] || 0) < val)}
                                className="w-full text-left p-2 mt-2 bg-black/30 rounded-sm hover:bg-black/50 flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>Купить: Карта вылазки</span>
                                <span className="text-sm" dangerouslySetInnerHTML={{ __html: formatCosts(definitions.specialItems.expeditionMap.cost, gameState) }}></span>
                            </button>
                        </div>
                    ))}
                    {/* Королевский Двор */}
                     {conflictingFactions.includes('court') ? (
                        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 italic text-sm">Доступ к Королевской Сокровищнице временно закрыт из-за конфликта.</div>
                    ) : (
                        hasReputation(gameState.reputation, 'court', 'honor') && (
                        <div className="p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
                            <h4 className="font-bold text-purple-300 flex items-center gap-2"><span className="material-icons-outlined">account_balance</span>Королевская Сокровищница</h4>
                                {Object.entries(definitions.specialItems).filter(([id, item]) =>
                                    item.requiredFaction === 'court' &&
                                    ( !item.requiredSkill || gameState.purchasedSkills[item.requiredSkill] ) // ИЗМЕНЕНИЕ: УДАЛЕНО: && (!item.firstPlaythroughLocked || !gameState.isFirstPlaythrough)
                                ).map(([id, item]) => (
                                    <button
                                        key={id}
                                        onClick={() => handlers.handleBuySpecialItem(id)}
                                        disabled={gameState.specialItems[id] > 0 || (item.requiredSkill && !gameState.purchasedSkills[item.requiredSkill]) || Object.entries(item.cost).some(([res, val]) => (gameState[res] || gameState.specialItems[res] || 0) < val)}
                                        className="w-full text-left p-2 mt-2 bg-black/30 rounded-sm hover:bg-black/50 flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                    <span>{gameState.specialItems[id] > 0 ? "Куплено:" : "Купить:"} {item.name}</span>
                                    <span className="text-sm" dangerouslySetInnerHTML={{ __html: formatCosts(item.cost, gameState) }}></span>
                                </button>
                                ))}
                                {/* ИЗМЕНЕНИЕ: УДАЛЕНО сообщение о заблокированных чертежах */}
                                {/* {Object.entries(definitions.specialItems).filter(([id, item]) =>
                                    item.requiredFaction === 'court' &&
                                    (item.firstPlaythroughLocked && gameState.isFirstPlaythrough)
                                ).length > 0 && (
                                    <p className="text-sm text-red-400 italic mt-2">
                                        Высокоуровневые чертежи будут доступны после первого Переселения.
                                    </p>
                                )} */}
                                {Object.entries(definitions.specialItems).filter(([id, item]) =>
                                    item.requiredFaction === 'court' &&
                                    item.requiredSkill && !gameState.purchasedSkills[item.requiredSkill]
                                ).length > 0 && (
                                    <p className="text-sm text-gray-500 italic mt-2">
                                        Изучите необходимые навыки, чтобы разблокировать все чертежи.
                                    </p>
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
                <TradeableResource resourceId="ironOre" name="Железная руда" icon="lens" iconClass="text-gray-400" gameState={gameState} onBuy={handlers.handleBuyResource} onSell={handlers.handleSellResource} />
                <TradeableResource resourceId="ironIngots" name="Железные слитки" icon="view_in_ar" iconClass="text-gray-300" gameState={gameState} onBuy={handlers.handleBuyResource} onSell={handlers.handleSellResource} />

                <hr className="border-gray-700 my-2" />

                {gameState.purchasedSkills.findCopper && (
                    <>
                        <TradeableResource resourceId="copperOre" name="Медная руда" icon="filter_alt" iconClass="text-orange-400" gameState={gameState} onBuy={handlers.handleBuyResource} onSell={handlers.handleSellResource} />
                        <TradeableResource resourceId="copperIngots" name="Медные слитки" icon="view_in_ar" iconClass="text-orange-400" gameState={gameState} onBuy={handlers.handleBuyResource} onSell={handlers.handleSellResource} />
                    </>
                )}
                {gameState.purchasedSkills.artOfAlloys && (
                    <TradeableResource resourceId="bronzeIngots" name="Бронзовые слитки" icon="shield" iconClass="text-orange-600" gameState={gameState} onBuy={handlers.handleBuyResource} onSell={handlers.handleSellResource} />
                )}
                 {/* ИЗМЕНЕНИЕ: УДАЛЕНО: Условный рендеринг TradeableResource для высокоуровневых металлов по isFirstPlaythrough */}
                 {/* {gameState.purchasedSkills.mithrilProspecting && !gameState.isFirstPlaythrough && ( */}
                 {gameState.purchasedSkills.mithrilProspecting && ( // ИЗМЕНЕНИЕ: Теперь всегда отображается, если навык изучен
                    <TradeableResource resourceId="mithrilIngots" name="Мифриловые слитки" icon="shield_moon" iconClass="text-cyan-300" gameState={gameState} onBuy={handlers.handleBuyResource} onSell={handlers.handleSellResource} />
                )}
                {/* ИЗМЕНЕНИЕ: УДАЛЕНО: Заглушка для первого прохождения */}
                {/* {gameState.purchasedSkills.mithrilProspecting && gameState.isFirstPlaythrough && (
                    <Tooltip text="Доступно после первого Переселения.">
                        <div className="bg-black/20 p-4 rounded-lg flex items-center gap-4 border border-gray-700 opacity-50 cursor-not-allowed">
                            <span className={`material-icons-outlined text-4xl text-cyan-300`}>shield_moon</span>
                            <div className="grow">
                                <h4 className="font-bold">Мифриловые слитки</h4>
                                <p className="text-sm text-gray-400">В наличии: {formatNumber(gameState.mithrilIngots)}</p>
                            </div>
                            <div className="text-sm text-red-400">После Переселения</div>
                        </div>
                    </Tooltip>
                )} */}
                 {/* {gameState.purchasedSkills.adamantiteMining && !gameState.isFirstPlaythrough && ( */}
                 {gameState.purchasedSkills.adamantiteMining && ( // ИЗМЕНЕНИЕ: Теперь всегда отображается, если навык изучен
                    <TradeableResource resourceId="adamantiteIngots" name="Адамантитовые слитки" icon="security" iconClass="text-indigo-300" gameState={gameState} onBuy={handlers.handleBuyResource} onSell={handlers.handleSellResource} />
                )}
                {/* ИЗМЕНЕНИЕ: УДАЛЕНО: Заглушка для первого прохождения */}
                {/* {gameState.purchasedSkills.adamantiteMining && gameState.isFirstPlaythrough && (
                     <Tooltip text="Доступно после первого Переселения.">
                        <div className="bg-black/20 p-4 rounded-lg flex items-center gap-4 border border-gray-700 opacity-50 cursor-not-allowed">
                            <span className={`material-icons-outlined text-4xl text-indigo-300`}>security</span>
                            <div className="grow">
                                <h4 className="font-bold">Адамантитовые слитки</h4>
                                <p className="text-sm text-gray-400">В наличии: {formatNumber(gameState.adamantiteIngots)}</p>
                            </div>
                            <div className="text-sm text-red-400">После Переселения</div>
                        </div>
                    </Tooltip>
                )} */}
                {/* {gameState.purchasedSkills.arcaneMetallurgy && !gameState.isFirstPlaythrough && ( */}
                {gameState.purchasedSkills.arcaneMetallurgy && ( // ИЗМЕНЕНИЕ: Теперь всегда отображается, если навык изучен
                    <TradeableResource resourceId="arcaniteIngots" name="Арканитовые слитки" icon="auto_fix_high" iconClass="text-fuchsia-500" gameState={gameState} onBuy={handlers.handleBuyResource} onSell={handlers.handleSellResource} />
                )}
                 {/* ИЗМЕНЕНИЕ: УДАЛЕНО: Заглушка для первого прохождения */}
                 {/* {gameState.purchasedSkills.arcaneMetallurgy && gameState.isFirstPlaythrough && (
                     <Tooltip text="Доступно после первого Переселения.">
                        <div className="bg-black/20 p-4 rounded-lg flex items-center gap-4 border border-gray-700 opacity-50 cursor-not-allowed">
                            <span className={`material-icons-outlined text-4xl text-fuchsia-500`}>auto_fix_high</span>
                            <div className="grow">
                                <h4 className="font-bold">Арканитовые слитки</h4>
                                <p className="text-sm text-gray-400">В наличии: {formatNumber(gameState.arcaniteIngots)}</p>
                            </div>
                            <div className="text-sm text-red-400">После Переселения</div>
                        </div>
                    </Tooltip>
                )} */}

            </div>
            <FactionStore />
        </div>
    );
};

export default ShopView;
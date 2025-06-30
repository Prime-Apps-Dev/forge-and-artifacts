// src/components/views/ForgeView.jsx
import React, { useState } from 'react';
import { definitions } from '../../data/definitions/index.js';
import OrderQueueCard from '../ui/cards/OrderQueueCard';
import FreeCraftRecipeCard from '../ui/cards/FreeCraftRecipeCard';
import InventoryItemCard from '../ui/cards/InventoryItemCard';
import { IMAGE_PATHS } from '../../constants/paths';
import { useGame } from '../../context/useGame.js';
import ActiveProjectDisplay from './forge/ActiveProjectDisplay.jsx'; // Новый импорт
import WorkstationSelector from './forge/WorkstationSelector.jsx'; // Новый импорт

const ForgeView = () => {
    const { displayedGameState: gameState, handlers, isWorking } = useGame();
    const [mode, setMode] = useState('orders');

    const activePlayerProject = gameState.activeOrder || gameState.activeFreeCraft;
    const isEpicCraft = !!gameState.currentEpicOrder;
    const isReforging = !!gameState.activeReforge;
    const isInlaying = !!gameState.activeInlay;
    const isGraving = !!gameState.activeGraving;
    const isAnyActiveProject = !!activePlayerProject || isEpicCraft || isReforging || isInlaying || isGraving;

    const canReforge = gameState.purchasedSkills.masterReforging;
    const canInlay = gameState.specialItems.gem > 0;
    const canGrave = gameState.purchasedSkills.masterGraving;

    return (
        <div>
            <div className="flex items-center justify-center gap-2 mb-4 p-1 rounded-lg border border-gray-700 bg-gray-800/50">
                <button onClick={() => setMode('orders')} className={`flex-1 p-2 rounded-md font-bold text-sm transition-colors interactive-element ${mode === 'orders' ? 'bg-orange-600 text-black shadow-md' : 'text-gray-300 hover:bg-gray-700/50'}`}>Заказы</button>
                <button onClick={() => setMode('free_craft')} className={`flex-1 p-2 rounded-md font-bold text-sm transition-colors interactive-element ${mode === 'free_craft' ? 'bg-orange-600 text-black shadow-md' : 'text-gray-300 hover:bg-gray-700/50'}`}>Свободная ковка</button>
                {!gameState.isFirstPlaythrough && canReforge && <button onClick={() => setMode('reforge')} className={`flex-1 p-2 rounded-md font-bold text-sm transition-colors interactive-element ${mode === 'reforge' ? 'bg-orange-600 text-black shadow-md' : 'text-gray-300 hover:bg-gray-700/50'}`}>Перековка</button>}
                {!gameState.isFirstPlaythrough && canInlay && <button onClick={() => setMode('inlay')} className={`flex-1 p-2 rounded-md font-bold text-sm transition-colors interactive-element ${mode === 'inlay' ? 'bg-orange-600 text-black shadow-md' : 'text-gray-300 hover:bg-gray-700/50'}`}>Инкрустация</button>}
                {!gameState.isFirstPlaythrough && canGrave && <button onClick={() => setMode('graving')} className={`flex-1 p-2 rounded-md font-bold text-sm transition-colors interactive-element ${mode === 'graving' ? 'bg-orange-600 text-black shadow-md' : 'text-gray-300 hover:bg-gray-700/50'}`}>Гравировка</button>}
            </div>

            <div id="forge-content-area" className="p-4 bg-black/20 rounded-lg border border-gray-700 mb-6 min-h-[250px]">
                {isAnyActiveProject ? (
                    <ActiveProjectDisplay />
                ) : (
                    mode === 'orders' ? (
                        <div>
                            <h3 className="font-cinzel text-lg text-center mb-3">Доступные заказы</h3>
                            {gameState.orderQueue.length > 0 ? (
                                <div className="space-y-3">
                                    {gameState.orderQueue.map(order => <OrderQueueCard key={order.id} order={order} isDisabled={isAnyActiveProject} />)}
                                </div>
                            ) : <p className="text-center text-gray-500 italic py-8">Новых заказов пока нет.</p>}
                        </div>
                    ) : mode === 'free_craft' ? (
                        <div>
                            <h3 className="font-cinzel text-lg text-center mb-3">Свободное ремесло</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {Object.entries(definitions.items).filter(([key, item]) => !item.isQuestRecipe && (!item.requiredSkill || gameState.purchasedSkills[item.requiredSkill]) && (!item.firstPlaythroughLocked || !gameState.isFirstPlaythrough)).map(([key, item]) => (
                                    <FreeCraftRecipeCard key={key} itemKey={key} itemDef={item} isDisabled={isAnyActiveProject} />
                                ))}
                            </div>
                        </div>
                    ) : mode === 'reforge' ? (
                        <div>
                            <h3 className="font-cinzel text-lg text-center mb-3">Выберите предмет для перековки</h3>
                            {canReforge && !gameState.isFirstPlaythrough ? (
                                gameState.inventory.filter(item => item.location === 'inventory' && definitions.items[item.itemKey].hasInlaySlots && item.quality < 10.0).length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {gameState.inventory.filter(item => item.location === 'inventory' && definitions.items[item.itemKey].hasInlaySlots && item.quality < 10.0).map(item => (
                                            <InventoryItemCard key={item.uniqueId} item={item} onAction={() => handlers.handleStartReforge(item.uniqueId)} actionLabel="Перековать" isAnyActiveProject={isAnyActiveProject} />
                                        ))}
                                    </div>
                                ) : <p className="text-center text-gray-500 italic py-8">У вас нет предметов, подходящих для перековки.</p>
                            ) : <p className="text-center text-gray-500 italic py-8">{gameState.isFirstPlaythrough ? "Доступно после Переселения." : "Изучите 'Мастер Перековки'."}</p>}
                        </div>
                    ) : null
                )}
            </div>

            <WorkstationSelector />
            
            <div id="forge-area" className="hidden md:flex items-center justify-center">
                <div onClick={(e) => handlers.handleStrikeAnvil(e)} className={`interactive-element cursor-pointer rounded-full p-4 transition-transform ${isWorking ? 'anvil-working' : ''}`}>
                    <img src={IMAGE_PATHS.UI.ANVIL} alt="Наковальня" className="w-48 h-48 drop-shadow-lg" />
                </div>
            </div>
            <div className="h-16 md:hidden"></div>
        </div>
    );
};

export default ForgeView;
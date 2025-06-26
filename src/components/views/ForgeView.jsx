// src/components/views/ForgeView.jsx
import React, { useState, memo, useMemo } from 'react';
import { definitions } from '../../data/definitions/index.js';
import { formatNumber } from '../../utils/formatters.jsx';
import Tooltip from '../ui/display/Tooltip';
import ComponentItem from '../ui/cards/ComponentItem';
import OrderTimer from '../ui/display/OrderTimer';
import OrderQueueCard from '../ui/cards/OrderQueueCard';
import FreeCraftRecipeCard from '../ui/cards/FreeCraftRecipeCard';
import InventoryItemCard from '../ui/cards/InventoryItemCard';
import { IMAGE_PATHS } from '../../constants/paths';
import { useGame } from '../../context/GameContext.jsx';
import QualityMinigameBar from '../minigames/QualityMinigameBar.jsx';
import ClickPointsMinigame from '../minigames/ClickPointsMinigame.jsx';
import HoldAndReleaseMinigame from '../minigames/HoldAndReleaseMinigame.jsx';

// Внутренний компонент для отображения активного проекта
const ActiveProjectDisplay = memo(() => {
    const { displayedGameState: gameState, handlers } = useGame();
    
    const activePlayerProject = gameState.activeOrder || gameState.activeFreeCraft;
    if (!activePlayerProject) return null;
    
    const playerItemDef = definitions.items[activePlayerProject.itemKey];
    const activePlayerComponent = playerItemDef ? playerItemDef.components.find(c => c.id === activePlayerProject.activeComponentId) : null;
    
    // Безопасное получение изображения клиента
    const clientFaceImg = gameState.activeOrder?.client?.faceImg || IMAGE_PATHS.CLIENTS.SHADOWY_FIGURE;

    return (
        <>
            {gameState.activeOrder && (
                <div className="flex items-start gap-4 mb-2">
                    <img src={clientFaceImg} alt="Лицо клиента" className="w-16 h-16 rounded-full border-2 border-gray-600" />
                    <div className="grow">
                        <h3 className="font-cinzel text-lg">{playerItemDef?.name || 'Загрузка...'}</h3>
                        <p className="text-sm text-gray-400">Клиент: <span className="font-semibold text-white">{gameState.activeOrder?.client?.name || 'Неизвестный'}</span></p>
                        <div className="text-xs text-gray-500 flex items-center gap-4 mt-1">
                            <span>Награда:</span>
                            <div className="flex items-center gap-1"><span className="material-icons-outlined text-yellow-400 text-sm">bolt</span><span className="font-bold text-gray-300">{formatNumber(gameState.activeOrder.rewards.sparks)}</span></div>
                            <div className="flex items-center gap-1"><span className="material-icons-outlined text-purple-400 text-sm">bubble_chart</span><span className="font-bold text-gray-300">{formatNumber(gameState.activeOrder.rewards.matter)}</span></div>
                        </div>
                    </div>
                </div>
            )}
            {gameState.activeFreeCraft && (
                <h3 className="font-cinzel text-lg text-center">Свободное создание: {playerItemDef?.name}</h3>
            )}
            {gameState.activeOrder && <OrderTimer order={gameState.activeOrder} />}
            
            {activePlayerProject?.minigameState?.active && activePlayerComponent?.minigame && (
                <div className="minigame-container">
                    {activePlayerProject.minigameState.type === 'bar_precision' && 
                        <QualityMinigameBar 
                            minigameState={activePlayerProject.minigameState} 
                            componentDef={activePlayerComponent}
                        />}
                    {activePlayerProject.minigameState.type === 'click_points' && 
                        <ClickPointsMinigame
                            minigameState={activePlayerProject.minigameState}
                            componentDef={activePlayerComponent}
                            onClickPoint={handlers.handleMinigameClickPoint}
                            updateMinigameState={handlers.handleUpdateMinigameState}
                        />}
                     {activePlayerProject.minigameState.type === 'hold_and_release' && 
                        <HoldAndReleaseMinigame
                            minigameState={activePlayerProject.minigameState}
                            componentDef={activePlayerComponent}
                            onRelease={handlers.handleMinigameRelease}
                            updateMinigameState={handlers.handleUpdateMinigameState}
                        />}
                </div>
            )}

            <div className="flex flex-col gap-2 mt-2">
                 {playerItemDef?.components.map(comp => <ComponentItem key={comp.id} component={comp} orderState={activePlayerProject} />)}
            </div>
        </>
    );
});

// Внутренний компонент для выбора верстака
const WorkstationSelector = memo(() => {
    const { displayedGameState: gameState, handlers } = useGame();
    const { purchasedSkills, activeWorkstationId, workstations, activeOrder, activeFreeCraft, currentEpicOrder, activeReforge, activeInlay, activeGraving } = gameState;
    
    const activePlayerProject = activeOrder || activeFreeCraft;
    const isEpicCraft = !!currentEpicOrder;

    const requiredWorkstation = useMemo(() => {
        if (activeReforge) return 'anvil';
        if (activeInlay) return 'grindstone';
        if (activeGraving) return 'workbench';
        if (activePlayerProject) {
            const itemDef = definitions.items[activePlayerProject.itemKey];
            const activeComponent = itemDef?.components.find(c => c.id === activePlayerProject.activeComponentId);
            if (activeComponent) return activeComponent.workstation;
        }
        if (isEpicCraft) {
            const artifactDef = definitions.greatArtifacts[currentEpicOrder.artifactId];
            const epicStageDef = artifactDef?.epicOrder.find(s => s.stage === currentEpicOrder.currentStage);
            if (epicStageDef) return epicStageDef.workstation;
        }
        return null;
    }, [activePlayerProject, isEpicCraft, activeReforge, activeInlay, activeGraving, currentEpicOrder]);

    if (!purchasedSkills.divisionOfLabor) return null;

    return (
        <div className="flex justify-center gap-4 my-4 p-2 bg-black/20 rounded-lg">
            {Object.entries(definitions.workstations).map(([id, station]) => {
                const currentWorkstationState = workstations[id];
                const xpProgress = (currentWorkstationState.xpToNextLevel > 0) ? (currentWorkstationState.xp / currentWorkstationState.xpToNextLevel) * 100 : 100;
                const isMaxLevel = currentWorkstationState.level >= station.maxLevel;

                let tooltipContent = `${station.name}\nУровень: ${currentWorkstationState.level} / ${station.maxLevel}`;
                if (!isMaxLevel) {
                    tooltipContent += `\nXP: ${formatNumber(currentWorkstationState.xp, true)} / ${formatNumber(currentWorkstationState.xpToNextLevel, true)}`;
                }
                if (activeWorkstationId === id) {
                    tooltipContent += "\n(Активный)";
                }
                if (station.bonusesPerLevel) {
                    tooltipContent += "\nБонусы за уровень:";
                    for (const bonusType in station.bonusesPerLevel) {
                        const bonusValue = station.bonusesPerLevel[bonusType];
                        const totalBonus = bonusValue * (currentWorkstationState.level - 1);
                        tooltipContent += `\n- ${bonusType}: +${(totalBonus * (bonusType.endsWith('Modifier') || bonusType === 'critChance' || bonusType === 'smeltingSpeedModifier' ? 100 : 1)).toFixed(bonusType === 'critChance' ? 1 : (bonusType.endsWith('Modifier') ? 0 : 0))}${bonusType.endsWith('Modifier') || bonusType === 'critChance' || bonusType === 'smeltingSpeedModifier' ? '%' : ''}`;
                    }
                }

                return (
                    <Tooltip key={id} text={tooltipContent}>
                        <button
                            onClick={() => handlers.handleSelectWorkstation(id)}
                            className={`interactive-element p-3 rounded-lg border-2 transition-all duration-200 relative overflow-hidden
                                ${activeWorkstationId === id ? 'bg-orange-500/20 border-orange-500' : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'}
                                ${requiredWorkstation === id && activeWorkstationId !== id ? 'animate-pulse border-blue-500' : ''} `}
                            disabled={requiredWorkstation && requiredWorkstation !== id}
                        >
                            <span className={`material-icons-outlined text-4xl ${activeWorkstationId === id ? 'text-orange-400' : 'text-gray-400'}`}>{station.icon}</span>
                            <div className="absolute bottom-0 left-0 w-full bg-black/50 text-center text-xs font-bold">
                                Ур. {currentWorkstationState.level}
                            </div>
                            {!isMaxLevel && (
                                <div className="absolute bottom-0 left-0 h-1 bg-yellow-500" style={{ width: `${xpProgress}%` }}></div>
                            )}
                        </button>
                    </Tooltip>
                );
            })}
        </div>
    );
});

// Основной компонент
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
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {gameState.inventory.filter(item => item.location === 'inventory' && definitions.items[item.itemKey].hasInlaySlots && item.quality < 10.0).map(item => (
                                            <InventoryItemCard key={item.uniqueId} item={item} onAction={() => handlers.handleStartReforge(item.uniqueId)} actionLabel="Перековать" isAnyActiveProject={isAnyActiveProject} />
                                        ))}
                                    </div>
                                ) : <p className="text-center text-gray-500 italic py-8">У вас нет предметов, подходящих для перековки.</p>
                            ) : <p className="text-center text-gray-500 italic py-8">{gameState.isFirstPlaythrough ? "Доступно после первого Переселения." : "Изучите навык 'Мастер Перековки'."}</p>}
                        </div>
                    ) : mode === 'inlay' ? (
                        <div>
                            <h3 className="font-cinzel text-lg text-center mb-3">Выберите предмет для инкрустации</h3>
                            {canInlay && !gameState.isFirstPlaythrough ? (
                                gameState.inventory.filter(item => { const def = definitions.items[item.itemKey]; return def.hasInlaySlots && item.location === 'inventory' && ((item.inlaySlots || []).length < (item.quality >= 10 ? 3 : item.quality >= 8 ? 2 : item.quality >= 6 ? 1 : 0)); }).length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {gameState.inventory.filter(item => { const def = definitions.items[item.itemKey]; return def.hasInlaySlots && item.location === 'inventory' && ((item.inlaySlots || []).length < (item.quality >= 10 ? 3 : item.quality >= 8 ? 2 : item.quality >= 6 ? 1 : 0)); }).map(item => (
                                            <InventoryItemCard key={item.uniqueId} item={item} onAction={() => handlers.handleStartInlay(item.uniqueId, 'gem')} actionLabel="Инкрустировать" isAnyActiveProject={isAnyActiveProject} />
                                        ))}
                                    </div>
                                ) : <p className="text-center text-gray-500 italic py-8">У вас нет предметов для инкрустации.</p>
                            ) : <p className="text-center text-gray-500 italic py-8">{gameState.isFirstPlaythrough ? "Доступно после первого Переселения." : "Найдите самоцветы для инкрустации."}</p>}
                        </div>
                    ) : mode === 'graving' ? (
                        <div>
                            <h3 className="font-cinzel text-lg text-center mb-3">Выберите предмет для гравировки</h3>
                            {canGrave && !gameState.isFirstPlaythrough ? (
                                gameState.inventory.filter(item => item.location === 'inventory' && (definitions.items[item.itemKey].hasInlaySlots || definitions.items[item.itemKey].gravingAvailable)).length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {gameState.inventory.filter(item => item.location === 'inventory' && (definitions.items[item.itemKey].hasInlaySlots || definitions.items[item.itemKey].gravingAvailable)).map(item => (
                                            <InventoryItemCard key={item.uniqueId} item={item} onAction={() => handlers.handleStartGraving(item.uniqueId)} actionLabel="Гравировать" isAnyActiveProject={isAnyActiveProject} />
                                        ))}
                                    </div>
                                ) : <p className="text-center text-gray-500 italic py-8">У вас нет предметов для гравировки.</p>
                            ) : <p className="text-center text-gray-500 italic py-8">{gameState.isFirstPlaythrough ? "Доступно после первого Переселения." : "Изучите навык 'Искусство Гравировки'."}</p>}
                        </div>
                    ) : null
                )}
            </div>

            <WorkstationSelector />

            <div id="forge-area" className="flex items-center justify-center">
                <div onClick={handlers.handleStrikeAnvil} className={`interactive-element cursor-pointer rounded-full p-4 transition-transform ${isWorking ? 'anvil-working' : ''}`}>
                    <img src={IMAGE_PATHS.UI.ANVIL} alt="Наковальня" className="w-48 h-48 drop-shadow-lg" />
                </div>
            </div>
        </div>
    );
};

export default ForgeView;
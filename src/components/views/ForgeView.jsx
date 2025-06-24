// src/components/views/ForgeView.jsx
import React, { useState, memo, useRef, useEffect, useCallback } from 'react';
import { definitions } from '../../data/definitions';
import { formatNumber } from '../../utils/formatters';
import Tooltip from '../ui/display/Tooltip';
import ComponentItem from '../ui/cards/ComponentItem';
import OrderTimer from '../ui/display/OrderTimer';
import OrderQueueCard from '../ui/cards/OrderQueueCard';
import FreeCraftRecipeCard from '../ui/cards/FreeCraftRecipeCard';
import InventoryItemCard from '../ui/cards/InventoryItemCard';
import { IMAGE_PATHS } from '../../constants/paths';
import { gameConfig as GAME_CONFIG } from '../../constants/gameConfig';

// Компонент мини-игры "Точность удара" (существующий)
const QualityMinigameBar = ({ minigameState, componentDef }) => {
    if (!minigameState?.active || !componentDef?.minigame || minigameState.type !== 'bar_precision') return null;

    const barStyle = {
        background: 'linear-gradient(to right, #ff8c00, #ff4500, #ff8c00)',
        boxShadow: '0 0 8px rgba(255, 140, 0, 0.7)',
        position: 'relative',
        overflow: 'hidden',
    };

    const markerStyle = {
        left: `${minigameState.position}%`,
        transform: 'translateX(-50%)',
        transition: 'left 0.1s linear',
    };

    return (
        <div className="my-4 p-2 rounded-lg relative h-10 border-2 border-yellow-500" style={barStyle}>
            {componentDef.minigame.zones.map((zone, index) => (
                <div
                    key={index}
                    className={`absolute top-0 h-full ${zone.quality === 'perfect' ? 'bg-yellow-500/70' : 'bg-green-500/70'}`}
                    style={{ left: `${zone.from}%`, width: `${zone.to - zone.from}%` }}
                ></div>
            ))}
            <div
                className="absolute top-0 w-2 h-full bg-white rounded-full shadow-lg z-10"
                style={markerStyle}
            ></div>
        </div>
    );
};

// Новый компонент мини-игры "Зажать и отпустить"
const HoldAndReleaseMinigame = ({ minigameState, componentDef, onRelease, updateMinigameState }) => { // Добавлен updateMinigameState
    if (!minigameState?.active || !componentDef?.minigame || minigameState.type !== 'hold_and_release') return null;

    const { fillPercentage, targetZone, perfectZone, isHolding } = minigameState;
    const { releaseSpeed } = componentDef.minigame;

    // Таймер для мини-игры "Зажать и отпустить"
    useEffect(() => {
        const interval = setInterval(() => {
            updateMinigameState(prev => {
                const newState = { ...prev };
                if (newState?.minigameState?.active && newState.minigameState.type === 'hold_and_release') {
                    const currentMinigameState = newState.minigameState;
                    if (currentMinigameState.isHolding) {
                        currentMinigameState.fillPercentage = Math.min(100, currentMinigameState.fillPercentage + releaseSpeed * (GAME_CONFIG.MINIGAME_MAX_DURATION / 100));
                    } else {
                        // Если не удерживается, процент должен уменьшаться
                        currentMinigameState.fillPercentage = Math.max(0, currentMinigameState.fillPercentage - releaseSpeed * (GAME_CONFIG.MINIGAME_MAX_DURATION / 100));
                    }
                    if (currentMinigameState.fillPercentage >= 100 || Date.now() - currentMinigameState.startTime > GAME_CONFIG.MINIGAME_MAX_DURATION * 1000) {
                         // Если достигнут 100% или время вышло, завершаем мини-игру
                        if (currentMinigameState.active) {
                            onRelease(); // Вызываем handleStrikeAnvil для обработки завершения
                        }
                    }
                }
                return newState;
            });
        }, 50); // Обновляем каждые 50мс

        return () => clearInterval(interval);
    }, [minigameState.active, minigameState.isHolding, releaseSpeed, updateMinigameState, onRelease]);


    const animationDuration = 100 / releaseSpeed; // Время для заполнения на 100%

    // Стили для заполняющегося круга
    const circleFillStyle = {
        transform: `scaleX(${fillPercentage / 100})`,
        transformOrigin: 'left',
        transition: 'transform linear',
        transitionDuration: `${animationDuration}s`,
    };

    return (
        <div className="my-4 p-4 rounded-lg border-2 border-yellow-500 bg-black/40 text-center">
            <p className="text-lg font-cinzel text-yellow-300 mb-2">Зажмите и отпустите!</p>
            <div
                className="relative w-full h-8 bg-gray-800 rounded-full overflow-hidden cursor-pointer"
                onMouseDown={() => updateMinigameState(prev => ({ ...prev, minigameState: { ...prev.minigameState, isHolding: true } }))}
                onMouseUp={() => onRelease()}
                onMouseLeave={() => { if (isHolding) onRelease(); }}
                onTouchStart={() => updateMinigameState(prev => ({ ...prev, minigameState: { ...prev.minigameState, isHolding: true } }))}
                onTouchEnd={() => onRelease()}
                style={{touchAction: 'none'}}
            >
                {/* Целевая зона */}
                <div
                    className="absolute top-0 h-full bg-green-500/60 z-10"
                    style={{ left: `${targetZone.from}%`, width: `${targetZone.to - targetZone.from}%` }}
                ></div>
                {/* Идеальная зона */}
                <div
                    className="absolute top-0 h-full bg-yellow-500/80 z-20"
                    style={{ left: `${perfectZone.from}%`, width: `${perfectZone.to - perfectZone.from}%` }}
                ></div>
                {/* Индикатор заполнения */}
                <div
                    className={`absolute top-0 left-0 h-full bg-orange-500 z-30 transition-transform`}
                    style={circleFillStyle}
                ></div>
                {/* Текст внутри, отображающий процент заполнения */}
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white z-40">
                    {fillPercentage.toFixed(0)}%
                </span>
            </div>
            <p className="text-sm text-gray-400 mt-2">Нажмите и удерживайте, затем отпустите в нужный момент.</p>
        </div>
    );
};

// Новый компонент мини-игры "Клик по точкам"
const ClickPointsMinigame = ({ minigameState, componentDef, onClickPoint, updateMinigameState }) => { // Добавлен updateMinigameState
    if (!minigameState?.active || !componentDef?.minigame || minigameState.type !== 'click_points') return null;

    const { points } = minigameState;
    const { pointLifetimeFactor } = componentDef.minigame;
    const baseLifetime = GAME_CONFIG.MINIGAME_CLICK_POINT_LIFETIME_MS * pointLifetimeFactor;

    const clickPointsGenerationTimeoutRef = useRef(null); // Для генерации точек
    const clickPointsIntervalRef = useRef(null); // Для обновления прозрачности

    // Генерация точек
    useEffect(() => {
        const generatePoint = () => {
            updateMinigameState(prev => {
                const newState = { ...prev };
                if (newState?.minigameState?.active && newState.minigameState.type === 'click_points') {
                    const currentMinigameState = newState.minigameState;
                    if ((currentMinigameState.points?.length || 0) < currentMinigameState.totalPoints) { // Генерируем точки только до общего количества
                        const id = Date.now() + Math.random();
                        const x = Math.random() * 80 + 10; // От 10% до 90%
                        const y = Math.random() * 80 + 10; // От 10% до 90%
                        currentMinigameState.points.push({ id, x, y, opacity: 1.0, spawnTime: Date.now() });
                    }
                }
                return newState;
            });
        };
        
        clickPointsGenerationTimeoutRef.current = setInterval(generatePoint, 500); // Генерируем новую точку каждые 0.5 секунды

        return () => clearInterval(clickPointsGenerationTimeoutRef.current);
    }, [updateMinigameState, minigameState.totalPoints]);


    // Обновление прозрачности и удаление точек
    useEffect(() => {
        const interval = setInterval(() => {
            updateMinigameState(prev => {
                const newState = { ...prev };
                if (newState?.minigameState?.active && newState.minigameState.type === 'click_points') {
                    const now = Date.now();
                    const currentMinigameState = newState.minigameState;
                    currentMinigameState.points = currentMinigameState.points.filter(point => {
                        const elapsed = now - point.spawnTime;
                        if (elapsed > baseLifetime) {
                            return false; // Удаляем точку, если время жизни истекло
                        }
                        point.opacity = 1 - (elapsed / baseLifetime);
                        return true;
                    });

                    // Если все точки сгенерированы и исчезли, и игрок не набрал все hitPoints, мини-игра считается проваленной
                    if (currentMinigameState.points.length === 0 && (currentMinigameState.totalPoints === (currentMinigameState.hitPoints || 0) || (now - currentMinigameState.startTime) > GAME_CONFIG.MINIGAME_MAX_DURATION * 1000)) {
                         if (currentMinigameState.active) {
                            onClickPoint(null); // Вызываем onClickPoint с null, чтобы завершить мини-игру
                        }
                    }
                }
                return newState;
            });
        }, 50); // Обновляем каждые 50мс

        return () => clearInterval(interval);
    }, [minigameState.active, baseLifetime, onClickPoint, updateMinigameState]);


    return (
        <div className="my-4 p-4 rounded-lg border-2 border-yellow-500 bg-black/40 text-center">
            <p className="text-lg font-cinzel text-yellow-300 mb-2">Кликайте по точкам!</p>
            <div className="relative w-full h-48 border border-gray-700 bg-gray-900 overflow-hidden">
                {points.map(point => (
                    <div
                        key={point.id}
                        className="absolute w-6 h-6 rounded-full bg-orange-500 cursor-pointer transition-opacity duration-300"
                        style={{
                            left: `${point.x}%`,
                            top: `${point.y}%`,
                            opacity: point.opacity,
                            transform: 'translate(-50%, -50%)',
                        }}
                        onClick={() => onClickPoint(point.id)}
                    ></div>
                ))}
            </div>
            <p className="text-sm text-gray-400 mt-2">Попаданий: {minigameState.hitPoints || 0} / {minigameState.totalPoints}</p>
        </div>
    );
};


const ActiveProjectDisplay = ({ gameState, handlers, activePlayerProject, activePlayerComponent }) => {
    const isEpicCraft = !!gameState.currentEpicOrder;
    const isReforging = !!gameState.activeReforge;
    const isInlaying = !!gameState.activeInlay;
    const isGraving = !!gameState.activeGraving;

    const playerItemDef = activePlayerProject ? definitions.items[activePlayerProject.itemKey] : null;

    return (
         <>
            {gameState.activeOrder && (
                 <div className="flex items-start gap-4 mb-2">
                    <img src={gameState.activeOrder.client.faceImg} alt="Лицо клиента" className="w-16 h-16 rounded-full border-2 border-gray-600" />
                    <div className="grow">
                        <h3 className="font-cinzel text-lg">{playerItemDef?.name || 'Загрузка...'}</h3>
                        <p className="text-sm text-gray-400">Клиент: <span className="font-semibold text-white">{gameState.activeOrder.client.name}</span></p>
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
            {gameState.activeOrder && <OrderTimer key={gameState.activeOrder.id} order={gameState.activeOrder} />}
            
            {/* Рендеринг мини-игры */}
            {activePlayerProject?.minigameState?.active && activePlayerComponent?.minigame && (
                <div className="minigame-container">
                    {(() => {
                        switch (activePlayerComponent.minigame.type) {
                            case 'bar_precision':
                                return <QualityMinigameBar minigameState={activePlayerProject.minigameState} componentDef={activePlayerComponent} />;
                            case 'hold_and_release':
                                return <HoldAndReleaseMinigame minigameState={activePlayerProject.minigameState} componentDef={activePlayerComponent} onRelease={handlers.handleStrikeAnvil} updateMinigameState={handlers.updateMinigameState} />;
                            case 'click_points':
                                return <ClickPointsMinigame minigameState={activePlayerProject.minigameState} componentDef={activePlayerComponent} onClickPoint={handlers.handleClickPointMinigame} updateMinigameState={handlers.updateMinigameState} />;
                            default:
                                return null;
                        }
                    })()}
                </div>
            )}

            <div className="flex flex-col gap-2 mt-2">
                 {playerItemDef?.components.map(comp => <ComponentItem key={comp.id} component={comp} orderState={activePlayerProject} gameState={gameState} onSelectComponent={handlers.handleSelectComponent} />)}
            </div>
        </>
    )
};


const WorkstationSelector = memo(({ activeWorkstationId, handlers, purchasedSkills, activePlayerProject, isEpicCraft, isReforging, isInlaying, isGraving, gameState }) => {
    if (!purchasedSkills.divisionOfLabor) return null;

    let requiredWorkstation = null;
    if (isReforging) {
        requiredWorkstation = 'anvil';
    } else if (isInlaying) {
        requiredWorkstation = 'grindstone';
    } else if (isGraving) {
        requiredWorkstation = 'workbench';
    }
    else if (activePlayerProject) {
        const itemDef = definitions.items[activePlayerProject.itemKey];
        const activeComponent = itemDef.components.find(c => c.id === activePlayerProject.activeComponentId);
        if (activeComponent) requiredWorkstation = activeComponent.workstation;
    } else if (isEpicCraft) {
        const artifactDef = definitions.greatArtifacts[isEpicCraft.artifactId];
        const epicStageDef = artifactDef.epicOrder.find(s => s.stage === isEpicCraft.currentStage);
        if (epicStageDef) requiredWorkstation = epicStageDef.workstation;
    }


    return (
        <div className="flex justify-center gap-4 my-4 p-2 bg-black/20 rounded-lg">
            {Object.entries(definitions.workstations).map(([id, station]) => {
                const currentWorkstationState = gameState.workstations[id];
                const xpProgress = (currentWorkstationState.xp / currentWorkstationState.xpToNextLevel) * 100;
                const isMaxLevel = currentWorkstationState.level >= station.maxLevel;

                let tooltipContent = `${station.name}\nУровень: ${currentWorkstationState.level} / ${station.maxLevel}`;
                if (!isMaxLevel) {
                    tooltipContent += `\nXP: ${formatNumber(currentWorkstationState.xp)} / ${formatNumber(currentWorkstationState.xpToNextLevel)}`;
                }
                if (activeWorkstationId === id) {
                    tooltipContent += "\n(Активный)";
                }
                if (station.bonusesPerLevel) {
                    tooltipContent += "\nБонусы за уровень:";
                    for (const bonusType in station.bonusesPerLevel) {
                        const bonusValue = station.bonusesPerLevel[bonusType];
                        const totalBonus = bonusValue * (currentWorkstationState.level -1);
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


const ForgeView = ({ gameState, isWorking, handlers }) => {
    const [mode, setMode] = useState('orders');

    const activePlayerProject = gameState.activeOrder || gameState.activeFreeCraft;
    const isEpicCraft = !!gameState.currentEpicOrder;
    const isReforging = !!gameState.activeReforge;
    const isInlaying = !!gameState.activeInlay;
    const isGraving = !!gameState.activeGraving;

    const playerItemDef = activePlayerProject ? definitions.items[activePlayerProject.itemKey] : null;
    const activePlayerComponent = activePlayerProject && playerItemDef ? playerItemDef.components.find(c => c.id === activePlayerProject.activeComponentId) : null;

    const canReforge = gameState.purchasedSkills.masterReforging;
    const canInlay = gameState.specialItems.gem > 0;
    const canGrave = gameState.purchasedSkills.masterGraving;

    // Логика блокировки наковальни перед мини-игрой (перемещено в ForgeView)
    const [anvilBlocked, setAnvilBlocked] = useState(false);

    // Вспомогательная функция для обновления minigameState в activePlayerProject
    // Это нужно, чтобы дочерние компоненты мини-игр могли обновлять состояние родителя
    const updateActivePlayerProjectMinigameState = useCallback((updater) => {
        if (gameState.activeOrder) {
            handlers.updateState(prevState => {
                const newMinigameState = updater(prevState.activeOrder);
                return {
                    ...prevState,
                    activeOrder: { ...prevState.activeOrder, minigameState: newMinigameState.minigameState || null }
                };
            });
        } else if (gameState.activeFreeCraft) {
            handlers.updateState(prevState => {
                const newMinigameState = updater(prevState.activeFreeCraft);
                return {
                    ...prevState,
                    activeFreeCraft: { ...prevState.activeFreeCraft, minigameState: newMinigameState.minigameState || null }
                };
            });
        }
    }, [gameState.activeOrder, gameState.activeFreeCraft, handlers]);


    useEffect(() => {
        if (activePlayerProject?.minigameState?.active && !activePlayerProject.minigameState.initialBlockSet) {
            setAnvilBlocked(true);
            // Устанавливаем флаг через updateActivePlayerProjectMinigameState
            updateActivePlayerProjectMinigameState(prev => {
                return {
                    ...prev,
                    minigameState: { ...prev.minigameState, initialBlockSet: true }
                };
            });
            const timer = setTimeout(() => {
                setAnvilBlocked(false);
            }, 1000); // Блокируем на 1 секунду
            return () => clearTimeout(timer);
        } else if (!activePlayerProject?.minigameState?.active) {
            setAnvilBlocked(false); // Разблокируем, если мини-игры нет
        }
    }, [activePlayerProject?.minigameState?.active, activePlayerProject?.minigameState?.initialBlockSet, updateActivePlayerProjectMinigameState]);


    return (
        <div>
            <div className="flex items-center justify-center gap-2 mb-4 p-1 rounded-lg border border-gray-700 bg-gray-800/50">
                <button
                    onClick={() => setMode('orders')}
                    className={`flex-1 p-2 rounded-md font-bold text-sm transition-colors interactive-element
                                ${mode === 'orders' ? 'bg-orange-600 text-black shadow-md' : 'text-gray-300 hover:bg-gray-700/50'}`}
                >
                    Заказы
                </button>
                <button
                    onClick={() => setMode('free_craft')}
                    className={`flex-1 p-2 rounded-md font-bold text-sm transition-colors interactive-element
                                ${mode === 'free_craft' ? 'bg-orange-600 text-black shadow-md' : 'text-gray-300 hover:bg-gray-700/50'}`}
                >
                    Свободная ковка
                </button>
                
                {
                !gameState.isFirstPlaythrough && canReforge && (
                    <button
                        onClick={() => setMode('reforge')}
                        className={`flex-1 p-2 rounded-md font-bold text-sm transition-colors interactive-element
                                    ${mode === 'reforge' ? 'bg-orange-600 text-black shadow-md' : 'text-gray-300 hover:bg-gray-700/50'}`}
                    >
                        Перековка
                    </button>
                )}
                {
                !gameState.isFirstPlaythrough && canInlay && (
                    <button
                        onClick={() => setMode('inlay')}
                        className={`flex-1 p-2 rounded-md font-bold text-sm transition-colors interactive-element
                                    ${mode === 'inlay' ? 'bg-orange-600 text-black shadow-md' : 'text-gray-300 hover:bg-gray-700/50'}`}
                    >
                        Инкрустация
                    </button>
                )}
                {
                !gameState.isFirstPlaythrough && canGrave && (
                    <button
                        onClick={() => setMode('graving')}
                        className={`flex-1 p-2 rounded-md font-bold text-sm transition-colors interactive-element
                                    ${mode === 'graving' ? 'bg-orange-600 text-black shadow-md' : 'text-gray-300 hover:bg-gray-700/50'}`}
                    >
                        Гравировка
                    </button>
                )}

                {gameState.isFirstPlaythrough && (
                    <>
                        {canReforge && (
                             <Tooltip text="Доступно после первого Переселения.">
                                <button disabled className="flex-1 p-2 rounded-md font-bold text-sm opacity-50 cursor-not-allowed bg-gray-700/50">
                                    Перековка
                                </button>
                            </Tooltip>
                        )}
                        {canInlay && (
                             <Tooltip text="Доступно после первого Переселения.">
                                <button disabled className="flex-1 p-2 rounded-md font-bold text-sm opacity-50 cursor-not-allowed bg-gray-700/50">
                                    Инкрустация
                                </button>
                            </Tooltip>
                        )}
                        {canGrave && (
                            <Tooltip text="Доступно после первого Переселения.">
                                <button disabled className="flex-1 p-2 rounded-md font-bold text-sm opacity-50 cursor-not-allowed bg-gray-700/50">
                                    Гравировка
                                </button>
                            </Tooltip>
                        )}
                    </>
                )}
            </div>

            <div id="forge-content-area" className="p-4 bg-black/20 rounded-lg border border-gray-700 mb-6 min-h-[250px]">
                {(activePlayerProject || isEpicCraft || isReforging || isInlaying || isGraving) ? (
                    <ActiveProjectDisplay gameState={gameState} handlers={handlers} activePlayerProject={activePlayerProject} activePlayerComponent={activePlayerComponent} />
                ) : (
                    mode === 'orders' ? (
                        <div>
                            <h3 className="font-cinzel text-lg text-center mb-3">Доступные заказы</h3>
                            {gameState.orderQueue.length > 0 ? (
                                <div className="space-y-3">
                                    {gameState.orderQueue.map(order => <OrderQueueCard key={order.id} order={order} onAccept={handlers.handleAcceptOrder} isDisabled={!!activePlayerProject || isEpicCraft || isReforging || isInlaying || isGraving} />)}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 italic py-8">Новых заказов пока нет. Они появятся со временем.</p>
                            )}
                        </div>
                    ) : mode === 'free_craft' ? (
                        <div>
                            <h3 className="font-cinzel text-lg text-center mb-3">Свободное ремесло</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {Object.entries(definitions.items).filter(([key, item]) =>
                                    !item.isQuestRecipe &&
                                    (!item.requiredSkill || gameState.purchasedSkills[item.requiredSkill]) &&
                                    (!item.firstPlaythroughLocked || !gameState.isFirstPlaythrough)
                                ).map(([key, item]) => (
                                    <FreeCraftRecipeCard key={key} itemKey={key} itemDef={item} onCraft={handlers.handleStartFreeCraft} isDisabled={!!activePlayerProject || isEpicCraft || isReforging || isInlaying || isGraving} gameState={gameState} />
                                ))}
                            </div>
                        </div>
                    ) : mode === 'reforge' ? (
                        <div>
                            <h3 className="font-cinzel text-lg text-center mb-3">Выберите предмет для перековки</h3>
                            {canReforge && !gameState.isFirstPlaythrough ? (
                                gameState.inventory.filter(item =>
                                    item.location === 'inventory' &&
                                    definitions.items[item.itemKey].hasInlaySlots &&
                                    item.quality < 10.0
                                ).length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {gameState.inventory.filter(item =>
                                            item.location === 'inventory' &&
                                            definitions.items[item.itemKey].hasInlaySlots &&
                                            item.quality < 10.0
                                        ).map(item => (
                                            <InventoryItemCard
                                                key={item.uniqueId}
                                                item={item}
                                                onAction={() => handlers.handleStartReforge(item.uniqueId)}
                                                actionLabel="Перековать"
                                                isAnyActiveProject={!!activePlayerProject || isEpicCraft || isReforging || isInlaying || isGraving}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 italic py-8">
                                        У вас нет предметов, подходящих для перековки. Создавайте предметы и улучшайте их!
                                    </p>
                                )
                            ) : (
                                <p className="text-center text-gray-500 italic py-8">
                                    {gameState.isFirstPlaythrough ? "Доступно после первого Переселения." : "Изучите навык 'Мастер Перековки', чтобы разблокировать эту функцию."}
                                </p>
                            )}
                        </div>
                    ) : mode === 'inlay' ? (
                        <div>
                            <h3 className="font-cinzel text-lg text-center mb-3">Выберите предмет для инкрустации</h3>
                            {canInlay && !gameState.isFirstPlaythrough ? (
                                gameState.inventory.filter(item => {
                                    const itemDef = definitions.items[item.itemKey];
                                    if (!itemDef.hasInlaySlots) return false;

                                    const maxSlots =
                                        item.quality >= 10 ? 3 :
                                        item.quality >= 8 ? 2 :
                                        item.quality >= 6 ? 1 : 0;
                                    const currentSlotsUsed = (item.inlaySlots || []).length;
                                    return item.location === 'inventory' && maxSlots > currentSlotsUsed;
                                }).length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {gameState.inventory.filter(item => {
                                            const itemDef = definitions.items[item.itemKey];
                                            if (!itemDef.hasInlaySlots) return false;

                                            const maxSlots =
                                                item.quality >= 10 ? 3 :
                                                item.quality >= 8 ? 2 :
                                                item.quality >= 6 ? 1 : 0;
                                            const currentSlotsUsed = (item.inlaySlots || []).length;
                                            return item.location === 'inventory' && maxSlots > currentSlotsUsed;
                                        }).map(item => (
                                            <InventoryItemCard
                                                key={item.uniqueId}
                                                item={item}
                                                onAction={() => handlers.handleStartInlay(item.uniqueId, 'gem')}
                                                actionLabel="Инкрустировать"
                                                isAnyActiveProject={!!activePlayerProject || isEpicCraft || isReforging || isInlaying || isGraving}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 italic py-8">
                                        У вас нет предметов, подходящих для инкрустации (высокое качество, свободные слоты).
                                    </p>
                                )
                            ) : (
                                <p className="text-center text-gray-500 italic py-8">
                                    {gameState.isFirstPlaythrough ? "Доступно после первого Переселения." : "Найдите хотя бы один самоцвет, чтобы разблокировать функцию инкрустации."}
                                </p>
                            )}
                        </div>
                    ) : mode === 'graving' ? (
                        <div>
                            <h3 className="font-cinzel text-lg text-center mb-3">Выберите предмет для гравировки</h3>
                            {canGrave && !gameState.isFirstPlaythrough ? (
                                gameState.inventory.filter(item =>
                                    item.location === 'inventory' &&
                                    (definitions.items[item.itemKey].hasInlaySlots || definitions.items[item.itemKey].gravingAvailable)
                                ).length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {gameState.inventory.filter(item =>
                                            item.location === 'inventory' &&
                                            (definitions.items[item.itemKey].hasInlaySlots || definitions.items[item.itemKey].gravingAvailable)
                                        ).map(item => (
                                            <InventoryItemCard
                                                key={item.uniqueId}
                                                item={item}
                                                onAction={() => handlers.handleStartGraving(item.uniqueId)}
                                                actionLabel="Гравировать"
                                                isAnyActiveProject={!!activePlayerProject || isEpicCraft || isReforging || isInlaying || isGraving}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 italic py-8">
                                        У вас нет предметов, подходящих для гравировки.
                                    </p>
                                )
                            ) : (
                                <p className="text-center text-gray-500 italic py-8">
                                    {gameState.isFirstPlaythrough ? "Доступно после первого Переселения." : "Изучите навык 'Искусство Гравировки', чтобы разблокировать эту функцию."}
                                </p>
                            )}
                        </div>
                    ) : null
                )}
            </div>

            <WorkstationSelector
                activeWorkstationId={gameState.activeWorkstationId}
                handlers={handlers}
                purchasedSkills={gameState.purchasedSkills}
                activePlayerProject={activePlayerProject}
                isEpicCraft={isEpicCraft}
                isReforging={isReforging}
                isInlaying={isInlaying}
                isGraving={isGraving}
                gameState={gameState}
            />

            <div id="forge-area" className="flex items-center justify-center">
                <div onClick={handlers.handleStrikeAnvil} className={`interactive-element cursor-pointer rounded-full p-4 transition-transform ${isWorking || anvilBlocked ? 'anvil-working' : ''}`} disabled={anvilBlocked}>
                    <img src={IMAGE_PATHS.UI.ANVIL} alt="Наковальня" className="w-48 h-48 drop-shadow-lg" />
                </div>
            </div>
        </div>
    );
};

export default ForgeView;
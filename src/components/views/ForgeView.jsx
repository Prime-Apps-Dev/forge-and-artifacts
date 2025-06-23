// src/components/views/ForgeView.jsx
import React, { useState, memo } from 'react';
import { definitions } from '../../data/definitions';
import { formatNumber } from '../../utils/formatters';
import Tooltip from '../ui/display/Tooltip'; // Обновленный путь
import ComponentItem from '../ui/cards/ComponentItem'; // Обновленный путь
import OrderTimer from '../ui/display/OrderTimer'; // Обновленный путь
import OrderQueueCard from '../ui/cards/OrderQueueCard'; // Обновленный путь
import FreeCraftRecipeCard from '../ui/cards/FreeCraftRecipeCard'; // Обновленный путь
import InventoryItemCard from '../ui/cards/InventoryItemCard'; // Обновленный путь
import { IMAGE_PATHS } from '../../constants/paths';

const QualityMinigameBar = ({ minigameState, componentDef }) => {
    if (!minigameState?.active || !componentDef?.minigame) return null;

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

const ActiveProjectDisplay = ({ gameState, handlers, projectType }) => {
    const activeProject = gameState.activeOrder || gameState.activeFreeCraft;
    const isEpicCraft = !!gameState.currentEpicOrder;
    const isReforging = !!gameState.activeReforge;
    const isInlaying = !!gameState.activeInlay;
    const isGraving = !!gameState.activeGraving;

    if (isEpicCraft) {
        const artifactDef = definitions.greatArtifacts[gameState.currentEpicOrder.artifactId];
        const epicStageDef = artifactDef.epicOrder.find(s => s.stage === gameState.currentEpicOrder.currentStage);

        const progressBarInnerStyle = {
            width: `${(gameState.currentEpicOrder.progress / epicStageDef.progress) * 100}%`,
            transition: 'width 0.2s linear',
        };

        return (
             <div className="text-center">
                 <h3 className="font-cinzel text-2xl text-yellow-400 text-shadow-glow">Эпический Крафт</h3>
                 <p className="text-gray-300 mb-2">Вы создаете: <span className="font-bold">{artifactDef.name}</span></p>
                 <div className="bg-black/30 p-4 rounded-lg">
                    <h4 className="font-bold text-lg">Этап {epicStageDef.stage}: {epicStageDef.name}</h4>
                     <p className="text-sm text-gray-400 mt-1">Требуемый станок: {definitions.workstations[epicStageDef.workstation].name}</p>
                     <div className="w-full bg-gray-900 rounded-full h-4 mt-3 border border-yellow-700">
                        <div className="bg-yellow-500 h-full rounded-full flex items-center justify-center text-xs font-bold text-black" style={progressBarInnerStyle}>
                             {formatNumber(gameState.currentEpicOrder.progress)} / {formatNumber(epicStageDef.progress)}
                        </div>
                    </div>
                 </div>
            </div>
        )
    }

    if (isReforging) {
        const itemToReforge = gameState.inventory.find(item => item.uniqueId === gameState.activeReforge.itemUniqueId);
        if (!itemToReforge) return null;

        const itemDef = definitions.items[itemToReforge.itemKey];
        const reforgeProgress = gameState.activeReforge.progress;
        const reforgeRequiredProgress = gameState.activeReforge.requiredProgress;

        const progressBarInnerStyle = {
            width: `${(reforgeProgress / reforgeRequiredProgress) * 100}%`,
            transition: 'width 0.2s linear',
        };

        return (
            <div className="text-center">
                <h3 className="font-cinzel text-2xl text-yellow-400 text-shadow-glow">Перековка</h3>
                <p className="text-gray-300 mb-2">Вы перековываете: <span className="font-bold">{itemDef.name}</span></p>
                <p className="text-sm text-gray-400">Текущее качество: {itemToReforge.quality.toFixed(2)}</p>
                <div className="bg-black/30 p-4 rounded-lg mt-4">
                    <h4 className="font-bold text-lg">Прогресс перековки</h4>
                    <div className="w-full bg-gray-900 rounded-full h-4 mt-3 border border-yellow-700">
                        <div className="bg-orange-500 h-full rounded-full flex items-center justify-center text-xs font-bold text-black" style={progressBarInnerStyle}>
                            {formatNumber(reforgeProgress)} / {formatNumber(reforgeRequiredProgress)}
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Требуемый станок: Наковальня</p>
                </div>
            </div>
        );
    }

    if (isInlaying) {
        const itemToInlay = gameState.inventory.find(item => item.uniqueId === gameState.activeInlay.itemUniqueId);
        if (!itemToInlay) return null;

        const itemDef = definitions.items[itemToInlay.itemKey];
        const inlayProgress = gameState.activeInlay.progress;
        const inlayRequiredProgress = gameState.activeInlay.requiredProgress;

        const progressBarInnerStyle = {
            width: `${(inlayProgress / inlayRequiredProgress) * 100}%`,
            transition: 'width 0.2s linear',
        };

        return (
            <div className="text-center">
                <h3 className="font-cinzel text-2xl text-yellow-400 text-shadow-glow">Инкрустация</h3>
                <p className="text-gray-300 mb-2">Вы инкрустируете: <span className="font-bold">{itemDef.name}</span></p>
                <p className="text-sm text-gray-400">Текущее качество: {itemToInlay.quality.toFixed(2)}</p>
                <p className="text-sm text-gray-400">Используемый самоцвет: {definitions.specialItems[gameState.activeInlay.gemType]?.name || "Самоцвет"}</p>
                <div className="bg-black/30 p-4 rounded-lg mt-4">
                    <h4 className="font-bold text-lg">Прогресс инкрустации</h4>
                    <div className="w-full bg-gray-900 rounded-full h-4 mt-3 border border-yellow-700">
                        <div className="bg-orange-500 h-full rounded-full flex items-center justify-center text-xs font-bold text-black" style={progressBarInnerStyle}>
                            {formatNumber(inlayProgress)} / {formatNumber(inlayRequiredProgress)}
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Требуемый станок: Точильный станок</p>
                </div>
            </div>
        );
    }

    if (isGraving) {
        const itemToGrave = gameState.inventory.find(item => item.uniqueId === gameState.activeGraving.itemUniqueId);
        if (!itemToGrave) return null;

        const itemDef = definitions.items[itemToGrave.itemKey];
        const gravingProgress = gameState.activeGraving.progress;
        const gravingRequiredProgress = gameState.activeGraving.requiredProgress;

        const progressBarInnerStyle = {
            width: `${(gravingProgress / gravingRequiredProgress) * 100}%`,
            transition: 'width 0.2s linear',
        };

        return (
            <div className="text-center">
                <h3 className="font-cinzel text-2xl text-yellow-400 text-shadow-glow">Гравировка</h3>
                <p className="text-gray-300 mb-2">Вы гравируете: <span className="font-bold">{itemDef.name}</span></p>
                <p className="text-sm text-gray-400">Текущий уровень гравировки: {itemToGrave.gravingLevel || 0}</p>
                <div className="bg-black/30 p-4 rounded-lg mt-4">
                    <h4 className="font-bold text-lg">Прогресс гравировки</h4>
                    <div className="w-full bg-gray-900 rounded-full h-4 mt-3 border border-yellow-700">
                        <div className="bg-orange-500 h-full rounded-full flex items-center justify-center text-xs font-bold text-black" style={progressBarInnerStyle}>
                            {formatNumber(gravingProgress)} / {formatNumber(gravingRequiredProgress)}
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Требуемый станок: Верстак</p>
                </div>
            </div>
        );
    }

    if (activeProject) {
        const itemDef = definitions.items[activeProject.itemKey];
        return (
             <>
                {gameState.activeOrder && (
                     <div className="flex items-start gap-4 mb-2">
                        <img src={gameState.activeOrder.client.faceImg} alt="Лицо клиента" className="w-16 h-16 rounded-full border-2 border-gray-600" />
                        <div className="grow">
                            <h3 className="font-cinzel text-lg">{itemDef?.name || 'Загрузка...'}</h3>
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
                    <h3 className="font-cinzel text-lg text-center">Свободное создание: {itemDef?.name}</h3>
                )}
                {gameState.activeOrder && <OrderTimer key={gameState.activeOrder.id} order={gameState.activeOrder} />}
                <div className="flex flex-col gap-2 mt-2">
                     {itemDef?.components.map(comp => <ComponentItem key={comp.id} component={comp} orderState={activeProject} gameState={gameState} onSelectComponent={handlers.handleSelectComponent} />)}
                </div>
            </>
        )
    }

    return null;
};


const WorkstationSelector = memo(({ activeWorkstationId, handlers, purchasedSkills, activeProject, isEpicCraft, isReforging, isInlaying, isGraving }) => {
    if (!purchasedSkills.divisionOfLabor) return null;

    let requiredWorkstation = null;
    if (isReforging) {
        requiredWorkstation = 'anvil';
    } else if (isInlaying) {
        requiredWorkstation = 'grindstone';
    } else if (isGraving) {
        requiredWorkstation = 'workbench';
    }
    else if (activeProject) {
        const itemDef = definitions.items[activeProject.itemKey];
        const activeComponent = itemDef.components.find(c => c.id === activeProject.activeComponentId);
        if (activeComponent) requiredWorkstation = activeComponent.workstation;
    } else if (isEpicCraft) {
        const artifactDef = definitions.greatArtifacts[isEpicCraft.artifactId];
        const epicStageDef = artifactDef.epicOrder.find(s => s.stage === isEpicCraft.currentStage);
        if (epicStageDef) requiredWorkstation = epicStageDef.workstation;
    }


    return (
        <div className="flex justify-center gap-4 my-4 p-2 bg-black/20 rounded-lg">
            {Object.entries(definitions.workstations).map(([id, station]) => (
                <Tooltip key={id} text={station.name}>
                    <button
                        onClick={() => handlers.handleSelectWorkstation(id)}
                        className={`interactive-element p-3 rounded-lg border-2 transition-all duration-200
                            ${activeWorkstationId === id ? 'bg-orange-500/20 border-orange-500' : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'}
                            ${requiredWorkstation === id && activeWorkstationId !== id ? 'animate-pulse border-blue-500' : ''} `}
                        disabled={requiredWorkstation && requiredWorkstation !== id}
                    >
                        <span className={`material-icons-outlined text-4xl ${activeWorkstationId === id ? 'text-orange-400' : 'text-gray-400'}`}>{station.icon}</span>
                    </button>
                </Tooltip>
            ))}
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
                    <ActiveProjectDisplay gameState={gameState} handlers={handlers} projectType="player" />
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
                                    <FreeCraftRecipeCard key={key} itemKey={key} itemDef={item} onCraft={handlers.handleStartFreeCraft} isDisabled={!!activePlayerProject || isEpicCraft || isReforging || isInlaying || isGraving} />
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
                activeProject={activePlayerProject}
                isEpicCraft={isEpicCraft}
                isReforging={isReforging}
                isInlaying={isInlaying}
                isGraving={isGraving}
            />
            {gameState.activeOrder && <QualityMinigameBar minigameState={gameState.activeOrder.minigameState} componentDef={activePlayerComponent} />}


            <div id="forge-area" className="flex items-center justify-center">
                <div onClick={handlers.handleStrikeAnvil} className={`interactive-element cursor-pointer rounded-full p-4 transition-transform ${isWorking ? 'anvil-working' : ''}`}>
                    <img src={IMAGE_PATHS.UI.ANVIL} alt="Наковальня" className="w-48 h-48 drop-shadow-lg" />
                </div>
            </div>
        </div>
    );
};

export default ForgeView;
// src/components/views/forge/ActiveProjectDisplay.jsx
import React, { memo } from 'react';
import { definitions } from '../../../data/definitions/index.js';
import { formatNumber } from '../../../utils/formatters.jsx';
import { useGame } from '../../../context/useGame.js';
import { IMAGE_PATHS } from '../../../constants/paths.js';
import ComponentItem from '../../ui/cards/ComponentItem';
import OrderTimer from '../../ui/display/OrderTimer';
import QualityMinigameBar from '../../minigames/QualityMinigameBar.jsx';
import ClickPointsMinigame from '../../minigames/ClickPointsMinigame.jsx';
import HoldAndReleaseMinigame from '../../minigames/HoldAndReleaseMinigame.jsx';

const ActiveProjectDisplay = memo(() => {
    const { displayedGameState: gameState, handlers } = useGame();
    
    const activePlayerProject = gameState.activeOrder || gameState.activeFreeCraft;
    if (!activePlayerProject) return null;
    
    const playerItemDef = definitions.items[activePlayerProject.itemKey];
    const activePlayerComponent = playerItemDef ? playerItemDef.components.find(c => c.id === activePlayerProject.activeComponentId) : null;
    
    const clientFaceImg = gameState.activeOrder?.client?.faceImg || IMAGE_PATHS.CLIENTS.SHADOWY_FIGURE;

    return (
        <>
            {gameState.activeOrder && gameState.activeOrder.rewards && (
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
                    {activePlayerProject.minigameState.type === 'bar_precision' && <QualityMinigameBar minigameState={activePlayerProject.minigameState} componentDef={activePlayerComponent} />}
                    {activePlayerProject.minigameState.type === 'click_points' && <ClickPointsMinigame minigameState={activePlayerProject.minigameState} componentDef={activePlayerComponent} onClickPoint={handlers.handleMinigameClickPoint} updateMinigameState={handlers.handleUpdateMinigameState} />}
                     {activePlayerProject.minigameState.type === 'hold_and_release' && <HoldAndReleaseMinigame minigameState={activePlayerProject.minigameState} componentDef={activePlayerComponent} onRelease={handlers.handleMinigameRelease} updateMinigameState={handlers.handleUpdateMinigameState} />}
                </div>
            )}
            <div className="flex flex-col gap-2 mt-2">
                 {playerItemDef?.components.map(comp => <ComponentItem key={comp.id} component={comp} orderState={activePlayerProject} />)}
            </div>
        </>
    );
});

export default ActiveProjectDisplay;
// src/components/minigames/ClickPointsMinigame.jsx
import React, { useEffect, useRef } from 'react';
import { gameConfig as GAME_CONFIG } from '../../constants/gameConfig';

const ClickPointsMinigame = ({ minigameState, componentDef, onClickPoint, updateMinigameState }) => {
    if (!minigameState?.active || !componentDef?.minigame || minigameState.type !== 'click_points') return null;

    const { points, totalPoints, hitPoints } = minigameState;
    const { pointLifetimeFactor } = componentDef.minigame;
    const baseLifetime = GAME_CONFIG.MINIGAME_CLICK_POINT_LIFETIME_MS * pointLifetimeFactor;

    // Генерация точек
    useEffect(() => {
        const generatePoint = () => {
            updateMinigameState(state => {
                if (state.points.length + (state.hitPoints || 0) < state.totalPoints) {
                    const id = Date.now() + Math.random();
                    const x = Math.random() * 80 + 10;
                    const y = Math.random() * 80 + 10;
                    state.points.push({ id, x, y, spawnTime: Date.now() });
                }
            });
        };
        
        const interval = setInterval(generatePoint, 700);
        return () => clearInterval(interval);
    }, [totalPoints, hitPoints, updateMinigameState]);

    // Обновление и удаление точек
    useEffect(() => {
        const interval = setInterval(() => {
            updateMinigameState(state => {
                const now = Date.now();
                state.points = state.points.filter(point => (now - point.spawnTime) <= baseLifetime);
                
                if (state.points.length === 0 && (state.hitPoints || 0) < state.totalPoints) {
                    if (Date.now() - state.startTime > (totalPoints * 1000)) {
                        onClickPoint(null);
                    }
                }
            });
        }, 50);

        return () => clearInterval(interval);
    }, [baseLifetime, onClickPoint, updateMinigameState, totalPoints]);


    return (
        <div className="my-4 p-4 rounded-lg border-2 border-yellow-500 bg-black/40 text-center">
            <p className="text-lg font-cinzel text-yellow-300 mb-2">Кликайте по точкам!</p>
            <div className="relative w-full h-48 border border-gray-700 bg-gray-900 overflow-hidden">
                {points.map(point => {
                    const elapsed = Date.now() - point.spawnTime;
                    const opacity = 1 - (elapsed / baseLifetime);
                    return (
                        <div
                            key={point.id}
                            className="absolute w-6 h-6 rounded-full bg-orange-500 cursor-pointer"
                            style={{
                                left: `${point.x}%`,
                                top: `${point.y}%`,
                                opacity: opacity,
                                transform: 'translate(-50%, -50%) scale(' + (opacity * 0.5 + 0.5) + ')',
                                transition: 'opacity 0.1s linear, transform 0.1s linear'
                            }}
                            onClick={(e) => { e.stopPropagation(); onClickPoint(point.id); }}
                        ></div>
                    );
                })}
            </div>
            <p className="text-sm text-gray-400 mt-2">Попаданий: {minigameState.hitPoints || 0} / {minigameState.totalPoints}</p>
        </div>
    );
};

export default ClickPointsMinigame;
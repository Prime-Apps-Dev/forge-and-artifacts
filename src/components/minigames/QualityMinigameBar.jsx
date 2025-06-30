// src/components/minigames/QualityMinigameBar.jsx
import React, { useEffect, useRef } from 'react';
import { useGame } from '../../context/useGame.js';
import { definitions } from '../../data/definitions';
import { gameConfig } from '../../constants/gameConfig';

const QualityMinigameBar = ({ minigameState, componentDef }) => {
    const { handlers, displayedGameState: gameState } = useGame();
    const animationFrameId = useRef(null);
    
    useEffect(() => {
        if (!minigameState?.active) {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            return;
        }
        
        const activeProject = gameState.activeOrder || gameState.activeFreeCraft;
        if (!activeProject) return;

        const itemDef = definitions.items[activeProject.itemKey];
        const epochLevel = gameConfig.EPOCH_DEFINITIONS[itemDef.baseIngot] || 1;
        const epochSpeedMultiplier = gameConfig.EPOCH_MINIGAME_SPEED_MULTIPLIERS[epochLevel] || 1.0;
        
        // ИСПРАВЛЕНИЕ: Формула расчета скорости ползунка приведена в соответствие с ТЗ.
        const baseSpeed = componentDef.minigame.barSpeed || 1.5;
        const finalBarSpeed = baseSpeed * gameState.minigameBarSpeedModifier * epochSpeedMultiplier;
        
        const speed = 100 / finalBarSpeed; 
        let lastUpdateTime = Date.now();
        let direction = 1;

        const animate = () => {
            const now = Date.now();
            const deltaTime = (now - lastUpdateTime) / 1000;
            lastUpdateTime = now;

            handlers.handleUpdateMinigameState(currentMinigameState => {
                if (!currentMinigameState || currentMinigameState.type !== 'bar_precision') return;
                
                let newPosition = currentMinigameState.position + direction * speed * deltaTime;

                if (newPosition >= 100) {
                    newPosition = 100;
                    direction = -1;
                } else if (newPosition <= 0) {
                    newPosition = 0;
                    direction = 1;
                }
                currentMinigameState.position = newPosition;
            });
            
            animationFrameId.current = requestAnimationFrame(animate);
        };

        animationFrameId.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [minigameState?.active, componentDef.minigame.barSpeed, handlers, gameState]);

    if (!minigameState?.active || !componentDef?.minigame || minigameState.type !== 'bar_precision') {
        return null;
    }
    
    const { position } = minigameState;
    
    return (
        <div className="my-4 p-2 rounded-lg relative h-10 border-2 border-yellow-500 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 shadow-lg">
            {componentDef.minigame.zones.map((zone, index) => (
                <div
                    key={index}
                    className={`absolute top-0 h-full ${zone.quality === 'perfect' ? 'bg-yellow-400/70' : 'bg-green-500/70'}`}
                    style={{ left: `${zone.from}%`, width: `${zone.to - zone.from}%` }}
                ></div>
            ))}
            <div
                className="absolute top-0 w-1.5 h-full bg-white rounded-full shadow-lg z-10"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
            ></div>
        </div>
    );
};

export default QualityMinigameBar;
// src/components/minigames/QualityMinigameBar.jsx
import React, { useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';

const QualityMinigameBar = ({ minigameState, componentDef }) => {
    const { handlers } = useGame();
    const animationFrameId = useRef(null);
    
    useEffect(() => {
        if (!minigameState?.active) {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            return;
        }

        const barSpeed = componentDef.minigame.barSpeed || 1.5;
        const speed = 100 / barSpeed; 
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
    }, [minigameState?.active, componentDef.minigame.barSpeed, handlers]);

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
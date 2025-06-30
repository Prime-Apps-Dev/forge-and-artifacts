// src/components/minigames/HoldAndReleaseMinigame.jsx
import React, { useEffect, useRef } from 'react';
import { gameConfig as GAME_CONFIG } from '../../constants/gameConfig';

const HoldAndReleaseMinigame = ({ minigameState, componentDef, onRelease, updateMinigameState }) => {
    const requestRef = useRef();
    const lastTimeRef = useRef();

    useEffect(() => {
        const animate = (time) => {
            if (lastTimeRef.current !== undefined) {
                const deltaTime = (time - lastTimeRef.current) / 1000; // in seconds

                updateMinigameState(state => {
                    if (!state || !state.active || state.type !== 'hold_and_release' || !state.isHolding) return;
                    
                    // releaseSpeed of 1.5 means it takes 1.5s to fill 100%
                    // so speed is 100/1.5 % per second
                    const speed = 100 / componentDef.minigame.releaseSpeed;
                    state.fillPercentage = Math.min(100, state.fillPercentage + speed * deltaTime);
                    
                    if (state.fillPercentage >= 100) {
                        onRelease();
                    }
                });
            }
            lastTimeRef.current = time;
            requestRef.current = requestAnimationFrame(animate);
        };

        if (minigameState?.isHolding) {
            lastTimeRef.current = undefined; // Reset for the first frame
            requestRef.current = requestAnimationFrame(animate);
        } else {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        }
        
        return () => {
            if(requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [minigameState?.isHolding, componentDef, onRelease, updateMinigameState]);
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (minigameState?.active) {
                onRelease();
            }
        }, GAME_CONFIG.MINIGAME_MAX_DURATION * 1000);
        return () => clearTimeout(timeout);
    }, [minigameState?.active, onRelease]);


    if (!minigameState?.active || !componentDef?.minigame || minigameState.type !== 'hold_and_release') {
        return null;
    }
    
    const { fillPercentage, targetZone, perfectZone } = minigameState;

    const handleInteractionStart = (e) => {
        e.preventDefault();
        updateMinigameState(state => {
            if (state?.active) state.isHolding = true;
        });
    };
    
    const handleInteractionEnd = (e) => {
        e.preventDefault();
        if(minigameState?.isHolding) {
            onRelease();
        }
    };

    return (
        <div className="my-4 p-4 rounded-lg border-2 border-yellow-500 bg-black/40 text-center">
            <p className="text-lg font-cinzel text-yellow-300 mb-2">Зажмите и отпустите в нужный момент!</p>
            <div
                className="relative w-full h-8 bg-gray-800 rounded-full overflow-hidden cursor-pointer touch-none"
                onMouseDown={handleInteractionStart}
                onMouseUp={handleInteractionEnd}
                onMouseLeave={handleInteractionEnd}
                onTouchStart={handleInteractionStart}
                onTouchEnd={handleInteractionEnd}
            >
                <div
                    className="absolute top-0 h-full bg-green-500/60 z-10"
                    style={{ left: `${targetZone.from}%`, width: `${targetZone.to - targetZone.from}%` }}
                ></div>
                <div
                    className="absolute top-0 h-full bg-yellow-400/80 z-20"
                    style={{ left: `${perfectZone.from}%`, width: `${perfectZone.to - perfectZone.from}%` }}
                ></div>
                <div
                    className="absolute top-0 left-0 h-full bg-orange-500 z-30"
                    style={{ width: `${fillPercentage}%` }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white z-40 mix-blend-difference">
                    {fillPercentage.toFixed(0)}%
                </span>
            </div>
        </div>
    );
};

export default HoldAndReleaseMinigame;
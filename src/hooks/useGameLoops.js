// src/hooks/useGameLoops.js
import { useEffect, useRef } from 'react';
// ИСПРАВЛЕНО: generateNewOrder больше не импортируется здесь
import { startGameLoop, startMarketLoop, startOrderGenerationLoop } from '../logic/gameLogic';

export function useGameLoops(updateState, handlers, showToast, showAchievementRewardModal, assetsLoaded) {
    const gameLoopIntervalRef = useRef(null);
    const marketLoopIntervalRef = useRef(null);
    const orderGenerationIntervalRef = useRef(null);

    useEffect(() => {
        if (gameLoopIntervalRef.current) {
            return;
        }

        if (assetsLoaded) {
            console.log("Game loops starting...");
            gameLoopIntervalRef.current = startGameLoop(updateState, handlers, showToast, showAchievementRewardModal);
            marketLoopIntervalRef.current = startMarketLoop(updateState, showToast);
            // ИСПРАВЛЕНО: Обновлен вызов startOrderGenerationLoop
            orderGenerationIntervalRef.current = startOrderGenerationLoop(updateState, handlers.checkForNewQuests, showToast);
        }

        return () => {
            if (gameLoopIntervalRef.current) {
                console.log("Game loops cleaning up...");
                clearInterval(gameLoopIntervalRef.current);
                clearInterval(marketLoopIntervalRef.current);
                clearTimeout(orderGenerationIntervalRef.current); // Используем clearTimeout, так как цикл использует setTimeout
                gameLoopIntervalRef.current = null;
                marketLoopIntervalRef.current = null;
                orderGenerationIntervalRef.current = null;
            }
        };
    }, [assetsLoaded, updateState, handlers, showToast, showAchievementRewardModal]);
}
// src/hooks/useGameLoops.js
import { useEffect } from 'react';
import { startGameLoop, startMarketLoop, startOrderGenerationLoop } from '../logic/gameLogic'; // Убедитесь, что все экспорты есть

export function useGameLoops(updateState, handlers, showToast, showAchievementRewardModal) {
    useEffect(() => {
        const shopLockInterval = setInterval(() => {
            updateState(state => {
                if (state.isShopLocked && Date.now() > state.shopLockEndTime) {
                    state.isShopLocked = false;
                    state.shopLockEndTime = 0;
                    showToast("Ваш магазин разблокирован!", "success");
                }
                if (state.isShopLocked && state.shopLockEndTime === 0) {
                     state.isShopLocked = false;
                     showToast("Ваш магазин был разблокирован из-за ошибки в данных!", "info");
                }
                return state;
            });
        }, 1000);

        // Передаем showAchievementRewardModal и showToast в startGameLoop
        const gameLoopInterval = startGameLoop(updateState, handlers, showToast, showAchievementRewardModal);
        const marketLoopInterval = startMarketLoop(updateState, showToast);
        const orderGenLoopInterval = startOrderGenerationLoop(handlers.handleGenerateNewOrderInQueue);

        updateState(state => { handlers.checkForNewQuests(state); return state; });

        return () => {
            clearInterval(shopLockInterval);
            clearInterval(gameLoopInterval);
            clearInterval(marketLoopInterval);
            clearInterval(orderGenLoopInterval);
        };
    }, [updateState, handlers, showToast, showAchievementRewardModal]); // Добавлены showAchievementRewardModal в зависимости
}
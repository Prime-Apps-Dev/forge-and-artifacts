// src/hooks/useGameLoops.js
import { useEffect } from 'react';
// Импортируем чистые JS-функции циклов из gameLogic.js
import { startGameLoop, startMarketLoop, startOrderGenerationLoop } from '../logic/gameLogic';

/**
 * Хук, отвечающий за запуск и остановку всех игровых циклов (setIntervals).
 *
 * @param {function} updateState - Функция для обновления игрового состояния (из useGameState).
 * @param {object} handlers - Объект со всеми обработчиками действий (из usePlayerActions, gameCoreHandlers).
 * @param {function} showToast - Функция для отображения уведомлений (из useNotifications).
 * @returns {void}
 */
export function useGameLoops(updateState, handlers, showToast) {
    useEffect(() => {
        // Логика разблокировки магазина по истечении времени
        const shopLockInterval = setInterval(() => {
            updateState(state => {
                if (state.isShopLocked && Date.now() > state.shopLockEndTime) {
                    state.isShopLocked = false;
                    state.shopLockEndTime = 0;
                    showToast("Ваш магазин разблокирован!", "success");
                }
                // Также проверяем, если isShopLocked случайно стало true без shopLockEndTime,
                // чтобы не застрять в заблокированном состоянии.
                if (state.isShopLocked && state.shopLockEndTime === 0) {
                     state.isShopLocked = false;
                     showToast("Ваш магазин был разблокирован из-за ошибки в данных!", "info");
                }
                return state;
            });
        }, 1000);

        // Запускаем основные игровые циклы, передавая им необходимые зависимости
        // Теперь handlers содержит handleGenerateNewOrderInQueue и checkForNewQuests
        const gameLoopInterval = startGameLoop(updateState, handlers, showToast);
        const marketLoopInterval = startMarketLoop(updateState, showToast);
        const orderGenLoopInterval = startOrderGenerationLoop(handlers.handleGenerateNewOrderInQueue);

        // При монтировании компонента, сразу проверяем наличие новых квестов
        // handlers.checkForNewQuests теперь вызывает gameCompletions.checkForNewQuests
        updateState(state => { handlers.checkForNewQuests(state); return state; });

        // Функция очистки: останавливаем все интервалы при размонтировании компонента
        return () => {
            clearInterval(shopLockInterval);
            clearInterval(gameLoopInterval);
            clearInterval(marketLoopInterval);
            clearInterval(orderGenLoopInterval);
        };
    }, [updateState, handlers, showToast]); // Зависимости: updateState, handlers (должен быть стабильным объектом), showToast
}
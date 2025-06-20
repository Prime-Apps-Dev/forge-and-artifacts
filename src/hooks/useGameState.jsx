// src/hooks/useGameState.jsx
import { useState, useRef, useCallback, useEffect } from 'react';

// Импортируем вынесенные части
import { useNotifications } from './useNotifications';
import { useAudioControl } from './useAudioControl';
import { useGameStateLoader } from './useGameStateLoader';
import { usePlayerActions } from './usePlayerActions';
import { useGameLoops } from './useGameLoops';


// Это основной агрегирующий хук для состояния игры
export function useGameState() {
    // 1. Управление уведомлениями
    const { toasts, showToast, removeToast } = useNotifications();

    // 2. Загрузка состояния и его хранение в useRef, а также отображение в useState
    const { displayedGameState, setDisplayedGameState, gameStateRef } = useGameStateLoader(showToast);

    // 3. Управление аудио (инициализация по жесту пользователя)
    const { handleInitialGesture } = useAudioControl(
        displayedGameState.settings.sfxVolume,
        displayedGameState.settings.musicVolume
    );

    // 4. Локальные состояния UI (не часть игрового состояния)
    const [isWorking, setIsWorking] = useState(false);
    const [completedOrderInfo, setCompletedOrderInfo] = useState(null);
    const [isSpecializationModalOpen, setIsSpecializationModalOpen] = useState(false);
    const [isWorldMapModalOpen, setIsWorldMapModalOpen] = useState(false);
    const [isAchievementRewardModalOpen, setIsAchievementRewardModalOpen] = useState(false);
    const [achievementToDisplay, setAchievementToDisplay] = useState(null);
    const [isAvatarSelectionModalOpen, setIsAvatarSelectionModalOpen] = useState(false);
    const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false); // <-- НОВОЕ СОСТОЯНИЕ
    const workTimeoutRef = useRef(null); // Ref для таймаута анимации работы

    // 5. Единая функция для обновления состояния игры
    const updateState = useCallback((updater) => {
        const newState = updater(JSON.parse(JSON.stringify(gameStateRef.current)));
        gameStateRef.current = newState; // Обновляем актуальное состояние
        setDisplayedGameState(newState); // Триггерим ререндер UI
    }, []);

    // 6. Действия игрока (usePlayerActions)
    const handlers = usePlayerActions(
        updateState, showToast, gameStateRef,
        setIsWorking, workTimeoutRef, setCompletedOrderInfo,
        setIsSpecializationModalOpen,
        setIsWorldMapModalOpen,
        setIsAchievementRewardModalOpen,
        setAchievementToDisplay,
        setIsAvatarSelectionModalOpen,
        setIsCreditsModalOpen // <-- ПЕРЕДАЕМ НОВОЕ СОСТОЯНИЕ
    );

    // 7. Игровые циклы (useGameLoops)
    useGameLoops(updateState, handlers, showToast);

    // Эффект для сохранения состояния в localStorage
    useEffect(() => {
        const stateToSave = { ...gameStateRef.current };
        // Очищаем временные/активные состояния перед сохранением
        stateToSave.orderQueue = [];
        stateToSave.activeOrder = null;
        stateToSave.activeFreeCraft = null;
        stateToSave.currentEpicOrder = null;
        stateToSave.smeltingProcess = null;
        stateToSave.activeReforge = null;
        stateToSave.activeInlay = null;
        stateToSave.activeGraving = null;
        stateToSave.activeInfoModal = null;
        stateToSave.activeSale = null;

        if (stateToSave.activeOrder && stateToSave.activeOrder.minigameState) {
            stateToSave.activeOrder = { ...stateToSave.activeOrder, minigameState: null };
        }
        delete stateToSave.lastClickTime; // Эти поля не должны сохраняться
        delete stateToSave.clickCount;

        try {
            localStorage.setItem('forgeAndArtifacts_v10', JSON.stringify(stateToSave));
        }
        catch (e) {
            console.error("Failed to save state to localStorage:", e);
            showToast("Ошибка сохранения игры!", "error");
        }
    }, [displayedGameState, showToast]);


    // Возвращаем все, что нужно компонентам верхнего уровня (App.jsx)
    return {
        displayedGameState,
        isWorking,
        toasts,
        completedOrderInfo,
        isSpecializationModalOpen,
        isWorldMapModalOpen,
        isAchievementRewardModalOpen,
        achievementToDisplay,
        isAvatarSelectionModalOpen,
        isCreditsModalOpen, // <-- ВОЗВРАЩАЕМ НОВОЕ СОСТОЯНИЕ
        handlers,
        removeToast,
        activeInfoModal: displayedGameState.activeInfoModal,
        handleInitialGesture,
    };
}
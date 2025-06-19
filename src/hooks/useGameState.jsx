// src/hooks/useGameState.jsx
import { useState, useRef, useCallback, useEffect } from 'react';

import { useNotifications } from './useNotifications';
import { useAudioControl } from './useAudioControl';
import { useGameStateLoader } from './useGameStateLoader';
import { usePlayerActions } from './usePlayerActions';
import { useGameLoops } from './useGameLoops';


export function useGameState() {
    const { toasts, showToast, removeToast } = useNotifications();
    const { displayedGameState, setDisplayedGameState, gameStateRef } = useGameStateLoader(showToast);
    const { handleInitialGesture } = useAudioControl(
        displayedGameState.settings.sfxVolume,
        displayedGameState.settings.musicVolume
    );

    const [isWorking, setIsWorking] = useState(false);
    const [completedOrderInfo, setCompletedOrderInfo] = useState(null);
    const [isSpecializationModalOpen, setIsSpecializationModalOpen] = useState(false);
    const [isWorldMapModalOpen, setIsWorldMapModalOpen] = useState(false);
    const [isAchievementRewardModalOpen, setIsAchievementRewardModalOpen] = useState(false);
    const [achievementToDisplay, setAchievementToDisplay] = useState(null);
    const [isAvatarSelectionModalOpen, setIsAvatarSelectionModalOpen] = useState(false);
    const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false); // <-- НОВОЕ СОСТОЯНИЕ
    const workTimeoutRef = useRef(null);

    const updateState = useCallback((updater) => {
        const newState = updater(JSON.parse(JSON.stringify(gameStateRef.current)));
        gameStateRef.current = newState;
        setDisplayedGameState(newState);
    }, []);

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

    useGameLoops(updateState, handlers, showToast);

    useEffect(() => {
        const stateToSave = { ...gameStateRef.current };
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
        delete stateToSave.lastClickTime;
        delete stateToSave.clickCount;

        try {
            localStorage.setItem('forgeAndArtifacts_v10', JSON.stringify(stateToSave));
        }
        catch (e) {
            console.error("Failed to save state to localStorage:", e);
            showToast("Ошибка сохранения игры!", "error");
        }
    }, [displayedGameState, showToast]);

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
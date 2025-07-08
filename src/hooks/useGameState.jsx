// src/hooks/useGameState.jsx
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useNotifications } from './useNotifications';
import { useAudioControl } from './useAudioControl';
import { useGameStateLoader } from './useGameStateLoader';
import { usePlayerActions } from './usePlayerActions';
import { useGameLoops } from './useGameLoops';
import { assetLoader } from '../utils/assetLoader';
import { IMAGE_PATHS } from '../constants/paths';

export function useGameState() {
    const { toasts, showToast, removeToast } = useNotifications();
    const { displayedGameState, setDisplayedGameState, gameStateRef } = useGameStateLoader(showToast);
    
    const [assetsLoaded, setAssetsLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);

    const { handleInitialGesture } = useAudioControl(
        displayedGameState.settings.sfxVolume,
        displayedGameState.settings.musicVolume
    );

    const [isWorking, setIsWorking] = useState(false);
    const [completedOrderInfo, setCompletedOrderInfo] = useState(null);
    const [isSpecializationModalOpen, setIsSpecializationModalOpen] = useState(false);
    const [isWorldMapModalOpen, setIsWorldMapModalOpen] = useState(false);
    const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
    const [achievementToDisplay, setAchievementToDisplay] = useState(null);
    const [isAvatarSelectionModalOpen, setIsAvatarSelectionModalOpen] = useState(false);
    const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
    const [isShopReputationModalOpen, setIsShopReputationModalOpen] = useState(false);
    const [isHirePersonnelModalOpen, setIsHirePersonnelModalOpen] = useState(false);
    const [activeInfoModal, setActiveInfoModal] = useState(null);
    const [isManagePersonnelModalOpen, setIsManagePersonnelModalOpen] = useState(false);
    const [managingPersonnelId, setManagingPersonnelId] = useState(null);
    const [isUpgradeItemModalOpen, setIsUpgradeItemModalOpen] = useState(false);
    const [itemToUpgradeId, setItemToUpgradeId] = useState(null);
    const [isEquipItemModalOpen, setIsEquipItemModalOpen] = useState(false); // Для персонала
    const [personnelToEquip, setPersonnelToEquip] = useState({ id: null, slot: null });
    const [isSetPriceModalOpen, setIsSetPriceModalOpen] = useState(false);
    const [itemToSetPriceFor, setItemToSetPriceFor] = useState(null);
    const [isEquipPlayerItemModalOpen, setIsEquipPlayerItemModalOpen] = useState(false); // Для игрока
    const [playerSlotToEquip, setPlayerSlotToEquip] = useState(null);


    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    
    const [activeMobileView, setActiveMobileView] = useState('forge');
    const [selectedMineOre, setSelectedMineOre] = useState('ironOre');
    const [selectedShopShelfIndex, setSelectedShopShelfIndex] = useState(null);


    const workTimeoutRef = useRef(null);

    const updateState = useCallback((updater) => {
        setDisplayedGameState(prevState => {
            if (!gameStateRef.current || typeof gameStateRef.current !== 'object') {
                console.error("updateState: gameStateRef.current не является валидным объектом.");
                return prevState;
            }
            const currentStateCopy = JSON.parse(JSON.stringify(gameStateRef.current));
            const newState = updater(currentStateCopy);
            
            if (newState.activeInfoModal !== (gameStateRef.current.activeInfoModal || null)) {
                 setActiveInfoModal(newState.activeInfoModal);
            }
            
            gameStateRef.current = newState;
            return newState;
        });
    }, [setDisplayedGameState, gameStateRef, setActiveInfoModal]);

    useEffect(() => {
        const loadAssets = async () => {
            const updateProgress = () => setLoadProgress(assetLoader.getLoadProgress());
            const progressInterval = setInterval(updateProgress, 100);
            await assetLoader.load();
            clearInterval(progressInterval);
            setLoadProgress(1);
            setAssetsLoaded(true);
        };
        loadAssets();
    }, []);

    const showAchievementRewardModal = useCallback((achievementDef) => {
        if (achievementDef) {
            setAchievementToDisplay(achievementDef);
            setIsAchievementModalOpen(true);
        }
    }, []);

    const handlerProps = useMemo(() => ({
        updateState, showToast, gameStateRef,
        setIsWorking, workTimeoutRef, setCompletedOrderInfo,
        setIsSpecializationModalOpen, setIsWorldMapModalOpen,
        setIsAchievementModalOpen, setAchievementToDisplay,
        setIsAvatarSelectionModalOpen, setIsCreditsModalOpen,
        showAchievementRewardModal,
        setIsShopReputationModalOpen,
        setIsHirePersonnelModalOpen,
        setActiveInfoModal,
        setIsManagePersonnelModalOpen,
        setManagingPersonnelId,
        setIsUpgradeItemModalOpen, setItemToUpgradeId,
        setIsEquipItemModalOpen, setPersonnelToEquip,
        setIsSetPriceModalOpen, setItemToSetPriceFor,
        setIsEquipPlayerItemModalOpen, setPlayerSlotToEquip,
        setIsSettingsOpen,
        setIsInventoryOpen,
        setIsProfileModalOpen,
        setActiveMobileView, 
        setSelectedMineOre, 
        setSelectedShopShelfIndex
    }), [updateState, showToast, gameStateRef, showAchievementRewardModal]);

    const handlers = usePlayerActions(handlerProps);

    useGameLoops(updateState, handlers, showToast, showAchievementRewardModal, assetsLoaded);

    useEffect(() => {
        if (!assetsLoaded || !displayedGameState) return;
        
        const stateToSave = { ...displayedGameState };
        
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
        stateToSave.personnelOffers = [];
        stateToSave.lastClickTime = 0;

        try {
            const stateString = JSON.stringify(stateToSave);
            const encodedState = btoa(unescape(encodeURIComponent(stateString)));
            localStorage.setItem('forgeAndArtifacts_v10', encodedState);
        } catch (e) {
            console.error("Failed to save state to localStorage:", e);
        }
    }, [displayedGameState, assetsLoaded]);

    return {
        displayedGameState, isWorking, toasts, completedOrderInfo,
        isSpecializationModalOpen, isWorldMapModalOpen, isAchievementModalOpen,
        achievementToDisplay, isAvatarSelectionModalOpen, isCreditsModalOpen,
        isShopReputationModalOpen, isHirePersonnelModalOpen,
        isManagePersonnelModalOpen, managingPersonnelId,
        isUpgradeItemModalOpen, itemToUpgradeId,
        isEquipItemModalOpen, personnelToEquip,
        isSetPriceModalOpen, itemToSetPriceFor,
        isEquipPlayerItemModalOpen, playerSlotToEquip,
        isSettingsOpen, isInventoryOpen, isProfileModalOpen,
        handlers, removeToast, activeInfoModal, handleInitialGesture,
        assetsLoaded, loadProgress, updateState,
        activeMobileView,
        selectedMineOre,
        selectedShopShelfIndex,
    };
}
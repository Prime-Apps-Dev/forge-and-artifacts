// src/hooks/useModalsHandlers.js
import { useCallback, useMemo } from 'react';
import { populatePersonnelOffers } from '../logic/gameLogic';
import { gameConfig as GAME_CONFIG } from '../constants/gameConfig';

export const useModalsHandlers = ({ 
    updateState, 
    showToast,
    setIsSpecializationModalOpen, 
    setIsWorldMapModalOpen, 
    setIsAchievementModalOpen, 
    setAchievementToDisplay, 
    setIsAvatarSelectionModalOpen, 
    setIsCreditsModalOpen, 
    setIsShopReputationModalOpen, 
    setIsHirePersonnelModalOpen,
    setActiveInfoModal,
    setIsManagePersonnelModalOpen,
    setManagingPersonnelId,
    // --- НОВЫЕ ПРОПСЫ ---
    setIsUpgradeItemModalOpen,
    setItemToUpgradeId,
    setIsEquipItemModalOpen,
    setPersonnelToEquip,
}) => {

    const handleCloseInfoModal = useCallback(() => {
        setActiveInfoModal(null);
    }, [setActiveInfoModal]);

    const handleCloseWorldMapModal = useCallback(() => {
        setIsWorldMapModalOpen(false);
    }, [setIsWorldMapModalOpen]);

    const handleCloseAchievementModal = useCallback(() => {
        setIsAchievementModalOpen(false);
        setAchievementToDisplay(null);
    }, [setIsAchievementModalOpen, setAchievementToDisplay]);

    const handleClaimAchievementReward = useCallback((achievementId, rewardText) => {
        showToast(rewardText, 'levelup');
        setIsAchievementModalOpen(false);
        setAchievementToDisplay(null);
    }, [showToast, setIsAchievementModalOpen, setAchievementToDisplay]);

    const handleOpenAvatarSelectionModal = useCallback(() => {
        setIsAvatarSelectionModalOpen(true);
    }, [setIsAvatarSelectionModalOpen]);

    const handleCloseAvatarSelectionModal = useCallback(() => {
        setIsAvatarSelectionModalOpen(false);
    }, [setIsAvatarSelectionModalOpen]);

    const handleSelectAvatar = useCallback((avatarId) => {
        updateState(state => {
            state.playerAvatarId = avatarId;
            showToast(`Аватар изменен!`, 'info');
            return state;
        });
        setIsAvatarSelectionModalOpen(false);
    }, [updateState, showToast, setIsAvatarSelectionModalOpen]);

    const handleOpenCreditsModal = useCallback(() => {
        setIsCreditsModalOpen(true);
    }, [setIsCreditsModalOpen]);

    const handleCloseCreditsModal = useCallback(() => {
        setIsCreditsModalOpen(false);
    }, [setIsCreditsModalOpen]);

    const handleOpenShopReputationModal = useCallback(() => {
        setIsShopReputationModalOpen(true);
    }, [setIsShopReputationModalOpen]);

    const handleCloseShopReputationModal = useCallback(() => {
        setIsShopReputationModalOpen(false);
    }, [setIsShopReputationModalOpen]);

    const handleOpenHirePersonnelModal = useCallback(() => {
        updateState(state => {
            if (state.personnelOffers.length === 0) {
                populatePersonnelOffers(state);
                state.lastPersonnelOfferRollTime = Date.now();
                state.personnelRollCount = 0;
            }
            return state;
        });
        setIsSpecializationModalOpen(false);
        setIsHirePersonnelModalOpen(true);
    }, [updateState, setIsHirePersonnelModalOpen, setIsSpecializationModalOpen]);

    const handleCloseHirePersonnelModal = useCallback(() => {
        setIsHirePersonnelModalOpen(false);
    }, [setIsHirePersonnelModalOpen]);

    const handleOpenManagePersonnelModal = useCallback((personnelId) => {
        setManagingPersonnelId(personnelId);
        setIsManagePersonnelModalOpen(true);
    }, [setIsManagePersonnelModalOpen, setManagingPersonnelId]);

    const handleCloseManagePersonnelModal = useCallback(() => {
        setIsManagePersonnelModalOpen(false);
        setManagingPersonnelId(null);
    }, [setIsManagePersonnelModalOpen, setManagingPersonnelId]);

    // --- НОВЫЕ ОБРАБОТЧИКИ ДЛЯ ЭКИПИРОВКИ ---
    const handleOpenUpgradeItemModal = useCallback((itemId) => {
        setItemToUpgradeId(itemId);
        setIsUpgradeItemModalOpen(true);
    }, [setItemToUpgradeId, setIsUpgradeItemModalOpen]);

    const handleCloseUpgradeItemModal = useCallback(() => {
        setIsUpgradeItemModalOpen(false);
        setItemToUpgradeId(null);
    }, [setIsUpgradeItemModalOpen, setItemToUpgradeId]);
    
    const handleOpenEquipItemModal = useCallback((personnelId, slot) => {
        setPersonnelToEquip({ id: personnelId, slot: slot });
        setIsEquipItemModalOpen(true);
    }, [setPersonnelToEquip, setIsEquipItemModalOpen]);

    const handleCloseEquipItemModal = useCallback(() => {
        setIsEquipItemModalOpen(false);
        setPersonnelToEquip({ id: null, slot: null });
    }, [setIsEquipItemModalOpen, setPersonnelToEquip]);
    // --- ------------------------------------ ---


    return useMemo(() => ({
        handleCloseInfoModal,
        handleCloseWorldMapModal,
        handleCloseAchievementRewardModal: handleCloseAchievementModal,
        handleClaimAchievementReward,
        handleOpenAvatarSelectionModal,
        handleCloseAvatarSelectionModal,
        handleSelectAvatar,
        handleOpenCreditsModal,
        handleCloseCreditsModal,
        handleOpenShopReputationModal,
        handleCloseShopReputationModal,
        handleOpenHirePersonnelModal,
        handleCloseHirePersonnelModal,
        handleOpenManagePersonnelModal,
        handleCloseManagePersonnelModal,
        // --- НОВЫЕ ОБРАБОТЧИКИ ---
        handleOpenUpgradeItemModal,
        handleCloseUpgradeItemModal,
        handleOpenEquipItemModal,
        handleCloseEquipItemModal,
    }), [
        handleCloseInfoModal, handleCloseWorldMapModal, handleCloseAchievementModal,
        handleClaimAchievementReward, handleOpenAvatarSelectionModal, handleCloseAvatarSelectionModal,
        handleSelectAvatar, handleOpenCreditsModal, handleCloseCreditsModal,
        handleOpenShopReputationModal, handleCloseShopReputationModal,
        handleOpenHirePersonnelModal, handleCloseHirePersonnelModal,
        handleOpenManagePersonnelModal, handleCloseManagePersonnelModal,
        handleOpenUpgradeItemModal, handleCloseUpgradeItemModal, handleOpenEquipItemModal, handleCloseEquipItemModal, // Добавляем в зависимости
    ]);
};
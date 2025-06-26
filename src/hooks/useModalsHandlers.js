// src/hooks/useModalsHandlers.js
import { useCallback, useMemo } from 'react';

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
    setActiveInfoModal
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
        // Логика применения награды уже в основном цикле, здесь только закрываем окно
        setIsAchievementModalOpen(false);
        setAchievementToDisplay(null);
    }, [showToast, setIsAchievementModalOpen, setAchievementToDisplay]);

    const handleOpenAvatarSelectionModal = useCallback(() => {
        setIsAvatarSelectionModalOpen(true);
    }, [setIsAvatarSelectionModalOpen]);

    const handleCloseAvatarSelectionModal = useCallback(() => {
        setIsAvatarSelectionModalOpen(false);
    }, [setIsAvatarSelectionModalOpen]);

    // ИСПРАВЛЕНИЕ: Добавляем обработчик выбора аватара сюда
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
        setIsSpecializationModalOpen(false);
        setIsHirePersonnelModalOpen(true);
    }, [setIsHirePersonnelModalOpen, setIsSpecializationModalOpen]);

    const handleCloseHirePersonnelModal = useCallback(() => {
        setIsHirePersonnelModalOpen(false);
    }, [setIsHirePersonnelModalOpen]);


    return useMemo(() => ({
        handleCloseInfoModal,
        handleCloseWorldMapModal,
        handleCloseAchievementRewardModal: handleCloseAchievementModal,
        handleClaimAchievementReward,
        handleOpenAvatarSelectionModal,
        handleCloseAvatarSelectionModal,
        handleSelectAvatar, // <-- Возвращаем его в общем объекте
        handleOpenCreditsModal,
        handleCloseCreditsModal,
        handleOpenShopReputationModal,
        handleCloseShopReputationModal,
        handleOpenHirePersonnelModal,
        handleCloseHirePersonnelModal,
    }), [
        handleCloseInfoModal, handleCloseWorldMapModal, handleCloseAchievementModal,
        handleClaimAchievementReward, handleOpenAvatarSelectionModal, handleCloseAvatarSelectionModal,
        handleSelectAvatar, handleOpenCreditsModal, handleCloseCreditsModal,
        handleOpenShopReputationModal, handleCloseShopReputationModal,
        handleOpenHirePersonnelModal, handleCloseHirePersonnelModal,
    ]);
};
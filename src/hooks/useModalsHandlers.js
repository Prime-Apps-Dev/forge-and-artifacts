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
    setIsUpgradeItemModalOpen,
    setItemToUpgradeId,
    setIsEquipItemModalOpen,
    setPersonnelToEquip,
    setIsSetPriceModalOpen, 
    setItemToSetPriceFor,
    setIsEquipPlayerItemModalOpen, 
    setPlayerSlotToEquip,
    setIsSettingsOpen,
    setIsInventoryOpen,
    setIsProfileModalOpen,
}) => {

    const handleOpenProfileModal = useCallback(() => setIsProfileModalOpen(true), [setIsProfileModalOpen]);
    const handleCloseProfileModal = useCallback(() => setIsProfileModalOpen(false), [setIsProfileModalOpen]);
    const handleOpenSettingsModal = useCallback(() => setIsSettingsOpen(true), [setIsSettingsOpen]);
    const handleCloseSettingsModal = useCallback(() => setIsSettingsOpen(false), [setIsSettingsOpen]);
    const handleOpenInventoryModal = useCallback(() => setIsInventoryOpen(true), [setIsInventoryOpen]);
    const handleCloseInventoryModal = useCallback(() => setIsInventoryOpen(false), [setIsInventoryOpen]);

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

    const handleOpenSetPriceModal = useCallback((shelfIndex) => {
        setItemToSetPriceFor(shelfIndex);
        setIsSetPriceModalOpen(true);
    }, [setItemToSetPriceFor, setIsSetPriceModalOpen]);

    const handleCloseSetPriceModal = useCallback(() => {
        setIsSetPriceModalOpen(false);
        setItemToSetPriceFor(null);
    }, [setIsSetPriceModalOpen, setItemToSetPriceFor]);

    const handleOpenEquipPlayerItemModal = useCallback((slotType) => {
        setPlayerSlotToEquip(slotType);
        setIsEquipPlayerItemModalOpen(true);
    }, [setPlayerSlotToEquip, setIsEquipPlayerItemModalOpen]);

    const handleCloseEquipPlayerItemModal = useCallback(() => {
        setIsEquipPlayerItemModalOpen(false);
        setPlayerSlotToEquip(null);
    }, [setIsEquipPlayerItemModalOpen, setPlayerSlotToEquip]);


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
        handleOpenUpgradeItemModal,
        handleCloseUpgradeItemModal,
        handleOpenEquipItemModal,
        handleCloseEquipItemModal,
        handleOpenSetPriceModal,
        handleCloseSetPriceModal,
        handleOpenEquipPlayerItemModal,
        handleCloseEquipPlayerItemModal,
        handleOpenProfileModal,
        handleCloseProfileModal,
        handleOpenSettingsModal,
        handleCloseSettingsModal,
        handleOpenInventoryModal,
        handleCloseInventoryModal,
    }), [
        handleCloseInfoModal, handleCloseWorldMapModal, handleCloseAchievementModal,
        handleClaimAchievementReward, handleOpenAvatarSelectionModal, handleCloseAvatarSelectionModal,
        handleSelectAvatar, handleOpenCreditsModal, handleCloseCreditsModal,
        handleOpenShopReputationModal, handleCloseShopReputationModal,
        handleOpenHirePersonnelModal, handleCloseHirePersonnelModal,
        handleOpenManagePersonnelModal, handleCloseManagePersonnelModal,
        handleOpenUpgradeItemModal, handleCloseUpgradeItemModal, handleOpenEquipItemModal, handleCloseEquipItemModal,
        handleOpenSetPriceModal, handleCloseSetPriceModal,
        handleOpenEquipPlayerItemModal, handleCloseEquipPlayerItemModal,
        handleOpenProfileModal, handleCloseProfileModal, handleOpenSettingsModal, handleCloseSettingsModal, handleOpenInventoryModal, handleCloseInventoryModal,
    ]);
};
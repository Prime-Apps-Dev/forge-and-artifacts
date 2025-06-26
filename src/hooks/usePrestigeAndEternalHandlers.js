// src/hooks/usePrestigeAndEternalHandlers.js
import { useCallback, useMemo } from 'react';
import { definitions } from '../data/definitions/index.js';
import { recalculateAllModifiers } from '../utils/gameStateUtils';
import { audioController } from '../utils/audioController';
import { formatNumber } from '../utils/formatters.jsx';
import { initialGameState } from '../hooks/useGameStateLoader';
import { gameConfig as GAME_CONFIG } from '../constants/gameConfig';

export const usePrestigeAndEternalHandlers = ({ updateState, showToast, gameStateRef, setIsWorldMapModalOpen }) => { // Removed static deps from args

    const handleClaimMasteryReward = useCallback((rewardId) => {
        updateState(state => {
            const rewardDef = definitions.masteryLevelRewards.find(r => r.id === rewardId);
            if (!rewardDef) return state;

            const isClaimed = state.claimedMasteryLevelRewards.includes(rewardId);
            const isAvailable = state.masteryLevel >= rewardDef.level;

            if (isClaimed) {
                showToast("Награда уже получена!", "error");
                return state;
            }
            if (!isAvailable) {
                showToast("Награда еще не доступна!", "error");
                return state;
            }

            if (rewardDef.reward) {
                if (rewardDef.reward.sparks) state.sparks += rewardDef.reward.sparks;
                if (rewardDef.reward.matter) state.matter += rewardDef.reward.matter;
                if (rewardDef.reward.ironOre) state.ironOre += rewardDef.reward.ironOre;
                if (rewardDef.reward.shopShelf) {
                    for(let i=0; i < rewardDef.reward.shopShelf; i++) {
                        state.shopShelves.push({ id: `shelf_mastery_lvl_${Date.now()}_${Math.random()}`, itemId: null, customer: null, saleProgress: 0, saleTimer: 0 });
                    }
                    showToast(`Получено: +${rewardDef.reward.shopShelf} торговых полок!`, 'success');
                }
                if (typeof rewardDef.reward.apply === 'function') {
                    rewardDef.reward.apply(state);
                }
            }

            state.claimedMasteryLevelRewards.push(rewardId);
            recalculateAllModifiers(state);
            showToast(`Награда "${rewardDef.name}" получена!`, "levelup");
            audioController.play('levelup', 'G6', '2n');
            return state;
        });
    }, [updateState, showToast, recalculateAllModifiers, definitions, audioController]);

    const handleClaimShopLevelReward = useCallback((rewardId) => {
        updateState(state => {
            const levelDef = definitions.shopLevels.find(lvl => lvl.reward?.id === rewardId);
            if (!levelDef || !levelDef.reward) return state;

            const isClaimed = state.claimedShopLevelRewards.includes(rewardId);
            const isAvailable = state.shopLevel >= levelDef.level;

            if (isClaimed) {
                showToast("Награда уже получена!", "error");
                return state;
            }
            if (!isAvailable) {
                showToast("Награда еще не доступна!", "error");
                return state;
            }

            if (levelDef.reward.sparks) state.sparks += levelDef.reward.sparks;
            if (levelDef.reward.matter) state.matter += levelDef.reward.matter;
            if (levelDef.reward.inventoryCapacity) state.inventoryCapacity += levelDef.reward.inventoryCapacity;

            if (levelDef.reward.shopShelf) {
                for(let i=0; i < levelDef.reward.shopShelf; i++) {
                    state.shopShelves.push({ id: `shelf_shop_lvl_${Date.now()}_${Math.random()}`, itemId: null, customer: null, saleProgress: 0, saleTimer: 0 });
                }
                showToast(`Получено: +${levelDef.reward.shopShelf} торговых полок!`, 'success');
            }

            if (typeof levelDef.reward.apply === 'function') {
                levelDef.reward.apply(state);
            }

            state.claimedShopLevelRewards.push(rewardId);
            recalculateAllModifiers(state);
            showToast(`Награда "${levelDef.name}" получена!`, "levelup");
            audioController.play('levelup', 'G6', '2n');
            return state;
        });
    }, [updateState, showToast, recalculateAllModifiers, definitions, audioController]);

    const handleResetGame = useCallback(() => {
        if (window.confirm("Вы уверены, что хотите сбросить весь игровой прогресс? Это действие необратимо!")) {
            localStorage.clear();
            window.location.reload();
        }
    }, []);

    const handleStartNewSettlement = useCallback(() => {
        updateState(state => {
            const allArtifacts = Object.values(state.artifacts);
            const completedArtifacts = allArtifacts.filter(art => art.status === 'completed');

            if (completedArtifacts.length < allArtifacts.length) {
                showToast("Необходимо создать все Великие Артефакты, чтобы совершить Переселение!", "error");
                return state;
            }

            const currentMasteryXP = state.masteryXP;
            const currentMasteryLevel = state.masteryLevel;
            const currentRegionId = state.currentRegion;

            const prestigePointsEarned = Math.floor((currentMasteryXP * GAME_CONFIG.PRESTIGE_XP_PER_MASTERY_XP) + (currentMasteryLevel * GAME_CONFIG.PRESTIGE_XP_PER_MASTERY_LEVEL));

            gameStateRef.current.prestigePoints = (state.prestigePoints || 0) + prestigePointsEarned;
            gameStateRef.current.regionsVisited = Array.from(new Set([...(state.regionsVisited || []), currentRegionId]));
            gameStateRef.current.isFirstPlaythrough = false;

            showToast(`Переселение начинается! Вы заработали ${formatNumber(prestigePointsEarned)} Осколков Памяти.`, 'levelup');
            setIsWorldMapModalOpen(true);
            return state;
        });
    }, [updateState, showToast, gameStateRef, setIsWorldMapModalOpen, definitions, formatNumber]);

    const handleSelectRegion = useCallback((regionId) => {
        const newState = JSON.parse(JSON.stringify(initialGameState)); // initialGameState is imported, it's a const, so stable.

        newState.prestigePoints = gameStateRef.current.prestigePoints;
        newState.regionsVisited = gameStateRef.current.regionsVisited;
        newState.isFirstPlaythrough = gameStateRef.current.isFirstPlaythrough;
        newState.eternalSkills = gameStateRef.current.eternalSkills;
        newState.settings = JSON.parse(JSON.stringify(gameStateRef.current.settings));
        newState.workstations = JSON.parse(JSON.stringify(gameStateRef.current.workstations));
        newState.claimedMasteryLevelRewards = JSON.parse(JSON.stringify(gameStateRef.current.claimedMasteryLevelRewards));
        newState.playerName = gameStateRef.current.playerName;
        newState.claimedShopLevelRewards = JSON.parse(JSON.stringify(gameStateRef.current.claimedShopLevelRewards));
        newState.eternalAchievementBonuses = JSON.parse(JSON.stringify(gameStateRef.current.eternalAchievementBonuses));

        newState.currentRegion = regionId;

        const selectedRegionDef = definitions.regions[regionId];
        if (selectedRegionDef && selectedRegionDef.initialBonuses) {
            for (const resourceType in selectedRegionDef.initialBonuses) {
                const amount = selectedRegionDef.initialBonuses[resourceType];
                if (newState.hasOwnProperty(resourceType)) {
                    newState[resourceType] = (newState[resourceType] || 0) + amount;
                } else if (newState.specialItems.hasOwnProperty(resourceType)) {
                    newState.specialItems[resourceType] = (newState.specialItems[resourceType] || 0) + amount;
                }
            }
        }

        newState.purchasedSkills = {}; // Reset purchased skills on new settlement

        recalculateAllModifiers(newState);

        try {
            localStorage.setItem('forgeAndArtifacts_v10', JSON.stringify(newState));
            showToast(`Новая мастерская основана в регионе "${selectedRegionDef.name}"!`, 'levelup');
            window.location.reload();
        }
        catch (e) {
            console.error("Failed to save new game state after settlement:", e);
            showToast("Ошибка при сохранении нового поселения!", "error");
        }
    }, [showToast, gameStateRef, recalculateAllModifiers, initialGameState, definitions]); // initialGameState, definitions are stable imports

    const handleBuyEternalSkill = useCallback((skillId) => {
        updateState(state => {
            if (state.isFirstPlaythrough) { showToast("Вечные навыки можно покупать только после первого Переселения!", "error"); return state; }

            const skill = definitions.eternalSkills[skillId];
            if (!skill || state.eternalSkills[skillId]) {
                return state;
            }

            if (!skill.requires.every(reqId => state.eternalSkills[reqId])) {
                showToast("Сначала изучите предыдущие вечные навыки!", 'error');
                return state;
            }

            const cost = skill.cost.prestigePoints || 0;
            if (state.prestigePoints < cost) {
                showToast(`Недостаточно Осколков Памяти (${formatNumber(cost)} требуется)!`, 'error');
                return state;
            }

            state.prestigePoints -= cost;
            state.eternalSkills[skillId] = true;
            recalculateAllModifiers(state);
            showToast(`Вечный навык "${skill.name}" изучен!`, 'levelup');
            audioController.play('levelup', 'A5', '4n');

            return state;
        });
    }, [updateState, showToast, recalculateAllModifiers, definitions, formatNumber, audioController]);

    return useMemo(() => ({
        handleClaimMasteryReward,
        handleClaimShopLevelReward,
        handleResetGame,
        handleStartNewSettlement,
        handleSelectRegion,
        handleBuyEternalSkill,
    }), [
        handleClaimMasteryReward,
        handleClaimShopLevelReward,
        handleResetGame,
        handleStartNewSettlement,
        handleSelectRegion,
        handleBuyEternalSkill,
    ]);
};
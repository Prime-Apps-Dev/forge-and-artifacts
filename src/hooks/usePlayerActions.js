// src/hooks/usePlayerActions.js
import { useCallback, useMemo, useRef } from 'react';
import { definitions } from '../data/definitions';
import { formatNumber, hasReputation, getReputationLevel } from '../utils/helpers';
import { audioController } from '../utils/audioController';
import { recalculateAllModifiers } from '../utils/gameStateUtils';
import {
    handleSaleCompletion,
    handleFreeCraftCompletion,
    handleCompleteReforge,
    handleCompleteInlay,
    handleCompleteGraving,
    handleOrderCompletion,
    checkForNewQuests
} from '../logic/gameCompletions';
import { createCoreHandlers } from '../logic/gameCoreHandlers';
import { initialGameState } from './useGameStateLoader';

export function usePlayerActions(
    updateState, showToast, gameStateRef,
    setIsWorking, workTimeoutRef, setCompletedOrderInfo,
    setIsSpecializationModalOpen,
    setIsWorldMapModalOpen,
    setIsAchievementRewardModalOpen,
    setAchievementToDisplay,
    setIsAvatarSelectionModalOpen,
    setIsCreditsModalOpen // <-- ПРИНИМАЕМ НОВОЕ СОСТОЯНИЕ
) {
    const clickData = useRef({ count: 0, lastTime: 0 });

    const coreHandlers = useMemo(() => createCoreHandlers({
        updateState, showToast, setIsWorking, workTimeoutRef, setCompletedOrderInfo
    }), [updateState, showToast, setIsWorking, workTimeoutRef, setCompletedOrderInfo]);

    const canAffordAndPay = useCallback((state, costs, showToastFunc) => {
        for (const resourceType in costs) {
            const costAmount = costs[resourceType];
            const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType === 'matter' ? 'main' : 'specialItems';
            const currentAmount = resourceStorage === 'main' ? state[resourceType] : state.specialItems[resourceType];

            if (currentAmount < costAmount) {
                const resourceName = definitions.specialItems[resourceType]?.name || resourceType.replace('Ingots', ' слитков').replace('Ore', ' руды').replace('sparks', ' искр').replace('matter', ' материи');
                showToastFunc(`Недостаточно: ${resourceName} (${formatNumber(costAmount)} требуется)!`, 'error');
                return false;
            }
        }

        for (const resourceType in costs) {
            const costAmount = costs[resourceType];
            const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType === 'matter' ? 'main' : 'specialItems';
            if (resourceStorage === 'main') { state[resourceType] -= costAmount; }
            else { state.specialItems[resourceType] -= costAmount; }
        }
        return true;
    }, [showToast]);

    const handleStartMission = useCallback((missionId, committedGear) => {
        updateState(state => {
            const missionDef = definitions.missions[missionId];
            if (!missionDef) { showToast("Ошибка: миссия не найдена!", "error"); return state; }
            const committedGearIds = Object.values(committedGear);
            let totalQualityBonus = 0;
            const newInventory = state.inventory.filter(item => {
                if (committedGearIds.includes(item.uniqueId)) {
                    const requirement = missionDef.requiredGear.find(req => req.itemKey === item.itemKey);
                    if(requirement) { totalQualityBonus += Math.max(0, item.quality - requirement.minQuality); }
                    return false; } return true; });
            state.inventory = newInventory;
            const newActiveMission = { id: `${missionId}_${Date.now()}`, missionId: missionId, startTime: Date.now(), duration: missionDef.duration, qualityBonus: totalQualityBonus, };
            state.activeMissions.push(newActiveMission);
            showToast(`Экспедиция "${missionDef.name}" отправлена!`, "info");
            audioController.play('complete', 'D4', '8n'); return state;
        });
    }, [updateState, showToast]);

    const handleClickSale = useCallback((shelfIndex) => {
        audioController.play('click', 'E4', '16n');
        updateState(state => {
            const shelf = state.shopShelves[shelfIndex];
            if (!shelf || !shelf.customer) return state;
            const clientSaleModifier = shelf.customer.demands?.saleSpeedModifier || 1.0;
            const saleProgressPerClick = 5 * clientSaleModifier;
            shelf.saleProgress += saleProgressPerClick;
            const item = state.inventory.find(i => i.uniqueId === shelf.itemId);
            if (!item) { showToast("Ошибка: проданный предмет не найден в инвентаре!", "error"); state.shopShelves[shelfIndex] = { itemId: null, customer: null, saleProgress: 0, saleTimer: 0 }; return state; }
            const itemDef = definitions.items[item.itemKey];
            const baseValue = itemDef.components.reduce((sum, c) => sum + c.progress, 0);
            const requiredProgress = (baseValue * item.quality) / 2;
            if (shelf.saleProgress >= Math.max(50, requiredProgress)) { handleSaleCompletion(state, shelfIndex, showToast); } return state;
        });
    }, [updateState, showToast]);

    const handleCloseInfoModal = useCallback(() => {
        updateState(state => { state.activeInfoModal = null; return state; });
    }, [updateState]);

    const handleCloseWorldMapModal = useCallback(() => {
        setIsWorldMapModalOpen(false);
    }, [setIsWorldMapModalOpen]);

    const handleCloseAchievementRewardModal = useCallback(() => {
        setIsAchievementRewardModalOpen(false);
        setAchievementToDisplay(null);
    }, [setIsAchievementRewardModalOpen, setAchievementToDisplay]);

    const handleClaimAchievementReward = useCallback((achievementId, rewardText) => {
        showToast(rewardText, 'levelup');
        setIsAchievementRewardModalOpen(false);
        setAchievementToDisplay(null);
    }, [showToast, setIsAchievementRewardModalOpen, setAchievementToDisplay]);

    const handleOpenAvatarSelectionModal = useCallback(() => {
        setIsAvatarSelectionModalOpen(true);
    }, [setIsAvatarSelectionModalOpen]);

    const handleCloseAvatarSelectionModal = useCallback(() => {
        setIsAvatarSelectionModalOpen(false);
    }, [setIsAvatarSelectionModalOpen]);

    // НОВОЕ: Открытие модалки Благодарностей
    const handleOpenCreditsModal = useCallback(() => {
        setIsCreditsModalOpen(true);
    }, [setIsCreditsModalOpen]);

    // НОВОЕ: Закрытие модалки Благодарностей
    const handleCloseCreditsModal = useCallback(() => {
        setIsCreditsModalOpen(false);
    }, [setIsCreditsModalOpen]);

    const handleSelectAvatar = useCallback((avatarId) => {
        updateState(state => {
            state.playerAvatarId = avatarId;
            showToast(`Аватар изменен на "${definitions.avatars[avatarId]?.name}"!`, 'info');
            return state;
        });
        setIsAvatarSelectionModalOpen(false);
    }, [updateState, showToast, setIsAvatarSelectionModalOpen]);


    const handleBuySkill = useCallback((skillId) => {
        let shouldOpenSpecModal = false;
        let shouldOpenInfoModal = null;
        updateState(state => {
            const skill = definitions.skills[skillId];
            if (!skill || state.purchasedSkills[skillId]) return state;
            if (!skill.requires.every(reqId => {
                const requiredSkillDef = definitions.skills[reqId];
                if (state.isFirstPlaythrough && requiredSkillDef?.firstPlaythroughLocked) {
                    return true;
                }
                return state.purchasedSkills && state.purchasedSkills[reqId];
            })) { showToast("Сначала изучите предыдущие навыки!", 'error'); return state; }
            const currentCost = { ...skill.cost };
            for (const resourceType in currentCost) {
                if (resourceType === 'matter') {
                    const isOffSpec = skill.requiredSpecialization && state.specialization && skill.requiredSpecialization !== state.specialization;
                    if (isOffSpec) { currentCost[resourceType] *= 5; }
                    if (state.matterCostReduction > 0) { currentCost[resourceType] = Math.max(1, Math.floor(currentCost[resourceType] * (1 - state.matterCostReduction))); }
                } }
            if (!canAffordAndPay(state, currentCost, showToast)) { return state; }
            state.purchasedSkills[skillId] = true;
            recalculateAllModifiers(state);
            let toastMessage = `Навык "${skill.name}" изучен!`;
            const isOffSpec = skill.requiredSpecialization && state.specialization && skill.requiredSpecialization !== state.specialization;
            if (isOffSpec) toastMessage += " (Вне специализации)";
            showToast(toastMessage, 'success');
            if (skillId === 'findCopper' && state.specialization === null) { shouldOpenSpecModal = true; }
            else if (skillId === 'masterReforging') { shouldOpenInfoModal = { title: "Мастерство Перековки", image: "/img/reforge_intro.png", message: "С каждым выкованным изделием вы чувствуете, что можете сделать его лучше. Теперь вы знаете, как перековать металл, повышая качество предмета за счет дополнительной работы и ресурсов.", buttonText: "Время для Перековки!" }; }
            else if (skillId === 'jewelryCrafting' && state.specialItems.gem > 0) { shouldOpenInfoModal = { title: "Тайны Инкрустации", image: "/img/inlay_intro.png", message: "Сколько вы уже выковали различных изделий, но вы впервые замечаете необычные впадины в своих изделиях. Спросив у одного из покупателя, вы узнаёте, что в эти впадины или как их называют 'Слоты' можно инкрустировать самоцветы!", buttonText: "Вперёд ковать!" }; }
            else if (skillId === 'divisionOfLabor') { shouldOpenInfoModal = { title: "Разделение Труда", image: "/img/division_intro.png", message: "Вы осознали важность каждого станка. Теперь вы можете выбирать, на каком верстаке работать, и это открывает путь к узкой специализации.", buttonText: "Мастер своего дела!" }; }
            else if (skillId === 'masterGraving') { shouldOpenInfoModal = { title: "Искусство Гравировки", image: "/img/graving_intro.png", message: "Ваши навыки достигли новых высот! Теперь вы способны наносить на свои творения изящные узоры, повышая их ценность и привлекая самых взыскательных коллекционеров.", buttonText: "К новым вершинам!" }; }
            checkForNewQuests(state, showToast); return state;
        });
        if (shouldOpenSpecModal) { setTimeout(() => setIsSpecializationModalOpen(true), 100); }
        else if (shouldOpenInfoModal) {
            if (gameStateRef.current.activeInfoModal) { updateState(state => { state.activeInfoModal = null; return state; }); }
            setTimeout(() => { updateState(state => { state.activeInfoModal = shouldInfoModal; return state; }); }, 100);
        }
    }, [updateState, showToast, canAffordAndPay, recalculateAllModifiers, setIsSpecializationModalOpen, gameStateRef]);

    const handleSelectSpecialization = useCallback((specId) => {
        updateState(state => { if (state.specialization === null) { state.specialization = specId; showToast(`Вы выбрали путь Мастера-${definitions.specializations[specId].name}!`, 'levelup'); } return state; }); setIsSpecializationModalOpen(false);
    }, [updateState, showToast, setIsSpecializationModalOpen]);

    const handleBuyFactionUpgrade = useCallback((upgradeId) => {
        updateState(state => {
            const upgrade = definitions.factionUpgrades[upgradeId];
            if (!upgrade || state.purchasedFactionUpgrades[upgradeId]) return state;
            if (!hasReputation(state.reputation, upgrade.factionId, upgrade.requiredRep)) { showToast("Недостаточно репутации!", 'error'); return state; }
            if (!canAffordAndPay(state, upgrade.cost, showToast)) { return state; }
            state.purchasedFactionUpgrades[upgradeId] = true; recalculateAllModifiers(state); showToast(`Улучшение "${upgrade.name}" приобретено!`, 'levelup'); audioController.play('levelup', 'A4', '8n'); return state;
        });
    }, [updateState, showToast, canAffordAndPay, recalculateAllModifiers]);

    const handleVolumeChange = useCallback((type, value) => {
        const numericValue = parseInt(value, 10);
        updateState(state => { if (type === 'sfx') state.settings.sfxVolume = numericValue; else if (type === 'music') state.settings.musicVolume = numericValue; audioController.setSfxVolume(state.settings.sfxVolume); audioController.setMusicVolume(state.settings.musicVolume); return state; });
    }, [updateState]);

    const handleMoveItemToShelf = useCallback((itemUniqueId) => {
        updateState(state => {
            if (state.isShopLocked) { showToast("Ваш магазин заблокирован! Попробуйте позже.", "error"); return state; } const emptyShelfIndex = state.shopShelves.findIndex(shelf => shelf.itemId === null); if (emptyShelfIndex === -1) { showToast("Все полки в магазине заняты!", 'error'); return state; } const itemToMove = state.inventory.find(item => item.uniqueId === itemUniqueId); if (!itemToMove || itemToMove.location !== 'inventory') return state; itemToMove.location = 'shelf'; state.shopShelves[emptyShelfIndex].itemId = itemUniqueId; showToast(`Предмет "${definitions.items[itemToMove.itemKey].name}" выставлен на продажу!`, "info"); return state;
        });
    }, [updateState, showToast]);

    const handleRemoveItemFromShelf = useCallback((itemUniqueId) => {
        updateState(state => {
            const shelfToClearIndex = state.shopShelves.findIndex(shelf => shelf.itemId === itemUniqueId); if (shelfToClearIndex === -1) return state; const itemToReturn = state.inventory.find(item => item.uniqueId === itemUniqueId); if (!itemToReturn) { state.shopShelves[shelfToClearIndex].itemId = null; return state; } itemToReturn.location = 'inventory'; state.shopShelves[shelfToClearIndex].itemId = null; showToast(`Предмет "${definitions.items[itemToReturn.itemKey].name}" убран с полки.`, "info"); return state;
        });
    }, [updateState, showToast]);

    const handleGenerateNewOrderInQueue = useCallback(() => {
        updateState(state => {
            if (state.orderQueue.length >= 10) return state;
            const hasEngravedItems = state.inventory.some(item => item.gravingLevel > 0);
            const collectorChance = 0.1;
            if (hasEngravedItems && Math.random() < collectorChance) {
                const collectorClient = definitions.clients.find(c => c.isCollector);
                const engravableItems = Object.keys(definitions.items).filter(id => { const item = definitions.items[id]; return item.hasInlaySlots && !item.isQuestRecipe && (!item.requiredSkill || state.purchasedSkills[item.requiredSkill]); });
                if (collectorClient && engravableItems.length > 0) {
                    const itemKey = engravableItems[Math.floor(Math.random() * engravableItems.length)];
                    const item = definitions.items[itemKey];
                    const totalProgress = item.components.reduce((sum, c) => sum + c.progress, 0);
                    const newOrder = { id: `order_${Date.now()}`, client: collectorClient, itemKey, rewards: { sparks: Math.max(1, Math.round(totalProgress * collectorClient.demands.reward)), matter: Math.max(1, Math.round((totalProgress * collectorClient.demands.reward) / 5)) }, componentProgress: {}, activeComponentId: item.components.find(c => !c.requires)?.id || item.components[0].id, spawnTime: Date.now(), timeToLive: definitions.gameConfig.orderTTL, factionId: null, isRisky: false, };
                    state.orderQueue.push(newOrder); showToast(`Появился редкий заказ от Коллекционера!`, 'crit'); return state;
                } }
            const now = Date.now(); const orderTTL = definitions.gameConfig.orderTTL; const availableItemsForOrders = Object.keys(definitions.items).filter(id => { const item = definitions.items[id]; if (state.isShopLocked && !item.isQuestRecipe) return false; return !item.isQuestRecipe && (!item.requiredSkill || state.purchasedSkills[item.requiredSkill]); }); if (availableItemsForOrders.length === 0) return state; let itemKey; let client; let isRiskyOrder = false; const riskyChance = state.isShopLocked ? 0.7 : 0.1; if (Math.random() < riskyChance && state.sparks > 1000) { const riskyClients = definitions.clients.filter(c => c.isRisky); if (riskyClients.length > 0) { client = riskyClients[Math.floor(Math.random() * riskyClients.length)]; const complexItems = availableItemsForOrders.filter(id => definitions.items[id].components.length > 2); itemKey = complexItems.length > 0 ? complexItems[Math.floor(Math.random() * complexItems.length)] : availableItemsForOrders[Math.floor(Math.random() * availableItemsForOrders.length)]; isRiskyOrder = true; } } if (!client) { client = definitions.clients.find(c => !c.isCollector && !c.isRisky) || definitions.clients[0]; itemKey = availableItemsForOrders[Math.floor(Math.random() * availableItemsForOrders.length)]; } const item = definitions.items[itemKey]; const totalProgress = item.components.reduce((sum, c) => sum + c.progress, 0); let factionId = null; const totalReputation = Object.values(state.reputation).reduce((sum, rep) => sum + rep, 0); const factionOrderChance = (state.purchasedSkills.guildContracts ? 0.2 : 0.05) + (totalReputation / 20000); const minFactionRepLevel = definitions.reputationLevels.find(l => l.id === 'neutrality').threshold; if (!isRiskyOrder && Math.random() < factionOrderChance) { const currentEvent = state.market.worldEvent; const conflictingFactions = currentEvent.type === 'faction_conflict' ? currentEvent.conflictingFactions : []; const availableFactions = Object.keys(definitions.factions).filter(fid => state.reputation[fid] >= minFactionRepLevel && !conflictingFactions.includes(fid)); if (availableFactions.length > 0) { const weightedFactions = availableFactions.flatMap(fid => Array(Math.max(1, Math.floor(state.reputation[fid] / minFactionRepLevel))).fill(fid)); factionId = weightedFactions[Math.floor(Math.random() * weightedFactions.length)]; const factionRepLevel = getReputationLevel(state.reputation[factionId]); if (factionRepLevel.id === 'honor' || factionRepLevel.id === 'exalted') { const advancedItems = availableItemsForOrders.filter(id => definitions.items[id].requiredSkill && definitions.items[id].requiredSkill !== 'basicForging'); if (advancedItems.length > 0) itemKey = advancedItems[Math.floor(Math.random() * advancedItems.length)]; } } } const newOrder = { id: `order_${Date.now()}`, client, itemKey, rewards: { sparks: Math.max(1, Math.round(totalProgress * client.demands.reward * (isRiskyOrder ? 2.5 : 1.0))), matter: Math.max(1, Math.round((totalProgress * client.demands.reward * (isRiskyOrder ? 2.5 : 1.0)) / 10)) }, componentProgress: {}, activeComponentId: item.components.find(c => !c.requires)?.id || item.components[0].id, spawnTime: now, timeToLive: definitions.gameConfig.orderTTL, factionId: factionId, isRisky: isRiskyOrder, }; state.orderQueue.push(newOrder); if (isRiskyOrder) { showToast(`Поступил рискованный заказ от "${client.name}"!`, 'crit'); } else if (factionId) { showToast(`Поступил заказ от фракции "${definitions.factions[factionId].name}"!`, 'faction'); } else { showToast(`Поступил новый заказ от "${client.name}"!`, 'info'); } return state;
        });
    }, [updateState, showToast]);

    const handleAcceptOrder = useCallback((orderId) => {
        updateState(state => {
            if (state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving) { showToast("Вы уже заняты другим проектом!", 'error'); return state; }
            const orderIndex = state.orderQueue.findIndex(o => o.id === orderId);
            if (orderIndex === -1) return state;
            const [orderToAccept] = state.orderQueue.splice(orderIndex, 1);
            if (orderToAccept.isRisky) { const now = Date.now(); const randomPenaltyType = Math.random(); if (randomPenaltyType < 0.5) { const penaltySparks = Math.floor(orderToAccept.rewards.sparks * (0.2 + Math.random() * 0.3)); state.sparks = Math.max(0, state.sparks - penaltySparks); showToast(`Рискованный заказ: Вы потеряли ${formatNumber(penaltySparks)} искр!`, 'error'); } else if (randomPenaltyType < 0.8) { const lockDuration = 60 * (1 + Math.random() * 2); state.isShopLocked = true; state.shopLockEndTime = now + lockDuration * 1000; showToast(`Рискованный заказ: Ваш магазин заблокирован на ${Math.round(lockDuration)} сек.!`, 'error'); } else { const penaltyDuration = 30 * (1 + Math.random() * 1); state.progressPerClick = Math.max(1, state.progressPerClick - 1); setTimeout(() => updateState(s => { s.progressPerClick += 1; showToast("Инструмент починен, прогресс восстановлен!", "info"); return s; }), penaltyDuration * 1000); showToast(`Рискованный заказ: Ваш инструмент поврежден, прогресс снижен!`, 'error'); } }
            orderToAccept.startTime = Date.now();
            orderToAccept.timeLimits = { gold: (definitions.items[orderToAccept.itemKey].components.reduce((sum, c) => sum + c.progress, 0) / 2) * state.timeLimitModifier, silver: definitions.items[orderToAccept.itemKey].components.reduce((sum, c) => sum + c.progress, 0) * state.timeLimitModifier };
            state.activeOrder = orderToAccept;
            state.masteryXP = (state.masteryXP || 0) + Math.max(1, Math.floor((definitions.items[orderToAccept.itemKey].components.reduce((sum, c) => sum + c.progress, 0) * 0.05)));
            showToast("Заказ принят в работу!", "info");
            return state;
        });
    }, [updateState, showToast]);

    const handleStartFreeCraft = useCallback((itemKey) => {
        updateState(state => {
            if (state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving) { showToast("Вы уже заняты другим проектом!", 'error'); return state; }
            const item = definitions.items[itemKey];
            if (!item) return state;
            if (state.isFirstPlaythrough && item.firstPlaythroughLocked) {
                showToast(`Этот предмет доступен для создания только после первого Переселения!`, "error");
                return state;
            }
            state.activeFreeCraft = { itemKey, componentProgress: {}, activeComponentId: item.components.find(c => !c.requires)?.id || item.components[0].id, };
            showToast(`Начато создание предмета: ${item.name}`, "info");
            return state;
        });
    }, [updateState, showToast]);

    const handleStartReforge = useCallback((itemUniqueId) => {
        const state = gameStateRef.current;
        const baseRisk = 0.15;
        const riskModifier = state.riskModifier || 1.0;
        const finalRiskPercent = (baseRisk * riskModifier * 100).toFixed(0);
        let confirmationMessage = "Перековка — рискованный процесс, который может ухудшить качество предмета. Продолжить?";
        if (state.purchasedSkills.riskAssessment) {
            confirmationMessage = `Перековка рискованна! Шанс неудачи: ${finalRiskPercent}%. Продолжить?`;
        }
        if (window.confirm(confirmationMessage)) {
            updateState(state => {
                if (state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving) { showToast("Вы уже заняты другим проектом!", 'error'); return state; }
                const item = state.inventory.find(i => i.uniqueId === itemUniqueId);
                if (!item) { showToast("Предмет для перековки не найден!", 'error'); return state; }

                const reforgeCost = definitions.items[item.itemKey].reforgeCost || { sparks: 500 };
                if (!canAffordAndPay(state, reforgeCost, showToast)) {
                    return state;
                }

                state.activeReforge = { itemUniqueId: itemUniqueId, progress: 0, requiredProgress: 250 };
                showToast(`Начата перековка предмета: ${definitions.items[item.itemKey].name}`, "info");
                return state;
            });
        }
    }, [updateState, showToast, gameStateRef, canAffordAndPay]);

    const handleStartInlay = useCallback((itemUniqueId, gemType) => {
        const state = gameStateRef.current;
        const baseRisk = 0.10;
        const riskModifier = state.riskModifier || 1.0;
        const finalRiskPercent = (baseRisk * riskModifier * 100).toFixed(0);
        let confirmationMessage = "Инкрустация — рискованный процесс. В случае неудачи самоцвет будет утерян. Продолжить?";
        if (state.purchasedSkills.riskAssessment) {
            confirmationMessage = `Инкрустация рискованна! Шанс утери самоцвета: ${finalRiskPercent}%. Продолжить?`;
        }
        if (window.confirm(confirmationMessage)) {
            updateState(state => {
                if (state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving) { showToast("Вы уже заняты другим проектом!", 'error'); return state; }
                const item = state.inventory.find(i => i.uniqueId === itemUniqueId);
                if (!item) { showToast("Предмет для инкрустации не найден!", 'error'); return state; }

                const inlayCost = definitions.items[item.itemKey].inlayCost || { gem: 1 };
                const actualInlayCost = { [gemType]: 1 };
                if (!canAffordAndPay(state, actualInlayCost, showToast)) {
                    return state;
                }

                state.activeInlay = { itemUniqueId: itemUniqueId, gemType: gemType, progress: 0, requiredProgress: 150 };
                showToast(`Начата инкрустация предмета: ${definitions.items[item.itemKey].name}`, "info");
                return state;
            });
        }
    }, [updateState, showToast, gameStateRef, canAffordAndPay]);

    const handleStartGraving = useCallback((itemUniqueId) => {
        const state = gameStateRef.current;
        const baseRisk = 0.05;
        const riskModifier = state.riskModifier || 1.0;
        const finalRiskPercent = (baseRisk * riskModifier * 100).toFixed(0);
        let confirmationMessage = "Гравировка требует точности и может не получиться с первого раза. Продолжить?";
         if (state.purchasedSkills.riskAssessment) {
            confirmationMessage = `Гравировка рискованна! Шанс неудачи: ${finalRiskPercent}%. Продолжить?`;
        }
        if (window.confirm(confirmationMessage)) {
            updateState(state => {
                if (state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving) { showToast("Вы уже заняты другим проектом!", 'error'); return state; }
                const item = state.inventory.find(i => i.uniqueId === itemUniqueId);
                if (!item) { showToast("Предмет для гравировки не найден!", 'error'); return state; }

                const gravingCost = definitions.items[item.itemKey].gravingCost || { matter: 200 };
                if (!canAffordAndPay(state, gravingCost, showToast)) {
                    return state;
                }

                state.activeGraving = { itemUniqueId: itemUniqueId, progress: 0, requiredProgress: 200 };
                showToast(`Начата гравировка предмета: ${definitions.items[item.itemKey].name}`, "info");
                return state;
            });
        }
    }, [updateState, showToast, gameStateRef, canAffordAndPay]);

    const handleMineOre = useCallback((oreType) => {
        updateState(state => {
            const now = Date.now();
            const minTimeBetweenClicks = 50;
            if (now - state.lastClickTime < minTimeBetweenClicks) { return state; }
            state.lastClickTime = now;
            const region = definitions.regions[state.currentRegion];
            const miningModifier = region?.modifiers?.miningSpeed?.[oreType] || 1.0;
            const amountGained = state.orePerClick * miningModifier;
            state[oreType] = (state[oreType] || 0) + amountGained;
            showToast(`Добыто: +${formatNumber(amountGained)} ед. ${oreType.replace('Ore', ' руды')}!`, 'success');
            return state;
        });
    }, [updateState, showToast]);

    const handleSmelt = useCallback((recipeId) => { updateState(state => { if (state.smeltingProcess) { showToast("Плавильня уже занята!", 'error'); return state; } const recipe = definitions.recipes[recipeId]; if (!recipe) return state; const inputResource = Object.keys(recipe.input)[0]; let cost = recipe.input[inputResource]; if (recipeId === 'iron' && state.purchasedSkills.efficientBellows) cost = Math.max(1, cost - 2); if (recipeId === 'copper' && state.purchasedSkills.crucibleRefinement) cost = Math.max(1, cost - 2); if (state[inputResource] < cost) { showToast(`Недостаточно: ${inputResource} (${formatNumber(cost)} требуется)!`, 'error'); return state; } if (recipe.requiredSkill && !state.purchasedSkills[recipe.requiredSkill]) { const skillName = definitions.skills[recipe.requiredSkill]?.name || "неизвестный навык"; showToast(`Требуется навык: '${skillName}'!`, 'error'); return state; } state[inputResource] -= cost; state.smeltingProcess = { recipeId, progress: 0 }; showToast(`Плавка: ${recipe.name} началась!`, 'info'); return state; }); }, [updateState, showToast]);

    const handleForgeAlloy = useCallback((recipeId) => { updateState(state => { const recipe = definitions.recipes[recipeId]; if (!recipe || state.smeltingProcess) return state; if (recipe.requiredSkill && !state.purchasedSkills[recipe.requiredSkill]) { showToast(`Требуется навык: '${definitions.skills[recipe.requiredSkill]?.name}'!`, 'error'); return state; } if (!canAffordAndPay(state, recipe.input, showToast)) { return state; } const outputResource = Object.keys(recipe.output)[0]; state[outputResource] += recipe.output[outputResource]; showToast(`✨ Сплав создан: +${formatNumber(recipe.output[outputResource])} ${outputResource.replace('Ingots', ' слитков')}!`, 'success'); return state; }); }, [updateState, showToast, canAffordAndPay]);

    const handleBuyResource = useCallback((resourceId, unitCost, amount) => {
        updateState(state => {
            const totalCost = unitCost * amount;
            const costs = { sparks: totalCost };
            if (!canAffordAndPay(state, costs, showToast)) {
                return state;
            }
            state[resourceId] = (state[resourceId] || 0) + amount;
            showToast(`Куплено: +${formatNumber(amount)} ${resourceId.replace('Ore', ' руды').replace('Ingots', ' слитка')} за ${formatNumber(totalCost)} искр!`, 'success');
            return state;
        });
    }, [updateState, showToast, canAffordAndPay]);

    const handleSellResource = useCallback((resourceId, unitPrice, amount) => {
        updateState(state => {
            if (!state[resourceId] || state[resourceId] < amount) {
                showToast("Недостаточно для продажи!", 'error');
                return state;
            }
            const totalPrice = unitPrice * amount;
            state[resourceId] -= amount;
            state.sparks += totalPrice;
            showToast(`Продано: -${formatNumber(amount)} ${resourceId.replace('Ore', ' руды').replace('Ingots', ' слитка')} (+${formatNumber(totalPrice)} Искр)!`, 'success');
            return state;
        });
    }, [updateState, showToast]);

    const handleBuySpecialItem = useCallback((itemId) => {
        updateState(state => {
            const item = definitions.specialItems[itemId];
            if (!item) return state;
            if (item.requiredFaction && !hasReputation(state.reputation, item.requiredFaction, item.requiredRep)) { showToast("Недостаточная репутация!", 'error'); return state; }
            if (item.requiredSkill && !state.purchasedSkills[item.requiredSkill]) { showToast("Требуется навык для покупки этого чертежа!", 'error'); return state; }
            if (!canAffordAndPay(state, item.cost, showToast)) {
                return state;
            }
            state.specialItems[itemId] = (state.specialItems[itemId] || 0) + 1; showToast(`Куплено: ${item.name}!`, 'success'); Object.keys(state.artifacts).forEach(artId => { const artifact = state.artifacts[artId]; const allObtained = Object.values(artifact.components).every(comp => state.specialItems[comp.itemId] > 0); if (allObtained && artifact.status === 'locked') { artifact.status = 'available'; showToast(`Все компоненты для артефакта "${definitions.greatArtifacts[artId].name}" собраны!`, 'levelup'); } }); return state;
        });
    }, [updateState, showToast, canAffordAndPay]);

    const handleInvest = useCallback(() => {
        updateState(state => {
            const cost = 25000;
            if (state.investments.merchants) return state;
            if (!canAffordAndPay(state, {sparks: cost}, showToast)) { return state; }
            state.investments.merchants = true; showToast("Инвестиция в торговые пути сделана!", 'success'); return state;
        });
    }, [updateState, showToast, canAffordAndPay]);

    const handleBuyUpgrade = useCallback((upgradeId, type = 'upgrades', amount = 1) => {
        updateState(state => {
            const upgradeDefs = definitions[type] || definitions.upgrades;
            const upgrade = upgradeDefs[upgradeId];
            if (!upgrade) return state;
            let level = state.upgradeLevels[upgradeId] || 0;
            const isMultiLevel = 'isMultiLevel' in upgrade && upgrade.isMultiLevel;
            if (!isMultiLevel && level > 0) { showToast(`Улучшение "${upgrade.name}" уже куплено!`, 'error'); return state; }
            if (isMultiLevel && level >= upgrade.maxLevel) { showToast(`Улучшение "${upgrade.name}" уже на максимальном уровне!`, 'error'); return state; }
            if (type === 'shopUpgrades' && upgrade.requiredShopReputation && state.shopReputation < upgrade.requiredShopReputation) { showToast(`Недостаточно репутации магазина (${upgrade.requiredShopReputation} требуется)!`, 'error'); return state; }

            const totalCosts = {};
            if (isMultiLevel) {
                const baseCosts = upgrade.baseCost;
                for (let i = 0; i < amount; i++) {
                    if (level + i < upgrade.maxLevel) {
                        for (const resourceType in baseCosts) {
                            totalCosts[resourceType] = (totalCosts[resourceType] || 0) + Math.floor(baseCosts[resourceType] * Math.pow(upgrade.costIncrease, level + i));
                        }
                    } else {
                        amount = i;
                        break;
                    }
                }
            } else {
                for (const resourceType in upgrade.cost) {
                    totalCosts[resourceType] = upgrade.cost[resourceType];
                }
            }

            if (amount === 0 || !canAffordAndPay(state, totalCosts, showToast)) {
                return state;
            }

            state.upgradeLevels[upgradeId] = (state.upgradeLevels[upgradeId] || 0) + amount;
            if (upgrade.id === 'inventoryExpansion') { state.inventoryCapacity += 2 * amount; }
            else if (upgrade.id === 'shopShelfExpansion') { for(let i=0; i < amount; i++) state.shopShelves.push({ itemId: null, customer: null, saleProgress: 0, saleTimer: 0 }); }

            recalculateAllModifiers(state);

            showToast(`Улучшение "${upgrade.name}" куплено! (x${amount})`, 'success'); return state;
        });
    }, [updateState, showToast, recalculateAllModifiers, canAffordAndPay]);

    const handleCraftArtifact = useCallback((artifactId) => {
        updateState(state => {
            if (state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving) { showToast("Вы уже заняты другим проектом!", 'error'); return state; }
            const artifact = state.artifacts[artifactId];
            const artifactDef = definitions.greatArtifacts[artifactId];

            if (artifact.status !== 'available') { showToast("Артефакт не готов к созданию.", 'error'); return state; }

            const epicCost = definitions.greatArtifacts[artifactId].epicOrder[0].cost;
            if (epicCost && !canAffordAndPay(state, epicCost, showToast)) {
                return state;
            }

            state.currentEpicOrder = { artifactId, currentStage: 1, progress: 0 };
            showToast(`Вы приступаете к созданию шедевра: ${definitions.greatArtifacts[artifactId].name}!`, 'levelup');
            return state;
        });
    }, [updateState, showToast, canAffordAndPay]);

    const handleStartQuest = useCallback((questId) => {
        updateState(state => { const questIndex = state.journal.availableQuests.indexOf(questId); if (questIndex > -1) { const questDef = definitions.quests[questId]; state.journal.availableQuests.splice(questIndex, 1); state.journal.activeQuests.push({ id: questId }); showToast(`Задание "${questDef.title}" принято!`, 'info'); } return state; });
    }, [updateState, showToast]);

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

            const prestigePointsEarned = Math.floor((currentMasteryXP / 1000) + (currentMasteryLevel * 10));

            gameStateRef.current.prestigePoints = (state.prestigePoints || 0) + prestigePointsEarned;
            gameStateRef.current.regionsVisited = [...(state.regionsVisited || []), currentRegionId];
            gameStateRef.current.isFirstPlaythrough = false;

            showToast(`Переселение начинается! Вы заработали ${formatNumber(prestigePointsEarned)} Осколков Памяти.`, 'levelup');
            setIsWorldMapModalOpen(true);
            return state;
        });
    }, [updateState, showToast, gameStateRef, setIsWorldMapModalOpen]);

    const handleSelectRegion = useCallback((regionId) => {
        const newState = JSON.parse(JSON.stringify(initialGameState));

        newState.prestigePoints = gameStateRef.current.prestigePoints;
        newState.regionsVisited = gameStateRef.current.regionsVisited;
        newState.isFirstPlaythrough = gameStateRef.current.isFirstPlaythrough;
        newState.eternalSkills = gameStateRef.current.eternalSkills;
        newState.artifacts = JSON.parse(JSON.stringify(gameStateRef.current.artifacts));
        newState.settings = JSON.parse(JSON.stringify(gameStateRef.current.settings));

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

        newState.purchasedSkills = {};

        recalculateAllModifiers(newState);

        try {
            localStorage.setItem('forgeAndArtifacts_v10', JSON.stringify(newState));
            showToast(`Новая мастерская основана в регионе "${selectedRegionDef.name}"!`, 'levelup');
            window.location.reload();
        } catch (e) {
            console.error("Failed to save new game state after settlement:", e);
            showToast("Ошибка при сохранении нового поселения!", "error");
        }
    }, [showToast, gameStateRef, initialGameState, recalculateAllModifiers]);

    const handleBuyEternalSkill = useCallback((skillId) => {
        updateState(state => {
            if (state.isFirstPlaythrough) {
                showToast("Вечные навыки можно покупать только после первого Переселения!", "error");
                return state;
            }

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
    }, [updateState, showToast, recalculateAllModifiers]);


    return useMemo(() => {
        return {
            handleCloseInfoModal,
            handleCloseWorldMapModal,
            handleCloseAchievementRewardModal,
            handleClaimAchievementReward,
            handleOpenAvatarSelectionModal,
            handleCloseAvatarSelectionModal, // <-- ВОЗВРАЩАЕМ НОВУЮ ФУНКЦИЮ
            handleSelectAvatar,
            handleOpenCreditsModal, // <-- ВОЗВРАЩАЕМ НОВУЮ ФУНКЦИЮ
            handleCloseCreditsModal, // <-- ВОЗВРАЩАЕМ НОВУЮ ФУНКЦИЮ
            handleSelectRegion,
            checkForNewQuests: (state) => checkForNewQuests(state, showToast),
            handleBuySkill,
            handleSelectSpecialization,
            handleBuyFactionUpgrade,
            handleVolumeChange,
            handleMoveItemToShelf,
            handleRemoveItemFromShelf,
            handleGenerateNewOrderInQueue,
            handleAcceptOrder,
            handleStartFreeCraft,
            handleMineOre,
            handleSmelt,
            handleForgeAlloy,
            handleBuyResource,
            handleSellResource,
            handleBuySpecialItem,
            handleInvest,
            handleBuyUpgrade,
            handleCraftArtifact,
            handleStartReforge,
            handleStartInlay,
            handleStartGraving,
            handleStartQuest,
            handleResetGame,
            handleStartMission,
            handleClickSale,
            handleStartNewSettlement,
            handleBuyEternalSkill,
            applyProgress: (progressAmount) => updateState(state => coreHandlers.applyProgress(state, progressAmount)),
            handleStrikeAnvil: () => updateState(coreHandlers.handleStrikeAnvil),
            handleSelectComponent: (componentId) => updateState(state => coreHandlers.handleSelectComponent(state, componentId)),
            handleSelectWorkstation: (workstationId) => updateState(state => coreHandlers.handleSelectWorkstation(state, workstationId)),
            handleCloseRewardModal: coreHandlers.handleCloseRewardModal,
        };
    }, [
        handleCloseInfoModal, handleCloseWorldMapModal, handleCloseAchievementRewardModal, handleClaimAchievementReward, handleOpenAvatarSelectionModal, handleCloseAvatarSelectionModal, handleSelectAvatar, handleOpenCreditsModal, handleCloseCreditsModal, showToast, updateState, canAffordAndPay,
        handleBuySkill, handleSelectSpecialization, handleBuyFactionUpgrade,
        handleVolumeChange, handleMoveItemToShelf, handleRemoveItemFromShelf,
        handleGenerateNewOrderInQueue, handleAcceptOrder, handleStartFreeCraft,
        handleMineOre, handleSmelt, handleForgeAlloy, handleBuyResource,
        handleSellResource, handleBuySpecialItem, handleInvest, handleBuyUpgrade,
        handleCraftArtifact, handleStartReforge, handleStartInlay,
        handleStartGraving, handleStartQuest, handleResetGame, handleStartMission,
        handleClickSale, handleStartNewSettlement, handleBuyEternalSkill, coreHandlers, recalculateAllModifiers, setIsSpecializationModalOpen, gameStateRef
    ]);
}
// src/hooks/useQuestAndMissionHandlers.js
import { useCallback, useMemo } from 'react';
import { definitions } from '../data/definitions/index.js';
import { audioController } from '../utils/audioController';
import { formatNumber } from '../utils/formatters.jsx';
import { handleCompleteMission as completeMissionLogic } from '../logic/gameCompletions'; // Renamed to avoid conflict
import { checkForNewQuests } from '../utils/gameEventChecks';
import { canAffordAndPay } from '../utils/gameUtils'; // <--- НОВЫЙ ИМПОРТ

export const useQuestAndMissionHandlers = ({ updateState, showToast }) => { // <--- УДАЛЕН canAffordAndPay

    const handleStartQuest = useCallback((questId) => {
        updateState(state => { const questIndex = state.journal.availableQuests.indexOf(questId); if (questIndex > -1) { const questDef = definitions.quests[questId]; state.journal.availableQuests.splice(questIndex, 1); state.journal.activeQuests.push({ id: questId }); showToast(`Задание "${questDef.title}" принято!`, 'info'); } return state; });
    }, [updateState, showToast]);

    const handleStartMission = useCallback((missionId, committedGear) => {
        updateState(state => {
            const missionDef = definitions.missions[missionId];
            if (!missionDef) { showToast("Ошибка: миссия не найдена!", "error"); return state; }

            const tempInventory = [...state.inventory];
            let canCommitAll = true;
            for (const uniqueReqKey in committedGear) {
                const itemUniqueId = committedGear[uniqueReqKey];
                const itemIndex = tempInventory.findIndex(item => item.uniqueId === itemUniqueId);
                if (itemIndex === -1) {
                    canCommitAll = false;
                    break;
                }
                tempInventory.splice(itemIndex, 1);
            }

            if (!canCommitAll) {
                showToast("Не удалось найти все необходимые предметы в инвентаре!", "error");
                return state;
            }

            let totalQualityBonus = 0;
            const newInventory = state.inventory.filter(item => {
                if (Object.values(committedGear).includes(item.uniqueId)) {
                    const requirement = missionDef.requiredGear.find(req => req.itemKey === item.itemKey);
                    if(requirement) { totalQualityBonus += Math.max(0, item.quality - (requirement.minQuality - (state.missionMinQualityReduction || 0))); }
                    return false;
                }
                return true;
            });
            state.inventory = newInventory;
            const newActiveMission = { id: `${Date.now()}_${Math.random()}`, missionId: missionId, startTime: Date.now(), duration: missionDef.duration, qualityBonus: totalQualityBonus, };
            state.activeMissions.push(newActiveMission);
            showToast(`Экспедиция "${missionDef.name}" отправлена!`, "info");
            audioController.play('complete', 'D4', '8n');
            return state;
        });
    }, [updateState, showToast]);

    const memoizedCheckForNewQuests = useCallback((state, toast) => checkForNewQuests(state, toast), []);


    return useMemo(() => ({
        handleStartQuest,
        handleStartMission,
        checkForNewQuests: memoizedCheckForNewQuests,
    }), [
        handleStartQuest,
        handleStartMission,
        memoizedCheckForNewQuests,
    ]);
};
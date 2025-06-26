// src/hooks/usePersonnelHandlers.js
import { useCallback, useMemo } from 'react';
import { definitions } from '../data/definitions/index.js';
import { formatNumber } from '../utils/formatters.jsx';
import { recalculateAllModifiers } from '../utils/gameStateUtils';
import { audioController } from '../utils/audioController';
import { gameConfig as GAME_CONFIG } from '../constants/gameConfig';
import { v4 as uuidv4 } from 'uuid';
import { generatePersonnelOffer } from '../logic/gameLogic';
import { canAffordAndPay } from '../utils/gameUtils';

export const usePersonnelHandlers = ({ updateState, showToast, setIsHirePersonnelModalOpen }) => {

    const handleGeneratePersonnelOffers = useCallback(() => {
        updateState(state => {
            const now = Date.now();
            const timeSinceLastRoll = (now - state.lastPersonnelOfferRollTime) / (1000 * 60);

            const isFreeReroll = state.personnelRollCount === 0 || timeSinceLastRoll >= GAME_CONFIG.PERSONNEL_OFFER_REFRESH_INTERVAL_MINUTES;

            if (!isFreeReroll) {
                let currentRollCost = { ...GAME_CONFIG.personnelRollCost };
                if (state.personnelRollCostReduction) {
                    for (const res in currentRollCost) {
                        currentRollCost[res] = Math.max(1, Math.floor(currentRollCost[res] * (1 - state.personnelRollCostReduction)));
                    }
                }
                for (const res in currentRollCost) {
                     currentRollCost[res] = Math.floor(currentRollCost[res] * Math.pow(GAME_CONFIG.PERSONNEL_OFFER_ROLL_COST_MULTIPLIER, state.personnelRollCount - 1));
                }

                if (!canAffordAndPay(state, currentRollCost, showToast)) {
                    return state;
                }
            } else {
                state.personnelRollCount = 0;
            }

            state.personnelOffers = [];
            for (let i = 0; i < 3; i++) {
                const newOffer = generatePersonnelOffer(state);
                if (newOffer) {
                    state.personnelOffers.push(newOffer);
                }
            }
            state.lastPersonnelOfferRollTime = now;
            state.personnelRollCount += 1;

            showToast("Предложения обновлены!", "info");
            audioController.play('cash', 'D5', '16n');
            return state;
        });
    }, [updateState, showToast]);

    const handleHirePersonnel = useCallback((offerUniqueId) => {
        updateState(state => {
            const offerIndex = state.personnelOffers.findIndex(o => o.uniqueId === offerUniqueId);
            if (offerIndex === -1) return state;

            const offer = state.personnelOffers[offerIndex];
            const personnelDef = definitions.personnel[offer.personnelId];

            if (state.personnelSlots.used >= state.personnelSlots.total) {
                showToast("Нет свободных слотов для персонала!", "error");
                return state;
            }
            const hiredOfTypeCount = state.hiredPersonnel.filter(p => p.personnelId === personnelDef.id).length;
            if (hiredOfTypeCount >= personnelDef.maxQuantity) {
                showToast(`Вы уже наняли максимальное количество ${personnelDef.name} (${personnelDef.maxQuantity})!`, "error");
                return state;
            }
            if (personnelDef.requiredSkill && !state.purchasedSkills[personnelDef.requiredSkill]) {
                showToast(`Требуется навык: ${definitions.skills[personnelDef.requiredSkill]?.name}!`, "error");
                return state;
            }

            const totalHireCost = offer.hireCost;
            const totalFirstWage = offer.wage;

            const combinedCosts = { ...totalHireCost };
            for (const res in totalFirstWage) {
                combinedCosts[res] = (combinedCosts[res] || 0) + (totalFirstWage[res] || 0);
            }

            if (!canAffordAndPay(state, combinedCosts, showToast)) {
                return state;
            }

            const newPersonnel = {
                uniqueId: uuidv4(),
                personnelId: offer.personnelId,
                name: offer.name || personnelDef.name,
                level: offer.level,
                xp: offer.xp,
                xpToNextLevel: offer.xpToNextLevel,
                mood: offer.mood,
                wage: offer.wage,
                previousAssignment: null,
                isResting: false,
                restEndTime: 0,
            };

            state.hiredPersonnel.push(newPersonnel);
            state.personnelOffers.splice(offerIndex, 1);
            state.personnelSlots.used += 1;

            showToast(`Нанят новый сотрудник: ${newPersonnel.name} (Ур. ${newPersonnel.level})!`, 'success');
            audioController.play('levelup', 'E5', '8n');
            recalculateAllModifiers(state);

            return state;
        });
    }, [updateState, showToast]);

    const handleFirePersonnel = useCallback((personnelUniqueId) => {
        if (!window.confirm("Вы уверены, что хотите уволить этого сотрудника? Он не вернется в список предложений сразу!")) {
            return;
        }
        updateState(state => {
            const personnelIndex = state.hiredPersonnel.findIndex(p => p.uniqueId === personnelUniqueId);
            if (personnelIndex === -1) return state;

            const [firedPersonnel] = state.hiredPersonnel.splice(personnelIndex, 1);
            delete state.personnelAssignment[firedPersonnel.uniqueId];
            state.personnelSlots.used -= 1;

            state.personnelRestCooldowns[firedPersonnel.uniqueId] = Date.now() + GAME_CONFIG.PERSONNEL_SLOT_COOLDOWN_SECONDS * 1000;

            showToast(`Сотрудник ${firedPersonnel.name} уволен. Слот заблокирован на 10 минут.`, 'error');
            recalculateAllModifiers(state);
            return state;
        });
    }, [updateState, showToast]);

    const handleAssignPersonnel = useCallback((personnelUniqueId, role, assignment = null) => {
        updateState(state => {
            const personnel = state.hiredPersonnel.find(p => p.uniqueId === personnelUniqueId);
            if (!personnel) {
                showToast("Сотрудник не найден!", "error");
                return state;
            }

            if (personnel.isResting) {
                showToast("Сотрудник отдыхает и не может быть назначен!", "error");
                return state;
            }

            delete state.personnelAssignment[personnelUniqueId];

            if (assignment === null || assignment === 'unassigned') {
                showToast(`${personnel.name} снят(а) с работы.`, 'info');
            } else {
                if (role === 'trader') {
                    const isShelfTaken = Object.values(state.personnelAssignment).some(
                        a => a.role === 'trader' && a.assignment === assignment
                    );
                    if (isShelfTaken) {
                        showToast(`Полка ${parseInt(assignment.split('_')[1]) + 1} уже занята другим торговцем!`, "error");
                        return state;
                    }
                }
                
                state.personnelAssignment[personnelUniqueId] = { role: role, assignment: assignment };
                
                let assignmentName = assignment;
                if (role === 'miner') assignmentName = definitions.resources[assignment]?.name || assignment;
                else if (role === 'trader') assignmentName = `Полка ${parseInt(assignment.split('_')[1]) + 1}`;
                else if (role === 'smelter') assignmentName = `Плавильня`;
                else assignmentName = role;

                showToast(`${personnel.name} назначен(а) на: ${assignmentName}!`, 'success');
            }
            
            recalculateAllModifiers(state);
            return state;
        });
    }, [updateState, showToast]);

    const handlePersonnelLevelUp = useCallback((personnelUniqueId, levelUpCost) => {
        updateState(state => {
            const personnel = state.hiredPersonnel.find(p => p.uniqueId === personnelUniqueId);
            if (!personnel) return state;

            if (personnel.level >= GAME_CONFIG.PERSONNEL_MAX_LEVEL) {
                showToast("Сотрудник уже на максимальном уровне!", "error");
                return state;
            }
            if (personnel.xp < personnel.xpToNextLevel) {
                showToast("Недостаточно опыта для повышения уровня!", "error");
                return state;
            }

            if (!canAffordAndPay(state, levelUpCost, showToast)) {
                return state;
            }

            personnel.xp -= personnel.xpToNextLevel;
            personnel.level += 1;
            const personnelDef = definitions.personnel[personnel.personnelId];
            personnel.xpToNextLevel = Math.floor(personnel.xpToNextLevel * (personnelDef.xpToNextLevelMultiplier || 1.15));

            showToast(`${personnel.name} повысил(а) уровень до ${personnel.level}!`, 'levelup');
            audioController.play('levelup', 'C6', '8n');
            recalculateAllModifiers(state);
            return state;
        });
    }, [updateState, showToast]);

    const handlePersonnelAction = useCallback((personnelUniqueId, actionType, value = null) => {
        updateState(state => {
            const personnel = state.hiredPersonnel.find(p => p.uniqueId === personnelUniqueId);
            if (!personnel) return state;

            if (actionType === 'give_day_off') {
                if (personnel.isResting) { showToast("Сотрудник уже отдыхает!", "info"); return state; }
                
                personnel.previousAssignment = state.personnelAssignment[personnel.uniqueId] || null;
                delete state.personnelAssignment[personnel.uniqueId];

                personnel.isResting = true;
                personnel.restEndTime = Date.now() + GAME_CONFIG.PERSONNEL_AUTO_REST_DURATION_SECONDS * 1000;
                showToast(`${personnel.name} отправлен(а) на отдых.`, 'info');
            } else if (actionType === 'give_gift' && value) {
                const resourceCost = { [value]: 1 };
                if (!canAffordAndPay(state, resourceCost, showToast)) {
                    return state;
                }
                
                const pDef = definitions.personnel[personnel.personnelId];
                let moodBoost = 10 + Math.floor(Math.random() * 5);

                if (pDef.preferences?.love?.includes(value)) moodBoost = 30 + Math.floor(Math.random() * 10);
                else if (pDef.preferences?.like?.includes(value)) moodBoost = 20 + Math.floor(Math.random() * 5);
                else if (pDef.preferences?.dislike?.includes(value)) moodBoost = 2 + Math.floor(Math.random() * 3);

                personnel.mood = Math.min(100, personnel.mood + moodBoost);
                const resourceName = definitions.resources[value]?.name || definitions.specialItems[value]?.name || value;
                showToast(`Подарок (${resourceName}) вручен ${personnel.name}! Настроение улучшилось на ${moodBoost}%.`, 'success');
                audioController.play('levelup', 'A5', '8n');
            } else if (actionType === 'adjust_wage' && value !== null) {
                 const newWageSparks = parseInt(value.sparks, 10);
                 const newWageMatter = parseInt(value.matter, 10);

                 if (isNaN(newWageSparks) || newWageSparks < 0 || isNaN(newWageMatter) || newWageMatter < 0) { 
                     showToast("Неверное значение зарплаты.", "error"); 
                     return state; 
                 }

                 const pDef = definitions.personnel[personnel.personnelId];
                 let minWageSparks = pDef.baseWage.sparks || 0;
                 let minWageMatter = pDef.baseWage.matter || 0;

                 if (newWageSparks < minWageSparks || newWageMatter < minWageMatter) {
                     showToast(`Зарплата не может быть ниже базовой (${minWageSparks} искр, ${minWageMatter} материи).`, "error");
                     return state;
                 }
                 
                 const oldWageSparks = personnel.wage.sparks || 0;
                 personnel.wage.sparks = newWageSparks;
                 personnel.wage.matter = newWageMatter;

                 if (newWageSparks > oldWageSparks) {
                     const moodBoost = Math.min(25, Math.floor((newWageSparks / oldWageSparks - 1) * 50));
                     personnel.mood = Math.min(100, personnel.mood + moodBoost);
                     showToast(`Зарплата ${personnel.name} увеличена! Настроение улучшилось.`, "success");
                 } else {
                     showToast(`Зарплата ${personnel.name} изменена!`, "info");
                 }
            }
            
            recalculateAllModifiers(state);
            return state;
        });
    }, [updateState, showToast]);

    return useMemo(() => ({
        handleGeneratePersonnelOffers,
        handleHirePersonnel,
        handleFirePersonnel,
        handleAssignPersonnel,
        handlePersonnelLevelUp,
        handlePersonnelAction,
    }), [
        handleGeneratePersonnelOffers,
        handleHirePersonnel,
        handleFirePersonnel,
        handleAssignPersonnel,
        handlePersonnelLevelUp,
        handlePersonnelAction,
    ]);
};
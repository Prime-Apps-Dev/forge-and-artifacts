// src/hooks/useSkillAndFactionHandlers.js
import { useCallback, useMemo } from 'react';
import { definitions } from '../data/definitions/index.js';
import { hasReputation } from '../utils/helpers';
import { recalculateAllModifiers } from '../utils/gameStateUtils';
import { audioController } from '../utils/audioController';
import { checkForNewQuests } from '../utils/gameEventChecks';
import { canAffordAndPay } from '../utils/gameUtils'; // <--- НОВЫЙ ИМПОРТ

export const useSkillAndFactionHandlers = ({ updateState, showToast, setIsSpecializationModalOpen, gameStateRef }) => { // <--- УДАЛЕН canAffordAndPay

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
                }
            }
            if (!canAffordAndPay(state, currentCost, showToast)) { return state; }
            state.purchasedSkills[skillId] = true;
            recalculateAllModifiers(state);
            let toastMessage = `Навыг "${skill.name}" изучен!`;
            const isOffSpec = skill.requiredSpecialization && state.specialization && skill.requiredSpecialization !== state.specialization;
            if (isOffSpec) toastMessage += " (Вне специализации)";
            showToast(toastMessage, 'success');

            if (skillId === 'unlockTrader') { state.personnelSlots.unlockedRoles.trader = true; showToast(`Открыт найм Торговцев!`, 'levelup'); }
            else if (skillId === 'unlockManager') { state.personnelSlots.unlockedRoles.manager = true; showToast(`Открыт найм Управителей!`, 'levelup'); }
            else if (skillId === 'unlockEngineer') { state.personnelSlots.unlockedRoles.engineer = true; showToast(`Открыт найм Инженеров!`, 'levelup'); }
            else if (skillId === 'unlockAssistant') { state.personnelSlots.unlockedRoles.assistant = true; showToast(`Открыт найм Ассистентов!`, 'levelup'); }


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
            setTimeout(() => { updateState(state => { state.activeInfoModal = shouldOpenInfoModal; return state; }); }, 100);
        }
    }, [updateState, showToast, setIsSpecializationModalOpen, gameStateRef]);

    const handleSelectSpecialization = useCallback((specId) => {
        updateState(state => { if (state.specialization === null) { state.specialization = specId; showToast(`Вы выбрали путь Мастера-${definitions.specializations[specId].name}!`, 'levelup'); } return state; });
        setIsSpecializationModalOpen(false);
    }, [updateState, showToast, setIsSpecializationModalOpen]);

    const handleBuyFactionUpgrade = useCallback((upgradeId) => {
        updateState(state => {
            const upgrade = definitions.factionUpgrades[upgradeId];
            if (!upgrade || state.purchasedFactionUpgrades[upgradeId]) return state;
            if (!hasReputation(state.reputation, upgrade.factionId, upgrade.requiredRep)) { showToast("Недостаточно репутации!", 'error'); return state; }
            if (!canAffordAndPay(state, upgrade.cost, showToast)) { return state; }
            state.purchasedFactionUpgrades[upgradeId] = true;
            recalculateAllModifiers(state);
            showToast(`Улучшение "${upgrade.name}" приобретено!`, 'levelup');
            audioController.play('levelup', 'A4', '8n');
            return state;
        });
    }, [updateState, showToast]);

    return useMemo(() => ({
        handleBuySkill,
        handleSelectSpecialization,
        handleBuyFactionUpgrade,
    }), [
        handleBuySkill,
        handleSelectSpecialization,
        handleBuyFactionUpgrade,
    ]);
};
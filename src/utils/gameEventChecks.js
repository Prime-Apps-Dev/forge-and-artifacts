// src/utils/gameEventChecks.js
import { definitions } from '../data/definitions.js'; // Используем .js
import { hasReputation } from './helpers.js'; // Используем .js

/**
 * Проверяет наличие новых квестов, доступных для игрока.
 * Обновляет `state.journal.availableQuests` и вызывает `showToast` при обнаружении.
 * @param {object} state - Текущее игровое состояние.
 * @param {function} showToast - Функция для отображения уведомлений.
 */
export function checkForNewQuests(state, showToast) {
    Object.values(definitions.quests).forEach(quest => {
        // Проверяем, что квест ещё не в доступных, активных или завершенных
        if (state.journal.availableQuests.includes(quest.id) || 
            state.journal.activeQuests.some(activeQuest => activeQuest.id === quest.id) || 
            state.journal.completedQuests.includes(quest.id)) 
        {
            return;
        }

        const trigger = quest.trigger;
        let canStart = false;

        // Проверка условий триггера
        if (trigger.type === 'reputation' && hasReputation(state.reputation, trigger.factionId, trigger.level)) {
            canStart = true;
        } else if (trigger.type === 'skill' && state.purchasedSkills[trigger.skillId]) {
            canStart = true;
        } else if (trigger.type === 'quest' && state.journal.completedQuests.includes(trigger.questId)) {
            canStart = true;
        } 
        // Новые типы триггеров для квестов, основанные на счётчиках из gameState
        else if (trigger.type === 'totalSparks' && (state.totalSparksEarned || 0) >= trigger.count) {
            canStart = true;
        } else if (trigger.type === 'totalMatterSpent' && (state.totalMatterSpent || 0) >= trigger.count) {
            canStart = true;
        } else if (trigger.type === 'totalInlayed' && (state.totalInlayedItems || 0) >= trigger.count) {
            canStart = true;
        } else if (trigger.type === 'totalGraved' && (state.totalGravedItems || 0) >= trigger.count) {
            canStart = true;
        } else if (trigger.type === 'totalClicks' && (state.totalClicks || 0) >= trigger.count) {
            canStart = true;
        } else if (trigger.type === 'unique_items' && (new Set(state.inventory.map(item => item.itemKey)).size || 0) >= trigger.count) {
            canStart = true;
        } else if (trigger.type === 'totalOre' && ((state.ironOre || 0) + (state.copperOre || 0) + (state.mithrilOre || 0) + (state.adamantiteOre || 0)) >= trigger.count) {
            canStart = true;
        } else if (trigger.type === 'totalIngotsSmelted' && (state.totalIngotsSmelted || 0) >= trigger.count) {
            canStart = true;
        }
        // Триггеры, зависящие от достижений
        else if (trigger.type === 'achievement') {
            const achievementDef = definitions.achievements[trigger.achievementId];
            if (achievementDef && state.completedAchievements.includes(achievementDef.id)) {
                // Если достижение многоуровневое, проверяем конкретный уровень
                if (achievementDef.levels && trigger.level) {
                    const achievementStatus = achievementDef.check(state, definitions);
                    const currentLevelIndex = achievementDef.levels.findIndex(lvl => achievementStatus.current >= lvl.target) + 1;
                    if (currentLevelIndex >= trigger.level) {
                        canStart = true;
                    }
                } else {
                    // Если достижение одноуровневое или уровень не указан, достаточно его завершения
                    canStart = true;
                }
            }
        }


        if (canStart) {
            state.journal.availableQuests.push(quest.id);
            showToast(`Новое задание доступно в журнале!`, 'faction');
        }
    });
}
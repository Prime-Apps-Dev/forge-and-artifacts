// src/utils/gameEventChecks.js
import { definitions } from '../data/definitions/index.js';
import { hasReputation } from './helpers.js';

export function checkForNewQuests(state, showToast) {
    // Это максимально защитная проверка и инициализация.
    // Она гарантирует, что state.journal и его необходимые внутренние свойства
    // всегда будут массивами/объектами, даже если они каким-то образом приходят undefined/null.
    if (!state) {
        console.error("checkForNewQuests: 'state' не определен. Пропускаем проверку заданий.");
        return;
    }

    if (!state.journal) {
        // Если journal не определен/null, инициализируем его стандартной структурой.
        // Это восстановит объект journal на лету.
        state.journal = {
            availableQuests: [],
            activeQuests: [],
            completedQuests: [],
            unlockedRecipes: [], // Инициализируем и другие ожидаемые свойства
            questProgress: {}    // Инициализируем и другие ожидаемые свойства
        };
        console.warn("checkForNewQuests: 'state.journal' был не определен и инициализирован по умолчанию.");
    }

    // Дополнительные проверки, чтобы убедиться, что все массивы внутри journal также инициализированы,
    // даже если journal существовал, но его под-свойства были утеряны (менее вероятно, но для пуленепробиваемости).
    state.journal.availableQuests = state.journal.availableQuests || [];
    state.journal.activeQuests = state.journal.activeQuests || [];
    state.journal.completedQuests = state.journal.completedQuests || [];
    state.journal.unlockedRecipes = state.journal.unlockedRecipes || [];
    state.journal.questProgress = state.journal.questProgress || {};


    Object.values(definitions.quests).forEach(quest => {
        if (state.journal.availableQuests.includes(quest.id) ||
            state.journal.activeQuests.some(activeQuest => activeQuest.id === quest.id) ||
            state.journal.completedQuests.includes(quest.id))
        {
            return;
        }

        const trigger = quest.trigger;
        let canStart = false;

        // Проверка условий ТРИГГЕРА
        if (trigger.type === 'reputation' && hasReputation(state.reputation, trigger.factionId, trigger.level)) {
            canStart = true;
        } else if (trigger.type === 'skill' && state.purchasedSkills[trigger.skillId]) {
            canStart = true;
        } else if (trigger.type === 'quest' && state.journal.completedQuests.includes(trigger.questId)) {
            canStart = true;
        }
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
        else if (trigger.type === 'achievement') {
            const achievementDef = definitions.achievements[trigger.achievementId];
            if (achievementDef && state.completedAchievements.includes(achievementDef.id)) {
                if (achievementDef.levels && trigger.level) {
                    const achievementStatus = achievementDef.check(state, definitions);
                    const currentLevelIndex = achievementDef.levels.findIndex(lvl => achievementStatus.current >= lvl.target) + 1;
                    if (currentLevelIndex >= trigger.level) {
                        canStart = true;
                    }
                } else {
                    canStart = true;
                }
            }
        }
        else if (trigger.type === 'matter_spent' && (state.totalMatterSpent || 0) >= trigger.count) {
            canStart = true;
        }
        else if (trigger.type === 'artifact_completed' && state.artifacts[trigger.artifactId]?.status === 'completed') {
            canStart = true;
        }


        if (canStart) {
            state.journal.availableQuests.push(quest.id);
            showToast(`Новое задание доступно в журнале!`, 'faction');
        }
    });
}
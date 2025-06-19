import { definitions } from '../data/definitions';
import { audioController } from '../utils/audioController';

// handleFreeCraftCompletion, handleCompleteReforge, handleCompleteInlay, handleCompleteGraving, applyProgress
// теперь будут переданы в эту функцию из useCraftingActions (временно из useGameState),
// так как они являются вспомогательными для handleStrikeAnvil и завершения проектов.

export function createGameHandlers({
    updateState,
    showToast,
    handleOrderCompletion,
    checkForNewQuests, // Передаем для использования в handleOrderCompletion
    setIsWorking,
    workTimeoutRef,
    setCompletedOrderInfo,
    handleFreeCraftCompletion, // Вспомогательная функция для завершения FreeCraft
    handleCompleteReforge, // Вспомогательная функция для завершения перековки
    handleCompleteInlay, // Вспомогательная функция для завершения инкрустации
    handleCompleteGraving, // Вспомогательная функция для завершения гравировки
    applyProgress // Вспомогательная функция для применения прогресса
}) {
    const triggerWorkAnimation = () => {
        setIsWorking(true);
        if (workTimeoutRef.current) clearTimeout(workTimeoutRef.current);
        workTimeoutRef.current = setTimeout(() => setIsWorking(false), 200);
    };

    return {
        handleStrikeAnvil: () => {
            triggerWorkAnimation();
            updateState(state => {
                const activeProject = state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving;

                if (!activeProject) {
                    showToast("Выберите проект для работы!", "error");
                    return state;
                }

                if ((state.activeOrder || state.activeFreeCraft) && !state.activeReforge && !state.activeInlay && !state.activeGraving && !activeProject.activeComponentId) {
                     showToast("Выберите компонент для работы!", "error");
                    return state;
                }

                const isEpicCraft = !!state.currentEpicOrder;
                const isReforging = !!state.activeReforge;
                const isInlaying = !!state.activeInlay;
                const isGraving = !!state.activeGraving;

                const minigameState = state.activeOrder?.minigameState;
                const component = activeProject && !isEpicCraft && !isReforging && !isInlaying && !isGraving ? definitions.items[activeProject.itemKey].components.find(c => c.id === activeProject.activeComponentId) : null;

                if (minigameState?.active && state.activeOrder && component?.minigame) {
                    audioController.play('crit', 'A4');
                    const pos = minigameState.position;
                    let hitQuality = 'miss';
                    let progressBonus = 0;
                    let qualityBonus = 0;
                    if (component.minigame?.zones) {
                        for (const zone of component.minigame.zones) {
                            if (pos >= zone.from && pos <= zone.to) {
                                hitQuality = zone.quality;
                                progressBonus = zone.progressBonus * state.progressPerClick;
                                qualityBonus = zone.qualityBonus;
                                break;
                            }
                        }
                    }
                    if (hitQuality !== 'miss') {
                        showToast(`Отличный удар! (+${qualityBonus.toFixed(1)} к качеству)`, hitQuality === 'perfect' ? 'crit' : 'success');
                        state.activeOrder.qualityPoints = (state.activeOrder.qualityPoints || 0) + qualityBonus;
                        state.activeOrder.qualityHits = (state.activeOrder.qualityHits || 0) + 1;
                        applyProgress(state, state.progressPerClick + progressBonus);
                    } else {
                        showToast("Промах!", "error");
                        applyProgress(state, state.progressPerClick * 0.5);
                    }
                    minigameState.active = false;
                } else {
                    audioController.play('click', 'C3');
                    applyProgress(state, state.progressPerClick);
                    if(state.activeOrder && component?.minigame && Math.random() < component.minigame.triggerChance) {
                           state.activeOrder.minigameState = { active: true, position: 0, direction: 1 };
                           showToast("Момент истины!", "info");
                           audioController.play('complete', 'C4', '8n');
                    }
                }
                return state;
            });
        },
        handleSelectWorkstation: (workstationId) => {
            updateState(state => {
                state.activeWorkstationId = workstationId;
                return state;
            });
        },
        handleSelectComponent: (componentId) => {
            updateState(state => {
                if (state.activeOrder) state.activeOrder.activeComponentId = componentId;
                if (state.activeFreeCraft) state.activeFreeCraft.activeComponentId = componentId;
                return state;
            });
        },
        handleCloseRewardModal: () => setCompletedOrderInfo(null), // Эта функция также может остаться здесь
        applyProgress // applyProgress теперь возвращается из createGameHandlers
    };
}
// src/hooks/usePlayerActions.js
import { useMemo } from 'react';
import { useModalsHandlers } from './useModalsHandlers';
import { useSkillAndFactionHandlers } from './useSkillAndFactionHandlers';
import { useMarketAndShopHandlers } from './useMarketAndShopHandlers';
import { useCraftingAndUpgradeHandlers } from './useCraftingAndUpgradeHandlers';
import { useQuestAndMissionHandlers } from './useQuestAndMissionHandlers';
import { usePrestigeAndEternalHandlers } from './usePrestigeAndEternalHandlers';
import { usePersonnelHandlers } from './usePersonnelHandlers';
import { createGameHandlers } from '../logic/gameHandlers';

export function usePlayerActions(props) {
    const coreHandlers = useMemo(() => createGameHandlers(props), [props]);
    const modals = useModalsHandlers(props);
    const skillAndFaction = useSkillAndFactionHandlers(props);
    const marketAndShop = useMarketAndShopHandlers(props);
    const craftingAndUpgrade = useCraftingAndUpgradeHandlers(props);
    const questAndMission = useQuestAndMissionHandlers(props);
    const prestigeAndEternal = usePrestigeAndEternalHandlers(props);
    const personnel = usePersonnelHandlers(props);

    return useMemo(() => ({
        ...coreHandlers,
        ...modals,
        ...skillAndFaction,
        ...marketAndShop,
        ...craftingAndUpgrade,
        ...questAndMission,
        ...prestigeAndEternal,
        ...personnel,
        handleSetPlayerName: (name) => {
            props.updateState(state => {
                state.playerName = name;
                props.showToast(`Имя изменено на "${name}"!`, 'info');
                return state;
            });
        },
        // НОВЫЕ ОБРАБОТЧИКИ ДЛЯ МИНИ-ИГР
        handleUpdateMinigameState: (minigameStateUpdater) => {
            props.updateState(state => {
                const project = state.activeOrder || state.activeFreeCraft;
                if (project && project.minigameState) {
                    minigameStateUpdater(project.minigameState);
                }
                return state;
            });
        }
    }), [
        coreHandlers, modals, skillAndFaction, marketAndShop, 
        craftingAndUpgrade, questAndMission, prestigeAndEternal, personnel, 
        props
    ]);
}
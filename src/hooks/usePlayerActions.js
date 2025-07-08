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
import { recalculateAllModifiers } from '../utils/gameStateUtils';
import { definitions } from '../data/definitions';

export function usePlayerActions(props) {
    const coreHandlers = useMemo(() => createGameHandlers(props), [props]);
    const modals = useModalsHandlers(props);
    const skillAndFaction = useSkillAndFactionHandlers(props);
    const marketAndShop = useMarketAndShopHandlers(props);
    const craftingAndUpgrade = useCraftingAndUpgradeHandlers(props);
    const questAndMission = useQuestAndMissionHandlers(props);
    const prestigeAndEternal = usePrestigeAndEternalHandlers(props);
    const personnel = usePersonnelHandlers(props);

    const handleEquipPlayerItem = (slot, itemId) => {
        props.updateState(state => {
            const oldItemId = state.playerEquipment[slot];
            // Если в слоте был предмет, возвращаем его в инвентарь
            if (oldItemId) {
                const oldItem = state.inventory.find(i => i.uniqueId === oldItemId);
                if (oldItem) oldItem.location = 'inventory';
            }

            // Если передается новый предмет, экипируем его
            if (itemId) {
                 const newItem = state.inventory.find(i => i.uniqueId === itemId);
                 if (newItem) {
                     newItem.location = `equipped_player_${slot}`;
                     state.playerEquipment[slot] = itemId;
                     props.showToast(`Предмет "${definitions.items[newItem.itemKey].name}" экипирован!`, 'success');
                 }
            } else {
                // Если itemId равен null, просто снимаем предмет
                state.playerEquipment[slot] = null;
                if(oldItemId) {
                    props.showToast(`Предмет "${definitions.items[state.inventory.find(i => i.uniqueId === oldItemId).itemKey].name}" снят.`, 'info');
                }
            }

            recalculateAllModifiers(state);
            return state;
        });
    };

    return useMemo(() => ({
        ...coreHandlers,
        ...modals,
        ...skillAndFaction,
        ...marketAndShop,
        ...craftingAndUpgrade,
        ...questAndMission,
        ...prestigeAndEternal,
        ...personnel,
        handleEquipPlayerItem,
        handleSetPlayerName: (name) => {
            props.updateState(state => {
                state.playerName = name;
                props.showToast(`Имя изменено на "${name}"!`, 'info');
                return state;
            });
        },
        handleUpdateMinigameState: (minigameStateUpdater) => {
            props.updateState(state => {
                const project = state.activeOrder || state.activeFreeCraft;
                if (project && project.minigameState) {
                    minigameStateUpdater(project.minigameState);
                }
                return state;
            });
        },
        handleSetMobileView: (viewId) => {
            props.setActiveMobileView(viewId);
        },
        handleSelectMineOre: (oreType) => {
            props.setSelectedMineOre(oreType);
        },
        handleSelectShopShelf: (index) => {
            props.setSelectedShopShelfIndex(prev => prev === index ? null : index);
        },
    }), [
        coreHandlers, modals, skillAndFaction, marketAndShop, 
        craftingAndUpgrade, questAndMission, prestigeAndEternal, personnel, 
        props
    ]);
}
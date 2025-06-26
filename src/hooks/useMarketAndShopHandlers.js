// src/hooks/useMarketAndShopHandlers.js
import { useCallback, useMemo } from 'react';
import { definitions } from '../data/definitions/index.js';
import { formatNumber } from '../utils/formatters.jsx';
import { handleSaleCompletion } from '../logic/gameCompletions';
import { gameConfig as GAME_CONFIG } from '../constants/gameConfig';
import { audioController } from '../utils/audioController';
import { hasReputation } from '../utils/helpers';
import { canAffordAndPay } from '../utils/gameUtils'; // <--- НОВЫЙ ИМПОРТ

export const useMarketAndShopHandlers = ({ updateState, showToast, gameStateRef }) => { // <--- УДАЛЕН canAffordAndPay

    const handleMoveItemToShelf = useCallback((itemUniqueId) => {
        updateState(state => {
            if (state.isShopLocked) { showToast("Ваш магазин заблокирован! Попробуйте позже.", "error"); return state; }
            const emptyShelfIndex = state.shopShelves.findIndex(shelf => shelf.itemId === null);
            if (emptyShelfIndex === -1) { showToast("Все полки в магазине заняты!", 'error'); return state; }
            const itemToMove = state.inventory.find(item => item.uniqueId === itemUniqueId);
            if (!itemToMove || itemToMove.location !== 'inventory') return state;
            itemToMove.location = 'shelf';
            state.shopShelves[emptyShelfIndex] = { id: `${Date.now()}_${Math.random()}`, itemId: itemUniqueId, customer: null, saleProgress: 0, saleTimer: 0 };
            showToast(`Предмет "${definitions.items[itemToMove.itemKey].name}" выставлен на продажу!`, "info");
            return state;
        });
    }, [updateState, showToast]);

    const handleRemoveItemFromShelf = useCallback((itemUniqueId) => {
        updateState(state => {
            const shelfToClearIndex = state.shopShelves.findIndex(shelf => shelf.itemId === itemUniqueId);
            if (shelfToClearIndex === -1) return state;
            const itemToReturn = state.inventory.find(item => item.uniqueId === itemUniqueId);
            if (!itemToReturn) {
                state.shopShelves[shelfToClearIndex] = { id: `${Date.now()}_${Math.random()}`, itemId: null, customer: null, saleProgress: 0, saleTimer: 0 }; return state;
            }
            itemToReturn.location = 'inventory';
            state.shopShelves[shelfToClearIndex] = { id: `${Date.now()}_${Math.random()}`, itemId: null, customer: null, saleProgress: 0, saleTimer: 0 };
            showToast(`Предмет "${definitions.items[itemToReturn.itemKey].name}" убран с полки.`, "info");
            return state;
        });
    }, [updateState, showToast]);

    const handleClickSale = useCallback((shelfIndex) => {
        audioController.play('click', 'E4', '16n');
        updateState(state => {
            const shelf = state.shopShelves[shelfIndex];
            if (!shelf || !shelf.customer) return state;
            const clientSaleModifier = shelf.customer.demands?.saleSpeedModifier || 1.0;
            const saleProgressPerClick = GAME_CONFIG.PROGRESS_PER_SALE_CLICK * clientSaleModifier;
            shelf.saleProgress += saleProgressPerClick;
            const item = state.inventory.find(i => i.uniqueId === shelf.itemId);
            if (!item) { showToast("Ошибка: проданный предмет не найден в инвентаре!", "error"); state.shopShelves[shelfIndex] = { id: `${Date.now()}_${Math.random()}`, itemId: null, customer: null, saleProgress: 0, saleTimer: 0 }; return state; }
            const itemDef = definitions.items[item.itemKey];
            const baseValue = itemDef.components.reduce((sum, c) => sum + c.progress, 0);
            const requiredProgress = (baseValue * item.quality) * GAME_CONFIG.SALE_REQUIRED_PROGRESS_MULTIPLIER;
            if (shelf.saleProgress >= Math.max(50, requiredProgress)) { handleSaleCompletion(state, shelfIndex, showToast); }
            return state;
        });
    }, [updateState, showToast]);

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
    }, [updateState, showToast]);

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
            state.specialItems[itemId] = (state.specialItems[itemId] || 0) + 1;
            if (itemId === 'expeditionMap') {
                state.totalExpeditionMapsBought = (state.totalExpeditionMapsBought || 0) + 1;
            }
            showToast(`Куплено: ${item.name}!`, 'success');
            Object.keys(state.artifacts).forEach(artId => { const artifact = state.artifacts[artId]; const allObtained = Object.values(artifact.components).every(comp => state.specialItems[comp.itemId] > 0); if (allObtained && artifact.status === 'locked') { artifact.status = 'available'; showToast(`Все компоненты для артефакта "${definitions.greatArtifacts[artId].name}" собраны!`, 'levelup'); } }); return state;
        });
    }, [updateState, showToast]);

    const handleInvest = useCallback(() => {
        updateState(state => {
            const cost = 25000;
            if (state.investments.merchants) return state;
            if (!canAffordAndPay(state, {sparks: cost}, showToast)) { return state; }
            state.investments.merchants = true;
            showToast("Инвестиция в торговые пути сделана!", 'success');
            return state;
        });
    }, [updateState, showToast]);

    return useMemo(() => ({
        handleMoveItemToShelf,
        handleRemoveItemFromShelf,
        handleClickSale,
        handleBuyResource,
        handleSellResource,
        handleBuySpecialItem,
        handleInvest,
    }), [
        handleMoveItemToShelf,
        handleRemoveItemFromShelf,
        handleClickSale,
        handleBuyResource,
        handleSellResource,
        handleBuySpecialItem,
        handleInvest,
    ]);
};
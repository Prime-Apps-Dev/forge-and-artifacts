// src/utils/gameUtils.js
import { definitions } from '../data/definitions/index.js';
import { formatNumber } from './formatters.jsx';

/**
 * Проверяет, достаточно ли у игрока ресурсов для оплаты, и если да, вычитает их.
 * ВАЖНО: Эта функция мутирует переданный объект `state` и должна вызываться
 * только внутри колбэка `updateState`.
 * @param {object} state - Текущий объект состояния игры.
 * @param {object} costs - Объект со стоимостью, например { sparks: 100, ironOre: 10 }.
 * @param {function} showToastFunc - Функция для отображения уведомлений.
 * @returns {boolean} - Возвращает `true`, если оплата прошла успешно, иначе `false`.
 */
export const canAffordAndPay = (state, costs, showToastFunc) => {
    // Сначала проверяем, хватает ли всех ресурсов
    for (const resourceType in costs) {
        const costAmount = costs[resourceType];
        // Определяем, где хранится ресурс: в основном объекте или в specialItems
        const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType.includes('matter') ? 'main' : 'specialItems';
        const currentAmount = resourceStorage === 'main' ? (state[resourceType] || 0) : (state.specialItems?.[resourceType] || 0);

        if (currentAmount < costAmount) {
            const resourceName = definitions.specialItems[resourceType]?.name || definitions.resources[resourceType]?.name || resourceType.replace(/([A-Z])/g, ' $1').toLowerCase();
            showToastFunc(`Недостаточно: ${resourceName} (${formatNumber(costAmount)} требуется)!`, 'error');
            return false;
        }
    }

    // Если всех ресурсов хватает, списываем их
    for (const resourceType in costs) {
        const costAmount = costs[resourceType];
        const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType.includes('matter') ? 'main' : 'specialItems';
        if (resourceStorage === 'main') {
            state[resourceType] -= costAmount;
            if (resourceType === 'matter') {
                state.totalMatterSpent = (state.totalMatterSpent || 0) + costAmount;
            }
        } else {
            state.specialItems[resourceType] -= costAmount;
        }
    }
    
    return true; // Оплата прошла успешно
};
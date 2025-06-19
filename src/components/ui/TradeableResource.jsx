import React, { useState } from 'react';
import { definitions } from '../../data/definitions';
import { formatNumber, getReputationLevel } from '../../utils/helpers';
import SvgIcon from './SvgIcon';

const TradeableResource = React.memo(({ resourceId, name, icon, iconClass, gameState, onBuy, onSell }) => {
    // Проверяем, что market и market.prices существуют
    if (!gameState || !gameState.market || !gameState.market.prices) {
        return null;
    }

    const [multiplier, setMultiplier] = useState(1); // Единый множитель для покупки и продажи

    const market = gameState.market;
    const merchantsReputation = gameState.reputation?.merchants || 0;
    const repModifier = 1 - (getReputationLevel(merchantsReputation).threshold / 5000);

    const basePrices = market.prices[resourceId];
    if (!basePrices) {
        return null;
    }
    
    const eventModifiers = market.worldEvent?.priceModifiers?.[resourceId] || {};
    const buyPriceModifier = eventModifiers.buy || 1;
    const sellPriceModifier = eventModifiers.sell || 1;

    const currentRegion = definitions.regions[gameState.currentRegion];
    const demandModifier = currentRegion?.modifiers?.marketDemand?.[resourceId] || 1.0;

    const finalMarketBuyModifier = gameState.marketBuyModifier || 1.0; 
    
    // Рассчитываем цену за 1 единицу
    const unitBuyPrice = Math.ceil(basePrices.buy * repModifier * buyPriceModifier * demandModifier * finalMarketBuyModifier);
    const unitSellPrice = Math.floor(basePrices.sell * repModifier * sellPriceModifier * demandModifier);

    // Рассчитываем общую цену с учетом единого множителя
    const totalBuyPrice = unitBuyPrice * multiplier;
    const totalSellPrice = unitSellPrice * multiplier;
    
    const currentResourceAmount = gameState[resourceId] || 0;
    const canSell = currentResourceAmount >= multiplier; // Проверка на продажу с учетом единого множителя

    // Определяем доступные множители
    const isMaterial = resourceId.includes('Ore') || resourceId.includes('Ingots');
    const availableMultipliers = isMaterial ? [1, 5, 10, 100, 1000] : [1, 5, 10];

    // Функция для циклического переключения множителя
    const getNextMultiplier = (current, multipliers) => {
        const currentIndex = multipliers.indexOf(current);
        const nextIndex = (currentIndex + 1) % multipliers.length;
        return multipliers[nextIndex];
    };

    return (
        <div className="bg-black/20 p-4 rounded-lg flex items-center gap-4 border border-gray-700">
            {icon.startsWith('icon-') ? 
                <SvgIcon iconId={icon} className={`icon-sprite ${iconClass}`} /> : 
                <span className={`material-icons-outlined text-4xl ${iconClass}`}>{icon}</span>
            }
            <div className="grow">
                <h4 className="font-bold">{name}</h4>
                <p className="text-sm text-gray-400">В наличии: {formatNumber(currentResourceAmount)}</p>
            </div>
            <div className="flex gap-2 text-center">
                {/* Единая кнопка множителя, расположенная перед кнопкой "Купить" */}
                <button
                    onClick={() => setMultiplier(prev => getNextMultiplier(prev, availableMultipliers))}
                    className="interactive-element bg-gray-700 text-white text-xs px-2 py-1 rounded-md hover:bg-gray-600"
                    title="Кликните для смены множителя покупки/продажи"
                >
                    x{multiplier}
                </button>

                {/* Кнопка Купить */}
                <button onClick={() => onBuy(resourceId, unitBuyPrice, multiplier)} className="interactive-element flex flex-col items-center p-2 rounded-md bg-red-800/50 hover:bg-red-800/80 w-24">
                    <span className="font-bold">Купить</span>
                    <span className="text-xs">за {formatNumber(totalBuyPrice)} искр</span>
                </button>

                {/* Кнопка Продать */}
                <button onClick={() => canSell && onSell(resourceId, unitSellPrice, multiplier)} disabled={!canSell} className="interactive-element flex flex-col items-center p-2 rounded-md bg-green-800/50 hover:enabled:bg-green-800/80 w-24 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span className="font-bold">Продать</span>
                    <span className="text-xs">за {formatNumber(totalSellPrice)} искр</span>
                </button>
            </div>
        </div>
    );
});

export default TradeableResource;
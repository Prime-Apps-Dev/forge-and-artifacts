// src/components/ui/cards/TradeableResource.jsx
import React, { useState } from 'react';
import { definitions } from '../../../data/definitions/index.js';
import { formatNumber } from '../../../utils/formatters.jsx';
import { getResourceImageSrc, getReputationLevel } from '../../../utils/helpers';
import SvgIcon from '../display/SvgIcon';
import { useGame } from '../../../context/useGame.js';

const TradeableResource = React.memo(({ resourceId, name, icon, iconClass }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    if (!gameState || !gameState.market || !gameState.market.prices) return null;

    const [multiplier, setMultiplier] = useState(1);

    const market = gameState.market;
    const merchantsReputation = gameState.reputation?.merchants || 0;
    const repModifierBase = 1 - (getReputationLevel(merchantsReputation).threshold / 5000);

    const tradeNegotiationModifier = gameState.purchasedSkills.tradeNegotiation ? 0.95 : 1.0;
    const tradeNegotiationSellModifier = gameState.purchasedSkills.tradeNegotiation ? 1.05 : 1.0;

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
    
    const unitBuyPrice = Math.ceil(basePrices.buy * repModifierBase * buyPriceModifier * demandModifier * finalMarketBuyModifier * tradeNegotiationModifier);
    const unitSellPrice = Math.floor(basePrices.sell * repModifierBase * sellPriceModifier * demandModifier * tradeNegotiationSellModifier);

    const totalBuyPrice = unitBuyPrice * multiplier;
    const totalSellPrice = unitSellPrice * multiplier;
    
    const currentResourceAmount = gameState[resourceId] || 0;
    const canSell = currentResourceAmount >= multiplier;

    const isMaterial = resourceId.includes('Ore') || resourceId.includes('Ingots');
    const availableMultipliers = isMaterial ? [1, 5, 10, 100, 1000] : [1, 5, 10];

    const getNextMultiplier = (current, multipliers) => {
        const currentIndex = multipliers.indexOf(current);
        const nextIndex = (currentIndex + 1) % multipliers.length;
        return multipliers[nextIndex];
    };

    const imageSrcForResource = getResourceImageSrc(resourceId, 32);
    const useImgTag = imageSrcForResource && imageSrcForResource.startsWith('/img/');

    return (
        <div className="bg-black/20 p-4 rounded-lg flex flex-col md:flex-row items-center gap-4 border border-gray-700">
            <div className="flex items-center gap-3 w-full md:w-auto">
                {useImgTag ? (
                    <img src={imageSrcForResource} alt={name} className="w-8 h-8 object-contain flex-shrink-0" />
                ) : (icon.startsWith('icon-') ?
                    <SvgIcon iconId={icon} className={`icon-sprite ${iconClass}`} /> : 
                    <span className={`material-icons-outlined text-4xl ${iconClass}`}>{icon}</span>
                )}
                <div className="grow">
                    <h4 className="font-bold">{name}</h4>
                    <p className="text-sm text-gray-400">В наличии: {formatNumber(currentResourceAmount)}</p>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 text-center w-full md:w-auto">
                <button
                    onClick={() => setMultiplier(prev => getNextMultiplier(prev, availableMultipliers))}
                    className="interactive-element bg-gray-700 text-white text-xs px-3 py-2 rounded-md hover:bg-gray-600 w-full sm:w-auto"
                    title="Кликните для смены множителя покупки/продажи"
                >
                    x{multiplier}
                </button>

                <button onClick={() => handlers.handleBuyResource(resourceId, unitBuyPrice, multiplier)} className="interactive-element flex flex-col items-center p-2 rounded-md bg-red-800/50 hover:bg-red-800/80 w-full sm:w-24">
                    <span className="font-bold">Купить</span>
                    <span className="text-xs">за {formatNumber(totalBuyPrice)} искр</span>
                </button>

                <button onClick={() => canSell && handlers.handleSellResource(resourceId, unitSellPrice, multiplier)} disabled={!canSell} className="interactive-element flex flex-col items-center p-2 rounded-md bg-green-800/50 hover:enabled:bg-green-800/80 w-full sm:w-24 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span className="font-bold">Продать</span>
                    <span className="text-xs">за {formatNumber(totalSellPrice)} искр</span>
                </button>
            </div>
        </div>
    );
});

export default TradeableResource;
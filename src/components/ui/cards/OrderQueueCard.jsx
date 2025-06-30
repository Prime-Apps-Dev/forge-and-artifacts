// src/components/ui/cards/OrderQueueCard.jsx
import React, { useState, useEffect, memo } from 'react';
import { definitions } from '../../../data/definitions/index.js';
import { formatNumber } from '../../../utils/formatters.jsx';
import { useGame } from '../../../context/useGame.js';
import Button from '../buttons/Button.jsx';

const OrderQueueCard = memo(({ order, isDisabled }) => {
    const { handlers } = useGame();
    const itemDef = definitions.items[order.itemKey];
    const faction = order.factionId ? definitions.factions[order.factionId] : null;

    const [timeLeft, setTimeLeft] = useState(order.timeToLive || 0);

    useEffect(() => {
        if (!order.timeToLive) {
            setTimeLeft(definitions.gameConfig.orderTTL);
        } else {
            setTimeLeft(order.timeToLive);
        }

        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [order.id, order.timeToLive]);

    const timerColorClass = timeLeft <= 10 ? 'text-red-400' : 'text-gray-400';
    const timerBorderClass = timeLeft <= 10 ? 'border-red-600' : 'border-gray-600';

    return (
        <div className={`p-3 bg-black/30 rounded-lg border ${isDisabled || timeLeft <= 0 ? 'border-gray-700 opacity-60' : timerBorderClass}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-lg text-white">{itemDef.name}</h4>
                    <p className="text-sm text-gray-400">Клиент: {order.client.name}</p>
                    {faction && (
                        <p className={`text-sm text-${faction.color}`}>Фракция: {faction.name}</p>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-sm text-yellow-400 flex items-center justify-end gap-1">
                        <span className="material-icons-outlined text-base">flash_on</span>
                        {formatNumber(order.rewards.sparks)}
                    </p>
                    <p className="text-sm text-purple-400 flex items-center justify-end gap-1">
                        <span className="material-icons-outlined text-base">bubble_chart</span>
                        {formatNumber(order.rewards.matter)}
                    </p>
                    <p className={`text-xs mt-1 flex items-center justify-end gap-1 ${timerColorClass}`}>
                        <span className="material-icons-outlined text-base">timer</span>
                        {timeLeft > 0 ? `${timeLeft} сек.` : 'Истек'}
                    </p>
                </div>
            </div>
            <Button
                onClick={() => handlers.handleAcceptOrder(order.id)}
                disabled={isDisabled || timeLeft <= 0}
                variant="success"
                className="mt-3"
            >
                {timeLeft <= 0 ? 'Истек срок' : (isDisabled ? 'Вы заняты' : 'Принять заказ')}
            </Button>
        </div>
    );
});

export default OrderQueueCard;
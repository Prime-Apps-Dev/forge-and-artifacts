import React, { useState, useEffect, memo } from 'react';
import { formatNumber } from '../../utils/helpers';

const OrderTimer = memo(({ order }) => {
    const [time, setTime] = useState(0);

    useEffect(() => {
        if (!order) {
            setTime(0);
            return;
        }

        const initialStartTime = order.startTime || Date.now(); 

        const interval = setInterval(() => {
            const currentTime = Date.now();
            const elapsedTime = (currentTime - initialStartTime) / 1000;
            setTime(elapsedTime);
        }, 100);

        return () => {
            clearInterval(interval);
        };
        // ИЗМЕНЕНИЕ ЗДЕСЬ: Зависимость изменена на order.startTime
    }, [order?.startTime]);

    if (!order) {
        return null;
    }

    let timerColor = "text-red-400";
    if (time <= order.timeLimits.gold) timerColor = "text-yellow-400";
    else if (time <= order.timeLimits.silver) timerColor = "text-gray-300";

    return (
        <div className={`mt-2 text-sm flex items-center gap-1 ${timerColor}`}>
            <span className="material-icons-outlined text-base">timer</span>
            <span>{time >= 0 ? time.toFixed(1) : '0.0'}c</span>
        </div>
    );
});

export default OrderTimer;
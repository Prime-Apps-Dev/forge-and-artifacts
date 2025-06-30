// src/components/views/BulletinBoardView.jsx
import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/useGame.js';
import BulletinOrderCard from '../ui/cards/BulletinOrderCard';

const BulletinBoardView = () => {
    const { displayedGameState: gameState } = useGame();
    const { orders, nextRefresh } = gameState.bulletinBoard;
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!nextRefresh) return;

        const updateTimer = () => {
            const remaining = Math.max(0, nextRefresh - Date.now());
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
            setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        updateTimer();
        const intervalId = setInterval(updateTimer, 1000);
        return () => clearInterval(intervalId);
    }, [nextRefresh]);

    return (
        <div>
            <h2 className="font-cinzel text-2xl accent-glow-color text-shadow-glow flex items-center gap-2 border-b border-gray-700 pb-4 mb-6">
                <span className="material-icons-outlined">article</span> Доска Объявлений
            </h2>
            <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-gray-700 mb-6">
                <p className="text-gray-400 text-sm">Особые заказы от жителей и организаций королевства.</p>
                <div className="text-right">
                    <p className="text-xs text-gray-500">Обновление через:</p>
                    <p className="font-mono text-lg font-bold text-orange-400">{timeLeft}</p>
                </div>
            </div>

            <div className="space-y-4">
                {orders && orders.length > 0 ? (
                    orders.map(order => (
                        <BulletinOrderCard key={order.id} order={order} />
                    ))
                ) : (
                    <div className="text-center py-16 bg-black/20 rounded-lg">
                        <p className="text-gray-500 italic">На доске пока нет новых объявлений.</p>
                        <p className="text-gray-600 text-sm mt-2">Возвращайтесь позже.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulletinBoardView;
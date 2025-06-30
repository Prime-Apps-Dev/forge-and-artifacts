// src/components/ui/cards/BulletinOrderCard.jsx
import React from 'react';
import { definitions } from '../../../data/definitions';
import { useGame } from '../../../context/useGame.js'; // ИЗМЕНЕН ПУТЬ ИМПОРТА
import { formatCostsJsx } from '../../../utils/formatters';
import Button from '../buttons/Button';

const RequirementLine = ({ req }) => {
    let text = 'Неизвестное требование';
    switch (req.type) {
        case 'count':
            text = `Создать: ${definitions.items[req.itemKey]?.name || 'Предмет'} (${req.value} шт.)`;
            break;
        case 'quality':
            const comparisonText = req.comparison === 'gte' ? 'не ниже' : 'не выше';
            text = `Качество (${definitions.items[req.itemKey]?.name}): ${comparisonText} ${req.value.toFixed(1)}`;
            break;
        case 'craftingStat':
            const statText = req.stat === 'critSuccessCount' ? 'Крит. удары' : 'Неизвестный параметр';
            const compText = req.comparison === 'eq' ? 'ровно' : req.comparison === 'lte' ? 'не более' : 'не менее';
            text = `${statText}: ${compText} ${req.value}`;
            break;
        default: break;
    }

    return (
        <li className="flex items-center gap-2 text-sm text-gray-300">
            <span className="material-icons-outlined text-green-500 text-base">arrow_right</span>
            {text}
        </li>
    );
};

const BulletinOrderCard = ({ order }) => {
    const { handlers } = useGame();

    const handleAccept = () => {
        handlers.handleAcceptBulletinQuest(order.id);
    };

    return (
        <div className="bg-gradient-to-br from-gray-800/50 to-black/30 border border-yellow-800/50 rounded-lg p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
                <h3 className="font-cinzel text-lg text-yellow-400">{order.title}</h3>
                <p className="text-sm text-gray-400 my-2">{order.description}</p>
                <div className="mt-3">
                    <h4 className="font-bold text-base text-gray-200 mb-1">Требования:</h4>
                    <ul className="space-y-1">
                        {order.requirements.map((req, index) => (
                            <RequirementLine key={index} req={req} />
                        ))}
                    </ul>
                </div>
            </div>
            <div className="flex-shrink-0 md:w-64 md:border-l md:border-gray-700 md:pl-4 flex flex-col justify-between">
                <div>
                    <h4 className="font-bold text-base text-gray-200 mb-2">Награда:</h4>
                    <div className="flex flex-col gap-2">
                        {formatCostsJsx(order.reward, {})}
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-xs text-gray-500 text-center mb-2">Время на выполнение: {order.timeLimitHours} ч.</p>
                    <Button onClick={handleAccept} variant="success">
                        Принять Задание
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BulletinOrderCard;
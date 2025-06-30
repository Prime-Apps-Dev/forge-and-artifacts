// src/components/views/JournalView.jsx
import React from 'react';
import { definitions } from '../../data/definitions/index.js';
import { useGame } from '../../context/useGame.js'; // ИЗМЕНЕН ПУТЬ ИМПОРТА
import Button from '../ui/buttons/Button.jsx';
import { formatNumber } from '../../utils/formatters.jsx';

const QuestCard = ({ quest, type }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const faction = definitions.factions[quest.factionId];
    
    let targetDescription = '';
    let progress = 0;
    const targetCount = quest.target.count;

    switch (quest.target.type) {
        case 'craft':
            targetDescription = `Создать ${targetCount} x "${definitions.items[quest.target.itemId].name}"`;
            progress = gameState.journal.questProgress[quest.id] || 0;
            break;
        case 'inlay':
            targetDescription = `Инкрустировать ${targetCount} предмет(ов)`;
            progress = gameState.journal.questProgress[quest.id] || 0;
            break;
        case 'grave':
             targetDescription = `Сделать гравировку на ${targetCount} предмет(ов)`;
             progress = gameState.journal.questProgress[quest.id] || 0;
            break;
        case 'risky_order':
            targetDescription = `Выполнить ${targetCount} рискованных заказа(ов)`;
            progress = gameState.journal.questProgress[quest.id] || 0;
            break;
        case 'unique_items':
            targetDescription = `Собрать ${targetCount} уникальных предмета(ов)`;
            progress = new Set(gameState.inventory.map(item => item.itemKey)).size;
            break;
        case 'totalOre':
            targetDescription = `Накопить ${targetCount} ед. любой руды`;
            progress = (gameState.ironOre || 0) + (gameState.copperOre || 0) + (gameState.mithrilOre || 0) + (gameState.adamantiteOre || 0);
            break;
        case 'totalIngotsSmelted':
            targetDescription = `Переплавить ${targetCount} слитков`;
            progress = gameState.totalIngotsSmelted || 0;
            break;
        case 'totalClicks':
            targetDescription = `Нанести ${targetCount} ударов по наковальне`;
            progress = gameState.totalClicks || 0;
            break;
        case 'totalMatterSpent':
            targetDescription = `Потратить ${targetCount} материи`;
            progress = gameState.totalMatterSpent || 0;
            break;
        case 'risky_order_consecutive':
            targetDescription = `Успешно выполнить ${targetCount} рискованных заказов подряд`;
            progress = gameState.consecutiveRiskyOrders || 0;
            break;
        default:
            targetDescription = quest.description;
            progress = gameState.journal.questProgress[quest.id] || 0;
            break;
    }
    
    const progressPercentage = (targetCount > 0) ? (progress / targetCount) * 100 : 0;

    return (
        <div className={`p-4 bg-black/30 border-2 rounded-lg border-${faction ? faction.color.replace('500', '700') : 'gray-700'}`}>
            <h3 className={`font-cinzel text-lg text-${faction ? faction.color : 'white'}`}>{quest.title}</h3>
            <p className="text-sm text-gray-400 my-2">{quest.description}</p>
            <div className="mt-2 pt-2 border-t border-gray-700/50">
                <p className="text-sm text-gray-300">
                    <span className="font-bold">Цель: </span> 
                    {targetDescription}
                </p>
                {type === 'active' && (
                    <div className="mt-2">
                        <div className="w-full bg-gray-900 rounded-full h-4 relative overflow-hidden border border-black/20">
                            <div
                                className="bg-green-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, progressPercentage)}%` }}
                            ></div>
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white z-10 mix-blend-difference">
                                {formatNumber(Math.min(progress, targetCount), true)} / {formatNumber(targetCount, true)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
            {type === 'available' && (
                <Button onClick={() => handlers.handleStartQuest(quest.id)} className={`mt-4 bg-${faction ? faction.color.replace('500', '600') : 'orange-600'} text-black`}>
                    Принять задание
                </Button>
            )}
        </div>
    );
};

const JournalView = () => {
    const { displayedGameState: gameState } = useGame();
    const { availableQuests, activeQuests, completedQuests } = gameState.journal;

    const renderEmptyState = (text) => (
         <div className="flex items-center justify-center text-center h-32 bg-black/20 rounded-lg border border-gray-700 border-dashed">
            <div>
                <span className="material-icons-outlined text-5xl text-gray-600">inbox</span>
                <p className="text-gray-500 mt-2">{text}</p>
            </div>
        </div>
    );

    return (
        <div>
            <h2 className="font-cinzel text-2xl accent-glow-color text-shadow-glow flex items-center gap-2 border-b border-gray-700 pb-4 mb-6">
                <span className="material-icons-outlined">book</span> Журнал Заданий
            </h2>

            <div className="space-y-6">
                <div>
                    <h3 className="font-cinzel text-xl text-orange-400 mb-3">Активные задания</h3>
                    <div className="space-y-4">
                        {activeQuests.length > 0 
                            ? activeQuests.map(q => <QuestCard key={q.id} quest={definitions.quests[q.id]} type="active" />)
                            : renderEmptyState("Нет активных заданий.")
                        }
                    </div>
                </div>

                <div>
                    <h3 className="font-cinzel text-xl text-yellow-400 mb-3">Доступные задания</h3>
                     <div className="space-y-4">
                        {availableQuests.length > 0
                            ? availableQuests.map(id => <QuestCard key={id} quest={definitions.quests[id]} type="available" />)
                            : renderEmptyState("Нет доступных заданий. Повышайте репутацию и изучайте навыки!")
                        }
                    </div>
                </div>

                 <div>
                    <h3 className="font-cinzel text-xl text-gray-500 mb-3">Завершенные задания</h3>
                     <div className="space-y-2">
                         {completedQuests.length > 0
                            ? completedQuests.map(id => (
                                <div key={id} className="p-3 bg-black/10 rounded-md text-gray-500 flex items-center gap-3">
                                    <span className="material-icons-outlined text-green-600">check_circle</span>
                                    <span>{definitions.quests[id].title}</span>
                                </div>
                              ))
                            : <p className="text-sm text-gray-600 italic">Вы еще не завершили ни одного задания.</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JournalView;
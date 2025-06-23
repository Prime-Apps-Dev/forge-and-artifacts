import React from 'react';
import { definitions } from '../../data/definitions';

const QuestCard = ({ quest, onAccept, progress, type }) => {
    const faction = definitions.factions[quest.factionId];
    const targetItem = quest.target.type === 'craft' ? definitions.items[quest.target.itemId] : null;

    return (
        <div className={`p-4 bg-black/30 border-2 rounded-lg border-${faction.color.replace('500', '700')}`}>
            <h3 className={`font-cinzel text-lg text-${faction.color}`}>{quest.title}</h3>
            <p className="text-sm text-gray-400 my-2">{quest.description}</p>
            <div className="mt-2 pt-2 border-t border-gray-700/50">
                <p className="text-sm text-gray-300">
                    <span className="font-bold">Цель: </span> 
                    {targetItem ? `Создать ${quest.target.count} x "${targetItem.name}"` : 'Особое задание'}
                    {type === 'active' && ` (${progress}/${quest.target.count})`}
                </p>
            </div>
            {type === 'available' && (
                <button onClick={() => onAccept(quest.id)} className={`mt-4 w-full interactive-element bg-${faction.color} text-black font-bold py-2 px-4 rounded-lg`}>
                    Принять задание
                </button>
            )}
        </div>
    )
};

const JournalView = ({ gameState, onStartQuest }) => {
    const { availableQuests, activeQuests, completedQuests, questProgress } = gameState.journal;

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
                            ? activeQuests.map(q => {
                                const questDef = definitions.quests[q.id];
                                return <QuestCard key={q.id} quest={questDef} progress={questProgress[q.id] || 0} type="active" />
                            })
                            : renderEmptyState("Нет активных заданий.")
                        }
                    </div>
                </div>

                <div>
                    <h3 className="font-cinzel text-xl text-yellow-400 mb-3">Доступные задания</h3>
                     <div className="space-y-4">
                        {availableQuests.length > 0
                            ? availableQuests.map(id => {
                                const questDef = definitions.quests[id];
                                return <QuestCard key={id} quest={questDef} onAccept={onStartQuest} type="available" />
                            })
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
    )
};

export default JournalView;
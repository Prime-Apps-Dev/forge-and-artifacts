import React from 'react';
import { definitions } from '../../data/definitions';

const QuestCard = ({ quest, onAccept, progress, type, gameState }) => { // Добавлен gameState
    const faction = definitions.factions[quest.factionId];
    
    let targetDescription = '';
    let currentProgress = progress;

    switch (quest.target.type) {
        case 'craft':
            const targetItem = definitions.items[quest.target.itemId];
            targetDescription = `Создать ${quest.target.count} x "${targetItem.name}"`;
            break;
        case 'inlay':
            targetDescription = `Инкрустировать ${quest.target.count} предмет(ов)`;
            break;
        case 'risky_order':
            targetDescription = `Выполнить ${quest.target.count} рискованных заказа(ов)`;
            break;
        case 'unique_items':
            targetDescription = `Собрать ${quest.target.count} уникальных предмета(ов)`;
            currentProgress = new Set(gameState.inventory.map(item => item.itemKey)).size; // Пересчитываем для уникальных предметов
            break;
        case 'totalOre':
            targetDescription = `Накопить ${quest.target.count} ед. руды`;
            currentProgress = (gameState.ironOre || 0) + (gameState.copperOre || 0) + (gameState.mithrilOre || 0) + (gameState.adamantiteOre || 0); // Пересчитываем для всей руды
            break;
        case 'totalIngotsSmelted':
            targetDescription = `Переплавить ${quest.target.count} слитков`;
            currentProgress = gameState.totalIngotsSmelted || 0;
            break;
        case 'totalClicks':
            targetDescription = `Нанести ${quest.target.count} ударов по наковальне`;
            currentProgress = gameState.totalClicks || 0;
            break;
        case 'totalSparks':
            targetDescription = `Заработать ${quest.target.count} искр`;
            currentProgress = gameState.totalSparksEarned || 0;
            break;
        case 'totalMatterSpent':
            targetDescription = `Потратить ${quest.target.count} материи`;
            currentProgress = gameState.totalMatterSpent || 0;
            break;
        case 'grave':
            targetDescription = `Гравировать ${quest.target.count} предмет(ов)`;
            break;
        // НОВЫЕ ТИПЫ ЦЕЛЕЙ
        case 'complex_order':
            targetDescription = `Выполнить ${quest.target.count} сложны${quest.target.count === 1 ? 'й' : 'х'} заказ${quest.target.count === 1 ? '' : 'ов'}`;
            break;
        case 'craft_quality':
            const qualityItemType = quest.target.itemType === 'any' ? 'любого типа' : definitions.items?.[Object.keys(definitions.items).find(key => definitions.items[key].itemType === quest.target.itemType)]?.name || quest.target.itemType; // Попытка найти имя для типа
            targetDescription = `Создать ${quest.target.count} ${qualityItemType} с качеством не ниже ${quest.target.minQuality.toFixed(1)}`;
            break;
        case 'deliver_resources':
            const resourceNames = quest.target.resources.map(resId => definitions.resources?.[resId]?.name || resId.replace('Ore', ' руды').replace('Ingots', ' слитков')).join(' или ');
            targetDescription = `Доставить ${quest.target.count} ед. ${resourceNames}`;
            // Для deliver_resources, прогресс будет храниться в questProgress как общая сумма доставленного
            currentProgress = gameState.journal.questProgress[quest.id] || 0;
            break;
        case 'risky_order_consecutive':
            targetDescription = `Успешно выполнить ${quest.target.count} рискованных заказов подряд`;
            currentProgress = gameState.consecutiveRiskyOrders || 0; // Прогресс для этого типа хранится отдельно
            break;
        case 'craft_item_tag':
            targetDescription = `Создать ${quest.target.count} предмет(ов) с тегом "${quest.target.itemTag}"`;
            break;
        case 'inlay_item_tag':
            targetDescription = `Инкрустировать ${quest.target.count} предмет(ов) с тегом "${quest.target.itemTag}"`;
            break;
        case 'matter_spent': // Уже есть totalMatterSpent, но квест может требовать конкретный
            targetDescription = `Потратить ${quest.target.count} материи`;
            currentProgress = gameState.totalMatterSpent || 0; // Предполагаем, что триггер уже сработал
            break;
        case 'artifact_completed':
            const artifactDef = definitions.greatArtifacts[quest.target.artifactId];
            targetDescription = `Создать артефакт "${artifactDef.name}"`;
            currentProgress = gameState.artifacts[quest.target.artifactId]?.status === 'completed' ? 1 : 0; // 0 или 1
            break;
        default:
            targetDescription = 'Особое задание';
            break;
    }

    return (
        <div className={`p-4 bg-black/30 border-2 rounded-lg border-${faction.color.replace('500', '700')}`}>
            <h3 className={`font-cinzel text-lg text-${faction.color}`}>{quest.title}</h3>
            <p className="text-sm text-gray-400 my-2">{quest.description}</p>
            <div className="mt-2 pt-2 border-t border-gray-700/50">
                <p className="text-sm text-gray-300">
                    <span className="font-bold">Цель: </span> 
                    {targetDescription}
                    {type === 'active' && ` (${currentProgress}/${quest.target.count})`}
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

const JournalView = ({ gameState, handlers }) => { // Изменено на handlers
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
                                return <QuestCard key={q.id} quest={questDef} progress={questProgress[q.id] || 0} type="active" gameState={gameState} />
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
                                return <QuestCard key={id} quest={questDef} onAccept={handlers.handleStartQuest} type="available" gameState={gameState} /> // Передаем handlers.handleStartQuest
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
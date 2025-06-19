// src/components/panels/AchievementsPanel.jsx
import React from 'react';
import { definitions } from '../../data/definitions';
import AchievementCard from '../ui/AchievementCard'; 

const AchievementsPanel = ({ gameState }) => {
    // Группируем достижения по категориям
    const groupedAchievements = Object.values(definitions.achievements).reduce((acc, ach) => {
        const category = ach.category || 'Прочее';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(ach);
        return acc;
    }, {});

    return (
        <div className="panel-section">
            <h3 className="font-cinzel text-lg text-gray-400 border-b border-gray-700/50 pb-1 mb-4">Достижения</h3>
            <p className="text-gray-400 text-sm mb-4">Выполняйте особые задачи, чтобы получить постоянные бонусы и признание.</p>
            <div className="space-y-6">
                {Object.entries(groupedAchievements).map(([category, achievements]) => (
                    <div key={category}>
                        <h4 className="font-cinzel text-orange-400 text-lg mb-3">{category}</h4>
                        {/* КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Используем новую структуру с flexbox и отступами */}
                        <div className="relative flex min-h-[150px] sm:min-h-[160px] lg:min-h-[170px] xl:min-h-[190px] /* Минимальная высота для карточек */
                                    flex-wrap /* Позволяем карточкам переноситься на новую строку */
                                    gap-4 /* Промежутки между карточками */
                                    pb-4 /* Отступ снизу */
                                    /* pl-4 и pr-4 здесь уже не нужны, так как они на родительском div в ProfileModal */
                                    ">
                            {achievements.map((ach, index) => (
                                <AchievementCard // <-- ГЛАВНОЕ ИЗМЕНЕНИЕ: РЕНДЕРИМ AchievementCard
                                    key={ach.id}
                                    achievement={ach}
                                    status={ach.check(gameState, definitions)}
                                    index={index} // Индекс передаем, хотя для текущей логики смещения он не используется
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AchievementsPanel;
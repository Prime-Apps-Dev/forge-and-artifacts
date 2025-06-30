// src/components/panels/AchievementsPanel.jsx
import React, { useMemo } from 'react';
import { definitions } from '../../data/definitions/index.js';
import AchievementCard from '../ui/cards/AchievementCard';
import { useGame } from '../../context/useGame.js';

const AchievementsPanel = () => {
    const { displayedGameState: gameState } = useGame();

    // Оптимизация: группировка достижений выполняется только один раз
    const groupedAchievements = useMemo(() => {
        return Object.values(definitions.achievements).reduce((acc, ach) => {
            const category = ach.category || 'Прочее';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(ach);
            return acc;
        }, {});
    }, []); // Зависимостей нет, т.к. definitions статичны

    return (
        <div className="panel-section">
            <h3 className="font-cinzel text-lg text-gray-400 border-b border-gray-700/50 pb-1 mb-4">Достижения</h3>
            <p className="text-gray-400 text-sm mb-4">Выполняйте особые задачи, чтобы получить постоянные бонусы и признание.</p>
            <div className="space-y-6">
                {Object.entries(groupedAchievements).map(([category, achievements]) => (
                    <div key={category}>
                        <h4 className="font-cinzel text-orange-400 text-lg mb-3">{category}</h4>
                        <div className="relative flex min-h-[150px] sm:min-h-[160px] lg:min-h-[170px] xl:min-h-[190px]
                                    flex-wrap
                                    gap-4
                                    pb-4
                                    ">
                            {achievements.map((ach, index) => (
                                <AchievementCard
                                    key={ach.id}
                                    achievement={ach}
                                    status={ach.check(gameState, definitions)}
                                    index={index}
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
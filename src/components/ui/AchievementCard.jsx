// src/components/ui/AchievementCard.jsx
import React, { memo } from 'react';
import { formatNumber } from '../../utils/helpers';
import Tooltip from './Tooltip';

const AchievementCard = memo(({ achievement, status, index }) => {
    const progressPercentage = status.target > 0 ? (status.current / status.target) * 100 : 0;
    const isComplete = status.isComplete;

    const defaultImgSrc = 'https://placehold.co/128x128/333/FFF?text=ACH';

    return (
        <Tooltip text={achievement.description}>
            <div className={`
                relative flex flex-col items-center justify-between
                w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 xl:w-48 xl:h-48 /* Адаптивные размеры */
                bg-black/20 rounded-lg p-2
                border-2 transition-all duration-200 ease-in-out
                transform-gpu /* Для плавных анимаций */
                z-10 /* Базовый z-index */
                
                ${isComplete ? 'border-green-500 shadow-md shadow-green-500/20' : 'border-gray-700'}
                
                /* Стили для hover эффекта: СЛЕГКА УВЕЛИЧИВАЕМ И ПОДСВЕЧИВАЕМ НА МЕСТЕ */
                hover:scale-105 /* Карточка слегка увеличится (например, на 5%) */
                hover:border-orange-500 /* Рамка станет оранжевой */
                hover:shadow-xl hover:shadow-orange-500/20 /* Усиленная оранжевая тень */
                hover:z-20 /* Поднимаем над соседними */
                /* УДАЛЕНО: hover:translate-x-1/4, так как мы хотим только увеличение на месте */
                
                backdrop-filter backdrop-blur-md /* Размытие фона за карточкой */
                bg-opacity-80 /* Увеличим непрозрачность фона для лучшего эффекта размытия */

            `}>
                {/* Квадратное изображение */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-md flex-shrink-0">
                    <img
                        src={defaultImgSrc}
                        alt={achievement.title}
                        className={`
                            object-cover w-full h-full
                            ${isComplete ? 'grayscale-0' : 'grayscale'}
                            transition-all duration-300
                        `}
                    />
                    {isComplete && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                            <span className="material-icons-outlined text-green-400 text-5xl">check_circle</span>
                        </div>
                    )}
                </div>

                {/* Заголовок достижения */}
                <h4 className={`
                    absolute top-2 w-full text-center font-cinzel text-xs md:text-sm font-bold
                    ${isComplete ? 'text-green-300' : 'text-white'}
                    px-1 text-shadow-glow
                    bg-black/50 rounded-b-md pb-1
                `}>
                    {achievement.title}
                </h4>

                {/* Название эффекта достижения */}
                {isComplete && achievement.effectName && (
                    <p className="absolute bottom-6 w-full text-center text-xs text-green-200 bg-black/70 rounded-md py-0.5 px-1">
                        Эффект: {achievement.effectName}
                    </p>
                )}

                {/* Прогресс-бар */}
                {!isComplete && status.target > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-800/80 rounded-b-lg overflow-hidden">
                        <div
                            className="bg-green-600 h-full transition-all duration-300 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white z-10">
                            {formatNumber(status.current)} / {formatNumber(status.target)}
                        </span>
                    </div>
                )}
            </div>
        </Tooltip>
    );
});

export default AchievementCard;
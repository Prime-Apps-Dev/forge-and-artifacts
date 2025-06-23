// src/components/modals/AchievementRewardModal.jsx
import React from 'react';
import Tooltip from '../ui/display/Tooltip'; // Обновленный путь

const AchievementRewardModal = ({ isOpen, onClose, achievement, onClaimReward }) => {
    if (!isOpen || !achievement) return null;

    const achievementImgSrc = achievement.icon;

    let rewardDescriptionText = "Вы получили неизвестную награду.";
    if (achievement.effectName) {
        rewardDescriptionText = `Получена награда: ${achievement.effectName}!`;
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div
                className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-2xl p-8 w-full max-w-lg text-center modal-content"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="font-cinzel text-3xl text-center text-yellow-400 text-shadow-glow mb-4">
                    Достижение выполнено!
                </h2>
                <p className="text-gray-300 mb-6">Поздравляем, Мастер! Вы достигли нового рубежа!</p>

                <div className="flex flex-col items-center justify-center mb-6">
                    <div className={`
                        relative flex flex-col items-center justify-between
                        w-48 h-48
                        bg-black/40 rounded-lg p-2
                        border-2 border-green-500 shadow-md shadow-green-500/20
                        overflow-hidden
                    `}>
                         <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-md flex-shrink-0">
                            <img
                                src={achievementImgSrc}
                                alt={achievement.title}
                                className={`object-cover w-full h-full img-rounded-corners grayscale-0`}
                            />
                            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                <span className="material-icons-outlined text-green-400 text-5xl">check_circle</span>
                            </div>
                        </div>
                        <h4 className="absolute top-2 w-full text-center font-cinzel text-base md:text-lg font-bold text-green-300 px-1 text-shadow-glow bg-black/50 rounded-b-md pb-1">
                            {achievement.title}
                        </h4>
                        {achievement.effectName && (
                            <p className="absolute bottom-6 w-full text-center text-sm text-green-200 bg-black/70 rounded-md py-0.5 px-1">
                                Эффект: {achievement.effectName}
                            </p>
                        )}
                    </div>
                    
                    <p className="text-gray-400 text-sm mt-4 italic">{achievement.description}</p>
                </div>
                
                <button
                    onClick={() => onClaimReward(achievement.id, rewardDescriptionText)}
                    className="interactive-element mt-4 w-full bg-orange-600 text-black font-bold py-2 px-4 rounded-lg hover:bg-orange-500"
                >
                    Получить награду
                </button>
            </div>
        </div>
    );
};

export default AchievementRewardModal;
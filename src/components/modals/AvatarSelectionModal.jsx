// src/components/modals/AvatarSelectionModal.jsx
import React from 'react';
import { definitions } from '../../data/definitions';
import Tooltip from '../ui/Tooltip';

const AvatarSelectionModal = ({ isOpen, onClose, gameState, onSelectAvatar }) => {
    if (!isOpen) return null;

    const availableAvatars = Object.values(definitions.avatars).filter(avatar => {
        // Логика разблокировки аватаров (если она будет). Пока все доступны.
        // if (avatar.unlockCondition) {
        //     if (avatar.unlockCondition.type === 'achievement' && !gameState.completedAchievements.includes(avatar.unlockCondition.id)) {
        //         return false;
        //     }
        //     // Добавить другие условия разблокировки
        // }
        return true;
    });

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div
                className="bg-gray-900 border-2 border-gray-700 rounded-lg shadow-2xl p-6 w-full max-w-2xl h-3/4 flex flex-col modal-content"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-cinzel text-2xl text-orange-400">Выберите Аватар</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white material-icons-outlined">close</button>
                </div>

                <div className="grow overflow-y-auto pr-2 grid grid-cols-3 md:grid-cols-4 gap-4 p-2">
                    {availableAvatars.map(avatar => (
                        <div
                            key={avatar.id}
                            className={`
                                relative p-2 rounded-lg border-2 flex flex-col items-center text-center
                                interactive-element cursor-pointer
                                ${gameState.playerAvatarId === avatar.id ? 'border-yellow-500 shadow-lg' : 'border-gray-700 hover:border-orange-500'}
                            `}
                            onClick={() => onSelectAvatar(avatar.id)}
                        >
                            <img src={avatar.src} alt={avatar.name} className="w-24 h-24 object-cover rounded-full mb-2" />
                            <p className="text-white text-sm font-bold">{avatar.name}</p>
                            {gameState.playerAvatarId === avatar.id && (
                                <span className="material-icons-outlined text-yellow-400 text-xl absolute top-1 right-1">check_circle</span>
                            )}
                            {/* Если аватар заблокирован, можно добавить оверлей и тултип */}
                            {/* {!isUnlocked && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                                    <Tooltip text="Выполните достижение X для разблокировки">
                                        <span className="material-icons-outlined text-red-400 text-4xl">lock</span>
                                    </Tooltip>
                                </div>
                            )} */}
                        </div>
                    ))}
                </div>

                <button onClick={onClose} className="interactive-element mt-6 w-full bg-orange-600 text-black font-bold py-2 px-4 rounded-lg hover:bg-orange-500">
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default AvatarSelectionModal;
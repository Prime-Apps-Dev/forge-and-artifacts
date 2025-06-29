// src/components/modals/AvatarSelectionModal.jsx
import React from 'react';
import { definitions } from '../../data/definitions/index.js';
import { useGame } from '../../context/GameContext.jsx';
import Button from '../ui/buttons/Button.jsx';
import { useDraggableModal } from '../../hooks/useDraggableModal.js';
import ModalDragHandle from '../ui/display/ModalDragHandle.jsx';

const AvatarSelectionModal = ({ isOpen, onClose }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const { touchHandlers } = useDraggableModal(onClose);

    if (!isOpen) return null;

    const availableAvatars = Object.values(definitions.avatars);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-end justify-center md:items-center z-50 modal-backdrop" onClick={onClose}>
            <div
                className="bg-gray-900 border-t-2 md:border-2 border-gray-700 w-full rounded-t-2xl md:rounded-lg shadow-2xl p-6 flex flex-col modal-content animate-slide-in-up md:animate-none md:relative md:max-w-2xl h-[85vh] md:h-3/4"
                onClick={e => e.stopPropagation()}
                {...touchHandlers}
            >
                {/* Mobile Drag Handle */}
                <ModalDragHandle />

                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="font-cinzel text-2xl text-orange-400">Выберите Аватар</h2>
                    <button onClick={onClose} className="hidden md:block text-gray-400 hover:text-white material-icons-outlined">close</button>
                </div>

                <div className="grow overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2">
                    {availableAvatars.map(avatar => (
                        <div
                            key={avatar.id}
                            className={`
                                relative p-2 rounded-lg border-2 flex flex-col items-center justify-center text-center
                                interactive-element cursor-pointer aspect-square
                                ${gameState.playerAvatarId === avatar.id ? 'border-yellow-500 shadow-lg' : 'border-gray-700 hover:border-orange-500'}
                            `}
                            onClick={() => handlers.handleSelectAvatar(avatar.id)}
                        >
                            <img src={avatar.src} alt={avatar.name} className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-full mb-2" />
                            <p className="text-white text-xs md:text-sm font-bold">{avatar.name}</p>
                            {gameState.playerAvatarId === avatar.id && (
                                <span className="material-icons-outlined text-yellow-400 text-xl absolute top-1 right-1">check_circle</span>
                            )}
                        </div>
                    ))}
                </div>

                <Button onClick={onClose} className="mt-6 flex-shrink-0 hidden md:block">
                    Закрыть
                </Button>
            </div>
        </div>
    );
};

export default AvatarSelectionModal;
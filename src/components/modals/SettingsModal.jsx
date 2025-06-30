// src/components/modals/SettingsModal.jsx
import React from 'react';
import { useGame } from '../../context/useGame.js';
import Button from '../ui/buttons/Button.jsx';
import { useDraggableModal } from '../../hooks/useDraggableModal.js';
import ModalDragHandle from '../ui/display/ModalDragHandle.jsx';

const SettingsModal = ({ onClose }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const { touchHandlers } = useDraggableModal(onClose);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-end justify-center md:items-center z-50 modal-backdrop" onClick={onClose}>
            <div 
                className="bg-gray-900 border-t-2 md:border-2 border-orange-500 w-full rounded-t-2xl md:rounded-lg shadow-2xl p-6 flex flex-col modal-content animate-slide-in-up md:animate-none md:relative md:max-w-md max-h-[85vh] md:h-auto"
                onClick={e => e.stopPropagation()}
                {...touchHandlers}
            >
                {/* 2. Заменяем старый блок */}
                <ModalDragHandle />

                <h2 className="font-cinzel text-2xl mb-6 text-white text-center">Настройки</h2>
                <div className="space-y-6 flex-grow overflow-y-auto px-2">
                    <div>
                        <label htmlFor="music-volume" className="block text-lg text-gray-300 mb-2">Громкость музыки: {gameState.settings.musicVolume}%</label>
                        <input type="range" id="music-volume" min="0" max="100" value={gameState.settings.musicVolume} onChange={(e) => handlers.handleVolumeChange('music', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                    </div>
                    <div>
                        <label htmlFor="sfx-volume" className="block text-lg text-gray-300 mb-2">Громкость эффектов: {gameState.settings.sfxVolume}%</label>
                        <input type="range" id="sfx-volume" min="0" max="100" value={gameState.settings.sfxVolume} onChange={(e) => handlers.handleVolumeChange('sfx', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                    </div>
                </div>

                <div className="mt-auto pt-4 space-y-2">
                    <Button onClick={() => { onClose(); handlers.handleOpenCreditsModal(); }} variant="secondary">
                        Благодарности и Авторы
                    </Button>
                    <Button onClick={handlers.handleResetGame} variant="danger">
                        Сбросить весь прогресс
                    </Button>
                    <Button onClick={onClose} variant="primary">Закрыть</Button>
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;
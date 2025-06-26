// src/components/modals/SettingsModal.jsx
import React from 'react';
import { useGame } from '../../context/GameContext.jsx';
import Button from '../ui/buttons/Button.jsx';

const SettingsModal = ({ onClose }) => {
    const { displayedGameState: gameState, handlers } = useGame();

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div className="bg-gray-900 border-2 border-gray-700 rounded-lg shadow-2xl p-6 w-full max-w-md text-center modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="font-cinzel text-2xl mb-6 text-white">Настройки</h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="music-volume" className="block text-lg text-gray-300 mb-2">Громкость музыки: {gameState.settings.musicVolume}%</label>
                        <input type="range" id="music-volume" min="0" max="100" value={gameState.settings.musicVolume} onChange={(e) => handlers.handleVolumeChange('music', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                    </div>
                    <div>
                        <label htmlFor="sfx-volume" className="block text-lg text-gray-300 mb-2">Громкость эффектов: {gameState.settings.sfxVolume}%</label>
                        <input type="range" id="sfx-volume" min="0" max="100" value={gameState.settings.sfxVolume} onChange={(e) => handlers.handleVolumeChange('sfx', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                    </div>
                </div>

                <Button onClick={handlers.handleOpenCreditsModal} variant="secondary" className="mt-6">
                    Благодарности и Авторы
                </Button>

                <Button onClick={handlers.handleResetGame} variant="danger" className="mt-4">
                    Сбросить весь прогресс
                </Button>

                <Button onClick={onClose} variant="primary" className="mt-4">Закрыть</Button>
            </div>
        </div>
    );
}

export default SettingsModal;
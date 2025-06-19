import React from 'react';

const SettingsModal = ({ settings, onClose, onVolumeChange, onResetGame }) => ( // НОВОЕ: onResetGame
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
        <div className="bg-gray-900 border-2 border-gray-700 rounded-lg shadow-2xl p-6 w-full max-w-md text-center modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="font-cinzel text-2xl mb-6">Настройки</h2>
            <div className="space-y-6">
                <div>
                    <label htmlFor="music-volume" className="block text-lg text-gray-300 mb-2">Громкость музыки: {settings.musicVolume}%</label>
                    <input type="range" id="music-volume" min="0" max="100" value={settings.musicVolume} onChange={(e) => onVolumeChange('music', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                </div>
                <div>
                    <label htmlFor="sfx-volume" className="block text-lg text-gray-300 mb-2">Громкость эффектов: {settings.sfxVolume}%</label>
                    <input type="range" id="sfx-volume" min="0" max="100" value={settings.sfxVolume} onChange={(e) => onVolumeChange('sfx', e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                </div>
            </div>

            {/* НОВАЯ КНОПКА: Сбросить прогресс */}
            <button
                onClick={onResetGame}
                className="interactive-element mt-8 w-full bg-red-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600"
            >
                Сбросить весь прогресс
            </button>

            <button onClick={onClose} className="interactive-element mt-4 w-full bg-orange-600 text-black font-bold py-2 px-4 rounded-lg hover:bg-orange-500">Закрыть</button>
        </div>
    </div>
);

export default SettingsModal;
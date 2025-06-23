// src/components/layout/BottomBar.jsx
import React from 'react';
import { formatNumber } from '../../utils/formatters';
import Tooltip from '../ui/display/Tooltip'; // Обновленный путь
import { definitions } from '../../data/definitions';
import { IMAGE_PATHS } from '../../constants/paths';

const BottomBar = ({ gameState, onToggleInventoryModal, onToggleSettingsModal, onToggleProfileModal, isBottomBarVisible, onToggleBottomBarVisibility }) => {
    const progress = gameState.masteryXP / gameState.masteryXPToNextLevel * 100;

    const currentAvatarSrc = definitions.avatars[gameState.playerAvatarId]?.src || IMAGE_PATHS.AVATARS.DEFAULT_MALE;

    return (
        <div className={`
            fixed bottom-8 left-1/2 -translate-x-1/2 z-40
            p-2 rounded-xl
            bg-gray-900/70 border border-gray-700 backdrop-blur-md
            flex items-center justify-between
            transition-all duration-300 ease-in-out
            ${isBottomBarVisible ? 'w-max px-4 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'}
        `}>
            <div className="flex items-center">
                <Tooltip text="Открыть профиль">
                    <button
                        onClick={onToggleProfileModal}
                        className="interactive-element flex items-center gap-2 p-2 rounded-lg focus:outline-none"
                    >
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-800">
                            <img src={currentAvatarSrc} alt="Аватар" className="object-cover w-full h-full" />
                            <div className="absolute bottom-0 left-0 w-full bg-yellow-500 text-center text-xs font-bold text-black rounded-sm">{gameState.masteryLevel}</div>
                        </div>
                        <div className="text-left text-white text-xs">
                            Мастер
                            <div className="relative w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="text-gray-400">{formatNumber(gameState.masteryXP)} / {formatNumber(gameState.masteryXPToNextLevel)}</div>
                        </div>
                    </button>
                </Tooltip>
                <div className="h-8 border-r border-gray-700 mx-2"></div>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-white">
                    <span className="material-icons-outlined text-yellow-400 text-xl">bolt</span>
                    <span className="text-sm font-bold">{formatNumber(gameState.sparks)}</span>
                </div>
                <div className="flex items-center gap-1 text-white">
                    <span className="material-icons-outlined text-purple-400 text-xl">bubble_chart</span>
                    <span className="text-sm font-bold">{formatNumber(gameState.matter)}</span>
                </div>
                <div className="h-8 border-r border-gray-700 mx-1"></div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onToggleInventoryModal}
                    className="interactive-element p-2 rounded-lg hover:bg-white/10 focus:outline-none"
                    title="Инвентарь"
                >
                    <span className="material-icons-outlined text-white text-xl">backpack</span>
                </button>
                <button
                    onClick={onToggleSettingsModal}
                    className="interactive-element p-2 rounded-lg hover:bg-white/10 focus:outline-none"
                    title="Настройки"
                >
                    <span className="material-icons-outlined text-white text-xl">settings</span>
                </button>

                <div className="h-8 border-r border-gray-700 mx-1"></div>

                <button
                    onClick={onToggleBottomBarVisibility}
                    className="interactive-element p-2 rounded-lg hover:bg-white/10 focus:outline-none"
                    title="Скрыть панель"
                >
                    <span className="material-icons-outlined text-white text-xl">keyboard_arrow_down</span>
                </button>
            </div>
        </div>
    );
};

export default BottomBar;
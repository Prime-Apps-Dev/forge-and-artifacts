// src/components/modals/ProfileModal.jsx
import React, { useState } from 'react';
import { formatNumber } from '../../utils/helpers';
import { definitions } from '../../data/definitions';
import AchievementsPanel from '../panels/AchievementsPanel';
import StatsPanel from '../panels/StatsPanel';
import Tooltip from '../ui/Tooltip';

const ProfileModal = ({ isOpen, onClose, gameState, handlers }) => {
    if (!isOpen) return null;

    const [activeTab, setActiveTab] = useState('profile'); // Состояние для активной вкладки: 'profile' или 'achievements'

    const experienceProgress = (gameState.masteryXP / gameState.masteryXPToNextLevel) * 100;
    const masterName = "Мастер-кузнец"; // Пока плейсхолдер для имени мастера

    // Проверка, все ли артефакты созданы
    const allArtifactsCompleted = Object.values(gameState.artifacts).every(artifact => artifact.status === 'completed');

    // Получаем путь к текущему аватару
    const currentAvatarSrc = definitions.avatars[gameState.playerAvatarId]?.src || '/img/default_avatar.png';

    // Определяем иконку и текст тултипа для кнопки переключения
    const toggleButtonIcon = activeTab === 'profile' ? 'emoji_events' : 'person'; // Если на профиле, показываем кубок; если на достижениях, показываем профиль
    const toggleButtonTooltip = activeTab === 'profile' ? 'Показать достижения' : 'Показать профиль';

    const handleToggleView = () => {
        setActiveTab(prevTab => prevTab === 'profile' ? 'achievements' : 'profile');
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div
                className="bg-gray-900 border-2 border-gray-700 rounded-lg shadow-2xl p-6 w-full max-w-4xl h-3/4 flex flex-col modal-content"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-cinzel text-2xl text-orange-400">
                        {activeTab === 'profile' ? 'Профиль Мастера' : 'Достижения'} {/* Заголовок меняется в зависимости от вкладки */}
                    </h2>
                    <div className="flex items-center gap-2"> {/* Обертка для кнопок */}
                        {/* Кнопка переключения вида: иконка меняется */}
                        <Tooltip text={toggleButtonTooltip}>
                            <button
                                onClick={handleToggleView}
                                className="interactive-element p-2 rounded-lg material-icons-outlined text-gray-400 hover:text-white"
                            >
                                {toggleButtonIcon}
                            </button>
                        </Tooltip>
                        {/* Кнопка закрытия модалки */}
                        <button onClick={onClose} className="text-gray-400 hover:text-white material-icons-outlined">close</button>
                    </div>
                </div>

                {/* УДАЛЕНО: Вкладки навигации */}
                {/*
                <div className="flex border-b border-gray-700 mb-4">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 py-2 text-center font-cinzel text-lg ${activeTab === 'profile' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-500 hover:text-white'}`}
                    >
                        Обзор
                    </button>
                    <button
                        onClick={() => setActiveTab('achievements')}
                        className={`flex-1 py-2 text-center font-cinzel text-lg ${activeTab === 'achievements' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-500 hover:text-white'}`}
                    >
                        Достижения
                    </button>
                </div>
                */}


                <div className="grow overflow-y-auto overflow-x-visible pr-2">
                    {activeTab === 'profile' && (
                        <>
                            {/* Общая информация о мастере */}
                            <div className="bg-black/30 p-4 rounded-md mb-6 border border-gray-700 flex items-start gap-6">
                                {/* Аватарка */}
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-800 border-2 border-yellow-500 shadow-lg">
                                        <img src={currentAvatarSrc} alt="Аватар Мастера" className="object-cover w-full h-full" />
                                    </div>
                                    <button
                                        onClick={handlers.handleOpenAvatarSelectionModal}
                                        className="interactive-element mt-2 text-xs bg-gray-700 text-white px-3 py-1 rounded-full hover:bg-gray-600"
                                    >
                                        Сменить аватар
                                    </button>
                                </div>

                                {/* Информация о мастерстве и прогрессе XP */}
                                <div className="flex-1 flex flex-col items-start pt-2">
                                    <p className="font-cinzel text-2xl font-bold text-white mb-2">{masterName}</p>

                                    <div className="flex items-baseline gap-2 w-full">
                                        <span className="font-cinzel text-5xl font-bold text-yellow-400 leading-none flex-shrink-0">
                                            {gameState.masteryLevel}
                                        </span>
                                        <Tooltip text="Ваш текущий опыт / Опыт до следующего уровня">
                                            <div className="relative flex-1 h-8 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                                <div
                                                    className="bg-yellow-500 h-full rounded-full absolute top-0 left-0 transition-all duration-300 ease-out"
                                                    style={{ width: `${experienceProgress}%` }}
                                                ></div>
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <span className="text-base font-bold text-white z-10">
                                                        {formatNumber(gameState.masteryXP, true)} / {formatNumber(gameState.masteryXPToNextLevel, true)} XP
                                                    </span>
                                                    <div
                                                        className="absolute inset-0 overflow-hidden"
                                                        style={{ width: `${experienceProgress}%` }}
                                                    >
                                                        <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-black whitespace-nowrap">
                                                            {formatNumber(gameState.masteryXP, true)} / {formatNumber(gameState.masteryXPToNextLevel, true)} XP
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tooltip>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full">
                                        <div className="flex items-center gap-2">
                                            <span className="material-icons-outlined text-blue-400 text-3xl">store</span>
                                            <div>
                                                <p className="text-gray-400 text-sm">Репутация Магазина:</p>
                                                <p className="font-cinzel text-xl font-bold text-white">{formatNumber(gameState.shopReputation || 0, true)}</p>
                                            </div>
                                        </div>
                                        {gameState.specialization && definitions.specializations[gameState.specialization] && (
                                            <div className="flex items-center gap-2">
                                                <span className="material-icons-outlined text-orange-400 text-3xl">{definitions.specializations[gameState.specialization].icon}</span>
                                                <div>
                                                    <p className="text-gray-400 text-sm">Специализация:</p>
                                                    <p className="font-cinzel text-xl font-bold text-white">{definitions.specializations[gameState.specialization].name}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* --- КНОПКА ПЕРЕСЕЛЕНИЯ --- */}
                            <div className="bg-black/30 p-4 rounded-md mb-6 border border-gray-700 text-center">
                                <h3 className="font-cinzel text-xl text-yellow-400 mb-3">Наследие Мастера</h3>
                                {allArtifactsCompleted ? (
                                    <button
                                        onClick={handlers.handleStartNewSettlement}
                                        className="interactive-element w-full bg-orange-600 text-black font-bold py-2 px-4 rounded-lg hover:bg-orange-500"
                                    >
                                        Основать новую мастерскую
                                    </button>
                                ) : (
                                    <Tooltip text="Создайте все Великие Артефакты, чтобы разблокировать эту возможность.">
                                        <button
                                            disabled
                                            className="w-full bg-gray-600 text-gray-400 font-bold py-2 px-4 rounded-lg cursor-not-allowed opacity-70"
                                        >
                                            Основать новую мастерскую (Требуется: Все Артефакты)
                                        </button>
                                    </Tooltip>
                                )}
                                <p className="text-gray-500 text-sm mt-2">После переселения вы получите Осколки Памяти и откроете новые возможности.</p>
                            </div>

                            {/* Раздел Статистики */}
                            <StatsPanel gameState={gameState} />
                        </>
                    )}

                    {activeTab === 'achievements' && (
                         <div className="mt-6 mx-auto w-full max-w-full px-2">
                            <AchievementsPanel gameState={gameState} />
                        </div>
                    )}
                </div>

                {/* Кнопка закрытия модального окна */}
                <button onClick={onClose} className="interactive-element mt-6 w-full bg-orange-600 text-black font-bold py-2 px-4 rounded-lg hover:bg-orange-500">
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default ProfileModal;
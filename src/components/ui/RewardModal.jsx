import React from 'react';
import { formatNumber } from '../../utils/helpers';
import { definitions } from '../../data/definitions';
import SvgIcon from './SvgIcon';

const RewardModal = ({ orderInfo, onClose }) => {
    if (!orderInfo) return null;

    // Проверяем, является ли это наградой за артефакт
    if (orderInfo.isArtifact) {
        const artifact = definitions.greatArtifacts[orderInfo.artifactId];
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 modal-backdrop">
                <div className="bg-gray-900 border-4 border-yellow-500 rounded-lg shadow-2xl p-8 w-full max-w-lg text-center modal-content">
                    <h2 className={`font-cinzel text-3xl mb-4 flex items-center justify-center gap-3 text-yellow-300 text-shadow-glow`}>
                        <span className="material-icons-outlined text-4xl">workspace_premium</span> Шедевр Создан!
                    </h2>
                    <p className="text-gray-300 mb-4">Вы выковали легендарный предмет:</p>
                    <div className="my-6 flex flex-col items-center gap-4">
                        <SvgIcon iconId={artifact.icon} className="icon-sprite-lg text-orange-400" style={{width: '80px', height: '80px'}} />
                        <h3 className="font-cinzel text-2xl font-bold text-white">{artifact.name}</h3> {/* ИСПРАВЛЕНО: Цвет текста белый */}
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 space-y-2">
                        <h4 className="font-bold text-lg text-yellow-400">Получен постоянный бонус:</h4>
                        <p className="text-gray-300">{artifact.description}</p>
                    </div>

                    <button onClick={onClose} className="interactive-element mt-8 w-full bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 text-lg">
                        Вечная Слава!
                    </button>
                </div>
            </div>
        )
    }

    // Стандартное модальное окно для обычных заказов
    const { item, sparks, matter, tier, reputationChange } = orderInfo;
    const tierInfo = {
        gold: { text: "Золотое время!", color: "text-yellow-400", icon: "emoji_events" },
        silver: { text: "Серебряное время!", color: "text-gray-300", icon: "military_tech" },
        bronze: { text: "Заказ выполнен", color: "text-orange-400", icon: "task_alt" }
    };
    const currentTier = tierInfo[tier];

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 modal-backdrop">
            <div className="bg-gray-800 border-2 border-orange-500 rounded-lg shadow-lg p-6 w-full max-w-md text-center modal-content">
                <h2 className={`font-cinzel text-2xl mb-2 flex items-center justify-center gap-2 ${currentTier.color}`}>
                    <span className="material-icons-outlined">{currentTier.icon}</span> {currentTier.text}
                </h2>
                <p className="text-gray-400 mb-4">Вы изготовили: <span className="font-bold text-white">{item.name}</span></p> {/* ИСПРАВЛЕНО: Цвет текста белый */}

                <div className="bg-black/20 rounded-lg p-4 space-y-3">
                    <h4 className="font-bold text-lg text-white">Полученные награды:</h4> {/* ИСПРАВЛЕНО: Цвет текста белый */}
                    <div className="flex justify-center items-center gap-4 text-xl">
                        <div className="flex items-center gap-1 text-white"> {/* ИСПРАВЛЕНО: Цвет текста белый */}
                            <span className="material-icons-outlined text-yellow-400">flash_on</span>
                            <span className="font-bold">{formatNumber(sparks)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-white"> {/* ИСПРАВЛЕНО: Цвет текста белый */}
                            <span className="material-icons-outlined text-purple-400">bubble_chart</span>
                            <span className="font-bold">{formatNumber(matter)}</span>
                        </div>
                    </div>
                    {reputationChange && Object.values(reputationChange).some(c => c !== 0) && (
                        <div className="pt-2 mt-2 border-t border-gray-600">
                            <h5 className="font-bold text-md text-white">Изменение репутации:</h5> {/* ИСПРАВЛЕНО: Цвет текста белый */}
                            {Object.entries(reputationChange).map(([factionId, change]) => {
                                if (change === 0) return null;
                                const factionDef = definitions.factions[factionId];
                                const changeColor = change > 0 ? `text-green-400` : `text-red-400`;
                                const sign = change > 0 ? '+' : '';
                                return (
                                    <div key={factionId} className={`flex items-center justify-center gap-2 text-sm ${changeColor}`}>
                                        <span className={`material-icons-outlined text-${factionDef.color}`}>{factionDef.icon}</span>
                                        <span className="text-white">{factionDef.name}: {sign}{change}</span> {/* ИСПРАВЛЕНО: Цвет текста белый */}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <button onClick={onClose} className="interactive-element mt-6 w-full bg-orange-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-orange-600">
                    Отлично!
                </button>
            </div>
        </div>
    );
};

export default RewardModal;
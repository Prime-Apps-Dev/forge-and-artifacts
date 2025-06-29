// src/components/ui/modals/RewardModal.jsx
import React from 'react';
import { formatNumber } from '../../../utils/formatters.jsx';
import { definitions } from '../../../data/definitions/index.js';
import { getArtifactImageSrc } from '../../../utils/helpers';
import Button from '../buttons/Button.jsx';
import { useGame } from '../../../context/GameContext.jsx';
import { useDraggableModal } from '../../../hooks/useDraggableModal.js';
import ModalDragHandle from '../display/ModalDragHandle.jsx';

const RewardModal = ({ orderInfo }) => {
    const { handlers } = useGame();
    const { touchHandlers } = useDraggableModal(handlers.handleCloseRewardModal);

    if (!orderInfo) return null;

    // ИСПРАВЛЕНИЕ: высота h-[85vh] заменена на max-h-[85vh] для адаптивности
    const commonModalClasses = "bg-gray-900 w-full rounded-t-2xl md:rounded-lg shadow-2xl p-6 flex flex-col modal-content animate-slide-in-up md:animate-none md:relative max-h-[85vh] md:h-auto";

    if (orderInfo.isArtifact) {
        const artifact = definitions.greatArtifacts[orderInfo.artifactId];
        const artifactImgSrc = getArtifactImageSrc(orderInfo.artifactId, 80);
        return (
            <div className="fixed inset-0 bg-black/80 flex items-end justify-center md:items-center z-50 modal-backdrop" onClick={handlers.handleCloseRewardModal}>
                <div 
                    className={`${commonModalClasses} border-t-2 md:border-4 border-yellow-500 md:max-w-lg text-center`} 
                    onClick={e => e.stopPropagation()}
                    {...touchHandlers}
                >
                    {/* Mobile Drag Handle */}
                    <ModalDragHandle />

                    <div className="flex-grow overflow-y-auto">
                        <h2 className={`font-cinzel text-3xl mb-4 flex items-center justify-center gap-3 text-yellow-300 text-shadow-glow`}>
                            <span className="material-icons-outlined text-4xl">workspace_premium</span> Шедевр Создан!
                        </h2>
                        <p className="text-gray-300 mb-4">Вы выковали легендарный предмет:</p>
                        <div className="my-6 flex flex-col items-center gap-4">
                            <img src={artifactImgSrc} alt={artifact.name} className="w-20 h-20 object-contain img-rounded-corners" />
                            <h3 className="font-cinzel text-2xl font-bold text-white">{artifact.name}</h3>
                        </div>
                        <div className="bg-black/30 rounded-lg p-4 space-y-2">
                            <h4 className="font-bold text-lg text-yellow-400">Получен постоянный бонус:</h4>
                            <p className="text-gray-300">{artifact.description}</p>
                        </div>
                    </div>
                    {/* ИСПРАВЛЕНИЕ: Кнопка теперь видна на всех устройствах */}
                    <Button onClick={handlers.handleCloseRewardModal} className="mt-8 bg-yellow-500 hover:enabled:bg-yellow-600 text-lg flex-shrink-0">
                        Вечная Слава!
                    </Button>
                </div>
            </div>
        )
    }

    const { item, sparks, matter, tier, reputationChange } = orderInfo;
    const tierInfo = {
        gold: { text: "Золотое время!", color: "text-yellow-400", icon: "emoji_events" },
        silver: { text: "Серебряное время!", color: "text-gray-300", icon: "military_tech" },
        bronze: { text: "Заказ выполнен", color: "text-orange-400", icon: "task_alt" }
    };
    const currentTier = tierInfo[tier];

    return (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center md:items-center z-50 modal-backdrop" onClick={handlers.handleCloseRewardModal}>
            <div 
                className={`${commonModalClasses} border-t-2 md:border-2 border-orange-500 md:max-w-md text-center`} 
                onClick={e => e.stopPropagation()}
                {...touchHandlers}
            >
                {/* Mobile Drag Handle */}
                <ModalDragHandle />

                <div className="flex-grow overflow-y-auto">
                    <h2 className={`font-cinzel text-2xl mb-2 flex items-center justify-center gap-2 ${currentTier.color}`}>
                        <span className="material-icons-outlined">{currentTier.icon}</span> {currentTier.text}
                    </h2>
                    <p className="text-gray-400 mb-4">Вы изготовили: <span className="font-bold text-white">{item.name}</span></p>
                    <div className="bg-black/20 rounded-lg p-4 space-y-3">
                        <h4 className="font-bold text-lg text-white">Полученные награды:</h4>
                        <div className="flex justify-center items-center gap-4 text-xl">
                            <div className="flex items-center gap-1 text-white">
                                <span className="material-icons-outlined text-yellow-400">flash_on</span>
                                <span className="font-bold">{formatNumber(sparks)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-white">
                                <span className="material-icons-outlined text-purple-400">bubble_chart</span>
                                <span className="font-bold">{formatNumber(matter)}</span>
                            </div>
                        </div>
                        {reputationChange && Object.values(reputationChange).some(c => c !== 0) && (
                            <div className="pt-2 mt-2 border-t border-gray-600">
                                <h5 className="font-bold text-md text-white">Изменение репутации:</h5>
                                {Object.entries(reputationChange).map(([factionId, change]) => {
                                    if (change === 0) return null;
                                    const factionDef = definitions.factions[factionId];
                                    const changeColor = change > 0 ? `text-green-400` : `text-red-400`;
                                    const sign = change > 0 ? '+' : '';
                                    return (
                                        <div key={factionId} className={`flex items-center justify-center gap-2 text-sm ${changeColor}`}>
                                            <span className={`material-icons-outlined text-${factionDef.color}`}>{factionDef.icon}</span>
                                            <span className="text-white">{factionDef.name}: {sign}{change}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
                {/* ИСПРАВЛЕНИЕ: Кнопка теперь видна на всех устройствах */}
                <Button onClick={handlers.handleCloseRewardModal} className="mt-6 flex-shrink-0">
                    Отлично!
                </Button>
            </div>
        </div>
    );
};

export default RewardModal;
// src/components/modals/ShopReputationModal.jsx
import React from 'react';
import { definitions } from '../../data/definitions/index.js';
import { formatNumber } from '../../utils/formatters.jsx';
import Tooltip from '../ui/display/Tooltip';
import { useGame } from '../../context/GameContext.jsx';
import Button from '../ui/buttons/Button.jsx';
import { useDraggableModal } from '../../hooks/useDraggableModal.js';
import ModalDragHandle from '../ui/display/ModalDragHandle.jsx';

const ShopReputationModal = ({ isOpen, onClose }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const { touchHandlers } = useDraggableModal(onClose);

    if (!isOpen) return null;

    const currentShopLevelDef = definitions.shopLevels.find(lvl => lvl.level === gameState.shopLevel) || definitions.shopLevels[definitions.shopLevels.length - 1];
    const shopXPProgress = gameState.shopXPToNextLevel > 0 ? (gameState.shopXP / gameState.shopXPToNextLevel) * 100 : 100;

    const formatRewardDetails = (rewardObject) => {
        if (!rewardObject) return '';
        return Object.entries(rewardObject).map(([key, value]) => {
            if (key === 'id' || key === 'apply' || key === 'icon') return null;
            if (key === 'shopShelf') return `${value} полка(и)`;
            if (key === 'sparks') return `${formatNumber(value)} искр`;
            if (key === 'matter') return `${formatNumber(value)} материи`;
            if (key === 'playerShopSalesSpeedModifier') return `+${(value*100).toFixed(0)}% скорости продаж`;
            if (key === 'tipChanceModifier') return `+${(value*100).toFixed(0)}% к шансу чаевых`;
            if (key === 'marketBuyModifier') return `-${(value*100).toFixed(0)}% к цене покупки`;
            if (key === 'marketTradeSpeedModifier') return `+${(value*100).toFixed(0)}% к скорости торговли`;
            if (key === 'inventoryCapacity') return `+${value} инвентаря`;
            return null;
        }).filter(Boolean).join(', ');
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-end justify-center md:items-center z-50 modal-backdrop" onClick={onClose}>
            <div
                className="bg-gray-900 border-t-2 md:border-2 border-yellow-500 w-full rounded-t-2xl md:rounded-lg shadow-2xl p-6 flex flex-col modal-content animate-slide-in-up md:animate-none md:relative md:max-w-2xl h-[85vh] md:max-h-[90vh]"
                onClick={e => e.stopPropagation()}
                {...touchHandlers}
            >
                {/* Mobile Drag Handle */}
                <ModalDragHandle />

                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="font-cinzel text-2xl text-yellow-400">Репутация Магазина</h2>
                    <button onClick={onClose} className="hidden md:block text-gray-400 hover:text-white material-icons-outlined">close</button>
                </div>

                <div className="grow overflow-y-auto pr-2">
                    <div className="bg-black/30 p-4 rounded-md mb-6 border border-gray-700 flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative flex-shrink-0 w-20 h-20 rounded-full bg-yellow-800 flex items-center justify-center text-yellow-200">
                            <span className="material-icons-outlined text-5xl">store</span>
                            <div className="absolute bottom-0 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-tl-lg rounded-br-lg">
                                Ур. {gameState.shopLevel}
                            </div>
                        </div>
                        <div className="flex-grow w-full">
                            <h3 className="font-cinzel text-xl text-white mb-1 text-center sm:text-left">
                                {currentShopLevelDef?.name || `Уровень ${gameState.shopLevel}`}
                            </h3>
                            <Tooltip text={`Текущий опыт магазина: ${formatNumber(gameState.shopXP, true)} / ${formatNumber(gameState.shopXPToNextLevel, true)}`}>
                                <div className="relative w-full h-6 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                    <div className="bg-yellow-500 h-full rounded-full absolute top-0 left-0 transition-all duration-300 ease-out" style={{ width: `${shopXPProgress}%` }}></div>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="text-sm font-bold text-white z-10 mix-blend-difference">{formatNumber(gameState.shopXP, true)} / {formatNumber(gameState.shopXPToNextLevel, true)} XP</span>
                                    </div>
                                </div>
                            </Tooltip>
                            <p className="text-sm text-gray-400 mt-2 text-center sm:text-left">{currentShopLevelDef?.description || "Развивайте свой магазин, чтобы получить бонусы!"}</p>
                        </div>
                    </div>

                    <div className="bg-black/30 p-4 rounded-md border border-gray-700">
                        <h3 className="font-cinzel text-xl text-orange-400 mb-3">Награды за Уровни Магазина</h3>
                        <div className="flex flex-col gap-2">
                            {definitions.shopLevels.map(levelDef => {
                                const isClaimed = levelDef.reward ? gameState.claimedShopLevelRewards.includes(levelDef.reward.id) : false;
                                const isAvailable = gameState.shopLevel >= levelDef.level && levelDef.reward && !isClaimed;
                                let rewardStatusText = `Ур. ${levelDef.level}`;
                                let statusColor = "text-gray-500";
                                if (isClaimed) { rewardStatusText = "Получено"; statusColor = "text-green-400"; } 
                                else if (isAvailable) { rewardStatusText = "Доступно!"; statusColor = "text-yellow-400 animate-pulse"; }
                                
                                return (
                                    <div key={levelDef.level} className={`p-3 rounded-lg border flex items-center gap-3 ${isClaimed ? 'bg-green-900/20 border-green-700' : isAvailable ? 'bg-yellow-900/20 border-yellow-700' : 'bg-gray-800/20 border-gray-700'}`}>
                                        <div className="flex-shrink-0"><span className={`material-icons-outlined text-3xl ${statusColor}`}>{levelDef.reward?.icon || 'grade'}</span></div>
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-white">{levelDef.name}</h4>
                                            {levelDef.description && <p className="text-sm text-gray-400">{levelDef.description}</p>}
                                            {levelDef.reward && Object.keys(levelDef.reward).length > 0 && (<p className="text-yellow-300 text-xs mt-1">Награда: {formatRewardDetails(levelDef.reward)}</p>)}
                                        </div>
                                        <div className="flex-shrink-0 text-right">
                                            <p className={`font-bold ${statusColor}`}>{rewardStatusText}</p>
                                            {isAvailable && (<Button onClick={() => handlers.handleClaimShopLevelReward(levelDef.reward.id)} className="mt-1 py-1 px-3 text-sm">Забрать</Button>)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <Button onClick={onClose} className="mt-6 flex-shrink-0 hidden md:block">
                    Закрыть
                </Button>
            </div>
        </div>
    );
};

export default ShopReputationModal;
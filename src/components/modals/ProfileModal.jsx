// src/components/modals/ProfileModal.jsx
import React, { useState, useMemo } from 'react';
import { formatNumber } from '../../utils/formatters.jsx';
import { definitions } from '../../data/definitions/index.js';
import AchievementsPanel from '../panels/AchievementsPanel';
import StatsPanel from '../panels/StatsPanel';
import Tooltip from '../ui/display/Tooltip';
import { IMAGE_PATHS } from '../../constants/paths';
import { useGame } from '../../context/GameContext.jsx';
import Button from '../ui/buttons/Button.jsx';
import { useDraggableModal } from '../../hooks/useDraggableModal.js';
import ModalDragHandle from '../ui/display/ModalDragHandle.jsx';

const IngotProgressBar = ({ progressPercentage, currentXp, xpToNextLevel }) => {
    const ingotImages = useMemo(() => [
        IMAGE_PATHS.INGOTS.IRON, IMAGE_PATHS.INGOTS.COPPER, IMAGE_PATHS.INGOTS.BRONZE,
        IMAGE_PATHS.INGOTS.SPARKSTEEL, IMAGE_PATHS.INGOTS.MITHRIL, IMAGE_PATHS.INGOTS.ADAMANTITE,
        IMAGE_PATHS.INGOTS.ARCANITE,
    ], []);
    const numIngots = 10;
    const getNextIngotImage = (lastImage) => {
        let newImage = lastImage;
        if (ingotImages.length > 1) {
            let attempts = 0;
            do { newImage = ingotImages[Math.floor(Math.random() * ingotImages.length)]; attempts++; } while (newImage === lastImage && attempts < 10);
        } else { newImage = ingotImages[0]; }
        return newImage;
    };
    const ingotSequence = useMemo(() => {
        let sequence = [];
        let lastImage = null;
        for (let i = 0; i < numIngots; i++) { const nextImage = getNextIngotImage(lastImage); sequence.push(nextImage); lastImage = nextImage; }
        return sequence;
    }, [ingotImages]);
    return (
        <div className="flex items-center justify-center gap-0.5 w-full relative h-12">
            {ingotSequence.map((src, index) => {
                const ingotStartPercent = (index / numIngots) * 100;
                const ingotEndPercent = ((index + 1) / numIngots) * 100;
                let currentIngotFill = 0;
                if (progressPercentage >= ingotEndPercent) currentIngotFill = 100;
                else if (progressPercentage > ingotStartPercent) currentIngotFill = (progressPercentage - ingotStartPercent) * numIngots;
                const clipPathValue = `inset(0 ${100 - currentIngotFill}% 0 0)`;
                return (
                    <div key={index} className="relative h-full w-full flex-1">
                        <img src={src} alt="Слиток (серый)" className="w-full h-full object-contain" style={{ filter: 'grayscale(100%)' }} />
                        <img src={src} alt="Слиток (цветной)" className="absolute inset-0 w-full h-full object-contain" style={{ clipPath: clipPathValue, transition: 'clip-path 0.3s linear' }} />
                    </div>
                );
            })}
            <span className="absolute text-sm font-bold text-white z-10" style={{ fontSize: '12px' }}>{formatNumber(currentXp, true)} / {formatNumber(xpToNextLevel, true)} XP</span>
        </div>
    );
};

const ProfileModal = ({ isOpen, onClose }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const { touchHandlers } = useDraggableModal(onClose);

    if (!isOpen) return null;
    const [activeTab, setActiveTab] = useState('profile');
    const [editingName, setEditingName] = useState(false);
    const [newName, setNewName] = useState(gameState.playerName);
    const experienceProgress = (gameState.masteryXPToNextLevel > 0) ? (gameState.masteryXP / gameState.masteryXPToNextLevel) * 100 : 100;
    const playerRankName = useMemo(() => {
        let rank = definitions.playerRanks[0];
        for (let i = definitions.playerRanks.length - 1; i >= 0; i--) { if (gameState.masteryLevel >= definitions.playerRanks[i].level) { rank = definitions.playerRanks[i]; break; } }
        return rank.name;
    }, [gameState.masteryLevel]);
    const allArtifactsCompleted = useMemo(() => Object.values(gameState.artifacts).every(artifact => artifact.status === 'completed'), [gameState.artifacts]);
    const currentAvatarSrc = definitions.avatars[gameState.playerAvatarId]?.src || IMAGE_PATHS.AVATARS.DEFAULT_MALE;
    const handleSaveName = () => { if (newName.trim() !== '') { handlers.handleSetPlayerName(newName.trim()); setEditingName(false); } };
    const handleKeyDown = (e) => { if (e.key === 'Enter') handleSaveName(); };
    const formatRewardDetails = (rewardObject) => {
        if (!rewardObject) return '';
        return Object.entries(rewardObject).map(([key, value]) => {
            if (key === 'id' || key === 'apply' || key === 'icon') return null;
            if (key === 'sparks') return `${formatNumber(value)} искр`;
            if (key === 'matter') return `${formatNumber(value)} материи`;
            if (key === 'ironOre') return `${formatNumber(value)} жел. руды`;
            if (key === 'passiveIncomeModifier') return `+${(value * 100).toFixed(0)}% подмастерьев`;
            if (key === 'progressPerClick') return `+${value} прогресса/клик`;
            if (key === 'matterCostReduction') return `-${(value * 100).toFixed(0)}% стоимости материи`;
            if (key === 'reputationGainModifier') {
                if (typeof value === 'object') { return Object.entries(value).map(([facId, amt]) => `+${(amt * 100).toFixed(0)}% реп. ${definitions.factions[facId]?.name || facId}`).join(', '); }
                return `+${(value * 100).toFixed(0)}% репутации`;
            }
            if (key === 'smeltingSpeedModifier') return `+${(value * 100).toFixed(0)}% скорости плавки`;
            if (key === 'orePerClick') return `+${value} руды/клик`;
            if (key === 'critChance') return `+${(value * 100).toFixed(1)}% крит. шанса`;
            if (key === 'marketTradeSpeedModifier') return `+${(value * 100).toFixed(0)}% скорости торговли`;
            if (key === 'expeditionMapCostModifier') return `-${(value * 100).toFixed(0)}% карт вылазок`;
            if (key === 'masteryXpModifier') return `+${(value * 100).toFixed(0)}% XP`;
            if (key === 'critBonus') return `+${value.toFixed(1)} к множ. крита`;
            if (key === 'passiveGeneration') {
                const genDetails = Object.entries(value).map(([res, amt]) => `${formatNumber(amt)} ${res.replace('Ore', ' руды').replace('Ingots', ' слитки')}`).join(', ');
                return `Пасс. ген. (${genDetails})`;
            }
            if (key === 'marketBuyModifier') return `-${(value * 100).toFixed(0)}% цены покупки`;
            if (key === 'playerShopSalesSpeedModifier') return `+${(value * 100).toFixed(0)}% скорости продаж`;
            if (key === 'tipChanceModifier') return `+${(value * 100).toFixed(0)}% к шансу чаевых`;
            if (key === 'prestigePointsGainModifier') return `+${(value * 100).toFixed(0)}% ОП`;
            return null;
        }).filter(Boolean).join(', ');
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-end justify-center md:items-center z-50 modal-backdrop" onClick={onClose}>
            <div 
                className="bg-gray-900 border-t-2 md:border-2 border-gray-700 w-full rounded-t-2xl md:rounded-lg shadow-2xl p-4 md:p-6 flex flex-col modal-content animate-slide-in-up md:animate-none md:relative md:max-w-4xl h-[85vh] md:h-3/4" 
                onClick={e => e.stopPropagation()}
                {...touchHandlers}
            >
                {/* Mobile Drag Handle */}
                <ModalDragHandle />

                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="font-cinzel text-xl md:text-2xl text-orange-400">{activeTab === 'profile' ? 'Профиль Мастера' : activeTab === 'achievements' ? 'Достижения' : 'Награды Мастерства'}</h2>
                    <div className="flex items-center gap-1 md:gap-2">
                        <Tooltip text="Репутация магазина"><button onClick={() => { onClose(); handlers.handleOpenShopReputationModal();}} className="interactive-element p-2 rounded-lg material-icons-outlined text-gray-400 hover:text-white">store</button></Tooltip>
                        <Tooltip text="Профиль"><button onClick={() => setActiveTab('profile')} className={`interactive-element p-2 rounded-lg material-icons-outlined ${activeTab === 'profile' ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}>person</button></Tooltip>
                        <Tooltip text="Достижения"><button onClick={() => setActiveTab('achievements')} className={`interactive-element p-2 rounded-lg material-icons-outlined ${activeTab === 'achievements' ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}>emoji_events</button></Tooltip>
                        <Tooltip text="Награды"><button onClick={() => setActiveTab('mastery_rewards')} className={`interactive-element p-2 rounded-lg material-icons-outlined ${activeTab === 'mastery_rewards' ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}>military_tech</button></Tooltip>
                        <button onClick={onClose} className="hidden md:block text-gray-400 hover:text-white material-icons-outlined">close</button>
                    </div>
                </div>
                <div className="grow overflow-y-auto pr-2">
                    {activeTab === 'profile' && (
                        <>
                            <div className="bg-black/30 p-4 rounded-md mb-6 border border-gray-700 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                                <div className="flex flex-col items-center flex-shrink-0"><div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-800 border-2 border-yellow-500 shadow-lg"><img src={currentAvatarSrc} alt="Аватар Мастера" className="object-cover w-full h-full" /></div><button onClick={() => { onClose(); handlers.handleOpenAvatarSelectionModal(); }} className="interactive-element mt-2 text-xs bg-gray-700 text-white px-3 py-1 rounded-full hover:bg-gray-600">Сменить</button></div>
                                <div className="flex-1 flex flex-col items-center md:items-start w-full"><div className="flex items-baseline gap-2 mb-0">{editingName ? (<input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={handleKeyDown} className="bg-gray-700 text-white text-xl p-1 rounded outline-none focus:ring-2 focus:ring-orange-500" maxLength={20}/>) : (<p className="font-cinzel text-2xl font-bold text-white">{gameState.playerName}</p>)}<button onClick={editingName ? handleSaveName : () => setEditingName(true)} className="interactive-element material-icons-outlined text-xl">{editingName ? <span className="text-green-400">check</span> : <span className="text-gray-400 hover:text-white">edit</span>}</button></div><p className="text-base text-gray-400 mt-0.5 mb-2">Звание: <span className="font-bold text-white">{playerRankName}</span></p><div className="flex items-center gap-3 w-full"><span className="font-cinzel text-5xl font-bold text-yellow-400 leading-none flex-shrink-0">{gameState.masteryLevel}</span><Tooltip text={`Ваш текущий опыт: ${formatNumber(gameState.masteryXP, true)} / ${formatNumber(gameState.masteryXPToNextLevel, true)} XP`}><div className="relative flex-1 h-12 flex items-center justify-center"><IngotProgressBar progressPercentage={experienceProgress} currentXp={gameState.masteryXP} xpToNextLevel={gameState.masteryXPToNextLevel} /></div></Tooltip></div></div>
                            </div>
                            <div className="bg-black/30 p-4 rounded-md mb-6 border border-gray-700 text-center"><h3 className="font-cinzel text-xl text-yellow-400 mb-3">Наследие Мастера</h3>{allArtifactsCompleted ? (<Button onClick={() => { onClose(); handlers.handleStartNewSettlement(); }}>Основать новую мастерскую</Button>) : (<Tooltip text="Создайте все Великие Артефакты, чтобы разблокировать эту возможность."><div><Button disabled={true}>Основать новую мастерскую (Требуется: Все Артефакты)</Button></div></Tooltip>)}<p className="text-gray-500 text-sm mt-2">После переселения вы получите Осколки Памяти и откроете новые возможности.</p></div>
                            <StatsPanel />
                        </>
                    )}
                    {activeTab === 'achievements' && <AchievementsPanel />}
                    {activeTab === 'mastery_rewards' && (
                        <div className="w-full">
                            <h3 className="font-cinzel text-xl text-yellow-400 mb-3 text-center">Шкала Наград Мастерства</h3>
                            <p className="text-gray-400 text-sm mb-4 text-center">Получайте ценные бонусы за достижение новых уровней мастерства.</p>
                            <div className="space-y-3">
                                {Object.values(definitions.masteryLevelRewards).map(rewardDef => {
                                    const isClaimed = gameState.claimedMasteryLevelRewards.includes(rewardDef.id);
                                    const isAvailable = gameState.masteryLevel >= rewardDef.level && !isClaimed;
                                    let rewardStatusText = `Ур. ${rewardDef.level}`;
                                    let statusColor = "text-gray-500";
                                    if (isClaimed) { rewardStatusText = "Получено"; statusColor = "text-green-400"; } 
                                    else if (isAvailable) { rewardStatusText = "Доступно!"; statusColor = "text-yellow-400 animate-pulse"; }
                                    return (
                                        <div key={rewardDef.id} className={`p-3 rounded-lg flex items-center gap-4 border ${isClaimed ? 'bg-green-900/20 border-green-700' : isAvailable ? 'bg-blue-900/20 border-blue-700' : 'bg-black/30 border-gray-700 opacity-60'}`}>
                                            <div className="flex-shrink-0"><span className={`material-icons-outlined text-4xl ${statusColor}`}>{rewardDef.icon}</span></div>
                                            <div className="flex-grow"><h4 className={`font-cinzel text-lg font-bold ${isClaimed ? 'text-green-300' : 'text-white'}`}>{rewardDef.name}</h4><p className="text-gray-400 text-sm">{rewardDef.description}</p><p className="text-yellow-300 text-xs mt-1">Награда: {formatRewardDetails(rewardDef.reward)}</p></div>
                                            <div className="flex-shrink-0 text-right"><p className={`font-bold ${statusColor}`}>{rewardStatusText}</p>{isAvailable && (<button onClick={() => handlers.handleClaimMasteryReward(rewardDef.id)} className="interactive-element mt-1 bg-orange-600 text-black font-bold py-1 px-3 rounded-lg text-sm hover:bg-orange-500">Забрать</button>)}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
                 <Button onClick={onClose} className="mt-6 flex-shrink-0 hidden md:block">Закрыть</Button>
            </div>
        </div>
    );
};

export default ProfileModal;
// src/App.jsx
import React, { useState, memo, useRef, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { audioController } from './utils/audioController';
import { definitions } from './data/definitions';

// Импорты компонентов
import RewardModal from './components/ui/RewardModal';
import Toast from './components/ui/Toast';
import InventoryModal from './components/ui/InventoryModal';
import ForgeView from './components/views/ForgeView';
import MineView from './components/views/MineView';
import SmelterView from './components/views/SmelterView';
import ShopView from './components/views/ShopView';
import SkillsView from './components/views/SkillsView';
import ArtifactsView from './components/views/ArtifactsView';
import JournalView from './components/views/JournalView';
import GuildView from './components/views/GuildView';
import ResourcePanel from './components/panels/ResourcePanel';
import UpgradeShop from './components/panels/UpgradeShop';
import PersonnelView from './components/panels/PersonnelView';
import FactionsPanel from './components/panels/FactionsPanel';
import PlayerShopPanel from './components/panels/PlayerShopPanel';
import BottomBar from './components/layout/BottomBar';
import ProfileModal from './components/modals/ProfileModal';
import InfoModal from './components/modals/InfoModal';
import SettingsModal from './components/modals/SettingsModal';
import SpecializationModal from './components/ui/SpecializationModal';
import WorldMapModal from './components/modals/WorldMapModal';
import EternalSkillsView from './components/views/EternalSkillsView';
import AudioVisualizer from './components/effects/AudioVisualizer';
import AchievementRewardModal from './components/modals/AchievementRewardModal';
import AvatarSelectionModal from './components/modals/AvatarSelectionModal'; // <-- ОБЯЗАТЕЛЬНЫЙ ИМПОРТ
import CreditsModal from './components/modals/CreditsModal'; // <-- ОБЯЗАТЕЛЬНЫЙ ИМПОРТ

const LeftPanelButton = memo(({ viewId, icon, label, onClick, activeView }) => (
    <button onClick={() => onClick(viewId)} className={`interactive-element h-full flex-shrink-0 min-w-max px-4 font-cinzel text-base flex items-center justify-center gap-2 border-b-4 ${activeView === viewId ? 'text-orange-400 border-orange-400 bg-black/20' : 'text-gray-500 border-transparent hover:text-orange-400/70'}`}>
        <span className="material-icons-outlined">{icon}</span>{label}
    </button>
));

const RightPanelButton = memo(({ viewId, icon, label, onClick, activeView }) => (
    <button onClick={() => onClick(viewId)} className={`interactive-element h-full flex-shrink-0 min-w-max px-3 font-cinzel text-base flex items-center justify-center gap-2 border-b-2 ${activeView === viewId ? 'text-orange-400 border-orange-400 bg-black/20' : 'text-gray-500 border-transparent hover:text-orange-400/70'}`}>
        <span className="material-icons-outlined text-base">{icon}</span>{label}
    </button>
));

export default function App() {
    const {
        displayedGameState,
        isWorking,
        toasts,
        completedOrderInfo,
        isSpecializationModalOpen,
        isWorldMapModalOpen,
        isAchievementRewardModalOpen,
        achievementToDisplay,
        isAvatarSelectionModalOpen,
        isCreditsModalOpen, // <-- СОСТОЯНИЕ ДЛЯ CREDITSMODAL
        handlers,
        removeToast,
        activeInfoModal,
        handleInitialGesture,
    } = useGameState();

    const [activeLeftView, setActiveLeftView] = useState('forge');
    const [activeRightView, setActiveRightView] = useState('resources');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);

    const leftTabsRef = useRef(null);
    const rightTabsRef = useRef(null);

    useEffect(() => {
        const handleWheelScroll = (evt, element) => {
            if (element) {
                evt.preventDefault();
                element.scrollLeft += evt.deltaY;
            }
        };
        const leftTabsElement = leftTabsRef.current;
        const rightTabsElement = rightTabsRef.current;
        
        const leftWheelHandler = (e) => handleWheelScroll(e, leftTabsElement);
        if (leftTabsElement) {
            leftTabsElement.addEventListener('wheel', leftWheelHandler, { passive: false });
        }

        const rightWheelHandler = (e) => handleWheelScroll(e, rightTabsElement);
        if (rightTabsElement) {
            rightTabsElement.addEventListener('wheel', rightWheelHandler, { passive: false });
        }

        return () => {
            if (leftTabsElement) {
                leftTabsElement.removeEventListener('wheel', leftWheelHandler);
            }
            if (rightTabsElement) {
                rightTabsElement.removeEventListener('wheel', rightWheelHandler);
            }
        };
    }, []);

    const handleLeftViewChange = (viewId) => { audioController.play('click', 'C4', '16n'); setActiveLeftView(viewId); };
    const handleRightViewChange = (viewId) => { audioController.play('click', 'C4', '16n'); setActiveRightView(viewId); };

    return (
        <div onClick={handleInitialGesture} className="relative w-screen h-screen overflow-hidden">
            <AudioVisualizer />

            {isSpecializationModalOpen && <SpecializationModal onSelectSpecialization={handlers.handleSelectSpecialization} />}
            {/* Передаем onOpenCredits в SettingsModal */}
            {isSettingsOpen && <SettingsModal settings={displayedGameState.settings} onClose={() => setIsSettingsOpen(false)} onVolumeChange={handlers.handleVolumeChange} onResetGame={handlers.handleResetGame} onOpenCredits={handlers.handleOpenCreditsModal} />}
            {isInventoryOpen && <InventoryModal isOpen={isInventoryOpen} onClose={() => setIsInventoryOpen(false)} gameState={displayedGameState} handlers={handlers} />}
            {isProfileModalOpen && <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} gameState={displayedGameState} handlers={handlers} />}
            {activeInfoModal && (
                <InfoModal
                    isOpen={!!activeInfoModal}
                    onClose={handlers.handleCloseInfoModal}
                    title={activeInfoModal.title}
                    image={activeInfoModal.image}
                    message={activeInfoModal.message}
                    buttonText={activeInfoModal.buttonText}
                />
            )}
            <RewardModal orderInfo={completedOrderInfo} onClose={handlers.handleCloseRewardModal} />

            {isWorldMapModalOpen && (
                <WorldMapModal
                    isOpen={isWorldMapModalOpen}
                    onClose={handlers.handleCloseWorldMapModal}
                    gameState={displayedGameState}
                    onSelectRegion={handlers.handleSelectRegion}
                />
            )}
            {isAchievementRewardModalOpen && achievementToDisplay && (
                <AchievementRewardModal
                    isOpen={isAchievementRewardModalOpen}
                    onClose={handlers.handleCloseAchievementRewardModal}
                    achievement={achievementToDisplay}
                    onClaimReward={handlers.handleClaimAchievementReward}
                />
            )}
            {isAvatarSelectionModalOpen && (
                <AvatarSelectionModal
                    isOpen={isAvatarSelectionModalOpen}
                    onClose={handlers.handleCloseAvatarSelectionModal}
                    gameState={displayedGameState}
                    onSelectAvatar={handlers.handleSelectAvatar}
                />
            )}
            {/* РЕНДЕРИНГ CREDITS MODAL */}
            {isCreditsModalOpen && (
                <CreditsModal
                    isOpen={isCreditsModalOpen}
                    onClose={handlers.handleCloseCreditsModal}
                />
            )}

            <div className="game-container flex flex-col lg:flex-row h-screen py-4 px-2 gap-4 text-gray-200 max-w-[1500px] w-full mx-auto lg:mx-3 relative z-10">
                <div className="left-panel bg-gray-800/80 backdrop-blur-md border-2 border-gray-700 rounded-lg overflow-y-auto w-3/5">
                    <div ref={leftTabsRef} className="tabs flex items-center border-b-2 border-gray-700 h-16 sticky top-0 z-30 bg-gray-800/80 backdrop-blur-sm">
                        <LeftPanelButton viewId="forge" icon="hardware" label="Кузница" onClick={handleLeftViewChange} activeView={activeLeftView} />
                        <LeftPanelButton viewId="mine" icon="terrain" label="Шахта" onClick={handleLeftViewChange} activeView={activeLeftView} />
                        <LeftPanelButton viewId="smelter" icon="fireplace" label="Плавильня" onClick={handleLeftViewChange} activeView={activeLeftView} />
                        <LeftPanelButton viewId="shop" icon="shopping_cart" label="Лавка" onClick={handleLeftViewChange} activeView={activeLeftView} />
                        <LeftPanelButton viewId="skills" icon="schema" label="Навыки" onClick={handleLeftViewChange} activeView={activeLeftView} />
                        <LeftPanelButton viewId="artifacts" icon="auto_stories" label="Артефакты" onClick={handleLeftViewChange} activeView={activeLeftView} />
                        <LeftPanelButton viewId="journal" icon="book" label="Журнал" onClick={handleLeftViewChange} activeView={activeLeftView} />
                        <LeftPanelButton viewId="guild" icon="hub" label="Гильдия" onClick={handleLeftViewChange} activeView={activeLeftView} />
                    </div>
                    <div className="p-6">
                        {activeLeftView === 'forge' && <ForgeView gameState={displayedGameState} isWorking={isWorking} handlers={handlers} />}
                        {activeLeftView === 'mine' && <MineView gameState={displayedGameState} handlers={handlers} />}
                        {activeLeftView === 'smelter' && <SmelterView gameState={displayedGameState} handlers={handlers} />}
                        {activeLeftView === 'shop' && <ShopView gameState={displayedGameState} handlers={handlers} />}
                        {activeLeftView === 'skills' && <SkillsView gameState={displayedGameState} handlers={handlers} />}
                        {activeLeftView === 'artifacts' && <ArtifactsView gameState={displayedGameState} handlers={handlers} />}
                        {activeLeftView === 'journal' && <JournalView gameState={displayedGameState} handlers={handlers} />}
                        {activeLeftView === 'guild' && <GuildView gameState={displayedGameState} handlers={handlers} />}
                    </div>
                </div>

                <div className="right-panel bg-gray-800/80 backdrop-blur-md border-2 border-gray-700 rounded-lg overflow-y-auto w-2/5">
                    <div ref={rightTabsRef} className="tabs flex items-center border-b-2 border-gray-700 h-14 sticky top-0 z-30 bg-gray-800/80 backdrop-blur-sm">
                            <RightPanelButton viewId="resources" icon="inventory" label="Ресурсы" onClick={handleRightViewChange} activeView={activeRightView} />
                            <RightPanelButton viewId="playerShop" icon="shopping_bag" label="Мой магазин" onClick={handleRightViewChange} activeView={activeRightView} />
                            <RightPanelButton viewId="upgrades" icon="storefront" label="Улучшения" onClick={handleRightViewChange} activeView={activeRightView} />
                            <RightPanelButton viewId="personnel" icon="engineering" label="Персонал" onClick={handleRightViewChange} activeView={activeRightView} />
                            <RightPanelButton viewId="factions" icon="groups" label="Фракции" onClick={handleRightViewChange} activeView={activeRightView} />
                            <RightPanelButton viewId="eternalSkills" icon="psychology" label="Вечные Навыки" onClick={handleRightViewChange} activeView={activeRightView} />
                    </div>
                    <div className="p-6">
                        {activeRightView === 'resources' && <ResourcePanel gameState={displayedGameState} />}
                        {activeRightView === 'upgrades' && <UpgradeShop gameState={displayedGameState} handlers={handlers} />}
                        {activeRightView === 'personnel' && <PersonnelView gameState={displayedGameState} handlers={handlers} />}
                        {activeRightView === 'factions' && <FactionsPanel gameState={displayedGameState} handlers={handlers} />}
                        {activeRightView === 'playerShop' && <PlayerShopPanel gameState={displayedGameState} handlers={handlers} />}
                        {activeRightView === 'eternalSkills' && <EternalSkillsView gameState={displayedGameState} handlers={handlers} />}
                    </div>
                </div>
            </div>

            <BottomBar
                gameState={displayedGameState}
                onToggleInventoryModal={() => setIsInventoryOpen(true)}
                onToggleSettingsModal={() => setIsSettingsOpen(true)}
                onToggleProfileModal={() => setIsProfileModalOpen(true)}
                isBottomBarVisible={isBottomBarVisible}
                onToggleBottomBarVisibility={() => setIsBottomBarVisible(!isBottomBarVisible)}
            />

            {!isBottomBarVisible && (
                <button
                    onClick={() => setIsBottomBarVisible(true)}
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30
                               p-2 rounded-full
                               bg-gray-900/70 border border-gray-700 backdrop-blur-md
                               interactive-element hover:bg-gray-800/80 focus:outline-none
                               transition-all duration-300 ease-in-out pointer-events-auto"
                    title="Показать панель"
                >
                    <span className="material-icons-outlined text-gray-400 text-2xl">keyboard_arrow_up</span>
                </button>
            )}

            <div className="toast-container">
                    {toasts.map(toast => (
                        <Toast key={toast.id} id={toast.id} message={toast.message} type={toast.type} onRemove={removeToast} />
                    ))}
            </div>
        </div>
    );
}
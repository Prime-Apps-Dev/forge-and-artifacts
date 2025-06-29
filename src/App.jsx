// src/App.jsx
import React, { useState, memo, useRef, useEffect, useCallback } from 'react';
import { useGame } from './context/GameContext.jsx';
import { audioController } from './utils/audioController';
import RewardModal from './components/ui/modals/RewardModal';
import Toast from './components/ui/display/Toast';
import InventoryModal from './components/ui/modals/InventoryModal';
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
import BottomBar, { WorldEventIndicator } from './components/layout/BottomBar';
import ProfileModal from './components/modals/ProfileModal';
import InfoModal from './components/modals/InfoModal';
import SettingsModal from './components/modals/SettingsModal';
import SpecializationModal from './components/ui/modals/SpecializationModal';
import WorldMapModal from './components/modals/WorldMapModal';
import EternalSkillsView from './components/views/EternalSkillsView';
import AudioVisualizer from './components/effects/AudioVisualizer';
import AchievementRewardModal from './components/modals/AchievementRewardModal';
import AvatarSelectionModal from './components/modals/AvatarSelectionModal';
import CreditsModal from './components/modals/CreditsModal';
import HirePersonnelModal from './components/modals/HirePersonnelModal';
import ParticleEmitter from './components/effects/ParticleEmitter';
import LoadingScreen from './components/LoadingScreen';
import ShopReputationModal from './components/modals/ShopReputationModal.jsx';
import ManagePersonnelModal from './components/modals/ManagePersonnelModal.jsx';
// --- НОВЫЕ ИМПОРТЫ ---
import UpgradeItemModal from './components/modals/UpgradeItemModal.jsx';
import EquipItemModal from './components/modals/EquipItemModal.jsx';


const useHorizontalScroll = () => {
    const elRef = useRef();
    useEffect(() => {
        const el = elRef.current;
        if (el) {
            const onWheel = (e) => {
                if (e.deltaY == 0) return;
                e.preventDefault();
                el.scrollLeft += e.deltaY;
            };
            el.addEventListener('wheel', onWheel);
            return () => el.removeEventListener('wheel', onWheel);
        }
    }, []);
    return elRef;
};

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
        displayedGameState, toasts, completedOrderInfo, isSpecializationModalOpen,
        isWorldMapModalOpen, isAchievementRewardModalOpen, achievementToDisplay,
        isAvatarSelectionModalOpen, isCreditsModalOpen, isShopReputationModalOpen,
        isHirePersonnelModalOpen, isManagePersonnelModalOpen, managingPersonnelId, 
        // --- НОВЫЕ ЗНАЧЕНИЯ ИЗ КОНТЕКСТА ---
        isUpgradeItemModalOpen, itemToUpgradeId,
        isEquipItemModalOpen, personnelToEquip,
        // ------------------------------------
        handlers, removeToast, activeInfoModal,
        handleInitialGesture, assetsLoaded, loadProgress,
    } = useGame();

    const [activeLeftView, setActiveLeftView] = useState('forge');
    const [activeRightView, setActiveRightView] = useState('resources');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);
    
    const leftTabsRef = useHorizontalScroll();
    const rightTabsRef = useHorizontalScroll();

    const toggleBottomBarVisibility = () => setIsBottomBarVisible(prev => !prev);
    const handleLeftViewChange = (viewId) => { audioController.play('click', 'C4', '16n'); setActiveLeftView(viewId); };
    const handleRightViewChange = (viewId) => { audioController.play('click', 'C4', '16n'); setActiveRightView(viewId); };
    
    if (!assetsLoaded) {
        return <LoadingScreen progress={loadProgress} />;
    }

    return (
        <div onClick={handleInitialGesture} className="relative w-screen h-screen overflow-hidden">
            <AudioVisualizer />
            <ParticleEmitter />

            {isSpecializationModalOpen && <SpecializationModal onSelectSpecialization={handlers.handleSelectSpecialization} />}
            {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
            {isInventoryOpen && <InventoryModal isOpen={isInventoryOpen} onClose={() => setIsInventoryOpen(false)} />}
            {isProfileModalOpen && <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />}
            {isShopReputationModalOpen && <ShopReputationModal isOpen={isShopReputationModalOpen} onClose={handlers.handleCloseShopReputationModal} />}
            {isHirePersonnelModalOpen && <HirePersonnelModal isOpen={isHirePersonnelModalOpen} onClose={handlers.handleCloseHirePersonnelModal} />}
            {activeInfoModal && <InfoModal isOpen={!!activeInfoModal} onClose={handlers.handleCloseInfoModal} {...activeInfoModal} />}
            <RewardModal orderInfo={completedOrderInfo} />
            {isWorldMapModalOpen && <WorldMapModal isOpen={isWorldMapModalOpen} onClose={handlers.handleCloseWorldMapModal} />}
            {isAchievementRewardModalOpen && achievementToDisplay && <AchievementRewardModal isOpen={isAchievementRewardModalOpen} onClose={handlers.handleCloseAchievementRewardModal} achievement={achievementToDisplay} />}
            {isAvatarSelectionModalOpen && <AvatarSelectionModal isOpen={isAvatarSelectionModalOpen} onClose={handlers.handleCloseAvatarSelectionModal} />}
            {isCreditsModalOpen && <CreditsModal isOpen={isCreditsModalOpen} onClose={handlers.handleCloseCreditsModal} />}
            {isManagePersonnelModalOpen && <ManagePersonnelModal personnelId={managingPersonnelId} onClose={handlers.handleCloseManagePersonnelModal} />}
            {/* --- РЕНДЕР НОВЫХ МОДАЛЬНЫХ ОКОН --- */}
            {isUpgradeItemModalOpen && <UpgradeItemModal isOpen={isUpgradeItemModalOpen} onClose={handlers.handleCloseUpgradeItemModal} itemId={itemToUpgradeId} />}
            {isEquipItemModalOpen && <EquipItemModal isOpen={isEquipItemModalOpen} onClose={handlers.handleCloseEquipItemModal} personnelId={personnelToEquip.id} equipSlot={personnelToEquip.slot} />}


            <div className="game-container flex flex-col lg:flex-row h-screen py-4 px-2 gap-4 text-gray-200 max-w-[1500px] w-full mx-auto lg:mx-3 relative z-10">
                <div className="left-panel bg-gray-800/80 backdrop-blur-md border-2 border-gray-700 rounded-lg overflow-y-auto w-3/5">
                    <div ref={leftTabsRef} className="tabs flex items-center border-b-2 border-gray-700 h-16 sticky top-0 z-30 bg-gray-800/80 backdrop-blur-sm overflow-x-auto">
                        <LeftPanelButton viewId="forge" icon="hardware" label="Кузница" onClick={handleLeftViewChange} activeView={activeLeftView} />
                        <LeftPanelButton viewId="mine" icon="terrain" label="Шахта" onClick={handleLeftViewChange} activeView={activeLeftView} />
                        <LeftPanelButton viewId="smelter" icon="fireplace" label="Плавильня" onClick={handleLeftViewChange} activeView={activeLeftView} />
                        <LeftPanelButton viewId="shop" icon="shopping_cart" label="Лавка" onClick={handleLeftViewChange} activeView={activeLeftView} />
                        <LeftPanelButton viewId="skills" icon="schema" label="Навыки" onClick={handleLeftViewChange} activeView={activeLeftView} />
                        <LeftPanelButton viewId="artifacts" icon="auto_stories" label="Артефакты" onClick={handleLeftViewChange} activeView={activeLeftView} />
                        <LeftPanelButton viewId="journal" icon="book" label="Журнал" onClick={handleLeftViewChange} activeView={activeLeftView} />
                        {displayedGameState.purchasedSkills.guildContracts && (
                            <LeftPanelButton viewId="guild" icon="hub" label="Гильдия" onClick={handleLeftViewChange} activeView={activeLeftView} />
                        )}
                    </div>
                    <div className="p-6">
                        {activeLeftView === 'forge' && <ForgeView />}
                        {activeLeftView === 'mine' && <MineView />}
                        {activeLeftView === 'smelter' && <SmelterView />}
                        {activeLeftView === 'shop' && <ShopView />}
                        {activeLeftView === 'skills' && <SkillsView />}
                        {activeLeftView === 'artifacts' && <ArtifactsView />}
                        {activeLeftView === 'journal' && <JournalView />}
                        {activeLeftView === 'guild' && <GuildView />}
                    </div>
                </div>

                <div className="right-panel bg-gray-800/80 backdrop-blur-md border-2 border-gray-700 rounded-lg overflow-y-auto w-2/5">
                    <div ref={rightTabsRef} className="tabs flex items-center border-b-2 border-gray-700 h-14 sticky top-0 z-30 bg-gray-800/80 backdrop-blur-sm overflow-x-auto">
                        <RightPanelButton viewId="resources" icon="inventory" label="Ресурсы" onClick={handleRightViewChange} activeView={activeRightView} />
                        <RightPanelButton viewId="playerShop" icon="shopping_bag" label="Мой магазин" onClick={handleRightViewChange} activeView={activeRightView} />
                        <RightPanelButton viewId="upgrades" icon="storefront" label="Улучшения" onClick={handleRightViewChange} activeView={activeRightView} />
                        <RightPanelButton viewId="personnel" icon="engineering" label="Персонал" onClick={handleRightViewChange} activeView={activeRightView} />
                        <RightPanelButton viewId="factions" icon="groups" label="Фракции" onClick={handleRightViewChange} activeView={activeRightView} />
                        <RightPanelButton viewId="eternalSkills" icon="psychology" label="Вечные Навыки" onClick={handleRightViewChange} activeView={activeRightView} />
                    </div>
                    <div className="p-6">
                        {activeRightView === 'resources' && <ResourcePanel />}
                        {activeRightView === 'playerShop' && <PlayerShopPanel />}
                        {activeRightView === 'upgrades' && <UpgradeShop />}
                        {activeRightView === 'personnel' && <PersonnelView />}
                        {activeRightView === 'factions' && <FactionsPanel />}
                        {activeRightView === 'eternalSkills' && <EternalSkillsView />}
                    </div>
                </div>
            </div>

            <div className={`bottom-bar-panel transition-transform duration-300 ease-in-out ${isBottomBarVisible ? 'translate-y-0' : 'translate-y-full'}`}>
                <BottomBar onToggleInventoryModal={() => setIsInventoryOpen(true)} onToggleSettingsModal={() => setIsSettingsOpen(false)} onToggleProfileModal={() => setIsProfileModalOpen(true)} onToggleBottomBarVisibility={toggleBottomBarVisibility} />
            </div>
            
            <div className={`fixed left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out z-20 ${isBottomBarVisible ? 'bottom-[112px]' : 'bottom-6'}`}>
                <div className="flex items-center gap-4">
                    {!isBottomBarVisible && (
                        <button onClick={toggleBottomBarVisibility} className="bg-gray-900/70 border border-gray-700 backdrop-blur-md pointer-events-auto hover:bg-gray-800/80 focus:outline-none w-12 h-12 flex items-center justify-center rounded-full" title="Показать панель">
                            <span className="material-icons-outlined text-gray-400 text-2xl">keyboard_arrow_up</span>
                        </button>
                    )}
                    <WorldEventIndicator />
                </div>
            </div>

            <div className="toast-container">
                {toasts.map(toast => <Toast key={toast.id} id={toast.id} message={toast.message} type={toast.type} onRemove={removeToast} />)}
            </div>
        </div>
    );
}
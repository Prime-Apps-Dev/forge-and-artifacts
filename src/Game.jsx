// src/Game.jsx
import React, { useState, memo, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useGame } from './context/useGame.js';
import { audioController } from './utils/audioController';
import { IMAGE_PATHS } from './constants/paths.js';
import NetworkStatusIndicator from './components/ui/display/NetworkStatusIndicator.jsx';

// --- МОДУЛИ ДЛЯ ОПТИМИЗАЦИИ ЗАГРУЗКИ ---
import RewardModal from './components/ui/modals/RewardModal';
import Toast from './components/ui/display/Toast';
import InventoryModal from './components/ui/modals/InventoryModal';
import ProfileModal from './components/modals/ProfileModal';
import InfoModal from './components/modals/InfoModal';
import SettingsModal from './components/modals/SettingsModal';
import SpecializationModal from './components/ui/modals/SpecializationModal';
import WorldMapModal from './components/modals/WorldMapModal';
import AchievementRewardModal from './components/modals/AchievementRewardModal';
import AvatarSelectionModal from './components/modals/AvatarSelectionModal';
import CreditsModal from './components/modals/CreditsModal';
import HirePersonnelModal from './components/modals/HirePersonnelModal';
import ManagePersonnelModal from './components/modals/ManagePersonnelModal.jsx';
import UpgradeItemModal from './components/modals/UpgradeItemModal.jsx';
import EquipItemModal from './components/modals/EquipItemModal.jsx';
import LoadingScreen from './components/LoadingScreen';
import ShopReputationModal from './components/modals/ShopReputationModal.jsx';
import BottomBar from './components/layout/BottomBar';
import BurgerMenu from './components/layout/BurgerMenu.jsx';
import MobileHeader from './components/layout/MobileHeader.jsx';
import AudioVisualizer from './components/effects/AudioVisualizer';
import ParticleEmitter from './components/effects/ParticleEmitter';

// --- ДИНАМИЧЕСКИ ЗАГРУЖАЕМЫЕ КОМПОНЕНТЫ (CODE SPLITTING) ---
const ForgeView = lazy(() => import('./components/views/ForgeView'));
const MineView = lazy(() => import('./components/views/MineView'));
const SmelterView = lazy(() => import('./components/views/SmelterView'));
const ShopView = lazy(() => import('./components/views/ShopView'));
const SkillsView = lazy(() => import('./components/views/SkillsView'));
const ArtifactsView = lazy(() => import('./components/views/ArtifactsView'));
const JournalView = lazy(() => import('./components/views/JournalView'));
const GuildView = lazy(() => import('./components/views/GuildView'));
const BulletinBoardView = lazy(() => import('./components/views/BulletinBoardView.jsx'));
const ResourcePanel = lazy(() => import('./components/panels/ResourcePanel'));
const PlayerShopPanel = lazy(() => import('./components/panels/PlayerShopPanel'));
const UpgradeShop = lazy(() => import('./components/panels/UpgradeShop'));
const PersonnelView = lazy(() => import('./components/panels/PersonnelView'));
const FactionsPanel = lazy(() => import('./components/panels/FactionsPanel'));
const EternalSkillsView = lazy(() => import('./components/views/EternalSkillsView'));


const useHorizontalScroll = () => {
    const elRef = useRef();
    useEffect(() => {
        const el = elRef.current;
        if (el) {
            const onWheel = (e) => {
                if (e.deltaY === 0) return;
                e.preventDefault();
                el.scrollBy({ left: e.deltaY, behavior: 'smooth' });
            };
            el.addEventListener('wheel', onWheel);
            return () => el.removeEventListener('wheel', onWheel);
        }
    }, []);
    return elRef;
};

const LeftPanelButton = memo(({ id, icon, label, onClick, activeView }) => (
    <button 
        onClick={() => onClick(id)} 
        className={`interactive-element h-full flex-shrink-0 min-w-max px-4 font-cinzel text-base flex items-center justify-center gap-2 border-b-4 ${activeView === id ? 'text-orange-400 border-orange-400 bg-black/20' : 'text-gray-500 border-transparent hover:text-orange-400/70'}`}
    >
        <span className="material-icons-outlined">{icon}</span>{label}
    </button>
));

const RightPanelButton = memo(({ id, icon, label, onClick, activeView }) => (
    <button 
        onClick={() => onClick(id)} 
        className={`interactive-element h-full flex-shrink-0 min-w-max px-3 font-cinzel text-sm flex items-center justify-center gap-2 border-b-2 ${activeView === id ? 'text-orange-400 border-orange-400 bg-black/20' : 'text-gray-500 border-transparent hover:text-orange-400/70'}`}
    >
        <span className="material-icons-outlined text-base">{icon}</span>{label}
    </button>
));

// --- КОМПОНЕНТ-ЗАГЛУШКА ДЛЯ SUSPENSE ---
const SuspenseFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
            <span className="material-icons-outlined text-orange-400 text-5xl animate-spin">autorenew</span>
            <p className="text-gray-400 mt-2">Загрузка...</p>
        </div>
    </div>
);

const ViewRenderer = ({ viewId }) => {
    switch (viewId) {
        case 'forge': return <ForgeView />;
        case 'mine': return <MineView />;
        case 'smelter': return <SmelterView />;
        case 'shop': return <ShopView />;
        case 'skills': return <SkillsView />;
        case 'artifacts': return <ArtifactsView />;
        case 'journal': return <JournalView />;
        case 'guild': return <GuildView />;
        case 'bulletinBoard': return <BulletinBoardView />;
        case 'resources': return <ResourcePanel />;
        case 'playerShop': return <PlayerShopPanel />;
        case 'upgrades': return <UpgradeShop />;
        case 'personnel': return <PersonnelView />;
        case 'factions': return <FactionsPanel />;
        case 'eternalSkills': return <EternalSkillsView />;
        default: return <ForgeView />;
    }
};

export default function Game() {
    const gameContext = useGame();
    const { displayedGameState, handlers, assetsLoaded, loadProgress, activeMobileView } = gameContext;

    const [activeLeftView, setActiveLeftView] = useState('forge');
    const [activeRightView, setActiveRightView] = useState('resources');
    const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
    const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);

    const leftTabsRef = useHorizontalScroll();
    const rightTabsRef = useHorizontalScroll();

    const handleViewChange = useCallback((id) => {
        audioController.play('click', 'C4', '16n');
        handlers.handleSetMobileView(id);
        setIsBurgerMenuOpen(false);
    }, [handlers]);
    
    const handleToggleBottomBar = useCallback(() => {
        setIsBottomBarVisible(prev => !prev);
    }, []);

    useEffect(() => {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = IMAGE_PATHS.UI.ANVIL; 
        link.type = 'image/webp';
    }, []);

    if (!assetsLoaded) {
        return <LoadingScreen progress={loadProgress} />;
    }

    const leftPanelViews = [
        { id: 'forge', icon: 'hardware', label: 'Кузница' },
        { id: 'mine', icon: 'terrain', label: 'Шахта' },
        { id: 'smelter', icon: 'fireplace', label: 'Плавильня' },
        { id: 'shop', icon: 'shopping_cart', label: 'Лавка' },
        { id: 'skills', icon: 'schema', label: 'Навыки' },
        { id: 'artifacts', icon: 'auto_stories', label: 'Артефакты' },
        { id: 'journal', icon: 'book', label: 'Журнал' },
        { id: 'guild', icon: 'hub', label: 'Гильдия', condition: displayedGameState.purchasedSkills.guildContracts },
    ];

    const rightPanelViews = [
        { id: 'resources', icon: 'inventory', label: 'Ресурсы' },
        { id: 'playerShop', icon: 'shopping_bag', label: 'Мой магазин' },
        { id: 'bulletinBoard', icon: 'article', label: 'Доска объявлений', condition: displayedGameState.unlockedFeatures?.bulletinBoard },
        { id: 'upgrades', icon: 'storefront', label: 'Улучшения' },
        { id: 'personnel', icon: 'engineering', label: 'Персонал' },
        { id: 'factions', icon: 'groups', label: 'Фракции' },
        { id: 'eternalSkills', icon: 'psychology', label: 'Вечные Навыки' },
    ];
    
    const allViews = [...leftPanelViews, ...rightPanelViews];
    const currentViewTitle = allViews.find(v => v.id === activeMobileView)?.label || "Кузница";

    return (
        <div onClick={gameContext.handleInitialGesture} className="relative w-screen h-screen overflow-hidden bg-gray-900">
            <AudioVisualizer />
            <ParticleEmitter />
            
            <NetworkStatusIndicator />

            {gameContext.isSpecializationModalOpen && <SpecializationModal onSelectSpecialization={handlers.handleSelectSpecialization} onClose={() => handlers.handleCloseSpecializationModal()}/>}
            {gameContext.isSettingsOpen && <SettingsModal onClose={handlers.handleCloseSettingsModal} />}
            {gameContext.isInventoryOpen && <InventoryModal isOpen={gameContext.isInventoryOpen} onClose={handlers.handleCloseInventoryModal} />}
            {gameContext.isProfileModalOpen && <ProfileModal isOpen={gameContext.isProfileModalOpen} onClose={handlers.handleCloseProfileModal} />}
            {gameContext.isShopReputationModalOpen && <ShopReputationModal isOpen={gameContext.isShopReputationModalOpen} onClose={handlers.handleCloseShopReputationModal} />}
            {gameContext.isHirePersonnelModalOpen && <HirePersonnelModal isOpen={gameContext.isHirePersonnelModalOpen} onClose={handlers.handleCloseHirePersonnelModal} />}
            {gameContext.activeInfoModal && <InfoModal isOpen={!!gameContext.activeInfoModal} onClose={handlers.handleCloseInfoModal} {...gameContext.activeInfoModal} />}
            {gameContext.completedOrderInfo && <RewardModal orderInfo={gameContext.completedOrderInfo} onClose={handlers.handleCloseRewardModal} />}
            {gameContext.isWorldMapModalOpen && <WorldMapModal isOpen={gameContext.isWorldMapModalOpen} onClose={handlers.handleCloseWorldMapModal} />}
            {gameContext.achievementToDisplay && <AchievementRewardModal isOpen={gameContext.isAchievementModalOpen} onClose={handlers.handleCloseAchievementRewardModal} achievement={gameContext.achievementToDisplay} />}
            {gameContext.isAvatarSelectionModalOpen && <AvatarSelectionModal isOpen={gameContext.isAvatarSelectionModalOpen} onClose={handlers.handleCloseAvatarSelectionModal} />}
            {gameContext.isCreditsModalOpen && <CreditsModal isOpen={gameContext.isCreditsModalOpen} onClose={handlers.handleCloseCreditsModal} />}
            {gameContext.isManagePersonnelModalOpen && <ManagePersonnelModal personnelId={gameContext.managingPersonnelId} onClose={handlers.handleCloseManagePersonnelModal} />}
            {gameContext.isUpgradeItemModalOpen && <UpgradeItemModal isOpen={gameContext.isUpgradeItemModalOpen} onClose={handlers.handleCloseUpgradeItemModal} itemId={gameContext.itemToUpgradeId} />}
            {gameContext.isEquipItemModalOpen && <EquipItemModal isOpen={gameContext.isEquipItemModalOpen} onClose={handlers.handleCloseEquipItemModal} personnelId={gameContext.personnelToEquip.id} equipSlot={gameContext.personnelToEquip.slot} />}
            
            <BurgerMenu isOpen={isBurgerMenuOpen} onClose={() => setIsBurgerMenuOpen(false)} onNavigate={handleViewChange} />

            <main className="w-full h-full flex flex-col">
                <div className="hidden lg:flex flex-row h-full py-4 px-2 gap-4 text-gray-200 max-w-[1500px] w-full mx-auto relative z-10">
                    <div className="left-panel bg-gray-800/80 backdrop-blur-md border-2 border-gray-700 rounded-lg flex flex-col w-3/5">
                        <div ref={leftTabsRef} className="tabs flex items-center border-b-2 border-gray-700 h-16 sticky top-0 z-30 bg-gray-800/80 backdrop-blur-sm overflow-x-auto flex-shrink-0">
                            {leftPanelViews.map(view => (view.condition !== false) && <LeftPanelButton key={view.id} {...view} onClick={setActiveLeftView} activeView={activeLeftView} />)}
                        </div>
                        <div className="p-6 overflow-y-auto flex-grow">
                           <Suspense fallback={<SuspenseFallback />}>
                               <ViewRenderer viewId={activeLeftView} />
                           </Suspense>
                        </div>
                    </div>
                    <div className="right-panel bg-gray-800/80 backdrop-blur-md border-2 border-gray-700 rounded-lg flex flex-col w-2/5">
                        <div ref={rightTabsRef} className="tabs flex items-center border-b-2 border-gray-700 h-14 sticky top-0 z-30 bg-gray-800/80 backdrop-blur-sm overflow-x-auto flex-shrink-0">
                           {rightPanelViews.map(view => (view.condition !== false) && <RightPanelButton key={view.id} {...view} onClick={setActiveRightView} activeView={activeRightView} />)}
                        </div>
                        <div className="p-6 overflow-y-auto flex-grow">
                           <Suspense fallback={<SuspenseFallback />}>
                               <ViewRenderer viewId={activeRightView} />
                           </Suspense>
                        </div>
                    </div>
                </div>

                <div className="lg:hidden flex flex-col h-full w-full text-gray-200 z-10">
                    <MobileHeader onBurgerClick={() => setIsBurgerMenuOpen(true)} viewTitle={currentViewTitle} />
                    <div className="flex-grow overflow-y-auto p-4 pb-24">
                        <Suspense fallback={<SuspenseFallback />}>
                           <ViewRenderer viewId={activeMobileView} />
                        </Suspense>
                    </div>
                </div>
            </main>
            
            <footer className="fixed bottom-0 left-0 right-0 z-20">
                 <BottomBar 
                    isBottomBarVisible={isBottomBarVisible}
                    onToggleBottomBarVisibility={handleToggleBottomBar}
                 />
            </footer>

            <div className="toast-container">
                {gameContext.toasts.map(toast => <Toast key={toast.id} {...toast} onRemove={gameContext.removeToast} />)}
            </div>
        </div>
    );
}
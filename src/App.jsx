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
import BottomBar from './components/layout/BottomBar';
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
import UpgradeItemModal from './components/modals/UpgradeItemModal.jsx';
import EquipItemModal from './components/modals/EquipItemModal.jsx';
import BurgerMenu from './components/layout/BurgerMenu.jsx';
import MobileHeader from './components/layout/MobileHeader.jsx';
import { IMAGE_PATHS } from './constants/paths.js';


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
        onClick={() => {
            console.log(`[LeftPanelButton] Клик по '${label}' (id: ${id}).`);
            onClick(id);
        }} 
        className={`interactive-element h-full flex-shrink-0 min-w-max px-4 font-cinzel text-base flex items-center justify-center gap-2 border-b-4 ${activeView === id ? 'text-orange-400 border-orange-400 bg-black/20' : 'text-gray-500 border-transparent hover:text-orange-400/70'}`}
    >
        <span className="material-icons-outlined">{icon}</span>{label}
    </button>
));

const RightPanelButton = memo(({ id, icon, label, onClick, activeView }) => (
    <button 
        onClick={() => {
            console.log(`[RightPanelButton] Клик по '${label}' (id: ${id}).`);
            onClick(id);
        }} 
        className={`interactive-element h-full flex-shrink-0 min-w-max px-3 font-cinzel text-sm flex items-center justify-center gap-2 border-b-2 ${activeView === id ? 'text-orange-400 border-orange-400 bg-black/20' : 'text-gray-500 border-transparent hover:text-orange-400/70'}`}
    >
        <span className="material-icons-outlined text-base">{icon}</span>{label}
    </button>
));

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
        case 'resources': return <ResourcePanel />;
        case 'playerShop': return <PlayerShopPanel />;
        case 'upgrades': return <UpgradeShop />;
        case 'personnel': return <PersonnelView />;
        case 'factions': return <FactionsPanel />;
        case 'eternalSkills': return <EternalSkillsView />;
        default: return <ForgeView />;
    }
};

export default function App() {
    const gameContext = useGame();
    const { displayedGameState, handlers, assetsLoaded, loadProgress } = gameContext;

    const [activeLeftView, setActiveLeftView] = useState('forge');
    const [activeRightView, setActiveRightView] = useState('resources');
    const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
    const [activeMobileView, setActiveMobileView] = useState('forge');
    const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);

    const leftTabsRef = useHorizontalScroll();
    const rightTabsRef = useHorizontalScroll();

    const handleLeftViewChange = useCallback((id) => {
        console.log(`[HANDLER] handleLeftViewChange: Установка вида на '${id}'.`);
        audioController.play('click', 'C4', '16n');
        setActiveLeftView(id);
    }, []);

    const handleRightViewChange = useCallback((id) => {
        console.log(`[HANDLER] handleRightViewChange: Установка вида на '${id}'.`);
        audioController.play('click', 'C4', '16n');
        setActiveRightView(id);
    }, []);

    const handleMobileViewChange = useCallback((id) => {
        console.log(`[HANDLER] handleMobileViewChange: Установка вида на '${id}'.`);
        audioController.play('click', 'C4', '16n');
        setActiveMobileView(id);
        setIsBurgerMenuOpen(false);
    }, []);
    
    useEffect(() => {
        console.log(`[STATE_UPDATE] activeLeftView изменен на: '${activeLeftView}'`);
    }, [activeLeftView]);
    
    const handleToggleBottomBar = useCallback(() => {
        setIsBottomBarVisible(prev => !prev);
    }, []);

    // НОВЫЙ ХУК ДЛЯ УСТАНОВКИ FAVICON
    useEffect(() => {
        // Ищем существующую иконку, чтобы не создавать дубликаты
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = IMAGE_PATHS.UI.ANVIL; // Путь к нашей иконке
        link.type = 'image/webp';
    }, []); // Пустой массив зависимостей означает, что этот код выполнится один раз при монтировании компонента

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

            {/* Глобальные модальные окна */}
            {gameContext.isSpecializationModalOpen && <SpecializationModal onSelectSpecialization={handlers.handleSelectSpecialization} onClose={() => handlers.handleCloseSpecializationModal()}/>}
            {gameContext.isSettingsOpen && <SettingsModal onClose={handlers.handleCloseSettingsModal} />}
            {gameContext.isInventoryOpen && <InventoryModal isOpen={gameContext.isInventoryOpen} onClose={handlers.handleCloseInventoryModal} />}
            {gameContext.isProfileModalOpen && <ProfileModal isOpen={gameContext.isProfileModalOpen} onClose={handlers.handleCloseProfileModal} />}
            {gameContext.isShopReputationModalOpen && <ShopReputationModal isOpen={gameContext.isShopReputationModalOpen} onClose={handlers.handleCloseShopReputationModal} />}
            {gameContext.isHirePersonnelModalOpen && <HirePersonnelModal isOpen={gameContext.isHirePersonnelModalOpen} onClose={handlers.handleCloseHirePersonnelModal} />}
            {gameContext.activeInfoModal && <InfoModal isOpen={!!gameContext.activeInfoModal} onClose={handlers.handleCloseInfoModal} {...gameContext.activeInfoModal} />}
            {gameContext.completedOrderInfo && <RewardModal orderInfo={gameContext.completedOrderInfo} onClose={handlers.handleCloseRewardModal} />}
            {gameContext.isWorldMapModalOpen && <WorldMapModal isOpen={gameContext.isWorldMapModalOpen} onClose={handlers.handleCloseWorldMapModal} />}
            {gameContext.achievementToDisplay && <AchievementRewardModal isOpen={gameContext.isAchievementRewardModalOpen} onClose={handlers.handleCloseAchievementRewardModal} achievement={gameContext.achievementToDisplay} />}
            {gameContext.isAvatarSelectionModalOpen && <AvatarSelectionModal isOpen={gameContext.isAvatarSelectionModalOpen} onClose={handlers.handleCloseAvatarSelectionModal} />}
            {gameContext.isCreditsModalOpen && <CreditsModal isOpen={gameContext.isCreditsModalOpen} onClose={handlers.handleCloseCreditsModal} />}
            {gameContext.isManagePersonnelModalOpen && <ManagePersonnelModal personnelId={gameContext.managingPersonnelId} onClose={handlers.handleCloseManagePersonnelModal} />}
            {gameContext.isUpgradeItemModalOpen && <UpgradeItemModal isOpen={gameContext.isUpgradeItemModalOpen} onClose={handlers.handleCloseUpgradeItemModal} itemId={gameContext.itemToUpgradeId} />}
            {gameContext.isEquipItemModalOpen && <EquipItemModal isOpen={gameContext.isEquipItemModalOpen} onClose={handlers.handleCloseEquipItemModal} personnelId={gameContext.personnelToEquip.id} equipSlot={gameContext.personnelToEquip.slot} />}
            
            <BurgerMenu isOpen={isBurgerMenuOpen} onClose={() => setIsBurgerMenuOpen(false)} onNavigate={handleMobileViewChange} />

            <main className="w-full h-full flex flex-col">
                {/* --- DESKTOP LAYOUT --- */}
                <div className="hidden lg:flex flex-row h-full py-4 px-2 gap-4 text-gray-200 max-w-[1500px] w-full mx-auto relative z-10">
                    <div className="left-panel bg-gray-800/80 backdrop-blur-md border-2 border-gray-700 rounded-lg flex flex-col w-3/5">
                        <div ref={leftTabsRef} className="tabs flex items-center border-b-2 border-gray-700 h-16 sticky top-0 z-30 bg-gray-800/80 backdrop-blur-sm overflow-x-auto flex-shrink-0">
                            {leftPanelViews.map(view => (view.condition !== false) && <LeftPanelButton key={view.id} {...view} onClick={handleLeftViewChange} activeView={activeLeftView} />)}
                        </div>
                        <div className="p-6 overflow-y-auto flex-grow">
                           <ViewRenderer viewId={activeLeftView} />
                        </div>
                    </div>
                    <div className="right-panel bg-gray-800/80 backdrop-blur-md border-2 border-gray-700 rounded-lg flex flex-col w-2/5">
                        <div ref={rightTabsRef} className="tabs flex items-center border-b-2 border-gray-700 h-14 sticky top-0 z-30 bg-gray-800/80 backdrop-blur-sm overflow-x-auto flex-shrink-0">
                           {rightPanelViews.map(view => <RightPanelButton key={view.id} {...view} onClick={handleRightViewChange} activeView={activeRightView} />)}
                        </div>
                        <div className="p-6 overflow-y-auto flex-grow">
                           <ViewRenderer viewId={activeRightView} />
                        </div>
                    </div>
                </div>

                {/* --- MOBILE/TABLET LAYOUT --- */}
                <div className="lg:hidden flex flex-col h-full w-full text-gray-200 z-10">
                    <MobileHeader onBurgerClick={() => setIsBurgerMenuOpen(true)} viewTitle={currentViewTitle} />
                    <div className="flex-grow overflow-y-auto p-4 pb-24">
                        <ViewRenderer viewId={activeMobileView} />
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
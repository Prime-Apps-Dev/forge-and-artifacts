// src/components/layout/BurgerMenu.jsx
import React from 'react';
import { useGame } from '../../context/GameContext';
import { definitions } from '../../data/definitions';

// ИСПРАВЛЕНИЕ: Параметр `viewId` заменен на `id` для соответствия данным.
const NavLink = ({ id, icon, label, onNavigate, action }) => (
    <button 
        onClick={() => action ? action() : onNavigate(id)} 
        className="w-full text-left flex items-center gap-4 px-4 py-3 text-gray-300 hover:bg-orange-500/20 hover:text-white rounded-md transition-colors duration-150"
    >
        <span className="material-icons-outlined text-2xl">{icon}</span>
        <span className="font-bold">{label}</span>
    </button>
);

const BurgerMenu = ({ isOpen, onClose, onNavigate }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const currentAvatarSrc = definitions.avatars[gameState.playerAvatarId]?.src || '/img/default_avatar.png';

    // Собираем все возможные view для навигации
    const menuViews = [
        { id: 'forge', icon: 'hardware', label: 'Кузница' },
        { id: 'mine', icon: 'terrain', label: 'Шахта' },
        { id: 'smelter', icon: 'fireplace', label: 'Плавильня' },
        { id: 'shop', icon: 'shopping_cart', label: 'Лавка' },
        { id: 'skills', icon: 'schema', label: 'Навыки' },
        { id: 'eternalSkills', icon: 'psychology', label: 'Вечные Навыки' },
        { id: 'artifacts', icon: 'auto_stories', label: 'Артефакты' },
        { id: 'journal', icon: 'book', label: 'Журнал' },
        { id: 'guild', icon: 'hub', label: 'Гильдия', condition: gameState.purchasedSkills.guildContracts },
        { id: 'resources', icon: 'inventory', label: 'Ресурсы' },
        { id: 'playerShop', icon: 'shopping_bag', label: 'Мой магазин' },
        { id: 'upgrades', icon: 'storefront', label: 'Улучшения' },
        { id: 'personnel', icon: 'engineering', label: 'Персонал' },
        { id: 'factions', icon: 'groups', label: 'Фракции' },
    ];
    
    // Функция для вызова обработчика и закрытия меню
    const handleAction = (handler) => {
        handler();
        onClose();
    };

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <div className={`fixed top-0 left-0 bottom-0 w-72 bg-gray-800 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 flex flex-col h-full">
                    {/* Профиль */}
                    <button onClick={() => handleAction(handlers.handleOpenProfileModal)} className="w-full flex items-center gap-3 p-3 mb-4 rounded-lg hover:bg-gray-700/50">
                        <img src={currentAvatarSrc} alt="Аватар" className="w-12 h-12 rounded-full border-2 border-yellow-500" />
                        <div>
                            <p className="font-cinzel text-lg text-white font-bold">{gameState.playerName}</p>
                            <p className="text-sm text-yellow-400">Уровень {gameState.masteryLevel}</p>
                        </div>
                    </button>

                    <nav className="flex-grow overflow-y-auto space-y-1">
                        {menuViews.map(view => {
                            if (view.condition === false) return null;
                            // ИСПРАВЛЕНИЕ: Здесь в NavLink передается объект `view` целиком через `{...view}`.
                            // Так как в `view` свойство называется `id`, а NavLink теперь ожидает `id`, все будет работать.
                            return <NavLink key={view.id} {...view} onNavigate={onNavigate} />;
                        })}
                    </nav>

                    <div className="mt-4 pt-4 border-t border-gray-700 space-y-1">
                         <NavLink icon="backpack" label="Инвентарь" action={() => handleAction(handlers.handleOpenInventoryModal)} />
                         <NavLink icon="settings" label="Настройки" action={() => handleAction(handlers.handleOpenSettingsModal)} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default BurgerMenu;
// src/components/ui/modals/InventoryModal.jsx
import React, { useMemo } from 'react';
import { definitions } from '../../../data/definitions/index.js';
import InventoryItemCard from '../cards/InventoryItemCard';
import { useGame } from '../../../context/useGame.js';
import Button from '../buttons/Button.jsx';
import { useDraggableModal } from '../../../hooks/useDraggableModal.js';
import ModalDragHandle from '../display/ModalDragHandle.jsx';

const InventoryModal = ({ isOpen, onClose }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const { touchHandlers } = useDraggableModal(onClose);

    if (!isOpen) return null;

    const { inventory, inventoryCapacity } = gameState;

    const itemsOnStock = useMemo(() => 
        inventory.filter(item => item.location === 'inventory'),
        [inventory]
    );
    
    const isAnyActiveProject = !!gameState.activeOrder || !!gameState.activeFreeCraft || !!gameState.currentEpicOrder || !!gameState.activeReforge || !!gameState.activeInlay || !!gameState.activeGraving;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-end justify-center md:items-center z-40 modal-backdrop" onClick={onClose}>
            <div
                className="bg-gray-900 border-t-2 md:border-2 border-gray-700 w-full rounded-t-2xl md:rounded-lg shadow-2xl p-6 flex flex-col modal-content animate-slide-in-up md:animate-none md:relative md:max-w-6xl max-h-[85vh] md:h-3/4"
                onClick={e => e.stopPropagation()}
                {...touchHandlers}
            >
                {/* Mobile Drag Handle */}
                <ModalDragHandle />

                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <h2 className="font-cinzel text-2xl text-orange-400 mb-2 md:mb-0">Инвентарь (Склад)</h2>
                    <p className="text-lg text-gray-400">Занято ячеек: <span className="font-bold text-white">{itemsOnStock.length}</span> / {inventoryCapacity}</p>
                </div>

                <div className="grow bg-black/30 p-4 rounded-md overflow-y-auto">
                    {itemsOnStock.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                            {itemsOnStock.map(item => (
                                <InventoryItemCard
                                    key={item.uniqueId}
                                    item={item}
                                    onAction={() => handlers.handleMoveItemToShelf(item.uniqueId)}
                                    actionLabel="Выставить"
                                    isAnyActiveProject={isAnyActiveProject}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 italic text-center">Ваш склад пуст. Создавайте предметы, чтобы они здесь появлялись.</p>
                        </div>
                    )}
                </div>

                <Button onClick={onClose} className="mt-6 flex-shrink-0">
                    Закрыть
                </Button>
            </div>
        </div>
    );
};

export default InventoryModal;
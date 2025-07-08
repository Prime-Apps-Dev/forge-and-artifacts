// src/components/modals/EquipPlayerItemModal.jsx
import React, { useMemo } from 'react';
import { useGame } from '../../context/useGame.js';
import { definitions } from '../../data/definitions/index';
import Button from '../ui/buttons/Button';
import InventoryItemCard from '../ui/cards/InventoryItemCard';
import { useDraggableModal } from '../../hooks/useDraggableModal.js';
import ModalDragHandle from '../ui/display/ModalDragHandle.jsx';

const EquipPlayerItemModal = ({ isOpen, onClose, equipSlot }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const { touchHandlers } = useDraggableModal(onClose);

    if (!isOpen || !equipSlot) return null;

    const suitableItems = useMemo(() => {
        return gameState.inventory.filter(item => {
            const itemDef = definitions.items[item.itemKey];
            return item.location === 'inventory' &&
                   itemDef.purpose === 'player' &&
                   itemDef.equipSlot === equipSlot;
        });
    }, [gameState.inventory, equipSlot]);

    const handleEquip = (itemUniqueId) => {
        handlers.handleEquipPlayerItem(equipSlot, itemUniqueId);
        onClose();
    };
    
    const slotName = equipSlot === 'tool' ? 'Инструмент' : 'Снаряжение';

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div 
                className="bg-gray-900 border-2 border-gray-700 rounded-lg shadow-2xl p-6 w-full max-w-4xl h-3/4 flex flex-col modal-content" 
                onClick={e => e.stopPropagation()}
                {...touchHandlers}
            >
                <ModalDragHandle />

                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-cinzel text-2xl text-orange-400">
                        Экипировать: {slotName}
                    </h2>
                    <button onClick={onClose} className="hidden md:block text-gray-400 hover:text-white material-icons-outlined">close</button>
                </div>

                <div className="grow bg-black/30 p-4 rounded-md overflow-y-auto">
                    {suitableItems.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {suitableItems.map(item => (
                                <InventoryItemCard
                                    key={item.uniqueId}
                                    item={item}
                                    onAction={() => handleEquip(item.uniqueId)}
                                    actionLabel="Экипировать"
                                    isAnyActiveProject={false}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 italic">Нет подходящих предметов в инвентаре.</p>
                        </div>
                    )}
                </div>
                 <Button onClick={onClose} className="mt-6 hidden md:block">Закрыть</Button>
            </div>
        </div>
    );
};

export default EquipPlayerItemModal;
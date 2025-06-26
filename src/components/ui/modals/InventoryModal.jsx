// src/components/ui/modals/InventoryModal.jsx
import React, { useMemo } from 'react';
import { definitions } from '../../../data/definitions/index.js';
import InventoryItemCard from '../cards/InventoryItemCard';
import { useGame } from '../../../context/GameContext.jsx';
import Button from '../buttons/Button.jsx';

const InventoryModal = ({ isOpen, onClose }) => {
    const { displayedGameState: gameState, handlers } = useGame();

    if (!isOpen) return null;

    const { inventory, inventoryCapacity } = gameState;

    const itemsOnStock = useMemo(() => 
        inventory.filter(item => item.location === 'inventory'),
        [inventory]
    );
    
    const isAnyActiveProject = !!gameState.activeOrder || !!gameState.activeFreeCraft || !!gameState.currentEpicOrder || !!gameState.activeReforge || !!gameState.activeInlay || !!gameState.activeGraving;
    const hasGravingSkill = gameState.purchasedSkills.masterGraving;
    const hasGem = gameState.specialItems.gem > 0;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 modal-backdrop" onClick={onClose}>
            <div
                className="bg-gray-900 border-2 border-gray-700 rounded-lg shadow-2xl p-6 w-full max-w-4xl h-3/4 flex flex-col modal-content"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-cinzel text-2xl text-orange-400">Инвентарь (Склад)</h2>
                    <p className="text-lg text-gray-400">Занято ячеек: <span className="font-bold text-white">{inventory.length}</span> / {inventoryCapacity}</p>
                </div>

                <div className="grow bg-black/30 p-4 rounded-md overflow-y-auto">
                    {itemsOnStock.length > 0 ? (
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {itemsOnStock.map(item => {
                                const itemDef = definitions.items[item.itemKey];
                                
                                const maxSlots = itemDef.hasInlaySlots ? (
                                    item.quality >= 10 ? 3 :
                                    item.quality >= 8 ? 2 :
                                    item.quality >= 6 ? 1 : 0
                                ) : 0;
                                const currentSlotsUsed = (item.inlaySlots || []).length;
                                const hasAvailableSlot = maxSlots > currentSlotsUsed;
                                const isGravingTarget = itemDef.hasInlaySlots || itemDef.gravingAvailable; 

                                return (
                                    <InventoryItemCard
                                        key={item.uniqueId}
                                        item={item}
                                        onAction={() => handlers.handleMoveItemToShelf(item.uniqueId)}
                                        actionLabel="Выставить"
                                        onReforge={handlers.handleStartReforge}
                                        showReforgeButton={gameState.purchasedSkills.masterReforging && item.quality < 10.0}
                                        onInlay={handlers.handleStartInlay}
                                        showInlayButton={hasGem && itemDef.hasInlaySlots && hasAvailableSlot}
                                        onGraving={handlers.handleStartGraving}
                                        showGravingButton={hasGravingSkill && isGravingTarget}
                                        isAnyActiveProject={isAnyActiveProject}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 italic">Ваш склад пуст. Создавайте предметы, чтобы они здесь появлялись.</p>
                        </div>
                    )}
                </div>

                <Button onClick={onClose} className="mt-6">
                    Закрыть
                </Button>
            </div>
        </div>
    );
};

export default InventoryModal;
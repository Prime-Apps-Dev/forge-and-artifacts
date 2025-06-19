import React from 'react';
import { definitions } from '../../data/definitions';
import InventoryItemCard from './InventoryItemCard';

const InventoryModal = ({ isOpen, onClose, gameState, handlers }) => {
    if (!isOpen) return null;

    const { inventory, inventoryCapacity } = gameState;

    const itemsOnStock = inventory.filter(item => item.location === 'inventory');
    const isAnyActiveProject = !!gameState.activeOrder || !!gameState.activeFreeCraft || !!gameState.currentEpicOrder || !!gameState.activeReforge || !!gameState.activeInlay || !!gameState.activeGraving;
    const hasGravingSkill = gameState.purchasedSkills.masterGraving; // Проверяем навык гравировки
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

                                // Проверка, может ли предмет быть гравирован
                                // Логика: если у предмета есть слоты для инкрустации (и, соответственно, место для гравировки)
                                // ИЛИ если в items.js есть свойство gravingAvailable: true для этого предмета
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
                                        onGraving={handlers.handleStartGraving} // Передаем обработчик гравировки
                                        showGravingButton={hasGravingSkill && isGravingTarget} // Показываем кнопку, если есть навык и предмет гравируем
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

                <button onClick={onClose} className="interactive-element mt-6 w-full bg-orange-600 text-black font-bold py-2 px-4 rounded-lg hover:bg-orange-500">
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default InventoryModal;
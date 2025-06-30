// src/components/modals/DisassembleModal.jsx
import React from 'react';
import { useGame } from '../../context/useGame.js';
import { definitions } from '../../data/definitions/index';
import { formatCostsJsx } from '../../utils/formatters';
import Button from '../ui/buttons/Button';
import { getItemImageSrc } from '../../utils/helpers';
import { useDraggableModal } from '../../hooks/useDraggableModal.js';
import ModalDragHandle from '../ui/display/ModalDragHandle.jsx';

const DisassembleModal = ({ isOpen, onClose, itemId }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const { touchHandlers } = useDraggableModal(onClose);

    if (!isOpen || !itemId) return null;

    const item = gameState.inventory.find(i => i.uniqueId === itemId);
    if (!item) return null;

    const itemDef = definitions.items[item.itemKey];

    // Расчет возвращаемых ресурсов
    const getRefundedResources = () => {
        if (!itemDef.components || itemDef.components.length === 0) {
            return {};
        }

        const totalCosts = {};
        itemDef.components.forEach(component => {
            if (component.cost) {
                for (const resource in component.cost) {
                    totalCosts[resource] = (totalCosts[resource] || 0) + component.cost[resource];
                }
            }
        });
        
        const refunded = {};
        for (const resource in totalCosts) {
            const amountToRefund = Math.floor(totalCosts[resource] * 0.30);
            if (amountToRefund > 0) {
                refunded[resource] = amountToRefund;
            }
        }
        return refunded;
    };

    const refundedResources = getRefundedResources();
    const canDisassemble = Object.keys(refundedResources).length > 0;

    const handleConfirm = () => {
        if (canDisassemble) {
            handlers.handleDisassembleItem(itemId);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div 
                className="bg-gray-900 border-2 border-red-500 rounded-lg shadow-2xl p-6 w-full max-w-md modal-content" 
                onClick={e => e.stopPropagation()}
                {...touchHandlers}
            >
                <ModalDragHandle />

                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-cinzel text-2xl text-red-400">Разборка предмета</h2>
                    <button onClick={onClose} className="hidden md:block text-gray-400 hover:text-white material-icons-outlined">close</button>
                </div>

                <div className="text-center">
                    <p className="text-gray-300 mb-4">Вы уверены, что хотите разобрать предмет <span className="font-bold text-white">"{itemDef.name}"</span>? Это действие необратимо.</p>
                    <img src={getItemImageSrc(item.itemKey, 96)} alt={itemDef.name} className="w-24 h-24 object-contain mb-4 mx-auto" />
                </div>
                
                {canDisassemble ? (
                    <div className="bg-black/20 p-3 rounded-md text-center">
                        <h4 className="font-bold text-gray-300 mb-2">Вы получите:</h4>
                        <div className="flex justify-center items-center gap-x-4 gap-y-2 flex-wrap">
                            {formatCostsJsx(refundedResources, gameState)}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-yellow-400 my-4">Этот предмет нельзя разобрать на полезные ресурсы.</p>
                )}


                <div className="flex gap-4 mt-6">
                    <Button onClick={onClose} variant="secondary" className="w-full">Отмена</Button>
                    <Button onClick={handleConfirm} disabled={!canDisassemble} variant="danger" className="w-full">
                        {canDisassemble ? 'Разобрать' : 'Нельзя разобрать'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DisassembleModal;
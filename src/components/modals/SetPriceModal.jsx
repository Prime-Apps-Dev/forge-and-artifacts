// src/components/modals/SetPriceModal.jsx
import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/useGame.js';
import { definitions } from '../../data/definitions/index';
import { formatNumber } from '../../utils/formatters';
import Button from '../ui/buttons/Button';
import { getItemImageSrc } from '../../utils/helpers';
import { useDraggableModal } from '../../hooks/useDraggableModal.js';
import ModalDragHandle from '../ui/display/ModalDragHandle.jsx';

const SetPriceModal = ({ isOpen, onClose, shelfIndex }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const { touchHandlers } = useDraggableModal(onClose);

    const shelf = useMemo(() => 
        (isOpen && shelfIndex !== null) ? gameState.shopShelves[shelfIndex] : null,
    [isOpen, shelfIndex, gameState.shopShelves]);

    const item = useMemo(() => 
        (shelf && shelf.itemId) ? gameState.inventory.find(i => i.uniqueId === shelf.itemId) : null,
    [shelf, gameState.inventory]);

    const [price, setPrice] = useState(shelf?.userPrice || 0);

    // Update local price state if the modal is reopened for a different item
    React.useEffect(() => {
        if (shelf) {
            setPrice(shelf.userPrice);
        }
    }, [shelf]);

    if (!isOpen || !item) return null;

    const itemDef = definitions.items[item.itemKey];
    const priceDeviation = shelf.marketPrice > 0 ? (price / shelf.marketPrice * 100 - 100) : 0;
    
    let deviationColor = 'text-gray-400';
    if (priceDeviation > 5) deviationColor = 'text-green-400';
    if (priceDeviation < -5) deviationColor = 'text-red-400';
    
    const handleConfirm = () => {
        const numericPrice = parseInt(price, 10);
        if (!isNaN(numericPrice) && numericPrice >= 0) {
            handlers.handleSetItemPrice(shelfIndex, numericPrice);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div 
                className="bg-gray-900 border-2 border-yellow-500 rounded-lg shadow-2xl p-6 w-full max-w-md modal-content" 
                onClick={e => e.stopPropagation()}
                {...touchHandlers}
            >
                <ModalDragHandle />

                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-cinzel text-2xl text-yellow-400">Установка Цены</h2>
                    <button onClick={onClose} className="hidden md:block text-gray-400 hover:text-white material-icons-outlined">close</button>
                </div>

                <div className="flex flex-col items-center text-center">
                    <img src={getItemImageSrc(item.itemKey, 96)} alt={itemDef.name} className="w-24 h-24 object-contain mb-2" />
                    <h3 className="font-bold text-xl text-white">{itemDef.name}</h3>
                    <p className="text-gray-400">Качество: <span className="font-bold text-white">{item.quality.toFixed(2)}x</span></p>
                </div>
                
                <div className="my-6 space-y-4">
                    <div className="text-center bg-black/20 p-3 rounded-md">
                        <p className="text-gray-400">Рекомендуемая рыночная цена:</p>
                        <p className="font-bold text-2xl text-yellow-400">{formatNumber(shelf.marketPrice)}</p>
                    </div>
                    <div className="text-center">
                         <label htmlFor="userPrice" className="block text-gray-300 mb-2">Ваша цена:</label>
                         <input
                            type="number"
                            id="userPrice"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="bg-gray-800 border-2 border-gray-600 text-white font-bold text-2xl text-center p-2 rounded-lg w-full focus:border-orange-500 focus:outline-none"
                         />
                         <p className={`text-sm mt-2 font-bold ${deviationColor}`}>
                            Отклонение: {priceDeviation.toFixed(1)}%
                         </p>
                    </div>
                </div>

                <div className="flex gap-4 mt-6">
                    <Button onClick={onClose} variant="secondary" className="w-full">Отмена</Button>
                    <Button onClick={handleConfirm} variant="success" className="w-full">
                        Установить
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SetPriceModal;
// src/components/modals/HirePersonnelModal.jsx
import React, { memo, useState } from 'react';
import PersonnelOfferCard from '../ui/cards/PersonnelOfferCard';
import { formatCostsJsx } from '../../utils/formatters.jsx';
import { useGame } from '../../context/useGame.js';
import Button from '../ui/buttons/Button.jsx';
import { gameConfig as GAME_CONFIG } from '../../constants/gameConfig.js';
import { useDraggableModal } from '../../hooks/useDraggableModal.js';
import ModalDragHandle from '../ui/display/ModalDragHandle.jsx';

const HirePersonnelModal = memo(({ isOpen, onClose }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const { touchHandlers } = useDraggableModal(onClose);
    const [isFading, setIsFading] = useState(false);

    if (!isOpen) return null;

    const now = Date.now();
    const timeSinceLastRoll = (now - gameState.lastPersonnelOfferRollTime) / (1000 * 60);
    const isFreeReroll = gameState.personnelRollCount === 0 || timeSinceLastRoll >= GAME_CONFIG.PERSONNEL_OFFER_REFRESH_INTERVAL_MINUTES;

    let rerollCost = {};
    if (!isFreeReroll) {
        rerollCost = { ...GAME_CONFIG.personnelRollCost };
        if (gameState.personnelRollCostReduction) {
            for (const res in rerollCost) {
                rerollCost[res] = Math.floor(rerollCost[res] * (1 - gameState.personnelRollCostReduction));
            }
        }
        for (const res in rerollCost) {
            rerollCost[res] = Math.floor(rerollCost[res] * Math.pow(GAME_CONFIG.PERSONNEL_OFFER_ROLL_COST_MULTIPLIER, gameState.personnelRollCount - 1));
        }
    }

    const canAffordReroll = isFreeReroll || Object.entries(rerollCost).every(([res, cost]) => 
        (gameState[res] || gameState.specialItems[res] || 0) >= cost
    );

    let rerollButtonContent;
    if (isFreeReroll) {
        rerollButtonContent = "Обновить (Бесплатно)";
    } else {
        rerollButtonContent = (
            <div className="flex items-center justify-center gap-2">
                <span>Обновить</span>
                <span className="text-xs">({formatCostsJsx(rerollCost, gameState)})</span>
            </div>
        );
    }
    
    const handleRerollClick = () => {
        if (!canAffordReroll) return;
        setIsFading(true);
        setTimeout(() => {
            handlers.handleGeneratePersonnelOffers();
            setIsFading(false);
        }, 300);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 modal-backdrop" onClick={onClose}>
            <div
                className="bg-gray-900 border-2 border-gray-700 rounded-lg shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] flex flex-col modal-content"
                onClick={e => e.stopPropagation()}
                {...touchHandlers}
            >
                {/* Mobile Drag Handle */}
                <ModalDragHandle />

                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-cinzel text-2xl text-orange-400">Нанять Персонал</h2>
                    <button onClick={onClose} className="hidden md:block text-gray-400 hover:text-white material-icons-outlined">close</button>
                </div>

                <div className="flex justify-between items-center mb-4 p-3 bg-black/20 rounded-md border border-gray-700">
                    <p className="text-gray-300 text-sm">Свободных слотов: <span className="font-bold text-white">{gameState.personnelSlots.total - gameState.personnelSlots.used}</span> / {gameState.personnelSlots.total}</p>
                    <Button
                        onClick={handleRerollClick}
                        disabled={!canAffordReroll}
                        variant="secondary"
                        className="bg-blue-700 hover:enabled:bg-blue-600 w-auto py-2"
                    >
                        {rerollButtonContent}
                    </Button>
                </div>

                <div className={`grow overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-3 gap-4 transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                    {gameState.personnelOffers.length > 0 ? (
                        gameState.personnelOffers.map(offer => (
                            <PersonnelOfferCard
                                key={offer.uniqueId}
                                offer={offer}
                                isHiringDisabled={gameState.personnelSlots.used >= gameState.personnelSlots.total}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 italic py-8">
                            Нет доступных предложений. Обновите список.
                        </div>
                    )}
                </div>

                <Button onClick={onClose} className="mt-6 hidden md:block">
                    Закрыть
                </Button>
            </div>
        </div>
    );
});

export default HirePersonnelModal;
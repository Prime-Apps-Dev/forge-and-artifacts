// src/components/ui/cards/HiredPersonnelCard.jsx
// src/components/ui/cards/HiredPersonnelCard.jsx
import React, { memo, useMemo, useState } from 'react';
import { definitions } from '../../../data/definitions/index.js';
import { formatCostsJsx, formatNumber } from '../../../utils/formatters.jsx';
import { gameConfig as GAME_CONFIG } from '../../../constants/gameConfig.js';
import { useGame } from '../../../context/GameContext.jsx';
import Button from '../buttons/Button.jsx';
import ImageWithFallback from '../display/ImageWithFallback.jsx';
import { UI_CONSTANTS } from '../../../constants/ui.js';

const AssignmentControls = memo(({ personnel }) => { /* ... (no changes from last version) ... */ });
const GiftControls = memo(({ personnel }) => { /* ... (no changes from last version) ... */ });

const HiredPersonnelCard = memo(({ personnel }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const [isAdjustingWage, setIsAdjustingWage] = useState(false);
    const [newWage, setNewWage] = useState({sparks: personnel.wage.sparks || 0, matter: personnel.wage.matter || 0 });

    const personnelDef = definitions.personnel[personnel.personnelId];
    if (!personnelDef) return null;

    const isResting = personnel.isResting;
    const isMaxLevel = personnel.level >= GAME_CONFIG.PERSONNEL_MAX_LEVEL;
    const canLevelUp = !isMaxLevel;
    const hasEnoughXPForLevelUp = personnel.xp >= personnel.xpToNextLevel;

    const levelUpCost = useMemo(() => {
        let cost = { sparks: 100, matter: 1 };
        if (personnel.level > 0) {
            cost.sparks = Math.floor(100 * Math.pow(1.8, personnel.level));
            cost.matter = Math.floor(1 * Math.pow(1.5, personnel.level));
        }
        return cost;
    }, [personnel.level]);

    const canAffordLevelUp = Object.entries(levelUpCost).every(([res, cost]) => (gameState[res] || gameState.specialItems[res] || 0) >= cost);
    const xpProgressPercentage = (personnel.xpToNextLevel > 0) ? (personnel.xp / personnel.xpToNextLevel) * 100 : 100;
    
    const handleSaveWage = () => {
        handlers.handlePersonnelAction(personnel.uniqueId, 'adjust_wage', newWage);
        setIsAdjustingWage(false);
    };

    return (
        <div className={`bg-black/30 p-4 rounded-lg border-2 flex flex-col ${isMaxLevel ? 'border-yellow-500 shadow-md shadow-yellow-500/10' : (isResting ? 'border-blue-700 opacity-70' : 'border-gray-700')}`}>
            <div className="flex items-center gap-4 mb-3">
                <ImageWithFallback 
                    src={personnelDef.faceImg} 
                    fallbackSrc={UI_CONSTANTS.DEFAULT_AVATAR_SRC}
                    alt={personnelDef.name} 
                    className="w-16 h-16 object-contain rounded-full border border-gray-600"
                />
                <div className="flex-grow">
                    <h3 className="font-cinzel text-lg font-bold text-white">{personnel.name || personnelDef.name}</h3>
                    <p className="text-sm text-gray-400">
                         {isMaxLevel 
                            ? <span className="font-bold text-yellow-400">МАКС. УРОВЕНЬ</span> 
                            : `Уровень: ${personnel.level} / ${GAME_CONFIG.PERSONNEL_MAX_LEVEL}`
                        }
                    </p>
                    {!isMaxLevel && (
                        <>
                            <div className="w-full bg-gray-800 rounded-full h-2 mt-1 border border-black/20">
                                <div className="bg-green-500 h-full rounded-full" style={{ width: `${xpProgressPercentage}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-400 text-right">{formatNumber(personnel.xp, true)} / {formatNumber(personnel.xpToNextLevel, true)} XP</p>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700 text-left text-sm space-y-1">
                <p>Статус: <span className={`font-bold ${isResting ? 'text-blue-400' : 'text-green-400'}`}>{isResting ? `Отдыхает (${Math.ceil((personnel.restEndTime - Date.now()) / 1000)} сек.)` : 'Активен'}</span></p>
                <p>Настроение: <span className={`font-bold ${personnel.mood < 50 ? 'text-red-400' : 'text-green-400'}`}>{Math.round(personnel.mood)}%</span></p>
                <div className="w-full bg-gray-800 rounded-full h-2 border border-black/20">
                    <div className={`h-full rounded-full ${personnel.mood < 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${personnel.mood}%` }}></div>
                </div>
                <div className="font-bold text-sm text-white mt-2">
                    <p>Зарплата (10 мин):</p>
                    {isAdjustingWage ? (
                        <div className="flex items-center gap-2 mt-1">
                            <input type="number" value={newWage.sparks} onChange={(e) => setNewWage(w => ({...w, sparks: e.target.value}))} className="w-1/2 p-1 bg-gray-800 border border-gray-600 rounded-md text-sm" placeholder="Искры" />
                            <input type="number" value={newWage.matter} onChange={(e) => setNewWage(w => ({...w, matter: e.target.value}))} className="w-1/2 p-1 bg-gray-800 border border-gray-600 rounded-md text-sm" placeholder="Материя" />
                            <Button onClick={handleSaveWage} className="w-auto px-3 py-1 text-xs" variant="success">OK</Button>
                            <Button onClick={() => setIsAdjustingWage(false)} className="w-auto px-2 py-1 text-xs" variant="danger">X</Button>
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                            {formatCostsJsx(personnel.wage, gameState)}
                            <button onClick={() => setIsAdjustingWage(true)} className="material-icons-outlined text-gray-400 hover:text-white text-base ml-1">edit</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700 text-left text-sm space-y-2">
                 <p className="font-bold text-sm text-white">Назначение:</p>
                 <AssignmentControls personnel={personnel} />
            </div>

             {!personnel.isResting && (
                <div className="mt-2 pt-2 border-t border-gray-700/50 text-left text-sm space-y-2">
                     <p className="font-bold text-sm text-white">Сделать подарок:</p>
                     <GiftControls personnel={personnel} />
                </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-700 flex flex-col gap-2">
                {canLevelUp && (
                    <Button
                        onClick={() => handlers.handlePersonnelLevelUp(personnel.uniqueId, levelUpCost)}
                        disabled={!hasEnoughXPForLevelUp || !canAffordLevelUp}
                        variant="primary" // Изменено на оранжевый
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span>Повысить уровень</span>
                            <span className="text-xs">({formatCostsJsx(levelUpCost, gameState)})</span>
                        </div>
                    </Button>
                )}
                 {!personnel.isResting && (
                     <Button
                        onClick={() => handlers.handlePersonnelAction(personnel.uniqueId, 'give_day_off')}
                        variant="secondary"
                    >
                        Отправить на отдых
                    </Button>
                )}
                <Button
                    onClick={() => handlers.handleFirePersonnel(personnel.uniqueId)}
                    variant="danger"
                >
                    Уволить
                </Button>
            </div>
        </div>
    );
});

export default HiredPersonnelCard;
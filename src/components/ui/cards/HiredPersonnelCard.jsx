// src/components/ui/cards/HiredPersonnelCard.jsx
import React, { memo, useMemo, useState, useEffect, useRef } from 'react';
import { definitions } from '../../../data/definitions/index.js';
import { formatCostsJsx, formatNumber } from '../../../utils/formatters.jsx';
import { gameConfig as GAME_CONFIG } from '../../../constants/gameConfig.js';
import { useGame } from '../../../context/useGame.js';
import ImageWithFallback from '../display/ImageWithFallback.jsx';
import { UI_CONSTANTS } from '../../../constants/ui.js';
import Tooltip from '../display/Tooltip.jsx';

const ActionButton = ({ action, personnel, levelUpCost, confirmation, setConfirmation, handlers }) => {
    const { displayedGameState: gameState } = useGame();
    const timerRef = useRef(null);

    const isMaxLevel = personnel.level >= GAME_CONFIG.PERSONNEL_MAX_LEVEL;
    const canAffordLevelUp = action === 'levelUp' && levelUpCost ? Object.entries(levelUpCost).every(([res, cost]) => (gameState[res] || gameState.specialItems[res] || 0) >= cost) : false;

    const actionConfig = {
        levelUp: {
            icon: 'arrow_upward',
            color: 'orange',
            tooltip: `Повысить уровень. Стоимость: ${levelUpCost ? formatCostsJsx(levelUpCost, gameState).map(el => el.props.children).flat().join(' ') : 'N/A'}`,
            disabled: isMaxLevel || !canAffordLevelUp || personnel.xp < personnel.xpToNextLevel,
            handler: () => handlers.handlePersonnelLevelUp(personnel.uniqueId, levelUpCost),
            confirmText: "Повысить?"
        },
        rest: {
            icon: 'bedtime',
            color: 'blue',
            tooltip: 'Отправить на отдых (восстанавливает настроение)',
            disabled: personnel.isResting,
            handler: () => handlers.handlePersonnelAction(personnel.uniqueId, 'give_day_off')
        },
        fire: {
            icon: 'person_remove',
            color: 'red',
            tooltip: 'Уволить сотрудника',
            disabled: false,
            handler: () => handlers.handleFirePersonnel(personnel.uniqueId),
            confirmText: "Уволить?"
        },
        manage: {
            icon: 'manage_accounts',
            color: 'gray',
            tooltip: 'Управление',
            disabled: false, // ИЗМЕНЕНИЕ: Кнопка активирована
            handler: () => handlers.handleOpenManagePersonnelModal(personnel.uniqueId) // ИЗМЕНЕНИЕ: Добавлен обработчик
        }
    };

    const config = actionConfig[action];
    const isConfirmable = !!config.confirmText;
    const isConfirming = confirmation.action === action && confirmation.id === personnel.uniqueId;

    useEffect(() => {
        if (isConfirming) {
            timerRef.current = setTimeout(() => {
                setConfirmation({ action: 'none', id: null });
            }, 3000);
        }
        return () => clearTimeout(timerRef.current);
    }, [isConfirming, setConfirmation]);

    const handleClick = (e) => {
        e.stopPropagation();
        if (config.disabled) return;
        
        if (isConfirmable) {
            if (isConfirming) {
                config.handler();
                setConfirmation({ action: 'none', id: null });
            } else {
                setConfirmation({ action: action, id: personnel.uniqueId });
            }
        } else {
            config.handler();
        }
    };
    
    const buttonStyle = isConfirming ? { backgroundColor: `rgba(var(--color-${config.color}-600), 0.5)` } : {};
        
    const textColorClass = `text-${config.color}-400`;
    const bgColorClass = `bg-gray-800/50`;
    const hoverBgColorClass = `hover:enabled:bg-${config.color}-700/50`;
    const finalBgColor = isConfirming ? '' : bgColorClass;

    return (
        <Tooltip text={isConfirming ? config.confirmText : config.tooltip}>
            <button
                onClick={handleClick}
                disabled={config.disabled}
                style={buttonStyle}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${textColorClass} ${finalBgColor} ${hoverBgColorClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                <span className="material-icons-outlined">{isConfirming ? 'check' : config.icon}</span>
            </button>
        </Tooltip>
    );
};


const HiredPersonnelCard = memo(({ personnel }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const [confirmation, setConfirmation] = useState({ action: 'none', id: null });
    
    const personnelDef = definitions.personnel[personnel.personnelId];
    if (!personnelDef) return null;

    const isResting = personnel.isResting;
    const isMaxLevel = personnel.level >= GAME_CONFIG.PERSONNEL_MAX_LEVEL;
    const xpProgressPercentage = (personnel.xpToNextLevel > 0) ? (personnel.xp / personnel.xpToNextLevel) * 100 : 100;
    
    const moodColor = personnel.mood > 70 ? 'border-green-500' : personnel.mood > 30 ? 'border-yellow-500' : 'border-red-500';
    const borderColorClass = isMaxLevel ? 'border-yellow-500' : isResting ? 'border-blue-700' : 'border-gray-700';

    const getAssignmentText = () => {
        const assignment = gameState.personnelAssignment[personnel.uniqueId];
        if (isResting) return `Отдыхает... (${Math.ceil((personnel.restEndTime - Date.now()) / 1000)} сек)`;
        if (!assignment) return "Бездействует";

        switch (assignment.role) {
            case 'miner':
                return `Добывает: ${definitions.resources[assignment.assignment]?.name || 'Руда'}`;
            case 'smelter':
                return "Работает в плавильне";
            case 'trader':
                return `Торгует: Полка #${parseInt(assignment.assignment.split('_')[1]) + 1}`;
            default:
                return 'Назначение...';
        }
    };

    const levelUpCost = useMemo(() => {
        let cost = { sparks: 100, matter: 1 };
        if (personnel.level > 0) {
            cost.sparks = Math.floor(100 * Math.pow(1.8, personnel.level));
            cost.matter = Math.floor(1 * Math.pow(1.5, personnel.level));
        }
        return cost;
    }, [personnel.level]);

    return (
        <div 
             className={`bg-black/30 p-3 rounded-lg border-2 flex flex-col w-64 ${borderColorClass}`}
             onClick={() => confirmation.action !== 'none' && setConfirmation({ action: 'none', id: null })}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                     <ImageWithFallback 
                        src={personnelDef.faceImg} 
                        fallbackSrc={UI_CONSTANTS.DEFAULT_AVATAR_SRC}
                        alt={personnelDef.name} 
                        className={`w-16 h-16 object-contain rounded-full border-2 ${moodColor}`}
                    />
                </div>
                <div className="flex-grow flex flex-col justify-center min-w-0">
                    <p className="text-sm font-bold text-white truncate">{personnel.name || personnelDef.name}</p>
                    <p className="text-xs text-yellow-400">Ур. {personnel.level}</p>
                     <div className="text-left mt-2">
                         <p className="text-xs text-gray-400">Назначение</p>
                         <p className="text-sm font-bold text-white truncate">{getAssignmentText()}</p>
                     </div>
                </div>
            </div>
            
            <div className="w-full mt-3 space-y-2">
                <Tooltip text={`Опыт: ${formatNumber(personnel.xp, true)} / ${formatNumber(personnel.xpToNextLevel, true)}`}>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-600 text-md font-bold">XP</p>
                        <div className="w-full bg-gray-800 rounded-full h-2.5 border border-black/20">
                            <div className="bg-green-500 h-full rounded-full" style={{ width: `${xpProgressPercentage}%` }}></div>
                        </div>
                    </div>
                </Tooltip>
                <Tooltip text={`Настроение: ${Math.round(personnel.mood)}%`}>
                     <div className="flex items-center gap-2">
                        <span className="material-icons-outlined text-gray-600 text-lg" title="Настроение">sentiment_satisfied</span>
                        <div className="w-full bg-gray-800 rounded-full h-2.5 border border-black/20">
                            <div className={`h-full rounded-full ${personnel.mood < 30 ? 'bg-red-500' : personnel.mood < 70 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${personnel.mood}%` }}></div>
                        </div>
                     </div>
                </Tooltip>
            </div>

            <div className="flex justify-center items-center gap-6 pt-3 mt-4 border-t border-gray-700/50">
                <ActionButton action="levelUp" personnel={personnel} levelUpCost={levelUpCost} confirmation={confirmation} setConfirmation={setConfirmation} handlers={handlers} />
                <ActionButton action="rest" personnel={personnel} confirmation={confirmation} setConfirmation={setConfirmation} handlers={handlers} />
                <ActionButton action="fire" personnel={personnel} confirmation={confirmation} setConfirmation={setConfirmation} handlers={handlers} />
                <ActionButton action="manage" personnel={personnel} confirmation={confirmation} setConfirmation={setConfirmation} handlers={handlers} />
            </div>
        </div>
    );
});

export default HiredPersonnelCard;
// src/components/ui/InventoryItemCard.jsx
import React from 'react';
import { definitions } from '../../data/definitions';
import Tooltip from './Tooltip';
import { getItemImageSrc } from '../../utils/helpers';

const InventoryItemCard = ({ item, onAction, actionLabel, onReforge, showReforgeButton, onInlay, showInlayButton, onGraving, showGravingButton, isAnyActiveProject }) => {
    const itemDef = definitions.items?.[item.itemKey];
    if (!itemDef) return null;

    const canReforge = showReforgeButton && onReforge;
    const canInlay = showInlayButton && onInlay;
    const canGrave = showGravingButton && onGraving;

    const reforgeButtonDisabled = isAnyActiveProject || !canReforge;
    const inlayButtonDisabled = isAnyActiveProject || !canInlay;
    const gravingButtonDisabled = isAnyActiveProject || !canGrave;
    const actionButtonDisabled = isAnyActiveProject;

    const maxSlots = itemDef.hasInlaySlots ? (item.quality >= 10 ? 3 : item.quality >= 8 ? 2 : item.quality >= 6 ? 1 : 0) : 0;
    const currentSlotsUsed = (item.inlaySlots || []).length;

    let rarityBgClass = 'bg-gray-800/40 border-gray-700';
    if (itemDef.baseIngotType === 'uncommon') rarityBgClass = 'bg-blue-800/40 border-blue-700';
    else if (itemDef.baseIngotType === 'rare') rarityBgClass = 'bg-purple-800/40 border-purple-700';

    return (
        <div className={`${rarityBgClass} rounded-lg p-2 flex flex-col items-center relative overflow-hidden w-max max-w-xs mx-auto`}>
            {item.gravingLevel > 0 && (
                <div className="absolute top-1 right-1 bg-gray-900 text-yellow-300 text-xs font-bold px-2 py-0.5 rounded-full z-10 border border-gray-700">
                    Гр. {item.gravingLevel}
                </div>
            )}

            <div className="flex flex-col justify-start items-center w-full">
                <img
                    src={getItemImageSrc(item.itemKey, 64)}
                    alt={itemDef.name}
                    className="w-16 h-16 object-contain mt-2 img-rounded-corners" // ИЗМЕНЕНО: Добавлен img-rounded-corners
                />
                <p className="text-sm font-bold mt-1 text-white text-center">{itemDef.name}</p>
                <p className="text-xs text-yellow-400">Качество: {item.quality.toFixed(2)}</p>
            </div>

            {itemDef.hasInlaySlots && (
                <div className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                    <span className="material-icons-outlined text-sm">auto_awesome</span>
                    {currentSlotsUsed}/{maxSlots}
                </div>
            )}
            {currentSlotsUsed > 0 && (
                <div className="flex items-center justify-center gap-1 mt-1">
                    {item.inlaySlots.map((slot, index) => (
                        <Tooltip key={index} text={`Инкрустирован: ${definitions.specialItems?.[slot.type]?.name || 'Неизвестно'} (+${slot.qualityBonus.toFixed(2)} качества)`}>
                            <span className="material-icons-outlined text-xs text-pink-400">fiber_manual_record</span>
                        </Tooltip>
                    ))}
                </div>
            )}

            <div className="flex flex-col mt-auto w-full gap-1 p-1">
                {onAction && (
                    <button
                        onClick={onAction}
                        disabled={actionButtonDisabled}
                        className="text-xs interactive-element w-32 bg-orange-800/80 text-white font-bold py-1 px-2 rounded-md hover:enabled:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {actionLabel}
                    </button>
                )}
                {canReforge && actionLabel !== "Перековать" && (
                    <button
                        onClick={() => onReforge(item.uniqueId)}
                        disabled={reforgeButtonDisabled}
                        className="text-xs interactive-element w-32 bg-blue-800/80 text-white font-bold py-1 px-2 rounded-md hover:enabled:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Перековать
                    </button>
                )}
                {canInlay && actionLabel !== "Инкрустировать" && (
                    <button
                        onClick={() => onInlay(item.uniqueId, 'gem')}
                        disabled={inlayButtonDisabled}
                        className="text-xs interactive-element w-32 bg-purple-800/80 text-white font-bold py-1 px-2 rounded-md hover:enabled:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Инкрустировать
                    </button>
                )}
                {canGrave && actionLabel !== "Гравировать" && (
                    <button
                        onClick={() => onGraving(item.uniqueId)}
                        disabled={gravingButtonDisabled}
                        className="text-xs interactive-element w-32 bg-green-800/80 text-white font-bold py-1 px-2 rounded-md hover:enabled:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Гравировать
                    </button>
                )}
            </div>
        </div>
    );
};

export default InventoryItemCard;
// src/components/panels/EquipmentPanel.jsx
import React from 'react';
import { useGame } from '../../context/useGame.js';
import { definitions } from '../../data/definitions/index.js';
import { getItemImageSrc } from '../../utils/helpers.js';
import Tooltip from '../ui/display/Tooltip.jsx';
import Button from '../ui/buttons/Button.jsx';

const EquipmentSlot = ({ slotType, label, icon }) => {
    const { displayedGameState: gameState, handlers } = useGame();
    const itemId = gameState.playerEquipment?.[slotType];
    const item = itemId ? gameState.inventory.find(i => i.uniqueId === itemId) : null;
    const itemDef = item ? definitions.items[item.itemKey] : null;

    const handleEquip = () => {
        handlers.handleOpenEquipPlayerItemModal(slotType);
    };

    const handleUnequip = () => {
        handlers.handleEquipPlayerItem(slotType, null); // Передаем null, чтобы снять предмет
    };

    return (
        <div className="bg-black/20 p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4 border border-gray-700">
            <div className="flex-shrink-0 w-24 h-24 bg-gray-900/50 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                {item && itemDef ? (
                    <Tooltip text={`${itemDef.name} (Ур. ${item.level})`}>
                        <img src={getItemImageSrc(item.itemKey, 80)} alt={itemDef.name} className="w-20 h-20 object-contain" />
                    </Tooltip>
                ) : (
                    <span className="material-icons-outlined text-gray-500 text-5xl">{icon}</span>
                )}
            </div>
            <div className="flex-grow text-center sm:text-left">
                <h4 className="text-lg font-bold text-white">{label}</h4>
                {item && itemDef ? (
                    <div>
                        <p className="text-sm text-yellow-400">{itemDef.name}</p>
                        <ul className="text-xs text-gray-300 mt-1">
                            {Object.entries(itemDef.bonuses).map(([key, value]) => (
                                <li key={key}>+ {value} {definitions.skills[key]?.name || key}</li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">Слот пуст</p>
                )}
            </div>
            <div className="flex-shrink-0 flex flex-col gap-2 w-full sm:w-auto">
                <Button onClick={handleEquip} variant="primary">Экипировать</Button>
                {item && (
                    <Button onClick={handleUnequip} variant="danger">Снять</Button>
                )}
            </div>
        </div>
    );
};

const EquipmentPanel = () => {
    return (
        <div className="space-y-4">
            <h3 className="font-cinzel text-xl text-yellow-400 text-center">Экипировка Мастера</h3>
            <p className="text-gray-400 text-sm mb-6 text-center">Создавайте и экипируйте предметы, чтобы усилить свои ремесленные навыки.</p>
            
            <EquipmentSlot slotType="tool" label="Инструмент" icon="construction" />
            <EquipmentSlot slotType="gear" label="Снаряжение" icon="checkroom" />
            
            {/* Можно будет добавить слоты для аксессуаров позже */}
            {/* <EquipmentSlot slotType="accessory1" label="Аксессуар 1" icon="watch" /> */}
        </div>
    );
};

export default EquipmentPanel;
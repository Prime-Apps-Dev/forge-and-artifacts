// src/components/panels/ResourcePanel.jsx
import React from 'react';
import ResourceItem from '../ui/ResourceItem';
import { definitions } from '../../data/definitions';
import { getResourceImageSrc } from '../../utils/helpers'; // Импортируем новую функцию

const ResourcePanel = React.memo(({ gameState }) => {
    return (
        <div className="panel-section">
            <h3 className="font-cinzel text-lg text-gray-400 border-b border-gray-700/50 pb-1 mb-4">Склад</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Искры и Материя - используем иконки Material Icons */}
                <ResourceItem icon="bolt" name="Искры" initialValue={gameState.sparks} iconClass="text-yellow-400" iconType="icon" />
                <ResourceItem icon="bubble_chart" name="Материя" initialValue={gameState.matter} iconClass="text-purple-400" iconType="icon" />
                
                {/* Руды (используем getResourceImageSrc) */}
                <ResourceItem iconType="img" iconSrc={getResourceImageSrc('ironOre')} name="Железная руда" initialValue={gameState.ironOre} />
                {gameState.purchasedSkills.findCopper && <ResourceItem iconType="img" iconSrc={getResourceImageSrc('copperOre')} name="Медная руда" initialValue={gameState.copperOre} />}
                {gameState.purchasedSkills.mithrilProspecting && <ResourceItem iconType="img" iconSrc={getResourceImageSrc('mithrilOre')} name="Мифриловая руда" initialValue={gameState.mithrilOre} />}
                {gameState.purchasedSkills.adamantiteMining && <ResourceItem iconType="img" iconSrc={getResourceImageSrc('adamantiteOre')} name="Адамантитовая руда" initialValue={gameState.adamantiteOre} />}
                
                {/* Слитки (используем getResourceImageSrc) */}
                <ResourceItem iconType="img" iconSrc={getResourceImageSrc('ironIngots')} name="Железные слитки" initialValue={gameState.ironIngots} />
                {gameState.purchasedSkills.findCopper && <ResourceItem iconType="img" iconSrc={getResourceImageSrc('copperIngots')} name="Медные слитки" initialValue={gameState.copperIngots} />}
                {gameState.purchasedSkills.artOfAlloys && <ResourceItem iconType="img" iconSrc={getResourceImageSrc('bronzeIngots')} name="Бронзовые слитки" initialValue={gameState.bronzeIngots} />}
                {gameState.purchasedSkills.artOfAlloys && <ResourceItem iconType="img" iconSrc={getResourceImageSrc('sparksteelIngots')} name="Слитки Искростали" initialValue={gameState.sparksteelIngots} />}
                {gameState.purchasedSkills.mithrilProspecting && <ResourceItem iconType="img" iconSrc={getResourceImageSrc('mithrilIngots')} name="Мифриловые слитки" initialValue={gameState.mithrilIngots} />}
                {gameState.purchasedSkills.adamantiteMining && <ResourceItem iconType="img" iconSrc={getResourceImageSrc('adamantiteIngots')} name="Адамантитовые слитки" initialValue={gameState.adamantiteIngots} />}
                {gameState.purchasedSkills.arcaneMetallurgy && <ResourceItem iconType="img" iconSrc={getResourceImageSrc('arcaniteIngots')} name="Арканитовые слитки" initialValue={gameState.arcaniteIngots} />}
            </ul>

            {Object.values(gameState.specialItems).some(val => val > 0) && (
                 <h3 className="font-cinzel text-lg text-gray-400 border-b border-gray-700/50 pb-1 my-4">Особые Предметы</h3>
            )}
           
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Особые предметы (для которых нет специфичных иконок в definitions.resourceIcons, используем Material Icons или добавляем их иконки в specialItems definitions) */}
                {/* Если у specialItems[id].icon - это путь к файлу, используем img, иначе span */}
                {Object.entries(gameState.specialItems).map(([itemId, amount]) => {
                    if (amount > 0) {
                        const specialItemDef = definitions.specialItems[itemId];
                        if (!specialItemDef) return null;
                        const iconType = specialItemDef.icon && specialItemDef.icon.startsWith('/') ? 'img' : 'icon';
                        const iconSrc = iconType === 'img' ? specialItemDef.icon : null;
                        const iconName = iconType === 'icon' ? (specialItemDef.icon || 'help_outline') : null;
                        
                        // Специальные обработки для чертежей, если у них нет своих icon-путей
                        if (itemId.startsWith('blueprint_')) {
                             return <ResourceItem key={itemId} icon="auto_stories" name={specialItemDef.name} initialValue={amount} iconClass="text-blue-400" iconType="icon" />;
                        }

                        return (
                            <ResourceItem 
                                key={itemId} 
                                icon={iconName} // Для material-icons
                                iconSrc={iconSrc} // Для img
                                name={specialItemDef.name} 
                                initialValue={amount} 
                                iconClass="text-pink-400" // Цвет по умолчанию для особых предметов
                                iconType={iconType}
                            />
                        );
                    }
                    return null;
                })}
            </ul>
        </div>
    );
});

export default ResourcePanel;
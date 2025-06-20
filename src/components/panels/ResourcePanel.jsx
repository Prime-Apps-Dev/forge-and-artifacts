// src/components/panels/ResourcePanel.jsx
import React from 'react';
import ResourceItem from '../ui/ResourceItem';
import { definitions } from '../../data/definitions';

const ResourcePanel = React.memo(({ gameState }) => {
    return (
        <div className="panel-section">
            <h3 className="font-cinzel text-lg text-gray-400 border-b border-gray-700/50 pb-1 mb-4">Склад</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* ИЗМЕНЕНО: Искры и Материя - используем иконки Material Icons */}
                <ResourceItem icon="bolt" name="Искры" initialValue={gameState.sparks} iconClass="text-yellow-400" iconType="icon" />
                <ResourceItem icon="bubble_chart" name="Материя" initialValue={gameState.matter} iconClass="text-purple-400" iconType="icon" />
                
                {/* Руды (оставляем изображения, если они были настроены) */}
                <ResourceItem iconType="img" iconSrc={definitions.resourceIcons.ironOre} name="Железная руда" initialValue={gameState.ironOre} />
                {gameState.purchasedSkills.findCopper && <ResourceItem iconType="img" iconSrc={definitions.resourceIcons.copperOre} name="Медная руда" initialValue={gameState.copperOre} />}
                {gameState.purchasedSkills.mithrilProspecting && <ResourceItem iconType="img" iconSrc={definitions.resourceIcons.mithrilOre} name="Мифриловая руда" initialValue={gameState.mithrilOre} />}
                {gameState.purchasedSkills.adamantiteMining && <ResourceItem iconType="img" iconSrc={definitions.resourceIcons.adamantiteOre} name="Адамантитовая руда" initialValue={gameState.adamantiteOre} />}
                
                {/* Слитки (используют изображения) */}
                <ResourceItem iconType="img" iconSrc={definitions.recipes.iron.icon} name="Железные слитки" initialValue={gameState.ironIngots} />
                {gameState.purchasedSkills.findCopper && <ResourceItem iconType="img" iconSrc={definitions.recipes.copper.icon} name="Медные слитки" initialValue={gameState.copperIngots} />}
                {gameState.purchasedSkills.artOfAlloys && <ResourceItem iconType="img" iconSrc={definitions.recipes.bronze.icon} name="Бронзовые слитки" initialValue={gameState.bronzeIngots} />}
                {gameState.purchasedSkills.artOfAlloys && <ResourceItem iconType="img" iconSrc={definitions.recipes.sparksteel.icon} name="Слитки Искростали" initialValue={gameState.sparksteelIngots} />}
                {gameState.purchasedSkills.mithrilProspecting && <ResourceItem iconType="img" iconSrc={definitions.recipes.mithril.icon} name="Мифриловые слитки" initialValue={gameState.mithrilIngots} />}
                {gameState.purchasedSkills.adamantiteMining && <ResourceItem iconType="img" iconSrc={definitions.recipes.adamantite.icon} name="Адамантитовые слитки" initialValue={gameState.adamantiteIngots} />}
                {gameState.purchasedSkills.arcaneMetallurgy && <ResourceItem iconType="img" iconSrc={definitions.recipes.arcanite.icon} name="Арканитовые слитки" initialValue={gameState.arcaniteIngots} />}
            </ul>

            {Object.values(gameState.specialItems).some(val => val > 0) && (
                 <h3 className="font-cinzel text-lg text-gray-400 border-b border-gray-700/50 pb-1 my-4">Особые Предметы</h3>
            )}
           
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Особые предметы (оставляем Material Icons, так как они не имеют отдельных изображений в items.js) */}
                <ResourceItem icon="diamond" name="Самоцветы" initialValue={gameState.specialItems.gem} iconClass="text-pink-400" />
                {gameState.specialItems.expeditionMap > 0 && <ResourceItem icon="map" name="Карты вылазок" initialValue={gameState.specialItems.expeditionMap} iconClass="text-yellow-600" />}
                {gameState.specialItems.material_guardianHeart > 0 && <ResourceItem icon="heart_plus" name="Сердце стража" initialValue={gameState.specialItems.material_guardianHeart} iconClass="text-red-400" />}
                {gameState.specialItems.material_adamantFrame > 0 && <ResourceItem icon="construction" name="Адамантиновая основа" initialValue={gameState.specialItems.material_adamantFrame} iconClass="text-blue-400" />}
                {gameState.specialItems.material_lavaAgate > 0 && <ResourceItem icon="local_fire_department" name="Лавовый агат" initialValue={gameState.specialItems.material_lavaAgate} iconClass="text-orange-400" />}
                {gameState.specialItems.material_ironwoodHandle > 0 && <ResourceItem icon="park" name="Рукоять из железного дерева" initialValue={gameState.specialItems.material_ironwoodHandle} iconClass="text-green-600" />}
                {gameState.specialItems.material_sunTear > 0 && <ResourceItem icon="brightness_high" name="Слеза солнца" initialValue={gameState.specialItems.material_sunTear} iconClass="text-yellow-400" />}
                {gameState.specialItems.material_purifiedGold > 0 && <ResourceItem icon="payments" name="Очищенное золото" initialValue={gameState.specialItems.material_purifiedGold} iconClass="text-yellow-500" />}
                {Object.keys(definitions.greatArtifacts).map(artId => {
                    const blueprintItemId = definitions.greatArtifacts[artId].components.blueprint.itemId;
                    if (gameState.specialItems[blueprintItemId] > 0) {
                        return <ResourceItem key={blueprintItemId} icon="auto_stories" name={definitions.specialItems[blueprintItemId].name} initialValue={gameState.specialItems[blueprintItemId]} iconClass="text-blue-400" />
                    }
                    return null;
                })}
            </ul>
        </div>
    );
});

export default ResourcePanel;
// src/components/panels/ResourcePanel.jsx
import React from 'react';
import ResourceItem from '../ui/ResourceItem';
import { definitions } from '../../data/definitions';

const ResourcePanel = React.memo(({ gameState }) => {
    return (
        <div className="panel-section">
            <h3 className="font-cinzel text-lg text-gray-400 border-b border-gray-700/50 pb-1 mb-4">Склад</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <ResourceItem icon="bolt" name="Искры" initialValue={gameState.sparks} iconClass="text-yellow-400" />
                <ResourceItem icon="bubble_chart" name="Материя" initialValue={gameState.matter} iconClass="text-purple-400" />
                
                <ResourceItem icon="lens" name="Железная руда" initialValue={gameState.ironOre} iconClass="text-gray-400" />
                {gameState.purchasedSkills.findCopper && <ResourceItem icon="filter_alt" name="Медная руда" initialValue={gameState.copperOre} iconClass="text-orange-400" />}
                {gameState.purchasedSkills.mithrilProspecting && <ResourceItem icon="ac_unit" name="Мифриловая руда" initialValue={gameState.mithrilOre} iconClass="text-cyan-400" />}
                {gameState.purchasedSkills.adamantiteMining && <ResourceItem icon="diamond" name="Адамантитовая руда" initialValue={gameState.adamantiteOre} iconClass="text-indigo-400" />}
                
                <ResourceItem icon="view_in_ar" name="Железные слитки" initialValue={gameState.ironIngots} iconClass="text-gray-300" />
                {gameState.purchasedSkills.findCopper && <ResourceItem icon="view_in_ar" name="Медные слитки" initialValue={gameState.copperIngots} iconClass="text-orange-400" />}
                {gameState.purchasedSkills.artOfAlloys && <ResourceItem icon="shield" name="Бронзовые слитки" initialValue={gameState.bronzeIngots} iconClass="text-orange-600" />}
                
                {gameState.purchasedSkills.artOfAlloys && <ResourceItem icon="bolt" name="Слитки Искростали" initialValue={gameState.sparksteelIngots} iconClass="text-blue-400" />}

                {gameState.purchasedSkills.mithrilProspecting && <ResourceItem icon="shield_moon" name="Мифриловые слитки" initialValue={gameState.mithrilIngots} iconClass="text-cyan-300" />}
                {gameState.purchasedSkills.adamantiteMining && <ResourceItem icon="security" name="Адамантитовые слитки" initialValue={gameState.adamantiteIngots} iconClass="text-indigo-300" />}
                {gameState.purchasedSkills.arcaneMetallurgy && <ResourceItem icon="auto_fix_high" name="Арканитовые слитки" initialValue={gameState.arcaniteIngots} iconClass="text-fuchsia-500" />}
            </ul>

            {Object.values(gameState.specialItems).some(val => val > 0) && (
                 <h3 className="font-cinzel text-lg text-gray-400 border-b border-gray-700/50 pb-1 my-4">Особые Предметы</h3>
            )}
           
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
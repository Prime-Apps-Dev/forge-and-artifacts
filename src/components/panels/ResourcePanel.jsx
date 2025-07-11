// src/components/panels/ResourcePanel.jsx
import React from 'react';
import ResourceItem from '../ui/cards/ResourceItem';
import { definitions } from '../../data/definitions/index.js';
import { useGame } from '../../context/useGame.js'; // ИЗМЕНЕН ПУТЬ ИМПОРТА


const ResourcePanel = React.memo(() => {
    const { displayedGameState: gameState } = useGame();

    return (
        <div className="panel-section">
            <h3 className="font-cinzel text-lg text-gray-400 border-b border-gray-700/50 pb-1 mb-4">Склад</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <ResourceItem icon="bolt" name="Искры" initialValue={gameState.sparks} iconClass="text-yellow-400" iconType="icon" />
                <ResourceItem icon="bubble_chart" name="Материя" initialValue={gameState.matter} iconClass="text-purple-400" iconType="icon" />
                
                <ResourceItem iconType="img" resourceId='ironOre' name={definitions.resources.ironOre.name} initialValue={gameState.ironOre} />
                {gameState.purchasedSkills.findCopper && <ResourceItem iconType="img" resourceId='copperOre' name={definitions.resources.copperOre.name} initialValue={gameState.copperOre} />}
                {gameState.purchasedSkills.mithrilProspecting && <ResourceItem iconType="img" resourceId='mithrilOre' name={definitions.resources.mithrilOre.name} initialValue={gameState.mithrilOre} />}
                {gameState.purchasedSkills.adamantiteMining && <ResourceItem iconType="img" resourceId='adamantiteOre' name={definitions.resources.adamantiteOre.name} initialValue={gameState.adamantiteOre} />}
                
                <ResourceItem iconType="img" resourceId='ironIngots' name={definitions.resources.ironIngots.name} initialValue={gameState.ironIngots} />
                {gameState.purchasedSkills.findCopper && <ResourceItem iconType="img" resourceId='copperIngots' name={definitions.resources.copperIngots.name} initialValue={gameState.copperIngots} />}
                {gameState.purchasedSkills.artOfAlloys && <ResourceItem iconType="img" resourceId='bronzeIngots' name={definitions.resources.bronzeIngots.name} initialValue={gameState.bronzeIngots} />}
                {gameState.purchasedSkills.artOfAlloys && <ResourceItem iconType="img" resourceId='sparksteelIngots' name={definitions.resources.sparksteelIngots.name} initialValue={gameState.sparksteelIngots} />}
                {gameState.purchasedSkills.mithrilProspecting && <ResourceItem iconType="img" resourceId='mithrilIngots' name={definitions.resources.mithrilIngots.name} initialValue={gameState.mithrilIngots} />}
                {gameState.purchasedSkills.adamantiteMining && <ResourceItem iconType="img" resourceId='adamantiteIngots' name={definitions.resources.adamantiteIngots.name} initialValue={gameState.adamantiteIngots} />}
                {gameState.purchasedSkills.arcaneMetallurgy && <ResourceItem iconType="img" resourceId='arcaniteIngots' name={definitions.resources.arcaniteIngots.name} initialValue={gameState.arcaniteIngots} />}
            </ul>

            {Object.values(gameState.specialItems).some(val => val > 0) && (
                 <h3 className="font-cinzel text-lg text-gray-400 border-b border-gray-700/50 pb-1 my-4">Особые Предметы</h3>
            )}
           
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(gameState.specialItems).map(([itemId, amount]) => {
                    if (amount > 0) {
                        const specialItemDef = definitions.specialItems[itemId];
                        if (!specialItemDef) return null;
                        
                        if (itemId.startsWith('blueprint_')) {
                             return <ResourceItem key={itemId} icon="auto_stories" name={specialItemDef.name} initialValue={amount} iconClass="text-blue-400" iconType="icon" />;
                        }

                        return (
                            <ResourceItem 
                                key={itemId} 
                                icon={specialItemDef.icon}
                                name={specialItemDef.name} 
                                initialValue={amount} 
                                iconClass="text-pink-400"
                                iconType={specialItemDef.icon?.startsWith('/') ? 'img' : 'icon'}
                                resourceId={itemId}
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
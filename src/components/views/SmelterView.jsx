// src/components/views/SmelterView.jsx
import React, { useMemo } from 'react';
import { definitions } from '../../data/definitions/index.js';
import SmeltButton from '../ui/buttons/SmeltButton';
import { useGame } from '../../context/useGame.js';
import { getResourceImageSrc } from '../../utils/helpers';
import Tooltip from '../ui/display/Tooltip';

const SmelterView = () => {
    const { displayedGameState: gameState, handlers } = useGame();
    const { smeltingProcess, smeltingQueue, smeltingQueueCapacity } = gameState;

    const smeltRecipe = smeltingProcess ? definitions.recipes[smeltingProcess.recipeId] : null;

    const allSmeltableRecipes = useMemo(() => {
        return Object.keys(definitions.recipes).filter(id => {
            const recipe = definitions.recipes[id];
            if (!recipe) return false;
            if (recipe.requiredSkill && !gameState.purchasedSkills[recipe.requiredSkill]) return false;
            return true;
        });
    }, [gameState.purchasedSkills]);

    return (
        <div>
             <h2 className="font-cinzel text-2xl accent-glow-color text-shadow-glow flex items-center gap-2 border-b border-gray-700 pb-4 mb-6">
                <span className="material-icons-outlined">fireplace</span> Плавильня
            </h2>
            <div className="flex flex-col gap-8">
                <div className="p-4 border border-gray-700 bg-black/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-cinzel text-lg">Доступные Рецепты</h4>
                        {gameState.purchasedSkills.smeltingAutomation && (
                            <p className="text-sm text-gray-400">
                                Очередь: <span className="font-bold text-white">{smeltingQueue.length}</span> / {smeltingQueueCapacity}
                            </p>
                        )}
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4">Переплавляйте руду в слитки или комбинируйте металлы для получения превосходных сплавов. Все процессы используют общую плавильню и очередь.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {allSmeltableRecipes.map(recipeId => (
                            <SmeltButton key={recipeId} recipeId={recipeId} />
                        ))}
                    </div>
                    {(smeltingProcess || smeltingQueue.length > 0) && (
                        <div className="mt-6 pt-4 border-t border-gray-600">
                            {smeltingProcess && (
                                <div className="mb-4">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-orange-400">Сейчас плавится: {smeltRecipe?.name}</p>
                                        <button onClick={handlers.handleCancelSmelt} className="text-red-500 hover:text-red-400 text-xs font-bold interactive-element px-2 py-1 rounded-md hover:bg-red-500/10">ОТМЕНИТЬ</button>
                                    </div>
                                    <div className="w-full bg-gray-900 rounded-full h-2.5 mt-1">
                                        <div
                                            className="bg-orange-500 h-2.5 rounded-full"
                                            style={{ width: `${smeltRecipe ? (smeltingProcess.progress / smeltRecipe.requiredProgress) * 100 : 0}%`, transition: 'width 0.2s linear' }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                            {smeltingQueue.length > 0 && (
                                <div>
                                    <p className="font-bold text-gray-300 mb-2">В очереди:</p>
                                    <div className="flex items-center gap-2 bg-black/30 p-2 rounded-md flex-wrap">
                                        {smeltingQueue.map((recipeId, index) => {
                                            const recipe = definitions.recipes[recipeId];
                                            if (!recipe) return null;
                                            const outputResource = Object.keys(recipe.output)[0];
                                            const imageSrc = recipe.icon || getResourceImageSrc(outputResource);
                                            return (
                                                <Tooltip key={`${recipeId}-${index}`} text={recipe.name}>
                                                    <img src={imageSrc} alt={recipe.name} className="w-10 h-10 object-contain img-rounded-corners border border-gray-600"/>
                                                </Tooltip>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmelterView;
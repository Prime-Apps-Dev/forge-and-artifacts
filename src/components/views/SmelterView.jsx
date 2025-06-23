// src/components/views/SmelterView.jsx
import React from 'react';
import { definitions } from '../../data/definitions';
import SmeltButton from '../ui/buttons/SmeltButton'; // Обновленный путь
import Tooltip from '../ui/display/Tooltip'; // Обновленный путь
import { getResourceImageSrc } from '../../utils/helpers';

const resourceNames = {
    ironOre: 'железной руды',
    copperOre: 'медной руды',
    mithrilOre: 'мифриловой руды',
    adamantiteOre: 'адамантитовой руды',
    ironIngots: 'железных слитков',
    copperIngots: 'медных слитков',
    adamantiteIngots: 'адамантитовых слитков',
    matter: 'материи',
    sparks: 'искр'
};

const SmelterView = ({ gameState, handlers }) => {
    const { purchasedSkills, smeltingProcess, isFirstPlaythrough } = gameState;

    const smeltRecipe = smeltingProcess ? definitions.recipes[smeltingProcess.recipeId] : null;

    const getSmeltRecipeData = (recipeId, skillRequired = null, lockedByPlaythrough = false) => {
        const recipe = definitions.recipes[recipeId];
        if (!recipe) return null;

        const isUnlocked = skillRequired ? purchasedSkills[skillRequired] : true;
        const isPlaythroughLocked = lockedByPlaythrough && isFirstPlaythrough;
        const isTotallyLocked = !isUnlocked || isPlaythroughLocked;

        let costResource = Object.keys(recipe.input)[0];
        let costAmount = recipe.input[costResource];

        if (recipeId === 'iron' && purchasedSkills.efficientBellows) {
            costAmount = Math.max(1, costAmount - 2);
        } else if (recipeId === 'copper' && purchasedSkills.crucibleRefinement) {
            costAmount = Math.max(1, costAmount - 2);
        }

        const hasEnough = gameState[costResource] >= costAmount;
        const isDisabled = !hasEnough || !!smeltingProcess || isTotallyLocked;

        let lockText = '';
        if (!isUnlocked) {
            const skillDef = definitions.skills[skillRequired];
            lockText = `Изучите навык '${skillDef?.name || skillRequired}' для разблокировки.`;
        } else if (isPlaythroughLocked) {
            lockText = "Доступно после первого Переселения.";
        } else if (!hasEnough) {
            lockText = `Недостаточно ${definitions.resources?.[costResource]?.name || resourceNames[costResource]} (${costAmount} требуется)!`;
        } else if (!!smeltingProcess) {
            lockText = "Плавильня занята.";
        }

        return {
            recipeId,
            name: recipe.name,
            iconSrc: getResourceImageSrc(Object.keys(recipe.output)[0]),
            isLocked: isTotallyLocked,
            isDisabled,
            lockText,
            skillLearnedButLocked: isUnlocked && isPlaythroughLocked,
            hasEnough,
            smeltingProcessActive: !!smeltingProcess
        };
    };

    const getAlloyRecipeData = (recipeId, skillRequired, lockedByPlaythrough = false) => {
        const recipe = definitions.recipes[recipeId];
        if (!recipe) return null;

        const isUnlocked = skillRequired ? purchasedSkills[skillRequired] : true;
        const isPlaythroughLocked = lockedByPlaythrough && isFirstPlaythrough;
        const isTotallyLocked = !isUnlocked || isPlaythroughLocked;

        let hasEnough = true;
        for (const resource in recipe.input) {
            if (gameState[resource] < recipe.input[resource]) {
                hasEnough = false;
                break;
            }
        }
        const isDisabled = !hasEnough || isTotallyLocked;

        let lockText = '';
        if (!isUnlocked) {
            const skillDef = definitions.skills[skillRequired];
            lockText = `Изучите навык '${skillDef?.name || skillRequired}' для разблокировки.`;
        } else if (isPlaythroughLocked) {
            lockText = "Доступно после первого Переселения.";
        } else if (!hasEnough) {
            lockText = "Недостаточно ресурсов.";
        }

        return {
            recipeId,
            name: recipe.name,
            iconSrc: getResourceImageSrc(Object.keys(recipe.output)[0]),
            isLocked: isTotallyLocked,
            isDisabled,
            lockText,
            skillLearnedButLocked: isUnlocked && isPlaythroughLocked,
            hasEnough
        };
    };

    const smeltRecipes = [
        getSmeltRecipeData('iron'),
        getSmeltRecipeData('copper', 'findCopper'),
        getSmeltRecipeData('mithril', 'mithrilProspecting', true),
        getSmeltRecipeData('adamantite', 'adamantiteMining', true),
    ];

    const alloyRecipes = [
        getAlloyRecipeData('bronze', 'artOfAlloys'),
        getAlloyRecipeData('sparksteel', 'artOfAlloys'),
        getAlloyRecipeData('arcanite', 'arcaneMetallurgy', true),
    ];

    return (
        <div>
             <h2 className="font-cinzel text-2xl accent-glow-color text-shadow-glow flex items-center gap-2 border-b border-gray-700 pb-4 mb-6">
                <span className="material-icons-outlined">fireplace</span> Плавильня
            </h2>
            <div className="flex flex-col gap-8">
                <div className="p-4 border border-gray-700 bg-black/20 rounded-lg">
                    <h4 className="font-cinzel text-lg mb-2">Плавка Руды</h4>
                    <p className="text-gray-400 text-sm mb-4">Переплавьте руду в прочные металлические слитки. Подмастерье плавит только железо.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {smeltRecipes.map(recipe => (
                            recipe && !recipe.isLocked ? (
                                <div key={recipe.recipeId} className="flex flex-col items-center">
                                    <Tooltip text={recipe.lockText}>
                                        <SmeltButton recipeId={recipe.recipeId} onClick={handlers.handleSmelt} disabled={recipe.isDisabled} gameState={gameState} />
                                    </Tooltip>
                                </div>
                            ) : null
                        ))}
                    </div>
                    {smeltingProcess && (
                        <div className="mt-4">
                            <p>Плавка: {smeltRecipe?.name}</p>
                            <div className="w-full bg-gray-900 rounded-full h-2.5 mt-1">
                                <div
                                    className="bg-orange-500 h-2.5 rounded-full"
                                    style={{ width: `${smeltRecipe ? (smeltingProcess.progress / smeltRecipe.requiredProgress) * 100 : 0}%`, transition: 'width 0.2s linear' }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
                 <div className="p-4 border border-gray-700 bg-black/20 rounded-lg">
                    <h4 className="font-cinzel text-lg mb-2">Создание Сплавов</h4>
                    <p className="text-gray-400 text-sm mb-4">Комбинируйте металлы для получения превосходных материалов.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {alloyRecipes.map(recipe => (
                            recipe && !recipe.isLocked ? (
                                <div key={recipe.recipeId} className="flex flex-col items-center">
                                    <Tooltip text={recipe.lockText}>
                                        <SmeltButton recipeId={recipe.recipeId} onClick={handlers.handleForgeAlloy} disabled={recipe.isDisabled} gameState={gameState} />
                                    </Tooltip>
                                </div>
                            ) : null
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmelterView;
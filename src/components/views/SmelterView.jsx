// src/components/views/SmelterView.jsx
import React from 'react';
import { definitions } from '../../data/definitions';
import SmeltButton from '../ui/SmeltButton';

const SmelterView = ({ gameState, handlers }) => {
    // ИЗМЕНЕНО: Добавлен bronzeIngots в деструктуризацию gameState
    const { purchasedSkills, smeltingProcess, ironOre, copperOre, mithrilOre, adamantiteOre, ironIngots, copperIngots, bronzeIngots, adamantiteIngots, matter, isFirstPlaythrough } = gameState;

    let ironCost = definitions.recipes.iron?.input?.ironOre || 9999;
    if (purchasedSkills.efficientBellows) {
        ironCost = Math.max(1, ironCost - 2);
    }

    let copperCost = definitions.recipes.copper?.input?.copperOre || 9999;
    if (purchasedSkills.crucibleRefinement) {
        copperCost = Math.max(1, copperCost - 2);
    }

    const hasEnoughForIron = ironOre >= ironCost;
    const hasEnoughForCopper = copperOre >= copperCost;
    const hasEnoughForMithril = mithrilOre >= (definitions.recipes.mithril?.input?.mithrilOre || 9999);
    const hasEnoughForAdamantite = adamantiteOre >= (definitions.recipes.adamantite?.input?.adamantiteOre || 9999);
    const hasEnoughForBronze = ironIngots >= (definitions.recipes.bronze?.input?.ironIngots || 9999) && copperIngots >= (definitions.recipes.bronze?.input?.copperIngots || 9999);
    const hasEnoughForSparksteel = bronzeIngots >= (definitions.recipes.sparksteel?.input?.bronzeIngots || 9999) && gameState.sparks >= (definitions.recipes.sparksteel?.input?.sparks || 9999); // Проверка для искростали
    const hasEnoughForArcanite = adamantiteIngots >= (definitions.recipes.arcanite?.input?.adamantiteIngots || 9999) && matter >= (definitions.recipes.arcanite?.input?.matter || 9999);

    const smeltRecipe = smeltingProcess ? definitions.recipes[smeltingProcess.recipeId] : null;

    const canSmeltMithril = purchasedSkills.mithrilProspecting && !isFirstPlaythrough;
    const canSmeltAdamantite = purchasedSkills.adamantiteMining && !isFirstPlaythrough;
    const canSmeltArcanite = purchasedSkills.arcaneMetallurgy && !isFirstPlaythrough;


    return (
        <div>
             <h2 className="font-cinzel text-2xl accent-glow-color text-shadow-glow flex items-center gap-2 border-b border-gray-700 pb-4 mb-6">
                <span className="material-icons-outlined">fireplace</span> Плавильня
            </h2>
            <div className="flex flex-col gap-8">
                <div className="p-4 border border-gray-700 bg-black/20 rounded-lg">
                    <h4 className="font-cinzel text-lg mb-2">Плавка Руды</h4>
                    <p className="text-gray-400 text-sm mb-4">Переплавьте руду в прочные металлические слитки. Подмастерье плавит только железо.</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <SmeltButton recipeId="iron" onClick={handlers.handleSmelt} disabled={!hasEnoughForIron || !!smeltingProcess} gameState={gameState}>
                            <img src={definitions.recipes.iron.icon} alt="Железный слиток" className="w-12 h-12 object-contain mb-1" />
                            <span>Железный слиток</span>
                        </SmeltButton>

                        {purchasedSkills.findCopper && (
                            <SmeltButton recipeId="copper" onClick={handlers.handleSmelt} disabled={!hasEnoughForCopper || !!smeltingProcess} gameState={gameState}>
                                <img src={definitions.recipes.copper.icon} alt="Медный слиток" className="w-12 h-12 object-contain mb-1" />
                                <span>Медный слиток</span>
                            </SmeltButton>
                        )}
                        {canSmeltMithril && (
                            <SmeltButton recipeId="mithril" onClick={handlers.handleSmelt} disabled={!hasEnoughForMithril || !!smeltingProcess} gameState={gameState}>
                                <img src={definitions.recipes.mithril.icon} alt="Мифриловый слиток" className="w-12 h-12 object-contain mb-1" />
                                <span>Мифриловый слиток</span>
                            </SmeltButton>
                        )}
                        {purchasedSkills.mithrilProspecting && isFirstPlaythrough && (
                            <SmeltButton recipeId="mithril" onClick={()=>{}} disabled={true} gameState={gameState}>
                                <img src={definitions.recipes.mithril.icon} alt="Мифриловый слиток" className="w-12 h-12 object-contain mb-1 opacity-50" />
                                <span className="text-cyan-400 opacity-50">Мифриловый слиток</span>
                                <div className="text-red-400 text-xs mt-1">После Переселения</div>
                            </SmeltButton>
                        )}
                        {canSmeltAdamantite && (
                             <SmeltButton recipeId="adamantite" onClick={handlers.handleSmelt} disabled={!hasEnoughForAdamantite || !!smeltingProcess} gameState={gameState}>
                                <img src={definitions.recipes.adamantite.icon} alt="Адамантитовый слиток" className="w-12 h-12 object-contain mb-1" />
                                <span>Адамантитовый слиток</span>
                            </SmeltButton>
                        )}
                         {purchasedSkills.adamantiteMining && isFirstPlaythrough && (
                             <SmeltButton recipeId="adamantite" onClick={()=>{}} disabled={true} gameState={gameState}>
                                <img src={definitions.recipes.adamantite.icon} alt="Адамантитовый слиток" className="w-12 h-12 object-contain mb-1 opacity-50" />
                                <span className="text-indigo-400 opacity-50">Адамантитовый слиток</span>
                                <div className="text-red-400 text-xs mt-1">После Переселения</div>
                            </SmeltButton>
                        )}
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
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {purchasedSkills.artOfAlloys && (
                            <SmeltButton recipeId="bronze" onClick={handlers.handleForgeAlloy} disabled={!hasEnoughForBronze} gameState={gameState}>
                                <img src={definitions.recipes.bronze.icon} alt="Бронзовый слиток" className="w-12 h-12 object-contain mb-1" />
                                <span>Бронзовый слиток</span>
                            </SmeltButton>
                        )}
                         {purchasedSkills.artOfAlloys && (
                            <SmeltButton recipeId="sparksteel" onClick={handlers.handleForgeAlloy} disabled={!hasEnoughForSparksteel} gameState={gameState}>
                                <img src={definitions.recipes.sparksteel.icon} alt="Слиток Искростали" className="w-12 h-12 object-contain mb-1" />
                                <span>Слиток Искростали</span>
                            </SmeltButton>
                        )}
                        {canSmeltArcanite && (
                            <SmeltButton recipeId="arcanite" onClick={handlers.handleForgeAlloy} disabled={!hasEnoughForArcanite} gameState={gameState}>
                                <img src={definitions.recipes.arcanite.icon} alt="Арканитовый слиток" className="w-12 h-12 object-contain mb-1" />
                                <span>Арканитовый слиток</span>
                            </SmeltButton>
                        )}
                        {purchasedSkills.arcaneMetallurgy && isFirstPlaythrough && (
                            <SmeltButton recipeId="arcanite" onClick={()=>{}} disabled={true} gameState={gameState}>
                                <img src={definitions.recipes.arcanite.icon} alt="Арканитовый слиток" className="w-12 h-12 object-contain mb-1 opacity-50" />
                                <span className="text-fuchsia-500 opacity-50">Арканитовый слиток</span>
                                <div className="text-red-400 text-xs mt-1">После Переселения</div>
                            </SmeltButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmelterView;
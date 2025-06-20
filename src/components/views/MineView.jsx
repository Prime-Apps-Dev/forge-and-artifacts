import React from 'react';
import MineButton from '../ui/MineButton';
import { formatNumber } from '../../utils/helpers';

const MineView = ({ gameState, handlers }) => {
    const { purchasedSkills, isFirstPlaythrough } = gameState; // ИЗМЕНЕНИЕ: Добавлена isFirstPlaythrough
    const canMineCopper = purchasedSkills?.findCopper;
    const canMineMithril = purchasedSkills?.mithrilProspecting && !isFirstPlaythrough; // ИЗМЕНЕНИЕ: Зависит от isFirstPlaythrough
    const canMineAdamantite = purchasedSkills?.adamantiteMining && !isFirstPlaythrough; // ИЗМЕНЕНИЕ: Зависит от isFirstPlaythrough

    return (
        <div>
            <h2 className="font-cinzel text-2xl accent-glow-color text-shadow-glow flex items-center gap-2 border-b border-gray-700 pb-4 mb-6">
                <span className="material-icons-outlined">terrain</span> Шахта
            </h2>
            <p className="text-gray-400 mb-6">Здесь можно добыть ценную руду для будущих шедевров. Подмастерья будут добывать только базовые типы руды.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Железная руда всегда доступна */}
                <div className="flex flex-col items-center">
                    <MineButton
                        oreType="ironOre"
                        name="Железная руда"
                        imgSrc="/img/ores/iron_ore.png"
                        onClick={handlers.handleMineOre}
                    />
                    <p className="text-sm text-gray-400 mt-2">В наличии: {formatNumber(gameState.ironOre)}</p>
                </div>

                {/* Медная руда отображается только если изучен навык findCopper */}
                {canMineCopper && (
                    <div className="flex flex-col items-center">
                        <MineButton
                            oreType="copperOre"
                            name="Медная руда"
                            imgSrc="/img/ores/copper_ore.png"
                            onClick={handlers.handleMineOre}
                            isLocked={false}
                            lockText=""
                        />
                        <p className="text-sm text-gray-400 mt-2">В наличии: {formatNumber(gameState.copperOre)}</p>
                    </div>
                )}

                {/* Мифриловая руда отображается только если изучен навык mithrilProspecting И не первое прохождение */}
                {canMineMithril && (
                    <div className="flex flex-col items-center">
                        <MineButton
                            oreType="mithrilOre"
                            name="Мифриловая руда"
                            imgSrc="/img/ores/mithril_ore.png"
                            onClick={handlers.handleMineOre}
                            isLocked={false}
                            lockText=""
                        />
                        <p className="text-sm text-cyan-400 mt-2">В наличии: {formatNumber(gameState.mithrilOre)}</p> {/* Изменен цвет текста */}
                    </div>
                )}
                {!canMineMithril && purchasedSkills?.mithrilProspecting && isFirstPlaythrough && ( // ИЗМЕНЕНИЕ: Заблокированная кнопка, если навык есть, но первое прохождение
                    <Tooltip text="Доступно после первого Переселения.">
                        <div className="flex flex-col items-center opacity-50 cursor-not-allowed">
                            <MineButton
                                oreType="mithrilOre"
                                name="Мифриловая руда"
                                description=""
                                imgSrc="/img/ores/mithril_ore.png"
                                onClick={() => {}} // Пустой onClick
                                isLocked={true}
                                lockText="Доступно после первого Переселения."
                            />
                             <p className="text-sm text-gray-400 mt-2">Навык изучен</p>
                        </div>
                    </Tooltip>
                )}

                {/* Адамантитовая руда отображается только если изучен навык adamantiteMining И не первое прохождение */}
                {canMineAdamantite && (
                    <div className="flex flex-col items-center">
                        <MineButton
                            oreType="adamantiteOre"
                            name="Адамантитовая руда"
                            imgSrc="/img/ores/adamantite_ore.png"
                            onClick={handlers.handleMineOre}
                            isLocked={false}
                            lockText=""
                        />
                        <p className="text-sm text-indigo-400 mt-2">В наличии: {formatNumber(gameState.adamantiteOre)}</p> {/* Изменен цвет текста */}
                    </div>
                )}
                {!canMineAdamantite && purchasedSkills?.adamantiteMining && isFirstPlaythrough && ( // ИЗМЕНЕНИЕ: Заблокированная кнопка, если навык есть, но первое прохождение
                     <Tooltip text="Доступно после первого Переселения.">
                        <div className="flex flex-col items-center opacity-50 cursor-not-allowed">
                            <MineButton
                                oreType="adamantiteOre"
                                name="Адамантитовая руда"
                                description=""
                                imgSrc="/img/ores/adamantite_ore.png"
                                onClick={() => {}}
                                isLocked={true}
                                lockText="Доступно после первого Переселения."
                            />
                            <p className="text-sm text-gray-400 mt-2">Навык изучен</p>
                        </div>
                    </Tooltip>
                )}
            </div>
            {!canMineCopper && !canMineMithril && !canMineAdamantite && (
                <p className="text-center text-gray-500 italic mt-8">Изучайте навыки в "Древе Навыков", чтобы открыть новые виды руды.</p>
            )}
        </div>
    );
};

export default MineView;
import React from 'react';

// Вспомогательный компонент для отображения одной характеристики
const StatRow = ({ label, value, unit = '' }) => (
    <div className="flex justify-between text-sm py-1 border-b border-gray-800">
        <span className="text-gray-400">{label}:</span>
        <span className="font-bold text-white">{value}{unit}</span>
    </div>
);

const StatsPanel = ({ gameState }) => {
    // Форматируем некоторые значения для лучшего отображения
    const critChancePercent = (gameState.critChance * 100).toFixed(1);
    const sparksModifierPercent = ((gameState.sparksModifier - 1) * 100).toFixed(0);
    const matterModifierPercent = ((gameState.matterModifier - 1) * 100).toFixed(0);
    const passiveIncomeModifierPercent = ((gameState.passiveIncomeModifier - 1) * 100).toFixed(0);
    const smeltingSpeedModifierPercent = ((gameState.smeltingSpeedModifier - 1) * 100).toFixed(0);

    return (
        <div className="bg-black/30 p-4 rounded-md mt-6 border border-gray-700">
            <h3 className="font-cinzel text-xl text-yellow-400 mb-3">Текущие Характеристики</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div>
                    <h4 className="font-bold text-orange-400 mt-2 mb-1">Производство</h4>
                    <StatRow label="Сила удара" value={gameState.progressPerClick} />
                    <StatRow label="Добыча руды за клик" value={gameState.orePerClick} />
                    <StatRow label="Шанс крит. удара" value={critChancePercent} unit="%" />
                    <StatRow label="Бонус крит. удара" value={gameState.critBonus.toFixed(1)} unit="x" />
                    <StatRow label="Скорость плавки" value={`+${smeltingSpeedModifierPercent}`} unit="%" />
                    <StatRow label="Снижение стоимости компонентов" value={gameState.componentCostReduction} unit=" ед." />
                </div>
                <div>
                    <h4 className="font-bold text-orange-400 mt-2 mb-1">Экономика</h4>
                    <StatRow label="Бонус к Искрам" value={`+${sparksModifierPercent}`} unit="%" />
                    <StatRow label="Бонус к Материи" value={`+${matterModifierPercent}`} unit="%" />
                    <StatRow label="Эффективность подмастерьев" value={`+${passiveIncomeModifierPercent}`} unit="%" />
                    <StatRow label="Лимит времени на заказах" value={`${(gameState.timeLimitModifier * 100).toFixed(0)}%`} />
                </div>
            </div>
        </div>
    );
};

export default StatsPanel;
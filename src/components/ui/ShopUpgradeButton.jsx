import React, { useState } from 'react'; // Импортируем useState
import { definitions } from '../../data/definitions';
import { formatCosts, formatNumber } from '../../utils/helpers';
import Tooltip from './Tooltip';

const ShopUpgradeButton = React.memo(({ upgradeId, gameState, onBuyUpgrade, upgradeType = 'upgrades' }) => {
    const upgradeDefs = upgradeType === 'upgrades' ? definitions.upgrades : definitions.shopUpgrades;
    const upgrade = upgradeDefs[upgradeId];
    if (!upgrade) return null;

    const [multiplier, setMultiplier] = useState(1); // Состояние для множителя

    const level = gameState.upgradeLevels[upgradeId] || 0;

    const isMultiLevel = 'isMultiLevel' in upgrade && upgrade.isMultiLevel;
    let isDisabled = false;
    let displayCosts = {};
    let buttonText = '';

    // Логика определения доступных множителей
    const availableMultipliers = [1, 2, 5, 10, 20, 50];
    let filteredMultipliers = availableMultipliers;

    if (isMultiLevel) {
        // Фильтруем множители, чтобы не предлагать больше, чем maxLevel
        filteredMultipliers = availableMultipliers.filter(mult => (level + mult) <= upgrade.maxLevel);
        if (filteredMultipliers.length === 0) filteredMultipliers = [1]; // Если все множители превышают maxLevel, оставляем x1
        if (!filteredMultipliers.includes(multiplier)) { // Сбрасываем множитель, если текущий стал недоступен
            setMultiplier(filteredMultipliers[0]);
        }

        if (level >= upgrade.maxLevel) {
            isDisabled = true;
            buttonText = `Макс. (${level})`;
        } else {
            // Расчет стоимости для текущего множителя
            const baseCosts = upgrade.baseCost;
            for (const resourceType in baseCosts) {
                displayCosts[resourceType] = Math.floor(baseCosts[resourceType] * Math.pow(upgrade.costIncrease, level));
            }
            // Умножаем на множитель
            for (const resourceType in displayCosts) {
                displayCosts[resourceType] *= multiplier;
            }
        }
    } else { // Одноразовое улучшение
        if (level > 0) { // Если уже куплено
            isDisabled = true;
            buttonText = "Куплено";
        } else {
            displayCosts = { ...upgrade.cost };
        }
        filteredMultipliers = [1]; // Для одноразовых только x1
        if (multiplier !== 1) setMultiplier(1); // Сбрасываем множитель, если он не x1
    }

    // Проверка доступности ресурсов
    if (!isDisabled) { // Только если улучшение еще не куплено/не на макс уровне
        for (const resourceType in displayCosts) {
            const costAmount = displayCosts[resourceType];
            const resourceStorage = resourceType.includes('Ingots') || resourceType.includes('Ore') || resourceType === 'sparks' || resourceType === 'matter' ? 'main' : 'specialItems';
            const currentAmount = resourceStorage === 'main' ? gameState[resourceType] : gameState.specialItems?.[resourceType] || 0;
            if (currentAmount < costAmount) {
                isDisabled = true;
                break;
            }
        }
    }

    // Дополнительная проверка на репутацию магазина для shopUpgrades
    if (upgradeType === 'shopUpgrades' && upgrade.requiredShopReputation) {
        if (gameState.shopReputation < upgrade.requiredShopReputation) {
            isDisabled = true;
            buttonText = `Репутация: ${upgrade.requiredShopReputation}`; // Переопределяем текст кнопки
        }
    }
    
    // Если кнопка не отключена из-за репутации или макс. уровня, формируем текст стоимости
    if (buttonText === '') {
        buttonText = `<div class="flex flex-col items-start w-full">${formatCosts(displayCosts, gameState)}</div>`;
    }

    // Функция для циклического переключения множителя
    const getNextMultiplier = (current, multipliersArray) => {
        const currentIndex = multipliersArray.indexOf(current);
        const nextIndex = (currentIndex + 1) % multipliersArray.length;
        return multipliersArray[nextIndex];
    };

    return (
        <button
            onClick={() => { if (!isDisabled) onBuyUpgrade(upgradeId, upgradeType, multiplier); }} // Передаем upgradeType и multiplier
            disabled={isDisabled}
            className="interactive-element bg-transparent border border-gray-700 p-4 rounded-lg text-left w-full hover:enabled:border-orange-500 hover:enabled:shadow-lg hover:enabled:shadow-orange-500/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between" // Добавлен flex justify-between
        >
            <div className="flex-grow"> {/* Обертка для названия и описания */}
                <h4 className="font-bold font-cinzel">{upgrade.name} {isMultiLevel && level > 0 && `(Ур. ${level})`}</h4>
                <p className="text-sm text-gray-400 my-1">{upgrade.description}</p>
                <span className={`font-bold text-sm text-gray-300`} dangerouslySetInnerHTML={{ __html: buttonText }}></span>
            </div>

            {isMultiLevel && (
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Предотвращаем срабатывание клика по всей карточке
                        setMultiplier(prev => getNextMultiplier(prev, filteredMultipliers));
                    }}
                    disabled={isDisabled || filteredMultipliers.length <= 1} // Отключаем кнопку множителя, если он только x1
                    className="interactive-element bg-gray-700 text-white text-xs px-2 py-1 rounded-md hover:bg-gray-600 flex-shrink-0" // flex-shrink-0 чтобы кнопка не сжималась
                    title="Кликните для смены множителя покупки"
                >
                    x{multiplier}
                </button>
            )}
        </button>
    );
});

export default ShopUpgradeButton;
// src/components/ui/ComponentItem.jsx
import React, { memo } from 'react'; // Импортируем memo из React
import { definitions } from '../../data/definitions'; // Импортируем definitions для доступа к игровым данным
import { formatNumber } from '../../utils/helpers'; // Импортируем formatNumber для форматирования чисел

// ComponentItem отображает информацию об отдельном компоненте предмета,
// над которым в данный момент работает игрок.
// Он мемоизирован с помощью React.memo для оптимизации производительности.
const ComponentItem = memo(({ component, orderState, gameState, onSelectComponent }) => { // ИЗМЕНЕНО: Добавлен onSelectComponent
    // Прогресс выполнения текущего компонента. Если его нет, то 0.
    const progress = orderState.componentProgress[component.id] || 0;
    // Флаг, указывающий, завершен ли компонент.
    const isComplete = progress >= component.progress;
    // Флаг, указывающий, является ли этот компонент активным (то есть, над ним сейчас работает игрок).
    const isActive = orderState.activeComponentId === component.id;

    // Проверяем, выполнены ли все зависимости для данного компонента.
    // Компонент может быть выбран только после завершения всех его требуемых компонентов.
    const dependenciesMet = !component.requires || component.requires.every(reqId => {
        const requiredComponentDef = definitions.items[orderState.itemKey].components.find(c => c.id === reqId);
        // Проверяем, что requiredComponentDef найден, прежде чем получить его progress
        return (orderState.componentProgress[reqId] || 0) >= (requiredComponentDef?.progress || 0);
    });

    // Определяет, можно ли сейчас выбрать этот компонент.
    // ИЗМЕНЕНО: Только если onSelectComponent передан (т.е. это проект игрока)
    const canSelect = onSelectComponent && !isComplete && dependenciesMet;


    // Классы CSS для стилизации компонента в зависимости от его состояния.
    let classes = "p-2 border-l-4 transition-colors duration-200 ";
    if(isComplete) { // Если компонент завершен, он зеленый.
        classes += "border-green-500 bg-green-500/10";
    } else if (isActive) { // Если активен, он оранжевый.
        classes += "border-orange-500 bg-orange-500/20";
    } else if (canSelect) { // Если доступен для выбора, но не активен.
        classes += "border-gray-500 hover:bg-gray-700/50 cursor-pointer";
    } else { // Если заблокирован (зависимости не выполнены или не хватает ресурсов).
         classes += "border-gray-800 filter grayscale opacity-60 cursor-not-allowed";
    }

    // Формируем строку стоимости компонента.
    // Учитывает `componentCostReduction` из gameState.
    const costString = component.cost ? Object.entries(component.cost).map(([key, value]) => {
        let resourceName = '...';
        // Определяем отображаемое имя ресурса.
        if (definitions.specialItems[key]) {
            resourceName = definitions.specialItems[key].name;
        } else {
            resourceName = key.replace('Ingots', ' слитков').replace('sparks', ' искр').replace('matter', ' материи');
        }
        // Вычисляем фактическую стоимость с учетом скидки.
        const actualCost = Math.max(1, value - (gameState.componentCostReduction || 0));
        return `${actualCost} ${resourceName}`;
    }).join(', ') : 'Бесплатно'; // Если стоимость не указана, компонент бесплатный.


    return (
        <div className={classes} onClick={() => canSelect && onSelectComponent(component.id)}>
            <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                    {/* Отображает иконку рабочей станции, необходимую для компонента. */}
                    <span className="material-icons-outlined text-base text-gray-500">{definitions.workstations[component.workstation].icon}</span>
                    {/* Название компонента. */}
                    <span className="font-bold">{component.name}</span>
                </div>
                {/* Отображает стоимость компонента. */}
                <span className="text-xs text-gray-400">{costString}</span>
            </div>
            {/* Прогресс-бар компонента. */}
            <div className="w-full bg-gray-900 rounded-full h-2 mt-1">
                <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${isComplete ? 100 : (progress / component.progress) * 100}%`, transition: 'width 0.2s linear' }}
                ></div>
            </div>
        </div>
    );
});

export default ComponentItem; // Экспортируем мемоизированный компонент по умолчанию.
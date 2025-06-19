// src/components/views/EternalSkillsView.jsx

import React, { useRef } from 'react';
import { definitions } from '../../data/definitions';
import { formatNumber } from '../../utils/helpers'; // Для отображения prestigePoints
import Tooltip from '../ui/Tooltip'; // Предполагаем, что Tooltip уже есть
import EternalSkillNode from '../ui/EternalSkillNode'; // Будет создан далее

const EternalSkillsView = ({ gameState, handlers }) => {
    const scrollContainerRef = useRef(null);

    const BranchHeader = ({ title }) => (
        <h3 className="font-cinzel text-lg accent-glow-color text-shadow-glow my-4 w-full text-center border-b border-t border-purple-800/50 py-2 sticky top-0 bg-gray-800/80 backdrop-blur-sm z-20">
            {title}
        </h3>
    );
    const Connector = () => <div className="h-8 w-px bg-gray-600 my-2"></div>;

    // Структура дерева вечных навыков
    const eternalSkillTreeStructure = [
        {
            branch: "Торговая Империя",
            rows: [
                { id: "eternalRow1", skills: ["eternal_merchant_insight"] },
                { id: "eternalRow2", skills: ["eternal_logistics"] },
                { id: "eternalRow3", skills: ["eternal_market_dominance"] },
                { id: "eternalRow4", skills: ["eternal_caravans"] },
            ]
        },
        {
            branch: "Технологическое Превосходство",
            rows: [
                { id: "eternalRow5", skills: ["eternal_precision_crafting"] },
                { id: "eternalRow6", skills: ["eternal_material_efficiency"] },
                { id: "eternalRow7", skills: ["eternal_crit_mastery"] },
                { id: "eternalRow8", skills: ["eternal_perfect_graving"] },
            ]
        },
        {
            branch: "Геополитика и Влияние",
            rows: [
                { id: "eternalRow9", skills: ["eternal_diplomacy"] },
                { id: "eternalRow10", skills: ["eternal_regional_unlock"] },
                { id: "eternalRow11", skills: ["eternal_quest_master"] },
            ]
        }
    ];

    // Функция для рендеринга ряда навыков, включая соединители
    const renderSkillRow = (row, previousRow = null) => {
        return (
            <div key={row.id} className="skills-row flex justify-center gap-12 flex-wrap">
                {row.skills.map((skillId, index) => {
                    // Логика разблокировки EternalSkillNode будет реализована внутри EternalSkillNode.jsx
                    return (
                        <EternalSkillNode
                            key={skillId}
                            skillId={skillId}
                            gameState={gameState}
                            onBuyEternalSkill={handlers.handleBuyEternalSkill}
                        />
                    );
                })}
            </div>
        );
    };


    let previousRow = null; // Для отслеживания предыдущего ряда

    return (
        <div ref={scrollContainerRef} className="skills-tree-container relative h-full w-full overflow-y-auto p-4">
            <h2 className="font-cinzel text-2xl accent-glow-color text-shadow-glow flex items-center gap-2 border-b border-gray-700 pb-4 mb-6">
                <span className="material-icons-outlined">psychology</span> Вечное Древо Навыков
            </h2>
            <p className="text-gray-400 mb-4">
                Это древо представляет собой утерянные знания, которые можно восстановить за Осколки Памяти.
                Эти улучшения сохраняются между Переселениями, делая каждое новое начинание сильнее.
            </p>
            <div className="flex items-center justify-center mb-6 p-3 bg-purple-900/20 border border-purple-700 rounded-lg">
                <span className="material-icons-outlined text-purple-400 mr-2">token</span>
                <p className="text-lg text-white">Осколки Памяти: <span className="font-bold">{formatNumber(gameState.prestigePoints, true)}</span></p>
            </div>

            <div className="skills-content flex flex-col items-center">
                {eternalSkillTreeStructure.map(branchGroup => (
                    <React.Fragment key={branchGroup.branch}>
                        <BranchHeader title={branchGroup.branch} />
                        {branchGroup.rows.map((row, rowIndex) => {
                            const renderedRow = renderSkillRow(row, previousRow); // previousRow здесь пока не используется для логики, а только для рендера соединителей
                            previousRow = row; // Обновляем previousRow для следующей итерации
                            return (
                                <React.Fragment key={row.id}>
                                    {renderedRow}
                                    {rowIndex < branchGroup.rows.length - 1 && <Connector />} {/* Разделитель между рядами в одной ветке */}
                                </React.Fragment>
                            );
                        })}
                        {/* Разделитель между ветками, если это не последняя ветка */}
                        {branchGroup.branch !== eternalSkillTreeStructure[eternalSkillTreeStructure.length - 1].branch && <Connector />}
                    </React.Fragment>
                ))}
                <div className="h-20 w-full"></div> {/* Отступ снизу для прокрутки */}
            </div>
        </div>
    );
};

export default EternalSkillsView;
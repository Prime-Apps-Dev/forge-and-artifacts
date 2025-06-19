import React, { useRef } from 'react';
import { definitions } from '../../data/definitions';
import SkillNode from '../ui/SkillNode';

const SkillsView = ({ gameState, handlers }) => {
    const scrollContainerRef = useRef(null);
    const AgeHeader = ({ title }) => (
        <h3 className="font-cinzel text-lg accent-glow-color text-shadow-glow my-4 w-full text-center border-b border-t border-orange-800/50 py-2 sticky top-0 bg-gray-800/80 backdrop-blur-sm z-20">
            {title}
        </h3>
    );
    const Connector = () => <div className="h-8 w-px bg-gray-600 my-2"></div>;

    // ИЗМЕНЕНИЕ: Определение структуры дерева навыков с рядами для новой логики разблокировки
    const skillTreeStructure = [
        {
            age: "Железный Век",
            rows: [
                { id: "row1", skills: ["basicForging"] },
                { id: "row2", skills: ["sturdyPickaxe", "apprenticeship", "efficientBellows"] },
                { id: "row3", skills: ["fastHands", "betterTools", "advancedClients"] },
                { id: "row4", skills: ["blueprint_basicArmor", "enduranceTraining"] },
                { id: "row5", skills: ["divisionOfLabor"] },
                { id: "row6", skills: ["hammerStrength", "preciseTools", "perfectGrinding"] },
                { id: "row7", skills: ["sharpeningStone", "advancedForging"] },
                { id: "row8", skills: ["geologicalSurvey"] },
            ]
        },
        {
            age: "Медный Век",
            rows: [
                { id: "row9", skills: ["findCopper"] },
                { id: "row10", skills: ["copperProspecting", "crucibleRefinement", "jewelryCrafting"] },
                { id: "row11", skills: ["apprenticeTraining", "qualityControl"] },
                { id: "row12", skills: ["advancedSmelting", "tradeRoutes"] },
                { id: "row13", skills: ["guildContracts", "masterworkHammers"] },
            ]
        },
        {
            age: "Бронзовый Век",
            rows: [
                { id: "row14", skills: ["artOfAlloys"] },
                { id: "row15", skills: ["riskAssessment", "steadyHand", "masterReforging"] }, // steadyHand является MultiLevel, riskAssessment и masterReforging
                { id: "row16", skills: ["blueprint_eliteArmor", "blueprint_fineWeapons", "reinforcedStructure", "ancientKnowledge"] }, // Добавил reinforcedStructure и ancientKnowledge
                { id: "row17", skills: ["expeditionPlanning", "gildingTechniques"] },
                { id: "row18", skills: ["legendaryClients", "optimizedSmelting", "efficientCrafting"] },
                { id: "row19", skills: ["matterAlchemy", "tradeNegotiation", "artisanMentor"] },
                { id: "row20", skills: ["timeMastery", "blueprint_masterwork", "truePotential"] },
            ]
        },
        {
            age: "Мифриловая Эпоха",
            rows: [
                { id: "row21", skills: ["mithrilProspecting"] },
                { id: "row22", skills: ["blueprint_mithrilCrafting"] },
            ]
        },
        {
            age: "Эпоха Легенд",
            rows: [
                { id: "row23", skills: ["adamantiteMining"] },
                { id: "row24", skills: ["blueprint_adamantiteForging"] },
                { id: "row25", skills: ["arcaneMetallurgy"] },
                { id: "row26", skills: ["blueprint_arcaniteMastery"] },
            ]
        }
    ];

    // Функция для определения, разблокирован ли навык по правилам рядов
    const isSkillUnlockedByRowLogic = (currentSkillId, previousRowSkillsIds, purchasedSkills) => {
        const currentSkillIndex = skillTreeStructure.flatMap(age => age.rows.flatMap(row => row.skills)).indexOf(currentSkillId);
        if (currentSkillIndex === -1) return false; // Навык не найден в структуре

        const currentSkillRow = skillTreeStructure.flatMap(age => age.rows).find(row => row.skills.includes(currentSkillId));
        if (!currentSkillRow) return false;

        const previousRow = skillTreeStructure.flatMap(age => age.rows).find(row => row.skills.includes(previousRowSkillsIds[0])) || null; // Предполагаем, что previousRowSkillsIds - это навыки из предыдущего ряда
        if (!previousRow) { // Если нет предыдущего ряда (например, basicForging)
            return true;
        }

        const parentRowCount = previousRow.skills.length;
        const childRowCount = currentSkillRow.skills.length;
        const currentSkillInRowIndex = currentSkillRow.skills.indexOf(currentSkillId);


        if (parentRowCount === childRowCount) {
            // Случай 1: 1 к 1
            const correspondingParentSkillId = previousRow.skills[currentSkillInRowIndex];
            return purchasedSkills[correspondingParentSkillId];
        } else if (parentRowCount > childRowCount) {
            if (childRowCount === 1) {
                // Случай 3 к 1: Требуются все родительские
                return previousRow.skills.every(parentId => purchasedSkills[parentId]);
            } else if (parentRowCount === 3 && childRowCount === 2) {
                // Случай 3 к 2: Навык 1 (следующего) = Навык 1 + Навык 2 (текущего)
                // Навык 2 (следующего) = Навык 2 + Навык 3 (текущего)
                if (currentSkillInRowIndex === 0) { // Это первый навык в дочернем ряду
                    return purchasedSkills[previousRow.skills[0]] && purchasedSkills[previousRow.skills[1]];
                } else if (currentSkillInRowIndex === 1) { // Это второй навык в дочернем ряду
                    return purchasedSkills[previousRow.skills[1]] && purchasedSkills[previousRow.skills[2]];
                }
            }
        }
        // Если никакое условие не сработало или случай не описан, возвращаем false
        return false;
    };


    // Функция для рендеринга ряда навыков
    const renderSkillRow = (row, previousRow = null) => {
        return (
            <div key={row.id} className="skills-row flex justify-center gap-12 flex-wrap">
                {row.skills.map((skillId, index) => {
                    let requirementsMetForNode = true;
                    // Если есть предыдущий ряд, применяем сложную логику
                    if (previousRow) {
                        requirementsMetForNode = false; // По умолчанию, пока не разблокирован
                        const parentRowCount = previousRow.skills.length;
                        const childRowCount = row.skills.length;

                        if (parentRowCount === childRowCount) {
                            const correspondingParentSkillId = previousRow.skills[index];
                            requirementsMetForNode = gameState.purchasedSkills[correspondingParentSkillId];
                        } else if (parentRowCount > childRowCount) {
                            if (childRowCount === 1) { // Случай N к 1
                                requirementsMetForNode = previousRow.skills.every(parentId => gameState.purchasedSkills[parentId]);
                            } else if (parentRowCount === 3 && childRowCount === 2) { // Случай 3 к 2
                                if (index === 0) { // Первый навык в дочернем ряду
                                    requirementsMetForNode = gameState.purchasedSkills[previousRow.skills[0]] && gameState.purchasedSkills[previousRow.skills[1]];
                                } else if (index === 1) { // Второй навык в дочернем ряду
                                    requirementsMetForNode = gameState.purchasedSkills[previousRow.skills[1]] && gameState.purchasedSkills[previousRow.skills[2]];
                                }
                            }
                        }
                    }
                    // Если навык помечен firstPlaythroughLocked и это первое прохождение,
                    // и он является требованием для текущего навыка, мы должны игнорировать это требование
                    // Это будет обрабатываться внутри SkillNode.jsx как ранее.
                    
                    // Передаем информацию о разблокировке в SkillNode
                    return (
                        <SkillNode
                            key={skillId}
                            skillId={skillId}
                            gameState={gameState}
                            onBuySkill={handlers.handleBuySkill}
                            // Эти пропсы не нужны для новой логики разблокировки, т.к. она будет в SkillNode
                            // isUnlockedByParentLogic={requirementsMetForNode}
                        />
                    );
                })}
            </div>
        );
    };

    let previousRow = null; // Для отслеживания предыдущего ряда для логики разблокировки

    return (
        <div ref={scrollContainerRef} className="skills-tree-container relative h-full w-full overflow-y-auto p-4">
            <h2 className="font-cinzel text-2xl accent-glow-color text-shadow-glow flex items-center gap-2 border-b border-gray-700 pb-4 mb-6">
                <span className="material-icons-outlined">schema</span> Древо Навыков
            </h2>
            <p className="text-gray-400 mb-6">Используйте Материю, чтобы открывать постоянные улучшения и возвращать в мир утерянные знания.
            {gameState.matterCostReduction > 0 && <span className="text-green-400"> (Стоимость навыков снижена на {(gameState.matterCostReduction * 100).toFixed(0)}%)</span>}
            </p>

            <div className="skills-content flex flex-col items-center">
                {skillTreeStructure.map(ageGroup => (
                    <React.Fragment key={ageGroup.age}>
                        <AgeHeader title={ageGroup.age} />
                        {ageGroup.rows.map((row, rowIndex) => {
                            const renderedRow = renderSkillRow(row, previousRow);
                            previousRow = row; // Обновляем previousRow для следующей итерации
                            return (
                                <React.Fragment key={row.id}>
                                    {renderedRow}
                                    {rowIndex < ageGroup.rows.length - 1 && <Connector />} {/* Разделитель между рядами в одной эпохе */}
                                </React.Fragment>
                            );
                        })}
                        {/* Разделитель между эпохами, если это не последняя эпоха */}
                        {ageGroup.age !== skillTreeStructure[skillTreeStructure.length - 1].age && <Connector />}
                    </React.Fragment>
                ))}
                <div className="h-20 w-full"></div>
            </div>
        </div>
    );
};

export default SkillsView;
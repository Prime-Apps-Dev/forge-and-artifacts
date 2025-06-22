// src/components/views/SkillsView.jsx
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

    // ИЗМЕНЕНИЕ: Обновленная структура дерева навыков с новыми навыками
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
                { id: "row8", skills: ["geologicalSurvey", "sturdyVice"] }, // Добавлен sturdyVice
            ]
        },
        {
            age: "Медный Век",
            rows: [
                { id: "row9", skills: ["findCopper"] },
                { id: "row10", skills: ["copperProspecting", "crucibleRefinement", "jewelryCrafting", "chainWeaving"] }, // Добавлен chainWeaving
                { id: "row11", skills: ["apprenticeTraining", "qualityControl"] },
                { id: "row12", skills: ["advancedSmelting", "tradeRoutes"] },
                { id: "row13", skills: ["guildContracts", "masterworkHammers"] },
            ]
        },
        {
            age: "Бронзовый Век",
            rows: [
                { id: "row14", skills: ["artOfAlloys"] },
                { id: "row15", skills: ["riskAssessment", "steadyHand", "masterReforging"] },
                { id: "row16", skills: ["blueprint_eliteArmor", "blueprint_fineWeapons", "reinforcedStructure", "ancientKnowledge"] },
                { id: "row17", skills: ["expeditionPlanning", "gildingTechniques", "weaponryPreparation", "repairWorkshop"] }, // Добавлены weaponryPreparation, repairWorkshop
                { id: "row18", skills: ["legendaryClients", "optimizedSmelting", "efficientCrafting"] },
                { id: "row19", skills: ["matterAlchemy", "tradeNegotiation", "artisanMentor", "jewelersKit", "universalPincers"] }, // Добавлены jewelersKit, universalPincers
                { id: "row20", skills: ["timeMastery", "blueprint_masterwork", "truePotential", "crossbowMastery", "armorPlating", "precisionChronometry"] }, // Добавлены crossbowMastery, armorPlating, precisionChronometry
            ]
        },
        {
            age: "Мифриловая Эпоха",
            rows: [
                { id: "row21", skills: ["mithrilProspecting"] },
                { id: "row22", skills: ["blueprint_mithrilCrafting", "archersMastery"] }, // Добавлен archersMastery
                // НОВЫЕ РЯДЫ ДЛЯ МИФРИЛОВОЙ ЭПОХИ
                { id: "row23_mithril", skills: ["mithrilStrength"] },
                { id: "row24_mithril", skills: ["mithrilDefense"] },
                { id: "row25_mithril", skills: ["mithrilSpeed"] },
                { id: "row26_mithril", skills: ["mithrilFortune"] },
                { id: "row27_mithril", skills: ["mithrilMagic"] },
                { id: "row28_mithril", skills: ["mithrilRegeneration"] },
                { id: "row29_mithril", skills: ["mithrilCritStrike"] },
                { id: "row30_mithril", skills: ["mithrilEvasion"] },
                { id: "row31_mithril", skills: ["mithrilArmor"] },
                { id: "row32_mithril", skills: ["mithrilAttack"] },
            ]
        },
        {
            age: "Эпоха Легенд",
            rows: [
                { id: "row33", skills: ["adamantiteMining"] },
                { id: "row34", skills: ["blueprint_adamantiteForging", "adamantiteArmorCrafting"] }, // Добавлен adamantiteArmorCrafting
                { id: "row35", skills: ["arcaneMetallurgy"] },
                { id: "row36", skills: ["blueprint_arcaniteMastery", "arcaniteJewelry"] }, // Добавлен arcaniteJewelry
                // НОВЫЕ РЯДЫ ДЛЯ ЭПОХИ ЛЕГЕНД
                { id: "row37_legend", skills: ["legendaryStrength"] },
                { id: "row38_legend", skills: ["legendaryDefense"] },
                { id: "row39_legend", skills: ["legendarySpeed"] },
                { id: "row40_legend", skills: ["legendaryFortune"] },
                { id: "row41_legend", skills: ["legendaryMagic"] },
                { id: "row42_legend", skills: ["legendaryRegeneration"] },
                { id: "row43_legend", skills: ["legendaryCritStrike"] },
                { id: "row44_legend", skills: ["legendaryEvasion"] },
                { id: "row45_legend", skills: ["legendaryArmor"] },
                { id: "row46_legend", skills: ["legendaryAttack"] },
            ]
        }
    ];

    // Функция для рендеринга ряда навыков
    const renderSkillRow = (row, previousRow = null) => {
        return (
            <div key={row.id} className="skills-row flex justify-center gap-12 flex-wrap">
                {row.skills.map((skillId, index) => {
                    return (
                        <SkillNode
                            key={skillId}
                            skillId={skillId}
                            gameState={gameState}
                            onBuySkill={handlers.handleBuySkill}
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
                            // Мы не обновляем previousRow здесь, так как логика зависимостей в SkillNode.jsx
                            // работает на основе skill.requires, а не позиции в этом массиве.
                            // Однако, для визуальных соединителей, можно было бы передавать previousRow.
                            // Пока оставляем как есть, так как SkillNode обрабатывает зависимости сам.
                            return (
                                <React.Fragment key={row.id}>
                                    {renderedRow}
                                    {rowIndex < ageGroup.rows.length - 1 && <Connector />}
                                </React.Fragment>
                            );
                        })}
                        {ageGroup.age !== skillTreeStructure[skillTreeStructure.length - 1].age && <Connector />}
                    </React.Fragment>
                ))}
                <div className="h-20 w-full"></div>
            </div>
        </div>
    );
};

export default SkillsView;
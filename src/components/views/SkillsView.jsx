// src/components/views/SkillsView.jsx
import React, { useRef, useState } from 'react';
import SkillNode from '../ui/cards/SkillNode';
import { useGame } from '../../context/useGame.js';
import SkillInfoModal from '../ui/modals/SkillInfoModal.jsx';

const SkillsView = () => {
    const { displayedGameState: gameState } = useGame();
    const [skillInModal, setSkillInModal] = useState(null);

    const ageRefs = {
        "Железный Век": useRef(null),
        "Медный Век": useRef(null),
        "Бронзовый Век": useRef(null),
        "Мифриловая Эпоха": useRef(null),
        "Эпоха Легенд": useRef(null),
    };

    const scrollToAge = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleOpenSkillModal = (skillId) => {
        setSkillInModal(skillId);
    };

    const handleCloseSkillModal = () => {
        setSkillInModal(null);
    };

    const AgeHeader = ({ title, ageRef }) => (
        <h3 ref={ageRef} className="font-cinzel text-lg accent-glow-color text-shadow-glow my-4 w-full text-center border-b border-t border-orange-800/50 py-2 sticky top-14 md:top-0 bg-gray-800/80 backdrop-blur-sm z-20">
            {title}
        </h3>
    );
    const Connector = () => <div className="h-8 w-px bg-gray-600 my-2"></div>;

    const skillTreeStructure = [
        {
            age: "Железный Век",
            rows: [
                { id: "row1", skills: ["basicForging"] },
                { id: "row2", skills: ["sturdyPickaxe", "apprenticeship", "efficientBellows"] },
                { id: "row3", skills: ["fastHands", "betterTools", "advancedClients"] },
                { id: "row4", skills: ["enduranceTraining"] },
                { id: "row5", skills: ["divisionOfLabor"] },
                { id: "row6", skills: ["hammerStrength", "preciseTools", "perfectGrinding"] },
                { id: "row7", skills: ["sharpeningStone", "advancedForging"] },
                { id: "row8", skills: ["geologicalSurvey", "sturdyVice"] },
            ]
        },
        {
            age: "Медный Век",
            rows: [
                { id: "row9", skills: ["findCopper"] },
                { id: "row10", skills: ["copperProspecting", "crucibleRefinement", "jewelryCrafting", "chainWeaving"] },
                { id: "row11", skills: ["apprenticeTraining", "qualityControl", "unlockTrader"] },
                { id: "row12", skills: ["advancedSmelting", "tradeRoutes"] },
                { id: "row12_auto", skills: ["smeltingAutomation"] },
                { id: "row13", skills: ["guildContracts", "masterworkHammers"] },
                { id: "row13_new_copper", skills: ["resourceExpert"] }
            ]
        },
        {
            age: "Бронзовый Век",
            rows: [
                { id: "row14", skills: ["artOfAlloys"] },
                { id: "row15", skills: ["riskAssessment", "steadyHand", "masterReforging"] },
                { id: "row16", skills: ["reinforcedStructure", "ancientKnowledge"] },
                { id: "row17", skills: ["expeditionPlanning", "gildingTechniques", "weaponryPreparation", "repairWorkshop", "durableGear", "unlockManager"] },
                { id: "row18", skills: ["legendaryClients", "optimizedSmelting", "efficientCrafting", "unlockEngineer"] },
                { id: "row19", skills: ["matterAlchemy", "tradeNegotiation", "artisanMentor", "jewelersKit", "universalPincers"] },
                { id: "row19_new", skills: ["specializedToolmaking"] },
                { id: "row20", skills: ["timeMastery", "blueprint_masterwork", "truePotential", "crossbowMastery", "armorPlating", "precisionChronometry", "guildContractsII"] },
            ]
        },
        {
            age: "Мифриловая Эпоха",
            rows: [
                { id: "row21", skills: ["mithrilProspecting"] },
                { id: "row22", skills: ["archersMastery", "unlockAssistant"] },
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
                { id: "row32_new_mithril", skills: ["ancientRuins"] }
            ]
        },
        {
            age: "Эпоха Легенд",
            rows: [
                { id: "row33", skills: ["adamantiteMining"] },
                { id: "row34", skills: ["adamantiteArmorCrafting"] },
                { id: "row35", skills: ["arcaneMetallurgy"] },
                { id: "row36", skills: ["arcaniteJewelry"] },
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
                { id: "row46_new_legend", skills: ["secretOperations"] }
            ]
        }
    ];

    const AnchorNav = () => (
        <div className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-sm p-2 rounded-b-lg border-b border-gray-700 mb-4">
            <div className="flex justify-center items-center flex-wrap gap-2">
                {skillTreeStructure.map(({ age }) => (
                    <button 
                        key={age}
                        onClick={() => scrollToAge(ageRefs[age])}
                        className="interactive-element text-xs font-bold text-gray-300 bg-gray-700/50 hover:bg-gray-600/50 px-3 py-1 rounded-full"
                    >
                        {age}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderSkillRow = (row) => (
        <div key={row.id} className="skills-row flex justify-center gap-4 md:gap-12 flex-wrap">
            {row.skills.map((skillId) => <SkillNode key={skillId} skillId={skillId} onOpenModal={handleOpenSkillModal} />)}
        </div>
    );

    return (
        <div className="skills-tree-container relative h-full w-full overflow-y-auto p-4">
            {skillInModal && <SkillInfoModal isOpen={!!skillInModal} onClose={handleCloseSkillModal} skillId={skillInModal} />}
            <h2 className="font-cinzel text-2xl accent-glow-color text-shadow-glow flex items-center gap-2 border-b border-gray-700 pb-4 mb-6">
                <span className="material-icons-outlined">schema</span> Древо Навыков
            </h2>
            <p className="text-gray-400 mb-6">Используйте Материю, чтобы открывать постоянные улучшения и возвращать в мир утерянные знания.
            {gameState.matterCostReduction > 0 && <span className="text-green-400"> (Стоимость навыков снижена на {(gameState.matterCostReduction * 100).toFixed(0)}%)</span>}
            </p>

            <AnchorNav />

            <div className="skills-content flex flex-col items-center">
                {skillTreeStructure.map((ageGroup, ageIndex) => (
                    <React.Fragment key={ageGroup.age}>
                        <AgeHeader title={ageGroup.age} ageRef={ageRefs[ageGroup.age]} />
                        {ageGroup.rows.map((row, rowIndex) => (
                            <React.Fragment key={row.id}>
                                {renderSkillRow(row)}
                                {rowIndex < ageGroup.rows.length - 1 && <Connector />}
                            </React.Fragment>
                        ))}
                        {ageIndex < skillTreeStructure.length - 1 && <Connector />}
                    </React.Fragment>
                ))}
                <div className="h-20 w-full"></div>
            </div>
        </div>
    );
};

export default SkillsView;
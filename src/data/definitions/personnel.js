// src/data/definitions/personnel.js

export const personnel = {
    mineApprentice: { name: "Подмастерье-рудокоп", description: "Автоматически добывает руду. (+0.5/сек за уровень)", isMultiLevel: true, maxLevel: 10, baseCost: { matter: 100, sparks: 500 }, costIncrease: 1.8, apply: (state) => { state.passiveGeneration.ironOre += 0.05; state.passiveGeneration.copperOre += 0.05; } }, // ИЗМЕНЕНО
    smelterApprentice: { name: "Подмастерье-плавильщик", description: "Автоматически плавит железные слитки. (+0.2/сек за уровень)", isMultiLevel: true, maxLevel: 10, baseCost: { matter: 150, ironIngots: 20 }, costIncrease: 1.9, apply: (state) => { state.passiveGeneration.ironIngots += 0.03; } }, // ИЗМЕНЕНО
    forgeApprentice: { name: "Подмастерье-кузнец", description: "Автоматически работает над активным компонентом. (+0.5 прогресса/сек за уровень)", isMultiLevel: true, maxLevel: 10, baseCost: { matter: 200, sparks: 1000 }, costIncrease: 2.0, apply: (state) => { state.passiveGeneration.forgeProgress += 0.5; } }, // ИЗМЕНЕНО
};
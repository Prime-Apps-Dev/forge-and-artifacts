// src/logic/gameLogic.js
import { definitions } from "../data/definitions";
import { audioController } from '../utils/audioController';
import { handleCompleteMission, handleOrderCompletion, handleSaleCompletion } from './gameCompletions';
import { formatNumber } from '../utils/formatters';
import { recalculateAllModifiers } from '../utils/gameStateUtils';
import { gameConfig as GAME_CONFIG } from '../constants/gameConfig.js';

let achievementCheckTimer = 0;

export function startGameLoop(updateState, handlers, showToast, showAchievementRewardModal) { // Удалена showShopReputationModal из параметров, так как она не используется здесь
    return setInterval(() => {
        updateState(state => {
            const deltaTime = 0.1;
            const modifier = state.passiveIncomeModifier;
            const currentRegion = definitions.regions[state.currentRegion];

            if (state.passiveGeneration.ironOre > 0) {
                const regionMod = currentRegion?.modifiers?.miningSpeed?.ironOre || 1.0;
                state.ironOre += state.passiveGeneration.ironOre * modifier * regionMod * deltaTime;
            }
            if (state.purchasedSkills.findCopper && state.passiveGeneration.copperOre > 0) {
                const regionMod = currentRegion?.modifiers?.miningSpeed?.copperOre || 1.0;
                state.copperOre += state.passiveGeneration.copperOre * modifier * regionMod * deltaTime;
            }
            if (state.passiveGeneration.mithrilOre > 0) {
                const regionMod = currentRegion?.modifiers?.miningSpeed?.mithrilOre || 1.0;
                state.mithrilOre += state.passiveGeneration.mithrilOre * modifier * regionMod * deltaTime;
            }
            if (state.passiveGeneration.adamantiteOre > 0) {
                const regionMod = currentRegion?.modifiers?.miningSpeed?.adamantiteOre || 1.0;
                state.adamantiteOre += state.passiveGeneration.adamantiteOre * modifier * regionMod * deltaTime;
            }
            if (state.passiveGeneration.sparks > 0) {
                state.sparks += state.passiveGeneration.sparks * modifier * deltaTime;
            }
            if (state.passiveGeneration.matter > 0) {
                state.matter += state.passiveGeneration.matter * modifier * deltaTime;
            }

            if (state.smeltingProcess) {
                const recipe = definitions.recipes[state.smeltingProcess.recipeId];
                state.smeltingProcess.progress += deltaTime * 10 * state.smeltingSpeedModifier;
                if (state.smeltingProcess.progress >= recipe.requiredProgress) {
                    const outputResource = Object.keys(recipe.output)[0];
                    const outputAmount = recipe.output[outputResource];
                    state[outputResource] += outputAmount;
                    state.smeltingProcess = null;
                    state.totalIngotsSmelted = (state.totalIngotsSmelted || 0) + outputAmount;
                    showToast(`Готово: +${outputAmount} ${recipe.name}`, 'success');
                }
            }

            const activeProjectPlayer = state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving;

            if (activeProjectPlayer?.minigameState?.active) {
                const component = definitions.items[activeProjectPlayer.itemKey]?.components?.find(c => c.id === activeProjectPlayer.activeComponentId);
                const speed = component?.minigame?.barSpeed || 1.0;
                let newPos = activeProjectPlayer.minigameState.position + (activeProjectPlayer.minigameState.direction * speed);
                if (newPos >= 100) { newPos = 100; activeProjectPlayer.minigameState.direction = -1; }
                else if (newPos <= 0) { newPos = 0; activeProjectPlayer.minigameState.direction = 1; }
                activeProjectPlayer.minigameState.position = newPos;
            }

            if (state.activeMissions && state.activeMissions.length > 0) {
                const now = Date.now();
                const completedMissionIds = [];
                state.activeMissions.forEach(mission => {
                    if (now >= mission.startTime + mission.duration * 1000) {
                        completedMissionIds.push(mission.id);
                    }
                });
                completedMissionIds.forEach(missionId => {
                    handleCompleteMission(state, missionId, showToast);
                });
            }
            if (state.investments.merchants) {
                state.specialItems.gem = (state.specialItems.gem || 0) + (GAME_CONFIG.PASSIVE_GEM_GENERATION_PER_MINUTE / 60) * deltaTime;
                if (Math.random() < (GAME_CONFIG.PASSIVE_ARTIFACT_COMPONENT_CHANCE_PER_MINUTE / 60) * deltaTime * 100) {
                    state.specialItems.material_adamantFrame = (state.specialItems.material_adamantFrame || 0) + 1;
                }
            }
            state.shopShelves.forEach((shelf, index) => {
                if (shelf.customer) {
                    shelf.saleTimer -= deltaTime;
                    if (shelf.saleTimer <= 0) {
                        shelf.customer = null;
                        shelf.saleProgress = 0;
                        showToast("Клиент ушел, не дождавшись обслуживания!", "error");
                    }
                } else if (shelf.itemId) {
                    const arrivalChancePerTick = 0.005 * state.playerShopSalesSpeedModifier;
                    if (Math.random() < arrivalChancePerTick) {
                        const client = definitions.clients[Math.floor(Math.random() * definitions.clients.length)];
                        shelf.customer = client;
                        shelf.saleTimer = 15 + Math.random() * 15;
                        showToast(`Новый клиент интересуется товаром на полке #${index + 1}!`, "info");
                    };
                }
            });
            const now = Date.now();
            const orderTTL = definitions.gameConfig.orderTTL;
            state.orderQueue = state.orderQueue.filter(order => {
                if (!order.spawnTime) {
                    order.spawnTime = now;
                    order.timeToLive = orderTTL;
                } else {
                    order.timeToLive = Math.max(0, orderTTL - Math.floor((now - order.spawnTime) / 1000));
                }
                if (order.timeToLive <= 0) {
                    showToast(`Заказ от "${order.client.name}" на "${definitions.items[order.itemKey].name}" истек и исчез из очереди.`, 'error');
                    return false;
                }
                return true;
            });

            achievementCheckTimer += deltaTime;
            if (achievementCheckTimer >= 1) {
                achievementCheckTimer = 0;
                Object.values(definitions.achievements).forEach(achievementDef => {
                    const achievementStatus = achievementDef.check(state, definitions);

                    if (!achievementDef.levels) {
                        // Логика для одноуровневых достижений
                        if (achievementStatus.isComplete && !state.completedAchievements.includes(achievementDef.id)) {
                            state.completedAchievements.push(achievementDef.id);
                            const rewardId = achievementDef.id;
                            if (!state.appliedAchievementRewards.includes(rewardId)) {
                                achievementDef.apply(state); // Применяем эффект (теперь apply функция сама определяет, куда сохранять эффект)
                                state.appliedAchievementRewards.push(rewardId); // Помечаем как примененное
                                // showToast(`Достижение выполнено: "${achievementDef.title}"!`, 'levelup'); // Удален тост
                                // audioController.play('levelup', 'G6', '2n'); // Удален звук
                                showAchievementRewardModal(achievementDef); // Показываем модалку
                                recalculateAllModifiers(state); // Пересчитываем модификаторы, так как могли измениться вечные бонусы
                            }
                        }
                    } else {
                        // Логика для многоуровневых достижений
                        let currentLevelAchieved = 0;
                        for (let i = 0; i < achievementDef.levels.length; i++) {
                            if (achievementStatus.current >= achievementDef.levels[i].target) {
                                currentLevelAchieved = i + 1;
                            } else {
                                break;
                            }
                        }

                        if (currentLevelAchieved > 0) {
                            for (let i = 0; i < currentLevelAchieved; i++) {
                                const levelId = `${achievementDef.id}_level_${i + 1}`;
                                const levelData = achievementDef.levels[i];

                                if (!state.appliedAchievementRewards.includes(levelId)) {
                                    achievementDef.apply(state, levelData.reward); // Применяем эффект уровня
                                    state.appliedAchievementRewards.push(levelId); // Помечаем как примененное
                                    // showToast(`Достижение выполнено: "${achievementDef.title}" (Ур. ${i + 1})!`, 'levelup'); // Удален тост
                                    // audioController.play('levelup', 'G6', '2n'); // Удален звук
                                    showAchievementRewardModal({ // Передаем объект для модалки
                                        id: achievementDef.id,
                                        title: `${achievementDef.title} (Ур. ${i + 1})`,
                                        description: achievementDef.description,
                                        effectName: levelData.effectName || achievementDef.effectName,
                                        icon: achievementDef.icon,
                                        isLevelAchievement: true,
                                        level: i + 1
                                    });
                                    recalculateAllModifiers(state); // Пересчитываем модификаторы
                                }
                            }
                        }
                    }
                });
            }

            return state;
        });
    }, 100);
}

export function startMarketLoop(updateState, showToast) {
    return setInterval(() => {
        updateState(state => {
            if (state.market.nextEventIn <= 0) {
                const eventIds = Object.keys(definitions.worldEvents);
                const randomEventId = eventIds[Math.floor(Math.random() * eventIds.length)];
                const newEvent = definitions.worldEvents[randomEventId];
                state.market.worldEvent = {
                    message: newEvent.message,
                    priceModifiers: newEvent.effects || {},
                    type: newEvent.type || 'market',
                    conflictingFactions: newEvent.conflictingFactions || []
                };
                state.market.nextEventIn = Math.floor(Math.random() * 240) + 60 / (state.marketTradeSpeedModifier || 1);
                showToast(`Новости Королевства: ${newEvent.message}`, 'info');
            } else {
                state.market.nextEventIn -= 1;
            }
            return state;
        });
    }, 1000);
}

export function startOrderGenerationLoop(generateOrderHandler) {
    return setInterval(() => {
        generateOrderHandler();
    }, 20000);
}
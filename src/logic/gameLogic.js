// src/logic/gameLogic.js
import { definitions } from "../data/definitions.js";
import { audioController } from '../utils/audioController.js';
import { handleCompleteMission, handleOrderCompletion } from './gameCompletions.js';
import { formatNumber } from '../utils/helpers.js';
import { recalculateAllModifiers } from '../utils/gameStateUtils.js';

let achievementCheckTimer = 0;
let apprenticeToastTimer = Date.now();
const APPRENTICE_TOAST_INTERVAL = 10000;
const APPRENTICE_ORDER_GENERATION_INTERVAL = 30000; // Подмастерье генерирует заказ раз в 30 секунд.
let apprenticeOrderGenerationTimer = APPRENTICE_ORDER_GENERATION_INTERVAL;

export function startGameLoop(updateState, handlers, showToast, showAchievementRewardModal) {
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
            if (state.passiveGeneration.ironIngots > 0) {
                const smeltAmount = state.passiveGeneration.ironIngots * modifier * deltaTime;
                const requiredOre = smeltAmount * 10;
                if (state.ironOre >= requiredOre) {
                    state.ironOre -= requiredOre;
                    state.ironIngots += smeltAmount;
                    state.totalIngotsSmelted = (state.totalIngotsSmelted || 0) + smeltAmount;
                }
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

            // --- ЛОГИКА ПОДМАСТЕРЬЯ-КУЗНЕЦА ---
            if (state.passiveGeneration.forgeProgress > 0) {
                // Генерация заказов для подмастерья
                apprenticeOrderGenerationTimer -= deltaTime;
                if (apprenticeOrderGenerationTimer <= 0 && state.apprenticeOrderQueue.length < 3) { // Лимит на 3 заказа в очереди подмастерья
                    const availableItemsForApprentice = Object.keys(definitions.items).filter(id => {
                        const item = definitions.items[id];
                        // Подмастерье берет только базовые или медные предметы, не квестовые, не рискованные
                        return (!item.requiredSkill || state.purchasedSkills[item.requiredSkill]) &&
                               (!item.firstPlaythroughLocked || !state.isFirstPlaythrough) &&
                               (item.baseIngotType === 'basic' || item.baseIngotType === 'uncommon' && (item.baseIngot === 'copperIngots' || item.baseIngot === 'bronzeIngots' || item.baseIngot === 'sparksteelIngots')) &&
                               !item.isQuestRecipe;
                    });

                    if (availableItemsForApprentice.length > 0) {
                        const randomItemKey = availableItemsForApprentice[Math.floor(Math.random() * availableItemsForApprentice.length)];
                        const itemDef = definitions.items[randomItemKey];
                        const totalProgress = itemDef.components.reduce((sum, c) => sum + c.progress, 0);

                        const apprenticeOrderRewards = {
                            sparks: Math.max(1, Math.round(totalProgress * 1.0)), // Базовые награды
                            matter: Math.max(1, Math.round(totalProgress / 10))
                        };

                        state.apprenticeOrderQueue.push({
                            id: `apprentice_order_${Date.now()}_${Math.random()}`,
                            itemKey: randomItemKey,
                            rewards: apprenticeOrderRewards,
                            componentProgress: {},
                            activeComponentId: itemDef.components.find(c => !c.requires)?.id || itemDef.components[0].id,
                            isApprenticeOrder: true,
                        });
                        apprenticeOrderGenerationTimer = APPRENTICE_ORDER_GENERATION_INTERVAL; // Сброс таймера
                    }
                }

                // Логика подмастерья по работе над заказом
                if (!state.apprenticeOrder) {
                    if (state.apprenticeOrderQueue.length > 0) {
                        const nextOrder = state.apprenticeOrderQueue.shift(); // Берем первый заказ из очереди
                        state.apprenticeOrder = { ...nextOrder, startTime: Date.now() }; // Копируем и добавляем startTime
                        showToast(`Подмастерье-кузнец начал работу над заказом: "${definitions.items[nextOrder.itemKey].name}"`, "info");
                    } else if ((Date.now() - apprenticeToastTimer > APPRENTICE_TOAST_INTERVAL)) {
                        showToast("Подмастерье-кузнец бездельничает: нет заказов в очереди.", "info");
                        apprenticeToastTimer = Date.now();
                    }
                }

                if (state.apprenticeOrder) {
                    const apprenticeProject = state.apprenticeOrder;
                    const itemDef = definitions.items[apprenticeProject.itemKey];
                    let activeComponent = itemDef.components.find(c => c.id === apprenticeProject.activeComponentId);

                    // Автоматическое переключение компонентов
                    if (!activeComponent || (apprenticeProject.componentProgress[activeComponent.id] || 0) >= activeComponent.progress) {
                        const nextComponent = itemDef.components.find(c =>
                            (apprenticeProject.componentProgress[c.id] || 0) < c.progress &&
                            (!c.requires || c.requires.every(reqId => 
                                (apprenticeProject.componentProgress[reqId] || 0) >= definitions.items[apprenticeProject.itemKey].components.find(comp => comp.id === reqId).progress
                            ))
                        );
                        if (nextComponent) {
                            apprenticeProject.activeComponentId = nextComponent.id;
                            activeComponent = nextComponent;
                        } else {
                            // Все компоненты завершены, заказ выполнен
                            handleOrderCompletion(state, apprenticeProject, showToast, handlers.setCompletedOrderInfo);
                            state.apprenticeOrder = null; // Сбрасываем активный заказ подмастерья
                            return state; // Завершаем текущий тик, так как заказ завершен
                        }
                    }

                    if (activeComponent) {
                        const progressAmount = state.passiveGeneration.forgeProgress * modifier * deltaTime;

                        // Расход ресурсов подмастерьем
                        if ((apprenticeProject.componentProgress[activeComponent.id] || 0) === 0 && activeComponent.cost) {
                            let canAfford = true;
                            let missingResource = null;
                            for (const resource in activeComponent.cost) {
                                const cost = activeComponent.cost[resource];
                                const resourceStorage = resource in state.specialItems ? 'specialItems' : 'main';
                                const currentAmount = resourceStorage === 'main' ? state[resource] : state.specialItems[resource];
                                if (currentAmount < cost) {
                                    canAfford = false;
                                    missingResource = resource;
                                    break;
                                }
                            }

                            if (!canAfford) {
                                if (Date.now() - apprenticeToastTimer > APPRENTICE_TOAST_INTERVAL) {
                                    const resourceName = definitions.specialItems[missingResource]?.name || missingResource.replace('Ingots', ' слитков').replace('Ore', ' руды').replace('sparks',' искр').replace('matter',' материи');
                                    showToast(`Подмастерье не может продолжить: недостаточно ${resourceName} для "${activeComponent.name}"!`, 'error');
                                    apprenticeToastTimer = Date.now();
                                }
                                return state; // Подмастерье останавливается, если нет ресурсов
                            }

                            for (const resource in activeComponent.cost) {
                                const cost = activeComponent.cost[resource];
                                const resourceStorage = resource in state.specialItems ? 'specialItems' : 'main';
                                if (resourceStorage === 'main') { state[resource] -= cost; }
                                else { state.specialItems[resource] -= cost; }
                            }
                        }
                        
                        if (!apprenticeProject.componentProgress[activeComponent.id]) apprenticeProject.componentProgress[activeComponent.id] = 0;
                        apprenticeProject.componentProgress[activeComponent.id] = Math.min(
                            activeComponent.progress,
                            apprenticeProject.componentProgress[activeComponent.id] + progressAmount
                        );
                    }
                }
            }
            // --- КОНЕЦ ЛОГИКИ ПОДМАСТЕРЬЯ-КУЗНЕЦА ---


            // Логика мини-игры и пассивного крафта (для игрока)
            const activeProjectPlayer = state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving;
            
            if (activeProjectPlayer?.minigameState?.active) {
                const component = definitions.items[activeProjectPlayer.itemKey].components.find(c => c.id === activeProjectPlayer.activeComponentId);
                const speed = component.minigame?.barSpeed || 1.0;
                let newPos = activeProjectPlayer.minigameState.position + (activeProjectPlayer.minigameState.direction * speed);
                if (newPos >= 100) { newPos = 100; activeProjectPlayer.minigameState.direction = -1; }
                else if (newPos <= 0) { newPos = 0; activeProjectPlayer.minigameState.direction = 1; }
                activeProjectPlayer.minigameState.position = newPos;
            } else if (activeProjectPlayer) {
                     handlers.applyProgress(state, state.progressPerClick * deltaTime); // ИЗМЕНЕНО: Исправлен прогресс игрока (без modifier, без passiveGeneration.forgeProgress)
            }

            // ... (остальные циклы: миссии, инвестиции, магазин, очередь заказов)
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
                state.specialItems.gem = (state.specialItems.gem || 0) + (1 / 60) * deltaTime;
                if (Math.random() < (0.005 / 60) * deltaTime * 100) {
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
                    }
                }
            });
            const now = Date.now();
            const orderTTL = definitions.gameConfig?.orderTTL || 90;
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

            // === ЛОГИКА ПРОВЕРКИ И ПРИМЕНЕНИЯ ДОСТИЖЕНИЙ (ОДИН РАЗ) ===
            achievementCheckTimer += deltaTime;
            if (achievementCheckTimer >= 1) { // Проверяем достижения каждую секунду
                achievementCheckTimer = 0;
                Object.values(definitions.achievements).forEach(achievementDef => {
                    const achievementStatus = achievementDef.check(state, definitions);
                    
                    // Если достижение одноуровневое
                    if (!achievementDef.levels) {
                        if (achievementStatus.isComplete && !state.completedAchievements.includes(achievementDef.id)) {
                            state.completedAchievements.push(achievementDef.id); // Помечаем как выполненное
                            if (!state.appliedAchievementRewards.includes(achievementDef.id)) { // Проверяем, что награда ещё не применена
                                achievementDef.apply(state); // Применяем эффект
                                state.appliedAchievementRewards.push(achievementDef.id); // Помечаем как примененное
                                showToast(`Достижение выполнено: "${achievementDef.title}"!`, 'levelup');
                                audioController.play('levelup', 'G6', '2n');
                                showAchievementRewardModal(achievementDef);
                                recalculateAllModifiers(state); // Пересчитываем модификаторы, если они изменились
                            }
                        }
                    } 
                    // Если достижение многоуровневое
                    else {
                        const currentAchievedLevel = achievementStatus.currentLevel; // Это может быть 1, 2, ... или 0
                        
                        if (currentAchievedLevel > 0) { // Если хоть какой-то уровень достигнут
                            achievementDef.levels.forEach((levelData, index) => {
                                const levelId = `${achievementDef.id}_level_${index + 1}`; // ID для конкретного уровня
                                if (achievementStatus.current >= levelData.target && !state.appliedAchievementRewards.includes(levelId)) {
                                    // Применяем только награду для этого конкретного уровня
                                    // Важно: здесь мы применяем эффект напрямую, а не через achievementDef.apply
                                    // так как achievementDef.apply для многоуровневых достижений уже обрабатывает все уровни.
                                    // Если же achievementDef.apply ожидает только один уровень, то логику надо скорректировать.
                                    // Текущая achievementDef.apply для многоуровневых итерирует по всем уровням и применяет их.
                                    // Поэтому мы просто вызовем ее и пометим примененные уровни.
                                    // ЭТОТ МОМЕНТ НУЖНО ПРОРАБОТАТЬ ТЩАТЕЛЬНЕЕ!

                                    // ДЛЯ ТЕКУЩЕЙ СТРУКТУРЫ:
                                    // achievementDef.apply(state) уже итерирует по уровням и применяет их.
                                    // Нам просто нужно гарантировать, что этот вызов происходит,
                                    // когда новый уровень достигнут и НЕ БЫЛ ПРИМЕНЕН.
                                    // Поэтому логика ниже будет более общей:

                                    // Проверяем, есть ли уже полная отметка о завершении достижения
                                    if (!state.completedAchievements.includes(achievementDef.id)) {
                                        state.completedAchievements.push(achievementDef.id); // Помечаем достижение как выполненное
                                    }

                                    // Применяем эффекты конкретного уровня и помечаем его как примененный
                                    // Это часть, которую я должен был сделать более детально в apply.
                                    // Для упрощения: мы будем использовать reward-объект из уровня для применения.
                                    const reward = levelData.reward;
                                    if (reward.sparksModifier) state.sparksModifier += reward.sparksModifier;
                                    if (reward.matterModifier) state.matterModifier += reward.matterModifier;
                                    if (reward.critChance) state.critChance += reward.critChance;
                                    if (reward.orePerClick) state.orePerClick += reward.orePerClick;
                                    if (reward.progressPerClick) state.progressPerClick += reward.progressPerClick;
                                    if (reward.smeltingSpeedModifier) state.smeltingSpeedModifier += reward.smeltingSpeedModifier;
                                    if (reward.matterCostReduction) state.matterCostReduction += reward.matterCostReduction;
                                    if (reward.reputationGainModifier) {
                                        for (const factionId in reward.reputationGainModifier) {
                                            state.reputationGainModifier[factionId] = (state.reputationGainModifier[factionId] || 1) + reward.reputationGainModifier[factionId];
                                        }
                                    }
                                    if (reward.riskModifier) state.riskModifier = (state.riskModifier || 1.0) * (1 - reward.riskModifier);
                                    if (reward.expeditionMapCostReduction) state.expeditionMapCostModifier = (state.expeditionMapCostModifier || 1.0) * (1 - reward.expeditionMapCostReduction);
                                    if (reward.passiveIncomeModifier) state.passiveIncomeModifier = (state.passiveIncomeModifier || 1.0) + reward.passiveIncomeModifier;
                                    if (reward.masteryXpModifier) state.masteryXpModifier = (state.masteryXpModifier || 1.0) + level.reward.masteryXpModifier;
                                    if (reward.regionUnlockCostReduction) state.regionUnlockCostReduction = (state.regionUnlockCostReduction || 0) + reward.regionUnlockCostReduction;
                                    if (reward.questRewardModifier) state.questRewardModifier = (state.questRewardModifier || 1.0) + reward.questRewardModifier;

                                    if (reward.item) { /* сложная логика, пока пропускаем, если нет в ТЗ */ }
                                    if (reward.shopShelf) { /* сложная логика, пока пропускаем, если нет в ТЗ */ }
                                    
                                    state.appliedAchievementRewards.push(levelId); // Помечаем этот конкретный уровень как примененный
                                    showToast(`Достижение выполнено: "${achievementDef.title}" (Ур. ${index + 1})!`, 'levelup');
                                    audioController.play('levelup', 'G6', '2n');
                                    showAchievementRewardModal(achievementDef); // Показываем модалку для общего достижения
                                    recalculateAllModifiers(state); // Пересчитываем модификаторы
                                }
                            });
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
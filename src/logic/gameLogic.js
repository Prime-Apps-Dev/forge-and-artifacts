// src/logic/gameLogic.js
import { definitions } from "../data/definitions";
import { audioController } from '../utils/audioController';
import { handleCompleteMission, handleOrderCompletion } from './gameCompletions'; // ИЗМЕНЕНО: Добавлен handleOrderCompletion
import { formatNumber } from '../utils/helpers';
import { recalculateAllModifiers } from '../utils/gameStateUtils';

let achievementCheckTimer = 0;
// НОВОЕ: Переменная для отслеживания времени последнего предупреждения подмастерья
let apprenticeToastTimer = Date.now();
const APPRENTICE_TOAST_INTERVAL = 10000; // 10 секунд

// НОВОЕ: Принимаем showAchievementRewardModal как аргумент
export function startGameLoop(updateState, handlers, showToast, showAchievementRewardModal) {
    return setInterval(() => {
        updateState(state => {
            const deltaTime = 0.1;
            const modifier = state.passiveIncomeModifier;
            const currentRegion = definitions.regions[state.currentRegion];

            // Пассивная генерация (руд и слитков)
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
                const requiredOre = smeltAmount * 10; // 10 руды на 1 слиток
                if (state.ironOre >= requiredOre) {
                    state.ironOre -= requiredOre;
                    state.ironIngots += smeltAmount;
                    state.totalIngotsSmelted = (state.totalIngotsSmelted || 0) + smeltAmount; // Отслеживание общего количества выплавленных слитков
                }
            }
            // ... (остальные пассивные генерации, если есть)

            // Процесс плавки (для игрока)
            if (state.smeltingProcess) {
                const recipe = definitions.recipes[state.smeltingProcess.recipeId];
                state.smeltingProcess.progress += deltaTime * 10 * state.smeltingSpeedModifier;
                if (state.smeltingProcess.progress >= recipe.requiredProgress) {
                    const outputResource = Object.keys(recipe.output)[0];
                    const outputAmount = recipe.output[outputResource];
                    state[outputResource] += outputAmount;
                    state.smeltingProcess = null;
                    state.totalIngotsSmelted = (state.totalIngotsSmelted || 0) + outputAmount; // Отслеживание общего количества выплавленных слитков
                    showToast(`Готово: +${outputAmount} ${recipe.name}`, 'success');
                }
            }

            // --- ВОССТАНОВЛЕНА И ИЗМЕНЕНА: ЛОГИКА ДЛЯ ПОДМАСТЕРЬЯ-КУЗНЕЦА ---
            if (state.passiveGeneration.forgeProgress > 0) {
                // Если у подмастерья нет активного заказа ИЛИ он уже выполнен
                if (!state.apprenticeOrder || (state.apprenticeOrder && state.apprenticeOrder.allComponentsComplete)) {
                    // Ищем доступный заказ в очереди, который не является рискованным и не квестовым
                    const availableOrderForApprentice = state.orderQueue.find(order =>
                        !order.isRisky && !definitions.items[order.itemKey]?.isQuestRecipe
                    );

                    if (availableOrderForApprentice) {
                        const orderIndex = state.orderQueue.findIndex(o => o.id === availableOrderForApprentice.id);
                        if (orderIndex !== -1) {
                            const [orderToAccept] = state.orderQueue.splice(orderIndex, 1);
                            orderToAccept.startTime = Date.now();
                            orderToAccept.timeLimits = { // Присваиваем лимиты времени
                                gold: (definitions.items[orderToAccept.itemKey].components.reduce((sum, c) => sum + c.progress, 0) / 2) * state.timeLimitModifier,
                                silver: definitions.items[orderToAccept.itemKey].components.reduce((sum, c) => sum + c.progress, 0) * state.timeLimitModifier
                            };
                            // Инициализация progress и activeComponentId для нового заказа подмастерья
                            orderToAccept.componentProgress = {};
                            orderToAccept.activeComponentId = definitions.items[orderToAccept.itemKey].components.find(c => !c.requires)?.id || definitions.items[orderToAccept.itemKey].components[0].id;

                            state.apprenticeOrder = { ...orderToAccept, isApprenticeOrder: true, allComponentsComplete: false }; // Добавляем флаг
                            showToast(`Подмастерье-кузнец начал работу над заказом: "${definitions.items[orderToAccept.itemKey].name}"`, "info");
                        }
                    } else if (state.orderQueue.length === 0 && (Date.now() - apprenticeToastTimer > APPRENTICE_TOAST_INTERVAL)) {
                        // Если нет заказов в очереди и прошло 10 секунд с последнего уведомления
                        showToast("Подмастерье-кузнец бездельничает: нет заказов в очереди.", "info");
                        apprenticeToastTimer = Date.now();
                    }
                }

                // Логика работы подмастерья над своим заказом
                if (state.apprenticeOrder && !state.apprenticeOrder.allComponentsComplete) {
                    const apprenticeProject = state.apprenticeOrder;
                    const itemDef = definitions.items[apprenticeProject.itemKey];
                    let activeComponent = itemDef.components.find(c => c.id === apprenticeProject.activeComponentId);

                    // Если активный компонент завершен или не существует, ищем следующий
                    if (!activeComponent || (apprenticeProject.componentProgress[activeComponent.id] || 0) >= activeComponent.progress) {
                        const nextComponent = itemDef.components.find(c =>
                            // Компонент еще не завершен И все его зависимости выполнены
                            (apprenticeProject.componentProgress[c.id] || 0) < c.progress &&
                            (!c.requires || c.requires.every(reqId => 
                                (apprenticeProject.componentProgress[reqId] || 0) >= definitions.items[apprenticeProject.itemKey].components.find(comp => comp.id === reqId).progress
                            ))
                        );
                        if (nextComponent) {
                            apprenticeProject.activeComponentId = nextComponent.id;
                            activeComponent = nextComponent; // Обновляем активный компонент
                        } else {
                            // Все компоненты выполнены, завершаем заказ подмастерья
                            apprenticeProject.allComponentsComplete = true; // Отмечаем, что заказ завершен
                            handleOrderCompletion(state, apprenticeProject, showToast, handlers.setCompletedOrderInfo); // Используем handlers.setCompletedOrderInfo
                            state.apprenticeOrder = null; // Очищаем заказ подмастерья
                            return state; // Выход из updateState после завершения заказа
                        }
                    }

                    // Если активный компонент найден (или был найден следующий)
                    if (activeComponent) {
                        const progressAmount = state.passiveGeneration.forgeProgress * modifier * deltaTime;

                        // Если компонент только начинается и требует ресурсов
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
                                return state; // Подмастерье ничего не делает, если не хватает ресурсов
                            }

                            // Снимаем ресурсы
                            for (const resource in activeComponent.cost) {
                                const cost = activeComponent.cost[resource];
                                const resourceStorage = resource in state.specialItems ? 'specialItems' : 'main';
                                if (resourceStorage === 'main') { state[resource] -= cost; }
                                else { state.specialItems[resource] -= cost; }
                            }
                        }
                        
                        // Применяем прогресс
                        if (!apprenticeProject.componentProgress[activeComponent.id]) apprenticeProject.componentProgress[activeComponent.id] = 0;
                        apprenticeProject.componentProgress[activeComponent.id] = Math.min(
                            activeComponent.progress,
                            apprenticeProject.componentProgress[activeComponent.id] + progressAmount
                        );
                    }
                }
            }

            // Логика мини-игры и пассивного крафта (для игрока) - Оставляем как есть
            const activeProjectPlayer = state.activeOrder || state.activeFreeCraft;
            if (activeProjectPlayer?.minigameState?.active) {
                const component = definitions.items[activeProjectPlayer.itemKey].components.find(c => c.id === activeProjectPlayer.activeComponentId);
                const speed = component.minigame?.barSpeed || 1.0;
                let newPos = activeProjectPlayer.minigameState.position + (activeProjectPlayer.minigameState.direction * speed);
                if (newPos >= 100) { newPos = 100; activeProjectPlayer.minigameState.direction = -1; }
                else if (newPos <= 0) { newPos = 0; activeProjectPlayer.minigameState.direction = 1; }
                activeProjectPlayer.minigameState.position = newPos;
            } else if (state.passiveGeneration.forgeProgress > 0 && (state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving)) {
                     // Здесь handlers.applyProgress - это applyProgress из gameCoreHandlers
                     handlers.applyProgress(state, state.passiveGeneration.forgeProgress * modifier * deltaTime);
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

            // === ЛОГИКА ПРОВЕРКИ ДОСТИЖЕНИЙ ===
            achievementCheckTimer += deltaTime;
            if (achievementCheckTimer >= 1) { // Проверяем достижения каждую секунду
                achievementCheckTimer = 0;
                Object.values(definitions.achievements).forEach(achievementDef => {
                    const achievementStatus = achievementDef.check(state, definitions);
                    if (achievementStatus.isComplete && !state.completedAchievements.includes(achievementDef.id)) {
                        state.completedAchievements.push(achievementDef.id);
                        showToast(`Достижение выполнено: "${achievementDef.title}"!`, 'levelup');
                        audioController.play('levelup', 'G6', '2n');
                        showAchievementRewardModal(achievementDef); // Вызываем модалку
                        recalculateAllModifiers(state); // Применяем эффекты
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
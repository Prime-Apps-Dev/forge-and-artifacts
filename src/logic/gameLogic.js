// src/logic/gameLogic.js
import { definitions } from "../data/definitions";
import { audioController } from '../utils/audioController';
import { handleCompleteMission } from './gameCompletions';
import { formatNumber } from '../utils/helpers';
import { recalculateAllModifiers } from '../utils/gameStateUtils';

let achievementCheckTimer = 0;

export function startGameLoop(updateState, handlers, showToast, setAchievementToDisplay, setIsAchievementRewardModalOpen) {
    return setInterval(() => {
        updateState(state => {
            const deltaTime = 0.1;
            const modifier = state.passiveIncomeModifier;
            const currentRegion = definitions.regions[state.currentRegion];

            // Пассивная генерация
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
                }
            }
            if (state.passiveGeneration.forgeProgress > 0) {
                if (!state.apprenticeOrder && state.orderQueue.length > 0) {
                    const availableOrderForApprentice = state.orderQueue.find(order =>
                        !order.isRisky && !definitions.items[order.itemKey]?.isQuestRecipe
                    );
                    if (availableOrderForApprentice) {
                        const orderIndex = state.orderQueue.findIndex(o => o.id === availableOrderForApprentice.id);
                        if (orderIndex !== -1) {
                            const [orderToAccept] = state.orderQueue.splice(orderIndex, 1);
                            orderToAccept.startTime = Date.now();
                            orderToAccept.timeLimits = {
                                gold: (definitions.items[orderToAccept.itemKey].components.reduce((sum, c) => sum + c.progress, 0) / 2) * state.timeLimitModifier,
                                silver: definitions.items[orderToAccept.itemKey].components.reduce((sum, c) => sum + c.progress, 0) * state.timeLimitModifier
                            };
                            state.apprenticeOrder = { ...orderToAccept, isApprenticeOrder: true };
                            showToast(`Подмастерье-кузнец начал работу над заказом: "${definitions.items[orderToAccept.itemKey].name}"`, "info");
                        }
                    }
                }
                if (state.apprenticeOrder) {
                    const apprenticeProject = state.apprenticeOrder;
                    const itemDef = definitions.items[apprenticeProject.itemKey];
                    let activeComponent = itemDef.components.find(c => c.id === apprenticeProject.activeComponentId);
                    if (!activeComponent || (apprenticeProject.componentProgress[activeComponent.id] || 0) >= activeComponent.progress) {
                        const nextComponent = itemDef.components.find(c =>
                            !c.requires || c.requires.every(reqId => (apprenticeProject.componentProgress[reqId] || 0) >= definitions.items[apprenticeProject.itemKey].components.find(comp => comp.id === reqId).progress) &&
                            (apprenticeProject.componentProgress[c.id] || 0) < c.progress
                        );
                        if (nextComponent) {
                            apprenticeProject.activeComponentId = nextComponent.id;
                            activeComponent = nextComponent;
                        } else {
                            handlers.handleOrderCompletion(state, apprenticeProject, showToast, () => {});
                            state.apprenticeOrder = null;
                            return state;
                        }
                    }
                    if (activeComponent) {
                        const progressAmount = state.passiveGeneration.forgeProgress * modifier * deltaTime;
                        if (!apprenticeProject.componentProgress[activeComponent.id]) apprenticeProject.componentProgress[activeComponent.id] = 0;
                        if (apprenticeProject.componentProgress[activeComponent.id] === 0 && activeComponent.cost) {
                            let canAfford = true;
                            for (const resource in activeComponent.cost) {
                                const cost = activeComponent.cost[resource];
                                const resourceStorage = resource in state.specialItems ? 'specialItems' : 'main';
                                const currentAmount = resourceStorage === 'main' ? state[resource] : state.specialItems[resource];
                                if (currentAmount < cost) {
                                    showToast(`Подмастерье не может продолжить: недостаточно ${resource} для компонента "${activeComponent.name}"!`, 'error');
                                    state.apprenticeOrder = null;
                                    return state;
                                }
                            }
                            for (const resource in activeComponent.cost) {
                                const cost = activeComponent.cost[resource];
                                const resourceStorage = resource in state.specialItems ? 'specialItems' : 'main';
                                if (resourceStorage === 'main') { state[resource] -= cost; }
                                else { state.specialItems[resource] -= cost; }
                            }
                        }
                        apprenticeProject.componentProgress[activeComponent.id] = Math.min(
                            activeComponent.progress,
                            apprenticeProject.componentProgress[activeComponent.id] + progressAmount
                        );
                    }
                }
            }
            const activeProject = state.activeOrder || state.activeFreeCraft;
            if (activeProject?.minigameState?.active) {
                const component = definitions.items[activeProject.itemKey].components.find(c => c.id === activeProject.activeComponentId);
                const speed = component.minigame?.barSpeed || 1.0;
                let newPos = activeProject.minigameState.position + (activeProject.minigameState.direction * speed);
                if (newPos >= 100) { newPos = 100; activeProject.minigameState.direction = -1; }
                else if (newPos <= 0) { newPos = 0; activeProject.minigameState.direction = 1; }
                activeProject.minigameState.position = newPos;
            } else if (state.passiveGeneration.forgeProgress > 0 && (state.activeOrder || state.activeFreeCraft || state.currentEpicOrder || state.activeReforge || state.activeInlay || state.activeGraving)) {
                     handlers.applyProgress(state, state.passiveGeneration.forgeProgress * modifier * deltaTime);
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

            // === КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: ЛОГИКА ПРОВЕРКИ ДОСТИЖЕНИЙ ===
            achievementCheckTimer += deltaTime;
            if (achievementCheckTimer >= 1) {
                achievementCheckTimer = 0;
                Object.values(definitions.achievements).forEach(achievementDef => {
                    const achievementStatus = achievementDef.check(state, definitions);
                    if (achievementStatus.isComplete && !state.completedAchievements.includes(achievementDef.id)) {
                        state.completedAchievements.push(achievementDef.id);
                        showToast(`Достижение выполнено: "${achievementDef.title}"!`, 'levelup');
                        audioController.play('levelup', 'G6', '2n');
                        setAchievementToDisplay(achievementDef);
                        setIsAchievementRewardModalOpen(true);
                        recalculateAllModifiers(state);
                    }
                });
            }

            // ИЗМЕНЕНО: Увеличение totalIngotsSmelted после плавки
            if (state.smeltingProcess && state.smeltingProcess.progress >= definitions.recipes[state.smeltingProcess.recipeId].requiredProgress) {
                state.totalIngotsSmelted = (state.totalIngotsSmelted || 0) + 1;
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
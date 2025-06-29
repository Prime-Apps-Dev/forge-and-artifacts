// src/logic/gameLogic.js
import { definitions } from "../data/definitions/index.js";
import { audioController } from '../utils/audioController';
import { handleCompleteMission, handleSaleCompletion } from './gameCompletions';
import { formatNumber } from '../utils/formatters.jsx';
import { recalculateAllModifiers } from '../utils/gameStateUtils';
import { gameConfig as GAME_CONFIG } from '../constants/gameConfig.js';
import { visualEffects } from "../utils/visualEffects";

let achievementCheckTimer = 0;
let orderGenerationTimeout = null;

export function generatePersonnelOffer(gameState) {
    const resourceUnlockSkills = {
        copperOre: 'findCopper', copperIngots: 'findCopper', bronzeIngots: 'artOfAlloys',
        sparksteelIngots: 'artOfAlloys', mithrilOre: 'mithrilProspecting', mithrilIngots: 'mithrilProspecting',
        adamantiteOre: 'adamantiteMining', adamantiteIngots: 'adamantiteMining', arcaniteIngots: 'arcaneMetallurgy',
    };

    const availablePersonnelTypes = Object.values(definitions.personnel).filter(pDef => {
        if (pDef.requiredSkill && !gameState.purchasedSkills[pDef.requiredSkill]) return false;
        if (pDef.maxQuantity && gameState.hiredPersonnel.filter(p => p.personnelId === pDef.id).length >= pDef.maxQuantity) return false;
        if (pDef.maxQuantity === 1 && gameState.hiredPersonnel.some(p => p.personnelId === pDef.id)) return false;
        const costs = Object.keys(pDef.baseHireCost);
        for (const resource of costs) {
            const requiredSkill = resourceUnlockSkills[resource];
            if (requiredSkill && !gameState.purchasedSkills[requiredSkill]) return false;
        }
        return true;
    });

    if (availablePersonnelTypes.length === 0) return null;

    const rand = Math.random() * 100;
    let rarity;
    if (rand < 1) rarity = 'legendary';
    else if (rand < 11) rarity = 'epic';
    else if (rand < 35) rarity = 'rare';
    else rarity = 'common';

    const traitCounts = {
        common: { positive: 1, negative: 2 },
        rare: { positive: 2, negative: 2 },
        epic: { positive: 2, negative: 1 },
        legendary: { positive: Math.random() < 0.5 ? 3 : 4, negative: 0 }
    };

    const randomPersonnelDef = availablePersonnelTypes[Math.floor(Math.random() * availablePersonnelTypes.length)];
    
    // --- ИСПРАВЛЕННАЯ ЛОГИКА ВЫБОРА ЧЕРТ ---
    const allTraits = Object.values(definitions.personnelTraits);
    const assignedTraits = new Set();
    const assignedTraitObjects = [];

    const pickTraits = (count, type) => {
        const potentialTraits = allTraits.filter(t => 
            t.type === type && 
            (!t.role || t.role === randomPersonnelDef.role) &&
            !assignedTraits.has(t.id)
        );
        
        // Перемешиваем массив для случайности
        potentialTraits.sort(() => 0.5 - Math.random());

        let pickedCount = 0;
        for (const trait of potentialTraits) {
            if (pickedCount >= count) break;

            // Проверяем на конфликты
            const hasConflict = trait.excludes?.some(excludedId => assignedTraits.has(excludedId));
            if (hasConflict) continue;
            
            // Проверяем обратный конфликт
            const isExcludedByAssigned = assignedTraitObjects.some(assignedTrait => assignedTrait.excludes?.includes(trait.id));
            if(isExcludedByAssigned) continue;


            assignedTraits.add(trait.id);
            assignedTraitObjects.push(trait);
            pickedCount++;
        }
    };

    pickTraits(traitCounts[rarity].positive, 'positive');
    pickTraits(traitCounts[rarity].negative, 'negative');
    // --- КОНЕЦ ИСПРАВЛЕННОЙ ЛОГИКИ ---

    const baseLevel = randomPersonnelDef.minLevel || 1;
    const maxLevelForOffer = Math.min(GAME_CONFIG.PERSONNEL_MAX_LEVEL, Math.floor(gameState.shopLevel / (GAME_CONFIG.PERSONNEL_LEVEL_OFFER_SHOP_LEVEL_DIVIDER || 5)) + baseLevel);
    
    const actualBaseLevel = Math.min(baseLevel, maxLevelForOffer);
    const level = Math.floor(Math.random() * (maxLevelForOffer - actualBaseLevel + 1)) + actualBaseLevel;

    let hireCost = { ...randomPersonnelDef.baseHireCost };
    let wage = { ...randomPersonnelDef.baseWage };

    for (let i = 1; i < level; i++) {
        for (const res in hireCost) hireCost[res] = Math.floor(hireCost[res] * (randomPersonnelDef.costIncrease || GAME_CONFIG.PERSONNEL_HIRE_COST_MULTIPLIER_PER_LEVEL));
        for (const res in wage) wage[res] = Math.floor(wage[res] * (randomPersonnelDef.wageIncrease || GAME_CONFIG.PERSONNEL_WAGE_MULTIPLIER_PER_LEVEL));
    }

    const shopLevelModifier = 1 - (gameState.shopLevel * GAME_CONFIG.PERSONNEL_OFFER_COST_REDUCTION_PER_SHOP_LEVEL);
    for (const res in hireCost) hireCost[res] = Math.max(1, Math.floor(hireCost[res] * shopLevelModifier));
    for (const res in wage) wage[res] = Math.max(1, Math.floor(wage[res] * shopLevelModifier));

    const randomFactor = 0.85 + Math.random() * 0.30;
    for (const res in hireCost) hireCost[res] = Math.max(1, Math.floor(hireCost[res] * randomFactor));
    for (const res in wage) wage[res] = Math.max(1, Math.floor(wage[res] * randomFactor));

    return {
        uniqueId: `personnel_offer_${Date.now()}_${Math.random()}`,
        personnelId: randomPersonnelDef.id,
        level: level,
        mood: Math.floor(Math.random() * (100 - 70 + 1)) + 70,
        hireCost: hireCost,
        wage: wage,
        xp: 0,
        xpToNextLevel: definitions.personnel[randomPersonnelDef.id].baseXPToNextLevel,
        rarity: rarity, 
        traits: Array.from(assignedTraits),
    };
}

export function populatePersonnelOffers(state) {
    state.personnelOffers = [];
    for (let i = 0; i < 3; i++) {
        const newOffer = generatePersonnelOffer(state);
        if (newOffer) {
            state.personnelOffers.push(newOffer);
        }
    }
    return state;
}


export function startGameLoop(updateState, handlers, showToast, showAchievementRewardModal) {
    let cantAffordToastCooldown = 0;

    return setInterval(() => {
        const now = Date.now();
        if (cantAffordToastCooldown > 0) {
            cantAffordToastCooldown -= 100;
        }

        updateState(state => {
            const deltaTime = 0.1;

            if (!state.smeltingProcess && state.smeltingQueue.length > 0) {
                const recipeId = state.smeltingQueue[0];
                const recipe = definitions.recipes[recipeId];
                
                if (recipe) {
                    let canAfford = true;
                    Object.entries(recipe.input).forEach(([resourceKey, baseCost]) => {
                        const currentAmount = state[resourceKey] || state.specialItems[resourceKey] || 0;
                        if (currentAmount < baseCost) canAfford = false;
                    });

                    if (canAfford) {
                        Object.entries(recipe.input).forEach(([resourceKey, cost]) => {
                             if(state.hasOwnProperty(resourceKey)) state[resourceKey] -= cost;
                             else if (state.specialItems.hasOwnProperty(resourceKey)) state.specialItems[resourceKey] -= cost;
                        });
                        
                        state.smeltingProcess = { recipeId, progress: 0 };
                        state.smeltingQueue.shift(); 
                        showToast(`Плавка из очереди: ${recipe.name} началась!`, 'info');
                    } else {
                        if (cantAffordToastCooldown <= 0) {
                            showToast(`Недостаточно ресурсов для '${recipe.name}' в очереди плавки!`, 'error');
                            cantAffordToastCooldown = 5000;
                        }
                    }
                } else {
                    state.smeltingQueue.shift();
                    console.error("Invalid recipeId in smelting queue:", recipeId);
                }
            }
            
            if (state.smeltingProcess) {
                const recipe = definitions.recipes[state.smeltingProcess.recipeId];
                if (!recipe || !recipe.requiredProgress) {
                    console.error("Smelting error: Invalid recipe", state.smeltingProcess.recipeId);
                    state.smeltingProcess = null;
                } else {
                    state.smeltingProcess.progress += 0.1 * 10 * (state.smeltingSpeedModifier || 1.0);

                    if (state.smeltingProcess.progress >= recipe.requiredProgress) {
                        const outputResource = Object.keys(recipe.output)[0];
                        const outputAmount = recipe.output[outputResource];
                        state[outputResource] = (state[outputResource] || 0) + outputAmount;
                        state.totalIngotsSmelted = (state.totalIngotsSmelted || 0) + outputAmount;
                        showToast(`Готово: +${outputAmount} ${recipe.name}`, 'success');
                        state.smeltingProcess = null;
                    }
                }
            }
            
            if (state.hiredPersonnel.length > 0) {
                state.hiredPersonnel = state.hiredPersonnel.filter(p => {
                    if (p.isResting) {
                        p.mood = Math.min(100, p.mood + GAME_CONFIG.PERSONNEL_MOOD_RECOVERY_RATE * deltaTime);
                        if (now > p.restEndTime) {
                            p.isResting = false; p.mood = 100;
                            showToast(`${p.name} отдохнул(а) и готов(а) к работе!`, 'info');
                            if (p.previousAssignment) {
                                state.personnelAssignment[p.uniqueId] = p.previousAssignment;
                                p.previousAssignment = null;
                            }
                        }
                        return true;
                    }
                    
                    p.timeWorked = (p.timeWorked || 0) + deltaTime;

                    p.mood = Math.max(0, p.mood - GAME_CONFIG.PERSONNEL_MOOD_DECAY_RATE * deltaTime);

                    if (p.mood < 10 && Math.random() < (GAME_CONFIG.PERSONNEL_RESIGN_CHANCE_LOW_MOOD * deltaTime)) {
                        const pDef = definitions.personnel[p.personnelId];
                        showToast(`${pDef.name} (${p.name}) уволился из-за ужасных условий труда!`, 'error');
                        delete state.personnelAssignment[p.uniqueId];
                        state.personnelSlots.used -= 1;
                        state.personnelRestCooldowns[p.uniqueId] = now + GAME_CONFIG.PERSONNEL_SLOT_COOLDOWN_SECONDS * 1000;
                        recalculateAllModifiers(state);
                        return false;
                    }
                    
                    const pDef = definitions.personnel[p.personnelId];
                    const assignment = state.personnelAssignment[p.uniqueId];
                    if (!pDef || !assignment) return true;
                    
                    let equipmentBonuses = {};
                    if (p.equipment) {
                        for(const slot in p.equipment) {
                            if (p.equipment[slot]) {
                                const item = state.inventory.find(i => i.uniqueId === p.equipment[slot]);
                                if (item) {
                                    const itemDef = definitions.items[item.itemKey];
                                    for(const bonusKey in itemDef.bonuses) {
                                        equipmentBonuses[bonusKey] = (equipmentBonuses[bonusKey] || 0) + itemDef.bonuses[bonusKey];
                                    }
                                    if (item.level > 1 && itemDef.bonusesPerLevel) {
                                        for(const bonusKey in itemDef.bonusesPerLevel) {
                                            equipmentBonuses[bonusKey] = (equipmentBonuses[bonusKey] || 0) + (itemDef.bonusesPerLevel[bonusKey] * (item.level - 1));
                                        }
                                    }
                                }
                            }
                        }
                    }

                    const moodEfficiency = p.mood / 100;
                    const baseAbility = pDef.baseAbilities;
                    const perLevelAbility = pDef.abilitiesPerLevel;
                    let xpGained = 0;
                    switch (pDef.role) {
                        case 'miner':
                            const oreType = assignment.assignment;
                            if (oreType) {
                                let miningSpeed = (baseAbility.miningSpeed + (p.level - 1) * perLevelAbility.miningSpeed);
                                miningSpeed += (equipmentBonuses.miningSpeed || 0); 
                                miningSpeed *= moodEfficiency;
                                
                                const amountGained = miningSpeed * deltaTime;
                                state[oreType] = (state[oreType] || 0) + amountGained;
                                xpGained = amountGained * GAME_CONFIG.PERSONNEL_XP_PER_RESOURCE_TICK;
                                p.sessionStats.mined[oreType] = (p.sessionStats.mined[oreType] || 0) + amountGained;
                            }
                            break;
                        case 'smelter':
                            if (state.smeltingProcess) {
                                let smeltingSpeed = (baseAbility.smeltingSpeed + (p.level - 1) * perLevelAbility.smeltingSpeed);
                                smeltingSpeed += (equipmentBonuses.smeltingSpeed || 0);
                                smeltingSpeed *= moodEfficiency;

                                const progressAdded = smeltingSpeed * deltaTime;
                                state.smeltingProcess.progress += progressAdded;
                                xpGained = progressAdded * GAME_CONFIG.PERSONNEL_XP_PER_SMELT_PROGRESS;
                                p.sessionStats.smeltedProgress = (p.sessionStats.smeltedProgress || 0) + progressAdded;
                            }
                            break;
                        case 'trader':
                            const shelfIndex = parseInt(assignment.assignment.split('_')[1]);
                            if (!isNaN(shelfIndex)) {
                                const shelf = state.shopShelves[shelfIndex];
                                if (shelf && shelf.customer) {
                                    let salesSpeed = (baseAbility.salesSpeedModifier + (p.level - 1) * perLevelAbility.salesSpeedModifier);
                                    salesSpeed += (equipmentBonuses.salesSpeedModifier || 0);
                                    salesSpeed *= moodEfficiency;

                                    const progressAdded = GAME_CONFIG.PROGRESS_PER_SALE_CLICK * salesSpeed * deltaTime;
                                    shelf.saleProgress += progressAdded;
                                    xpGained = progressAdded * GAME_CONFIG.PERSONNEL_XP_PER_SALE_PROGRESS;
                                    const item = state.inventory.find(i => i.uniqueId === shelf.itemId);
                                    if (item) {
                                        const itemDef = definitions.items[item.itemKey];
                                        const baseValue = itemDef.components.reduce((sum, c) => sum + c.progress, 0);
                                        const requiredProgress = (baseValue * item.quality) * GAME_CONFIG.SALE_REQUIRED_PROGRESS_MULTIPLIER;
                                        if (shelf.saleProgress >= Math.max(50, requiredProgress)) {
                                            handleSaleCompletion(state, shelfIndex, showToast);
                                        }
                                    }
                                }
                            }
                            break;
                    }
                    if (xpGained > 0 && p.level < GAME_CONFIG.PERSONNEL_MAX_LEVEL) p.xp += xpGained;
                    return true;
                });
            }
            
            const passiveIncomeModifier = state.passiveIncomeModifier || 1.0;
            const currentRegion = definitions.regions[state.currentRegion];

            if (state.passiveGeneration.ironOre > 0) state.ironOre += state.passiveGeneration.ironOre * passiveIncomeModifier * (currentRegion?.modifiers?.miningSpeed?.ironOre || 1.0) * deltaTime;
            if (state.purchasedSkills.findCopper && state.passiveGeneration.copperOre > 0) state.copperOre += state.passiveGeneration.copperOre * passiveIncomeModifier * (currentRegion?.modifiers?.miningSpeed?.copperOre || 1.0) * deltaTime;
            if (state.passiveGeneration.mithrilOre > 0) state.mithrilOre += state.passiveGeneration.mithrilOre * passiveIncomeModifier * (currentRegion?.modifiers?.miningSpeed?.mithrilOre || 1.0) * deltaTime;
            if (state.passiveGeneration.adamantiteOre > 0) state.adamantiteOre += state.passiveGeneration.adamantiteOre * passiveIncomeModifier * (currentRegion?.modifiers?.miningSpeed?.adamantiteOre || 1.0) * deltaTime;
            if (state.passiveGeneration.sparks > 0) state.sparks += state.passiveGeneration.sparks * passiveIncomeModifier * deltaTime;
            if (state.passiveGeneration.matter > 0) state.matter += state.passiveGeneration.matter * passiveIncomeModifier * deltaTime;
            
            const timeSinceLastWagePayment = (now - state.lastWagePaymentTime) / (1000 * 60);
            if (timeSinceLastWagePayment >= GAME_CONFIG.WAGE_PAYMENT_INTERVAL_MINUTES) {
                let totalWageCostSparks = 0;
                let totalWageCostMatter = 0;

                state.hiredPersonnel.forEach(p => {
                    const moodFactor = p.mood / 100;
                    totalWageCostSparks += (p.wage.sparks || 0) * moodFactor * (1 - (state.personnelWageReduction || 0));
                    totalWageCostMatter += (p.wage.matter || 0) * moodFactor * (1 - (state.personnelWageReduction || 0));
                });

                if (state.sparks >= totalWageCostSparks && state.matter >= totalWageCostMatter) {
                    state.sparks -= totalWageCostSparks;
                    state.matter -= totalWageCostMatter;
                    showToast(`Выплачена зарплата персоналу: -${formatNumber(totalWageCostSparks)} искр, -${formatNumber(totalWageCostMatter)} материи.`, 'info');
                    state.hiredPersonnel.forEach(p => {
                        const stats = p.sessionStats;
                        let report = `${p.name} | Отчет за смену: `;
                        let reported = false;
                        if (stats.salesValue > 0) { report += `Продажи на ${formatNumber(stats.salesValue)} искр. `; reported = true; }
                        if (stats.smeltedProgress > 0) { report += `Прогресс плавки +${formatNumber(stats.smeltedProgress)}. `; reported = true; }
                        const minedOres = Object.keys(stats.mined);
                        if (minedOres.length > 0) {
                            report += "Добыто: " + minedOres.map(ore => `${formatNumber(stats.mined[ore])} ${definitions.resources[ore].name}`).join(', ') + ". ";
                            reported = true;
                        }
                        if (reported) {
                           setTimeout(() => showToast(report, 'faction'), 500); 
                        }

                        p.sessionStats = { mined: {}, smeltedProgress: 0, salesValue: 0, startTime: now };
                        p.mood = Math.min(100, p.mood + 5);
                    });
                } else {
                    showToast("Недостаточно средств для выплаты зарплаты! Эффективность персонала снижена.", "error");
                    state.hiredPersonnel.forEach(p => p.mood = Math.max(0, p.mood - 10));
                }
                state.lastWagePaymentTime = now;
            }

            if (state.activeMissions && state.activeMissions.length > 0) {
                const completedMissionIds = [];
                state.activeMissions.forEach(mission => {
                    if (now >= mission.startTime + mission.duration * 1000) completedMissionIds.push(mission.id);
                });
                completedMissionIds.forEach(missionId => handleCompleteMission(state, missionId, showToast));
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
                    if (Math.random() < (0.005 * state.playerShopSalesSpeedModifier)) {
                        shelf.customer = definitions.clients[Math.floor(Math.random() * definitions.clients.length)];
                        shelf.saleTimer = (15 + Math.random() * 15) * state.timeLimitModifier;
                        showToast(`Новый клиент интересуется товаром на полке #${index + 1}!`, "info");
                    }
                }
            });

            const orderTTL = definitions.gameConfig.orderTTL;
            state.orderQueue = state.orderQueue.filter(order => {
                if (!order.spawnTime) order.spawnTime = now;
                order.timeToLive = Math.max(0, orderTTL - Math.floor((now - order.spawnTime) / 1000));
                if (order.timeToLive <= 0) {
                    showToast(`Заказ от "${order.client.name}" на "${definitions.items[order.itemKey].name}" истек.`, 'error');
                    return false;
                }
                return true;
            });
            
            achievementCheckTimer += deltaTime;
            if (achievementCheckTimer >= 1) {
                achievementCheckTimer = 0;
                Object.values(definitions.achievements).forEach(achievementDef => {
                    const status = achievementDef.check(state, definitions);
                    if (status.isComplete && !state.completedAchievements.includes(achievementDef.id)) {
                        state.completedAchievements.push(achievementDef.id);
                        if (!state.appliedAchievementRewards.includes(achievementDef.id)) {
                            if (achievementDef.apply) achievementDef.apply(state);
                            state.appliedAchievementRewards.push(achievementDef.id);
                            showAchievementRewardModal(achievementDef);
                            recalculateAllModifiers(state);
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
            const now = Date.now();
            const isEventActive = state.market.worldEvent && state.market.worldEvent.endTime > now;
            if (!isEventActive) {
                if (state.market.worldEvent.id !== 'stable') {
                    state.market.worldEvent = { id: 'stable', name: 'Рынок стабилен', message: "Рынок стабилен", effects: {}, endTime: 0 };
                    recalculateAllModifiers(state);
                }
                if (state.market.nextEventIn <= 0) {
                    const eventPool = definitions.worldEvents.filter(event => event.type !== 'faction_conflict' || event.conflictingFactions.some(fid => (state.reputation[fid] || 0) > 0));
                    if (eventPool.length > 0) {
                        const newEvent = eventPool[Math.floor(Math.random() * eventPool.length)];
                        state.market.worldEvent = { ...newEvent, endTime: now + newEvent.duration * 1000 };
                        state.market.nextEventIn = (Math.floor(Math.random() * 180) + 60) / (state.marketTradeSpeedModifier || 1);
                        showToast(`Новости Королевства: ${newEvent.message}`, 'info');
                        recalculateAllModifiers(state);
                    }
                } else {
                    state.market.nextEventIn -= 1;
                }
            }
            if ((now - state.lastPersonnelOfferRollTime) / (1000 * 60) >= GAME_CONFIG.PERSONNEL_OFFER_REFRESH_INTERVAL_MINUTES) {
                state.personnelOffers = [];
                for (let i = 0; i < 3; i++) state.personnelOffers.push(generatePersonnelOffer(state));
                state.lastPersonnelOfferRollTime = now;
                state.personnelRollCount = 0;
                showToast("Новые предложения о найме доступны!", "info");
            }
            return state;
        });
    }, 1000);
}

export function generateNewOrder(state, showToast) {
    if (state.orderQueue.length >= GAME_CONFIG.ORDER_QUEUE_MAX_LENGTH) return state;
    const availableClients = definitions.clients.filter(c => state.masteryLevel >= c.unlockLevel && (!c.unlockSkill || state.purchasedSkills[c.unlockSkill]));
    if (availableClients.length === 0) return state;
    const client = availableClients[Math.floor(Math.random() * availableClients.length)];
    const availableItems = Object.entries(definitions.items).filter(([id, def]) => !def.isQuestRecipe && (!def.requiredSkill || state.purchasedSkills[def.requiredSkill]) && (!def.firstPlaythroughLocked || !state.isFirstPlaythrough));
    if (availableItems.length === 0) return state;
    const [itemId, itemDef] = availableItems[Math.floor(Math.random() * availableItems.length)];
    const baseSparks = itemDef.components.reduce((sum, c) => sum + c.progress, 0) * 10;
    const baseMatter = itemDef.components.length * 5;
    let rewards = { sparks: Math.floor(baseSparks * client.demands.reward * state.sparksModifier), matter: Math.floor(baseMatter * client.demands.reward * state.matterModifier) };
    let factionId = null;
    if (state.purchasedSkills.guildContracts) {
        const potentialFactions = Object.keys(definitions.factions).filter(fid => (state.reputation[fid] || 0) > 0);
        if (potentialFactions.length > 0 && Math.random() < (GAME_CONFIG.FACTION_ORDER_SKILL_BONUS + (state.reputation[potentialFactions[0]] / GAME_CONFIG.FACTION_ORDER_REPUTATION_DIVIDER))) {
            factionId = potentialFactions[Math.floor(Math.random() * potentialFactions.length)];
            rewards.sparks = Math.floor(rewards.sparks * 1.2);
            rewards.matter = Math.floor(rewards.matter * 1.2);
        }
    }
    state.orderQueue.push({
        id: `order_${Date.now()}_${Math.random()}`,
        itemKey: itemId,
        client: { id: client.id, name: client.name, faceImg: client.faceImg, demands: client.demands },
        rewards,
        componentProgress: {},
        activeComponentId: null,
        qualityPoints: 0,
        qualityHits: 0,
        spawnTime: Date.now(),
        timeToLive: GAME_CONFIG.orderTTL,
        isRisky: client.isRisky && (Math.random() < GAME_CONFIG.RISKY_ORDER_BASE_CHANCE || (state.isShopLocked && Math.random() < GAME_CONFIG.RISKY_ORDER_LOCKED_SHOP_CHANCE)),
        isCollector: client.isCollector || false,
        factionId,
    });
    showToast(`Новый заказ от "${client.name}" на "${itemDef.name}"!`, "info");
    audioController.play('cash', 'C4', '16n');
    return state;
}

export function startOrderGenerationLoop(updateState, generateNewOrderHandler, checkForNewQuestsHandler, showToast) {
    if (orderGenerationTimeout) clearTimeout(orderGenerationTimeout);
    let isRunning = false;
    const loop = () => {
        if(isRunning) return;
        isRunning = true;
        updateState(state => {
            const newState = generateNewOrderHandler(state, showToast);
            checkForNewQuestsHandler(newState, showToast);
            return newState;
        });
        isRunning = false;
        const randomDelay = 20000 + Math.random() * 15000;
        orderGenerationTimeout = setTimeout(loop, randomDelay);
    };
    loop();
}